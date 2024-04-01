import { format } from 'prettier';
import type { Fixture } from 'test-settings';
import { baseOptions } from 'test-settings';
import { describe, expect, test } from 'vitest';

// eslint-disable-next-line import/no-extraneous-dependencies
import * as thisPlugin from '@/packages/v3-plugin';

const options = {
  ...baseOptions,
  plugins: [thisPlugin],
  parser: 'typescript',
  endingPosition: 'relative',
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
      className="bg-popover backdrop-opacity-disabled focus:ring-0 fixed inset-0 z-50 h-screen
        w-screen"
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
      className="bg-popover backdrop-opacity-disabled focus:ring-0 fixed inset-0 z-50 h-screen
        w-screen"
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
      className="bg-popover backdrop-opacity-disabled focus:ring-0 fixed inset-0 z-50 h-screen
        w-screen"
    />
  );
};
`,
  },
];

describe.each(fixtures)('$name', async ({ input, output, options: fixtureOptions }) => {
  const fixedOptions = {
    ...options,
    ...(fixtureOptions ?? {}),
  };
  const formattedText = await format(input, fixedOptions);

  test('expectation', () => {
    expect(formattedText).toBe(output);
  });

  test.runIf(formattedText === output)('consistency', async () => {
    const doubleFormattedText = await format(formattedText, fixedOptions);

    expect(doubleFormattedText).toBe(formattedText);
  });
});
