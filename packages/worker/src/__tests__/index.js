// @flow

import path from 'path';

import execa from 'execa';
import getPort from 'get-port';
import findProcess from 'find-process';

import buildWorker from '../index';
import buildServer from '../utils/buildServer';

import { start, func, end } from './__ignore__/worker';

describe('worker', () => {
  test('main server', async () => {
    const expecteds = [
      { key: 'value' },
      ['test'],
      'test',
      '-1',
      '0',
      '1',
      -1,
      0,
      1,
      undefined,
      null,
    ];
    let port: number;

    expecteds.forEach((expected: mixed) => {
      func.mockReturnValueOnce(expected);
    });
    func.mockImplementation(() => {
      throw new Error('error');
    });
    findProcess.mockReturnValue([]);
    execa.mockImplementation((filePath: string, [serverPort]: [number]): {|
      unref: JestMockFn<$ReadOnlyArray<void>, void>,
    |} => {
      buildServer(serverPort).unref();
      port = serverPort;

      return {
        unref: jest.fn(),
      };
    });

    const worker = await buildWorker(
      path.resolve(__dirname, './__ignore__/worker.js'),
    );

    expect(port !== (await getPort({ port }))).toBeTruthy();
    await expecteds.reduce(
      (result: Promise<void>, expected: mixed) =>
        result
          .then(() => worker.func())
          .then((data: mixed) => expect(data).toEqual(expected)),
      Promise.resolve(),
    );
    await expect(worker.func()).rejects.toThrow('error');
    expect(await worker.end()).toBeUndefined();
    expect(start).not.toHaveBeenCalled();
    expect(func).toHaveBeenCalledTimes(expecteds.length + 1);
    expect(end).not.toHaveBeenCalled();
  });

  test('not main server', async () => {
    findProcess.mockReturnValue([{ cmd: `${await getPort()}`, pid: 1 }]);

    await expect(
      buildWorker(path.resolve(__dirname, './__ignore__/worker.js'), 40),
    ).rejects.toThrow('Timeout');
    await expect(
      buildWorker(path.resolve(__dirname, './__ignore__/worker.js'), 40),
    ).rejects.toThrow('Timeout');
  });
});
