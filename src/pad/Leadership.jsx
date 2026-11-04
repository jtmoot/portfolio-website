import Rows from "./Rows.jsx";
import { LEADERSHIP } from "../content/data.js";

/**
 * Leadership roles; a role's `posts` in the data become links to its LinkedIn posts.
 * @param {{ items?: object[] }} props
 */
export default function Leadership({ items = LEADERSHIP }) {
  return (
    <section id="leadership" aria-labelledby="leadership-h">
      <h2 id="leadership-h">Leadership</h2>
      <Rows items={items} />
    </section>
  );
}
