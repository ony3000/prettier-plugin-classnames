import type { Plugin } from 'prettier';

import { options } from './options';
import { parsers } from './parsers';
import { printers } from './printers';

const classnamesPlugin: Plugin = {
  parsers,
  printers,
  options,
};

export default classnamesPlugin;
