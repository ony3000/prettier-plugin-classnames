import { z } from 'zod';

import { type NodeRange, isTypeof } from './utils';

// Define schemas once so AST visits reuse schema instances and compiled parsers.

// Common AST structure.

export const nodeTypeSchema = z.object({ type: z.string() });

export const nodeRangeSchema = z.tuple([z.number(), z.number()]);

export const nodeWithRangeSchema = z.object({
  start: z.undefined().optional(),
  end: z.undefined().optional(),
  range: z.custom<NodeRange>((value) => isTypeof(value, nodeRangeSchema)),
});

export const nodeOffsetsSchema = z.object({
  start: z.number(),
  end: z.number(),
});

export const nodeKindSchema = z.object({ kind: z.string() });

// JavaScript, TypeScript, and JSX.

export type JSXOpeningElementNameAsString = {
  type: 'JSXIdentifier';
  name: string;
};

export type JSXOpeningElementNameAsObject = {
  type: 'JSXMemberExpression';
  object: JSXOpeningElementNameAsString | JSXOpeningElementNameAsObject;
  property: JSXOpeningElementNameAsString;
};

export const jsxElementNameSchema: z.ZodType<
  JSXOpeningElementNameAsString | JSXOpeningElementNameAsObject
> = z.union([
  z.object({
    type: z.literal('JSXIdentifier'),
    name: z.string(),
  }),
  z.object({
    type: z.literal('JSXMemberExpression'),
    object: z.lazy(() => jsxElementNameSchema),
    property: z.object({
      type: z.literal('JSXIdentifier'),
      name: z.string(),
    }),
  }),
]);

export const javaScriptCallExpressionSchema = z.object({
  callee: z.object({
    type: z.unknown().optional(),
    name: z.string(),
  }),
});

export const javaScriptConditionalExpressionSchema = z.union([
  z.object({
    loc: z.object({
      start: z.object({
        line: z.number(),
      }),
    }),
    start: z.number().optional(),
    end: z.number().optional(),
  }),
  z.object({
    loc: z.undefined().optional(),
    start: z.number(),
    end: z.number(),
  }),
]);

export const javaScriptFileSchema = z.object({
  comments: z.array(
    z.object({
      type: z.string(),
      value: z.string(),
      start: z.number(),
      end: z.number(),
    }),
  ),
});

export const jsxOpeningElementSchema = z.union([
  z.object({
    loc: z.object({
      start: z.object({
        line: z.number(),
      }),
    }),
    start: z.number().optional(),
    end: z.number().optional(),
    name: jsxElementNameSchema,
  }),
  z.object({
    loc: z.undefined().optional(),
    start: z.number(),
    end: z.number(),
    name: jsxElementNameSchema,
  }),
]);

export const jsxAttributeSchema = z.union([
  z.object({
    loc: z.object({
      start: z.object({
        line: z.number(),
      }),
    }),
    start: z.number().optional(),
    end: z.number().optional(),
    name: z.object({
      type: z.unknown().optional(),
      name: z.string(),
    }),
  }),
  z.object({
    loc: z.undefined().optional(),
    start: z.number(),
    end: z.number(),
    name: z.object({
      type: z.unknown().optional(),
      name: z.string(),
    }),
  }),
]);

export const javaScriptJSXExpressionContainerSchema = z.union([
  z.object({
    loc: z.object({
      start: z.object({
        line: z.number(),
      }),
    }),
    start: z.number().optional(),
    end: z.number().optional(),
  }),
  z.object({
    loc: z.undefined().optional(),
    start: z.number(),
    end: z.number(),
  }),
]);

export const javaScriptLogicalExpressionSchema = z.union([
  z.object({
    loc: z.object({
      start: z.object({
        line: z.number(),
      }),
    }),
    start: z.number().optional(),
    end: z.number().optional(),
  }),
  z.object({
    loc: z.undefined().optional(),
    start: z.number(),
    end: z.number(),
  }),
]);

