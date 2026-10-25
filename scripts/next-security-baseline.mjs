// Reviewed patched release lines. Keep this allowlist explicit so an unreviewed
// major upgrade cannot silently pass the production launch security gate.
const MINIMUM_PATCHED_RELEASES = new Map([
  [15, { minor: 5, patch: 24 }],
  [16, { minor: 4, patch: 2 }]
]);

export function meetsNextSecurityBaseline(version) {
  // Reject ranges and prereleases: production dependencies must be exact.
  if (typeof version !== "string" || !/^\d+\.\d+\.\d+$/.test(version)) return false;
  const [major, minor, patch] = version.split(".").map(Number);
  if (![major, minor, patch].every(Number.isSafeInteger)) return false;
  const minimum = MINIMUM_PATCHED_RELEASES.get(major);
  return Boolean(minimum && (minor > minimum.minor ||
    (minor === minimum.minor && patch >= minimum.patch)));
}
