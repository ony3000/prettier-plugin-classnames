import { baseOptions } from 'test-settings';

import { thisPlugin, testSnapshotEach } from '../../adaptor';
import { fixtures } from './fixtures';

const options = {
  ...baseOptions,
  plugins: [thisPlugin],
  parser: 'html',
  printWidth: 60,
  endingPosition: 'absolute-with-indent',
};

testSnapshotEach(fixtures, options);
