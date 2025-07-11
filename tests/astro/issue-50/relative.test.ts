import { thisPlugin, testEach } from '../../adaptor';
import type { Fixture } from '../../settings';
import { baseOptions } from '../../settings';

const options = {
  ...baseOptions,
  plugins: ['prettier-plugin-astro', thisPlugin],
  parser: 'astro',
  endingPosition: 'relative',
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
  title="Settings 😂 Details"
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
  title="Settings 😂 Details"
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

testEach(fixtures, options);
