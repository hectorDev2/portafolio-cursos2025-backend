// eslint.config.mjs
import globals from 'globals';
import pluginJs from '@eslint/js';
import tseslint from 'typescript-eslint';
import prettier from 'eslint-plugin-prettier';
import configPrettier from 'eslint-config-prettier';

export default tseslint.config(
  {
    // Configuración para ignorar archivos y directorios.
    // Esto es similar a un .eslintignore.
    ignores: ['node_modules/', 'dist/', 'build/', '*.js'],
  },
  pluginJs.configs.recommended, // Reglas recomendadas de ESLint para JavaScript
  ...tseslint.configs.recommended, // Reglas recomendadas de TypeScript ESLint
  configPrettier, // Deshabilita reglas de ESLint que entran en conflicto con Prettier
  {
    // Configuración global para todos los archivos
    languageOptions: {
      // Define las variables globales disponibles en el entorno.
      // 'node': para entornos Node.js
      // 'browser': para entornos de navegador
      globals: {
        ...globals.node,
        ...globals.browser,
      },
      // Configuración del parser de TypeScript.
      parser: tseslint.parser,
      parserOptions: {
        // Ruta a tu archivo tsconfig.json.
        // Esto es crucial para que ESLint realice un análisis de tipo.
        project: './tsconfig.json',
        // Directorio raíz donde se encuentra tsconfig.json.
        tsconfigRootDir: import.meta.dirname,
        sourceType: 'module', // Habilita el uso de módulos ES (import/export)
      },
    },
    // Configuración de plugins específicos.
    plugins: {
      prettier: prettier, // Agrega el plugin de Prettier
    },
    // Reglas personalizadas para tu proyecto.
    rules: {
      // Deshabilita reglas de TypeScript que pueden ser demasiado restrictivas o no necesarias
      // para tu estilo de codificación.
      '@typescript-eslint/interface-name-prefix': 'off',
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-explicit-any': 'off', // Permite el uso de 'any'
      // Reglas de Prettier para asegurar que el código se formatee según Prettier.
      'prettier/prettier': 'error',
      // Puedes ajustar esta regla si el error 'no-unsafe-call' persiste
      // y no puedes resolverlo de otra manera.
      // Es recomendable intentar resolver la causa raíz en lugar de deshabilitar.
      // "@typescript-eslint/no-unsafe-call": "off",
    },
  },
);
