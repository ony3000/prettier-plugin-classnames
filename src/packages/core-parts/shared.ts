/**
 * end of line
 */
export const EOL = '\n';

/**
 * placeholder
 */
export const PH = '_';

/**
 * single space character
 */
export const SPACE = ' ';

/**
 * single tab character
 */
export const TAB = '\t';

/**
 * single quote character
 */
export const SINGLE_QUOTE = "'";

/**
 * double quote character
 */
export const DOUBLE_QUOTE = '"';

/**
 * backtick character
 */
export const BACKTICK = '`';

export type Dict<T = unknown> = Record<string, T | undefined>;

export type NodeRange = [number, number];

type ClassNameNodeBase = {
  range: NodeRange;
  startLineIndex: number;
};

type UnknownNode = ClassNameNodeBase & {
  type: 'unknown';
  delimiterType: 'single-quote' | 'double-quote' | 'backtick';
};

type AttributeNode = ClassNameNodeBase & {
  type: 'attribute';
  isTheFirstLineOnTheSameLineAsTheOpeningTag: boolean;
  elementName: string;
};

export type ExpressionNode = ClassNameNodeBase & {
  type: 'expression';
  delimiterType: 'single-quote' | 'double-quote' | 'backtick';
  isTheFirstLineOnTheSameLineAsTheAttributeName: boolean;
  isItAnObjectProperty: boolean;
  isItAnOperandOfTernaryOperator: boolean;
  isItFunctionArgument: boolean;
  shouldKeepDelimiter: boolean;
};

export type ClassNameNode = UnknownNode | AttributeNode | ExpressionNode;

export type NarrowedParserOptions = {
  printWidth: number;
  tabWidth: number;
  useTabs: boolean;
  singleQuote: boolean;
  parser: string;
  customAttributes: string[];
  customFunctions: string[];
  endingPosition: 'relative' | 'absolute' | 'absolute-with-indent';
};
