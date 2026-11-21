import type { DayCurriculum } from '@/types/curriculum';

export const day7: DayCurriculum = {
  dayNumber: 7,
  title: 'Greedy, Binary Search on Answer & Synthesis',
  theme: 'Monotonic Feasibility, Game Engines & Global Media Pipelines',
  status: 'coming-soon',
  estimatedMinutes: 110,
  summary:
    'Synthesize senior interview judgment with binary search over answer spaces, greedy exchange proofs, clean board-game move validation LLD, and planet-scale adaptive video streaming HLD.',
  dsaLessons: [],
  plannedPreview: [
    { kind: 'dsa', title: 'Koko Eating Bananas / Split Array Largest Sum', focus: 'Binary search on monotonic feasibility predicate' },
    { kind: 'dsa', title: 'Median of Two Sorted Arrays', focus: 'O(log min(m,n)) partition binary search' },
    { kind: 'dsa', title: 'Jump Game II', focus: 'Greedy BFS level-boundary reach tracking' },
    { kind: 'dsa', title: 'Task Scheduler', focus: 'Greedy idle-slot math & max-frequency frame' },
    { kind: 'dsa', title: 'Gas Station', focus: 'Greedy prefix-deficit reset invariant' },
    { kind: 'lld', title: 'Online Chess Engine', focus: 'Command Pattern for Moves, Polymorphic Piece Validation & Game State' },
    { kind: 'hld', title: 'Video Streaming Platform (YouTube)', focus: 'DAG Transcoding Pipeline, HLS/DASH Adaptive Bitrate & CDN Edge' },
  ],
};
