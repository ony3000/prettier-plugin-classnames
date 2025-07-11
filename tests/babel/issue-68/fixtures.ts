import type { Fixture } from '../../settings';

export const fixtures: Omit<Fixture, 'output'>[] = [
  {
    name: "(1) Even when nested expressions contain logical expressions, the opening and closing braces and nested indentation of the expressions should be preserved in Prettier's output as much as possible.",
    input: `
//-----------------------------------------------------------------------------| printWidth=80 (in snapshot)
export function Foo() {
  return (
    <Component
      className={\`relative text-sm font-bold uppercase leading-[0.9] tracking-widest
        transition-all duration-500 ease-out hover:brightness-105 active:shadow-sm
        active:brightness-110 active:transition-none \${
        variant === 'underline'
            ? 'pb-2 text-accent-1 underline underline-offset-8 hover:underline-offset-[10px]'
            : \`flex min-h-10 w-max min-w-28 items-center justify-between gap-2 overflow-hidden
              rounded px-[max(1.5rem,_var(--radius))] py-5 text-center hover:shadow-md\`
        } \${variant === 'default' && 'border border-bg-3 bg-bg-2 text-accent-1'} \${
        variant === 'primary' &&
        'active:accent-1 border border-accent-2 !bg-accent-1 text-bg-1' } \${ variant ===
        'outline' && 'border border-current !bg-transparent' } \${className}\`}
    />
  );
}
`,
  },
];
