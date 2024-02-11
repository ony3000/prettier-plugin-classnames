import {
  findTargetClassNameNodes,
  findTargetClassNameNodesForVue,
  findTargetClassNameNodesForAstro,
} from './finder';
import type { Dict, ClassNameNode, NarrowedParserOptions } from './shared';
import { ClassNameType } from './shared';

const EOL = '\n';

/**
 * placeholder
 */
const PH = '_';

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
      ClassNameType.TLSL,
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
  // prettier-ignore
  const baseQuote =
    // eslint-disable-next-line no-nested-ternary
    type === ClassNameType.TLPQ
      ? '`'
      : (
        parser === 'vue' &&
        [
          ClassNameType.FA,
          ClassNameType.SLSL,
          ClassNameType.CTL,
          ClassNameType.TLSL,
          ClassNameType.TLOP,
          ClassNameType.TLTO,
        ].includes(type)
          ? "'"
          : '"'
      );

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

function replaceSpacesAtBothEnds(className: string): [string, string, string] {
  const matchArray = className.match(/^(\s*)[^\s](?:.*[^\s])?(\s*)$/);
  const leadingSpace = matchArray?.[1] ?? '';
  const trailingSpace = matchArray?.[2] ?? '';

  const replacedClassName = `${PH.repeat(leadingSpace.length)}${className.slice(
    leadingSpace.length,
    -trailingSpace.length || undefined,
  )}${PH.repeat(trailingSpace.length)}`;

  return [leadingSpace, replacedClassName, trailingSpace];
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

      const isStartingPositionRelative = options.endingPosition !== 'absolute';
      const isEndingPositionAbsolute = options.endingPosition !== 'relative';
      const isOutputIdeal = isStartingPositionRelative && isEndingPositionAbsolute;

      const { indentLevel: baseIndentLevel } = lineNodes[startLineIndex];
      const extraIndentLevel = getExtraIndentLevel(type);
      const multiLineIndentLevel = isStartingPositionRelative
        ? baseIndentLevel + extraIndentLevel
        : 0;

      const classNameBase = formattedPrevText.slice(rangeStart + 1, rangeEnd - 1);

      // preprocess (first)
      const [leadingSpace, classNameWithoutSpacesAtBothEnds, trailingSpace] =
        replaceSpacesAtBothEnds(classNameBase);

      const totalTextLengthUptoPrevLine = formattedPrevText
        .split(EOL)
        .slice(0, startLineIndex)
        .reduce((textLength, line) => textLength + line.length + EOL.length, 0);
      const firstLinePadLength = rangeStart + 1 - totalTextLengthUptoPrevLine;

      // preprocess (first+1)
      const classNameWithFirstLinePadding = `${PH.repeat(
        isEndingPositionAbsolute ? firstLinePadLength : 0,
      )}${classNameWithoutSpacesAtBothEnds}`;

      const formattedClassName = ((cn: string) => {
        const formatted = format(cn, {
          ...options,
          parser: 'html',
          plugins: [],
          rangeStart: 0,
          rangeEnd: Infinity,
          endOfLine: 'lf',
        }).trimEnd();

        if (!isOutputIdeal) {
          return formatted;
        }

        const [firstLine, ...rest] = formatted.split(EOL);

        if (rest.length === 0) {
          return firstLine;
        }

        const multiLinePadLength =
          (indentUnit === '\t' ? 4 : indentUnit.length) * multiLineIndentLevel;

        const formattedRest = format(rest.join(EOL), {
          ...options,
          parser: 'html',
          plugins: [],
          rangeStart: 0,
          rangeEnd: Infinity,
          endOfLine: 'lf',
          printWidth: options.printWidth - multiLinePadLength,
        }).trimEnd();

        return `${firstLine}${EOL}${formattedRest}`;
      })(classNameWithFirstLinePadding);

      // postprocess (last-1)
      const classNameWithoutPadding = formattedClassName.slice(
        isEndingPositionAbsolute ? firstLinePadLength : 0,
      );

      // postprocess (last)
      const classNameWithOriginalSpaces = `${leadingSpace}${classNameWithoutPadding.slice(
        leadingSpace.length,
        -trailingSpace.length || undefined,
      )}${trailingSpace}`;

      const isMultiLineClassName = classNameWithOriginalSpaces.split(EOL).length > 1;
      const [quoteStart, quoteEnd] = getSomeKindOfQuotes(
        type,
        isMultiLineClassName,
        options.parser,
      );
      const substitute = `${quoteStart}${classNameWithOriginalSpaces}${quoteEnd}`
        .split(EOL)
        .join(`${EOL}${indentUnit.repeat(multiLineIndentLevel)}`);
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
  switch (options.parser) {
    case 'astro': {
      targetClassNameNodes = findTargetClassNameNodesForAstro(ast, options, addon);
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

      const isStartingPositionRelative = options.endingPosition !== 'absolute';
      const isEndingPositionAbsolute = options.endingPosition !== 'relative';
      const isOutputIdeal = isStartingPositionRelative && isEndingPositionAbsolute;

      const { indentLevel: baseIndentLevel } = lineNodes[startLineIndex];
      const extraIndentLevel = getExtraIndentLevel(type);
      const multiLineIndentLevel = isStartingPositionRelative
        ? baseIndentLevel + extraIndentLevel
        : 0;

      const classNameBase = formattedPrevText.slice(rangeStart + 1, rangeEnd - 1);

      // preprocess (first)
      const [leadingSpace, classNameWithoutSpacesAtBothEnds, trailingSpace] =
        replaceSpacesAtBothEnds(classNameBase);

      const totalTextLengthUptoPrevLine = formattedPrevText
        .split(EOL)
        .slice(0, startLineIndex)
        .reduce((textLength, line) => textLength + line.length + EOL.length, 0);
      const firstLinePadLength = rangeStart + 1 - totalTextLengthUptoPrevLine;

      // preprocess (first+1)
      const classNameWithFirstLinePadding = `${PH.repeat(
        isEndingPositionAbsolute ? firstLinePadLength : 0,
      )}${classNameWithoutSpacesAtBothEnds}`;

      const formattedClassName = await (async (cn: string) => {
        const formatted = (
          await format(cn, {
            ...options,
            parser: 'html',
            plugins: [],
            rangeStart: 0,
            rangeEnd: Infinity,
            endOfLine: 'lf',
          })
        ).trimEnd();

        if (!isOutputIdeal) {
          return formatted;
        }

        const [firstLine, ...rest] = formatted.split(EOL);

        if (rest.length === 0) {
          return firstLine;
        }

        const multiLinePadLength =
          (indentUnit === '\t' ? 4 : indentUnit.length) * multiLineIndentLevel;

        const formattedRest = (
          await format(rest.join(EOL), {
            ...options,
            parser: 'html',
            plugins: [],
            rangeStart: 0,
            rangeEnd: Infinity,
            endOfLine: 'lf',
            printWidth: options.printWidth - multiLinePadLength,
          })
        ).trimEnd();

        return `${firstLine}${EOL}${formattedRest}`;
      })(classNameWithFirstLinePadding);

      // postprocess (last-1)
      const classNameWithoutPadding = formattedClassName.slice(
        isEndingPositionAbsolute ? firstLinePadLength : 0,
      );

      // postprocess (last)
      const classNameWithOriginalSpaces = `${leadingSpace}${classNameWithoutPadding.slice(
        leadingSpace.length,
        -trailingSpace.length || undefined,
      )}${trailingSpace}`;

      const isMultiLineClassName = classNameWithOriginalSpaces.split(EOL).length > 1;
      const [quoteStart, quoteEnd] = getSomeKindOfQuotes(
        type,
        isMultiLineClassName,
        options.parser,
      );
      const substitute = `${quoteStart}${classNameWithOriginalSpaces}${quoteEnd}`
        .split(EOL)
        .join(`${EOL}${indentUnit.repeat(multiLineIndentLevel)}`);
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
  switch (options.parser) {
    case 'astro': {
      targetClassNameNodes = findTargetClassNameNodesForAstro(ast, options, addon);
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
