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

function getExtraIndentLevel(type: ClassNameType) {
  if (type === ClassNameType.ASL) {
    return 2;
  }

  if (
    [
      ClassNameType.AOL,
      ClassNameType.SLSL,
      ClassNameType.SLTO,
      ClassNameType.CTL,
      ClassNameType.TLTO,
    ].includes(type)
  ) {
    return 1;
  }

  return 0;
}

function getSomeKindOfQuotes(
  type: ClassNameType,
  isMultiLineClassName: boolean,
  parser: string,
): [string, string] {
  const baseQuote =
    parser === 'vue' &&
    [
      ClassNameType.FA,
      ClassNameType.SLSL,
      ClassNameType.CTL,
      ClassNameType.TLOP,
      ClassNameType.TLTO,
    ].includes(type)
      ? "'"
      : '"';

  const opener = `${isMultiLineClassName && type === ClassNameType.SLOP ? '[' : ''}${
    !isMultiLineClassName || type === ClassNameType.ASL || type === ClassNameType.AOL
      ? baseQuote
      : '`'
  }`;
  const closer = `${
    !isMultiLineClassName || type === ClassNameType.ASL || type === ClassNameType.AOL
      ? baseQuote
      : '`'
  }${isMultiLineClassName && type === ClassNameType.SLOP ? ']' : ''}`;

  return [opener, closer];
}

function replaceClassName({
  formattedText,
  indentUnit,
  targetClassNameNodes,
  lineNodes,
  options,
  format,
  targetClassNameTypes,
}: {
  formattedText: string;
  indentUnit: string;
  targetClassNameNodes: ClassNameNode[];
  lineNodes: LineNode[];
  options: NarrowedParserOptions;
  format: (source: string, options?: any) => string;
  targetClassNameTypes?: ClassNameType[];
}): string {
  const mutableFormattedText = targetClassNameNodes.reduce(
    (formattedPrevText, { type, range: [rangeStart, rangeEnd], startLineIndex }) => {
      if (targetClassNameTypes && !targetClassNameTypes.includes(type)) {
        return formattedPrevText;
      }

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
      const isMultiLineClassName = formattedClassName.split(EOL).length > 1;

      const extraIndentLevel = getExtraIndentLevel(type);
      const [quoteStart, quoteEnd] = getSomeKindOfQuotes(
        type,
        isMultiLineClassName,
        options.parser,
      );

      const substitute = `${quoteStart}${formattedClassName}${quoteEnd}`
        .split(EOL)
        .join(`${EOL}${indentUnit.repeat(indentLevel + extraIndentLevel)}`);
      const sliceOffset = !isMultiLineClassName && type === ClassNameType.TLOP ? 1 : 0;

      return `${formattedPrevText.slice(
        0,
        rangeStart - sliceOffset,
      )}${substitute}${formattedPrevText.slice(rangeEnd + sliceOffset)}`;
    },
    formattedText,
  );

  return mutableFormattedText;
}

export function parseLineByLineAndReplace({
  formattedText,
  ast,
  options,
  format,
  addon,
  targetClassNameTypes,
}: {
  formattedText: string;
  ast: any;
  options: NarrowedParserOptions;
  format: (source: string, options?: any) => string;
  addon: Dict<(text: string, options: any) => any>;
  targetClassNameTypes?: ClassNameType[];
}): string {
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

  return replaceClassName({
    formattedText,
    indentUnit,
    targetClassNameNodes,
    lineNodes,
    options,
    format,
    targetClassNameTypes,
  });
}

async function replaceClassNameAsync({
  formattedText,
  indentUnit,
  targetClassNameNodes,
  lineNodes,
  options,
  format,
  targetClassNameTypes,
}: {
  formattedText: string;
  indentUnit: string;
  targetClassNameNodes: ClassNameNode[];
  lineNodes: LineNode[];
  options: NarrowedParserOptions;
  format: (source: string, options?: any) => Promise<string>;
  targetClassNameTypes?: ClassNameType[];
}): Promise<string> {
  const mutableFormattedText = await targetClassNameNodes.reduce(
    async (formattedPrevTextPromise, { type, range: [rangeStart, rangeEnd], startLineIndex }) => {
      if (targetClassNameTypes && !targetClassNameTypes.includes(type)) {
        return formattedPrevTextPromise;
      }

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
      const isMultiLineClassName = formattedClassName.split(EOL).length > 1;

      const extraIndentLevel = getExtraIndentLevel(type);
      const [quoteStart, quoteEnd] = getSomeKindOfQuotes(
        type,
        isMultiLineClassName,
        options.parser,
      );

      const substitute = `${quoteStart}${formattedClassName}${quoteEnd}`
        .split(EOL)
        .join(`${EOL}${indentUnit.repeat(indentLevel + extraIndentLevel)}`);
      const sliceOffset = !isMultiLineClassName && type === ClassNameType.TLOP ? 1 : 0;

      return `${formattedPrevText.slice(
        0,
        rangeStart - sliceOffset,
      )}${substitute}${formattedPrevText.slice(rangeEnd + sliceOffset)}`;
    },
    Promise.resolve(formattedText),
  );

  return mutableFormattedText;
}

export async function parseLineByLineAndReplaceAsync({
  formattedText,
  ast,
  options,
  format,
  addon,
  targetClassNameTypes,
}: {
  formattedText: string;
  ast: any;
  options: NarrowedParserOptions;
  format: (source: string, options?: any) => Promise<string>;
  addon: Dict<(text: string, options: any) => any>;
  targetClassNameTypes?: ClassNameType[];
}): Promise<string> {
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

  return replaceClassNameAsync({
    formattedText,
    indentUnit,
    targetClassNameNodes,
    lineNodes,
    options,
    format,
    targetClassNameTypes,
  });
}
