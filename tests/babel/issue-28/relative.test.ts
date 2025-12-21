import { thisPlugin, testSnapshotEach } from '../../adaptor';

import { baseOptions } from '../../settings';
import { fixtures } from './fixtures';

const options = {
  ...baseOptions,
  plugins: [thisPlugin],
  parser: 'babel',
  endingPosition: 'relative',
};

testSnapshotEach(fixtures, options);
