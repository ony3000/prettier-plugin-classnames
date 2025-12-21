import { thisPlugin, testSnapshotEach } from '../../adaptor';

import { baseOptions } from '../../settings';
import { fixtures } from './fixtures';

const options = {
  ...baseOptions,
  plugins: [thisPlugin],
  parser: 'html',
  printWidth: 60,
  endingPosition: 'absolute',
};

testSnapshotEach(fixtures, options);
