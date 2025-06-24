import type { Fixture } from '../../settings';

export const fixtures: Omit<Fixture, 'output'>[] = [
  {
    name: '(1) If a template literal contains nested expressions, object properties must still be enclosed in square brackets.',
    input: `
//---------------------------------------------------------| printWidth=60 (in snapshot)
export function Foo() {
  return (
    <div
      className={clsx("w-full items-center justify-center", {
        "nodrag cursor-text h-full overflow-hidden": isEditing,
        [\`line-clamp-\${lineClamp}\`]: !isEditing,
      })}
    >Hello</div>
  );
}
`,
    options: {
      printWidth: 60,
    },
  },
];
