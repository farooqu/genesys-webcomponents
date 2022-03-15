module.exports = {
  multipass: true,
  quiet: true,
  plugins: [
    { name: 'removeStyleElement' },
    {
      name: 'removeAttrs',
      params: {
        attrs: ['style', 'fill', 'height', 'width', 'id', 'class', 'version']
      }
    }
  ]
};
