/**
 * The intro's paragraphs. They appear whole; the hero's opening rises them in and draws each
 * highlight in turn, using the --i each mark carries (counted across paragraphs).
 * @param {{ paragraphs: { text: string, mark?: boolean }[][] }} props
 */
export default function Intro({ paragraphs }) {
  let i = 0;
  return (
    <div className="intro">
      {paragraphs.map((tokens, p) => (
        <p key={p}>
          {tokens.map((t, k) =>
            t.mark ? (
              <mark key={k} style={{ "--i": i++ }}>
                {t.text}
              </mark>
            ) : (
              t.text
            ),
          )}
        </p>
      ))}
    </div>
  );
}
