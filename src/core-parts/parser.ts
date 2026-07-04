import type { AST, Parser } from 'prettier';
import { z } from 'zod';

import { EOL, isTypeof } from './utils';

function base64Decode(input: string): string {
  return Buffer.from(input, 'base64').toString('utf8');
}

function refineSvelteAst(preprocessedText: string, ast: AST) {
  const svelteAst = ast as AST & {
    module?: unknown;
    instance?: unknown;
  };
  const scriptInfos = [
    { key: 'module' as const, node: svelteAst.module },
    { key: 'instance' as const, node: svelteAst.instance },
  ]
    .filter(
      (
        info,
      ): info is {
        key: 'module' | 'instance';
        node: { start: number; end: number; content?: { body?: unknown[] } };
      } =>
        isTypeof(
          info.node,
          z.object({
            start: z.number(),
            end: z.number(),
          }),
        ),
    )
    .map(({ key, node }) => ({
      key,
      node,
      originalStart: node.start,
      originalEnd: node.end,
    }))
    .sort((a, b) => a.originalStart - b.originalStart);

  if (scriptInfos.length === 0) {
    return ast;
  }

  function shiftNode(node: unknown, thresholdEnd: number, textOffset: number, lineOffset: number): void {
    if (!isTypeof(node, z.object({ type: z.string() }))) {
      return;
    }

    Object.entries(node).forEach(([key, value]) => {
      if (key === 'type') {
        return;
      }

      if (Array.isArray(value)) {
        value.forEach((childNode: unknown) => {
          shiftNode(childNode, thresholdEnd, textOffset, lineOffset);
        });
        return;
      }

      shiftNode(value, thresholdEnd, textOffset, lineOffset);
    });

    if (
      !isTypeof(
        node,
        z.object({
          start: z.number(),
          end: z.number(),
        }),
      )
    ) {
      return;
    }

    if (thresholdEnd <= node.start) {
      node.start += textOffset;

      if (
        isTypeof(
          node,
          z.object({
            loc: z.object({
              start: z.object({
                line: z.number(),
              }),
            }),
          }),
        )
      ) {
        node.loc.start = {
          ...node.loc.start,
          line: node.loc.start.line + lineOffset,
        };
      }
    }
    if (thresholdEnd <= node.end) {
      node.end += textOffset;

      if (
        isTypeof(
          node,
          z.object({
            loc: z.object({
              end: z.object({
                line: z.number(),
              }),
            }),
          }),
        )
      ) {
        node.loc.end = {
          ...node.loc.end,
          line: node.loc.end.line + lineOffset,
        };
      }
    }
  }

  let cumulativeTextOffset = 0;
  let cumulativeLineOffset = 0;

  scriptInfos.forEach(({ key, node, originalStart, originalEnd }, scriptIndex) => {
    const scriptTag = preprocessedText.slice(originalStart, originalEnd);
    const matchResult = scriptTag.match(/ ✂prettier:content✂="([^"]*)"/);

    if (matchResult === null) {
      return;
    }

    const [temporaryAttributeWithLeadingSpace, encodedContent] = matchResult;
    const plainContent = base64Decode(encodedContent);

    const restoreTextOffset =
      plainContent.length - (temporaryAttributeWithLeadingSpace.length + '{}'.length);
    const restoreLineOffset = plainContent.split(EOL).length - 1;
    const currentStart = originalStart + cumulativeTextOffset;
    const currentEnd = originalEnd + cumulativeTextOffset;
    const currentStartLine =
      preprocessedText.slice(0, originalStart).split(EOL).length + cumulativeLineOffset;
    const firstBodyNode = node.content?.body?.at(0);
    const contentStartLine = isTypeof(
      firstBodyNode,
      z.object({
        loc: z.object({
          start: z.object({
            line: z.number(),
          }),
        }),
      }),
    )
      ? firstBodyNode.loc.start.line + cumulativeLineOffset
      : currentStartLine + 1;

    shiftNode(svelteAst.html, currentEnd, restoreTextOffset, restoreLineOffset);
    shiftNode(svelteAst.fragment, currentEnd, restoreTextOffset, restoreLineOffset);

    scriptInfos.slice(scriptIndex + 1).forEach(({ key: nextKey }) => {
      shiftNode(svelteAst[nextKey], currentEnd, restoreTextOffset, restoreLineOffset);
    });

    svelteAst[key] = {
      type: 'RefinedScript',
      start: currentStart,
      end: currentEnd + restoreTextOffset,
      loc: {
        start: {
          line: currentStartLine,
        },
      },
      content: {
        type: 'RefinedScriptSource',
        start: currentEnd + restoreTextOffset - ('</script>'.length + plainContent.length),
        end: currentEnd + restoreTextOffset - '</script>'.length,
        loc: {
          start: {
            line: contentStartLine,
          },
        },
        value: plainContent,
      },
    };

    cumulativeTextOffset += restoreTextOffset;
    cumulativeLineOffset += restoreLineOffset;
  });

  return ast;
}

export async function advancedParse(
  text: string,
  parserName: SupportedParserNames,
  defaultParser: Parser,
  options: ResolvedOptions,
): Promise<AST> {
  const preprocessedText = await (defaultParser.preprocess
    ? defaultParser.preprocess(text, options)
    : text);
  let ast = await defaultParser.parse(preprocessedText, options);

  if (parserName === 'svelte') {
    ast = refineSvelteAst(preprocessedText, ast);
  }

  return ast;
}