export const javaScriptObjectPropertySchema = z.object({
  key: z.object({
    start: z.number(),
    end: z.number(),
  }),
});

export const javaScriptStringLiteralSchema = z.object({
  loc: z.object({
    start: z.object({
      line: z.number(),
    }),
  }),
  extra: z.object({
    raw: z.string(),
  }),
  value: z.string(),
});

export const taggedIdentifierOffsetsSchema = z.object({
  tag: z.object({
    type: z.literal('Identifier'),
    name: z.string(),
    start: z.number(),
    end: z.number(),
  }),
});

export const taggedMemberOffsetsSchema = z.object({
  tag: z.object({
    type: z.literal('MemberExpression'),
    start: z.number(),
    end: z.number(),
    object: z.object({
      name: z.string(),
    }),
    property: z.object({
      name: z.string(),
    }),
  }),
});

export const taggedIdentifierRangeSchema = z.object({
  tag: z.object({
    type: z.literal('Identifier'),
    name: z.string(),
    range: z.custom<NodeRange>((value) => isTypeof(value, nodeRangeSchema)),
  }),
});

export const taggedMemberRangeSchema = z.object({
  tag: z.object({
    type: z.literal('MemberExpression'),
    range: z.custom<NodeRange>((value) => isTypeof(value, nodeRangeSchema)),
    object: z.object({
      name: z.string(),
    }),
    property: z.object({
      name: z.string(),
    }),
  }),
});

export const taggedIdentifierSchema = z.object({
  tag: z.object({
    type: z.literal('Identifier'),
    name: z.string(),
  }),
});

export const taggedMemberSchema = z.object({
  tag: z.object({
    type: z.literal('MemberExpression'),
    object: z.object({
      type: z.literal('Identifier'),
      name: z.string(),
    }),
  }),
});

export const taggedCallSchema = z.object({
  tag: z.object({
    type: z.literal('CallExpression'),
    callee: z.object({
      type: z.literal('Identifier'),
      name: z.string(),
    }),
  }),
});

export const javaScriptTemplateLiteralSchema = z.union([
  z.object({
    loc: z.object({
      start: z.object({
        line: z.number(),
      }),
    }),
    start: z.number().optional(),
    end: z.number().optional(),
    quasis: z.array(
      z.object({
        type: z.literal('TemplateElement'),
        value: z.object({
          cooked: z.string(),
        }),
        tail: z.boolean(),
      }),
    ),
  }),
  z.object({
    loc: z.undefined().optional(),
    start: z.number(),
    end: z.number(),
    quasis: z.array(
      z.object({
        type: z.literal('TemplateElement'),
        value: z.object({
          cooked: z.string(),
        }),
        tail: z.boolean(),
      }),
    ),
  }),
]);

export const typeScriptBlockSchema = z.object({
  value: z.string(),
});

export const typeScriptLiteralSchema = z.union([
  z.object({
    value: z.string(),
    loc: z.object({
      start: z.object({
        line: z.number(),
      }),
    }),
    start: z.number().optional(),
    end: z.number().optional(),
    raw: z.string(),
  }),
  z.object({
    value: z.string(),
    loc: z.undefined().optional(),
    start: z.number(),
    end: z.number(),
    raw: z.string(),
  }),
]);

// HTML, Angular, and Vue.

export const htmlAttributeParentSchema = z.object({
  sourceSpan: z.object({
    start: z.object({
      line: z.number(),
    }),
  }),
  name: z.string(),
});

export const htmlAttributeSchema = z.object({
  sourceSpan: z.object({
    start: z.object({
      line: z.number(),
    }),
  }),
  name: z.string(),
  value: z.string(),
  valueSpan: z.object({
    start: z.object({
      offset: z.number(),
    }),
    end: z.object({
      offset: z.number(),
    }),
  }),
});

