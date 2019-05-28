// @flow

import path from 'path';

export type inquirerResultType = {
  // base
  action: 'overwrite',

  // pkg
  keywords: [string],
  private: boolean,
  [string]: string,

  // npm
  useNpm: boolean,

  // server
  useServer: boolean,

  // react
  useReact: boolean,

  // graphql
  useGraphql: boolean,

  // styles
  useStyles: boolean | 'css' | 'less',
};

export type contextType = {
  lerna?: boolean,
};

// basic
const basicUsage = {
  name: 'basic-usage',
  inquirerResult: {
    // base
    action: 'overwrite',

    // pkg
    private: false,
    description: 'package description',
    homepage: 'http://cat-org/package-homepage',
    repository: 'https://github.com/cat-org/core.git',
    keywords: ['keyword'],

    // npm
    useNpm: false,

    // server
    useServer: false,

    // react
    useReact: false,

    // graphql
    useGraphql: false,

    // useStyles
    useStyles: false,
  },
  cmds: [
    // For getting user information
    'git config --get user.name',
    'git config --get user.email',
    'git config --get user.name',
    'git config --get user.email',

    // Run commands
    'yarn add --dev @cat-org/configs',
    'yarn configs --install babel',
    'yarn configs --install prettier',
    'yarn configs --install lint',
    'yarn configs --install lint-staged',
    'yarn configs --install jest',
    'yarn add --dev flow-bin flow-typed',
    'yarn flow-typed install',

    // check git status
    'git status',
  ],
};

const privatePkg = {
  name: 'private-pkg',
  inquirerResult: {
    ...basicUsage.inquirerResult,
    private: true,
  },
  cmds: basicUsage.cmds,
};

const npmPkg = {
  name: 'npm-pkg',
  inquirerResult: {
    ...basicUsage.inquirerResult,
    useNpm: true,
  },
  cmds: basicUsage.cmds,
};

const basicServer = {
  name: 'basic-server',
  inquirerResult: {
    ...basicUsage.inquirerResult,
    useServer: true,
  },
  cmds: [
    ...basicUsage.cmds.slice(0, 4),
    'yarn add @cat-org/server @cat-org/koa-base',
    ...basicUsage.cmds.slice(4),
  ],
};

const reactServer = {
  name: 'react-server',
  inquirerResult: {
    ...basicUsage.inquirerResult,
    useServer: true,
    useReact: true,
  },
  cmds: [
    ...basicUsage.cmds.slice(0, 4),
    'yarn add @cat-org/server @cat-org/koa-base',
    ...basicUsage.cmds.slice(4, 10),
    'yarn add --dev enzyme-adapter-react-16',
    ...basicUsage.cmds.slice(10, 11),
    'yarn add react react-dom @cat-org/koa-react',
    'yarn add --dev @babel/preset-react',
    'yarn add --dev node-fetch',
    ...basicUsage.cmds.slice(11),
  ],
};

const reactServerWithCss = {
  name: 'react-server-with-css',
  inquirerResult: {
    ...basicUsage.inquirerResult,
    useServer: true,
    useReact: true,
    useStyles: 'css',
  },
  cmds: [
    ...basicUsage.cmds.slice(0, 4),
    'yarn add @cat-org/server @cat-org/koa-base',
    ...basicUsage.cmds.slice(4, 10),
    'yarn add --dev enzyme-adapter-react-16',
    ...basicUsage.cmds.slice(10, 11),
    'yarn add react react-dom @cat-org/koa-react',
    'yarn add --dev @babel/preset-react',
    'yarn add @cat-org/use-css',
    'yarn add --dev babel-plugin-css-modules-transform @cat-org/import-css',
    'yarn add --dev node-fetch',
    ...basicUsage.cmds.slice(11),
  ],
};

const reactServerWithLess = {
  name: 'react-server-with-less',
  inquirerResult: {
    ...basicUsage.inquirerResult,
    useServer: true,
    useReact: true,
    useStyles: 'less',
  },
  cmds: [
    ...basicUsage.cmds.slice(0, 4),
    'yarn add @cat-org/server @cat-org/koa-base',
    ...basicUsage.cmds.slice(4, 10),
    'yarn add --dev enzyme-adapter-react-16',
    ...basicUsage.cmds.slice(10, 11),
    'yarn add react react-dom @cat-org/koa-react',
    'yarn add --dev @babel/preset-react',
    'yarn add @cat-org/use-less',
    'yarn add --dev babel-plugin-css-modules-transform @cat-org/import-css',
    'yarn add --dev node-fetch',
    ...basicUsage.cmds.slice(11),
  ],
};

