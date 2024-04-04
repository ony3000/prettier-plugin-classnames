import { format } from 'prettier';
import type { Fixture } from 'test-settings';
import { baseOptions } from 'test-settings';
import { describe, expect, test } from 'vitest';

// eslint-disable-next-line import/no-extraneous-dependencies
import * as thisPlugin from '@/packages/v2-plugin';

const options = {
  ...baseOptions,
  plugins: ['prettier-plugin-astro', thisPlugin],
  parser: 'astro',
  endingPosition: 'absolute',
};

const fixtures: Fixture[] = [
  {
    name: 'bullet character',
    input: `
---
import SettingsLayout from "@layouts/settings.astro";
import SecurityForm from "./_security";
---

<SettingsLayout
  title="Settings • Details"
  class="flex max-w-[1100px] flex-col gap-4 overflow-x-hidden text-left"
>
  <SecurityForm client:only />
</SettingsLayout>
`,
    output: `---
import SettingsLayout from "@layouts/settings.astro";
import SecurityForm from "./_security";
---

<SettingsLayout
  title="Settings • Details"
  class="flex max-w-[1100px] flex-col gap-4 overflow-x-hidden text-left"
>
  <SecurityForm client:only />
</SettingsLayout>
`,
  },
  {
    name: 'emoji',
    input: `
---
import SettingsLayout from "@layouts/settings.astro";
import SecurityForm from "./_security";
---

<SettingsLayout
  title="Settings ⚙ Details"
  class="flex max-w-[1100px] flex-col gap-4 overflow-x-hidden text-left"
>
  <SecurityForm client:only />
</SettingsLayout>
`,
    output: `---
import SettingsLayout from "@layouts/settings.astro";
import SecurityForm from "./_security";
---

<SettingsLayout
  title="Settings ⚙ Details"
  class="flex max-w-[1100px] flex-col gap-4 overflow-x-hidden text-left"
>
  <SecurityForm client:only />
</SettingsLayout>
`,
  },
  {
    name: 'i18n - Korean',
    input: `
---
import SettingsLayout from "@layouts/settings.astro";
import SecurityForm from "./_security";
---

<SettingsLayout
  title="설정 * 세부정보"
  class="flex max-w-[1100px] flex-col gap-4 overflow-x-hidden text-left"
>
  <SecurityForm client:only />
</SettingsLayout>
`,
    output: `---
import SettingsLayout from "@layouts/settings.astro";
import SecurityForm from "./_security";
---

<SettingsLayout
  title="설정 * 세부정보"
  class="flex max-w-[1100px] flex-col gap-4 overflow-x-hidden text-left"
>
  <SecurityForm client:only />
</SettingsLayout>
`,
  },
];

describe.each(fixtures)('$name', ({ input, output, options: fixtureOptions }) => {
  const fixedOptions = {
    ...options,
    ...(fixtureOptions ?? {}),
  };
  const formattedText = format(input, fixedOptions);

  test('expectation', () => {
    expect(formattedText).toBe(output);
  });

  test.runIf(formattedText === output)('consistency', () => {
    const doubleFormattedText = format(formattedText, fixedOptions);

    expect(doubleFormattedText).toBe(formattedText);
  });
});
