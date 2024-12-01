import { baseOptions } from 'test-settings';

import { thisPlugin, testSnapshotEach } from '../../adaptor';
import { fixtures } from './fixtures';

const options = {
  ...baseOptions,
  plugins: [thisPlugin],
  parser: 'typescript',
  endingPosition: 'absolute-with-indent',
};

testSnapshotEach(fixtures, options);