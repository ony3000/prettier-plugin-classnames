import type { Fixture } from '../../settings';

export const fixtures: Omit<Fixture, 'output'>[] = [
  {
    name: 'component composition',
    input: `
//-----------------------------------------------------------------------------| printWidth=80 (in snapshot)
export const Overlay = () => {
  return (
    <Dialog.Overlay className="bg-popover backdrop-opacity-disabled focus:ring-0 fixed inset-0 z-50 h-screen w-screen" />
  );
};
`,
  },
  {
    name: 'double composition',
    input: `
//-----------------------------------------------------------------------------| printWidth=80 (in snapshot)
export const Overlay = () => {
  return (
    <Foo.Dialog.Overlay className="bg-popover backdrop-opacity-disabled focus:ring-0 fixed inset-0 z-50 h-screen w-screen" />
  );
};
`,
  },
  {
    name: 'triple composition',
    input: `
//-----------------------------------------------------------------------------| printWidth=80 (in snapshot)
export const Overlay = () => {
  return (
    <Foo.Bar.Dialog.Overlay className="bg-popover backdrop-opacity-disabled focus:ring-0 fixed inset-0 z-50 h-screen w-screen" />
  );
};
`,
  },
];
