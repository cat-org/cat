// @flow

import fs from 'fs';
import path from 'path';

import { getPackagesSync } from '@lerna/project';

import rimrafSync from './rimrafSync';
import { type packageType } from './types';

/** */
export default async () => {
  await Promise.all(
    getPackagesSync().map(async ({ manifestLocation }: packageType) => {
      const flowconfig = path.resolve(manifestLocation, '../.flowconfig');

      if (
        !fs.existsSync(flowconfig) ||
        !fs.lstatSync(flowconfig).isSymbolicLink()
      )
        return;

      await rimrafSync(flowconfig);
    }),
  );
};
