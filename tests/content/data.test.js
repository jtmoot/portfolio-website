import { existsSync } from "node:fs";
import { describe, it, expect } from "vitest";
import { LEADERSHIP } from "../../src/content/data.js";

// Vitest runs from the repo root.
const inPublic = (url) => existsSync(`public${url}`);

describe("leadership content", () => {
  it("names the CMU chapter PA-Theta and gives both chapters their logos", () => {
    const [advisor, president] = LEADERSHIP;
    expect(advisor.company).toBe("Sigma Phi Epsilon, PA-Theta");
    expect(advisor.logo).toBe("/logos/sigep-pa.png");
    expect(president.logo).toBe("/logos/sigep-sc.png");
    for (const row of LEADERSHIP) expect(inPublic(row.logo)).toBe(true);
  });

  it("carries the president row's GPA standing from the resume", () => {
    expect(LEADERSHIP[1].blurb).toContain("#1 GPA of 24 fraternities");
  });
});
