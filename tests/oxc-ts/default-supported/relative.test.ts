import { thisPlugin, testSnapshotEach } from '../../adaptor';
import { baseOptions } from '../../settings';
import { fixtures } from './fixtures';

const options = {
  ...baseOptions,
  plugins: ['@prettier/plugin-oxc', thisPlugin],
  parser: 'oxc-ts',
  printWidth: 60,
  endingPosition: 'relative',
};

testSnapshotEach(fixtures, options);
