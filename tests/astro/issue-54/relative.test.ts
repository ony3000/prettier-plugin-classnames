import { thisPlugin, testSnapshotEach } from '../../adaptor';

import { baseOptions } from '../../settings';
import { fixtures } from './fixtures';

const options = {
  ...baseOptions,
  plugins: ['prettier-plugin-astro', thisPlugin],
  parser: 'astro',
  endingPosition: 'relative',
};

testSnapshotEach(fixtures, options);
