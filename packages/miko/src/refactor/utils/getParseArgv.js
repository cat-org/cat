// @flow

import chalk from 'chalk';

import commander, {
  type optionsType,
  type defaultOptionsType,
} from '@mikojs/commander';

import { version } from '../../../package.json';

type customOptionsType = {|
  command: string,
|};
type commandsOptionsType = {|
  [string]: defaultOptionsType<customOptionsType>,
|};
type parsedResultType = [];
type parseArgvType = (
  argv: $ReadOnlyArray<string>,
) => Promise<parsedResultType>;

/**
 * @param {commandsOptionsType} commands - prev custom commands
 *
 * @return {commandsOptionsType} - new custom commands
 */
const addAllowUnknownOption = (
  commands: commandsOptionsType,
): commandsOptionsType =>
  Object.keys(commands).reduce(
    (result: commandsOptionsType, key: string) => ({
      ...result,
      [key]: {
        ...commands[key],
        allowUnknownOption: true,
      },
    }),
    {},
  );

/**
 * @param {commandsOptionsType} commands - custom commands
 *
 * @return {optionsType} - commander options
 */
export default (commands: commandsOptionsType): parseArgvType =>
  commander<parsedResultType, customOptionsType>({
    name: 'miko',
    version,
    description: chalk`{cyan Generate configs} in the cache folder and run the {green command} with the keyword.`,
    args: '<commands...>',
    allowUnknownOption: true,
    command: 'generate configs',
    commands: addAllowUnknownOption(commands),
  });
