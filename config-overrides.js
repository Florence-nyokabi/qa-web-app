module.exports = function override(config, env) {
  if (config.resolve) {
    config.resolve.alias = {
      ...config.resolve.alias,
      http: require.resolve('stream-http'),
      https: require.resolve('https-browserify'),
      url: require.resolve('url/'),
      util: require.resolve('util/'),
      assert: require.resolve('assert/'),
      stream: require.resolve('stream-browserify'),
    };
  }
  delete config.resolve.fallback;

  return config;
};
