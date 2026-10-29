# Project rankings

Which projects the portfolio features, in order, and the media for each. Media lives in `public/media/`; every clip has an `.mp4` (H.264, plays everywhere), a `.webm` (VP9, smaller), and a `-poster.jpg` for the first frame. All clips are muted and loop cleanly.

## Featured

| # | Project | Media | Link |
|---|---|---|---|
| 01 | **Forge**: ML experiment tracking with hardware-aware profiling | `forge.*` (16s): dashboard → project logs → Multi-Asset experiment → efficiency frontier → model registry | [jtmoot/forge](https://github.com/jtmoot/forge) · [live](https://forgelab.up.railway.app) |
| 02 | **Ladies on the Links**: production site for a women's golf league, maintained through an issue → Claude → PR → auto-merge pipeline, with a Cloudflare-native tee sheet synced from Bookwhen | `lotl.*` (20s): home → Schedule → live tee sheet with filters. Member names are blurred | [jtmoot/lotl-site](https://github.com/jtmoot/lotl-site) · [live](https://ladiesonthelinksgolf.com) |
| 03 | **Distributed System**: fault-tolerant replicated service (heartbeats, GFD/LFD membership, active + passive replication, checkpointing). CMU 18-749 team project | `distsys.*` (16s): replay of real logs from a local run. Six panes (GFD, LFD2, C1, S1, S2, S3); backup S2 is killed, LFD2 detects it, GFD membership drops to S1, S3, and clients keep being served | [C3viche/distributed-system](https://github.com/C3viche/distributed-system) |
| 04 | **Robot Learning**: PPO vs SAC vs model-based RL on CarRacing-v3 (CMU 16-831), plus SayCan-Extended: GPT-3.5 planning, ViLD detection, direct PyBullet control, batching and caching (USC CSCE 585) | `carracing.*` (10s of the final PPO policy, with its title bar: "peak 685 @ 960k · final 638"), `carracing-training.jpg`; `saycan.*` (8s: pipeline → PyBullet sim → batching results) | [csce585-mlsystems/SayCan-Extended](https://github.com/csce585-mlsystems/SayCan-Extended) (CarRacing repo is private) |
| 05 | **STM Autoencoders**: simulated STM lattice images and convolutional autoencoders (2024 USC REU, Dr. Binev), extended to a dual-decoder architecture search (DualDEC-STM, 2025) | `stm.*` (4s noisy → clean loop), `stm-reconstruction.jpg` (similarity ~0.93 on cubic); REU deck slides `stm-simulation.jpg`, `stm-reconstruction-slide.jpg`, `stm-latent-space.jpg`, `stm-quantitative.jpg` | [jtmoot/DualDEC-STM](https://github.com/jtmoot/DualDEC-STM) · [jtmoot/ComputationalMicroscopyREU](https://github.com/jtmoot/ComputationalMicroscopyREU) |

## Smaller builds (no card)

- **Lorier Restock Monitor**: stdlib-only Shopify restock alerts on GitHub Actions.
- **Baron Filtration**: stays in the timeline as the 2025 data engineering internship.

## Off the portfolio

- **Marcus**: only `agent-crons` exists publicly, with one test workflow.
- **Smartii-Mac**: a fork of `platret/Smartii-Mac`; the only contribution is one open PR.
- **cae_cylinder**: a classmate's project.

## Notes

- GitHub handle is `jtmoot`. `github.com/joshuamoorehead` returns a 404.
- The Forge agent page currently errors: Railway logs show `anthropic.AuthenticationError 401 invalid x-api-key`, so the key on Railway is revoked. Re-record `forge.*` with the agent step once it's fixed.
