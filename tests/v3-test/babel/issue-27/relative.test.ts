import type { Fixture } from '../../../test-settings';
import { baseOptions } from '../../../test-settings';
import { thisPlugin, testEach } from '../../adaptor';

const options = {
  ...baseOptions,
  plugins: [thisPlugin],
  parser: 'babel',
  endingPosition: 'relative',
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

testEach(fixtures, options);
