module.exports = {
  trailingComma: 'all',
  tabWidth: 2,
  semi: false,
  singleQuote: true,
  printWidth: 100,
  plugins: ['prettier-plugin-tailwindcss'],
  tailwindFunctions: ['clsx', 'cn'],
  // Only one stylesheet can be named: the new infoweb's. The archive's own
  // tokens (`archiv/kandidatka2026/archive.css`) sort as unknown classes.
  tailwindStylesheet: './src/app/(web)/web.css',
}
