import type { Fixture } from '../../settings';

export const fixtures: Omit<Fixture, 'output'>[] = [
  {
    name: 'template literal in ternary operator',
    input: `
//-----------------------------------------------------------------------------| printWidth=80 (in snapshot)
const { data } = useSWR<CartResponse>(
  cartId ? \`\${process.env.NEXT_PUBLIC_API_URL}/cart/\${cartId}\` : null,
);
`,
  },
  {
    name: 'just template literal',
    input: `
//-----------------------------------------------------------------------------| printWidth=80 (in snapshot)
const { data } = useSWR<CartResponse>(
  \`\${process.env.NEXT_PUBLIC_API_URL}/cart/\${cartId}\`,
);
`,
  },
];
