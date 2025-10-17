// webpack.config.js
const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const basePath = './src/collective/editablemenu/browser/static';

module.exports = {
  entry: {
    editablemenu: [
      path.resolve(__dirname, basePath, 'js/editablemenu.js'),
      path.resolve(__dirname, basePath, 'sass/editablemenu.scss'),
    ],
    widget: [
      path.resolve(__dirname, basePath, 'js/widget.js'),
      path.resolve(__dirname, basePath, 'sass/widget.scss'),
    ],
  },
  output: {
    path: path.resolve(__dirname, basePath, 'dist'),
    // ✅ NOME DEL FILE SEMPRE .min.js
    filename: '[name].min.js',
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: 'babel-loader',
      },
      {
        test: /\.s[ac]ss$/i,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          'postcss-loader',
          {
            loader: 'sass-loader',
            options: {
              implementation: require.resolve('sass'),
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new MiniCssExtractPlugin({
      // ✅ NOME DEL FILE SEMPRE .min.css
      filename: '[name].min.css',
    }),
  ],
  externals: {
    jquery: 'jQuery',
  },
  devtool: 'source-map',
};
