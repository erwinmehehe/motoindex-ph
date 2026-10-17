import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
const ruleset=JSON.parse(readFileSync(new URL("../docs/github-main-protection-ruleset.json",import.meta.url),"utf8"));

describe("proposed MotoIndex protected-main ruleset",()=>{
  it("targets only main, is active, and has no explicit bypass actors",()=>{
    expect(ruleset.target).toBe("branch");
    expect(ruleset.enforcement).toBe("active");
    expect(ruleset.conditions.ref_name).toEqual({include:["refs/heads/main"],exclude:[]});
    expect(ruleset.bypass_actors).toEqual([]);
  });
  it("requires independent human review and resolves code threads",()=>{
    const pr=ruleset.rules.find((rule:any)=>rule.type==="pull_request");
    expect(pr.parameters.required_approving_review_count).toBeGreaterThanOrEqual(1);
    expect(pr.parameters.require_last_push_approval).toBe(true);
    expect(pr.parameters.dismiss_stale_reviews_on_push).toBe(true);
    expect(pr.parameters.required_review_thread_resolution).toBe(true);
    expect(ruleset.rules.map((r:any)=>r.type)).toContain("deletion");
    expect(ruleset.rules.map((r:any)=>r.type)).toContain("non_fast_forward");
  });
  it("requires all three current GitHub Actions checks on an up-to-date PR head",()=>{
    const status=ruleset.rules.find((rule:any)=>rule.type==="required_status_checks");
    expect(status.parameters.strict_required_status_checks_policy).toBe(true);
    expect(status.parameters.required_status_checks).toEqual([
      {context:"build",integration_id:15368},
      {context:"browser-qa",integration_id:15368},
      {context:"validate",integration_id:15368}
    ]);
  });
});
