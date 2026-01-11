import { thisPlugin, testSnapshotEach } from '../../adaptor';
import { baseOptions } from '../../settings';
import { fixtures } from './fixtures';

const options = {
  ...baseOptions,
  plugins: ['@prettier/plugin-oxc', thisPlugin],
  parser: 'oxc',
  printWidth: 60,
  customFunctions: ['tw'],
  endingPosition: 'absolute',
};

testSnapshotEach(fixtures, options);
