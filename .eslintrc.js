module.exports = {
    parser: '@typescript-eslint/parser',
    parserOptions: {
        project: 'tsconfig.json',
        tsconfigRootDir: __dirname,
        sourceType: 'module',
    },
    plugins: ['@typescript-eslint/eslint-plugin', 'import'],
    extends: [
        'plugin:@typescript-eslint/recommended',
        'plugin:prettier/recommended',
    ],
    root: true,
    env: {
        node: true,
        jest: true,
    },
    ignorePatterns: ['.eslintrc.js', 'global.d.ts'],
    rules: {
        '@typescript-eslint/interface-name-prefix': 'off',
        '@typescript-eslint/explicit-function-return-type': 'off',
        '@typescript-eslint/explicit-module-boundary-types': 'off',
        '@typescript-eslint/no-explicit-any': 'off',
        '@typescript-eslint/no-empty-interface': 'off',
        'no-plusplus': 'off',
        'no-underscore-dangle': 'off',
        'no-param-reassign': [
            'error',
            {
                props: false,
            },
        ],
        'linebreak-style': 'off',
        'class-methods-use-this': 'off',
        'max-len': [
            'error',
            {
                code: 120,
            },
        ],
        'object-curly-newline': 'off',
        'import/prefer-default-export': 'off',
        'import/no-default-import': 'off',
        '@typescript-eslint/no-unused-vars': 'error',
        'prettier/prettier': [
            'warn',
            {
                endOfLine: 'auto'
            }
        ],
        'spaced-comment': [
            'error',
            'always',
            {
                markers: ['/'],
            },
        ],
        'sort-imports': ['error', {
            'ignoreCase': true,
            'ignoreDeclarationSort': true,
            'ignoreMemberSort': false
        }],
        'import/order': ['error', {
            'groups': ['builtin', 'external', 'internal', 'type', 'sibling', 'index'],
            'newlines-between': 'always',
            'alphabetize': {
                'order': 'asc',
                'caseInsensitive': true
            },
            'pathGroups': [
                {
                    'pattern': './**',
                    'group': 'sibling',
                    'position': 'after'
                },
                {
                    'pattern': 'api/**',
                    'group': 'internal',
                    'position': 'after'
                },
                {
                    'pattern': 'config/**',
                    'group': 'internal',
                    'position': 'after'
                },
                {
                    'pattern': 'constants/**',
                    'group': 'internal',
                    'position': 'after'
                },
                {
                    'pattern': 'controllers/**',
                    'group': 'internal',
                    'position': 'after'
                },
                {
                    'pattern': 'db/**',
                    'group': 'internal',
                    'position': 'after'
                },
                {
                    'pattern': 'middleware/**',
                    'group': 'internal',
                    'position': 'after'
                },
                {
                    'pattern': 'models/**',
                    'group': 'internal',
                    'position': 'after'
                },
                {
                    'pattern': 'repositories/**',
                    'group': 'internal',
                    'position': 'after'
                },
                {
                    'pattern': 'routes/**',
                    'group': 'internal',
                    'position': 'after'
                },
                {
                    'pattern': 'services/**',
                    'group': 'internal',
                    'position': 'after'
                },
                {
                    'pattern': 'types/**',
                    'group': 'internal',
                    'position': 'after'
                },
                {
                    'pattern': 'utils/**',
                    'group': 'internal',
                    'position': 'after'
                }
            ],
            'distinctGroup': false,
            'pathGroupsExcludedImportTypes': ['builtin']
        }]
    },
};
