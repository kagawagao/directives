import webpack from 'webpack'
import { argv } from 'yargs'

const coverage_enabled = !argv.watch

const coverage_reporters = [
  { type: 'lcov' }
]

if (coverage_enabled) {
  coverage_reporters.push(
    { type: 'json-summary', file: 'lcov.json' }
  )
} else {
  coverage_reporters.push(
    { type: 'text-summary' }
  )
}

const debug = require('debug')('app:karma')
debug('Create configuration.')

const karmaConfig = {
  basePath: '../../', // project root in relation to bin/karma.js
  files: [
    './node_modules/regenerator-runtime/runtime.js',
    './node_modules/whatwg-fetch/fetch.js',
    './node_modules/sinon/pkg/sinon.js',
    {
      pattern: './test/unit/index.js',
      watched: false,
      served: true,
      included: true
    }
  ],
  proxies: {
    // '/api/': 'http://0.0.0.0:3000/api/'
  },
  singleRun: coverage_enabled,
  frameworks: ['mocha', 'es6-shim'],
  preprocessors: {
    'test/unit/index.js': ['webpack', 'sourcemap']
  },
  reporters: ['mocha', 'coverage'],
  coverageReporter: {
    reporters: coverage_reporters
  },
  browsers: ['Chrome'],
  webpack: {
    devtool: 'inline-source-map',
    resolve: {
      modules: ['.', 'node_modules'],
      extensions: ['.js', '.json', '.vue'],
      alias: {
        vue: 'vue/dist/vue'
      }
    },
    plugins: [
      new webpack.DefinePlugin({}),
      new webpack.LoaderOptionsPlugin({
        debug: true,
        options: {
          context: __dirname
        }
      })
    ],
    module: {
      rules: [
        {
          test: /\.vue$/,
          loader: 'vue-loader',
          options: {
            loaders: {
              js: 'babel-loader'
            }
          }
        },
        {
          test: /\.js$/,
          exclude: /node_modules[/\\](?!platojs)/,
          loader: 'babel-loader'
        },
        {
          test: /\.json$/,
          loader: 'json-loader'
        }
      ]
    },
    node: {
      fs: 'empty',
      net: 'empty'
    },
    performance: {
      hints: false
    }
  },
  webpackMiddleware: {
    noInfo: true
  }
}

export default cfg => cfg.set(karmaConfig)
