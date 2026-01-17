import type { Fixture } from '../../settings';

export const fixtures: Omit<Fixture, 'output'>[] = [
  {
    name: 'one input',
    input: `
//-----------------------------------------------------------------------------| printWidth=80 (in snapshot)
export default function MyComponent() {
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
//-----------------------------------------------------------------------------| printWidth=80 (in snapshot)
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
  },
];
