const TsconfigPathsPlugin = require("tsconfig-paths-webpack-plugin");

module.exports = {
  plugins: [
    {
      name: "typescript",
      options: {
        useEslint: true,
        forkTsChecker: {
          tsconfig: "./tsconfig.json",
          tslint: undefined,
          watch: "./src",
          typeCheck: false,
        },
      },
    },
  ],
  modify: (config, { target, dev }, webpack) => {
    const appConfig = config; // stay immutable here

    // TODO: optimize images with image-webpack-loader and url-loader.
    appConfig.module.rules.push({
      test: /\.(md|png|jpg|svg)$/,
      loader: "file-loader",
    });
    appConfig.resolve.plugins = [new TsconfigPathsPlugin()];
    appConfig.externals = [
      {
        sendbird: {
          root: "SendBird",
          commonjs: "sendbird",
          commonjs2: "sendbird",
          amd: "sendbird",
        },
        "firebase/app": {
          root: "firebase",
          commonjs: "firebase",
          commonjs2: "firebase",
          amd: "firebase",
        },
        "firebase/auth": {
          root: "firebase",
          commonjs: "firebase",
          commonjs2: "firebase",
          amd: "firebase",
        },
        "firebase/analytics": {
          root: "firebase",
          commonjs: "firebase",
          commonjs2: "firebase",
          amd: "firebase",
        },
      },
      // function(context, request, callback) {
      //   if (/^@?firebase(\/(.+))?/.test(request)) {
      //     return callback(null, "umd firebase");
      //   }
      //   callback();
      // },
    ];

    return appConfig;
  },
};
