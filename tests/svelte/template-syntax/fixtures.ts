import type { Fixture } from '../../settings';

export const fixtures: Omit<Fixture, 'output'>[] = [
  {
    name: '(1) #if',
    input: `
<!-- ------------------------------------------------------| printWidth=60 (in snapshot) -->
{#if condition}
  <div class="lorem ipsum dolor sit amet consectetur adipiscing elit proin ex massa hendrerit eu posuere eu volutpat id neque pellentesque"></div>
{:else if condition}
  <div class="lorem ipsum dolor sit amet consectetur adipiscing elit proin ex massa hendrerit eu posuere eu volutpat id neque pellentesque"></div>
{:else}
  <div class="lorem ipsum dolor sit amet consectetur adipiscing elit proin ex massa hendrerit eu posuere eu volutpat id neque pellentesque"></div>
{/if}
`,
    options: {
      printWidth: 60,
    },
  },
  {
    name: '(2) #each',
    input: `
<!-- ------------------------------------------------------| printWidth=60 (in snapshot) -->
{#each items as item}
  <div class="lorem ipsum dolor sit amet consectetur adipiscing elit proin ex massa hendrerit eu posuere eu volutpat id neque pellentesque"></div>
{:else}
  <div class="lorem ipsum dolor sit amet consectetur adipiscing elit proin ex massa hendrerit eu posuere eu volutpat id neque pellentesque"></div>
{/each}

{#each items as item, index (key)}
  <div class="lorem ipsum dolor sit amet consectetur adipiscing elit proin ex massa hendrerit eu posuere eu volutpat id neque pellentesque"></div>
{/each}

{#each items as { id, ...rest }}
  <div class="lorem ipsum dolor sit amet consectetur adipiscing elit proin ex massa hendrerit eu posuere eu volutpat id neque pellentesque"></div>
{/each}

{#each items as [id, ...rest]}
  <div class="lorem ipsum dolor sit amet consectetur adipiscing elit proin ex massa hendrerit eu posuere eu volutpat id neque pellentesque"></div>
{/each}
`,
    options: {
      printWidth: 60,
    },
  },
  {
    name: '(3) #key',
    input: `
<!-- ------------------------------------------------------| printWidth=60 (in snapshot) -->
{#key value}
  <div class="lorem ipsum dolor sit amet consectetur adipiscing elit proin ex massa hendrerit eu posuere eu volutpat id neque pellentesque"></div>
{/key}
`,
    options: {
      printWidth: 60,
    },
  },
  {
    name: '(4) #await',
    input: `
<!-- ------------------------------------------------------| printWidth=60 (in snapshot) -->
{#await expression}
  <div class="lorem ipsum dolor sit amet consectetur adipiscing elit proin ex massa hendrerit eu posuere eu volutpat id neque pellentesque"></div>
{:then name}
  <div class="lorem ipsum dolor sit amet consectetur adipiscing elit proin ex massa hendrerit eu posuere eu volutpat id neque pellentesque"></div>
{:catch name}
  <div class="lorem ipsum dolor sit amet consectetur adipiscing elit proin ex massa hendrerit eu posuere eu volutpat id neque pellentesque"></div>
{/await}

{#await expression then name}
  <div class="lorem ipsum dolor sit amet consectetur adipiscing elit proin ex massa hendrerit eu posuere eu volutpat id neque pellentesque"></div>
{/await}

{#await expression catch name}
  <div class="lorem ipsum dolor sit amet consectetur adipiscing elit proin ex massa hendrerit eu posuere eu volutpat id neque pellentesque"></div>
{/await}
`,
    options: {
      printWidth: 60,
    },
  },
];
