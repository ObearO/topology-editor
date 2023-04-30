module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true
  },
  globals: { defineOptions: 'writable' },
  extends: ['eslint:recommended', 'plugin:vue/vue3-essential', 'plugin:@typescript-eslint/recommended'],
  overrides: [],
  parser: 'vue-eslint-parser',
  parserOptions: {
    ecmaVersion: 'latest',
    parser: '@typescript-eslint/parser',
    sourceType: 'module'
  },
  plugins: ['vue', '@typescript-eslint'],
  rules: {
    'no-undef': 'off',
    'vue/multi-word-component-names': 'off'
  }
}
