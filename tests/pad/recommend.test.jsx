import { describe, it, expect, vi, afterEach } from "vitest";
import { act } from "react";
import { createRoot } from "react-dom/client";
import Recommend from "../../src/pad/Recommend.jsx";
import { fromOpenLibrary } from "../../src/lib/recommend.js";

globalThis.IS_REACT_ACT_ENVIRONMENT = true;

afterEach(() => vi.useRealTimers());

const json = (status, body) => ({ ok: status < 400, status, json: async () => body });

const OL = {
  docs: [
    { key: "/works/OL82586W", title: "Stoner", author_name: ["John Williams"], cover_i: 8231856 },
    { key: "/works/OL2W", title: "Stoner", author_name: ["John Williams"] },
    { key: "/works/OL3W", title: "Stoner (stray edition)" },
    { key: "/works/OL1W", title: "Stoner and Spider", author_name: ["Ann Lee"] },
  ],
};

/** A fetch that answers /api/books (Open Library, through the site) and sends with `post`. */
const fakeFetch = (post = () => json(201, { ok: true })) =>
  vi.fn(async (url, init) => (String(url).startsWith("/api/books?") ? json(200, { books: fromOpenLibrary(OL.docs) }) : post(url, init)));

/** The in-browser index: what it finds for each query, or null when there is no index. */
const LOCAL = [
  { olKey: "/works/OL82586W", title: "Stoner", author: "John Williams", coverId: 8231856 },
  { olKey: "/works/OL1W", title: "Stoner and Spider", author: "Ann Lee", coverId: null },
];
const fakeBooks = (find = () => LOCAL) => {
  const searcher = { search: vi.fn(async (q) => { const books = find(q); return books && { books, ms: 0.42, size: 50000 }; }), close: vi.fn() };
  return { open: vi.fn(() => searcher), searcher };
};

const mount = async (fetcher, books = fakeBooks()) => {
  const host = document.createElement("div");
  document.body.append(host);
  const root = createRoot(host);
  await act(async () => root.render(<Recommend fetcher={fetcher} openBooks={books.open} />));
  await act(async () => host.querySelector("#rec-title").focus());
  const $ = (s) => host.querySelector(s);
  const type = async (el, value) => {
    const set = Object.getOwnPropertyDescriptor(Object.getPrototypeOf(el), "value").set;
    await act(async () => {
      set.call(el, value);
      el.dispatchEvent(new Event("input", { bubbles: true }));
    });
  };
  const submit = async () => act(async () => $("form").requestSubmit());
  const done = async () => {
    await act(async () => root.unmount());
    host.remove();
  };
  return { host, $, type, submit, done };
};

