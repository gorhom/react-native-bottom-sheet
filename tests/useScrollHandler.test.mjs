import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import ts from 'typescript';

const nativeSource = readFileSync(
  new URL('../src/hooks/useScrollHandler.ts', import.meta.url),
  'utf8'
);

const sourceFile = ts.createSourceFile(
  'useScrollHandler.ts',
  nativeSource,
  ts.ScriptTarget.Latest,
  true,
  ts.ScriptKind.TS
);

test('native scroll handlers omit web-only dependency arrays', () => {
  const argumentCounts = [];

  const visit = node => {
    if (
      ts.isCallExpression(node) &&
      ts.isIdentifier(node.expression) &&
      node.expression.text === 'useAnimatedScrollHandler'
    ) {
      argumentCounts.push(node.arguments.length);
    }
    ts.forEachChild(node, visit);
  };

  visit(sourceFile);

  assert.deepEqual(argumentCounts, [1]);
});
