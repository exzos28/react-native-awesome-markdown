module.exports = function (api) {
  // Jest needs to transform React Native's own (Flow-typed) source files,
  // which the build preset below isn't set up to parse.
  if (api.env('test')) {
    return { presets: ['module:@react-native/babel-preset'] };
  }
  return { presets: ['module:react-native-builder-bob/babel-preset'] };
};
