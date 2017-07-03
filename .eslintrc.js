module.exports = {
  extends: 'airbnb-base',
  env: {
    node: true,
    browser: false
  },
  rules: {
    'arrow-body-style': 'off',
    'comma-dangle': ['warn', 'never'],
    'max-len': 'off',
    'no-underscore-dangle': 'off',
    'no-unused-vars': ['error', { 'argsIgnorePattern': '(next|res)' }],
    'consistent-return': 'off',
    'no-param-reassign': 'off',
    'class-methods-use-this': 'off'
  }
};
