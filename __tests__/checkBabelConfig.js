// @flow

import babelConfigs from '@cat-org/configs/lib/babel';

import rootBabelConfigs from '../babel.config';

it('check babel config', () => {
  /** handle @cat-org/root babel.config.js */
  const plugins = [
    ...rootBabelConfigs.plugins.filter(
      (plugin: string | [string, {}]): boolean =>
        !['transform-imports', '@babel/proposal-class-properties'].includes(
          plugin instanceof Array ? plugin[0] : plugin,
        ),
    ),
    '@cat-org/transform-flow',
  ].sort();

  babelConfigs.plugins.sort();

  expect({
    ...rootBabelConfigs,
    plugins,
    overrides: [],
  }).toEqual(babelConfigs);
});
