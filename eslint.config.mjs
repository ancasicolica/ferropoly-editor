import globals from 'globals';
import vue from 'eslint-plugin-vue';

export default [
  ...vue.configs['flat/essential'],
  {
    files: ['**/*.js'],
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.browser
      }
    }
  }
];