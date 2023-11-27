module.exports = {
  // ignoring files updated with scripts and configs
  ignorePatterns: [".eslintrc.cjs", "*.config.ts", "*.js", "src/*.ts"],
  env: {
    browser: true, // For code running in the browser
    es6: true,
    node: true, // For build scripts and server-side code
  },
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:svelte/recommended",
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: true,
    extraFileExtensions: [".svelte"],
    tsconfigRootDir: __dirname,
  },
  overrides: [
    {
      files: ["*.svelte"],
      parser: "svelte-eslint-parser",
      parserOptions: {
        parser: "@typescript-eslint/parser",
      },
    },
  ],
  rules: {
    "no-restricted-syntax": [
      "error",
      {
        selector: "NewExpression[callee.name='BigNumber']",
        message: "Use src/lib/PrecisionNumber' instead of 'new BigNumber()'",
      },
      {
        selector: "CallExpression[callee.name='BigNumber']",
        message: "Use src/lib/PrecisionNumber instead of 'BigNumber()'",
      },
    ],
    "no-restricted-globals": [
      "error",
      {
        name: "parseFloat",
        message: "Use src/lib/PrecisionNumber instead of parseFloat.",
      },
    ],
    "no-console": ["error", { allow: ["warn", "error"] }],
  },
};
