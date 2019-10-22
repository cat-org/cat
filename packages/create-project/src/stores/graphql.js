// @flow

import memoizeOne from 'memoize-one';
import { emptyFunction } from 'fbjs';

import react from './react';
import relay from './relay';
import Store from './index';

const template = `// @flow

import { version } from '../../package.json';

export default {
  typeDefs: \`
  # The query root of GraphQL interface.
  type Query {
    # The version of GraphQL API.
    version: String!
  }
\`,
  Query: {
    version: () => version,
  },
};`;

const testTemplate = `// @flow

import path from 'path';

import Graphql from '@mikojs/koa-graphql';

import { version } from '../../package.json';

const graphql = new Graphql(path.resolve(__dirname, '../graphql'));

describe('graphql', () => {
  test.each\`
    source           | data
    \${'{ version }'} | \${{ version }}
  \`(
    'query $source',
    async ({ source, data }: {| source: string, data: mixed |}) => {
      expect(await graphql.query({ source })).toEqual({ data });
    },
  );
});`;

/** graphql store */
class Graphql extends Store {
  +subStores = [react, relay];

  storeUseGraphql = false;

  /**
   * @example
   * graphql.checkGraphql()
   */
  +checkGraphql = memoizeOne(
    async (
      useServer: $PropertyType<$PropertyType<Store, 'ctx'>, 'useServer'>,
    ) => {
      if (useServer)
        this.storeUseGraphql = (await this.prompt({
          name: 'useGraphql',
          message: 'use graphql or not',
          type: 'confirm',
          default: false,
        })).useGraphql;
      else this.storeUseGraphql = false;

      this.debug(this.storeUseGraphql);
    },
    emptyFunction.thatReturnsTrue,
  );

  /**
   * @example
   * graphql.start(ctx)
   *
   * @param {Store.ctx} ctx - store context
   */
  +start = async (ctx: $PropertyType<Store, 'ctx'>) => {
    const { useServer } = ctx;

    await this.checkGraphql(useServer);

    // TODO: https://github.com/eslint/eslint/issues/11899
    // eslint-disable-next-line require-atomic-updates
    ctx.useGraphql = this.storeUseGraphql;
  };

  /**
   * @example
   * graphql.end(ctx)
   *
   * @param {Store.ctx} ctx - store context
   */
  +end = async ({ lerna }: $PropertyType<Store, 'ctx'>) => {
    if (!this.storeUseGraphql) return;

    await this.writeFiles({
      'src/graphql/index.js': template,
      'src/__tests__/graphql.js': testTemplate,
    });

    if (lerna) return;

    await this.execa('yarn add graphql @mikojs/koa-graphql');
  };
}

export default new Graphql();
