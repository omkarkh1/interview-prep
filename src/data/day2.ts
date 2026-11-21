import type { DayCurriculum } from '@/types/curriculum';

export const day2: DayCurriculum = {
  dayNumber: 2,
  title: 'Linked Lists, Monotonic Stacks & Queues',
  theme: 'Pointer Surgery, Monotonic Invariants & Traffic Shaping',
  status: 'coming-soon',
  estimatedMinutes: 105,
  summary:
    'Master in-place linked list manipulation, monotonic stack/deque bounds, thread-safe in-process rate limiting, and globally distributed rate limiting at edge scale.',
  dsaLessons: [],
  plannedPreview: [
    { kind: 'dsa', title: 'Reverse Nodes in k-Group', focus: 'In-place pointer rewiring & dummy sentinel' },
    { kind: 'dsa', title: 'LRU Cache', focus: 'HashMap + Doubly Linked List O(1) eviction' },
    { kind: 'dsa', title: 'Largest Rectangle in Histogram', focus: 'Monotonic increasing stack boundaries' },
    { kind: 'dsa', title: 'Sliding Window Maximum', focus: 'Monotonic decreasing deque' },
    { kind: 'dsa', title: 'Min Stack / Daily Temperatures', focus: 'Auxiliary invariant stack state' },
    { kind: 'lld', title: 'Rate Limiter Library', focus: 'Token Bucket & Sliding Window Log Strategies, Thread Safety' },
    { kind: 'hld', title: 'Distributed Rate Limiter', focus: 'Redis Lua Atomic Scripts, Race Conditions, Edge Sync' },
  ],
};
