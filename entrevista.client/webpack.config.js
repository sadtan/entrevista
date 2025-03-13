var path = require("path");
var hwp = require("html-webpack-plugin");
var fs = require("file-system");
var webpack = require("webpack");

module.exports = {
  entry: path.join(__dirname, "/src/index.js"),
  output: {
    publicPath: "/",
    filename: "build.js",
    path: path.join(__dirname, "/dist"),
  },
  module: {
    rules: [
      {
        exclude: /node_modules/,
        test: /\.js$/,
        loader: "babel-loader",
        options: {
          presets: ["@babel/preset-env", "@babel/preset-react"],
        },
      },
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.(png|jpe?g|gif|svg|ttf|woff|otf)$/,
        use: [
          {
            loader: "file-loader",
            options: {
              // name: '[name].[contenthash].[ext]',
              // outputPath: 'static/img',
              esModule: false, // <- here
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new hwp({
      template: path.join(__dirname, "/src/index.html"),
      favicon: path.join(__dirname, "/src/favicon.png")

    }),
    new webpack.DefinePlugin({
      VERSION: JSON.stringify(require("./package.json").version),
      
    }),
  ],
  devServer: {
    port: 4000,
    historyApiFallback: true,
    allowedHosts: "all",
    open: ['/'],
  },
};
