import { thisPlugin, testSnapshotEach } from '../../adaptor';
import { baseOptions } from '../../settings';
import { fixtures } from './fixtures';

const options = {
  ...baseOptions,
  plugins: [thisPlugin],
  parser: 'typescript',
  printWidth: 60,
  endingPosition: 'relative',
};

testSnapshotEach(fixtures, options);
