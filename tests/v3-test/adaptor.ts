import type { Plugin } from 'prettier';
import { format } from 'prettier';
import type { Fixture } from 'test-settings';
import { describe, expect, onTestFailed, test } from 'vitest';

// eslint-disable-next-line import/no-extraneous-dependencies
import * as thisPlugin from '@/packages/v3-plugin';

export { thisPlugin };

export function testEach(
  fixtures: Fixture[],
  options: PrettierBaseOptions & { plugins: (string | Plugin)[] },
) {
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
}

export function testSnapshotEach(
  fixtures: Omit<Fixture, 'output'>[],
  options: PrettierBaseOptions & { plugins: (string | Plugin)[] },
) {
  describe.each(fixtures)('$name', async ({ input, options: fixtureOptions }) => {
    const fixedOptions = {
      ...options,
      ...(fixtureOptions ?? {}),
    };
    const formattedText = await format(input, fixedOptions);
    let skipSecondTest = false;

    test('expectation', () => {
      onTestFailed(() => {
        skipSecondTest = true;
      });

      expect(formattedText).toMatchSnapshot();
    });

    test('consistency', async ({ skip }) => {
      if (skipSecondTest) {
        skip();
      }

      const doubleFormattedText = await format(formattedText, fixedOptions);

      expect(doubleFormattedText).toBe(formattedText);
    });
  });
}
