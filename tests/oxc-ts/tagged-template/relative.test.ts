import { thisPlugin, testSnapshotEach } from '../../adaptor';
import { baseOptions } from '../../settings';
import { fixtures } from './fixtures';

const options = {
  ...baseOptions,
  plugins: ['@prettier/plugin-oxc', thisPlugin],
  parser: 'oxc-ts',
  printWidth: 60,
  customFunctions: ['tw'],
  endingPosition: 'relative',
};

testSnapshotEach(fixtures, options);
