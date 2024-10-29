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

/**
 * placeholder of delimiter
 */
export const UNKNOWN_DELIMITER = '?';

export type Dict<T = unknown> = Record<string, T | undefined>;

export type NodeRange = [number, number];

type ClassNameNodeBase = {
  range: NodeRange;
  startLineIndex: number;
};

type UnknownNode = ClassNameNodeBase & {
  type: 'unknown';
  delimiterType: 'single-quote' | 'double-quote' | 'backtick';
  hasSingleQuote?: boolean;
  hasDoubleQuote?: boolean;
  hasBacktick?: boolean;
};

type AttributeNode = ClassNameNodeBase & {
  type: 'attribute';
  /**
   * @deprecated
   */
  isTheFirstLineOnTheSameLineAsTheOpeningTag: boolean;
  /**
   * @deprecated
   */
  elementName: string;
};

export type ExpressionNode = ClassNameNodeBase & {
  type: 'expression';
  delimiterType: 'single-quote' | 'double-quote' | 'backtick';
  isTheFirstLineOnTheSameLineAsTheAttributeName: boolean;
  isItAnObjectProperty: boolean;
  isItAnOperandOfTernaryOperator: boolean;
  /**
   * @deprecated
   */
  isItFunctionArgument: boolean;
  isItInVueTemplate: boolean;
  isItAngularExpression: boolean;
  hasSingleQuote: boolean;
  hasDoubleQuote: boolean;
  hasBacktick: boolean;
  shouldKeepDelimiter: boolean;
};

/**
 * In fact, the ternary operator itself is not a class name node, but it defines a type as an exception because it needs to be frozen when processing complex expressions.
 */
export type TernaryExpressionNode = ClassNameNodeBase & {
  type: 'ternary';
};

export type ClassNameNode = UnknownNode | AttributeNode | ExpressionNode | TernaryExpressionNode;
