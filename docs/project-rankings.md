# Project rankings

Which projects the portfolio features, in order, and the media for each. Media lives in `public/media/`; every clip has an `.mp4` (H.264, plays everywhere), a `.webm` (VP9, smaller), and a `-poster.jpg` for the first frame. All clips are muted and loop cleanly.

## Featured

| # | Project | Media | Link |
|---|---|---|---|
| 01 | **Forge**: ML experiment tracking, hardware-aware profiling, and model serving (micro-batching, ONNX Runtime fp32/int8 behind a parity gate, load-tested on Railway: 20.3K req/s at 3.8 ms p99, 29× naive PyTorch) | `forge.*` (18.7s): dashboard → Multi-Asset experiment → efficiency frontier → agent answers "Which serving config keeps p99 under 10ms?" (thinking time cut) → `/serving` latency-vs-throughput curves, ending on the recommended int8 config | [jtmoot/forge](https://github.com/jtmoot/forge) · [live](https://forgelab.up.railway.app) · [serving](https://forgelab.up.railway.app/serving) |
| 02 | **Ladies on the Links**: production site for a women's golf league, maintained through an issue → Claude → PR → auto-merge pipeline, with a Cloudflare-native tee sheet synced from Bookwhen | `lotl.*` (20s): home → Schedule → live tee sheet with filters. Member names are blurred | [jtmoot/lotl-site](https://github.com/jtmoot/lotl-site) · [live](https://ladiesonthelinksgolf.com) |
| 03 | **Distributed System**: fault-tolerant replicated service (heartbeats, GFD/LFD membership, active + passive replication, checkpointing). CMU 18-749 team project | `distsys.*` (16s): replay of real logs from a local run. Six panes (GFD, LFD2, C1, S1, S2, S3); backup S2 is killed, LFD2 detects it, GFD membership drops to S1, S3, and clients keep being served | [C3viche/distributed-system](https://github.com/C3viche/distributed-system) |
| 04 | **LoRA Fine-Tuning and Serving in Needle**: inference for LoRA fine-tuned transformers in Needle, a from-scratch Python/C++/CUDA framework; benchmarking latency, throughput and memory across adapter ranks and batch sizes. CMU 10-714, Fall 2026, in progress | none yet: the card shows an "In progress, Fall 2026" screen. Record a clip once the benchmarks run | none yet |
| 05 | **Robot Learning**: PPO vs SAC vs model-based RL on CarRacing-v3 (CMU 16-831), plus SayCan-Extended: GPT-3.5 planning, ViLD detection, direct PyBullet control, batching and caching (USC CSCE 585) | `carracing.*` (10s of the final PPO policy, with its title bar: "peak 685 @ 960k · final 638"), `carracing-training.jpg`; `saycan.*` (8s: pipeline → PyBullet sim → batching results) | [csce585-mlsystems/SayCan-Extended](https://github.com/csce585-mlsystems/SayCan-Extended) (CarRacing repo is private) |
| 06 | **STM Autoencoders**: simulated STM lattice images and convolutional autoencoders (2024 USC REU, Dr. Binev), extended to a dual-decoder architecture search (DualDEC-STM, 2025) | `stm.*` (4s noisy → clean loop), `stm-reconstruction.jpg` (similarity ~0.93 on cubic); REU deck slides `stm-simulation.jpg`, `stm-reconstruction-slide.jpg`, `stm-latent-space.jpg`, `stm-quantitative.jpg` | [jtmoot/DualDEC-STM](https://github.com/jtmoot/DualDEC-STM) · [jtmoot/ComputationalMicroscopyREU](https://github.com/jtmoot/ComputationalMicroscopyREU) |

## Smaller builds (no card)

- **Lorier Restock Monitor**: stdlib-only Shopify restock alerts on GitHub Actions.
- **Baron Filtration**: stays in the timeline as the 2025 data engineering internship.

## Off the portfolio

- **Marcus**: only `agent-crons` exists publicly, with one test workflow.
- **Smartii-Mac**: a fork of `platret/Smartii-Mac`; the only contribution is one open PR.
- **cae_cylinder**: a classmate's project.

## Notes

- GitHub handle is `jtmoot`. `github.com/joshuamoorehead` returns a 404.
