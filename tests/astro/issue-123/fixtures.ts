import type { Fixture } from '../../settings';

export const fixtures: Omit<Fixture, 'output'>[] = [
  {
    name: '(1) JSX inside the callback function must also be wrapped.',
    input: `
---
// example.astro
const navigation = [
  { name: "Home", href: "/" },
  { name: "About", href: "/about" },
];
---

<!-- ---------------------------------------------------------------------------| printWidth=80 (in snapshot) -->
<nav class="flex space-x-2">
  {
    navigation.map((item) => (
      <a
        href={item.href}
        class="hover:[#363636]/80 bg-[#363636] px-3 py-1 font-bold text-zinc-300 transition-[border-radius,colors,background-colors] duration-300 hover:rounded-2xl hover:text-zinc-200 sm:px-4 sm:py-1.5 sm:text-lg"
      >
        {item.name}
      </a>
    ))
  }
</nav>
`,
  },
];
