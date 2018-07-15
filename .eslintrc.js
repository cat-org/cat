// @flow

module.exports = {
  extends: ['./packages/eslint-config-cat/lib/index.js'],
  overrides: [
    {
      files: ['__tests__/**/*.js'],
      settings: {
        'import/core-modules': [
          '@cat-org/configs',
          '@cat-org/utils',
          '@cat-org/utils/lib/d3DirTree',
        ],
      },
    },
    {
      files: ['packages/babel-plugin-transform-flow/**/*.js'],
      settings: {
        'import/core-modules': ['mkdirp', '@babel/helper-plugin-utils'],
      },
    },
    {
      files: ['packages/configs/**/*.js'],
      settings: {
        'import/core-modules': ['@cat-org/utils'],
      },
    },
  ],
};
