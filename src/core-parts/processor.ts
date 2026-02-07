import type { AST } from 'prettier';

import { parseAndAssemble } from './experimental';
import {
  findTargetClassNameNodesForAstro,
  findTargetClassNameNodesBasedOnJavaScript,
  findTargetClassNameNodesBasedOnHtml,
} from './finder';
import { type ClassNameNode, SPACE, TAB } from './utils';

export async function parseLineByLineAndReplaceAsync({
  formattedText,
  ast,
  options,
}: {
  formattedText: string;
  ast: AST;
  options: ResolvedOptions;
}): Promise<string> {
  if (formattedText === '') {
    return formattedText;
  }

  const indentUnit = options.useTabs ? TAB : SPACE.repeat(options.tabWidth);

  let targetClassNameNodes: ClassNameNode[] = [];
  switch (options.parser) {
    case 'babel':
    case 'babel-ts':
    case 'typescript':
    case 'oxc':
    case 'oxc-ts':
    case 'svelte': {
      targetClassNameNodes = findTargetClassNameNodesBasedOnJavaScript(formattedText, ast, options);
      break;
    }
    case 'html':
    case 'angular':
    case 'vue': {
      targetClassNameNodes = findTargetClassNameNodesBasedOnHtml(formattedText, ast, options);
      break;
    }
    case 'astro': {
      targetClassNameNodes = findTargetClassNameNodesForAstro(formattedText, ast, options);
      break;
    }
    default: {
      break;
    }
  }

  return parseAndAssemble(formattedText, indentUnit, targetClassNameNodes, options);
}
