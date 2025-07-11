import type { SupportOptions } from 'prettier';

export const options: SupportOptions = {
  customAttributes: {
    // @ts-ignore
    since: '0.1.0',
    type: 'string',
    array: true,
    category: 'Format',
    default: [{ value: [] }],
    description:
      'List of attributes that enclosing class names. The `class` and `className` attributes are always supported, even if no options are specified.',
  },
  customFunctions: {
    // @ts-ignore
    since: '0.1.0',
    type: 'string',
    array: true,
    category: 'Format',
    default: [{ value: [] }],
    description:
      'List of functions that enclosing class names. The `classNames` function is always supported, even if no options are specified.',
  },
  endingPosition: {
    // @ts-ignore
    since: '0.5.0',
    type: 'choice',
    category: 'Format',
    default: 'absolute',
    description:
      'This is the criterion for ending the class name on each line when replacing the original class name with a multi-line class name.',
    choices: [
      {
        value: 'absolute',
        description: 'Each line ends at a `printWidth` distance from the start of the line.',
      },
      {
        value: 'relative',
        description: 'Each line ends at a `printWidth` distance from the start of the class name.',
      },
    ],
  },
  syntaxTransformation: {
    // @ts-ignore
    since: '0.7.7',
    type: 'boolean',
    category: 'Format',
    default: false,
    description:
      'If a line wrapping occurs in a class name written in non-expression syntax, it is transformed into expression syntax. This transformation does not support reversible formatting.',
  },
};
