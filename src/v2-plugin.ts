import type { Plugin } from 'prettier';

import { options } from './v2-parts/options';
import { parsers } from './v2-parts/parsers';
import { printers } from './v2-parts/printers';

const classnamesPlugin: Plugin = {
  parsers,
  printers,
  options,
};

export default classnamesPlugin;
