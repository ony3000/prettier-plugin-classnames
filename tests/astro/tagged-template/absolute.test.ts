import { thisPlugin, testSnapshotEach } from '../../adaptor';

import { baseOptions } from '../../settings';
import { fixtures } from './fixtures';

const options = {
  ...baseOptions,
  plugins: ['prettier-plugin-astro', thisPlugin],
  parser: 'astro',
  printWidth: 60,
  customFunctions: ['tw'],
  endingPosition: 'absolute',
};

testSnapshotEach(fixtures, options);
