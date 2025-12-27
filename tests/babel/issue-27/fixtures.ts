import type { Fixture } from '../../settings';

export const fixtures: Omit<Fixture, 'output'>[] = [
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
  },
];
