import type { Fixture } from '../../settings';

export const fixtures: Omit<Fixture, 'output'>[] = [
  {
    name: '(1) Tagged templates are not supported by default.',
    input: `
//----------------------------------------------------------| printWidth=60 (in snapshot)
<script>
const classes = tw\`lorem ipsum dolor sit amet consectetur adipiscing elit proin ex massa hendrerit eu posuere eu volutpat id neque pellentesque\`;
</script>
`,
    options: {
      printWidth: 60,
    },
  },
  {
    name: '(2) Tagged templates are supported by adding tag function names to the `customFunctions` option.',
    input: `
//----------------------------------------------------------| printWidth=60 (in snapshot)
<script>
const classes = tw\`lorem ipsum dolor sit amet consectetur adipiscing elit proin ex massa hendrerit eu posuere eu volutpat id neque pellentesque\`;
</script>
`,
    options: {
      printWidth: 60,
      customFunctions: ['tw'],
    },
  },
  {
    name: '(3) If a tagged template is written as an expression for an attribute that supports line wrapping, it will appear to be supported even if the `customFunctions` option does not include the tagged function name, but in fact it is supported as a template literal.',
    input: `
<!-- -------------------------------------------------------| printWidth=60 (in snapshot) -->
<div>
  <div>
    <div class={tw\`lorem ipsum dolor sit amet consectetur adipiscing elit proin ex massa hendrerit eu posuere eu volutpat id neque pellentesque\`}>
      <slot />
    </div>
  </div>
</div>
`,
    options: {
      printWidth: 60,
    },
  },
  {
    name: '(4) If the tag function name is `css`, the tagged template is considered special and is not supported even if it is written as an expression for an attribute that supports line wrapping.',
    input: `
<!-- -------------------------------------------------------| printWidth=60 (in snapshot) -->
<div>
  <div>
    <div class={css\`lorem ipsum dolor sit amet consectetur adipiscing elit proin ex massa hendrerit eu posuere eu volutpat id neque pellentesque\`}>
      <slot />
    </div>
  </div>
</div>
`,
    options: {
      printWidth: 60,
    },
  },
  {
    name: '(5) If the tag function name is `css`, the tagged template is considered special and is not supported even if you add the tag function name to the `customFunctions` option.',
    input: `
<!-- -------------------------------------------------------| printWidth=60 (in snapshot) -->
<div>
  <div>
    <div class={css\`lorem ipsum dolor sit amet consectetur adipiscing elit proin ex massa hendrerit eu posuere eu volutpat id neque pellentesque\`}>
      <slot />
    </div>
  </div>
</div>
`,
    options: {
      printWidth: 60,
      customFunctions: ['css'],
    },
  },
];
