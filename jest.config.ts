/**
 * For a detailed explanation regarding each configuration property, visit:
 * https://jestjs.io/docs/configuration
 */

import type { JestConfigWithTsJest } from 'ts-jest';
import path from 'path';

const config: JestConfigWithTsJest = {
  // Добавьте остальные настройки, которые вам нужны
  transform: {
    // '^.+\\.[tj]sx?$' для обработки файлов js/ts с помощью `ts-jest`
    // '^.+\\.m?[tj]sx?$' для обработки файлов js/ts/mjs/mts с помощью `ts-jest`
    '^.+\\.tsx?$': [
      'ts-jest',
      {
        // настройки для ts-jest
      },
    ],
  },
  moduleNameMapper: {
    '^@api$': path.resolve(__dirname, 'src/utils/burger-api.ts'),
    '^@utils-types$': path.resolve(__dirname, 'src/utils/types'),
    // Другие алиасы
  },
  // Дополнительные настройки
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  testEnvironment: 'node',
  roots: ['<rootDir>/src'],
};

export default config;
