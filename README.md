# 7-Day Staff Reader

A 100% static, distraction-free SDE interview visual learning reader calibrated for **4.5 YOE**. Built strictly for passive reading and visual intuition — zero code editors, zero blank whiteboards, zero timers.

## Architecture & Tech Stack
- **Frontend**: Vite + React + TypeScript + Tailwind CSS v4 + Radix/shadcn UI primitives + Lucide icons
- **Routing & Hosting**: `HashRouter` + `base: './'` for seamless GitHub Pages static deployment (`.github/workflows/deploy.yml`)
- **Visual Learning Engines**:
  - **DSA Interactive Visual Stepper**: 1D arrays/pointers/elevation bars, 2D DP matrices (with active cell, labeled dependencies & live recurrence substitution), 1D DP / Patience Sorting arrays, and SVG Tree DP
  - **LLD Mermaid.js Renderer**: Pre-rendered UML Class & Sequence diagrams + tabbed read-only Java code walkthroughs with clickable key-line annotations
  - **HLD Interactive Explorer**: Tiered SVG architecture canvas with Read/Write path filters and a clickable Component Inspector Panel
- **Persistence**: 100% client-side `localStorage` for *Mark as Read*, *Bookmark for Revision*, dark/light theme, and sidebar state.

## Phase 1 Curriculum (Live)
- **Day 1 — Sliding Window, Two Pointers & Prefix Sums**
  - DSA: Longest Substring Without Repeating Characters, Minimum Window Substring, Container With Most Water, Trapping Rain Water, Subarray Sum Equals K
  - LLD: Parking Lot (SOLID, Factory, Strategy, floor-scoped locks)
  - HLD: URL Shortener (Range-Leased KGS, Redis caching, 301 vs. 302, read-heavy scale)
- **Day 5 — Dynamic Programming**
  - DSA: Coin Change, Longest Increasing Subsequence, Partition Equal Subset Sum (0/1 Knapsack), Edit Distance, House Robber III (Tree DP)
  - LLD: Elevator System (State Pattern, LOOK/SCAN Scheduling, thread-safe directional queues)
  - HLD: News Feed / Twitter (Hybrid Fan-Out on Write vs. Read, Redis Timeline ZSET Cache)

Days 2, 3, 4, 6, and 7 are wired as Phase 2 syllabus previews.

## Local Development
```bash
npm ci
npm run dev
npm run build
```
