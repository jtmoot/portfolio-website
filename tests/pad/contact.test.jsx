import { describe, it, expect } from "vitest";
import { act } from "react";
import { createRoot } from "react-dom/client";
import Contact from "../../src/pad/Contact.jsx";

globalThis.IS_REACT_ACT_ENVIRONMENT = true;

describe("Contact", () => {
  it("invites a LinkedIn message or an email, and marks Email for the envelope preview", async () => {
    const host = document.createElement("div");
    const root = createRoot(host);
    await act(async () => root.render(<Contact />));
    expect(host.querySelector("#contact p").textContent).toBe("Feel free to message me on LinkedIn or send an email!");
    const email = [...host.querySelectorAll(".contact-links a")].find((a) => a.textContent === "Email");
    expect(email.dataset.icon).toBe("mail");
    await act(async () => root.unmount());
  });
});
