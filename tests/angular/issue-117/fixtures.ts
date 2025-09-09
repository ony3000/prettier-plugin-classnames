import type { Fixture } from '../../settings';

export const fixtures: Omit<Fixture, 'output'>[] = [
  {
    name: '(1) @defer block',
    input: `
<!-- ------------------------------------------------------| printWidth=60 (in snapshot) -->
@defer {
  <div class="lorem ipsum dolor sit amet consectetur adipiscing elit proin ex massa hendrerit eu posuere"></div>
} @placeholder {
  <div class="lorem ipsum dolor sit amet consectetur adipiscing elit proin ex massa hendrerit eu posuere"></div>
} @loading {
  <div class="lorem ipsum dolor sit amet consectetur adipiscing elit proin ex massa hendrerit eu posuere"></div>
} @error {
  <div class="lorem ipsum dolor sit amet consectetur adipiscing elit proin ex massa hendrerit eu posuere"></div>
}
`,
    options: {
      printWidth: 60,
    },
  },
  {
    name: '(2) @defer block with triggers and parameters',
    input: `
<!-- ------------------------------------------------------| printWidth=60 (in snapshot) -->
@defer (on timer(500ms); prefetch on idle) {
  <div [class]="'lorem ipsum dolor sit amet consectetur adipiscing elit proin ex massa hendrerit eu posuere'"></div>
} @placeholder (minimum 500ms) {
  <div [class]="'lorem ipsum dolor sit amet consectetur adipiscing elit proin ex massa hendrerit eu posuere'"></div>
} @loading (after 100ms; minimum 1s) {
  <div [class]="'lorem ipsum dolor sit amet consectetur adipiscing elit proin ex massa hendrerit eu posuere'"></div>
} @error {
  <div [class]="'lorem ipsum dolor sit amet consectetur adipiscing elit proin ex massa hendrerit eu posuere'"></div>
}
`,
    options: {
      printWidth: 60,
    },
  },
  {
    name: '(3) @for block',
    input: `
<!-- ------------------------------------------------------| printWidth=60 (in snapshot) -->
@for (item of items; track item.name) {
  <div [className]="'lorem ipsum dolor sit amet consectetur adipiscing elit proin ex massa hendrerit eu posuere'"></div>
} @empty {
  <div [className]="'lorem ipsum dolor sit amet consectetur adipiscing elit proin ex massa hendrerit eu posuere'"></div>
}
`,
    options: {
      printWidth: 60,
    },
  },
  {
    name: '(4) @if block',
    input: `
<!-- ------------------------------------------------------| printWidth=60 (in snapshot) -->
@if (a > b) {
  <div [attr.class]="'lorem ipsum dolor sit amet consectetur adipiscing elit proin ex massa hendrerit eu posuere'"></div>
} @else if (b > a) {
  <div [attr.class]="'lorem ipsum dolor sit amet consectetur adipiscing elit proin ex massa hendrerit eu posuere'"></div>
} @else {
  <div [attr.class]="'lorem ipsum dolor sit amet consectetur adipiscing elit proin ex massa hendrerit eu posuere'"></div>
}
`,
    options: {
      printWidth: 60,
    },
  },
  {
    name: '(5) @switch block',
    input: `
<!-- ------------------------------------------------------| printWidth=60 (in snapshot) -->
@switch (condition) {
  @case (caseA) {
    <div [ngClass]="'lorem ipsum dolor sit amet consectetur adipiscing elit proin ex massa hendrerit eu posuere'"></div>
  }
  @case (caseB) {
    <div [ngClass]="'lorem ipsum dolor sit amet consectetur adipiscing elit proin ex massa hendrerit eu posuere'"></div>
  }
  @default {
    <div [ngClass]="'lorem ipsum dolor sit amet consectetur adipiscing elit proin ex massa hendrerit eu posuere'"></div>
  }
}
`,
    options: {
      printWidth: 60,
    },
  },
];
