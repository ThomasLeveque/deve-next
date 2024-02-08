// Change your rules accordingly to your coding style preferencies.
// https://prettier.io/docs/en/options.html
module.exports = {
  semi: true,
  trailingComma: 'es5',
  singleQuote: true,
  printWidth: 120,
  tabWidth: 2,
  useTabs: false,
  // works because prettier plugin tailwind is insiders version https://github.com/tailwindlabs/prettier-plugin-tailwindcss/issues/186
  plugins: ['prettier-plugin-organize-imports', 'prettier-plugin-tailwindcss'],
};
