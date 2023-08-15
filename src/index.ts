import type { Plugin } from 'prettier';

import { parsers } from './parsers';
import { printers } from './printers';

const classnamesPlugin: Plugin = {
  parsers,
  printers,
};

export default classnamesPlugin;
