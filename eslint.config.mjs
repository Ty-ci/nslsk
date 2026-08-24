import { createNextConfig } from '@bratislava/eslint-config-next'

export default [
  ...createNextConfig({
    // The preset already ignores .next/**, build/**, node_modules/**, config
    // files and eslint.config.* — add project-specific paths here as needed.
    ignores: [
      '**/*.md', // don't lint Markdown as code (preset's JS rules aren't md-scoped)
      '.prettierrc.js', // config file, not part of the TS project
    ],
  }),
  // https://github.com/bratislava/eslint-config/blob/main/packages/next/README.md#tailwind-css
  {
    settings: {
      'better-tailwindcss': {
        entryPoint: './src/app/globals.css',
        callees: ['cx', 'classnames', 'clsx', 'cn', 'twMerge', 'tw'],
      },
    },
  },

  // Project-specific rule overrides
  {
    rules: {
      'jsx-a11y/anchor-is-valid': 'off',
      'no-multi-spaces': 'error',

      'better-tailwindcss/enforce-consistent-line-wrapping': 'off',

      // The two images on the site are an inline SVG mark and a Google Drive
      // thumbnail with an onError fallback — neither gains from `next/image`.
      '@next/next/no-img-element': 'off',

      // The site is Slovak-only and has no i18n layer: the copy that isn't in
      // `_data/content.ts` is written straight into the markup, on purpose.
      'i18next/no-literal-string': 'off',

      // Good rules that tend to need cleanup work — kept as warnings
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unsafe-enum-comparison': 'off',
      '@typescript-eslint/no-unsafe-assignment': 'off',
      '@typescript-eslint/no-unsafe-argument': 'off',
      '@typescript-eslint/consistent-type-definitions': 'off',
      '@typescript-eslint/array-type': 'off',
      '@typescript-eslint/no-redundant-type-constituents': 'off',
      '@typescript-eslint/promise-function-async': 'off',
      '@typescript-eslint/restrict-template-expressions': 'off',
      'sonarjs/slow-regex': 'off',
      'sonarjs/prefer-regexp-exec': 'off',
      'security/detect-unsafe-regex': 'off',
      'security/detect-object-injection': 'off',
      'no-implicit-coercion': 'off',

      '@typescript-eslint/no-unused-vars': 'warn',
      '@typescript-eslint/no-unnecessary-condition': 'warn',
      'padding-line-between-statements': 'warn',
      'react/no-array-index-key': 'warn',
      '@typescript-eslint/no-unsafe-member-access': 'warn',
      '@typescript-eslint/require-await': 'warn',
      'sonarjs/no-ignored-exceptions': 'warn',
      '@typescript-eslint/no-unsafe-call': 'warn',
      '@typescript-eslint/no-floating-promises': 'warn',
      '@typescript-eslint/no-invalid-void-type': 'warn',
      '@typescript-eslint/consistent-indexed-object-style': 'warn',
      '@typescript-eslint/use-unknown-in-catch-callback-variable': 'warn',
      '@typescript-eslint/no-shadow': 'warn',
      '@typescript-eslint/no-unsafe-return': 'warn',
      '@typescript-eslint/prefer-enum-initializers': 'warn',
      'react/no-unused-prop-types': 'warn',
      'sonarjs/function-return-type': 'warn',
      'react/jsx-key': 'warn',
      '@typescript-eslint/no-misused-spread': 'warn',
      'sonarjs/cognitive-complexity': 'warn',
      '@typescript-eslint/no-duplicate-type-constituents': 'warn',
      '@typescript-eslint/no-non-null-assertion': 'warn',
      'sonarjs/no-clear-text-protocols': 'warn',
      '@typescript-eslint/switch-exhaustiveness-check': 'warn',
      '@typescript-eslint/no-useless-default-assignment': 'warn',
      '@typescript-eslint/no-deprecated': 'warn',
      'react-hooks/set-state-in-effect': 'warn',
      '@typescript-eslint/no-unnecessary-type-parameters': 'warn',
      'sonarjs/no-nested-functions': 'warn',
      '@typescript-eslint/no-dynamic-delete': 'warn',
      'react-hooks/static-components': 'warn',
      'sonarjs/no-undefined-argument': 'warn',
      'sonarjs/fixme-tag': 'warn',
      '@typescript-eslint/no-base-to-string': 'warn',
    },
  },
]
