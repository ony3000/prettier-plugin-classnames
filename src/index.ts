// eslint-disable-next-line import/no-import-module-exports
import prettier from 'prettier';

if (prettier.version.startsWith('2.')) {
  // eslint-disable-next-line global-require
  module.exports = require('./packages/v2-plugin');
} else {
  // eslint-disable-next-line global-require
  module.exports = require('./packages/v3-plugin');
}
