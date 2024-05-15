import type { Fixture } from 'test-settings';
import { baseOptions } from 'test-settings';

import { thisPlugin, testEach } from '../../adaptor';

const options = {
  ...baseOptions,
  plugins: [thisPlugin],
  parser: 'typescript',
  endingPosition: 'absolute-with-indent',
};

const fixtures: Fixture[] = [
  {
    name: 'one input',
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
  },
  {
    name: 'another input',
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
  },
];

testEach(fixtures, options);
