import { baseOptions } from '../../../test-settings';
import { thisPlugin, testSnapshotEach } from '../../adaptor';
import { fixtures } from './fixtures';

const options = {
  ...baseOptions,
  plugins: ['prettier-plugin-svelte', thisPlugin],
  parser: 'svelte',
  endingPosition: 'relative',
};

testSnapshotEach(fixtures, options);
