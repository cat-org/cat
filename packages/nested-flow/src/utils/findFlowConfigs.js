// @flow

import fs from 'fs';
import path from 'path';

import ini from 'ini';
import chalk from 'chalk';

import { d3DirTree, createLogger } from '@mikojs/utils';
import { type d3DirTreeNodeType } from '@mikojs/utils/lib/d3DirTree';

const logger = createLogger('@mikojs/nest-configs');

/**
 * @example
 * findFlowConfigs()
 *
 * @param {RegExp} exclude - the pattern is used to test the folder
 *
 * @return {Array} - the path array of the nested .flowconfig
 */
export default (
  exclude?: $ReadOnlyArray<RegExp> = [/node_module/, /\.git/, /lib/],
): $ReadOnlyArray<string> =>
  d3DirTree(process.cwd(), {
    extensions: /^$/,
    exclude,
  })
    .leaves()
    .filter(({ data: { name } }: d3DirTreeNodeType) => name === '.flowconfig')
    .map(({ data: { path: filePath }, parent }: d3DirTreeNodeType): string => {
      const config = ini.parse(fs.readFileSync(filePath, 'utf-8'));
      // $FlowFixMe TODO: Flow does not yet support method or property calls in optional chains.
      const childConfigs = (parent?.leaves() || [])
        .filter(
          ({
            data: { name: childName, path: childFilePath },
          }: d3DirTreeNodeType) =>
            childFilePath !== filePath && childName === '.flowconfig',
        )
        .map(
          ({ data: { path: childFilePath } }: d3DirTreeNodeType) =>
            `<PROJECT_ROOT>${path
              .dirname(childFilePath)
              .replace(path.dirname(filePath), '')}`,
        );

      childConfigs.forEach((key: string) => {
        if (!Object.keys(config.ignore).includes(key))
          logger
            .warn(
              chalk`You should add {red ${key}} in the {green ${path.relative(
                process.cwd(),
                filePath,
              )}}`,
            )
            .warn(
              'The root config should ignore the folder which has the .flowconfig',
            );
      });

      return filePath;
    });
