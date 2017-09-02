const path = require('path');
const Webpack = require('webpack');

// webpack plugins
const CommonsChunkPlugin = require('webpack/lib/optimize/CommonsChunkPlugin');

module.exports = {

  entry: {
    'js/vendor': './src/app/js/vendor.js',
    'index': './src/app/js/index/bootstrap.js',
    'pages/some-page-1': './src/app/js/some-page-1/bootstrap.js',
    'pages/some-page-2': './src/app/js/some-page-2/bootstrap.js'
  },

  resolve: {
    extensions: ['.js', '.scss'],
    modules: ['node_modules']
  },

  module: {
    rules: [
      {
        enforce: "pre",
        test: /src\/app\/\.js$/,
        exclude: /node_modules/,
        loader: "eslint-loader",
        options: {
          outputReport: {
            filePath: '../../es-style/es-style-errors.xml'
          }
        }
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: "babel-loader",
      },
      {
        test: /\.json$/,
        loader: 'json'
      },

      {
        test: /\.(jpg|png|gif|eot|svg|ttf|woff|woff2)$/,
        loader: 'file',
      }

    ]

  },
  plugins: [
    new Webpack.NamedModulesPlugin(),
    new Webpack.NamedChunksPlugin((chunk) => {
        if (chunk.name) {
            return chunk.name;
        }
        return chunk.modules.map(m => path.relative(m.context, m.request)).join("_");
    }),
    // Put modules common to all modules into a separate chunk!
    new Webpack.optimize.CommonsChunkPlugin({
      names: ["common", "vendor"],
      name: 'common',
      filename: 'js/common.js',
      minChunks: 3
    }),
    // Put common async (lazy) modules into a separate chunk!
    new Webpack.optimize.CommonsChunkPlugin({
      async: "js/common-lazy.js", 
      children: true,
      minChunks: 2
    })
  ]

};