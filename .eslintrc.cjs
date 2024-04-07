module.exports = {
    extends: [
        'eslint:recommended',
        'plugin:vue/vue3-recommended',
        'plugin:@typescript-eslint/recommended',
    ],
    parser: 'vue-eslint-parser',
    parserOptions: {
        parser: '@typescript-eslint/parser',
        sourceType: 'module'
    },
    plugins: ['@typescript-eslint'],
    rules: {
        'object-curly-spacing': ['error', 'always'],
        'semi': ['error', 'always'],
        'vue/no-unused-vars': 'error',
        'vue/multi-word-component-names': 'off',
    }
}
