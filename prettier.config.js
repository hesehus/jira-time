module.exports = {
    tabWidth: 4,
    printWidth: 120,
    endOfLine: 'crlf',
    overrides: [
        {
            files: ['**/*.js', '**/*.ts', '**/*.jsx', '**/*.tsx'],
            options: {
                singleQuote: true
            }
        }
    ]
};
