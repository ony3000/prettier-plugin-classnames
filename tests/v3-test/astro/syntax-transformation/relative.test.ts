import { baseOptions } from '../../../test-settings';
import { thisPlugin, testSnapshotEach } from '../../adaptor';
import { fixtures } from './fixtures';

const options = {
  ...baseOptions,
  plugins: ['prettier-plugin-astro', thisPlugin],
  parser: 'astro',
  printWidth: 60,
  endingPosition: 'relative',
};

testSnapshotEach(fixtures, options);
