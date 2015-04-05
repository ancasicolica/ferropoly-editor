module.exports = function (grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    uglify: {
      js: {
        files: {
          './editor/public/js/date.min.js': ['./editor/public/js/date.js'],
          './editor/public/js/editctrl.min.js': ['./editor/public/js/editctrl.js'],
          './editor/public/js/indexctrl.min.js': ['./editor/public/js/indexctrl.js'],
          './editor/public/js/newgamectrl.min.js': ['./editor/public/js/newgamectrl.js'],
          './editor/public/js/playerctrl.min.js': ['./editor/public/js/playerctrl.js'],
          './editor/public/js/pricelistctrl.min.js': ['./editor/public/js/pricelistctrl.js'],
          './editor/public/js/property.min.js': ['./editor/public/js/property.js'],
          './editor/public/js/signupctrl.min.js': ['./editor/public/js/signupctrl.js'],
          './editor/public/js/sortable.min.js': ['./editor/public/js/sortable.js'],
        }
      }
    },
    bump: {
      options: {
        files: ['package.json'],
        updateConfigs: [],
        commit: true,
        commitMessage: 'New version added v%VERSION%',
        commitFiles: ['package.json'],
        createTag: true,
        tagName: 'v%VERSION%',
        tagMessage: 'Version %VERSION%',
        push: true,
        pushTo: 'upstream',
        gitDescribeOptions: '--tags --always --abbrev=1 --dirty=-d',
        globalReplace: false,
        prereleaseName: false,
        regExp: false
      }
    }

  });
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-processhtml');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-bump');
  grunt.registerTask('default', ['uglify:js']);
  grunt.registerTask('minify', ['uglify:js'])
};
