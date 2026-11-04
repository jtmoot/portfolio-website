/**
 * Which page a path shows. The site has no router: /shelf is its one other page (Vercel rewrites
 * it to index.html), everything else is the pad.
 * @param {string} pathname
 * @returns {"shelf" | "pad"}
 */
export const pageOf = (pathname) => (pathname.replace(/\/+$/, "") === "/shelf" ? "shelf" : "pad");
