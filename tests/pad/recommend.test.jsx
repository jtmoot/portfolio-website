import { describe, it, expect, vi, afterEach } from "vitest";
import { act } from "react";
import { createRoot } from "react-dom/client";
import Recommend from "../../src/pad/Recommend.jsx";

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

/** A fetch that answers Open Library searches with OL and sends with `post`. */
const fakeFetch = (post = () => json(201, { ok: true })) =>
  vi.fn(async (url, init) => (String(url).startsWith("https://openlibrary.org/") ? json(200, OL) : post(url, init)));

const mount = async (fetcher) => {
  const host = document.createElement("div");
  document.body.append(host);
  const root = createRoot(host);
  await act(async () => root.render(<Recommend fetcher={fetcher} />));
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

  it("suggests books from Open Library and sends the one picked", async () => {
    vi.useFakeTimers();
    const fetcher = fakeFetch();
    const { host, $, type, submit, done } = await mount(fetcher);
    await type($("#rec-title"), "ston");
    expect(fetcher).not.toHaveBeenCalled();
    await act(async () => vi.advanceTimersByTime(300));
    const search = String(fetcher.mock.calls[0][0]);
    expect(search).toContain("https://openlibrary.org/search.json?");
    expect(search).toContain("q=ston");
    const options = host.querySelectorAll('[role="option"]');
    // Stray editions without an author, and repeats, are left out.
    expect([...options].map((o) => o.textContent)).toEqual(["StonerJohn Williams", "Stoner and SpiderAnn Lee"]);
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
    await act(async () => vi.advanceTimersByTime(300));
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
    await act(async () => vi.advanceTimersByTime(300));
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

  it("carries on without suggestions when Open Library fails", async () => {
    vi.useFakeTimers();
    const fetcher = vi.fn(async () => {
      throw new TypeError("offline");
    });
    const { host, $, type, done } = await mount(fetcher);
    await type($("#rec-title"), "ston");
    await act(async () => vi.advanceTimersByTime(300));
    expect(host.querySelector('[role="listbox"]')).toBeNull();
    expect($(".rec-status").textContent).toBe("");
    await done();
  });
});
