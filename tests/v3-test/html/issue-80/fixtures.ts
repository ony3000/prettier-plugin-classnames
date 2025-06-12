import type { Fixture } from '../../../test-settings';

export const fixtures: Omit<Fixture, 'output'>[] = [
  {
    name: '(1) If a script tag has no type, it is assumed to contain JavaScript code.',
    input: `
<script>
export function Foo({ children }) {
  return (
    <div className="lorem ipsum dolor sit amet">
      {children}
    </div>
  );
}
</script>
`,
    options: {},
  },
  {
    name: '(2) If a script tag has an empty type, it is assumed to contain JavaScript code.',
    input: `
<script type="">
export function Foo({ children }) {
  return (
    <div className="lorem ipsum dolor sit amet">
      {children}
    </div>
  );
}
</script>
`,
    options: {},
  },
  {
    name: '(3) If a script tag has a type of `text/javascript`, it is assumed to contain JavaScript code.',
    input: `
<script type="text/javascript">
export function Foo({ children }) {
  return (
    <div className="lorem ipsum dolor sit amet">
      {children}
    </div>
  );
}
</script>
`,
    options: {},
  },
  {
    name: '(4) If a script tag has a `lang` attribute whose value is `ts`, it is assumed to contain TypeScript code, regardless of type.',
    input: `
<script lang="ts" type="anything">
interface MyInterface { foo(): string, bar: Array<number> }
</script>
`,
    options: {},
  },
  {
    name: "(5) Otherwise, leave Prettier's output as is.",
    input: `
<script type="application/json">
{
lorem: "ipsum",
'dolor': 'sit amet',
}
</script>
`,
    options: {},
  },
];
