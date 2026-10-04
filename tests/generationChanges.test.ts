import { describe, expect, it } from "vitest";
import { generationTransition, generationTransitionsForIds, latestGenerationTransition } from "../lib/generationChanges";
import { getModelFamily } from "../lib/families";

describe("generation change tracker",()=>{
  it("orders NMAX transitions from oldest to newest and identifies V2 to V3 as latest",()=>{
    const family=getModelFamily("yamaha","nmax");
    expect(family).toBeTruthy();
    const transitions=generationTransitionsForIds(family!.generationIds);
    expect(transitions.length).toBe(2);
    expect(transitions[0].from.id).toBe("yamaha-nmax-v1");
    expect(transitions[0].to.id).toBe("yamaha-nmax-v2");
    expect(transitions[1].from.id).toBe("yamaha-nmax-v2");
    expect(transitions[1].to.id).toBe("yamaha-nmax-v3");
    expect(latestGenerationTransition(family!.generationIds)?.id).toBe("yamaha-nmax-v2--yamaha-nmax-v3");
  });

  it("keeps measurable deltas tied to stored model records",()=>{
    const transition=generationTransition("yamaha-nmax-v2","yamaha-nmax-v3");
    expect(transition).toBeTruthy();
    const engine=transition!.measurable.find(item=>item.key==="engine");
    expect(engine?.from).toBe("155 cc");
    expect(engine?.to).toBe("155 cc");
    expect(engine?.delta).toBe("No change");
  });

  it("publishes YECVT as a trim-sensitive sourced NMAX change rather than a whole-line assumption",()=>{
    const transition=generationTransition("yamaha-nmax-v2","yamaha-nmax-v3");
    const yecvt=transition!.notes.find(note=>note.title.includes("YECVT"));
    expect(yecvt?.to).toContain("Tech MAX");
    expect(yecvt?.sourceUrl).toBe("https://www.yamaha-motor.com.ph/yecvt");
    expect(transition!.upgrade.verdict).toBe("Targeted upgrade");
  });

  it("marks Click150i to Click160 and ADV150 to ADV160 as meaningful sourced changes",()=>{
    const click=generationTransition("honda-click-150i","honda-click-160");
    const adv=generationTransition("honda-adv-150","honda-adv-160");
    expect(click?.upgrade.verdict).toBe("Meaningful upgrade");
    expect(click?.notes.some(note=>note.category==="engine")).toBe(true);
    expect(adv?.upgrade.verdict).toBe("Meaningful upgrade");
    expect(adv?.notes.some(note=>note.category==="storage"&&note.to?.includes("30 L"))).toBe(true);
    expect(adv?.notes.some(note=>note.category==="suspension"&&note.to?.includes("Showa"))).toBe(true);
  });

  it("falls back to stored measurable comparisons when a transition has no curated qualitative notes",()=>{
    const transition=generationTransition("yamaha-nmax-v1","yamaha-nmax-v2");
    expect(transition?.curated).toBe(false);
    expect(transition?.notes).toEqual([]);
    expect(transition?.measurable.length).toBeGreaterThan(5);
  });

  it("keeps historical price context explicit",()=>{
    const nmax=generationTransition("yamaha-nmax-v2","yamaha-nmax-v3");
    const price=nmax!.notes.find(note=>note.category==="price");
    expect(price?.from).toContain("historical");
    expect(price?.impact).toContain("used-market");
    expect(price?.impact).toContain("dealer quote");
  });
});
