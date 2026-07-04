import type { Fixture } from '../../settings';

export const fixtures: Omit<Fixture, 'output'>[] = [
  {
    name: '(1) module script containing type declaration',
    input: `
<script lang="ts" module>
  export type TabProps = {
    /** Use to lazily load elements in tab. */
    tabLoaded: boolean;
  };
</script>

<script lang="ts">
  import type { Snippet } from "svelte";

  interface Props {
    children?: Snippet;
    class?: string;
  }

  let { children, class: _class }: Props = $props();
</script>

<div class={["p-2 bg-primary-300 gap-2", _class]}>{@render children?.()}</div>
`,
  },
];
