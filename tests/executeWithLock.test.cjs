const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const ts = require('typescript');

function loadExecuteWithLock() {
  const filePath = path.join(
    __dirname,
    '..',
    'src',
    'hooks',
    'executeWithLock.ts'
  );
  const source = fs.readFileSync(filePath, 'utf8');
  const { outputText } = ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2020,
    },
    fileName: filePath,
  });
  const module = { exports: {} };
  Function('module', 'exports', outputText)(module, module.exports);
  return module.exports.executeWithLock;
}

test('prevents an operation from re-entering while it holds the lock', () => {
  const executeWithLock = loadExecuteWithLock();
  const lock = { value: false };
  let executions = 0;

  executeWithLock(lock, () => {
    executions += 1;
    executeWithLock(lock, () => {
      executions += 1;
    });
  });

  assert.equal(executions, 1);
  assert.equal(lock.value, false);
});

test('releases the lock after the operation throws', () => {
  const executeWithLock = loadExecuteWithLock();
  const lock = { value: false };

  assert.throws(
    () =>
      executeWithLock(lock, () => {
        throw new Error('expected');
      }),
    /expected/
  );
  assert.equal(lock.value, false);
});
