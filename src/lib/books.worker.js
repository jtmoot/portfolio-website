import { createBookService, loadIndex } from "./bookService.js";

/** The book search worker: the index lives here, off the page's main thread. */
const handle = createBookService({ load: () => loadIndex(fetch, "/books/index.bin.gz") }, (m) => self.postMessage(m));
self.onmessage = (e) => handle(e.data);
