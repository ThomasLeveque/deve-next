// Change your rules accordingly to your coding style preferencies.
// https://prettier.io/docs/en/options.html
module.exports = {
  semi: true,
  trailingComma: 'es5',
  singleQuote: true,
  printWidth: 120,
  tabWidth: 2,
  useTabs: false,
  plugins: [require('./merged-prettier-plugin.js')],
};
