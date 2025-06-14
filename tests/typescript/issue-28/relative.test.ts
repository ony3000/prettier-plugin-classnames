import { thisPlugin, testEach } from '../../adaptor';
import type { Fixture } from '../../settings';
import { baseOptions } from '../../settings';

const options = {
  ...baseOptions,
  plugins: [thisPlugin],
  parser: 'typescript',
  endingPosition: 'relative',
};

const fixtures: Fixture[] = [
  {
    name: 'template literal in ternary operator',
    input: `
const { data } = useSWR<CartResponse>(
  cartId ? \`\${process.env.NEXT_PUBLIC_API_URL}/cart/\${cartId}\` : null,
);
`,
    output: `const { data } = useSWR<CartResponse>(
  cartId ? \`\${process.env.NEXT_PUBLIC_API_URL}/cart/\${cartId}\` : null,
);
`,
  },
  {
    name: 'just template literal',
    input: `
const { data } = useSWR<CartResponse>(
  \`\${process.env.NEXT_PUBLIC_API_URL}/cart/\${cartId}\`,
);
`,
    output: `const { data } = useSWR<CartResponse>(
  \`\${process.env.NEXT_PUBLIC_API_URL}/cart/\${cartId}\`,
);
`,
  },
];

testEach(fixtures, options);
