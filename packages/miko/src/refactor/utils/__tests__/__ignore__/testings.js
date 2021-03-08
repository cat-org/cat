// @flow

import { type commandsType } from '../../getCommands';

export type testingType = [string, commandsType];

export default ([
  ['command', [['command']]],
  ['command "command" command', [['command', '"command"', 'command']]],
  [
    'command "command command" command',
    [['command', '"command command"', 'command']],
  ],
  ['command && command', [['command'], ['command']]],
  [
    'command "command && command" command',
    [['command', '"command && command"', 'command']],
  ],
  [
    `command "command 'command && command' command" command`,
    [['command', `"command 'command && command' command"`, 'command']],
  ],
]: $ReadOnlyArray<testingType>);
