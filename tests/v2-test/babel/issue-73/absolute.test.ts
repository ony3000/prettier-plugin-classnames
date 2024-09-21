import { baseOptions } from 'test-settings';

import { thisPlugin, testSnapshotEach } from '../../adaptor';
import { fixtures } from './fixtures';

const options = {
  ...baseOptions,
  plugins: [thisPlugin],
  parser: 'babel',
  printWidth: 60,
  endingPosition: 'absolute',
};

testSnapshotEach(fixtures, options);