import type { DayCurriculum } from '@/types/curriculum';

export const day4: DayCurriculum = {
  dayNumber: 4,
  title: 'Graphs, Topological Sort & Shortest Paths',
  theme: 'State Space Search, Weighted Frontiers & Real-Time Presence',
  status: 'coming-soon',
  estimatedMinutes: 115,
  summary:
    'Conquer graph traversal patterns, Kahn topological sorting, Union-Find, Dijkstra priority queues, geospatial ride dispatch LLD, and low-latency bi-directional chat architecture.',
  dsaLessons: [],
  plannedPreview: [
    { kind: 'dsa', title: 'Course Schedule II', focus: 'Kahn BFS Topological Sort & cycle detection' },
    { kind: 'dsa', title: 'Network Delay Time', focus: 'Dijkstra shortest path with lazy min-heap' },
    { kind: 'dsa', title: 'Word Ladder', focus: 'Shortest transformation via bidirectional BFS' },
    { kind: 'dsa', title: 'Accounts Merge', focus: 'Disjoint Set Union (Path Compression + Rank)' },
    { kind: 'dsa', title: 'Alien Dictionary', focus: 'Graph extraction from lexicographical order' },
    { kind: 'lld', title: 'Ride-Sharing Dispatch (Uber)', focus: 'Matching Strategy, Trip State Machine & Geo Indexing' },
    { kind: 'hld', title: 'Real-Time Chat System (WhatsApp)', focus: 'WebSocket Gateways, Presence, Offline Queues & E2E Delivery' },
  ],
};
