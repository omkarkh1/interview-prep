import type { DayCurriculum } from '@/types/curriculum';

export const day6: DayCurriculum = {
  dayNumber: 6,
  title: 'Backtracking, Tries & Intervals',
  theme: 'Decision Trees, Prefix Indexing & Concurrent Booking',
  status: 'coming-soon',
  estimatedMinutes: 105,
  summary:
    'Build clean pruning invariants for backtracking, memory-efficient Tries, interval sweep-line algorithms, concurrent seat-lock booking LLD, and low-latency search typeahead architecture.',
  dsaLessons: [],
  plannedPreview: [
    { kind: 'dsa', title: 'Word Search II', focus: 'Trie-guided DFS pruning on a 2D grid' },
    { kind: 'dsa', title: 'Combination Sum II', focus: 'Sorted deduplication in backtracking trees' },
    { kind: 'dsa', title: 'Merge Intervals', focus: 'Sort-by-start sweep and active interval extension' },
    { kind: 'dsa', title: 'Meeting Rooms II', focus: 'Min-heap end-time tracking / chronological sweep' },
    { kind: 'dsa', title: 'N-Queens', focus: 'Bitmask / diagonal set conflict pruning' },
    { kind: 'lld', title: 'Ticket Booking System (BookMyShow)', focus: 'Optimistic vs Pessimistic Seat Locks, TTL Expiry & Payment States' },
    { kind: 'hld', title: 'Search Autocomplete / Typeahead', focus: 'Sharded Trie Servers, Top-K Aggregation & Edge Caching' },
  ],
};
