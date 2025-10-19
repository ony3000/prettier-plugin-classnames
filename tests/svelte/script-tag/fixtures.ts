import type { Fixture } from '../../settings';

export const fixtures: Omit<Fixture, 'output'>[] = [
  {
    name: '(Non-TS-01) literal',
    input: `
<!-- ------------------------------------------------------| printWidth=60 (in snapshot) -->
<script></script>

<div class={'w-full'}></div>
`,
    options: {
      printWidth: 60,
    },
  },
  {
    name: '(Non-TS-02) function argument',
    input: `
<!-- ------------------------------------------------------| printWidth=60 (in snapshot) -->
<script></script>

<div class={classNames('w-full')}></div>
`,
    options: {
      printWidth: 60,
    },
  },
  {
    name: '(Non-TS-03) object property',
    input: `
<!-- ------------------------------------------------------| printWidth=60 (in snapshot) -->
<script></script>

<div class={{ 'w-full': true }}></div>
`,
    options: {
      printWidth: 60,
    },
  },
  {
    name: '(Non-TS-04) ternary operator',
    input: `
<!-- ------------------------------------------------------| printWidth=60 (in snapshot) -->
<script></script>

<div class={condition ? 'w-full' : 'w-full'}></div>
`,
    options: {
      printWidth: 60,
    },
  },
  {
    name: '(Non-TS-05) binary operator',
    input: `
<!-- ------------------------------------------------------| printWidth=60 (in snapshot) -->
<script></script>

<div class={truthyExpression && 'w-full'}></div>
`,
    options: {
      printWidth: 60,
    },
  },
  {
    name: '(Non-TS-06) multiple class names',
    input: `
<!-- ------------------------------------------------------| printWidth=60 (in snapshot) -->
<script></script>

<div class={['w-full', classNames('w-full'), { 'w-full': true }, condition ? 'w-full' : 'w-full', truthyExpression && 'w-full']}></div>
`,
    options: {
      printWidth: 60,
    },
  },
  {
    name: '(Non-TS-07) literal',
    input: `
<!-- ------------------------------------------------------| printWidth=60 (in snapshot) -->
<script zero-one-two-three-four-five-six-seven-eight-nine="0123456789"></script>

<div class={'w-full'}></div>
`,
    options: {
      printWidth: 60,
    },
  },
  {
    name: '(Non-TS-08) function argument',
    input: `
<!-- ------------------------------------------------------| printWidth=60 (in snapshot) -->
<script zero-one-two-three-four-five-six-seven-eight-nine="0123456789"></script>

<div class={classNames('w-full')}></div>
`,
    options: {
      printWidth: 60,
    },
  },
  {
    name: '(Non-TS-09) object property',
    input: `
<!-- ------------------------------------------------------| printWidth=60 (in snapshot) -->
<script zero-one-two-three-four-five-six-seven-eight-nine="0123456789"></script>

<div class={{ 'w-full': true }}></div>
`,
    options: {
      printWidth: 60,
    },
  },
  {
    name: '(Non-TS-10) ternary operator',
    input: `
<!-- ------------------------------------------------------| printWidth=60 (in snapshot) -->
<script zero-one-two-three-four-five-six-seven-eight-nine="0123456789"></script>

<div class={condition ? 'w-full' : 'w-full'}></div>
`,
    options: {
      printWidth: 60,
    },
  },
  {
    name: '(Non-TS-11) binary operator',
    input: `
<!-- ------------------------------------------------------| printWidth=60 (in snapshot) -->
<script zero-one-two-three-four-five-six-seven-eight-nine="0123456789"></script>

<div class={truthyExpression && 'w-full'}></div>
`,
    options: {
      printWidth: 60,
    },
  },
  {
    name: '(Non-TS-12) multiple class names',
    input: `
<!-- ------------------------------------------------------| printWidth=60 (in snapshot) -->
<script zero-one-two-three-four-five-six-seven-eight-nine="0123456789"></script>

<div class={['w-full', classNames('w-full'), { 'w-full': true }, condition ? 'w-full' : 'w-full', truthyExpression && 'w-full']}></div>
`,
    options: {
      printWidth: 60,
    },
  },
  {
    name: '(Non-TS-13) literal',
    input: `
<!-- ------------------------------------------------------| printWidth=60 (in snapshot) -->
<script>
</script>

<div class={'w-full'}></div>
`,
    options: {
      printWidth: 60,
    },
  },
  {
    name: '(Non-TS-14) function argument',
    input: `
<!-- ------------------------------------------------------| printWidth=60 (in snapshot) -->
<script>
</script>

<div class={classNames('w-full')}></div>
`,
    options: {
      printWidth: 60,
    },
  },
  {
    name: '(Non-TS-15) object property',
    input: `
<!-- ------------------------------------------------------| printWidth=60 (in snapshot) -->
<script>
</script>

<div class={{ 'w-full': true }}></div>
`,
    options: {
      printWidth: 60,
    },
  },
  {
    name: '(Non-TS-16) ternary operator',
    input: `
<!-- ------------------------------------------------------| printWidth=60 (in snapshot) -->
<script>
</script>

<div class={condition ? 'w-full' : 'w-full'}></div>
`,
    options: {
      printWidth: 60,
    },
  },
  {
    name: '(Non-TS-17) binary operator',
    input: `
<!-- ------------------------------------------------------| printWidth=60 (in snapshot) -->
<script>
</script>

<div class={truthyExpression && 'w-full'}></div>
`,
    options: {
      printWidth: 60,
    },
  },
  {
    name: '(Non-TS-18) multiple class names',
    input: `
<!-- ------------------------------------------------------| printWidth=60 (in snapshot) -->
<script>
</script>

<div class={['w-full', classNames('w-full'), { 'w-full': true }, condition ? 'w-full' : 'w-full', truthyExpression && 'w-full']}></div>
`,
    options: {
      printWidth: 60,
    },
  },
  {
    name: '(Non-TS-19) literal',
    input: `
<!-- ------------------------------------------------------| printWidth=60 (in snapshot) -->
<script zero-one-two-three-four-five-six-seven-eight-nine="0123456789">
</script>

<div class={'w-full'}></div>
`,
    options: {
      printWidth: 60,
    },
  },
  {
    name: '(Non-TS-20) function argument',
    input: `
<!-- ------------------------------------------------------| printWidth=60 (in snapshot) -->
<script zero-one-two-three-four-five-six-seven-eight-nine="0123456789">
</script>

<div class={classNames('w-full')}></div>
`,
    options: {
      printWidth: 60,
    },
  },
  {
    name: '(Non-TS-21) object property',
    input: `
<!-- ------------------------------------------------------| printWidth=60 (in snapshot) -->
<script zero-one-two-three-four-five-six-seven-eight-nine="0123456789">
</script>

<div class={{ 'w-full': true }}></div>
`,
    options: {
      printWidth: 60,
    },
  },
  {
    name: '(Non-TS-22) ternary operator',
    input: `
<!-- ------------------------------------------------------| printWidth=60 (in snapshot) -->
<script zero-one-two-three-four-five-six-seven-eight-nine="0123456789">
</script>

<div class={condition ? 'w-full' : 'w-full'}></div>
`,
    options: {
      printWidth: 60,
    },
  },
  {
    name: '(Non-TS-23) binary operator',
    input: `
<!-- ------------------------------------------------------| printWidth=60 (in snapshot) -->
<script zero-one-two-three-four-five-six-seven-eight-nine="0123456789">
</script>

<div class={truthyExpression && 'w-full'}></div>
`,
    options: {
      printWidth: 60,
    },
  },
  {
    name: '(Non-TS-24) multiple class names',
    input: `
<!-- ------------------------------------------------------| printWidth=60 (in snapshot) -->
<script zero-one-two-three-four-five-six-seven-eight-nine="0123456789">
</script>

<div class={['w-full', classNames('w-full'), { 'w-full': true }, condition ? 'w-full' : 'w-full', truthyExpression && 'w-full']}></div>
`,
    options: {
      printWidth: 60,
    },
  },
  {
    name: '(Non-TS-25) literal',
    input: `
<!-- ------------------------------------------------------| printWidth=60 (in snapshot) -->
<script>
  const now = new Date();
</script>

<div class={'w-full'}></div>
`,
    options: {
      printWidth: 60,
    },
  },
  {
    name: '(Non-TS-26) function argument',
    input: `
<!-- ------------------------------------------------------| printWidth=60 (in snapshot) -->
<script>
  const now = new Date();
</script>

<div class={classNames('w-full')}></div>
`,
    options: {
      printWidth: 60,
    },
  },
  {
    name: '(Non-TS-27) object property',
    input: `
<!-- ------------------------------------------------------| printWidth=60 (in snapshot) -->
<script>
  const now = new Date();
</script>

<div class={{ 'w-full': true }}></div>
`,
    options: {
      printWidth: 60,
    },
  },
  {
    name: '(Non-TS-28) ternary operator',
    input: `
<!-- ------------------------------------------------------| printWidth=60 (in snapshot) -->
<script>
  const now = new Date();
</script>

<div class={condition ? 'w-full' : 'w-full'}></div>
`,
    options: {
      printWidth: 60,
    },
  },
  {
    name: '(Non-TS-29) binary operator',
    input: `
<!-- ------------------------------------------------------| printWidth=60 (in snapshot) -->
<script>
  const now = new Date();
</script>

<div class={truthyExpression && 'w-full'}></div>
`,
    options: {
      printWidth: 60,
    },
  },
  {
    name: '(Non-TS-30) multiple class names',
    input: `
<!-- ------------------------------------------------------| printWidth=60 (in snapshot) -->
<script>
  const now = new Date();
</script>

<div class={['w-full', classNames('w-full'), { 'w-full': true }, condition ? 'w-full' : 'w-full', truthyExpression && 'w-full']}></div>
`,
    options: {
      printWidth: 60,
    },
  },
  {
    name: '(Non-TS-31) literal',
    input: `
<!-- ------------------------------------------------------| printWidth=60 (in snapshot) -->
<script zero-one-two-three-four-five-six-seven-eight-nine="0123456789">
  const now = new Date();
</script>

<div class={'w-full'}></div>
`,
    options: {
      printWidth: 60,
    },
  },
  {
    name: '(Non-TS-32) function argument',
    input: `
<!-- ------------------------------------------------------| printWidth=60 (in snapshot) -->
<script zero-one-two-three-four-five-six-seven-eight-nine="0123456789">
  const now = new Date();
</script>

<div class={classNames('w-full')}></div>
`,
    options: {
      printWidth: 60,
    },
  },
  {
    name: '(Non-TS-33) object property',
    input: `
<!-- ------------------------------------------------------| printWidth=60 (in snapshot) -->
<script zero-one-two-three-four-five-six-seven-eight-nine="0123456789">
  const now = new Date();
</script>

<div class={{ 'w-full': true }}></div>
`,
    options: {
      printWidth: 60,
    },
  },
  {
    name: '(Non-TS-34) ternary operator',
    input: `
<!-- ------------------------------------------------------| printWidth=60 (in snapshot) -->
<script zero-one-two-three-four-five-six-seven-eight-nine="0123456789">
  const now = new Date();
</script>

<div class={condition ? 'w-full' : 'w-full'}></div>
`,
    options: {
      printWidth: 60,
    },
  },
  {
    name: '(Non-TS-35) binary operator',
    input: `
<!-- ------------------------------------------------------| printWidth=60 (in snapshot) -->
<script zero-one-two-three-four-five-six-seven-eight-nine="0123456789">
  const now = new Date();
</script>

<div class={truthyExpression && 'w-full'}></div>
`,
    options: {
      printWidth: 60,
    },
  },
  {
    name: '(Non-TS-36) multiple class names',
    input: `
<!-- ------------------------------------------------------| printWidth=60 (in snapshot) -->
<script zero-one-two-three-four-five-six-seven-eight-nine="0123456789">
  const now = new Date();
</script>

<div class={['w-full', classNames('w-full'), { 'w-full': true }, condition ? 'w-full' : 'w-full', truthyExpression && 'w-full']}></div>
`,
    options: {
      printWidth: 60,
    },
  },
  {
    name: '(TS-01) literal',
    input: `
<!-- ------------------------------------------------------| printWidth=60 (in snapshot) -->
<script lang="ts"></script>

<div class={'w-full'}></div>
`,
    options: {
      printWidth: 60,
    },
  },
  {
    name: '(TS-02) function argument',
    input: `
<!-- ------------------------------------------------------| printWidth=60 (in snapshot) -->
<script lang="ts"></script>

<div class={classNames('w-full')}></div>
`,
    options: {
      printWidth: 60,
    },
  },
  {
    name: '(TS-03) object property',
    input: `
<!-- ------------------------------------------------------| printWidth=60 (in snapshot) -->
<script lang="ts"></script>

<div class={{ 'w-full': true }}></div>
`,
    options: {
      printWidth: 60,
    },
  },
  {
    name: '(TS-04) ternary operator',
    input: `
<!-- ------------------------------------------------------| printWidth=60 (in snapshot) -->
<script lang="ts"></script>

<div class={condition ? 'w-full' : 'w-full'}></div>
`,
    options: {
      printWidth: 60,
    },
  },
  {
    name: '(TS-05) binary operator',
    input: `
<!-- ------------------------------------------------------| printWidth=60 (in snapshot) -->
<script lang="ts"></script>

<div class={truthyExpression && 'w-full'}></div>
`,
    options: {
      printWidth: 60,
    },
  },
  {
    name: '(TS-06) multiple class names',
    input: `
<!-- ------------------------------------------------------| printWidth=60 (in snapshot) -->
<script lang="ts"></script>

<div class={['w-full', classNames('w-full'), { 'w-full': true }, condition ? 'w-full' : 'w-full', truthyExpression && 'w-full']}></div>
`,
    options: {
      printWidth: 60,
    },
  },
  {
    name: '(TS-07) literal',
    input: `
<!-- ------------------------------------------------------| printWidth=60 (in snapshot) -->
<script lang="ts" zero-one-two-three-four-five-six-seven-eight-nine="0123456789"></script>

<div class={'w-full'}></div>
`,
    options: {
      printWidth: 60,
    },
  },
  {
    name: '(TS-08) function argument',
    input: `
<!-- ------------------------------------------------------| printWidth=60 (in snapshot) -->
<script lang="ts" zero-one-two-three-four-five-six-seven-eight-nine="0123456789"></script>

<div class={classNames('w-full')}></div>
`,
    options: {
      printWidth: 60,
    },
  },
  {
    name: '(TS-09) object property',
    input: `
<!-- ------------------------------------------------------| printWidth=60 (in snapshot) -->
<script lang="ts" zero-one-two-three-four-five-six-seven-eight-nine="0123456789"></script>

<div class={{ 'w-full': true }}></div>
`,
    options: {
      printWidth: 60,
    },
  },
  {
    name: '(TS-10) ternary operator',
    input: `
<!-- ------------------------------------------------------| printWidth=60 (in snapshot) -->
<script lang="ts" zero-one-two-three-four-five-six-seven-eight-nine="0123456789"></script>

<div class={condition ? 'w-full' : 'w-full'}></div>
`,
    options: {
      printWidth: 60,
    },
  },
  {
    name: '(TS-11) binary operator',
    input: `
<!-- ------------------------------------------------------| printWidth=60 (in snapshot) -->
<script lang="ts" zero-one-two-three-four-five-six-seven-eight-nine="0123456789"></script>

<div class={truthyExpression && 'w-full'}></div>
`,
    options: {
      printWidth: 60,
    },
  },
  {
    name: '(TS-12) multiple class names',
    input: `
<!-- ------------------------------------------------------| printWidth=60 (in snapshot) -->
<script lang="ts" zero-one-two-three-four-five-six-seven-eight-nine="0123456789"></script>

<div class={['w-full', classNames('w-full'), { 'w-full': true }, condition ? 'w-full' : 'w-full', truthyExpression && 'w-full']}></div>
`,
    options: {
      printWidth: 60,
    },
  },
  {
    name: '(TS-13) literal',
    input: `
<!-- ------------------------------------------------------| printWidth=60 (in snapshot) -->
<script lang="ts">
</script>

<div class={'w-full'}></div>
`,
    options: {
      printWidth: 60,
    },
  },
  {
    name: '(TS-14) function argument',
    input: `
<!-- ------------------------------------------------------| printWidth=60 (in snapshot) -->
<script lang="ts">
</script>

<div class={classNames('w-full')}></div>
`,
    options: {
      printWidth: 60,
    },
  },
  {
    name: '(TS-15) object property',
    input: `
<!-- ------------------------------------------------------| printWidth=60 (in snapshot) -->
<script lang="ts">
</script>

<div class={{ 'w-full': true }}></div>
`,
    options: {
      printWidth: 60,
    },
  },
  {
    name: '(TS-16) ternary operator',
    input: `
<!-- ------------------------------------------------------| printWidth=60 (in snapshot) -->
<script lang="ts">
</script>

<div class={condition ? 'w-full' : 'w-full'}></div>
`,
    options: {
      printWidth: 60,
    },
  },
  {
    name: '(TS-17) binary operator',
    input: `
<!-- ------------------------------------------------------| printWidth=60 (in snapshot) -->
<script lang="ts">
</script>

<div class={truthyExpression && 'w-full'}></div>
`,
    options: {
      printWidth: 60,
    },
  },
  {
    name: '(TS-18) multiple class names',
    input: `
<!-- ------------------------------------------------------| printWidth=60 (in snapshot) -->
<script lang="ts">
</script>

<div class={['w-full', classNames('w-full'), { 'w-full': true }, condition ? 'w-full' : 'w-full', truthyExpression && 'w-full']}></div>
`,
    options: {
      printWidth: 60,
    },
  },
  {
    name: '(TS-19) literal',
    input: `
<!-- ------------------------------------------------------| printWidth=60 (in snapshot) -->
<script lang="ts" zero-one-two-three-four-five-six-seven-eight-nine="0123456789">
</script>

<div class={'w-full'}></div>
`,
    options: {
      printWidth: 60,
    },
  },
  {
    name: '(TS-20) function argument',
    input: `
<!-- ------------------------------------------------------| printWidth=60 (in snapshot) -->
<script lang="ts" zero-one-two-three-four-five-six-seven-eight-nine="0123456789">
</script>

<div class={classNames('w-full')}></div>
`,
    options: {
      printWidth: 60,
    },
  },
  {
    name: '(TS-21) object property',
    input: `
<!-- ------------------------------------------------------| printWidth=60 (in snapshot) -->
<script lang="ts" zero-one-two-three-four-five-six-seven-eight-nine="0123456789">
</script>

<div class={{ 'w-full': true }}></div>
`,
    options: {
      printWidth: 60,
    },
  },
  {
    name: '(TS-22) ternary operator',
    input: `
<!-- ------------------------------------------------------| printWidth=60 (in snapshot) -->
<script lang="ts" zero-one-two-three-four-five-six-seven-eight-nine="0123456789">
</script>

<div class={condition ? 'w-full' : 'w-full'}></div>
`,
    options: {
      printWidth: 60,
    },
  },
  {
    name: '(TS-23) binary operator',
    input: `
<!-- ------------------------------------------------------| printWidth=60 (in snapshot) -->
<script lang="ts" zero-one-two-three-four-five-six-seven-eight-nine="0123456789">
</script>

<div class={truthyExpression && 'w-full'}></div>
`,
    options: {
      printWidth: 60,
    },
  },
  {
    name: '(TS-24) multiple class names',
    input: `
<!-- ------------------------------------------------------| printWidth=60 (in snapshot) -->
<script lang="ts" zero-one-two-three-four-five-six-seven-eight-nine="0123456789">
</script>

<div class={['w-full', classNames('w-full'), { 'w-full': true }, condition ? 'w-full' : 'w-full', truthyExpression && 'w-full']}></div>
`,
    options: {
      printWidth: 60,
    },
  },
  {
    name: '(TS-25) literal',
    input: `
<!-- ------------------------------------------------------| printWidth=60 (in snapshot) -->
<script lang="ts">
  const now = new Date();
</script>

<div class={'w-full'}></div>
`,
    options: {
      printWidth: 60,
    },
  },
  {
    name: '(TS-26) function argument',
    input: `
<!-- ------------------------------------------------------| printWidth=60 (in snapshot) -->
<script lang="ts">
  const now = new Date();
</script>

<div class={classNames('w-full')}></div>
`,
    options: {
      printWidth: 60,
    },
  },
  {
    name: '(TS-27) object property',
    input: `
<!-- ------------------------------------------------------| printWidth=60 (in snapshot) -->
<script lang="ts">
  const now = new Date();
</script>

<div class={{ 'w-full': true }}></div>
`,
    options: {
      printWidth: 60,
    },
  },
  {
    name: '(TS-28) ternary operator',
    input: `
<!-- ------------------------------------------------------| printWidth=60 (in snapshot) -->
<script lang="ts">
  const now = new Date();
</script>

<div class={condition ? 'w-full' : 'w-full'}></div>
`,
    options: {
      printWidth: 60,
    },
  },
  {
    name: '(TS-29) binary operator',
    input: `
<!-- ------------------------------------------------------| printWidth=60 (in snapshot) -->
<script lang="ts">
  const now = new Date();
</script>

<div class={truthyExpression && 'w-full'}></div>
`,
    options: {
      printWidth: 60,
    },
  },
  {
    name: '(TS-30) multiple class names',
    input: `
<!-- ------------------------------------------------------| printWidth=60 (in snapshot) -->
<script lang="ts">
  const now = new Date();
</script>

<div class={['w-full', classNames('w-full'), { 'w-full': true }, condition ? 'w-full' : 'w-full', truthyExpression && 'w-full']}></div>
`,
    options: {
      printWidth: 60,
    },
  },
  {
    name: '(TS-31) literal',
    input: `
<!-- ------------------------------------------------------| printWidth=60 (in snapshot) -->
<script lang="ts" zero-one-two-three-four-five-six-seven-eight-nine="0123456789">
  const now = new Date();
</script>

<div class={'w-full'}></div>
`,
    options: {
      printWidth: 60,
    },
  },
  {
    name: '(TS-32) function argument',
    input: `
<!-- ------------------------------------------------------| printWidth=60 (in snapshot) -->
<script lang="ts" zero-one-two-three-four-five-six-seven-eight-nine="0123456789">
  const now = new Date();
</script>

<div class={classNames('w-full')}></div>
`,
    options: {
      printWidth: 60,
    },
  },
  {
    name: '(TS-33) object property',
    input: `
<!-- ------------------------------------------------------| printWidth=60 (in snapshot) -->
<script lang="ts" zero-one-two-three-four-five-six-seven-eight-nine="0123456789">
  const now = new Date();
</script>

<div class={{ 'w-full': true }}></div>
`,
    options: {
      printWidth: 60,
    },
  },
  {
    name: '(TS-34) ternary operator',
    input: `
<!-- ------------------------------------------------------| printWidth=60 (in snapshot) -->
<script lang="ts" zero-one-two-three-four-five-six-seven-eight-nine="0123456789">
  const now = new Date();
</script>

<div class={condition ? 'w-full' : 'w-full'}></div>
`,
    options: {
      printWidth: 60,
    },
  },
  {
    name: '(TS-35) binary operator',
    input: `
<!-- ------------------------------------------------------| printWidth=60 (in snapshot) -->
<script lang="ts" zero-one-two-three-four-five-six-seven-eight-nine="0123456789">
  const now = new Date();
</script>

<div class={truthyExpression && 'w-full'}></div>
`,
    options: {
      printWidth: 60,
    },
  },
  {
    name: '(TS-36) multiple class names',
    input: `
<!-- ------------------------------------------------------| printWidth=60 (in snapshot) -->
<script lang="ts" zero-one-two-three-four-five-six-seven-eight-nine="0123456789">
  const now = new Date();
</script>

<div class={['w-full', classNames('w-full'), { 'w-full': true }, condition ? 'w-full' : 'w-full', truthyExpression && 'w-full']}></div>
`,
    options: {
      printWidth: 60,
    },
  },
  {
    name: '(TS-37) literal',
    input: `
<!-- ------------------------------------------------------| printWidth=60 (in snapshot) -->
<script lang="ts">
  const now: Date = new Date();
</script>

<div class={'w-full'}></div>
`,
    options: {
      printWidth: 60,
    },
  },
  {
    name: '(TS-38) function argument',
    input: `
<!-- ------------------------------------------------------| printWidth=60 (in snapshot) -->
<script lang="ts">
  const now: Date = new Date();
</script>

<div class={classNames('w-full')}></div>
`,
    options: {
      printWidth: 60,
    },
  },
  {
    name: '(TS-39) object property',
    input: `
<!-- ------------------------------------------------------| printWidth=60 (in snapshot) -->
<script lang="ts">
  const now: Date = new Date();
</script>

<div class={{ 'w-full': true }}></div>
`,
    options: {
      printWidth: 60,
    },
  },
  {
    name: '(TS-40) ternary operator',
    input: `
<!-- ------------------------------------------------------| printWidth=60 (in snapshot) -->
<script lang="ts">
  const now: Date = new Date();
</script>

<div class={condition ? 'w-full' : 'w-full'}></div>
`,
    options: {
      printWidth: 60,
    },
  },
  {
    name: '(TS-41) binary operator',
    input: `
<!-- ------------------------------------------------------| printWidth=60 (in snapshot) -->
<script lang="ts">
  const now: Date = new Date();
</script>

<div class={truthyExpression && 'w-full'}></div>
`,
    options: {
      printWidth: 60,
    },
  },
  {
    name: '(TS-42) multiple class names',
    input: `
<!-- ------------------------------------------------------| printWidth=60 (in snapshot) -->
<script lang="ts">
  const now: Date = new Date();
</script>

<div class={['w-full', classNames('w-full'), { 'w-full': true }, condition ? 'w-full' : 'w-full', truthyExpression && 'w-full']}></div>
`,
    options: {
      printWidth: 60,
    },
  },
  {
    name: '(TS-43) literal',
    input: `
<!-- ------------------------------------------------------| printWidth=60 (in snapshot) -->
<script lang="ts" zero-one-two-three-four-five-six-seven-eight-nine="0123456789">
  const now: Date = new Date();
</script>

<div class={'w-full'}></div>
`,
    options: {
      printWidth: 60,
    },
  },
  {
    name: '(TS-44) function argument',
    input: `
<!-- ------------------------------------------------------| printWidth=60 (in snapshot) -->
<script lang="ts" zero-one-two-three-four-five-six-seven-eight-nine="0123456789">
  const now: Date = new Date();
</script>

<div class={classNames('w-full')}></div>
`,
    options: {
      printWidth: 60,
    },
  },
  {
    name: '(TS-45) object property',
    input: `
<!-- ------------------------------------------------------| printWidth=60 (in snapshot) -->
<script lang="ts" zero-one-two-three-four-five-six-seven-eight-nine="0123456789">
  const now: Date = new Date();
</script>

<div class={{ 'w-full': true }}></div>
`,
    options: {
      printWidth: 60,
    },
  },
  {
    name: '(TS-46) ternary operator',
    input: `
<!-- ------------------------------------------------------| printWidth=60 (in snapshot) -->
<script lang="ts" zero-one-two-three-four-five-six-seven-eight-nine="0123456789">
  const now: Date = new Date();
</script>

<div class={condition ? 'w-full' : 'w-full'}></div>
`,
    options: {
      printWidth: 60,
    },
  },
  {
    name: '(TS-47) binary operator',
    input: `
<!-- ------------------------------------------------------| printWidth=60 (in snapshot) -->
<script lang="ts" zero-one-two-three-four-five-six-seven-eight-nine="0123456789">
  const now: Date = new Date();
</script>

<div class={truthyExpression && 'w-full'}></div>
`,
    options: {
      printWidth: 60,
    },
  },
  {
    name: '(TS-48) multiple class names',
    input: `
<!-- ------------------------------------------------------| printWidth=60 (in snapshot) -->
<script lang="ts" zero-one-two-three-four-five-six-seven-eight-nine="0123456789">
  const now: Date = new Date();
</script>

<div class={['w-full', classNames('w-full'), { 'w-full': true }, condition ? 'w-full' : 'w-full', truthyExpression && 'w-full']}></div>
`,
    options: {
      printWidth: 60,
    },
  },
];
