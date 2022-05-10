module.exports = (api, config) => {
  if (api) api.cache.never()
  return {
    presets: [
      [
        '@babel/preset-env',
        {
          modules: 'commonjs',
        },
      ],
      '@babel/preset-react',
      '@babel/preset-typescript',
    ],
    plugins: [
      [
        'import',
        {
          libraryName: 'antd',
          style: 'css',
        },
      ],
      ['@babel/plugin-transform-runtime', { corejs: false, helpers: true }],
    ],
  }
}
