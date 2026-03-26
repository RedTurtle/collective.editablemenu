// postcss.config.js
module.exports = {
  plugins: {
    autoprefixer: {
      overrideBrowserslist: ['last 2 versions', 'ie >= 11'],
    },
  },
};
