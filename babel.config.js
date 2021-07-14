module.exports = {
  presets: [
    '@mikojs/miko',
  ],
  plugins: [
    [
      '@babel/proposal-decorators',
      {
        legacy: true,
      },
    ],
    '@babel/proposal-class-properties',
    'add-module-exports',
  ],
};
