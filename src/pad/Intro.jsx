/**
 * The intro paragraph. It appears whole; the hero's opening rises it in and draws each highlight
 * in turn, using the --i each mark carries.
 * @param {{ tokens: { text: string, mark?: boolean }[] }} props
 */
export default function Intro({ tokens }) {
  let i = 0;
  return (
    <p className="intro">
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
  );
}
