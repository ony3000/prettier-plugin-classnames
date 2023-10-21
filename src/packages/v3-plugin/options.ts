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
      'List of attributes that enclosing class names. The `className` attribute is always supported, even if no options are specified.',
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
};
