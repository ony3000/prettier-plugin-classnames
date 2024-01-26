import { findTargetClassNameNodes, findTargetClassNameNodesForVue } from './finder';
import type { Dict, ClassNameNode, NarrowedParserOptions } from './shared';
import { ClassNameType } from './shared';

const EOL = '\n';

type LineNode = {
  indentLevel: number;
};

function parseLineByLine(formattedText: string, indentUnit: string): LineNode[] {
  const formattedLines = formattedText.split(EOL);

  return formattedLines.map((line) => {
    const indentMatchResult = line.match(new RegExp(`^(${indentUnit})*`));
    const indentLevel = indentMatchResult![0].length / indentUnit.length;

    return {
      indentLevel,
    };
  });
}

function replaceClassName(
  formattedText: string,
  indentUnit: string,
  targetClassNameNodes: ClassNameNode[],
  lineNodes: LineNode[],
  options: NarrowedParserOptions,
  format: (source: string, options?: any) => string,
): string {
  const mutableFormattedText = targetClassNameNodes.reduce(
    (formattedPrevText, { type, range: [rangeStart, rangeEnd], startLineIndex }) => {
      const { indentLevel } = lineNodes[startLineIndex];
      const enclosedClassName = formattedPrevText.slice(rangeStart + 1, rangeEnd - 1);
      const formattedClassName = format(enclosedClassName, {
        ...options,
        parser: 'html',
        plugins: [],
        rangeStart: 0,
        rangeEnd: Infinity,
        endOfLine: 'lf',
      }).trimEnd();

      if (formattedClassName === enclosedClassName) {
        return formattedPrevText;
      }

      let extraIndentLevel = 0;

      if (type === ClassNameType.ASL) {
        extraIndentLevel = 2;
      } else if (
        [
          ClassNameType.AOL,
          ClassNameType.SLSL,
          ClassNameType.SLTO,
          ClassNameType.CTL,
          ClassNameType.TLTO,
        ].includes(type)
      ) {
        extraIndentLevel = 1;
      }

      const quoteStart = `${type === ClassNameType.SLOP ? '[' : ''}${
        type === ClassNameType.ASL || type === ClassNameType.AOL ? '"' : '`'
      }`;
      const quoteEnd = `${type === ClassNameType.ASL || type === ClassNameType.AOL ? '"' : '`'}${
        type === ClassNameType.SLOP ? ']' : ''
      }`;
      const substitute = `${quoteStart}${formattedClassName}${quoteEnd}`
        .split(EOL)
        .join(`${EOL}${indentUnit.repeat(indentLevel + extraIndentLevel)}`);

      return `${formattedPrevText.slice(0, rangeStart)}${substitute}${formattedPrevText.slice(
        rangeEnd,
      )}`;
    },
    formattedText,
  );

  return mutableFormattedText;
}

export function parseLineByLineAndReplace(
  formattedText: string,
  ast: any,
  options: NarrowedParserOptions,
  format: (source: string, options?: any) => string,
  addon: Dict<(text: string, options: any) => any>,
): string {
  if (formattedText === '') {
    return formattedText;
  }

  const indentUnit = options.useTabs ? '\t' : ' '.repeat(options.tabWidth);

  let targetClassNameNodes: ClassNameNode[] = [];
  if (options.parser === 'vue') {
    targetClassNameNodes = findTargetClassNameNodesForVue(ast, options, addon);
  } else {
    targetClassNameNodes = findTargetClassNameNodes(ast, options);
  }

  const lineNodes = parseLineByLine(formattedText, indentUnit);

  return replaceClassName(
    formattedText,
    indentUnit,
    targetClassNameNodes,
    lineNodes,
    options,
    format,
  );
}

async function replaceClassNameAsync(
  formattedText: string,
  indentUnit: string,
  targetClassNameNodes: ClassNameNode[],
  lineNodes: LineNode[],
  options: NarrowedParserOptions,
  format: (source: string, options?: any) => Promise<string>,
): Promise<string> {
  const mutableFormattedText = await targetClassNameNodes.reduce(
    async (formattedPrevTextPromise, { type, range: [rangeStart, rangeEnd], startLineIndex }) => {
      const formattedPrevText = await formattedPrevTextPromise;

      const { indentLevel } = lineNodes[startLineIndex];
      const enclosedClassName = formattedPrevText.slice(rangeStart + 1, rangeEnd - 1);
      const formattedClassName = (
        await format(enclosedClassName, {
          ...options,
          parser: 'html',
          plugins: [],
          rangeStart: 0,
          rangeEnd: Infinity,
          endOfLine: 'lf',
        })
      ).trimEnd();

      if (formattedClassName === enclosedClassName) {
        return formattedPrevTextPromise;
      }

      let extraIndentLevel = 0;

      if (type === ClassNameType.ASL) {
        extraIndentLevel = 2;
      } else if (
        [
          ClassNameType.AOL,
          ClassNameType.SLSL,
          ClassNameType.SLTO,
          ClassNameType.CTL,
          ClassNameType.TLTO,
        ].includes(type)
      ) {
        extraIndentLevel = 1;
      }

      const quoteStart = `${type === ClassNameType.SLOP ? '[' : ''}${
        type === ClassNameType.ASL || type === ClassNameType.AOL ? '"' : '`'
      }`;
      const quoteEnd = `${type === ClassNameType.ASL || type === ClassNameType.AOL ? '"' : '`'}${
        type === ClassNameType.SLOP ? ']' : ''
      }`;
      const substitute = `${quoteStart}${formattedClassName}${quoteEnd}`
        .split(EOL)
        .join(`${EOL}${indentUnit.repeat(indentLevel + extraIndentLevel)}`);

      return `${formattedPrevText.slice(0, rangeStart)}${substitute}${formattedPrevText.slice(
        rangeEnd,
      )}`;
    },
    Promise.resolve(formattedText),
  );

  return mutableFormattedText;
}

export async function parseLineByLineAndReplaceAsync(
  formattedText: string,
  ast: any,
  options: NarrowedParserOptions,
  format: (source: string, options?: any) => Promise<string>,
  addon: Dict<(text: string, options: any) => any>,
): Promise<string> {
  if (formattedText === '') {
    return formattedText;
  }

  const indentUnit = options.useTabs ? '\t' : ' '.repeat(options.tabWidth);

  let targetClassNameNodes: ClassNameNode[] = [];
  if (options.parser === 'vue') {
    targetClassNameNodes = findTargetClassNameNodesForVue(ast, options, addon);
  } else {
    targetClassNameNodes = findTargetClassNameNodes(ast, options);
  }

  const lineNodes = parseLineByLine(formattedText, indentUnit);

  return replaceClassNameAsync(
    formattedText,
    indentUnit,
    targetClassNameNodes,
    lineNodes,
    options,
    format,
  );
}
