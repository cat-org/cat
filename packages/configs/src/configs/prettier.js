// @flow

export default {
  install: (install: $ReadOnlyArray<string>): $ReadOnlyArray<string> => [
    ...install,
    'prettier',
  ],
  config: (): {} => ({
    singleQuote: true,
    trailingComma: 'all',
  }),
  run: (argv: $ReadOnlyArray<string>): $ReadOnlyArray<string> => [
    ...argv,
    '--write',
  ],
};
