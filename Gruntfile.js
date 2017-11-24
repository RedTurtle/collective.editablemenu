module.exports = function(grunt) {
  'use strict';
  require('load-grunt-tasks')(grunt);
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    sass: {
      options: {
        sourceMap: true,
        outputStyle: 'compressed',
      },
      build: {
        files: {
          // 'destination': 'source'
          'editablemenu.css': 'sass/editablemenu.scss',
        },
      },
    },
    postcss: {
      options: {
        map: true,
        processors: [
          require('autoprefixer')({
            browsers: ['last 2 versions', 'ie >= 11'],
          }),
        ],
      },
      build: {
        src: '*.css',
      },
    },
    uglify: {
      build: {
        options: {
          sourceMap: true,
          sourceMapIncludeSources: false,
        },
        files: {
          // 'editablemenu.min.js': ['editablemenu.min.js'],
          'editablemenu.min.js': ['editablemenu.js'],
        },
      },
    },
    requirejs: {
      editablemenu: {
        options: {
          baseUrl: './',
          generateSourceMaps: true,
          preserveLicenseComments: false,
          paths: {
            jquery: 'empty:',
          },
          wrapShim: true,
          name: './editablemenu.js',
          exclude: ['jquery'],
          out: './editablemenu.min.js',
          optimize: 'none',
        },
      },
    },
    watch: {
      sass: {
        files: ['sass/**/*.scss'],
        tasks: ['sass', 'postcss'],
      },
      scripts: {
        files: ['editablemenu.js'],
        tasks: [/*'requirejs',*/ 'uglify'],
      },
    },
    browserSync: {
      html: {
        bsFiles: {
          src: ['*.css'],
        },
        options: {
          watchTask: true,
          debugInfo: true,
          online: true,
          server: {
            baseDir: '.',
          },
        },
      },
      plone: {
        bsFiles: {
          src: ['*.css'],
        },
        options: {
          watchTask: true,
          debugInfo: true,
          proxy: 'localhost:8080',
          reloadDelay: 2500,
          reloadDebounce: 1500,
          online: true,
        },
      },
    },
  });

  // CWD to theme folder
  grunt.file.setBase('./src/collective/editablemenu/browser/static');

  grunt.registerTask('compile', ['sass', 'postcss', /*'requirejs',*/ 'uglify']);
  grunt.registerTask('default', ['watch']);
  grunt.registerTask('bsync', ['browserSync:html', 'watch']);
  grunt.registerTask('plone-bsync', ['browserSync:plone', 'watch']);
};
