// @flow

import path from 'path';

import { emptyFunction } from 'fbjs';

import server, { type contextType } from '@mikojs/server';
import base from '@mikojs/koa-base';
import React from '@mikojs/koa-react';

/**
 * @example
 * server(context)
 *
 * @param {contextType} context - the context of the server
 *
 * @return {object} - http server
 */
export default async ({
  dir,
  dev,
  watch,
  port,
}: contextType): Promise<http$Server> => {
  const react = new React(path.resolve(dir, './pages'), { dev });

  return (
    server.init()
    |> server.use(base)
    |> server.use(await react.middleware())
    |> server.run(port)
    |> (dev && watch
      ? server.watch(dir, [react.update])
      : emptyFunction.thatReturnsArgument)
  );
};
