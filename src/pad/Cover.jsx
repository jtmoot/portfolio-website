/** A cover image, or a typeset cover for a book without one. */
export default function Cover({ book }) {
  if (book.cover) return <img className="cover" src={book.cover} alt="" loading="lazy" />;
  return (
    <span className="cover cover-drawn" aria-hidden="true">
      <b>{book.title}</b>
      <i>{book.author}</i>
    </span>
  );
}
