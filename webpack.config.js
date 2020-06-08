require('dotenv').config()

const path = require('path');
const { VueLoaderPlugin } = require('vue-loader')
const mode = process.env.ENVIRONMENT

module.exports = {
  mode,
  entry: {
    app: [
      './src/main.js'
    ]
  },
  devServer: {
    contentBase: path.join(__dirname, 'public'),
    port: 8080,
    host: `localhost`,
    compress: true
  },
  output: {
    path: path.join(__dirname, 'public'),
    publicPath: '/',
    filename: `app.js`,
  },
  module: {
    rules: [ {
      test: /\.vue$/,
      loader: 'vue-loader'
    }, {
        test: /\.ya?ml$/,
        type: 'json', // Required by Webpack v4
        use: 'yaml-loader'
      }, {
      test: /\.scss$/,
      use: [
        {
          loader: 'file-loader',
          options: {
            name: 'css/[name].css',
          }
        }, {
          loader: 'extract-loader'
        }, {
          loader: 'css-loader?-url'
        }, {
          loader: 'postcss-loader'
        }, {
          loader: 'sass-loader'
        }
      ]
    }, {
      test: /\.js$/,
      exclude: /(node_modules|bower_components)/,
      use: [
        {
          loader: 'babel-loader',
          options: {
            presets: [
              [
                '@babel/preset-env',
                {
                  'modules': false,//commonjs,amd,umd,systemjs,auto
                  'useBuiltIns': 'usage',
                  'targets': '> 0.25%, not dead',
                  'corejs': 3
                }
              ]
            ]
          }
        }
      ]
    }
    ]
  },
  resolve: {
    alias: {
      'vue$': 'vue/dist/vue.esm.js'
    }
  },
  plugins: [
    new VueLoaderPlugin()
  ]
}
