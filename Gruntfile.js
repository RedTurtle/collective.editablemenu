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
          'dist/editablemenu.css': 'sass/editablemenu.scss',
          'dist/widget.css': 'sass/widget.scss',
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
        src: 'dist/*.css',
      },
    },
    uglify: {
      editablemenu: {
        options: {
          sourceMap: true,
          sourceMapIncludeSources: false,
        },
        files: {
          'dist/editablemenu.min.js': ['dist/editablemenu.js'],
        },
      },
      widget: {
        options: {
          sourceMap: true,
          sourceMapIncludeSources: false,
        },
        files: {
          'dist/widget.min.js': ['dist/widget.js'],
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
            mousetrap: './../../../../../node_modules/mousetrap/mousetrap',
          },
          wrapShim: true,
          name: './js/editablemenu.js',
          exclude: ['jquery'],
          out: './dist/editablemenu.js',
          optimize: 'none',
        },
      },
      widget: {
        options: {
          baseUrl: './',
          generateSourceMaps: true,
          preserveLicenseComments: false,
          paths: {
            jquery: 'empty:',
            'react-widget': './js/widget/build/static/js/main',
          },
          wrapShim: true,
          name: './js/widget.js',
          exclude: ['jquery'],
          out: './dist/widget.js',
          optimize: 'none',
        },
      },
    },
    watch: {
      sass: {
        files: ['sass/**/*.scss'],
        tasks: ['sass', 'postcss'],
      },
      editablemenu: {
        files: ['js/editablemenu.js'],
        tasks: ['requirejs:editablemenu', 'uglify:editablemenu'],
      },
      widget: {
        files: ['js/widget.js', 'js/widget/build/static/**/*.js'],
        tasks: ['requirejs:widget', 'uglify:widget'],
      },
    },
    browserSync: {
      html: {
        bsFiles: {
          src: ['dist/*.css'],
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
          src: ['dist/*.css'],
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

  grunt.registerTask('compile', ['sass', 'postcss', 'requirejs', 'uglify']);
  grunt.registerTask('default', ['watch']);
  grunt.registerTask('bsync', ['browserSync:html', 'watch']);
  grunt.registerTask('plone-bsync', ['browserSync:plone', 'watch']);
};
