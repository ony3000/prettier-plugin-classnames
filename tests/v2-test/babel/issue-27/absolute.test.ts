import { format } from 'prettier';
import type { Fixture } from 'test-settings';
import { baseOptions } from 'test-settings';
import { describe, expect, test } from 'vitest';

// eslint-disable-next-line import/no-extraneous-dependencies
import * as thisPlugin from '@/packages/v2-plugin';

const options = {
  ...baseOptions,
  plugins: [thisPlugin],
  parser: 'babel',
  endingPosition: 'absolute',
};

const fixtures: Fixture[] = [
  {
    name: 'template literal ending with a space',
    input: `
export default function Test() {
  return (
    <div>
      {[0, 1, 2, 3].map((key) => {
        return (
          <div
            key={key}
            className={\`\${key ? \`relative \` : \`\`}
            tablet:static\`}>{key}</div>
        );
      })}
    </div>
  );
}
`,
    output: `export default function Test() {
  return (
    <div>
      {[0, 1, 2, 3].map((key) => {
        return (
          <div key={key} className={\`\${key ? "relative " : ""} tablet:static\`}>
            {key}
          </div>
        );
      })}
    </div>
  );
}
`,
  },
  {
    name: 'template literal starting with a space',
    input: `
export default function Test() {
  return (
    <div>
      {[0, 1, 2, 3].map((key) => {
        return (
          <div
            key={key}
            className={\`\${key ? \` relative\` : \`\`}
            tablet:static\`}>{key}</div>
        );
      })}
    </div>
  );
}
`,
    output: `export default function Test() {
  return (
    <div>
      {[0, 1, 2, 3].map((key) => {
        return (
          <div key={key} className={\`\${key ? " relative" : ""} tablet:static\`}>
            {key}
          </div>
        );
      })}
    </div>
  );
}
`,
  },
  {
    name: 'trimmed template literal (no error in v0.4.0, error in v0.5.0)',
    input: `
export default function Test() {
  return (
    <div>
      {[0, 1, 2, 3].map((key) => {
        return (
          <div
            key={key}
            className={\`\${key ? \`relative\` : \`\`}
            tablet:static\`}>{key}</div>
        );
      })}
    </div>
  );
}
`,
    output: `export default function Test() {
  return (
    <div>
      {[0, 1, 2, 3].map((key) => {
        return (
          <div key={key} className={\`\${key ? "relative" : ""} tablet:static\`}>
            {key}
          </div>
        );
      })}
    </div>
  );
}
`,
  },
];

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
