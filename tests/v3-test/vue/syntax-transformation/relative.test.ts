import { baseOptions } from '../../../test-settings';
import { thisPlugin, testSnapshotEach } from '../../adaptor';
import { fixtures } from './fixtures';

const options = {
  ...baseOptions,
  plugins: [thisPlugin],
  parser: 'vue',
  printWidth: 60,
  endingPosition: 'relative',
};

testSnapshotEach(fixtures, options);
