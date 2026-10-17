/**
 * Type declarations for the Cloudflare Workers Builds production Git guard.
 * Kept adjacent to the .mjs implementation so TypeScript resolves the module
 * in both NodeNext and bundler module-resolution modes.
 */
export declare function rejectWorkersGitProductionBuild(
  env?: Readonly<Record<string, string | undefined>>
): void;
