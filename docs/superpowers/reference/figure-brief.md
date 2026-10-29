# Figure brief (Task 12)

Joshua as a small walking figure in the room's own style: built with the anatomy kit in the same true-isometric projection and the same 1 cm scale as every station, so he is exactly 182 cm next to a 98 cm desk.

- Look: short dark hair (a sphere set back and up from the head so the face shows below a hairline), plain charcoal hoodie with hood roll, pocket and drawstrings, mid-grey joggers, Asics Novablast (white foam midsole, dark outsole, grey knit upper). No glasses: the headshot reference does not settle it, so the default is none; one flag in `tools/stations/figure.mjs` to add them.
- Sheet: 20 symbols `f-{dl|dr|ul|ur}-{idle|w1|w2|w3|w4}` in `src/creative/stations/art/figure.svg`, one shared viewBox, feet anchor in `meta.json`. Walk frames swing legs (stride 20 cm) and arms against them; `u` facings show his back.
- Rebuild: `npm run stations figure`.
