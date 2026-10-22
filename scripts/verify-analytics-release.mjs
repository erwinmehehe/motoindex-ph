// Fail closed before a production build or deploy if analytics activation is inconsistent.
// Approval under issue #466 also requires independent GA4, consent and private-navigation QA.
const env = process.env;
const requested = env.MOTOINDEX_ANALYTICS_SAFE_ENABLE || "false";
const approved = env.MOTOINDEX_ANALYTICS_RELEASE_GATES_APPROVED || "false";
const buildFlag = env.NEXT_PUBLIC_ANALYTICS_SAFE_ENABLE || "false";
const gaId = (env.NEXT_PUBLIC_GA_MEASUREMENT_ID || "").trim().toUpperCase();
const plausible = (env.NEXT_PUBLIC_PLAUSIBLE_SCRIPT_SRC || "").trim();

function fail(reason) {
  console.error("Analytics release blocked: " + reason);
  process.exitCode = 1;
}
const validBoolean = value => value === "true" || value === "false";
if (![requested, approved, buildFlag].every(validBoolean)) {
  fail("analytics release flags must each be exactly true or false.");
} else if (requested === "true" && approved !== "true") {
  fail("analytics requested without the independent #466 release approval.");
} else if (buildFlag !== (requested === "true" && approved === "true" ? "true" : "false")) {
  fail("NEXT_PUBLIC_ANALYTICS_SAFE_ENABLE does not match the two owner-controlled release gates.");
} else if (requested === "true" && !/^G-[A-Z0-9]{5,20}$/.test(gaId)) {
  fail("a verified MotoIndex GA4 Measurement ID (G-...) is required to restore GA4.");
} else if (requested === "true" && plausible && !/^https:\/\/plausible\.io\/js\/pa-[A-Za-z0-9_-]+\.js$/.test(plausible)) {
  fail("Plausible must use a verified per-site script URL, or be left unset.");
} else {
  console.log(requested === "true"
    ? "Analytics opt-in configuration is consistent. Provider ownership, consent and privacy QA still require independent acceptance."
    : "Analytics is OFF; production release remains fail-closed.");
}
