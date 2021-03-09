const { createVuePlugin } = require('vite-plugin-vue2')

module.exports = {
  resolve: {
    alias: {
      '/@': __dirname,
    },
  },
  build: {
    minify: false,
  },
  plugins: [createVuePlugin(/*options*/)],
}