import { describe, expect, it } from "vitest";
import { getRecommendationModels } from "../lib/data";
import { preciseRecommendationFaq } from "../lib/recommendationFaqDirect";

describe("recommendation FAQ answers stay aligned with the exact question", () => {
  it("answers scooter ABS using only eligible scooters", () => {
    const models=getRecommendationModels("best-scooters-philippines");
    const answer=preciseRecommendationFaq("Which scooters have ABS?",models);
    expect(answer).toMatch(/current scooters in this guide list ABS/i);
    expect(answer).toMatch(/trim-dependent/i);
  });

  it("handles yes/no ABS questions without treating total model count as the answer", () => {
    const models=getRecommendationModels("maxi-scooters-philippines");
    const answer=preciseRecommendationFaq("Do all maxi scooters have ABS?",models);
    expect(answer).toMatch(/^Do not assume ABS/);
    expect(answer).toMatch(/exact model year and variant/);
  });

  it("distinguishes automatic scooters from other automatic formats", () => {
    const models=getRecommendationModels("automatic-motorcycles-philippines");
    const answer=preciseRecommendationFaq("Are all automatic motorcycles scooters?",models);
    expect(answer).toMatch(/automatic motorcycle|scooter/i);
    expect(answer).not.toMatch(/Use the comparison table and the guide rules/);
  });

  it("does not imply that engine power measures Raider top speed", () => {
    const models=getRecommendationModels("suzuki-raider-motorcycles-philippines");
    const answer=preciseRecommendationFaq("Which Raider is fastest on paper?",models);
    expect(answer).toMatch(/cannot establish top speed/i);
  });

  it("answers broad availability questions from the actual qualifying model set", () => {
    const models=getRecommendationModels("kawasaki-ninja-motorcycles-philippines");
    const answer=preciseRecommendationFaq("What Kawasaki Ninja motorcycles are available in the Philippines?",models);
    expect(answer).toMatch(/qualifying motorcycle models/);
    expect(answer).toMatch(/Kawasaki/);
  });
});
