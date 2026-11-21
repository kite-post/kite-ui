import pluginVue from 'eslint-plugin-vue'
import vueTsEslintConfig from '@vue/eslint-config-typescript'
import skipFormatting from '@vue/eslint-config-prettier/skip-formatting'

export default [
  {
    name: 'kite/files-to-lint',
    files: ['**/*.{ts,mts,tsx,vue}'],
  },
  {
    name: 'kite/files-to-ignore',
    ignores: ['**/dist/**', '**/coverage/**', '**/node_modules/**', '**/storybook-static/**'],
  },
  // Бібліотека — строгіший набір, ніж у застосунках: компоненти читають усі.
  ...pluginVue.configs['flat/recommended'],
  ...vueTsEslintConfig(),
  {
    name: 'kite/rules',
    rules: {
      // Необов'язковий TS-проп і так undefined; типові undefined ламають exactOptionalPropertyTypes.
      'vue/require-default-prop': 'off',
      '@typescript-eslint/no-unused-vars': ['error', { ignoreRestSiblings: true }],
    },
  },
  skipFormatting,
]
