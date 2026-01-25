import type { AST } from 'prettier';

import { parseAndAssemble } from './experimental';
import {
  findTargetClassNameNodesForBabel,
  findTargetClassNameNodesForTypescript,
  findTargetClassNameNodesForHtml,
  findTargetClassNameNodesForVue,
  findTargetClassNameNodesForAngular,
  findTargetClassNameNodesForAstro,
  findTargetClassNameNodesForSvelte,
  findTargetClassNameNodesForOxc,
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
    case 'astro': {
      targetClassNameNodes = findTargetClassNameNodesForAstro(formattedText, ast, options);
      break;
    }
    case 'svelte': {
      targetClassNameNodes = findTargetClassNameNodesForSvelte(formattedText, ast, options);
      break;
    }
    case 'babel':
    case 'babel-ts': {
      targetClassNameNodes = findTargetClassNameNodesForBabel(ast, options);
      break;
    }
    case 'typescript': {
      targetClassNameNodes = findTargetClassNameNodesForTypescript(ast, options);
      break;
    }
    case 'angular': {
      targetClassNameNodes = findTargetClassNameNodesForAngular(ast, options);
      break;
    }
    case 'html': {
      targetClassNameNodes = findTargetClassNameNodesForHtml(ast, options);
      break;
    }
    case 'vue': {
      targetClassNameNodes = findTargetClassNameNodesForVue(ast, options);
      break;
    }
    case 'oxc':
    case 'oxc-ts': {
      targetClassNameNodes = findTargetClassNameNodesForOxc(ast, options, formattedText);
      break;
    }
    default: {
      break;
    }
  }

  return parseAndAssemble(formattedText, indentUnit, targetClassNameNodes, options);
}