export const htmlAttributeErrorSchema = z.object({
  message: z.string(),
  loc: z.object({
    start: z.object({
      line: z.number(),
    }),
  }),
});

export const htmlCommentSchema = z.object({
  value: z.string(),
});

export const htmlElementSchema = z.object({
  startSourceSpan: z.object({
    end: z.object({
      line: z.number(),
      offset: z.number(),
    }),
  }),
  name: z.string(),
  children: z.array(
    z.object({
      value: z.string(),
    }),
  ),
  attrs: z.array(
    z.object({
      name: z.string(),
      value: z.unknown().optional(),
    }),
  ),
});

export const angularElementSchema = z.object({
  startSourceSpan: z.object({
    end: z.object({
      line: z.number(),
      offset: z.number(),
    }),
  }),
  name: z.string(),
  children: z.array(
    z.object({
      value: z.string(),
    }),
  ),
});

export const htmlNodeSourceSchema = z.object({
  sourceSpan: z.object({
    start: z.object({
      offset: z.number(),
    }),
    end: z.object({
      offset: z.number(),
    }),
  }),
});

// Svelte.

export const svelteAttributeSchema = z.object({
  name: z.string(),
  value: z.union([
    z.array(
      z.object({
        type: z.string(),
        start: z.number(),
        end: z.number(),
      }),
    ),
    z.object({
      type: z.string(),
      start: z.number(),
      end: z.number(),
    }),
  ]),
});

export const svelteCommentSchema = z.object({
  data: z.string(),
});

export const svelteRefinedScriptSchema = z.object({
  content: z.object({
    start: z.number(),
    end: z.number(),
    loc: z.object({
      start: z.object({
        line: z.number(),
      }),
    }),
    value: z.string(),
  }),
});

export const svelteTextParentSchema = z.object({
  type: z.literal('Attribute'),
  name: z.string(),
});

export const svelteTextSchema = z.object({
  data: z.string(),
  start: z.number(),
});

export const startLineLocationSchema = z.object({
  loc: z.object({
    start: z.object({
      line: z.number(),
    }),
  }),
});

export const endLineLocationSchema = z.object({
  loc: z.object({
    end: z.object({
      line: z.number(),
    }),
  }),
});

// CSS.

export const cssCssAtruleSchema = z.object({
  name: z.literal('apply'),
  nodes: z.undefined().optional(),
  raws: z.object({
    afterName: z.string(),
    params: z.string(),
  }),
  source: z.object({
    start: z.object({
      line: z.number(),
    }),
  }),
});

export const cssCssCommentSchema = z.object({
  text: z.string(),
});

export const cssNodeSourceSchema = z.object({
  source: z.object({
    startOffset: z.number(),
    endOffset: z.number(),
  }),
});

// Astro.

export const astroAttributeParentSchema = z.object({
  position: z.object({
    start: z.object({
      line: z.number(),
    }),
  }),
  name: z.string(),
});

export const astroAttributeSchema = z.object({
  position: z.object({
    start: z.object({
      line: z.number(),
      column: z.number(),
    }),
    end: z
      .object({
        line: z.number(),
        column: z.number(),
      })
      .optional(),
  }),
  kind: z.string(),
  name: z.string(),
  value: z.string(),
});

export const astroCommentSchema = z.object({
  value: z.string(),
});

export const astroElementSchema = z.object({
  name: z.string(),
  children: z.array(
    z.object({
      value: z.string(),
      position: z.object({
        start: z.object({
          line: z.number(),
          offset: z.number(),
        }),
      }),
    }),
  ),
});

export const astroFrontmatterSchema = z.object({
  value: z.string(),
});

export const astroNodePositionSchema = z.object({
  position: z.object({
    start: z.object({
      line: z.number(),
      column: z.number(),
    }),
    end: z
      .object({
        line: z.number(),
        column: z.number(),
      })
      .optional(),
  }),
  name: z.unknown().optional(),
  value: z.unknown().optional(),
});
