module.exports = function (api) {
  api.cache(true);
  const isTest = process.env.JEST_WORKER_ID !== undefined;
  return {
    presets: ['babel-preset-expo'],
    plugins: isTest ? [] : ['nativewind/babel'],
  };
};