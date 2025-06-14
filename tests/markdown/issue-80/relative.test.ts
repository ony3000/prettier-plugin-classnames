import { thisPlugin, testSnapshotEach } from '../../adaptor';
import { baseOptions } from '../../settings';
import { fixtures } from './fixtures';

const options = {
  ...baseOptions,
  plugins: [thisPlugin],
  parser: 'markdown',
  endingPosition: 'relative',
};

testSnapshotEach(fixtures, options);
