module.exports = {
  extends: ['custom'],
  overrides: [
    {
      files: ['doc/src/**/*'],
      rules: {
        '@typescript-eslint/prefer-nullish-coalescing': 'off',
        'import/no-unresolved': 'off',
      },
    },
    {
      files: ['doc/src/demo/**/*'],
      rules: {
        '@typescript-eslint/explicit-function-return-type': 'off',
        '@typescript-eslint/explicit-module-boundary-types': 'off',
        '@typescript-eslint/no-unnecessary-condition': 'off',
        '@typescript-eslint/no-unsafe-call': 'off',
        'import/consistent-type-specifier-style': 'off',
        'import/order': 'off',
        'react/jsx-no-leaked-render': 'off',
        'react/no-multi-comp': 'off',
      },
    },
    {
      files: ['doc/src/react-swift-form/**/*'],
      rules: {
        'react/no-multi-comp': 'off',
      },
    },
    {
      files: ['example-app/tests/**/*'],
      rules: {
        'jest/require-hook': 'off',
        'testing-library/prefer-screen-queries': 'off',
      },
    },
  ],
  parserOptions: {
    project: ['./tsconfig.json'],
  },
  root: true,
  rules: {
    'no-void': 'off',
    'require-atomic-updates': 'off',
  },
};
