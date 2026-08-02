import { defineConfig, globalIgnores } from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTs from 'eslint-config-next/typescript';
import prettier from 'eslint-plugin-prettier';
import prettierConfig from 'eslint-config-prettier';
import tailwind from 'eslint-plugin-tailwindcss';

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  prettierConfig,
  {
    plugins: {
      prettier: prettier,
    },
    rules: {
      'prettier/prettier': 'error',
    },
  },
  {
    extends: [tailwind.configs.recommended],
    settings: {
      tailwindcss: {
        cssConfigPath: './src/app/globals.css',
      },
    },
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    '.next/**',
    'out/**',
    'build/**',
    'next-env.d.ts',
    'node_modules/**',
    'coverage/**',
    'tina/__generated__/**',
    'public/**',
  ]),
]);

export default eslintConfig;
