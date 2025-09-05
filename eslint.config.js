import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  // global ignore (di luar matcher files)
  globalIgnores(['dist', 'node_modules', 'coverage']),

  {
    files: ['**/*.{js,jsx}'],

    // base + react hooks + vite react-refresh
    extends: [
      js.configs.recommended,
      reactHooks.configs['recommended-latest'],
      reactRefresh.configs.vite,
    ],

    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: globals.browser,
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
    },

    rules: {
      // biar pola "Component"/"Tag" (huruf besar) dan CONST_CAPS tidak ditandai
      'no-unused-vars': ['error', {
        varsIgnorePattern: '^[A-Z_]',
        argsIgnorePattern: '^_',     // function(arg, _unused)
        destructuredArrayIgnorePattern: '^_', // const [_, keep] = arr
      }],

      // opsional: sedikit strict tapi tetap nyaman
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      'prefer-const': 'warn',
    },
  },
])
