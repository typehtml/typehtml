import path = require('path');

export = function(config) {
  config.set({
    basePath: path.join(__dirname, '..', '..', '..'),
    browsers: [
      'Chrome'
    ],
    preprocessors: {
      '**/*': ['webpack']
    },
    webpack: {
      module: {
        loaders: [
          {
            test: /\.tsx?$/,
            loaders: ['ts-loader']
          }
        ]
      },
      resolve: {
        extensions: ['.js', '.ts', '.tsx'],
      },
      performance: {
        hints: false
      }
    },
    webpackMiddleware: {
      stats: 'errors-only',
      noInfo: true
    },
    concurrency: 1,
    browserConsoleLogOptions: {
      terminal: true
    },
    browserDisconnectTimeout: 10000,
    browserDisconnectTolerance: 2,
    browserLogOptions: {
      terminal: true
    },
    browserNoActivityTimeout: 2 * 60 * 1000,
    captureTimeout: 2 * 60 * 10000,
    autoWatch: false,
    singleRun: true
  });

  config.set({
    frameworks: [
      'mocha'
    ],
    files: [
      'lib/tests/karma/tests/**/*.js',
    ],
    reporters: [
      'failed'
    ]
  });

  const ci = String(process.env.CI).match(/^(1|true)$/gi);
  if (ci) {
    const travisLaunchers = {
      Chrome_travis_ci: {
        base: 'Chrome',
        flags: ['--no-sandbox']
      }
    };
    config.set({
      customLaunchers: travisLaunchers,
      browsers: [
        'Firefox',
        'Chrome_travis_ci'
      ]
    });
  }
};
