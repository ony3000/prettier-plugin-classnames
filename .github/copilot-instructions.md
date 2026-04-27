# Copilot Instructions

## Project Overview

A Prettier plugin that wraps verbose CSS class names (e.g. TailwindCSS) across multiple lines based on the `printWidth` option. It intercepts Prettier's parse step, rewrites class name strings, then lets Prettier re-format the result.

Supported parsers: `babel`, `babel-ts`, `typescript`, `angular`, `html`, `vue`, `css`, `scss`, `less`, `oxc`, `oxc-ts`, `astro`, `svelte`.

## Commands

```bash
pnpm test                        # Run full test suite (Vitest, CI mode)
pnpm run snapshot                # Update Vitest snapshots
pnpm run lint                    # Lint src/ and tests/ with Biome

pnpm test tests/babel/string-literal-basic/absolute.test.ts  # Single test file
pnpm test -t "short enough"  # Filter by test name
```

```bash
pnpm run build        # Bundle + minify → dist/
pnpm run build:plain  # Bundle without minify → dist/
```

## Architecture

```
src/
├── index.ts              # Re-exports options, parsers, printers
├── options.ts            # Plugin option definitions (5 options)
├── parsers.ts            # transformParser() — wraps all 13 Prettier parsers
├── printers.ts           # Minimal printer for FormattedTextAST
└── core-parts/
    ├── utils.ts          # Shared types (ClassNameNode union, NodeRange, constants)
    ├── parser.ts         # advancedParse(); Svelte-specific AST offset refinement (triggered when Svelte script contains TypeScript syntax — the preprocessor inserts a ✂prettier:content✂ attribute that shifts node offsets)
    ├── finder.ts         # AST traversal → ClassNameNode[] (~2,500 lines)
    └── processor.ts      # Wraps/reformats class name strings (~670 lines)
```

**Data flow in `transformParser()`** (parsers.ts):
1. Run Prettier's initial format on the source
2. `advancedParse()` — build parser-specific AST (with Svelte offset fix)
3. `findTargetClassNameNodes*()` — traverse AST, emit `ClassNameNode[]`
4. `parseLineByLineAndReplaceAsync()` — rewrite class name strings with wrapping
5. If the rewrite changed anything, run a second Prettier pass for consistency. If that second pass changes the output again (indentation set during the first wrap can be disrupted), run a third wrap pass.
6. Return a `FormattedTextAST { type: 'FormattedText', body: string }` for the printer

**finder.ts** exports four entry points, one per parser family:
- `findTargetClassNameNodesBasedOnJavaScript()` — babel, ts, svelte, oxc
- `findTargetClassNameNodesBasedOnHtml()` — html, angular, vue
- `findTargetClassNameNodesBasedOnCss()` — css, scss, less
- `findTargetClassNameNodesBasedOnAstro()` — astro

Inside each entry point, the traversal uses a `CaseHandlerContext` that collects `keywordStartingNodes` — AST nodes whose name starts with a supported attribute or function name. These are passed to `filterAndSortClassNameNodes()` (called after traversal) to filter which nodes are actually targeted for wrapping.

For `&&`, `||`, and `??` expressions in class name positions, **only the last operand** is wrapped across multiple lines. Non-last operands are frozen as `PreservingExpressionNode` (`ternary` or `logical`). This is an intentional design decision.

**processor.ts** pipeline inside `parseLineByLineAndReplaceAsync()`:
1. `structuringClassNameNodes()` — build parent→children hierarchy by range containment
2. `linearParse()` — convert hierarchy to sequential tokens (Text / ClassName / Delimiter / Placeholder)
3. `freezeText()` — replace nested expressions with Greek-letter placeholders (hash-keyed) to protect them during reformatting
4. `formatTokens()` — apply wrapping logic per node type and options
5. `unfreezeToken()` — restore frozen placeholders with properly indented content

## Plugin Options

Defined in `src/options.ts`; types in `global.d.ts` as `ThisPluginOptions`:

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `customAttributes` | `string[]` | `[]` | Extra HTML/JSX attributes treated as class names (in addition to built-in `class`, `className`) |
| `customFunctions` | `string[]` | `[]` | Extra function calls whose args are class names (in addition to built-in `classNames`) |
| `endingPosition` | `'absolute' \| 'relative'` | `'absolute'` | `absolute`: line ends at `printWidth` from line start; `relative`: from the non-whitespace text start |
| `syntaxTransformation` | `boolean` | `false` | Convert non-expression syntax to expression syntax when a class name wraps |
| `classnamesPrintWidth` | `number?` | — | Overrides `printWidth` for class name wrapping only |

## Test Conventions

Tests are in `tests/<parser>/<feature>/` and follow a strict 3-file pattern:

```
tests/babel/string-literal-basic/
├── fixtures.ts          # Array of { name, input } — NO output field (snapshot-driven)
├── absolute.test.ts     # Calls testSnapshotEach(fixtures, { ...baseOptions, endingPosition: 'absolute' })
├── relative.test.ts     # Calls testSnapshotEach(fixtures, { ...baseOptions, endingPosition: 'relative' })
└── __snapshots__/       # Auto-generated by Vitest
```

- `testSnapshotEach()` (tests/adaptor.ts) — formats each fixture, compares to snapshot, then **double-formats** to assert idempotency. If the snapshot fails, the idempotency check is skipped.
- `testEach()` — used when expected output is defined inline in `fixtures.ts` as an `output` field.
- `baseOptions` (tests/settings.ts) — standard Prettier defaults; individual tests spread and override.
- When adding a new parser or feature: mirror the folder structure, create the three files, run `pnpm run snapshot` to generate initial snapshots.
- **Every formatter change must preserve idempotency** — formatting twice must equal formatting once.

## Code Conventions

- **Path alias**: `@/` maps to `src/` — use it for all cross-module imports within `src/`
- **Import order** (enforced by `@trivago/prettier-plugin-sort-imports`): third-party → `@/` → relative
- **Formatting**: Prettier (printWidth 100, singleQuote, trailingComma all) — run via editor or `pnpm prettier`
- **Linting**: Biome recommended rules only; Biome formatter is disabled (Prettier owns formatting)
- **TypeScript**: strict mode; target ES2015; no emit (type-check only in source)
- **`ClassNameNode`** is a discriminated union (`AttributeNode | ExpressionNode | UnknownNode | PreservingExpressionNode`) — always use `isTypeof()` (Zod-based helper in utils.ts) for narrowing
  - `UnknownNode` is an **intermediate state** created when a string literal is encountered during traversal; it is resolved into `AttributeNode` or `ExpressionNode` based on ancestor node type
  - `PreservingExpressionNode` (`type: 'ternary' | 'logical'`) is not a class name node itself — it wraps ternary/logical expressions that must be frozen while their last operand is processed
  - `AttributeNode.isTheFirstLineOnTheSameLineAsTheOpeningTag`, `AttributeNode.elementName`, and `ExpressionNode.isItFunctionArgument` are all **`@deprecated`** and planned for removal — do not use in new code
  - `ExpressionNode.shouldKeepDelimiter` is `true` for nodes where the automatic delimiter conversion (single-quote / double-quote / backtick selection) cannot be applied and the original delimiter must be preserved
- **Markdown/MDX** are intentionally unsupported as parsers — the README documents a workaround using `overrides` to prevent unintended formatting in code blocks
