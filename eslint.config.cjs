const js = require("@eslint/js");
const globals = require("globals");
const prettierPlugin = require("eslint-plugin-prettier");
const prettierConfig = require("eslint-config-prettier");

module.exports = [
    {
        ignores: ["node_modules/**"],
    },
    js.configs.recommended,
    {
        files: ["**/*.js"],
        languageOptions: {
            ecmaVersion: 2020,
            sourceType: "module",
            globals: {
                ...globals.browser,
                ...globals.node,
            },
        },
        plugins: {
            prettier: prettierPlugin,
        },
        rules: {
            ...prettierConfig.rules,
            "prettier/prettier": "error",
        },
    },
];
