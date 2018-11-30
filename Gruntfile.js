'use strict';

var _ = require('underscore'),
    envify = require('envify/custom');

module.exports = function(grunt) {

   var DEBUG = !!(grunt.option('debug') || _.contains(grunt.cli.tasks, 'develop'));

   grunt.initConfig({

      pkg: grunt.file.readJSON('package.json'),

      project: {
         src: {
            base: 'src',
            data: {
               base: '<%= project.src.base %>/data',
            },
            js: {
               base: '<%= project.src.base %>/js',
               main: '<%= project.src.js.base %>/main.js',
               thirdparty: [
                  '<%= project.src.js.base %>/thirdparty.js',
               ],
            },
            assets: {
               fontAwesome: 'node_modules/font-awesome/fonts',
            },
            markup: {
               base: '<%= project.src.base %>/markup',
            },
            scss: {
               base: '<%= project.src.base %>/scss',
               all: '<%= project.src.base %>/scss/**/*.scss',
               main: '<%= project.src.scss.base %>/main.scss',
            },
            css: {
               thirdparty: 'node_modules/semantic-ui-css/semantic.css',
            },
         },
         dist: {
            base: 'dist',
            assets: {
               fonts: '<%= project.dist.base %>/fonts',
            },
            css: {
               base: '<%= project.dist.base %>/css',
               main: '<%= project.dist.css.base %>/main.css',
               thirdparty: '<%= project.dist.css.base %>/thirdparty.css',
            },
            js: {
               base: '<%= project.dist.base %>/js',
               main: '<%= project.dist.js.base %>/main.js',
               thirdparty: '<%= project.dist.js.base %>/thirdparty.js',
            },
         },
      },

      browserify: {
         build: {
            files: { '<%= project.dist.js.main %>': [ '<%= project.src.js.main %>' ] },
            options: {
               transform: [
                  [ 'stringify', { minify: false, appliesTo: { includeExtensions: [ '.html' ] } } ],
                  [ envify({ NODE_ENV: DEBUG ? 'development' : 'production' }), { global: true } ],
               ],
            },
         },
         thirdparty: {
            files: { '<%= project.dist.js.thirdparty %>': [ '<%= project.src.js.thirdparty %>' ] },
         },
      },

      uglify: {
         options: {
            banner: '/*! Built: <%= grunt.template.today("yyyy-mm-dd") %> */\n',
            sourceMap: DEBUG,
            sourceMapIncludeSources: DEBUG,
            mangle: !DEBUG,
            compress: !DEBUG,
            beautify: DEBUG,
         },
         build: {
            files: { '<%= project.dist.js.main %>': '<%= project.dist.js.main %>' },
         },
         thirdparty: {
            files: { '<%= project.dist.js.thirdparty %>': '<%= project.dist.js.thirdparty %>' },
         },
      },

      sass: {
         options: {
            sourceMap: DEBUG,
         },

         build: {
            files: { '<%= project.dist.css.main %>': '<%= project.src.scss.main %>' },
         },
      },

      cssmin: {
         options: {
            shorthandCompacting: false,
            roundingPrecision: -1,
         },
         thirdparty: {
            files: { '<%= project.dist.css.thirdparty %>': '<%= project.src.css.thirdparty %>' },
         },
      },

      copy: {
         assets: {
            files: [
               { expand: true, cwd: '<%= project.src.assets.fontAwesome %>', src: '*', dest: '<%= project.dist.assets.fonts %>' },
            ],
         },
         markup: {
            files: [
               { expand: true, cwd: '<%= project.src.markup.base %>', src: 'index.html', dest: '<%= project.dist.base %>' },
            ],
         },
         data: {
            files: [
               { expand: true, cwd: '<%= project.src.data.base %>', src: 'sample-data.json', dest: '<%= project.dist.base %>' },
            ],
         },
      },

      eslint: {
         target: [ 'Gruntfile.js', 'src/**/*.js', 'tests/**/*.js' ],
      },

      sasslint: {
         options: {
            configFile: 'node_modules/sass-lint-config-silvermine/sass-lint.yml',
         },
         target: '<%= project.src.scss.all %>',
      },

      browserSync: {
         bsFiles: {
            src: [
               'dist/**/*.html',
               'dist/**/*.css',
               'dist/**/*.js',
            ],
         },
         options: {
            open: false,
            server: {
               index: 'index.html',
               baseDir: [
                  './dist/',
               ],
            },
            watchTask: true,
         },
      },

      watch: {
         scripts: {
            files: 'Gruntfile.js',
            tasks: [ 'build' ],
         },
         markup: {
            files: '<%= project.src.markup.base %>/**/*.html',
            tasks: [ 'copy:markup' ],
         },
         sass: {
            files: '<%= project.src.scss.base %>/**/*.scss',
            tasks: [ 'sass:build' ],
         },
         js: {
            files: [
               '<%= project.src.js.base %>/**/*.js',
               '<%= project.src.js.base %>/**/*.html',
               '!<%= project.src.js.thirdparty %>',
            ],
            tasks: [ 'browserify:build', 'uglify:build' ],
         },
         thirdparty: {
            files: [ '<%= project.src.js.thirdparty %>', '<%= project.src.css.thirdparty %>' ],
            tasks: [ 'cssmin:thirdparty', 'browserify:thirdparty', 'uglify:thirdparty' ],
         },
      },

   });

   grunt.loadNpmTasks('grunt-browser-sync');
   grunt.loadNpmTasks('grunt-browserify');
   grunt.loadNpmTasks('grunt-contrib-copy');
   grunt.loadNpmTasks('grunt-contrib-cssmin');
   grunt.loadNpmTasks('grunt-contrib-uglify');
   grunt.loadNpmTasks('grunt-contrib-watch');
   grunt.loadNpmTasks('grunt-sass');
   grunt.loadNpmTasks('grunt-sass-lint');
   grunt.loadNpmTasks('grunt-eslint');

   grunt.registerTask('standards', [ 'eslint', 'sasslint' ]);
   grunt.registerTask('build', [
      'copy',
      'sass:build',
      'cssmin:thirdparty',
      'browserify:build',
      'uglify:build',
      'browserify:thirdparty',
      'uglify:thirdparty',
   ]);
   grunt.registerTask('develop', [ 'build', 'browserSync', 'watch' ]);
   grunt.registerTask('default', [ 'standards', 'build' ]);

};
