import { baseOptions } from '../../../test-settings';
import { thisPlugin, testSnapshotEach } from '../../adaptor';
import { fixtures } from './fixtures';

const options = {
  ...baseOptions,
  plugins: ['prettier-plugin-svelte', thisPlugin],
  parser: 'svelte',
  printWidth: 60,
  endingPosition: 'absolute',
};

testSnapshotEach(fixtures, options);
