export default [
  {
    files: ["src/**/*.ts", "tests/**/*.ts"],
    languageOptions: {
      ecmaVersion: 2020,
      sourceType: "module",
    },
    rules: {
      "no-unused-vars": ["error", { argsIgnorePattern: "^_" }],
      "no-duplicate-imports": "error",
      "no-console": "off",
      eqeqeq: ["error", "smart"],
    },
  },
];
