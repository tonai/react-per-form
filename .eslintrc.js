module.exports = {
  extends: ['custom'],
  overrides: [
    {
      files: ['doc/src/**/*'],
      rules: {
        'import/no-unresolved': 'off',
      },
    },
    {
      files: ['doc/src/demo/**/*'],
      rules: {
        '@typescript-eslint/explicit-function-return-type': 'off',
        '@typescript-eslint/explicit-module-boundary-types': 'off',
        'import/consistent-type-specifier-style': 'off',
        'react/jsx-no-leaked-render': 'off',
        'react/no-multi-comp': 'off',
      },
    },
  ],
  parserOptions: {
    project: ['./tsconfig.json'],
  },
  root: true,
};