describe("Recommend", () => {
  it("is a form with a book search, optional author, note and name, and never a mail link", async () => {
    const { host, $, done } = await mount(fakeFetch());
    expect($("h2").textContent).toBe("Recommend a book");
    expect($('input[role="combobox"]').getAttribute("aria-autocomplete")).toBe("list");
    expect([...host.querySelectorAll("label")].map((l) => l.textContent)).toEqual(["Book", "Author", "Why this one", "Your name"]);
    expect($('button[type="submit"]').textContent).toBe("Send");
    expect(host.querySelector('a[href^="mailto:"]')).toBeNull();
    // A field people never see, for bots to fill.
    const trap = $('input[name="website"]');
    expect(trap.tabIndex).toBe(-1);
    expect(trap.closest("[aria-hidden]")).not.toBeNull();
    await done();
  });

  it("starts the in-browser index when the Book field is focused, once, and closes it on the way out", async () => {
    const books = fakeBooks();
    const { $, done } = await mount(fakeFetch(), books);
    await act(async () => $("#rec-author").focus());
    await act(async () => $("#rec-title").focus());
    expect(books.open).toHaveBeenCalledTimes(1);
    await done();
    expect(books.searcher.close).toHaveBeenCalled();
  });

  it("suggests books from the in-browser index on every keystroke, with no wait, and sends the one picked", async () => {
    vi.useFakeTimers();
    const fetcher = fakeFetch();
    const books = fakeBooks();
    const { host, $, type, submit, done } = await mount(fetcher, books);
    await type($("#rec-title"), "ston");
    expect(books.searcher.search).toHaveBeenCalledWith("ston", 8);
    const options = host.querySelectorAll('[role="option"]');
    expect([...options].map((o) => o.textContent)).toEqual(["StonerJohn Williams", "Stoner and SpiderAnn Lee"]);
    // How long the search took, from keystroke to answer.
    expect($(".rec-speed").textContent).toBe("0.42 ms");
    expect($(".rec-speed").getAttribute("title")).toBe("Searched 50,000 books in your browser");
    expect($(".rec-speed").getAttribute("aria-hidden")).toBe("true");
    expect($('label[for="rec-title"]').textContent).toBe("Book");
    await act(async () => options[0].dispatchEvent(new MouseEvent("mousedown", { bubbles: true })));
    expect($("#rec-title").value).toBe("Stoner");
    expect($("#rec-author").value).toBe("John Williams");
    expect(host.querySelector('[role="listbox"]')).toBeNull();
    await type($("#rec-note"), "Quiet and perfect.");
    await submit();
    const [url, init] = fetcher.mock.calls.at(-1);
    expect(url).toBe("/api/recommend");
    expect(init.method).toBe("POST");
    expect(JSON.parse(init.body)).toEqual({ title: "Stoner", author: "John Williams", olKey: "/works/OL82586W", coverId: 8231856, note: "Quiet and perfect.", name: "", website: "" });
    expect($(".rec-status").textContent).toBe("Thanks. It's on the list.");
    expect($("#rec-title").value).toBe("");
    await done();
  });

  it("picks a suggestion from the keyboard", async () => {
    vi.useFakeTimers();
    const { host, $, type, done } = await mount(fakeFetch());
    const input = $("#rec-title");
    await type(input, "ston");
    const key = (k) => act(async () => input.dispatchEvent(new KeyboardEvent("keydown", { key: k, bubbles: true })));
    await key("ArrowDown");
    await key("ArrowDown");
    expect(input.getAttribute("aria-activedescendant")).toBe(host.querySelectorAll('[role="option"]')[1].id);
    await key("Enter");
    expect(input.value).toBe("Stoner and Spider");
    await done();
  });

  it("forgets the pick once the title is edited by hand", async () => {
    vi.useFakeTimers();
    const fetcher = fakeFetch();
    const { host, $, type, submit, done } = await mount(fetcher);
    await type($("#rec-title"), "ston");
    await act(async () => host.querySelector('[role="option"]').dispatchEvent(new MouseEvent("mousedown", { bubbles: true })));
    await type($("#rec-title"), "Stoner, again");
    await submit();
    expect(JSON.parse(fetcher.mock.calls.at(-1)[1].body)).toMatchObject({ title: "Stoner, again", olKey: null, coverId: null });
    await done();
  });

  it("asks for a title before sending anything", async () => {
    const fetcher = fakeFetch();
    const { $, submit, done } = await mount(fetcher);
    await submit();
    expect($(".rec-status").textContent).toBe("Add a title.");
    expect(fetcher).not.toHaveBeenCalled();
    await done();
  });

  it("shows the server's reason, or that the list is unreachable", async () => {
    // Each reply is made when it's asked for, so the failure isn't a rejection nobody is waiting on yet.
    const replies = [
      () => json(429, { error: "Too many sends from here today. Try again tomorrow." }),
      () => Promise.reject(new TypeError("offline")),
    ];
    const fetcher = fakeFetch(() => replies.shift()());
    const { $, type, submit, done } = await mount(fetcher);
    await type($("#rec-title"), "Ab");
    await submit();
    expect($(".rec-status").textContent).toBe("Too many sends from here today. Try again tomorrow.");
    expect($("#rec-title").value).toBe("Ab");
    await submit();
    expect($(".rec-status").textContent).toBe("Couldn't reach the list. Try again later.");
    await done();
  });

  it("asks Open Library, through /api/books, for the long tail the index doesn't have, after a 250 ms pause", async () => {
    vi.useFakeTimers();
    const fetcher = fakeFetch();
    const books = fakeBooks((q) => (q === "ston" ? [LOCAL[1]] : []));
    const { host, $, type, done } = await mount(fetcher, books);
    await type($("#rec-title"), "ston");
    expect([...host.querySelectorAll('[role="option"]')].map((o) => o.textContent)).toEqual(["Stoner and SpiderAnn Lee"]);
    await act(async () => vi.advanceTimersByTime(249));
    expect(fetcher).not.toHaveBeenCalled();
    await act(async () => vi.advanceTimersByTime(1));
    expect(fetcher).toHaveBeenCalledWith("/api/books?q=ston", expect.objectContaining({ signal: expect.any(AbortSignal) }));
    // Local results stay first; Open Library's are added after, without repeats.
    expect([...host.querySelectorAll('[role="option"]')].map((o) => o.textContent)).toEqual(["Stoner and SpiderAnn Lee", "StonerJohn Williams"]);
    await done();
  });

  it("doesn't ask Open Library when the index already has plenty", async () => {
    vi.useFakeTimers();
    const fetcher = fakeFetch();
    const five = Array.from({ length: 5 }, (_, i) => ({ olKey: `/works/OL${i + 10}W`, title: `Stone ${i}`, author: "A", coverId: null }));
    const { $, type, done } = await mount(fetcher, fakeBooks(() => five));
    await type($("#rec-title"), "stone");
    await act(async () => vi.advanceTimersByTime(1000));
    expect(fetcher).not.toHaveBeenCalled();
    await done();
  });

  it("uses Open Library alone when there is no index (no Worker, or it failed to load)", async () => {
    vi.useFakeTimers();
    const fetcher = fakeFetch();
    const { host, $, type, done } = await mount(fetcher, fakeBooks(() => null));
    await type($("#rec-title"), "ston");
    await act(async () => vi.advanceTimersByTime(250));
    expect([...host.querySelectorAll('[role="option"]')].map((o) => o.textContent)).toEqual(["StonerJohn Williams", "Stoner and SpiderAnn Lee"]);
    expect($(".rec-speed").textContent).toBe("");
    await done();
  });

  it("carries on without suggestions when there is no index and Open Library fails", async () => {
    vi.useFakeTimers();
    const fetcher = vi.fn(async () => {
      throw new TypeError("offline");
    });
    const { host, $, type, done } = await mount(fetcher, fakeBooks(() => null));
    await type($("#rec-title"), "ston");
    await act(async () => vi.advanceTimersByTime(300));
    expect(host.querySelector('[role="listbox"]')).toBeNull();
    expect($(".rec-status").textContent).toBe("");
    await done();
  });
});
