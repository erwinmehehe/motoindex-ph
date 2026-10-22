import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

// Next.js 16 ships native ESLint flat configs. FlatCompat on these configs
// throws a circular-reference error and disables the required CI lint gate.
// Native Next.js flat-config entries scope their plugins to matching files.
// Resolve the exact bundled React Hooks instance for our cross-file rule overrides
// rather than leaving the plugin undefined on files like eslint.config.mjs.
const reactHooksPlugin = nextVitals
  .map((config) => config.plugins?.["react-hooks"])
  .find(Boolean);
if (!reactHooksPlugin) {
  throw new Error("Next.js core-web-vitals no longer exports the React Hooks ESLint plugin.");
}

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    plugins: { "react-hooks": reactHooksPlugin },
    rules: {
      "react/no-unescaped-entities": "off",
      "@typescript-eslint/no-explicit-any": "warn",
      // Next.js 16's React Compiler presets reveal 29 legacy findings in
      // existing public/garage components. Keep visible as warnings and
      // refactor separately under #509 before promoting them back to errors.
      "react-hooks/purity": "warn",
      "react-hooks/set-state-in-effect": "warn",
      "react-hooks/preserve-manual-memoization": "warn"
    }
  },
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
  globalIgnores([
    ".next/**",
    ".open-next/**",
    "out/**",
    "build/**",
    "coverage/**",
    "node_modules/**",
    "public/**",
    "cloudflare-env.d.ts",
    "next-env.d.ts"
  ])
]);

export default eslintConfig;
