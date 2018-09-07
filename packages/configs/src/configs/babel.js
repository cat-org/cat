// @flow

export default {
  presets: [
    [
      '@babel/env',
      {
        useBuiltIns: 'usage',
      },
    ],
    '@babel/flow',
  ],
  plugins: [
    '@babel/proposal-optional-chaining',
    [
      'module-resolver',
      {
        root: ['./src'],
      },
    ],
    ...(process.env.NODE_ENV === 'test' ? [] : ['@cat-org/transform-flow']),
  ],
  ignore: [],
  overrides: [],
};
