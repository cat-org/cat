// @flow

import fs from 'fs';
import path from 'path';

import { declare } from '@babel/helper-plugin-utils';
import { transformSync } from '@babel/core';
import outputFileSync from 'output-file-sync';

export type optionsType = {|
  dir: string,
  relativeRoot: string,
  plugins: $ReadOnlyArray<string>,
  verbose: boolean,
|};

export default declare(
  (
    api: {| assertVersion: (version: number) => void |},
    {
      dir = './lib',
      relativeRoot = './src',
      plugins = [],
      verbose = true,
    }: optionsType,
  ): {} => {
    api.assertVersion(7);

    return {
      post: ({
        opts: { cwd, filename, parserOpts },
        code: content,
      }: {|
        opts: {|
          cwd: string,
          filename: string,
          parserOpts: {},
        |},
        code: string,
      |}) => {
        const { log } = console;
        const filePath = `${path.resolve(
          cwd,
          dir,
          path.relative(path.resolve(cwd, relativeRoot), filename),
        )}.flow`;
        const output = fs.existsSync(`${filename}.flow`)
          ? fs.readFileSync(`${filename}.flow`, 'utf-8')
          : transformSync(content, {
              filename,
              parserOpts,
              plugins,
              babelrc: false,
              configFile: false,
            }).code;

        outputFileSync(
          filePath,
          output.replace(/fixme-flow-file-annotation/, '@flow'),
        );

        if (verbose)
          log(
            `${path.relative(cwd, filename)} -> ${path.relative(
              cwd,
              filePath,
            )}`,
          );
      },
    };
  },
);
