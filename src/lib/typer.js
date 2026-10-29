const escape = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

/**
 * Plans a typewriter run: one frame per character, each with the html typed so far.
 * Marked tokens are wrapped in <mark>, closed even when the run stops mid-token.
 * @param {{ text: string, mark?: boolean }[]} tokens
 * @param {number} [cps] characters per second
 * @returns {{ at: number, html: string }[]} `at` in ms from the start
 */
export function typeSchedule(tokens, cps = 28) {
  const frames = [];
  const step = 1000 / cps;
  let done = "";
  let t = 0;
  for (const token of tokens) {
    let typed = "";
    for (const ch of token.text) {
      typed += ch;
      // A short breath after punctuation, so it reads as typing rather than a ticker.
      t += step * (/[.,;:]/.test(ch) ? 3 : 1);
      const part = token.mark ? `<mark>${escape(typed)}</mark>` : escape(typed);
      frames.push({ at: Math.round(t), html: done + part });
    }
    done += token.mark ? `<mark>${escape(token.text)}</mark>` : escape(token.text);
  }
  return frames;
}
