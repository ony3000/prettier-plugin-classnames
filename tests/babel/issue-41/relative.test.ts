import { thisPlugin, testEach } from '../../adaptor';
import type { Fixture } from '../../settings';
import { baseOptions } from '../../settings';

const options = {
  ...baseOptions,
  plugins: [thisPlugin],
  parser: 'babel',
  endingPosition: 'relative',
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
    <section className="lorem ipsum dolor sit amet consectetur adipiscing elit aenean p">
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
    <section className="lorem ipsum dolor sit amet consectetur adipiscing elit aenean p">
      content
    </section>
  );
}
`,
  },
];

testEach(fixtures, options);
