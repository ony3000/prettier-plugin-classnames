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
};

const fixtures: Fixture[] = [
  {
    name: 'issue #41 (1) - relative',
    input: `
export default function MyComponent() {
  return (
    <section className="lorem ipsum dolor sit amet consectetur adipiscing elit aenean p">
      content
    </section>
  );
}
`,
    output: `export default function MyComponent() {
  return (
    <section className="lorem ipsum dolor sit amet consectetur adipiscing elit aenean p">
      content
    </section>
  );
}
`,
    options: {
      endingPosition: 'relative',
    },
  },
  {
    name: 'issue #41 (2) - relative',
    input: `
export default function MyComponent() {
  return (
    <section
      className="lorem ipsum dolor sit amet consectetur adipiscing elit
        aenean p"
    >
      content
    </section>
  );
}
`,
    output: `export default function MyComponent() {
  return (
    <section className="lorem ipsum dolor sit amet consectetur adipiscing elit aenean p">
      content
    </section>
  );
}
`,
    options: {
      endingPosition: 'relative',
    },
  },
  {
    name: 'issue #41 (3) - absolute',
    input: `
export default function MyComponent() {
  return (
    <section className="lorem ipsum dolor sit amet consectetur adipiscing elit aenean p">
      content
    </section>
  );
}
`,
    output: `export default function MyComponent() {
  return (
    <section
      className="lorem ipsum dolor sit amet consectetur adipiscing elit aenean p"
    >
      content
    </section>
  );
}
`,
    options: {
      endingPosition: 'absolute',
    },
  },
  {
    name: 'issue #41 (4) - absolute',
    input: `
export default function MyComponent() {
  return (
    <section
      className="lorem ipsum dolor sit amet consectetur adipiscing elit
        aenean p"
    >
      content
    </section>
  );
}
`,
    output: `export default function MyComponent() {
  return (
    <section
      className="lorem ipsum dolor sit amet consectetur adipiscing elit aenean p"
    >
      content
    </section>
  );
}
`,
    options: {
      endingPosition: 'absolute',
    },
  },
  {
    name: 'issue #41 (5) - ideal',
    input: `
export default function MyComponent() {
  return (
    <section className="lorem ipsum dolor sit amet consectetur adipiscing elit aenean p">
      content
    </section>
  );
}
`,
    output: `export default function MyComponent() {
  return (
    <section
      className="lorem ipsum dolor sit amet consectetur adipiscing elit aenean p"
    >
      content
    </section>
  );
}
`,
    options: {
      endingPosition: 'absolute-with-indent',
    },
  },
  {
    name: 'issue #41 (6) - ideal',
    input: `
export default function MyComponent() {
  return (
    <section
      className="lorem ipsum dolor sit amet consectetur adipiscing elit
        aenean p"
    >
      content
    </section>
  );
}
`,
    output: `export default function MyComponent() {
  return (
    <section
      className="lorem ipsum dolor sit amet consectetur adipiscing elit aenean p"
    >
      content
    </section>
  );
}
`,
    options: {
      endingPosition: 'absolute-with-indent',
    },
  },
];

describe('babel/consistency', () => {
  for (const fixture of fixtures) {
    const fixedOptions = {
      ...options,
      ...(fixture.options ?? {}),
    };
    const formattedText = format(fixture.input, fixedOptions);

    describe(fixture.name, () => {
      test('expectation', () => {
        expect(formattedText).toBe(fixture.output);
      });

      test('consistency', () => {
        const doubleFormattedText = format(formattedText, fixedOptions);

        expect(doubleFormattedText).toBe(formattedText);
      });
    });
  }
});
