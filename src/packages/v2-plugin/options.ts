import type { SupportOptions } from 'prettier';

export const options: SupportOptions = {
  customAttributes: {
    since: '0.1.0',
    type: 'string',
    array: true,
    category: 'Format',
    default: [{ value: [] }],
    description:
      'List of attributes that enclosing class names. The `class` and `className` attributes are always supported, even if no options are specified.',
  },
  customFunctions: {
    since: '0.1.0',
    type: 'string',
    array: true,
    category: 'Format',
    default: [{ value: [] }],
    description:
      'List of functions that enclosing class names. The `classNames` function is always supported, even if no options are specified.',
  },
  endingPosition: {
    since: '0.5.0',
    type: 'choice',
    category: 'Format',
    default: 'relative',
    description:
      'This is the criterion for ending the class name on each line when replacing the original class name with a multi-line class name.',
    choices: [
      {
        value: 'relative',
        description: 'Each line ends at a `printWidth` distance from the start of the class name.',
      },
      {
        value: 'absolute',
        description: 'Each line ends at a `printWidth` distance from the start of the line.',
      },
      {
        since: '0.6.0',
        value: 'absolute-with-indent',
        description:
          'Basically the same as the `absolute` option, but indentation respects the `relative` option.',
      },
    ],
  },
  debugFlag: {
    since: '0.7.2',
    type: 'boolean',
    category: 'Format',
    default: false,
    description: 'A flag for branching in the development environment.',
  },
};
