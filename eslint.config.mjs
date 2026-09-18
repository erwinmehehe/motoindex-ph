import { FlatCompat } from "@eslint/eslintrc";

const compat = new FlatCompat({ baseDirectory: import.meta.dirname });

const eslintConfig = [
  ...compat.config({
    extends: ["next/core-web-vitals", "next/typescript"],
    rules: {
      "react/no-unescaped-entities": "off",
      "@typescript-eslint/no-explicit-any": "warn"
    }
  }),
  {
    files: ["scripts/**/*.cjs"],
    rules: {
      "@typescript-eslint/no-require-imports": "off"
    }
  },
  {
    files: ["app/admin/dealer-leads/page.tsx"],
    rules: {
      "@next/next/no-html-link-for-pages": "off"
    }
  },
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

export default eslintConfig;
