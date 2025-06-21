import type { AST } from 'prettier';
import { z } from 'zod';

import { parseAndAssemble } from './experimental';
import {
  findTargetClassNameNodes,
  findTargetClassNameNodesForHtml,
  findTargetClassNameNodesForVue,
  findTargetClassNameNodesForAngular,
  findTargetClassNameNodesForAstro,
  findTargetClassNameNodesForSvelte,
} from './finder';
import type { Dict, ClassNameNode } from './shared';
import { EOL, SPACE, TAB, isTypeof } from './shared';

function base64Decode(input: string): string {
  return Buffer.from(input, 'base64').toString('utf8');
}

export async function parseLineByLineAndReplaceAsync({
  formattedText,
  ast,
  options,
  addon,
}: {
  formattedText: string;
  ast: AST;
  options: ResolvedOptions;
  // biome-ignore lint/suspicious/noExplicitAny: The addon will be removed.
  addon: Dict<(text: string, options: any) => AST>;
}): Promise<string> {
  if (formattedText === '') {
    return formattedText;
  }

  const indentUnit = options.useTabs ? TAB : SPACE.repeat(options.tabWidth);

  let targetClassNameNodes: ClassNameNode[] = [];
  switch (options.parser) {
    case 'astro': {
      targetClassNameNodes = findTargetClassNameNodesForAstro(formattedText, ast, options, addon);
      break;
    }
    case 'svelte': {
      targetClassNameNodes = findTargetClassNameNodesForSvelte(formattedText, ast, options, addon);
      break;
    }
    case 'angular': {
      targetClassNameNodes = findTargetClassNameNodesForAngular(ast, options, addon);
      break;
    }
    case 'html': {
      targetClassNameNodes = findTargetClassNameNodesForHtml(ast, options, addon);
      break;
    }
    case 'vue': {
      targetClassNameNodes = findTargetClassNameNodesForVue(ast, options, addon);
      break;
    }
    default: {
      targetClassNameNodes = findTargetClassNameNodes(ast, options);
      break;
    }
  }

  return parseAndAssemble(formattedText, indentUnit, targetClassNameNodes, options);
}

export function refineSvelteAst(preprocessedText: string, ast: AST) {
  if (!ast.instance) {
    return ast;
  }

  const scriptTag = preprocessedText.slice(ast.instance.start, ast.instance.end);
  const matchResult = scriptTag.match(/ ✂prettier:content✂="([^"]+)"/);

  if (matchResult === null) {
    return ast;
  }

  const [temporaryAttributeWithLeadingSpace, encodedContent] = matchResult;
  const plainContent = base64Decode(encodedContent);

  const restoreOffset =
    plainContent.length - (temporaryAttributeWithLeadingSpace.length + '{}'.length);

  function recursion(node: unknown): void {
    if (!isTypeof(node, z.object({ type: z.string() }))) {
      return;
    }

    Object.entries(node).forEach(([key, value]) => {
      if (key === 'type') {
        return;
      }

      if (Array.isArray(value)) {
        value.forEach((childNode: unknown) => {
          recursion(childNode);
        });
        return;
      }

      recursion(value);
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

    if (ast.instance.end <= node.start) {
      node.start += restoreOffset;
    }
    if (ast.instance.end <= node.end) {
      node.end += restoreOffset;
    }
  }

  recursion(ast.html);

  ast.instance = {
    type: 'RefinedScript',
    start: ast.instance.start,
    end: ast.instance.end + restoreOffset,
    loc: {
      start: {
        line: preprocessedText.slice(0, ast.instance.start).split(EOL).length,
      },
    },
    content: {
      type: 'RefinedScriptSource',
      start: ast.instance.end + restoreOffset - ('</script>'.length + plainContent.length),
      end: ast.instance.end + restoreOffset - '</script>'.length,
      loc: {
        start: {
          line: ast.instance.content.body[0].loc.start.line,
        },
      },
      value: plainContent,
    },
  };

  return ast;
}
