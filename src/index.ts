import type { Plugin } from 'prettier';

import { parsers } from './parsers';

const classnamesPlugin: Plugin = {
  parsers,
};

export default classnamesPlugin;
