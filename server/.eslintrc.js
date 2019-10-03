module.exports = {
  extends: 'guo/promise',
  rules: {
    'template-curly-spacing': 'off',
    'array-bracket-spacing': 'off',
    'valid-jsdoc': 'off',
    'no-inline-comments': 'off',
    'promise/avoid-new': 'off',
    'require-atomic-updates': 'off',
  },
  globals: {
    '$': false,
    '_': false,
  }
};
