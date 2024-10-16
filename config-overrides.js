module.exports = function override(config, env) {
    config.resolve.fallback = {
      http: require.resolve("stream-http"),
      https: require.resolve("https-browserify"),
      url: require.resolve("url/"),
      util: require.resolve("util/"),
      assert: require.resolve("assert/"),
      stream: require.resolve("stream-browserify"),
    };
    return config;
  };