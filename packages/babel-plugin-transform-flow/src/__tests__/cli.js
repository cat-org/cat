// @flow

import path from 'path';

import { resetDestPaths, getDestPaths } from 'output-file-sync';
import chokidar from 'chokidar';

import reset from './__ignore__/reset';
import babel from './__ignore__/babel';
import { root, transformFileOptions, indexFiles } from './__ignore__/constants';

test('verbose: true', () => {
  global.console.log = jest.fn();
  reset({
    ...transformFileOptions,
    verbose: true,
  });
  babel();

  expect(global.console.log).toHaveBeenCalled();
  expect(global.console.log).toHaveBeenCalledTimes(2);
  expect(global.console.log).toHaveBeenCalledWith(
    `${root.replace(/^\.\//, '')}/index.js -> lib/index.js.flow`,
  );
  expect(global.console.log).toHaveBeenCalledWith(
    `${root.replace(
      /^\.\//,
      '',
    )}/justDefinition.js.flow -> lib/justDefinition.js.flow`,
  );
});

describe('watch: true', () => {
  beforeEach(() => {
    reset({
      ...transformFileOptions,
      watch: true,
    });
    resetDestPaths();
    babel();
  });

  it('can watch modifying file', () => {
    expect(getDestPaths()).toEqual(indexFiles);

    chokidar.watchCallback(
      path.resolve(__dirname, './__ignore__/files/justDefinition.js.flow'),
    );
    expect(getDestPaths()).toEqual([
      ...indexFiles,
      'lib/justDefinition.js.flow',
    ]);
  });

  it('modify file is not .js.flow', () => {
    expect(getDestPaths()).toEqual(indexFiles);

    chokidar.watchCallback(
      path.resolve(__dirname, './__ignore__/files/index.js'),
    );
    expect(getDestPaths()).toEqual(indexFiles);
  });
});
