const kebabCase = '([a-z][a-z0-9]*(-[a-z0-9]+)*)'; // kebab-case

module.exports = {
    'extends': [
        'stylelint-config-standard'
    ],
    plugins: [
        'stylelint-scss'
    ],
    'rules': {
        'indentation': 4,
        'selector-class-pattern': [`^${kebabCase}$`, {
            resolveNestedSelectors: true,
            message: 'Expected class selector in kebab-case naming format (selector-class-pattern)'
        }],
        'scss/dollar-variable-pattern': [`^${kebabCase}$`, {
            message: 'Expected $ variable to be kebab-case (scss/dollar-variable-pattern)'
        }]
    }
};
