import { FlatCompat } from "@eslint/eslintrc";

const compat = new FlatCompat({ baseDirectory: import.meta.dirname });

export default [
  ...compat.config({
    extends: ["next/core-web-vitals", "next/typescript"],
    rules: {
      "react/no-unescaped-entities": "off"
    }
  }),
  {
    ignores: [
      ".next/**",
      ".open-next/**",
      "out/**",
      "build/**",
      "coverage/**",
      "node_modules/**",
      "public/**",
      "cloudflare-env.d.ts",
      "next-env.d.ts"
    ]
  }
];
