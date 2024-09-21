import type { Plugin } from 'prettier';
import { format } from 'prettier';
import type { Fixture } from 'test-settings';
import { describe, expect, onTestFailed, test } from 'vitest';

// eslint-disable-next-line import/no-extraneous-dependencies
import * as thisPlugin from '@/packages/v2-plugin';

export { thisPlugin };

export function testEach(
  fixtures: Fixture[],
  options: PrettierBaseOptions & { plugins: (string | Plugin)[] },
) {
  describe.each(fixtures)('$name', ({ input, output, options: fixtureOptions }) => {
    const fixedOptions = {
      ...options,
      ...(fixtureOptions ?? {}),
    };
    const formattedText = format(input, fixedOptions);

    test('expectation', () => {
      expect(formattedText).toBe(output);
    });

    test.runIf(formattedText === output)('consistency', () => {
      const doubleFormattedText = format(formattedText, fixedOptions);

      expect(doubleFormattedText).toBe(formattedText);
    });
  });
}

export function testSnapshotEach(
  fixtures: Omit<Fixture, 'output'>[],
  options: PrettierBaseOptions & { plugins: (string | Plugin)[] },
) {
  describe.each(fixtures)('$name', ({ input, options: fixtureOptions }) => {
    const fixedOptions = {
      ...options,
      ...(fixtureOptions ?? {}),
    };
    const formattedText = format(input, fixedOptions);
    let skipSecondTest = false;

    test('expectation', () => {
      onTestFailed(() => {
        skipSecondTest = true;
      });

      expect(formattedText).toMatchSnapshot();
    });

    test('consistency', ({ skip }) => {
      if (skipSecondTest) {
        skip();
      }

      const doubleFormattedText = format(formattedText, fixedOptions);

      expect(doubleFormattedText).toBe(formattedText);
    });
  });
}
