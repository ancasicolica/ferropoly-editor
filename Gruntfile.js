/**
 * Create a new bugfix version (x.y.++):
 *   grunt v:patch
 *   grunt minify
 *   grunt bump-commit
 *
 * Create a new feature version (x.++.0)
 *   grunt v:minor
 *   grunt minify
 *   grunt bump-commit
 *
 * Create a new major version (++.0.0)
 *   grunt v:major
 *   grunt minify
 *   grunt bump-commit
 *
 * @param grunt
 */
const webpackDevConfig  = require('./editor/webapp/webpack.dev.js');
const webpackProdConfig = require('./editor/webapp/webpack.prod.js');

module.exports = function (grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    bump  : {
      options: {
        files             : ['package.json'],
        updateConfigs     : [],
        commit            : true,
        commitMessage     : 'New version added v%VERSION%',
        commitFiles       : ['-a'],
        tagName           : 'v%VERSION%',
        tagMessage        : 'Version %VERSION%',
        push              : true,
        pushTo            : 'ssh://git@bitbucket.org/christian_kuster/ferropoly_editor.git',
        gitDescribeOptions: '--tags --always --abbrev=1 --dirty=-d',
        globalReplace     : false,
        prereleaseName    : false,
        regExp            : false
      }
    },
    eslint: {
      src    : [
        'server.js',
        'editor/app.js',
        'editor/lib/**/*.js',
        'editor/routes/**/*.js',
        'editor/webapp/**/*.js'
      ],
      options: {
        config: './.eslintrc'
      }
    },
    shell : {
      options: {},
      target : {
        command: './bin/createDemoGame.js'
      }
    },
    webpack: {
      options: {
        stats: !process.env.NODE_ENV || process.env.NODE_ENV === 'development'
      },
      prod   : webpackProdConfig,
      dev    : Object.assign({watch: true}, webpackDevConfig)
    }

  });

  grunt.loadNpmTasks('grunt-eslint');
  grunt.loadNpmTasks('grunt-shell');
  grunt.loadNpmTasks('grunt-bump');
  grunt.registerTask('default', ['eslint']);
  grunt.registerTask('v:patch', ['bump-only:patch']);
  grunt.registerTask('v:minor', ['bump-only:minor']);
  grunt.registerTask('v:major', ['bump-only:major']);
  grunt.registerTask('demo', ['shell']);
  grunt.registerTask('lint', ['eslint']);
  grunt.loadNpmTasks('grunt-webpack');
};
