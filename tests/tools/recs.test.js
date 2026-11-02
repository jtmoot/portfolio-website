import { describe, it, expect } from "vitest";
import { formatRecs } from "../../tools/recs/format.mjs";

describe("formatRecs", () => {
  it("lists each recommendation on its own block, newest first as given, with the optional parts only when present", () => {
    const out = formatRecs([
      { id: 7, created_at: new Date("2026-11-02T18:04:00Z"), status: "new", title: "Stoner", author: "John Williams", from_name: "Sam", note: "Quiet and perfect.", ol_key: "/works/OL82586W" },
      { id: 6, created_at: new Date("2026-11-01T09:00:00Z"), status: "read", title: "Middlemarch", author: null, from_name: null, note: null, ol_key: null },
    ]);
    expect(out).toBe(
      [
        "#7  2026-11-02  new   Stoner, John Williams",
        "    from Sam: Quiet and perfect.",
        "    https://openlibrary.org/works/OL82586W",
        "#6  2026-11-01  read  Middlemarch",
      ].join("\n"),
    );
  });

  it("says so when there is nothing yet", () => {
    expect(formatRecs([])).toBe("No recommendations yet.");
  });
});
