import type { Fixture } from 'test-settings';
import { baseOptions } from 'test-settings';

import { thisPlugin, testEach } from '../../adaptor';

const options = {
  ...baseOptions,
  plugins: [thisPlugin],
  parser: 'babel',
  endingPosition: 'absolute-with-indent',
};

const fixtures: Fixture[] = [
  {
    name: 'component composition',
    input: `
export const Overlay = () => {
  return (
    <Dialog.Overlay className="bg-popover backdrop-opacity-disabled focus:ring-0 fixed inset-0 z-50 h-screen w-screen" />
  );
};
`,
    output: `export const Overlay = () => {
  return (
    <Dialog.Overlay
      className="bg-popover backdrop-opacity-disabled focus:ring-0 fixed inset-0
        z-50 h-screen w-screen"
    />
  );
};
`,
  },
  {
    name: 'double composition',
    input: `
export const Overlay = () => {
  return (
    <Foo.Dialog.Overlay className="bg-popover backdrop-opacity-disabled focus:ring-0 fixed inset-0 z-50 h-screen w-screen" />
  );
};
`,
    output: `export const Overlay = () => {
  return (
    <Foo.Dialog.Overlay
      className="bg-popover backdrop-opacity-disabled focus:ring-0 fixed inset-0
        z-50 h-screen w-screen"
    />
  );
};
`,
  },
  {
    name: 'triple composition',
    input: `
export const Overlay = () => {
  return (
    <Foo.Bar.Dialog.Overlay className="bg-popover backdrop-opacity-disabled focus:ring-0 fixed inset-0 z-50 h-screen w-screen" />
  );
};
`,
    output: `export const Overlay = () => {
  return (
    <Foo.Bar.Dialog.Overlay
      className="bg-popover backdrop-opacity-disabled focus:ring-0 fixed inset-0
        z-50 h-screen w-screen"
    />
  );
};
`,
  },
];

testEach(fixtures, options);
