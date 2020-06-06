const path = require('path');
const { VueLoaderPlugin } = require('vue-loader')

module.exports = {
  mode: 'development',
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
      test: /\.s[ac]ss$/i,
      use: [
        // Creates `style` nodes from JS strings
        'style-loader',
        // Translates CSS into CommonJS
        'css-loader',
        // Compiles Sass to CSS
        'sass-loader',
      ],
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
