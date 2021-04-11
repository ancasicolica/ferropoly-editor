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

    uglify: {
      js     : {
        files: {
          './editor/public/js/min/accountctrl.min.js'     : ['./editor/public/js/src/accountctrl.js'],
          './editor/public/js/min/adminsctrl.min.js'      : ['./editor/public/js/src/adminsctrl.js'],
          './editor/public/js/min/editctrl.min.js'        : ['./editor/public/js/src/editctrl.js'],
          './editor/public/js/min/newgamectrl.min.js'     : ['./editor/public/js/src/newgamectrl.js'],
          './editor/public/js/min/playerctrl.min.js'      : ['./editor/public/js/src/playerctrl.js'],
          './editor/public/js/min/pricelistctrl.min.js'   : ['./editor/public/js/src/pricelistctrl.js'],
          './editor/public/js/min/property.min.js'        : ['./editor/public/js/src/property.js'],
          './editor/public/js/min/rulesctrl.min.js'       : ['./editor/public/js/src/rulesctrl.js'],
          './editor/public/js/min/signupverifyctrl.min.js': ['./editor/public/js/src/signupverifyctrl.js'],
          './editor/public/js/min/analytics.min.js'       : ['./editor/public/js/src/analytics.js'],
          './editor/public/js/min/loginctrl.min.js'       : ['./editor/public/js/src/loginctrl.js']
        }
      },
      options: {
        unused    : false,
        dead_code : true,
        properties: false,
        beautify  : false,
        compress  : false,
        mangle    : false, // do not rename variables
        banner    : '/*! <%= pkg.name %> V<%= pkg.version %> <%= grunt.template.today("dd-mm-yyyy") %>, (c) Christian Kuster, CH-8342 Wernetshausen, christian@kusti.ch> */\n'

      }
    },
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
        'editor/routes/**/*.js'
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
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-processhtml');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-eslint');
  grunt.loadNpmTasks('grunt-shell');
  grunt.loadNpmTasks('grunt-bump');
  grunt.registerTask('default', ['eslint']);
  grunt.registerTask('minify', ['uglify:js']);
  grunt.registerTask('v:patch', ['bump-only:patch']);
  grunt.registerTask('v:minor', ['bump-only:minor']);
  grunt.registerTask('v:major', ['bump-only:major']);
  grunt.registerTask('demo', ['shell']);
  grunt.registerTask('lint', ['eslint']);
  grunt.loadNpmTasks('grunt-webpack');
};