const graphqlServer = {
  name: 'graphql-server',
  inquirerResult: {
    ...basicUsage.inquirerResult,
    useServer: true,
    useGraphql: true,
  },
  cmds: [
    ...basicUsage.cmds.slice(0, 4),
    'yarn add @cat-org/server @cat-org/koa-base',
    ...basicUsage.cmds.slice(4, 11),
    'yarn add @cat-org/koa-graphql',
    'yarn add --dev node-fetch',
    ...basicUsage.cmds.slice(11),
  ],
};

// with --lerna
const lernaBasicUsage = {
  name: 'lerna/basic-usage',
  inquirerResult: basicUsage.inquirerResult,
  cmds: basicUsage.cmds.slice(0, 4),
  context: {
    lerna: true,
  },
};

const lernaPrivatePkg = {
  name: 'lerna/private-pkg',
  inquirerResult: {
    ...lernaBasicUsage.inquirerResult,
    private: true,
  },
  cmds: lernaBasicUsage.cmds,
  context: {
    lerna: true,
  },
};

const lernaNpmPkg = {
  name: 'lerna/npm-pkg',
  inquirerResult: {
    ...lernaBasicUsage.inquirerResult,
    useNpm: true,
  },
  cmds: lernaBasicUsage.cmds,
  context: {
    lerna: true,
  },
};

const lernaBasicServer = {
  name: 'lerna/basic-server',
  inquirerResult: {
    ...lernaBasicUsage.inquirerResult,
    useServer: true,
  },
  cmds: lernaBasicUsage.cmds,
  context: {
    lerna: true,
  },
};

const lernaReactServer = {
  name: 'lerna/react-server',
  inquirerResult: {
    ...lernaBasicUsage.inquirerResult,
    useServer: true,
    useReact: true,
  },
  cmds: lernaBasicUsage.cmds,
  context: {
    lerna: true,
  },
};

const lernaReactServerWithCss = {
  name: 'lerna/react-server-with-css',
  inquirerResult: {
    ...lernaBasicUsage.inquirerResult,
    useServer: true,
    useReact: true,
    useStyles: 'css',
  },
  cmds: lernaBasicUsage.cmds,
  context: {
    lerna: true,
  },
};

const lernaReactServerWithLess = {
  name: 'lerna/react-server-with-less',
  inquirerResult: {
    ...lernaBasicUsage.inquirerResult,
    useServer: true,
    useReact: true,
    useStyles: 'less',
  },
  cmds: lernaBasicUsage.cmds,
  context: {
    lerna: true,
  },
};

const lernaGraphqlServer = {
  name: 'lerna/graphql-server',
  inquirerResult: {
    ...lernaBasicUsage.inquirerResult,
    useServer: true,
    useGraphql: true,
  },
  cmds: lernaBasicUsage.cmds,
  context: {
    lerna: true,
  },
};

export default [
  basicUsage,
  privatePkg,
  npmPkg,
  basicServer,
  reactServer,
  reactServerWithCss,
  reactServerWithLess,
  graphqlServer,

  lernaBasicUsage,
  lernaPrivatePkg,
  lernaNpmPkg,
  lernaBasicServer,
  lernaReactServer,
  lernaReactServerWithCss,
  lernaReactServerWithLess,
  lernaGraphqlServer,
].reduce(
  (
    result: $ReadOnlyArray<
      [string, string, inquirerResultType, $ReadOnlyArray<string>, contextType],
    >,
    {
      name,
      inquirerResult,
      cmds,
      context = {},
    }: {|
      name: string,
      inquirerResult: inquirerResultType,
      cmds: $ReadOnlyArray<string>,
      context?: contextType,
    |},
  ) => [
    ...result,
    [name, path.resolve(__dirname, name), inquirerResult, cmds, context],
  ],
  [],
);
