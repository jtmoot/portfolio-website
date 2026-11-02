/**
 * Book recommendations as plain text for the terminal: one block each, in the order given.
 * @param {Array<{ id: number, created_at: Date, status: string, title: string, author: string | null, from_name: string | null, note: string | null, ol_key: string | null }>} rows
 * @returns {string}
 */
export function formatRecs(rows) {
  if (rows.length === 0) return "No recommendations yet.";
  return rows
    .flatMap((r) => {
      const lines = [`#${r.id}  ${r.created_at.toISOString().slice(0, 10)}  ${r.status.padEnd(4)}  ${r.title}${r.author ? `, ${r.author}` : ""}`];
      if (r.from_name || r.note) lines.push(`    ${[r.from_name && `from ${r.from_name}`, r.note].filter(Boolean).join(": ")}`);
      if (r.ol_key) lines.push(`    https://openlibrary.org${r.ol_key}`);
      return lines;
    })
    .join("\n");
}
