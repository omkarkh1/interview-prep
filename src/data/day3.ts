import type { DayCurriculum } from '@/types/curriculum';

export const day3: DayCurriculum = {
  dayNumber: 3,
  title: 'Trees, BSTs & Priority Queues',
  theme: 'DFS State Passing, Two-Heap Medians & Fan-Out Delivery',
  status: 'coming-soon',
  estimatedMinutes: 110,
  summary:
    'Deep dive into binary tree invariants, lowest common ancestors, streaming medians with dual heaps, expense-splitting domain design, and resilient multi-channel notification delivery.',
  dsaLessons: [],
  plannedPreview: [
    { kind: 'dsa', title: 'Binary Tree Maximum Path Sum', focus: 'Post-order gain vs global bridge update' },
    { kind: 'dsa', title: 'Lowest Common Ancestor of a Binary Tree', focus: 'Bottom-up recursion signal propagation' },
    { kind: 'dsa', title: 'Serialize and Deserialize Binary Tree', focus: 'Preorder sentinel encoding & stream decoding' },
    { kind: 'dsa', title: 'Find Median from Data Stream', focus: 'Balanced Max-Heap + Min-Heap invariant' },
    { kind: 'dsa', title: 'Merge k Sorted Lists', focus: 'K-way Min-Heap frontier merging' },
    { kind: 'lld', title: 'Splitwise Expense Sharing', focus: 'Strategy Pattern for Equal/Exact/Percent Splits & Debt Simplification' },
    { kind: 'hld', title: 'Multi-Channel Notification System', focus: 'Priority Queues, Retries, Idempotency & Rate Control' },
  ],
};
