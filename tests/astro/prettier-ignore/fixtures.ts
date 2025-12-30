import type { Fixture } from '../../settings';

export const fixtures: Omit<Fixture, 'output'>[] = [
  {
    name: 'valid ignore comment (1) - component',
    input: `
<!-- -------------------------------------------------------| printWidth=60 (in snapshot) -->
<!-- prettier-ignore -->
<div>
  <div>
    <div
      class={classNames(
        'lorem ipsum dolor sit amet consectetur adipiscing elit proin ex massa hendrerit eu posuere',
        'lorem ipsum dolor sit amet consectetur adipiscing elit proin ex massa hendrerit eu posuere',
      )}
    >
      <slot />
    </div>
  </div>
</div>
`,
  },
  {
    name: 'valid ignore comment (2) - element',
    input: `
<!-- -------------------------------------------------------| printWidth=60 (in snapshot) -->
<div>
  <div>
    <!-- prettier-ignore -->
    <div
      class={classNames(
        'lorem ipsum dolor sit amet consectetur adipiscing elit proin ex massa hendrerit eu posuere',
        'lorem ipsum dolor sit amet consectetur adipiscing elit proin ex massa hendrerit eu posuere',
      )}
    >
      <slot />
    </div>
  </div>
</div>
`,
  },
  {
    name: 'valid ignore comment (3) - class name combination',
    input: `
<!-- -------------------------------------------------------| printWidth=60 (in snapshot) -->
<div>
  <div>
    <div
      class={classNames(
        // prettier-ignore
        'lorem ipsum dolor sit amet consectetur adipiscing elit proin ex massa hendrerit eu posuere',
        'lorem ipsum dolor sit amet consectetur adipiscing elit proin ex massa hendrerit eu posuere',
      )}
    >
      <slot />
    </div>
  </div>
</div>
`,
  },
  {
    name: 'valid ignore comment (4) - class name combination',
    input: `
<!-- -------------------------------------------------------| printWidth=60 (in snapshot) -->
<div>
  <div>
    <div
      class={classNames([
        // prettier-ignore
        'lorem ipsum dolor sit amet consectetur adipiscing elit proin ex massa hendrerit eu posuere',
        'lorem ipsum dolor sit amet consectetur adipiscing elit proin ex massa hendrerit eu posuere',
      ])}
    >
      <slot />
    </div>
  </div>
</div>
`,
  },
  {
    name: 'valid ignore comment (5) - frontmatter',
    input: `
//----------------------------------------------------------| printWidth=60 (in snapshot)
---
const combination = classNames(
  /* prettier-ignore */
  'lorem ipsum dolor sit amet consectetur adipiscing elit proin ex massa hendrerit eu posuere',
  'lorem ipsum dolor sit amet consectetur adipiscing elit proin ex massa hendrerit eu posuere',
)
---
`,
  },
  {
    name: 'valid ignore comment (6) - frontmatter',
    input: `
//----------------------------------------------------------| printWidth=60 (in snapshot)
---
const combination = classNames(
  // prettier-ignore
  'lorem ipsum dolor sit amet consectetur adipiscing elit proin ex massa hendrerit eu posuere',
  'lorem ipsum dolor sit amet consectetur adipiscing elit proin ex massa hendrerit eu posuere',
)
---
`,
  },
  {
    name: 'valid ignore comment (7) - script tag',
    input: `
//----------------------------------------------------------| printWidth=60 (in snapshot)
<script>
const combination = classNames(
  /* prettier-ignore */
  'lorem ipsum dolor sit amet consectetur adipiscing elit proin ex massa hendrerit eu posuere',
  'lorem ipsum dolor sit amet consectetur adipiscing elit proin ex massa hendrerit eu posuere',
)
</script>
`,
  },
  {
    name: 'valid ignore comment (8) - script tag',
    input: `
//----------------------------------------------------------| printWidth=60 (in snapshot)
<script>
const combination = classNames(
  // prettier-ignore
  'lorem ipsum dolor sit amet consectetur adipiscing elit proin ex massa hendrerit eu posuere',
  'lorem ipsum dolor sit amet consectetur adipiscing elit proin ex massa hendrerit eu posuere',
)
</script>
`,
  },
  {
    name: 'valid ignore comment (9) - multi-line script opening tag',
    input: `
//----------------------------------------------------------| printWidth=60 (in snapshot)
<script zero-one-two-three-four-five-six-seven-eight-nine="0123456789">
const combination = classNames(
  // prettier-ignore
  'lorem ipsum dolor sit amet consectetur adipiscing elit proin ex massa hendrerit eu posuere',
  'lorem ipsum dolor sit amet consectetur adipiscing elit proin ex massa hendrerit eu posuere',
)
</script>
`,
  },
  {
    name: 'invalid ignore comment (1) - formatting works as usual',
    input: `
<!-- -------------------------------------------------------| printWidth=60 (in snapshot) -->
<!--
 ! prettier-ignore
-->
<div>
  <div>
    <div class={classNames('lorem ipsum dolor sit amet consectetur adipiscing elit proin ex massa hendrerit eu posuere')}>
      <slot />
    </div>
  </div>
</div>
`,
  },
  {
    name: 'invalid ignore comment (2) - formatting works as usual',
    input: `
<!-- -------------------------------------------------------| printWidth=60 (in snapshot) -->
<!-- /* prettier-ignore */ -->
<div>
  <div>
    <div class={classNames('lorem ipsum dolor sit amet consectetur adipiscing elit proin ex massa hendrerit eu posuere')}>
      <slot />
    </div>
  </div>
</div>
`,
  },
];
