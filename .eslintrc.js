module.exports = {
    env: {
        browser: true,
        es6: true,
    },
    extends: ["airbnb-base", "eslint:recommended", "prettier"],
    plugins: ["prettier"],
    parserOptions: {
        ecmaVersion: 2018,
        sourceType: "module",
    },
    overrides: [
        {
            files: ["**/*.spec.js"],
            env: {
                jest: true,
            },
        },
    ],
    rules: {
        "prettier/prettier": [
            "error",
            {
                endOfLine: "auto",
                tabWidth: 4,
                arrowParens: "avoid",
                trailingComma: "all",
            },
        ],
        quotes: ["error", "double"],
        indent: [
            "error",
            4,
            {
                SwitchCase: 1,
            },
        ],
        "no-console": "off",
        "linebreak-style": "off",
        "no-unused-expressions": [
            "error",
            {
                allowShortCircuit: true,
            },
        ],
        "arrow-parens": ["error", "as-needed"],
        "func-names": "off",
        "no-plusplus": [
            "error",
            {
                allowForLoopAfterthoughts: true,
            },
        ],
        "no-param-reassign": [
            "error",
            {
                props: false,
            },
        ],
        "no-underscore-dangle": [
            "error",
            {
                allowAfterThis: true,
            },
        ],
    },
};
