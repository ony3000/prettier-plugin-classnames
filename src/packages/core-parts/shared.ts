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
 * size of tab character as space
 */
export const TAB_SIZE = 4;

export enum ClassNameType {
  /**
   * Attributes on the same line as the opening tag and enclosed in quotes
   */
  ASL,
  /**
   * Attributes on their own line and enclosed in quotes
   */
  AOL,
  /**
   * String literal or template literal passed as function argument
   */
  FA,
  /**
   * Common string literal
   */
  CSL,
  /**
   * String literal starting on the same line as the attribute
   */
  SLSL,
  /**
   * String literal as object property
   */
  SLOP,
  /**
   * String literal in ternary operator
   */
  SLTO,
  /**
   * Common template literal
   */
  CTL,
  /**
   * Template literal starting on the same line as the attribute
   */
  TLSL,
  /**
   * Template literal as object property
   */
  TLOP,
  /**
   * Template literal in ternary operator
   */
  TLTO,
  /**
   * Template literal that preserve quotes
   */
  TLPQ,
  /**
   * Template literal that preserve quotes (in ternary operator)
   */
  TLPQTO,
  /**
   * Unknown string literal
   */
  USL,
  /**
   * Unknown template literal
   */
  UTL,
}

export type Dict<T = unknown> = Record<string, T | undefined>;

export type NodeRange = [number, number];

export type ClassNameNode = {
  type: ClassNameType;
  range: NodeRange;
  startLineIndex: number;
};

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
