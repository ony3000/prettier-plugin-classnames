import { baseOptions } from 'test-settings';

import { thisPlugin, testSnapshotEach } from '../../adaptor';
import { fixtures } from './fixtures';

const options = {
  ...baseOptions,
  plugins: [thisPlugin],
  parser: 'angular',
  endingPosition: 'absolute-with-indent',
};

testSnapshotEach(fixtures, options);
