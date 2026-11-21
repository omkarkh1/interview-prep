# 7-Day Staff Reader

A 100% static, distraction-free SDE interview visual learning reader calibrated for **4.5 YOE**. Built strictly for passive reading and visual intuition — zero code editors, zero blank whiteboards, zero timers.

## Architecture & Tech Stack
- **Frontend**: Vite + React + TypeScript + Tailwind CSS v4 + Radix/shadcn UI primitives + Lucide icons + self-hosted `Inter` & `JetBrains Mono`
- **Routing & Hosting**: `HashRouter` + `base: './'` for seamless GitHub Pages static deployment (`.github/workflows/deploy.yml`)
- **Visual Learning Engines**:
  - **DSA Interactive Visual Stepper**: 1D arrays/pointers/elevation bars, 2D DP/grid matrices (with active cell, labeled dependencies & live recurrence substitution), 1D DP / monotonic stack / heap arrays, and SVG Trees/Graphs/Tries
  - **LLD Mermaid.js Renderer**: Pre-rendered UML Class & Sequence diagrams + tabbed read-only Java code walkthroughs with clickable key-line annotations
  - **HLD Interactive Explorer**: Tiered SVG architecture canvas with Read/Write path filters and a clickable Component Inspector Panel
- **Persistence**: 100% client-side `localStorage` for *Mark as Read*, *Bookmark for Revision*, dark/light theme, and sidebar state.

## Complete 7-Day Curriculum (49 Interactive Lessons)
- **Day 1 — Sliding Window, Two Pointers & Prefix Sums**
  - DSA: Longest Substring Without Repeating Characters, Minimum Window Substring, Container With Most Water, Trapping Rain Water, Subarray Sum Equals K
  - LLD: Parking Lot (SOLID, Factory, Strategy, floor-scoped locks)
  - HLD: URL Shortener (Range-Leased KGS, Redis caching, 301 vs. 302, read-heavy scale)
- **Day 2 — Stacks, Monotonic Stack & Heaps**
  - DSA: Largest Rectangle in Histogram, Daily Temperatures, Merge K Sorted Lists, Find Median from Data Stream, Task Scheduler
  - LLD: Rate Limiter (Token Bucket, Sliding Window Log, Thread Safety)
  - HLD: Distributed Key-Value Store (Consistent Hashing, Replication, Tunable Quorum)
- **Day 3 — Trees, BST & Tries**
  - DSA: Lowest Common Ancestor of a Binary Tree, Serialize and Deserialize Binary Tree, Binary Tree Maximum Path Sum, Validate Binary Search Tree, Implement Trie & Word Search II
  - LLD: Pub-Sub Message Queue (Observer, Producer-Consumer, Concurrency)
  - HLD: Notification System (Async Queues, Retries, Rate Limiting, Priority)
- **Day 4 — Graphs & Shortest Paths**
  - DSA: Course Schedule II (Topological Sort), Number of Islands / Union-Find, Network Delay Time (Dijkstra), Word Ladder, Alien Dictionary
  - LLD: Ticket Booking System / BookMyShow (Seat Locking, Concurrency & Race Conditions)
  - HLD: Chat Application / WhatsApp (WebSockets, Presence, Message Ordering, Storage)
- **Day 5 — Dynamic Programming**
  - DSA: Coin Change, Longest Increasing Subsequence, Partition Equal Subset Sum (0/1 Knapsack), Edit Distance, House Robber III (Tree DP)
  - LLD: Elevator System (State Pattern, LOOK/SCAN Scheduling, thread-safe directional queues)
  - HLD: News Feed / Twitter (Hybrid Fan-Out on Write vs. Read, Redis Timeline ZSET Cache)
- **Day 6 — Binary Search on Answer & Intervals**
  - DSA: Koko Eating Bananas, Median of Two Sorted Arrays, Split Array Largest Sum, Merge Intervals, Meeting Rooms II
  - LLD: Thread-Safe LRU & LFU Cache (Doubly Linked List + HashMap + Lock Striping)
  - HLD: Ride Sharing / Uber (Geohashing/H3 & Quadtrees, Driver Matching, Location Updates)
- **Day 7 — Backtracking & Hard Mixed Patterns**
  - DSA: N-Queens, Combination Sum II, Word Break, Burst Balloons, Design In-Memory File System
  - LLD: Splitwise (Graph Debt Simplification, Strategy Pattern, Clean Domain Modeling)
  - HLD: Payment System / Stripe Ledger (Idempotency, Double-Entry Ledger, Exactly-Once Semantics)

## Local Development
```bash
npm ci
npm run dev
npm run build
```
