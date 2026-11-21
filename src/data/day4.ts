import type { DayCurriculum } from '@/types/curriculum';

export const day4: DayCurriculum = {
  dayNumber: 4,
  title: 'Graphs & Shortest Paths',
  theme: 'Topological Ordering, Disjoint Sets, Weighted Frontiers & Real-Time Messaging',
  status: 'complete',
  estimatedMinutes: 125,
  summary:
    'Master Kahn’s BFS topological sort, Disjoint Set Union (Path Compression + Rank), Dijkstra’s lazy min-heap relaxation, Bidirectional BFS Word Ladder, and Alien Dictionary graph extraction; architect a concurrency-safe BookMyShow ticket booking engine; and design WhatsApp’s persistent WebSocket chat system.',
  dsaLessons: [
    /* ================================================================
     * DSA 1: COURSE SCHEDULE II (TOPOLOGICAL SORT)
     * ================================================================ */
    {
      id: 'day4-course-schedule-ii',
      dayNumber: 4,
      kind: 'dsa',
      title: 'Course Schedule II (Topological Sort)',
      subtitle: 'Kahn’s BFS indegree peeling for dependency resolution and DAG cycle detection',
      difficulty: 'Medium',
      patterns: ['Topological Sort', "Kahn's BFS", 'DAG Cycle Detection'],
      estimatedMinutes: 14,
      leetcodeRef: 'LC #210',
      problemStatement:
        'There are numCourses courses labeled 0 to numCourses - 1. Given an array prerequisites where prerequisites[i] = [a, b] means you must take course b before course a, return a valid ordering to finish all courses. If a cycle makes completion impossible, return an empty array.',
      exampleSummary: {
        input: 'numCourses = 5, prerequisites = [[1,0], [2,0], [3,1], [3,2], [4,2], [4,3]]',
        output: '[0, 1, 2, 3, 4]',
        explanation:
          'Course 0 has indegree 0 and unlocks 1 and 2. Course 3 waits until both 1 and 2 finish (indegree drops 2 → 1 → 0), and course 4 finishes last after both 2 and 3 complete.',
      },
      patternRecognition: {
        interviewCue:
          'Whenever items have directed prerequisite edges ("must finish B before A") and you must produce a linear execution order or detect circular dependencies (build graphs, task schedulers, package managers), immediately reach for Topological Sort.',
        signals: [
          'Directed dependency pairs [course, prereq] requiring linear scheduling',
          'Cycle detection in a directed graph ("return empty array if impossible")',
          'Iterative Kahn’s BFS avoids JVM StackOverflowError on deep 10⁵-node chains where recursive DFS fails',
        ],
        mentalModel:
          'Track indegree[v] = how many unfinished prerequisites block course v. Enqueue every unblocked course (indegree == 0). Each time you pop and complete u, decrement indegree of its dependents; any dependent hitting 0 becomes newly unlocked. If you finish fewer than numCourses nodes, the remaining nodes are trapped in a cycle.',
      },
      intuitionComparison: {
        bruteForce: {
          approach:
            'Repeatedly scan all V courses to find an unvisited course with zero unsatisfied prerequisites, mark it taken, and rescan all E edges each round.',
          timeComplexity: 'O(V · (V + E))',
          spaceComplexity: 'O(V + E)',
          bottleneck:
            'Re-scans the entire vertex and edge set on every single placement instead of decrementing indegrees incrementally via an adjacency list and queue.',
        },
        optimal: {
          approach:
            'Build directed adjacency list prereq → dependents and indegree[V]. Seed a FIFO queue with all indegree == 0 nodes, peel them iteratively, decrementing neighbor indegrees and enqueuing newly freed nodes.',
          timeComplexity: 'O(V + E)',
          spaceComplexity: 'O(V + E)',
          keyInvariant:
            'A node enters the queue if and only if ALL of its prerequisites have already been placed in order[]. Therefore idx == numCourses iff the graph is a DAG.',
        },
      },
      visualizer: {
        kind: 'tree-graph',
        title: "Kahn's BFS Indegree-Peeling Topological Sort Dry Run",
        inputSummary: 'numCourses = 5, edges: 0→1, 0→2, 1→3, 2→3, 2→4, 3→4',
        viewBoxWidth: 760,
        viewBoxHeight: 340,
        directed: true,
        nodes: [
          { id: 'c0', label: '0', x: 105, y: 165 },
          { id: 'c1', label: '1', x: 290, y: 70 },
          { id: 'c2', label: '2', x: 290, y: 248 },
          { id: 'c3', label: '3', x: 485, y: 95 },
          { id: 'c4', label: '4', x: 655, y: 210 },
        ],
        edges: [
          { from: 'c0', to: 'c1' },
          { from: 'c0', to: 'c2' },
          { from: 'c1', to: 'c3' },
          { from: 'c2', to: 'c3' },
          { from: 'c2', to: 'c4' },
          { from: 'c3', to: 'c4' },
        ],
        steps: [
          {
            caption:
              'Compute indegree for every course from prerequisite edges [course, prereq] → directed edge (prereq → course). Only course 0 has indegree 0, so seed queue = [0].',
            formula: 'Init indeg[] = [0, 1, 1, 2, 2]  →  queue = [0]',
            activeNodeId: 'c0',
            nodeStates: {
              c0: 'indeg: 0 (Q)',
              c1: 'indeg: 1',
              c2: 'indeg: 1',
              c3: 'indeg: 2',
              c4: 'indeg: 2',
            },
            variables: [
              { name: 'queue', value: '[0]', tone: 'primary' },
              { name: 'order', value: '[]' },
              { name: 'idx', value: '0 / 5' },
            ],
          },
          {
            caption:
              'Pop 0 and emit order[0] = 0. Relax outgoing edges 0→1 and 0→2: both indeg[1] and indeg[2] drop 1 → 0, unlocking courses 1 and 2 into the queue.',
            formula: 'pop 0 → indeg[1]: 1→0 (enq), indeg[2]: 1→0 (enq)',
            activeNodeId: 'c0',
            dependencyNodeIds: ['c1', 'c2'],
            visitedNodeIds: ['c0'],
            activeEdges: [
              { from: 'c0', to: 'c1' },
              { from: 'c0', to: 'c2' },
            ],
            nodeStates: {
              c0: 'DONE (#1)',
              c1: 'indeg: 0 (Q)',
              c2: 'indeg: 0 (Q)',
              c3: 'indeg: 2',
              c4: 'indeg: 2',
            },
            variables: [
              { name: 'queue', value: '[1, 2]', tone: 'primary' },
              { name: 'order', value: '[0]', tone: 'emerald' },
              { name: 'idx', value: '1 / 5' },
            ],
          },
          {
            caption:
              'Pop 1 and emit order[1] = 1. Relax edge 1→3: indeg[3] drops 2 → 1. Because indeg[3] is NOT zero yet, course 3 remains blocked waiting for prerequisite 2!',
            formula: 'pop 1 → indeg[3]: 2→1 (still blocked by course 2)',
            activeNodeId: 'c1',
            dependencyNodeIds: ['c3'],
            visitedNodeIds: ['c0', 'c1'],
            activeEdges: [{ from: 'c1', to: 'c3' }],
            nodeStates: {
              c0: 'DONE (#1)',
              c1: 'DONE (#2)',
              c2: 'indeg: 0 (Q)',
              c3: 'indeg: 1',
              c4: 'indeg: 2',
            },
            variables: [
              { name: 'queue', value: '[2]', tone: 'primary' },
              { name: 'order', value: '[0, 1]', tone: 'emerald' },
              { name: 'idx', value: '2 / 5' },
            ],
          },
          {
            caption:
              'Pop 2 and emit order[2] = 2. Relax 2→3 (indeg[3]: 1→0, enqueue 3!) and 2→4 (indeg[4]: 2→1, still blocked on course 3).',
            formula: 'pop 2 → indeg[3]: 1→0 (enq 3), indeg[4]: 2→1',
            activeNodeId: 'c2',
            dependencyNodeIds: ['c3', 'c4'],
            visitedNodeIds: ['c0', 'c1', 'c2'],
            activeEdges: [
              { from: 'c2', to: 'c3' },
              { from: 'c2', to: 'c4' },
            ],
            nodeStates: {
              c0: 'DONE (#1)',
              c1: 'DONE (#2)',
              c2: 'DONE (#3)',
              c3: 'indeg: 0 (Q)',
              c4: 'indeg: 1',
            },
            variables: [
              { name: 'queue', value: '[3]', tone: 'primary' },
              { name: 'order', value: '[0, 1, 2]', tone: 'emerald' },
              { name: 'idx', value: '3 / 5' },
            ],
          },
          {
            caption:
              'Pop 3 and emit order[3] = 3. Relax edge 3→4: indeg[4] drops 1 → 0, finally unlocking course 4 into the queue.',
            formula: 'pop 3 → indeg[4]: 1→0 (enq 4)',
            activeNodeId: 'c3',
            dependencyNodeIds: ['c4'],
            visitedNodeIds: ['c0', 'c1', 'c2', 'c3'],
            activeEdges: [{ from: 'c3', to: 'c4' }],
            nodeStates: {
              c0: 'DONE (#1)',
              c1: 'DONE (#2)',
              c2: 'DONE (#3)',
              c3: 'DONE (#4)',
              c4: 'indeg: 0 (Q)',
            },
            variables: [
              { name: 'queue', value: '[4]', tone: 'primary' },
              { name: 'order', value: '[0, 1, 2, 3]', tone: 'emerald' },
              { name: 'idx', value: '4 / 5' },
            ],
          },
          {
            caption:
              'Pop 4 and emit order[4] = 4. Queue is empty and idx == numCourses (5 == 5) — zero cycles detected! (If a back-edge like 4→1 existed, nodes 1, 3, 4 would stay stuck at indeg ≥ 1, yielding idx = 2 < 5 → return int[0].)',
            formula: 'idx == numCourses (5 == 5) → Valid DAG Order: [0, 1, 2, 3, 4]',
            visitedNodeIds: ['c0', 'c1', 'c2', 'c3', 'c4'],
            highlightedNodeIds: ['c0', 'c1', 'c2', 'c3', 'c4'],
            nodeStates: {
              c0: 'DONE (#1)',
              c1: 'DONE (#2)',
              c2: 'DONE (#3)',
              c3: 'DONE (#4)',
              c4: 'DONE (#5)',
            },
            variables: [
              { name: 'queue', value: '[]' },
              { name: 'idx == V', value: '5 == 5 ✓', tone: 'emerald' },
              { name: 'result', value: '[0,1,2,3,4]', tone: 'emerald' },
            ],
          },
        ],
      },
      javaSolution: {
        filename: 'CourseScheduleII.java',
        code: `import java.util.ArrayDeque;
import java.util.ArrayList;
import java.util.Deque;
import java.util.List;

public class CourseScheduleII {
    public int[] findOrder(int numCourses, int[][] prerequisites) {
        List<List<Integer>> graph = new ArrayList<>(numCourses);
        for (int i = 0; i < numCourses; i++) {
            graph.add(new ArrayList<>());
        }

        int[] indegree = new int[numCourses];
        for (int[] edge : prerequisites) {
            int course = edge[0];
            int prereq = edge[1];
            // Directed edge: prereq -> course (take prereq before course)
            graph.get(prereq).add(course);
            indegree[course]++;
        }

        Deque<Integer> queue = new ArrayDeque<>();
        for (int i = 0; i < numCourses; i++) {
            if (indegree[i] == 0) {
                queue.offer(i);
            }
        }

        int[] order = new int[numCourses];
        int idx = 0;

        while (!queue.isEmpty()) {
            int curr = queue.poll();
            order[idx++] = curr;

            for (int next : graph.get(curr)) {
                if (--indegree[next] == 0) {
                    queue.offer(next);
                }
            }
        }

        // Cycle check: every node in a cycle retains indegree >= 1 and is never enqueued
        return idx == numCourses ? order : new int[0];
    }
}`,
        callouts: [
          {
            id: 'cs2-direction',
            startLine: 15,
            endLine: 19,
            title: 'Edge Direction Trap: prereq → course',
            explanation:
              'LeetCode encodes pairs as [course, prereq]. Reversing the pair accidentally produces reverse topological order! Always verify: edge points from prerequisite TO dependent, and indegree increments on course.',
            accent: 'amber',
          },
          {
            id: 'cs2-decrement',
            startLine: 36,
            endLine: 40,
            title: 'Exact Zero Crossing Enqueues Once',
            explanation:
              'Using --indegree[next] == 0 guarantees each vertex enters the queue at most once without needing a separate boolean[] visited array.',
            accent: 'primary',
          },
          {
            id: 'cs2-cycle',
            startLine: 43,
            endLine: 44,
            title: 'One-Line Cycle Detection Proof',
            explanation:
              'Any vertex belonging to (or downstream of) a directed cycle always retains indegree >= 1, so BFS terminates with idx < numCourses. Returning new int[0] handles all cyclic graphs cleanly.',
            accent: 'emerald',
          },
        ],
      },
      complexity: {
        time: 'O(V + E)',
        space: 'O(V + E)',
        timeExplanation:
          'Building the adjacency list touches every prerequisite edge E once; Kahn’s BFS pops each vertex V at most once and relaxes each directed edge E at most once.',
        spaceExplanation:
          'Adjacency list holds O(V + E) integers; indegree[], order[], and the FIFO queue each take O(V) space.',
      },
      edgeCases: [
        {
          title: 'Disconnected Components & Zero Prerequisites',
          scenario: 'numCourses = 4, prerequisites = [] (no edges at all).',
          handling: 'All 4 courses have indegree 0, are enqueued upfront, and return [0, 1, 2, 3].',
        },
        {
          title: 'Lexicographically Smallest Order Follow-Up',
          scenario: 'Senior follow-up: "When multiple courses are available simultaneously, always take the lowest course ID first."',
          handling: 'Swap ArrayDeque for a Min-Heap (PriorityQueue<Integer>) — total runtime becomes O((V + E) log V) with zero other code changes.',
        },
        {
          title: 'Parallel Semesters Follow-Up (LC #1136 Parallel Courses)',
          scenario: '"What is the minimum number of semesters if you can take unlimited unblocked courses in parallel?"',
          handling: 'Process Kahn’s queue level-by-level (int size = queue.size()) and increment semesters++ per BFS wave; total waves equals the longest path length in the DAG.',
        },
      ],
    },

    /* ================================================================
     * DSA 2: NUMBER OF ISLANDS / UNION-FIND (LC #200 & #305)
     * ================================================================ */
    {
      id: 'day4-number-of-islands-union-find',
      dayNumber: 4,
      kind: 'dsa',
      title: 'Number of Islands / Union-Find',
      subtitle: 'Grid connected components via DSU (Path Compression + Rank) and streaming addLand queries',
      difficulty: 'Medium',
      patterns: ['Union-Find (DSU)', 'Path Compression + Rank', 'Grid Connected Components'],
      estimatedMinutes: 15,
      leetcodeRef: 'LC #200 & #305',
      problemStatement:
        'Given an m × n 2D binary grid where "1" represents land and "0" represents water, count the number of 4-directionally connected islands. Follow-up (LC #305): starting from an all-water grid, efficiently report the live island count after each dynamic addLand(r, c) operation.',
      exampleSummary: {
        input: '4×5 grid: [[1,1,0,0,0], [1,1,0,1,0], [0,0,1,1,0], [0,0,0,0,1]]',
        output: '3',
        explanation:
          'Island #1 spans the 2×2 top-left block; Island #2 connects (1,3), (2,2), and (2,3) when (2,3) bridges two earlier land components; Island #3 is the isolated cell (3,4) (diagonals do not connect).',
      },
      patternRecognition: {
        interviewCue:
          'Static grid island counting works with DFS/BFS or Union-Find in O(m·n). The moment an interviewer introduces STREAMING edge/land additions ("Number of Islands II", dynamic network connectivity, Accounts Merge), DFS/BFS degrades to O(k·m·n) while Disjoint Set Union answers every update in amortized O(α(m·n)) ≈ O(1).',
        signals: [
          'Counting or merging connected components across 2D grids or entity graphs',
          'Dynamic online operations (addLand, connectNodes) requiring live component counts after every update',
          'Flattening 2D coordinates into 1D DSU IDs via id = r * cols + c',
        ],
        mentalModel:
          'Every active land cell begins as its own singleton island (count++). Inspect adjacent land neighbors and invoke union(u, v): whenever two distinct roots merge into one tree, decrement count--. Path Compression flattens find() chains and Union by Rank keeps trees nearly flat (depth ≤ 4 for all practical inputs).',
      },
      intuitionComparison: {
        bruteForce: {
          approach:
            'For static LC #200, sink-in-place DFS mutates the input grid in O(m·n) (risking recursion stack overflow on 10⁵-cell snake grids). For dynamic LC #305, re-running DFS after each of k addLand calls explodes to O(k · m · n).',
          timeComplexity: 'O(m·n) static · O(k · m · n) streaming',
          spaceComplexity: 'O(m·n) DFS recursion stack',
          bottleneck:
            'DFS/BFS cannot incrementally merge two existing components without re-traversing the entire grid from scratch on every dynamic update.',
        },
        optimal: {
          approach:
            'Maintain a Disjoint Set Union (parent[], rank[], count) over flattened cell IDs r * cols + c. Activate each land cell (count++) and union with adjacent active land cells (count-- on successful merge).',
          timeComplexity: 'O(m·n · α(m·n)) static · O(k · α(m·n)) streaming',
          spaceComplexity: 'O(m·n) (or HashMap-backed O(k) for sparse streaming grids)',
          keyInvariant:
            'count always equals the exact number of active root representatives (parent[x] == x) in the forest. Merging two components with distinct roots strictly decrements count by 1.',
        },
      },
      visualizer: {
        kind: 'dp-table-2d',
        title: 'DSU Connected-Components Scan & Dynamic Merge Bridge (4×5 Grid)',
        inputSummary: '4×5 grid ("1" = unvisited land, "~" = water, "#k" = island component)',
        rowAxisLabel: 'Row',
        colAxisLabel: 'Col',
        rowHeaders: ['r0', 'r1', 'r2', 'r3'],
        colHeaders: ['c0', 'c1', 'c2', 'c3', 'c4'],
        steps: [
          {
            caption:
              'Initial 4×5 grid ("1" = land, "~" = water). Scanning row-by-row with DSU only needs to inspect UP and LEFT neighbors (or all 4 neighbors in streaming LC #305 addLand).',
            recurrence: 'On land(r, c): activate(id) [count++], then union(id, adjLand) [count--]',
            concreteFormula: 'Flatten ID = r × 5 + c  |  Initial count = 0',
            grid: [
              ['1', '1', '~', '~', '~'],
              ['1', '1', '~', '1', '~'],
              ['~', '~', '1', '1', '~'],
              ['~', '~', '~', '~', '1'],
            ],
            activeCell: { row: 0, col: 0 },
            variables: [
              { name: 'islands', value: '0' },
              { name: 'grid', value: '4 × 5 (20 cells)' },
            ],
          },
          {
            caption:
              'Activate (0,0) → creates Island #1 (root=0, count=1). Next activate (0,1) (count=2), check LEFT (0,0): union(1, 0) merges roots → count drops back to 1!',
            recurrence: 'union(id=1, id=0): roots differ → attach 1 under 0, count--',
            concreteFormula: '(0,1) merges LEFT with (0,0) → root = 0, count = 1',
            grid: [
              ['#1', '#1', '~', '~', '~'],
              ['1', '1', '~', '1', '~'],
              ['~', '~', '1', '1', '~'],
              ['~', '~', '~', '~', '1'],
            ],
            activeCell: { row: 0, col: 1 },
            dependencyCells: [{ row: 0, col: 0, label: 'Union L', tone: 'emerald' }],
            variables: [
              { name: 'cell', value: '(0, 1) id=1' },
              { name: 'root', value: '0 (#1)', tone: 'emerald' },
              { name: 'islands', value: '1', tone: 'emerald' },
            ],
          },
          {
            caption:
              'Row 1 left block: (1,0) unions UP with (0,0). Then (1,1) activates (count=2), unions UP with (0,1) (count=1), and checks LEFT (1,0) — find(6) == find(5) == 0 (already same component → no-op!).',
            recurrence: 'if find(u) == find(v) → already connected, count unchanged',
            concreteFormula: '(1,1): union UP → root 0; check LEFT → same root 0 (skip)',
            grid: [
              ['#1', '#1', '~', '~', '~'],
              ['#1', '#1', '~', '1', '~'],
              ['~', '~', '1', '1', '~'],
              ['~', '~', '~', '~', '1'],
            ],
            activeCell: { row: 1, col: 1 },
            dependencyCells: [
              { row: 0, col: 1, label: 'Union U', tone: 'emerald' },
              { row: 1, col: 0, label: 'Same', tone: 'primary' },
            ],
            variables: [
              { name: 'cell', value: '(1, 1) id=6' },
              { name: 'find(6)', value: '0 (#1)', tone: 'emerald' },
              { name: 'islands', value: '1', tone: 'emerald' },
            ],
          },
          {
            caption:
              'Advance to (1,3) (id=8): both UP (0,3) and LEFT (1,2) are water! No merges occur, so (1,3) spawns independent Island #2 (root=8, count=2).',
            recurrence: 'No adjacent land → new component root',
            concreteFormula: 'activate(1,3) → root = 8 (#2), islands = 2',
            grid: [
              ['#1', '#1', '~', '~', '~'],
              ['#1', '#1', '~', '#2', '~'],
              ['~', '~', '1', '1', '~'],
              ['~', '~', '~', '~', '1'],
            ],
            activeCell: { row: 1, col: 3 },
            dependencyCells: [
              { row: 0, col: 3, label: 'Water', tone: 'rose' },
              { row: 1, col: 2, label: 'Water', tone: 'rose' },
            ],
            variables: [
              { name: 'cell', value: '(1, 3) id=8' },
              { name: 'root', value: '8 (#2)', tone: 'amber' },
              { name: 'islands', value: '2', tone: 'amber' },
            ],
          },
          {
            caption:
              'Row 2 hits (2,2) (id=12): UP (1,2) and LEFT (2,1) are both water! Before seeing (2,3), DSU temporarily treats (2,2) as a separate Island #3 (root=12, count=3).',
            recurrence: 'Temporary separate component until bridge cell arrives',
            concreteFormula: 'activate(2,2) → root = 12 (#3), islands = 3',
            grid: [
              ['#1', '#1', '~', '~', '~'],
              ['#1', '#1', '~', '#2', '~'],
              ['~', '~', '#3', '1', '~'],
              ['~', '~', '~', '~', '1'],
            ],
            activeCell: { row: 2, col: 2 },
            dependencyCells: [
              { row: 1, col: 2, label: 'Water', tone: 'rose' },
              { row: 2, col: 1, label: 'Water', tone: 'rose' },
            ],
            variables: [
              { name: 'cell', value: '(2, 2) id=12' },
              { name: 'root', value: '12 (#3)', tone: 'amber' },
              { name: 'islands', value: '3 (temp)', tone: 'amber' },
            ],
          },
          {
            caption:
              'The DSU Bridge at (2,3) (id=13)! Activate (count 3→4), union UP with (1,3) [#2] (count 4→3), THEN union LEFT with (2,2) [#3] (count 3→2)! Two distinct islands collapse into #2 in O(α(n)) time — exact LC #305 magic!',
            recurrence: 'Bridge cell merges TWO distinct trees → count = count + 1 - 2 = count - 1',
            concreteFormula: 'union(13, 8 [#2]) then union(13, 12 [#3]) → islands: 3 → 2!',
            grid: [
              ['#1', '#1', '~', '~', '~'],
              ['#1', '#1', '~', '#2', '~'],
              ['~', '~', '#2', '#2', '~'],
              ['~', '~', '~', '~', '1'],
            ],
            activeCell: { row: 2, col: 3 },
            dependencyCells: [
              { row: 1, col: 3, label: 'Merge #2', tone: 'emerald' },
              { row: 2, col: 2, label: 'Merge #3', tone: 'amber' },
            ],
            variables: [
              { name: 'cell', value: '(2, 3) id=13' },
              { name: 'merges', value: '2 distinct roots!', tone: 'emerald' },
              { name: 'islands', value: '2', tone: 'emerald' },
            ],
          },
          {
            caption:
              'Row 3 reaches (3,4) (id=19): UP (2,4) and LEFT (3,3) are water. Even though (2,3) is diagonally adjacent, 4-connectivity ignores diagonals → spawns Island #3 (count=3).',
            recurrence: '4-directional adjacency only (ignore diagonals)',
            concreteFormula: 'activate(3,4) → root = 19 (#3), final islands = 3',
            grid: [
              ['#1', '#1', '~', '~', '~'],
              ['#1', '#1', '~', '#2', '~'],
              ['~', '~', '#2', '#2', '~'],
              ['~', '~', '~', '~', '#3'],
            ],
            activeCell: { row: 3, col: 4 },
            dependencyCells: [
              { row: 2, col: 4, label: 'Water', tone: 'rose' },
              { row: 3, col: 3, label: 'Water', tone: 'rose' },
            ],
            variables: [
              { name: 'cell', value: '(3, 4) id=19' },
              { name: 'root', value: '19 (#3)', tone: 'primary' },
              { name: 'islands', value: '3', tone: 'emerald' },
            ],
          },
          {
            caption:
              'Scan complete: 3 distinct islands (#1: 4 cells, #2: 3 cells, #3: 1 cell). For streaming addLand(r, c) (LC #305), this exact DSU checks all 4 neighbors and returns the updated island count in O(α(m·n)) ≈ O(1) per query!',
            recurrence: 'Static LC #200: O(m·n·α)  |  Streaming LC #305: O(k·α) per k addLand ops',
            concreteFormula: 'Final Component Roots: {0 (#1), 8 (#2), 19 (#3)} → Answer = 3',
            grid: [
              ['#1', '#1', '~', '~', '~'],
              ['#1', '#1', '~', '#2', '~'],
              ['~', '~', '#2', '#2', '~'],
              ['~', '~', '~', '~', '#3'],
            ],
            pathCells: [
              { row: 0, col: 0 },
              { row: 0, col: 1 },
              { row: 1, col: 0 },
              { row: 1, col: 1 },
              { row: 1, col: 3 },
              { row: 2, col: 2 },
              { row: 2, col: 3 },
              { row: 3, col: 4 },
            ],
            variables: [
              { name: 'totalIslands', value: '3', tone: 'emerald' },
              { name: 'amortizedOp', value: 'O(α(N)) ≈ O(1)', tone: 'emerald' },
            ],
          },
        ],
      },
      javaSolution: {
        filename: 'NumberOfIslandsDSU.java',
        code: `import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

public class NumberOfIslandsDSU {
    private static final int[][] DIRS = {{-1, 0}, {1, 0}, {0, -1}, {0, 1}};

    static final class DisjointSet {
        private final int[] parent;
        private final int[] rank;
        private int components = 0;

        DisjointSet(int size) {
            this.parent = new int[size];
            this.rank = new int[size];
            Arrays.fill(this.parent, -1); // -1 marks water (inactive node)
        }

        boolean isLand(int id) {
            return parent[id] != -1;
        }

        void addLand(int id) {
            if (isLand(id)) {
                return; // Idempotent guard for duplicate LC #305 addLand coordinates
            }
            parent[id] = id;
            components++;
        }

        int find(int x) {
            // Path compression: point every visited node directly to root
            if (parent[x] != x) {
                parent[x] = find(parent[x]);
            }
            return parent[x];
        }

        void union(int a, int b) {
            int rootA = find(a);
            int rootB = find(b);
            if (rootA == rootB) {
                return;
            }
            // Union by rank: attach shallower tree under taller tree
            if (rank[rootA] < rank[rootB]) {
                parent[rootA] = rootB;
            } else if (rank[rootA] > rank[rootB]) {
                parent[rootB] = rootA;
            } else {
                parent[rootB] = rootA;
                rank[rootA]++;
            }
            components--;
        }

        int getComponents() {
            return components;
        }
    }

    // LC #200: Static grid island count without mutating the input char[][]
    public int numIslands(char[][] grid) {
        if (grid == null || grid.length == 0) {
            return 0;
        }
        int rows = grid.length;
        int cols = grid[0].length;
        DisjointSet dsu = new DisjointSet(rows * cols);

        for (int r = 0; r < rows; r++) {
            for (int c = 0; c < cols; c++) {
                if (grid[r][c] != '1') {
                    continue;
                }
                int id = r * cols + c;
                dsu.addLand(id);
                if (r > 0 && grid[r - 1][c] == '1') {
                    dsu.union(id, (r - 1) * cols + c);
                }
                if (c > 0 && grid[r][c - 1] == '1') {
                    dsu.union(id, r * cols + (c - 1));
                }
            }
        }
        return dsu.getComponents();
    }

    // LC #305: Streaming dynamic addLand queries in O(k * alpha(m * n))
    public List<Integer> numIslands2(int m, int n, int[][] positions) {
        DisjointSet dsu = new DisjointSet(m * n);
        List<Integer> counts = new ArrayList<>(positions.length);

        for (int[] pos : positions) {
            int r = pos[0];
            int c = pos[1];
            int id = r * n + c;
            dsu.addLand(id);

            for (int[] d : DIRS) {
                int nr = r + d[0];
                int nc = c + d[1];
                if (nr >= 0 && nr < m && nc >= 0 && nc < n) {
                    int neighborId = nr * n + nc;
                    if (dsu.isLand(neighborId)) {
                        dsu.union(id, neighborId);
                    }
                }
            }
            counts.add(dsu.getComponents());
        }
        return counts;
    }
}`,
        callouts: [
          {
            id: 'dsu-sentinel',
            startLine: 16,
            endLine: 29,
            title: 'Water Sentinel (-1) & Duplicate addLand Idempotency',
            explanation:
              'Initializing parent[] to -1 cleanly distinguishes water from active land without a second boolean[][] array, and the isLand(id) check prevents double-counting if LC #305 repeats an identical coordinate.',
            accent: 'amber',
          },
          {
            id: 'dsu-pc-rank',
            startLine: 31,
            endLine: 55,
            title: 'Path Compression + Union by Rank Together Give O(α(N))',
            explanation:
              'Path compression alone gives O(log n) amortized; Union by Rank alone gives O(log n) worst-case. Combining BOTH achieves inverse Ackermann O(α(N)) ≤ 4 operations for every N up to 10⁸⁰!',
            accent: 'emerald',
          },
          {
            id: 'dsu-streaming',
            startLine: 89,
            endLine: 113,
            title: 'Why Union-Find Dominates Streaming LC #305',
            explanation:
              'Each dynamic addLand(r, c) touches at most 4 neighbors and runs in ~O(1) amortized time without ever mutating an input grid or re-scanning previous islands. Mention swapping parent[] for HashMap<Integer, Integer> if m × n is huge (10⁹) but k is sparse!',
            accent: 'primary',
          },
        ],
      },
      complexity: {
        time: 'O(m·n · α(m·n)) static · O(k · α(m·n)) streaming',
        space: 'O(m·n)',
        timeExplanation:
          'Each cell or streaming operation invokes at most 4 find/union calls, each amortized O(α(m·n)) ≈ O(1). For static LC #200, checking only UP and LEFT halves redundant union checks.',
        spaceExplanation:
          'parent[] and rank[] allocate 2·m·n integers. Unlike recursive DFS, DSU never risks StackOverflowError on a 1,000 × 1,000 spiral island, and preserves the input grid read-only.',
      },
      edgeCases: [
        {
          title: 'Duplicate addLand Coordinates in LC #305',
          scenario: 'positions = [[0,0], [0,1], [0,0]] adds land on an already-land cell.',
          handling: 'Without the if (isLand(id)) return guard, components would spuriously increment on duplicate coordinates.',
        },
        {
          title: 'Distributed / Huge Grid Streaming (Map-Reduce Islands)',
          scenario: 'Senior follow-up: "What if the 1,000,000 × 1,000,000 satellite image cannot fit on one machine?"',
          handling: 'Partition the grid into horizontal strips across workers, run local DSU per strip, then merge ONLY the 1D boundary rows between adjacent strips via a coordinator DSU!',
        },
        {
          title: 'Static DFS vs. DSU Trade-Off in Interviews',
          scenario: 'When should you write BFS/DFS vs. DSU for LC #200?',
          handling: 'Call out the trade-off explicitly: iterative BFS uses O(min(m, n)) queue memory if mutating grid in-place is allowed; DSU is read-only on input, generalizes immediately to LC #305 streaming queries, and supports component-size tracking effortlessly.',
        },
      ],
    },

    /* ================================================================
     * DSA 3: NETWORK DELAY TIME (DIJKSTRA)
     * ================================================================ */
    {
      id: 'day4-network-delay-time',
      dayNumber: 4,
      kind: 'dsa',
      title: 'Network Delay Time (Dijkstra)',
      subtitle: 'Weighted single-source shortest path with Min-Heap relaxation and lazy stale-entry skipping',
      difficulty: 'Medium',
      patterns: ["Dijkstra's Algorithm", 'Min-Heap (PriorityQueue)', 'Lazy Stale-Entry Skipping'],
      estimatedMinutes: 15,
      leetcodeRef: 'LC #743',
      problemStatement:
        'You are given a network of n nodes labeled 1 to n and directed weighted edges times[i] = (u, v, w), where w >= 0 is the signal travel time from u to v. A signal is broadcast from source node k. Return the minimum time for ALL n nodes to receive the signal, or -1 if any node is unreachable.',
      exampleSummary: {
        input: 'n = 5, k = 1, times = [[1,2,2], [1,3,5], [2,3,1], [2,4,7], [3,4,2], [3,5,6], [4,5,1]]',
        output: '6',
        explanation:
          'Shortest latencies from node 1 are dist[1]=0, dist[2]=2, dist[3]=3 (via 1→2→3, beating direct 5), dist[4]=5 (via 3→4, beating 9), and dist[5]=6 (via 4→5, beating 9). The bottleneck node determines total broadcast time: max = 6.',
      },
      patternRecognition: {
        interviewCue:
          'Whenever you need the shortest path or minimum latency from a source in a graph with NON-NEGATIVE edge weights (w >= 0), standard BFS breaks because fewer hops can cost more than multi-hop detours — switch immediately to Dijkstra’s Min-Heap.',
        signals: [
          'Weighted edges with w >= 0 (network latency, road travel time, minimum effort grid)',
          'Time until ALL nodes receive a signal = max_{v ∈ V} shortestDist(k, v)',
          'Java’s PriorityQueue lacks O(log V) decrease-key — push duplicate improved pairs and lazily skip stale entries on poll()',
        ],
        mentalModel:
          'Maintain a greedy settled frontier expanding in strictly non-decreasing order of cumulative distance from k. Because every edge weight is >= 0, the FIRST time a node u is popped from the Min-Heap, its distance d is mathematically guaranteed to be globally optimal — any later detour can only add >= 0 cost.',
      },
      intuitionComparison: {
        bruteForce: {
          approach:
            'Bellman-Ford relaxing all E edges (V - 1) times, or unpruned DFS enumerating simple paths from source k.',
          timeComplexity: 'O(V · E) Bellman-Ford · O(V!) DFS',
          spaceComplexity: 'O(V + E)',
          bottleneck:
            'Bellman-Ford repeatedly re-relaxes edges whose source distances have not changed; unnecessary when all weights are non-negative.',
        },
        optimal: {
          approach:
            'Adjacency list + Min-Heap PriorityQueue ordered by cumulative distance. Pop (u, d); if d > dist[u], skip stale entry; otherwise relax all outgoing edges (u → v, w) pushing (v, d + w) whenever d + w < dist[v].',
          timeComplexity: 'O((V + E) log V)',
          spaceComplexity: 'O(V + E)',
          keyInvariant:
            'Every edge (u → v) is relaxed at most once — solely when u is settled with its final shortest distance dist[u]. Stale heap copies satisfy d > dist[u] and are discarded in O(1).',
        },
      },
      visualizer: {
        kind: 'tree-graph',
        title: "Dijkstra's Min-Heap Relaxation & Stale-Entry Skipping Dry Run",
        inputSummary: 'n = 5, source k = 1  |  edges: 1→2(2), 1→3(5), 2→3(1), 2→4(7), 3→4(2), 3→5(6), 4→5(1)',
        viewBoxWidth: 760,
        viewBoxHeight: 340,
        directed: true,
        nodes: [
          { id: 'n1', label: '1', x: 95, y: 165 },
          { id: 'n2', label: '2', x: 275, y: 68 },
          { id: 'n3', label: '3', x: 275, y: 245 },
          { id: 'n4', label: '4', x: 490, y: 82 },
          { id: 'n5', label: '5', x: 665, y: 210 },
        ],
        edges: [
          { from: 'n1', to: 'n2', weight: '2' },
          { from: 'n1', to: 'n3', weight: '5' },
          { from: 'n2', to: 'n3', weight: '1' },
          { from: 'n2', to: 'n4', weight: '7' },
          { from: 'n3', to: 'n4', weight: '2' },
          { from: 'n3', to: 'n5', weight: '6' },
          { from: 'n4', to: 'n5', weight: '1' },
        ],
        steps: [
          {
            caption:
              'Initialize dist[1] = 0 and all other distances to ∞. Push (node=1, dist=0) into the Min-Heap. Pop (1, 0) and relax 1→2 (0+2=2) and 1→3 (0+5=5).',
            formula: 'Pop (1,0): dist[2]: ∞→2, dist[3]: ∞→5  |  heap = [(2,2), (3,5)]',
            activeNodeId: 'n1',
            dependencyNodeIds: ['n2', 'n3'],
            visitedNodeIds: ['n1'],
            activeEdges: [
              { from: 'n1', to: 'n2' },
              { from: 'n1', to: 'n3' },
            ],
            nodeStates: {
              n1: 'dist: 0 ✓',
              n2: 'dist: ∞→2',
              n3: 'dist: ∞→5',
              n4: 'dist: ∞',
              n5: 'dist: ∞',
            },
            variables: [
              { name: 'popped', value: '(1, d=0)', tone: 'primary' },
              { name: 'minHeap', value: '[(2,2), (3,5)]' },
              { name: 'settled', value: '1 / 5' },
            ],
          },
          {
            caption:
              'Pop minimum (2, 2): settles node 2 permanently! Relax 2→3: 2+1 = 3 < 5 → improves dist[3] from 5 → 3 and pushes (3, 3) (leaving older (3, 5) as STALE in heap!). Relax 2→4: ∞ → 9.',
            formula: 'Pop (2,2): dist[3]: 5→3 (2+1), dist[4]: ∞→9 (2+7)',
            activeNodeId: 'n2',
            dependencyNodeIds: ['n3', 'n4'],
            visitedNodeIds: ['n1', 'n2'],
            activeEdges: [
              { from: 'n2', to: 'n3' },
              { from: 'n2', to: 'n4' },
            ],
            nodeStates: {
              n1: 'dist: 0 ✓',
              n2: 'dist: 2 ✓',
              n3: 'dist: 5→3',
              n4: 'dist: ∞→9',
              n5: 'dist: ∞',
            },
            variables: [
              { name: 'popped', value: '(2, d=2)', tone: 'primary' },
              { name: 'minHeap', value: '[(3,3), (3,5)*, (4,9)]', tone: 'amber' },
              { name: 'settled', value: '2 / 5' },
            ],
          },
          {
            caption:
              'Pop minimum (3, 3): settles node 3! Relax 3→4: 3+2 = 5 < 9 → tightens dist[4] from 9 → 5 (making (4, 9) stale!). Relax 3→5: 3+6 = 9.',
            formula: 'Pop (3,3): dist[4]: 9→5 (3+2), dist[5]: ∞→9 (3+6)',
            activeNodeId: 'n3',
            dependencyNodeIds: ['n4', 'n5'],
            visitedNodeIds: ['n1', 'n2', 'n3'],
            activeEdges: [
              { from: 'n3', to: 'n4' },
              { from: 'n3', to: 'n5' },
            ],
            nodeStates: {
              n1: 'dist: 0 ✓',
              n2: 'dist: 2 ✓',
              n3: 'dist: 3 ✓',
              n4: 'dist: 9→5',
              n5: 'dist: ∞→9',
            },
            variables: [
              { name: 'popped', value: '(3, d=3)', tone: 'primary' },
              { name: 'minHeap', value: '[(3,5)*, (4,5), (4,9)*, (5,9)]' },
              { name: 'settled', value: '3 / 5' },
            ],
          },
          {
            caption:
              'Lazy Stale-Entry Skip! Heap pops (3, 5), but 5 > dist[3] (3)! Immediately execute continue — zero edges re-scanned! This replaces missing decrease-key cleanly.',
            formula: 'Pop (3,5): d(5) > dist[3](3) → STALE! Skip in O(1)',
            activeNodeId: 'n3',
            visitedNodeIds: ['n1', 'n2', 'n3'],
            nodeStates: {
              n1: 'dist: 0 ✓',
              n2: 'dist: 2 ✓',
              n3: 'SKIP (5 > 3)',
              n4: 'dist: 5',
              n5: 'dist: 9',
            },
            variables: [
              { name: 'popped', value: '(3, d=5) STALE', tone: 'rose' },
              { name: 'minHeap', value: '[(4,5), (4,9)*, (5,9)]' },
              { name: 'settled', value: '3 / 5' },
            ],
          },
          {
            caption:
              'Pop minimum (4, 5): settles node 4! Relax 4→5: 5+1 = 6 < 9 → lowers dist[5] from 9 → 6 and pushes (5, 6), making (5, 9) stale.',
            formula: 'Pop (4,5): dist[5]: 9→6 (5+1)  |  heap = [(5,6), (4,9)*, (5,9)*]',
            activeNodeId: 'n4',
            dependencyNodeIds: ['n5'],
            visitedNodeIds: ['n1', 'n2', 'n3', 'n4'],
            activeEdges: [{ from: 'n4', to: 'n5' }],
            nodeStates: {
              n1: 'dist: 0 ✓',
              n2: 'dist: 2 ✓',
              n3: 'dist: 3 ✓',
              n4: 'dist: 5 ✓',
              n5: 'dist: 9→6',
            },
            variables: [
              { name: 'popped', value: '(4, d=5)', tone: 'primary' },
              { name: 'minHeap', value: '[(5,6), (4,9)*, (5,9)*]' },
              { name: 'settled', value: '4 / 5' },
            ],
          },
          {
            caption:
              'Pop (5, 6): settles node 5 — all 5/5 nodes settled! Early-exit immediately (or skip remaining stale entries (4,9)* and (5,9)*). Maximum shortest latency = max(0, 2, 3, 5, 6) = 6!',
            formula: 'All 5 nodes reached  →  max(0, 2, 3, 5, 6) = 6 (Path: 1→2→3→4→5)',
            visitedNodeIds: ['n1', 'n2', 'n3', 'n4', 'n5'],
            highlightedNodeIds: ['n1', 'n2', 'n3', 'n4', 'n5'],
            activeEdges: [
              { from: 'n1', to: 'n2' },
              { from: 'n2', to: 'n3' },
              { from: 'n3', to: 'n4' },
              { from: 'n4', to: 'n5' },
            ],
            nodeStates: {
              n1: 'dist: 0 ✓',
              n2: 'dist: 2 ✓',
              n3: 'dist: 3 ✓',
              n4: 'dist: 5 ✓',
              n5: 'dist: 6 (MAX)',
            },
            variables: [
              { name: 'settled', value: '5 / 5 ✓', tone: 'emerald' },
              { name: 'maxLatency', value: '6', tone: 'emerald' },
            ],
          },
        ],
      },
      javaSolution: {
        filename: 'NetworkDelayTime.java',
        code: `import java.util.ArrayList;
import java.util.Arrays;
import java.util.Comparator;
import java.util.List;
import java.util.PriorityQueue;

public class NetworkDelayTime {
    public int networkDelayTime(int[][] times, int n, int k) {
        List<List<int[]>> graph = new ArrayList<>(n + 1);
        for (int i = 0; i <= n; i++) {
            graph.add(new ArrayList<>());
        }
        for (int[] edge : times) {
            graph.get(edge[0]).add(new int[]{edge[1], edge[2]});
        }

        int[] dist = new int[n + 1];
        Arrays.fill(dist, Integer.MAX_VALUE);
        dist[k] = 0;

        // Min-Heap entries: int[]{node, cumulativeDist}
        PriorityQueue<int[]> minHeap = new PriorityQueue<>(Comparator.comparingInt(a -> a[1]));
        minHeap.offer(new int[]{k, 0});

        int settledCount = 0;
        int maxDelay = 0;

        while (!minHeap.isEmpty()) {
            int[] curr = minHeap.poll();
            int u = curr[0];
            int d = curr[1];

            // Lazy deletion guard: skip outdated heap entries superseded by a shorter path
            if (d > dist[u]) {
                continue;
            }

            maxDelay = d; // Popped in non-decreasing order, so last settled node IS the max
            if (++settledCount == n) {
                return maxDelay; // Early exit before draining leftover stale heap entries
            }

            for (int[] edge : graph.get(u)) {
                int v = edge[0];
                int weight = edge[1];
                int candidateDist = d + weight;

                if (candidateDist < dist[v]) {
                    dist[v] = candidateDist;
                    minHeap.offer(new int[]{v, candidateDist});
                }
            }
        }

        return -1;
    }
}`,
        callouts: [
          {
            id: 'ndt-comparator',
            startLine: 22,
            endLine: 22,
            title: 'Comparator.comparingInt Prevents Subtraction Overflow',
            explanation:
              'Never write (a, b) -> a[1] - b[1] in production Java when weights can be large: integer subtraction overflows past 2³¹ - 1. Comparator.comparingInt uses Integer.compare safely.',
            accent: 'primary',
          },
          {
            id: 'ndt-stale',
            startLine: 33,
            endLine: 36,
            title: 'Lazy Stale-Entry Guard (Critical for O((V + E) log V))',
            explanation:
              'Without if (d > dist[u]) continue, popping a superseded entry re-relaxes all outgoing edges of u, degrading Dijkstra to exponential runtime on dense graphs! Checking d > dist[u] guarantees each node expands edges at most once.',
            accent: 'amber',
          },
          {
            id: 'ndt-early-exit',
            startLine: 38,
            endLine: 41,
            title: 'Monotonic Settle Order Enables Early Exit',
            explanation:
              'Because the Min-Heap settles nodes in strictly non-decreasing order of distance, the n-th settled node is guaranteed to hold the global maximum latency — returning immediately skips leftover stale entries.',
            accent: 'emerald',
          },
        ],
      },
      complexity: {
        time: 'O((V + E) log V)',
        space: 'O(V + E)',
        timeExplanation:
          'At most E relaxation pushes enter the binary heap; since E ≤ V², log(E) = O(log V). Each push/pop costs O(log V) and each adjacency list is traversed once upon settling.',
        spaceExplanation:
          'Adjacency list stores O(V + E), dist[] stores O(V), and the lazy PriorityQueue holds at most O(E) entries in the worst case.',
      },
      edgeCases: [
        {
          title: 'Why Negative Weights Break Dijkstra (Interview Probe)',
          scenario: 'Suppose 1→2(5), 1→3(2), 2→3(-4). Dijkstra pops (3, 2) first and locks dist[3]=2, missing 1→2→3 = 1!',
          handling: 'State clearly: Dijkstra’s greedy invariant relies on w >= 0 so future paths can only grow. With negative weights (no negative cycles), use Bellman-Ford O(V·E) or SPFA.',
        },
        {
          title: 'Unreachable / Disconnected Nodes',
          scenario: 'Graph has n = 4 nodes but node 4 has no incoming edges from k.',
          handling: 'Heap empties with settledCount < n, falling cleanly through to return -1.',
        },
        {
          title: 'State-Space Dijkstra Follow-Up (Cheapest Flights Within K Stops)',
          scenario: 'What if the shortest path has a secondary constraint like "at most k stops" or "limited fuel"?',
          handling: 'Lift the state node from u to (u, stopsUsed) with 2D dist[u][stops] (or run k+1 rounds of Bellman-Ford) because a pricier path with FEWER stops may still beat a cheaper path that runs out of stops!',
        },
      ],
    },

    /* ================================================================
     * DSA 4: WORD LADDER (LC #127)
     * ================================================================ */
    {
      id: 'day4-word-ladder',
      dayNumber: 4,
      kind: 'dsa',
      title: 'Word Ladder',
      subtitle: 'Unweighted shortest-path BFS via wildcard pattern buckets & Bidirectional BFS optimization',
      difficulty: 'Hard',
      patterns: ['Shortest-Path BFS', 'Wildcard Pattern Buckets', 'Bidirectional BFS'],
      estimatedMinutes: 15,
      leetcodeRef: 'LC #127',
      problemStatement:
        'Given beginWord, endWord, and a dictionary wordList of equal-length lowercase words, return the number of words in the shortest transformation sequence from beginWord to endWord where each step changes exactly ONE letter and every intermediate word must belong to wordList. Return 0 if no sequence exists.',
      exampleSummary: {
        input: 'beginWord = "hit", endWord = "cog", wordList = ["hot", "dot", "dog", "lot", "log", "cog"]',
        output: '5',
        explanation:
          'Shortest ladder has 5 words: "hit" → "hot" → "dot" → "dog" → "cog" (or via "lot" → "log"). All edges have uniform weight 1, so BFS guarantees the shortest path.',
      },
      patternRecognition: {
        interviewCue:
          'Whenever you must find the MINIMUM number of single-step mutations from a start state to a target state (Word Ladder, Open the Lock, Minimum Genetic Mutation), model states as an unweighted implicit graph and run BFS — then volunteer Bidirectional BFS to slash search volume from O(b^d) to O(b^(d/2)).',
        signals: [
          'Minimum transformation steps / shortest unweighted path between start and goal state',
          'Explicitly comparing all N² pairs of words to build edges costs O(N² · L) — too slow for N = 5,000!',
          'Both start AND end states are known upfront → textbook trigger for Bidirectional BFS',
        ],
        mentalModel:
          'Connect words implicitly through length-L wildcard buckets (e.g., "hot" → "*ot", "h*t", "ho*") OR generate all 26·L single-letter mutations in O(26·L) against a HashSet dictionary. Expanding from whichever frontier (beginSet vs. endSet) is SMALLER shrinks exponential branching to its square root.',
      },
      intuitionComparison: {
        bruteForce: {
          approach:
            'Pre-build an explicit graph by comparing every pair of dictionary words (i, j) to check if Hamming distance == 1, then run single-source BFS.',
          timeComplexity: 'O(N² · L)',
          spaceComplexity: 'O(N²)',
          bottleneck:
            'Checking all N(N - 1)/2 pairs takes 25M comparisons for N = 5,000 even when each word only has 26·L possible 1-edit neighbors.',
        },
        optimal: {
          approach:
            'Bidirectional BFS expanding the smaller frontier (front vs. back) via 26-char mutation against a HashSet dictionary (or wildcard buckets O(N · L²)), stopping the instant the two frontiers intersect.',
          timeComplexity: 'O(N · L² · 26) worst-case, dramatically faster O(b^(d/2)) in practice',
          spaceComplexity: 'O(N · L)',
          keyInvariant:
            'Always expanding the smaller frontier minimizes nodes explored per level; removing visited words from dict upon discovery prevents cycles and redundant bucket scans.',
        },
      },
      visualizer: {
        kind: 'tree-graph',
        title: 'Shortest-Path BFS Levels & Wildcard Pattern Buckets',
        inputSummary: 'begin = "hit" → end = "cog"  |  wordList = [hot, dot, dog, lot, log, cog]',
        viewBoxWidth: 780,
        viewBoxHeight: 340,
        nodes: [
          { id: 'hit', label: 'hit', x: 88, y: 165 },
          { id: 'hot', label: 'hot', x: 236, y: 165 },
          { id: 'dot', label: 'dot', x: 395, y: 72 },
          { id: 'lot', label: 'lot', x: 395, y: 248 },
          { id: 'dog', label: 'dog', x: 555, y: 72 },
          { id: 'log', label: 'log', x: 555, y: 248 },
          { id: 'cog', label: 'cog', x: 695, y: 165 },
        ],
        edges: [
          { from: 'hit', to: 'hot', weight: 'h*t' },
          { from: 'hot', to: 'dot', weight: '*ot' },
          { from: 'hot', to: 'lot', weight: '*ot' },
          { from: 'dot', to: 'lot', weight: '*ot' },
          { from: 'dot', to: 'dog', weight: 'do*' },
          { from: 'lot', to: 'log', weight: 'lo*' },
          { from: 'dog', to: 'log', weight: '*og' },
          { from: 'dog', to: 'cog', weight: '*og' },
          { from: 'log', to: 'cog', weight: '*og' },
        ],
        steps: [
          {
            caption:
              'Verify "cog" exists in wordList (if missing, return 0 immediately!). Index words into wildcard buckets: h*t→[hot], *ot→[hot,dot,lot], do*→[dot,dog], lo*→[lot,log], *og→[dog,log,cog]. Start BFS Level 1 at "hit".',
            formula: 'Level 1: queue = ["hit"]  |  endWord "cog" ∈ wordList ✓',
            activeNodeId: 'hit',
            visitedNodeIds: ['hit'],
            nodeStates: {
              hit: 'lvl: 1 (start)',
              cog: 'TARGET',
            },
            variables: [
              { name: 'level', value: '1' },
              { name: 'queue', value: '["hit"]', tone: 'primary' },
            ],
          },
          {
            caption:
              'Expand Level 1 ("hit"): probe patterns *it, h*t, hi*. Bucket h*t matches "hot"! Mark "hot" visited on enqueue at Level 2.',
            formula: '"hit" matches bucket "h*t" → enqueue "hot" (lvl = 2)',
            activeNodeId: 'hit',
            dependencyNodeIds: ['hot'],
            visitedNodeIds: ['hit', 'hot'],
            activeEdges: [{ from: 'hit', to: 'hot' }],
            nodeStates: {
              hit: 'lvl: 1',
              hot: 'lvl: 2 (Q)',
              cog: 'TARGET',
            },
            variables: [
              { name: 'level', value: '2' },
              { name: 'matchedBucket', value: 'h*t', tone: 'amber' },
              { name: 'queue', value: '["hot"]', tone: 'primary' },
            ],
          },
          {
            caption:
              'Expand Level 2 ("hot"): probe bucket *ot → unlocks BOTH "dot" and "lot" at Level 3! Clear bucket *ot immediately after draining so sibling words never re-scan it.',
            formula: '"hot" matches bucket "*ot" → enqueue "dot", "lot" (lvl = 3)',
            activeNodeId: 'hot',
            dependencyNodeIds: ['dot', 'lot'],
            visitedNodeIds: ['hit', 'hot', 'dot', 'lot'],
            activeEdges: [
              { from: 'hot', to: 'dot' },
              { from: 'hot', to: 'lot' },
            ],
            nodeStates: {
              hit: 'lvl: 1',
              hot: 'lvl: 2',
              dot: 'lvl: 3 (Q)',
              lot: 'lvl: 3 (Q)',
              cog: 'TARGET',
            },
            variables: [
              { name: 'level', value: '3' },
              { name: 'matchedBucket', value: '*ot (cleared)', tone: 'amber' },
              { name: 'queue', value: '["dot", "lot"]', tone: 'primary' },
            ],
          },
          {
            caption:
              'Expand Level 3 ("dot", "lot"): "dot" hits do* → "dog" (lvl 4); "lot" hits lo* → "log" (lvl 4). Already-visited cross-edge dot↔lot is skipped automatically.',
            formula: '"dot"→do*→"dog", "lot"→lo*→"log" (lvl = 4)',
            activeNodeId: 'dot',
            dependencyNodeIds: ['dog', 'log'],
            visitedNodeIds: ['hit', 'hot', 'dot', 'lot', 'dog', 'log'],
            activeEdges: [
              { from: 'dot', to: 'dog' },
              { from: 'lot', to: 'log' },
            ],
            nodeStates: {
              hit: 'lvl: 1',
              hot: 'lvl: 2',
              dot: 'lvl: 3',
              lot: 'lvl: 3',
              dog: 'lvl: 4 (Q)',
              log: 'lvl: 4 (Q)',
              cog: 'TARGET',
            },
            variables: [
              { name: 'level', value: '4' },
              { name: 'buckets', value: 'do*, lo*', tone: 'amber' },
              { name: 'queue', value: '["dog", "log"]', tone: 'primary' },
            ],
          },
          {
            caption:
              'Expand Level 4 ("dog"): bucket *og contains "cog" — TARGET FOUND! Return level + 1 = 5 immediately without even needing to expand "log"!',
            formula: '"dog" matches bucket "*og" → hits "cog"! Return 4 + 1 = 5',
            activeNodeId: 'dog',
            dependencyNodeIds: ['cog'],
            visitedNodeIds: ['hit', 'hot', 'dot', 'lot', 'dog', 'log', 'cog'],
            activeEdges: [{ from: 'dog', to: 'cog' }],
            nodeStates: {
              hit: 'lvl: 1',
              hot: 'lvl: 2',
              dot: 'lvl: 3',
              lot: 'lvl: 3',
              dog: 'lvl: 4',
              log: 'lvl: 4',
              cog: 'FOUND (lvl 5)!',
            },
            variables: [
              { name: 'level', value: '5', tone: 'emerald' },
              { name: 'answer', value: '5 words', tone: 'emerald' },
            ],
          },
          {
            caption:
              'Shortest path confirmed (length 5): hit → hot → dot → dog → cog. With Bidirectional BFS, front expands from "hit" and back expands from "cog" simultaneously — meeting in the middle at Level 3 with exponentially fewer visited words!',
            formula: 'Bidirectional BFS: O(b^(d/2)) vs. Uni-BFS O(b^d)  |  Answer = 5',
            visitedNodeIds: ['hit', 'hot', 'dot', 'lot', 'dog', 'log', 'cog'],
            highlightedNodeIds: ['hit', 'hot', 'dot', 'dog', 'cog'],
            activeEdges: [
              { from: 'hit', to: 'hot' },
              { from: 'hot', to: 'dot' },
              { from: 'dot', to: 'dog' },
              { from: 'dog', to: 'cog' },
            ],
            nodeStates: {
              hit: '1: hit',
              hot: '2: hot',
              dot: '3: dot (meet)',
              lot: 'alt: lot',
              dog: '4: dog',
              log: 'alt: log',
              cog: '5: cog',
            },
            variables: [
              { name: 'shortestLen', value: '5', tone: 'emerald' },
              { name: 'path', value: 'hit→hot→dot→dog→cog', tone: 'emerald' },
            ],
          },
        ],
      },
      javaSolution: {
        filename: 'WordLadder.java',
        code: `import java.util.HashSet;
import java.util.List;
import java.util.Set;

public class WordLadder {
    public int ladderLength(String beginWord, String endWord, List<String> wordList) {
        Set<String> dict = new HashSet<>(wordList);
        if (!dict.contains(endWord)) {
            return 0; // Fast reject: target word must be in dictionary
        }

        // Bidirectional BFS frontiers starting from both ends simultaneously
        Set<String> front = new HashSet<>();
        Set<String> back = new HashSet<>();
        front.add(beginWord);
        back.add(endWord);

        dict.remove(beginWord);
        dict.remove(endWord);

        int steps = 1; // Sequence counts words, so beginWord itself is step 1

        while (!front.isEmpty() && !back.isEmpty()) {
            // Always expand the SMALLER frontier to minimize branching factor
            if (front.size() > back.size()) {
                Set<String> temp = front;
                front = back;
                back = temp;
            }

            Set<String> nextFrontier = new HashSet<>();

            for (String word : front) {
                char[] chars = word.toCharArray();
                for (int i = 0; i < chars.length; i++) {
                    char original = chars[i];
                    for (char c = 'a'; c <= 'z'; c++) {
                        if (c == original) {
                            continue;
                        }
                        chars[i] = c;
                        String candidate = new String(chars);

                        // Frontiers met in the middle — shortest path guaranteed!
                        if (back.contains(candidate)) {
                            return steps + 1;
                        }
                        if (dict.remove(candidate)) {
                            nextFrontier.add(candidate);
                        }
                    }
                    chars[i] = original; // Restore before mutating next index
                }
            }

            front = nextFrontier;
            steps++;
        }

        return 0;
    }
}`,
        callouts: [
          {
            id: 'wl-smaller-front',
            startLine: 24,
            endLine: 29,
            title: 'Always Expand the Smaller Frontier',
            explanation:
              'If branching factor is b = 10 and shortest path depth is d = 8, unidirectional BFS explores ~10⁸ states whereas meeting in the middle explores ~2 × 10⁴ states — a 5,000× speedup! Swapping front/back whenever front.size() > back.size() keeps search balanced even on asymmetric graphs.',
            accent: 'emerald',
          },
          {
            id: 'wl-dict-remove',
            startLine: 45,
            endLine: 50,
            title: 'Check back.contains() BEFORE dict.remove()',
            explanation:
              'Because endWord (and every node in back) was removed from dict upon discovery, checking back.contains(candidate) first detects frontier intersection immediately; dict.remove(candidate) then doubles as an O(1) atomic visited check.',
            accent: 'amber',
          },
          {
            id: 'wl-bucket-tradeoff',
            startLine: 34,
            endLine: 42,
            title: '26·L Char Mutation vs. Wildcard Bucket Map',
            explanation:
              'When word length L is small (≤ 10) and alphabet is 26 lowercase letters, char[] mutation avoids allocating N·L wildcard pattern strings and HashMaps. If alphabet Σ is huge (Unicode/numeric tokens), pre-building Map<String, List<String>> wildcard buckets wins cleanly.',
            accent: 'primary',
          },
        ],
      },
      complexity: {
        time: 'O(N · L² · 26) worst-case (O(b^(d/2) · L² · 26) typical)',
        space: 'O(N · L)',
        timeExplanation:
          'At most N dictionary words are expanded; each word tries 26 mutations across L positions and constructs an O(L) String (26·L² per word). Bidirectional expansion prunes the majority of the dictionary in practice.',
        spaceExplanation:
          'dict, front, back, and nextFrontier hold at most N words of length L.',
      },
      edgeCases: [
        {
          title: 'endWord Missing from wordList',
          scenario: 'beginWord = "hit", endWord = "cog", wordList = ["hot","dot","dog","lot","log"].',
          handling: 'Explicit !dict.contains(endWord) guard returns 0 before allocating frontiers — easy bug to forget when seeding back.add(endWord)!',
        },
        {
          title: 'beginWord Present Inside wordList',
          scenario: 'Could cause a length-2 self-cycle if not removed from dict.',
          handling: 'dict.remove(beginWord) before the loop ensures beginWord is never revisited.',
        },
        {
          title: 'Follow-Up: Word Ladder II (Return ALL Shortest Paths, LC #126)',
          scenario: 'Senior follow-up: "Return every shortest sequence, not just the length."',
          handling: 'Do NOT remove newly discovered words from dict until the ENTIRE current BFS level finishes (otherwise you prune valid alternate shortest paths converging on the same node, like both "dot" and "lot" reaching "cog"!). Record a parent DAG during BFS, then DFS backtrack from endWord to beginWord.',
        },
      ],
    },

    /* ================================================================
     * DSA 5: ALIEN DICTIONARY (LC #269)
     * ================================================================ */
    {
      id: 'day4-alien-dictionary',
      dayNumber: 4,
      kind: 'dsa',
      title: 'Alien Dictionary',
      subtitle: 'Extracting directed character constraints from sorted words + Kahn’s sort & prefix trap',
      difficulty: 'Hard',
      patterns: ['Graph Extraction', "Kahn's Topological Sort", 'Prefix Invalidation'],
      estimatedMinutes: 16,
      leetcodeRef: 'LC #269',
      problemStatement:
        'You are given a list of strings words sorted lexicographically according to the rules of an unknown alien alphabet. Derive a valid ordering of all unique characters present in words, or return "" if the input is contradictory (cycle or invalid prefix ordering).',
      exampleSummary: {
        input: 'words = ["wrt", "wrf", "er", "ett", "rftt"]',
        output: '"wertf"',
        explanation:
          'Adjacent word comparisons extract four constraints: t→f ("wrt"<"wrf"), w→e ("wrf"<"er"), r→t ("er"<"ett"), and e→r ("ett"<"rftt"). Topological sort yields the unique chain "wertf".',
      },
      patternRecognition: {
        interviewCue:
          'Whenever an input is ALREADY SORTED under a hidden ordering rule and you must reconstruct that rule, compare ONLY adjacent pairs (words[i], words[i+1]) at their FIRST differing index to extract directed edges — then run Topological Sort.',
        signals: [
          'Hidden lexicographical order / reconstructing a sequence from relative pairwise constraints',
          'Because lexicographical order is transitive, adjacent pairs (w[i], w[i+1]) capture 100% of ordering constraints',
          'Two distinct failure modes MUST be checked: (1) invalid prefix ("abc" before "ab") and (2) directed cycle ("a"→"b"→"a")',
        ],
        mentalModel:
          'Phase 1 (Vertices): register EVERY character appearing in ANY word with indegree = 0 so unconstrained letters are never dropped. Phase 2 (Edges): for each adjacent pair (w1, w2), find the first index where w1[k] != w2[k] and add a deduplicated edge w1[k] → w2[k] (rejecting immediately if w2 is a strict prefix of w1). Phase 3 (Kahn’s BFS): peel zero-indegree letters and verify output.length() == totalUniqueChars.',
      },
      intuitionComparison: {
        bruteForce: {
          approach:
            'Compare all O(N²) word pairs (w[i], w[j]) for i < j, or enumerate permutations of the K unique letters checking sortedness.',
          timeComplexity: 'O(N² · L) all-pairs · O(K! · N · L) permutations',
          spaceComplexity: 'O(K²)',
          bottleneck:
            'Comparing non-adjacent word pairs adds redundant transitive edges (and duplicate indegree increments if not deduplicated) without discovering any new ordering facts.',
        },
        optimal: {
          approach:
            'Register all unique characters in a graph + indegree map, scan only adjacent word pairs once to extract deduplicated directed edges (checking prefix validity), then run Kahn’s BFS.',
          timeComplexity: 'O(C) where C = total characters across all words',
          spaceComplexity: 'O(U + min(U², N)) = O(1) for fixed 26-letter alphabet',
          keyInvariant:
            'Only the FIRST mismatching character between two adjacent words carries valid ordering info; subsequent characters are unconstrained and MUST be ignored via break.',
        },
      },
      visualizer: {
        kind: 'tree-graph',
        title: 'Adjacent-Pair Edge Extraction & Kahn’s Topological Sort',
        inputSummary: 'words = ["wrt", "wrf", "er", "ett", "rftt"]  →  output = "wertf"',
        viewBoxWidth: 780,
        viewBoxHeight: 300,
        directed: true,
        nodes: [
          { id: 'w', label: 'w', x: 86, y: 145 },
          { id: 'e', label: 'e', x: 238, y: 82 },
          { id: 'r', label: 'r', x: 390, y: 188 },
          { id: 't', label: 't', x: 542, y: 82 },
          { id: 'f', label: 'f', x: 694, y: 145 },
        ],
        edges: [
          { from: 'w', to: 'e', weight: 'pair 2' },
          { from: 'e', to: 'r', weight: 'pair 4' },
          { from: 'r', to: 't', weight: 'pair 3' },
          { from: 't', to: 'f', weight: 'pair 1' },
        ],
        steps: [
          {
            caption:
              'Phase 1: Scan all words to register all 5 distinct characters {w, e, r, t, f} with initial indeg = 0. Never skip this step — characters with no ordering edges still belong in the output!',
            formula: 'Unique chars = {w, e, r, t, f} (U = 5), all indeg = 0',
            nodeStates: {
              w: 'indeg: 0',
              e: 'indeg: 0',
              r: 'indeg: 0',
              t: 'indeg: 0',
              f: 'indeg: 0',
            },
            variables: [
              { name: 'phase', value: '1. Register Nodes' },
              { name: 'uniqueChars', value: '5' },
            ],
          },
          {
            caption:
              'Phase 2 (Pair 1: "wrt" vs "wrf"): prefix "wr" matches; first diff at index 2 gives directed edge t → f (indeg[f]: 0→1) and BREAK! (Note: if a pair were "abc" vs "ab", no diff occurs while len(w1) > len(w2) → invalid prefix → immediately return ""!)',
            formula: 'Pair 1 ("wrt" < "wrf"): diff at idx 2 → add edge t → f',
            activeNodeId: 't',
            dependencyNodeIds: ['f'],
            activeEdges: [{ from: 't', to: 'f' }],
            nodeStates: {
              w: 'indeg: 0',
              e: 'indeg: 0',
              r: 'indeg: 0',
              t: 'indeg: 0',
              f: 'indeg: 1',
            },
            variables: [
              { name: 'pair', value: '"wrt" < "wrf"', tone: 'primary' },
              { name: 'newEdge', value: 't → f', tone: 'amber' },
            ],
          },
          {
            caption:
              'Finish Phase 2 across remaining adjacent pairs: Pair 2 ("wrf"<"er") adds w→e; Pair 3 ("er"<"ett") adds r→t; Pair 4 ("ett"<"rftt") adds e→r. Only "w" retains indeg = 0!',
            formula: 'Pairs 2..4 → edges w→e, r→t, e→r  |  indeg = {w:0, e:1, r:1, t:1, f:1}',
            activeNodeId: 'w',
            activeEdges: [
              { from: 'w', to: 'e' },
              { from: 'e', to: 'r' },
              { from: 'r', to: 't' },
              { from: 't', to: 'f' },
            ],
            nodeStates: {
              w: 'indeg: 0 (Q)',
              e: 'indeg: 1',
              r: 'indeg: 1',
              t: 'indeg: 1',
              f: 'indeg: 1',
            },
            variables: [
              { name: 'phase', value: "3. Kahn's BFS", tone: 'primary' },
              { name: 'queue', value: "['w']", tone: 'primary' },
            ],
          },
          {
            caption:
              'Pop "w" → append to order ("w"). Relax edge w → e: indeg[e] drops 1 → 0, unlocking "e" into the queue.',
            formula: 'pop w → order = "w", indeg[e]: 1→0 (enq e)',
            activeNodeId: 'w',
            dependencyNodeIds: ['e'],
            visitedNodeIds: ['w'],
            activeEdges: [{ from: 'w', to: 'e' }],
            nodeStates: {
              w: 'DONE (#1)',
              e: 'indeg: 0 (Q)',
              r: 'indeg: 1',
              t: 'indeg: 1',
              f: 'indeg: 1',
            },
            variables: [
              { name: 'queue', value: "['e']", tone: 'primary' },
              { name: 'order', value: '"w"', tone: 'emerald' },
            ],
          },
          {
            caption:
              'Pop "e" → order = "we". Relax edge e → r: indeg[r] drops 1 → 0, unlocking "r" into the queue.',
            formula: 'pop e → order = "we", indeg[r]: 1→0 (enq r)',
            activeNodeId: 'e',
            dependencyNodeIds: ['r'],
            visitedNodeIds: ['w', 'e'],
            activeEdges: [{ from: 'e', to: 'r' }],
            nodeStates: {
              w: 'DONE (#1)',
              e: 'DONE (#2)',
              r: 'indeg: 0 (Q)',
              t: 'indeg: 1',
              f: 'indeg: 1',
            },
            variables: [
              { name: 'queue', value: "['r']", tone: 'primary' },
              { name: 'order', value: '"we"', tone: 'emerald' },
            ],
          },
          {
            caption:
              'Pop "r" → order = "wer". Relax edge r → t: indeg[t] drops 1 → 0, unlocking "t".',
            formula: 'pop r → order = "wer", indeg[t]: 1→0 (enq t)',
            activeNodeId: 'r',
            dependencyNodeIds: ['t'],
            visitedNodeIds: ['w', 'e', 'r'],
            activeEdges: [{ from: 'r', to: 't' }],
            nodeStates: {
              w: 'DONE (#1)',
              e: 'DONE (#2)',
              r: 'DONE (#3)',
              t: 'indeg: 0 (Q)',
              f: 'indeg: 1',
            },
            variables: [
              { name: 'queue', value: "['t']", tone: 'primary' },
              { name: 'order', value: '"wer"', tone: 'emerald' },
            ],
          },
          {
            caption:
              'Pop "t" (unlocks "f"), then pop "f" → order = "wertf". Cycle check passes: order.length() == 5 == uniqueChars! Return "wertf".',
            formula: 'order.length() == 5 == U  →  Valid Alien Alphabet: "wertf"',
            visitedNodeIds: ['w', 'e', 'r', 't', 'f'],
            highlightedNodeIds: ['w', 'e', 'r', 't', 'f'],
            activeEdges: [
              { from: 'w', to: 'e' },
              { from: 'e', to: 'r' },
              { from: 'r', to: 't' },
              { from: 't', to: 'f' },
            ],
            nodeStates: {
              w: 'DONE (#1)',
              e: 'DONE (#2)',
              r: 'DONE (#3)',
              t: 'DONE (#4)',
              f: 'DONE (#5)',
            },
            variables: [
              { name: 'len == U', value: '5 == 5 ✓', tone: 'emerald' },
              { name: 'result', value: '"wertf"', tone: 'emerald' },
            ],
          },
        ],
      },
      javaSolution: {
        filename: 'AlienDictionary.java',
        code: `import java.util.ArrayDeque;
import java.util.Deque;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;

public class AlienDictionary {
    public String alienOrder(String[] words) {
        if (words == null || words.length == 0) {
            return "";
        }

        // Phase 1: Register EVERY unique character so isolated chars are preserved
        Map<Character, Set<Character>> graph = new HashMap<>();
        Map<Character, Integer> indegree = new HashMap<>();
        for (String word : words) {
            for (int i = 0; i < word.length(); i++) {
                char ch = word.charAt(i);
                graph.putIfAbsent(ch, new HashSet<>());
                indegree.putIfAbsent(ch, 0);
            }
        }

        // Phase 2: Extract directed edges from adjacent pairs at FIRST differing char
        for (int i = 0; i < words.length - 1; i++) {
            String first = words[i];
            String second = words[i + 1];

            // Critical invalid prefix trap: e.g., "abc" appearing before "ab" is impossible
            if (first.length() > second.length() && first.startsWith(second)) {
                return "";
            }

            int minLen = Math.min(first.length(), second.length());
            for (int j = 0; j < minLen; j++) {
                char u = first.charAt(j);
                char v = second.charAt(j);
                if (u != v) {
                    // Deduplicate via Set.add() so repeated pairs do NOT double-count indegree!
                    if (graph.get(u).add(v)) {
                        indegree.merge(v, 1, Integer::sum);
                    }
                    break; // Only the FIRST mismatch determines lexicographical order
                }
            }
        }

        // Phase 3: Kahn's BFS topological sort
        Deque<Character> queue = new ArrayDeque<>();
        for (Map.Entry<Character, Integer> entry : indegree.entrySet()) {
            if (entry.getValue() == 0) {
                queue.offer(entry.getKey());
            }
        }

        StringBuilder order = new StringBuilder(indegree.size());
        while (!queue.isEmpty()) {
            char curr = queue.poll();
            order.append(curr);

            for (char next : graph.get(curr)) {
                int remaining = indegree.merge(next, -1, Integer::sum);
                if (remaining == 0) {
                    queue.offer(next);
                }
            }
        }

        // Cycle check: if any character remains unprocessed, a contradiction cycle exists
        return order.length() == indegree.size() ? order.toString() : "";
    }
}`,
        callouts: [
          {
            id: 'ad-prefix-trap',
            startLine: 30,
            endLine: 33,
            title: 'The #1 Interview Failure: Invalid Prefix Trap ("abc" before "ab")',
            explanation:
              'In every lexicographical ordering, a shorter prefix MUST precede any longer word starting with it. Checking first.length() > second.length() && first.startsWith(second) catches this contradiction before BFS ever runs.',
            accent: 'rose',
          },
          {
            id: 'ad-dedup-edge',
            startLine: 40,
            endLine: 44,
            title: 'Edge Deduplication + Mandatory break',
            explanation:
              'Adjacent pairs like ("za","zb") and ("ca","cb") both imply a → b. Using Set.add(v) guarantees indegree[b] increments ONCE, and breaking immediately prevents extracting bogus constraints from characters after the first difference.',
            accent: 'amber',
          },
          {
            id: 'ad-cycle-check',
            startLine: 70,
            endLine: 71,
            title: 'Complete Coverage Confirms Acyclicity',
            explanation:
              'If words = ["z", "x", "z"], edges z→x and x→z form a cycle where neither character reaches indegree 0. Checking order.length() == indegree.size() detects every cycle cleanly.',
            accent: 'emerald',
          },
        ],
      },
      complexity: {
        time: 'O(C)',
        space: 'O(1) for lowercase ASCII (O(U + min(U², N)) general)',
        timeExplanation:
          'C is the total number of characters across all words. Registering vertices scans each char once, comparing adjacent pairs scans each word at most twice, and Kahn’s BFS takes O(U + E) where U ≤ 26 and E ≤ min(U², N - 1) ≤ C.',
        spaceExplanation:
          'With at most U = 26 lowercase letters, the graph has at most 26 nodes and 26² = 676 directed edges — O(1) auxiliary space beyond input.',
      },
      edgeCases: [
        {
          title: 'Invalid Prefix Contradiction (["abc", "ab"])',
          scenario: '"abc" precedes its own strict prefix "ab", violating dictionary rules regardless of character order.',
          handling: 'Caught immediately by first.length() > second.length() && first.startsWith(second) → returns "".',
        },
        {
          title: 'Duplicate Adjacent Words (["wrt", "wrt"])',
          scenario: 'Identical adjacent words are legal and contribute zero ordering edges.',
          handling: 'first.length() > second.length() is false, the mismatch loop finds no difference, and BFS still outputs all unique characters in "wrt".',
        },
        {
          title: 'Single Word or Unconstrained Characters (["z", "x", "a", "zb", "zx"])',
          scenario: 'Some characters appear only at positions that never determine a mismatch (e.g., single word ["abc"]).',
          handling: 'Phase 1 registers every character with indegree 0 upfront, ensuring unconstrained characters are included in a valid topological output.',
        },
      ],
    },
  ],

  /* ================================================================
   * DAY 4 LLD: TICKET BOOKING SYSTEM (BOOKMYSHOW)
   * ================================================================ */
  lldLesson: {
    id: 'day4-ticket-booking-bookmyshow',
    dayNumber: 4,
    kind: 'lld',
    title: 'Ticket Booking System (BookMyShow)',
    subtitle: 'TTL seat locking, deadlock-free multi-seat reservation, optimistic version guards, and payment idempotency',
    patterns: ['State Machine', 'Provider / Strategy Pattern', 'Optimistic vs. Pessimistic Locking', 'Idempotency Key'],
    estimatedMinutes: 25,
    problemScope: {
      summary:
        'Design an object-oriented, high-concurrency movie/event ticket booking engine (BookMyShow / Ticketmaster) supporting theatre/screen/show catalog browsing, temporary TTL seat holds during checkout, atomic multi-seat reservations without double-booking or deadlocks, idempotent payment capture, and automatic expired-lock reclamation.',
      functionalRequirements: [
        'Model Movies/Events, Venues, Screens, Shows, and per-show ShowSeats with distinct pricing tiers (Silver, Gold, Platinum).',
        'Allow a user to temporarily LOCK multiple seats for a bounded TTL window (e.g., 5 minutes) while completing payment, immediately reflecting them as unavailable to other shoppers.',
        'Transition seats strictly through AVAILABLE → LOCKED → BOOKED on payment confirmation, or revert LOCKED → AVAILABLE on payment failure, cancellation, or TTL expiry.',
        'Guarantee idempotent payment confirmation so retried checkout clicks or duplicate payment-gateway webhooks never double-charge or corrupt seat ownership.',
      ],
      concurrencyAndScaleAssumptions: [
        'Flash-sale hotspot: 10,000 concurrent users hammering the exact same Friday-night premiere Show (500 seats) within seconds — two users must NEVER both book seat A1.',
        'Multi-seat deadlock hazard: User 1 requests [A1, A2] while User 2 requests [A2, A1] concurrently; lock acquisition must guarantee zero deadlocks.',
        'Single-JVM fine-grained lock striping in LLD, architected behind clean SeatLockProvider and BookingRepository abstractions so distributed Redis Lua/Redlock or PostgreSQL SELECT FOR UPDATE drops in without changing domain logic.',
      ],
      explicitNonGoals: [
        'Full search/recommendation engine, theatre partner onboarding CMS, or front-end seat-map rendering.',
        'Actual PCI-DSS credit-card tokenization or bank settlement networks (modeled behind an asynchronous/idempotent PaymentGateway interface).',
      ],
    },
    coreEntities: [
      {
        name: 'ShowSeat',
        role: 'Per-show inventory unit pairing a physical Seat with mutable booking status and an optimistic concurrency version counter.',
        keyFields: ['showId: String', 'seatId: String', 'category: SeatCategory', 'status: SeatStatus', 'version: long'],
        invariants: 'Transitions strictly follow AVAILABLE → LOCKED → BOOKED (or LOCKED → AVAILABLE on release). Every state mutation increments version.',
      },
      {
        name: 'SeatLock & SeatLockProvider',
        role: 'Value record capturing (showId, seatId, lockedByUserId, lockedAt, expiresAt) managed by a thread-safe TTL lock provider with lazy expiry and background sweeping.',
        keyFields: ['locks: ConcurrentHashMap<SeatKey, SeatLock>', 'seatLocks: ConcurrentHashMap<SeatKey, ReentrantLock>', 'lockTtl: Duration'],
        invariants: 'At most one non-expired SeatLock exists per (showId, seatId). Acquiring locks for multiple seats always sorts keys canonically first.',
      },
      {
        name: 'Booking',
        role: 'Aggregate root representing a customer’s multi-seat reservation lifecycle (CREATED → CONFIRMED | EXPIRED | CANCELLED).',
        keyFields: ['bookingId: String', 'showId: String', 'userId: String', 'seatIds: List<String>', 'expectedVersions: Map<String, Long>', 'status: BookingStatus', 'totalAmount: BigDecimal'],
        invariants: 'Once CONFIRMED, a booking cannot be expired; once EXPIRED or CANCELLED, it can never transition to CONFIRMED.',
      },
      {
        name: 'IdempotentPaymentProcessor',
        role: 'Wraps external PaymentGateway calls with an idempotency registry mapping idempotencyKey → PaymentReceipt.',
        keyFields: ['gateway: PaymentGateway', 'receiptsByKey: ConcurrentHashMap<String, PaymentReceipt>'],
        invariants: 'Repeated invocations with the same idempotencyKey execute the external gateway charge AT MOST ONCE and replay the cached receipt.',
      },
      {
        name: 'BookingService',
        role: 'Facade coordinating TTL seat lock acquisition, BigDecimal pricing, lock validation prior to payment, optimistic CAS commit, and failure rollback.',
        keyFields: ['lockProvider: SeatLockProvider', 'pricingStrategy: SeatPricingStrategy', 'paymentProcessor: IdempotentPaymentProcessor', 'clock: Clock'],
        invariants: 'Never commits BOOKED seats unless all SeatLocks remain valid for userId AND every ShowSeat version matches its expected checkout snapshot.',
      },
    ],
    designPatterns: [
      {
        pattern: 'Provider / Strategy Pattern (SeatLockProvider & SeatPricingStrategy)',
        whereUsed: 'Decoupling how seat TTL holds are enforced (in-memory striped locks vs. distributed Redis SET NX PX) and how seat prices are computed (Tiered vs. Dynamic Demand Surge).',
        whatBreaksWithoutIt:
          'BookingService directly embeds ConcurrentHashMap lock hacks and hardcoded tier prices. Migrating from a single JVM to a multi-pod Kubernetes cluster forces rewriting the entire checkout workflow.',
        howItSolvesIt:
          'Isolates locking behind SeatLockProvider (lockSeats, validateLocks, releaseLocks) and billing behind SeatPricingStrategy, enabling drop-in distributed Redis/DB lock providers and promotional pricing rules without touching BookingService.',
      },
      {
        pattern: 'Guarded State Machine (SeatStatus & BookingStatus)',
        whereUsed: 'Enforcing legal lifecycle transitions on ShowSeat (AVAILABLE ↔ LOCKED → BOOKED) and Booking (CREATED → CONFIRMED | EXPIRED | CANCELLED).',
        whatBreaksWithoutIt:
          'A slow payment webhook arriving 10 seconds AFTER TTL expiry blindly flips seats to BOOKED — overwriting User B’s freshly acquired hold on the exact same seat!',
        howItSolvesIt:
          'Both ShowSeat.confirmBooking(expectedVersion) and Booking.confirm() reject invalid source states atomically, triggering an automatic refund instead of double-booking.',
      },
      {
        pattern: 'Canonical Lock Ordering + Payment Idempotency Barrier',
        whereUsed: 'Acquiring multi-seat locks in lexicographical order and deduplicating payment retries via client-supplied idempotencyKey.',
        whatBreaksWithoutIt:
          'User 1 locking [A1, A2] and User 2 locking [A2, A1] deadlock permanently under load; mobile users double-tapping "Pay" on flaky 4G get charged twice.',
        howItSolvesIt:
          'Sorting SeatKeys before locking makes circular wait mathematically impossible; ConcurrentHashMap.computeIfAbsent on idempotencyKey ensures exactly-once external payment execution.',
      },
    ],
    diagrams: {
      classDiagram: {
        title: 'Ticket Booking System — UML Class Diagram',
        caption: 'Separation of BookingService orchestration, striped TTL SeatLockProvider, optimistic-versioned ShowSeat, and IdempotentPaymentProcessor',
        mermaid: `classDiagram
    class BookingService {
        -SeatLockProvider lockProvider
        -SeatPricingStrategy pricer
        -IdempotentPaymentProcessor payments
        -Map~String,Booking~ bookings
        +initiateBooking(showId, seats, userId) Booking
        +confirmBooking(bookingId, userId, idemKey) Booking
    }

    class SeatLockProvider {
        <<interface>>
        +lockSeats(showId, seats, userId) boolean
        +validateLocks(showId, seats, userId) boolean
        +releaseLocks(showId, seats, userId) void
    }

    class InMemorySeatLockProvider {
        -Map~SeatKey,SeatLock~ activeLocks
        -Map~SeatKey,ReentrantLock~ mutexes
        -ScheduledExecutorService sweeper
        +lockSeats(showId, seats, userId) boolean
        +sweepExpiredLocks() void
    }

    class ShowSeat {
        -String showId
        -String seatId
        -SeatCategory category
        -SeatStatus status
        -long version
        +markLocked(expectedVer) long
        +markBooked(expectedVer) void
        +releaseToAvailable() void
    }

    class Booking {
        -String bookingId
        -String userId
        -List~String~ seatIds
        -BookingStatus status
        -BigDecimal totalAmount
        +confirm(receiptId) void
        +expire() void
    }

    class SeatPricingStrategy {
        <<interface>>
        +calculateTotal(seats) BigDecimal
    }

    class IdempotentPaymentProcessor {
        -PaymentGateway gateway
        -Map~String,PaymentReceipt~ receipts
        +chargeOnce(idemKey, amount) PaymentReceipt
    }

    BookingService --> SeatLockProvider : "acquires TTL holds"
    BookingService --> SeatPricingStrategy : "prices seats"
    BookingService --> IdempotentPaymentProcessor : "charges once"
    BookingService "1" --> "*" Booking : "tracks lifecycle"
    SeatLockProvider <|.. InMemorySeatLockProvider : "implements"
    Booking "1" --> "*" ShowSeat : "reserves"`,
      },
      sequenceDiagram: {
        title: 'Concurrent Multi-Seat Hold, TTL Validation & Idempotent Payment Flow',
        caption: 'Canonical lock sorting prevents AB-BA deadlocks; lock TTL re-validation + optimistic version check protect against late payment races',
        mermaid: `sequenceDiagram
    participant User as "User A Client"
    participant Svc as "BookingService"
    participant Locks as "SeatLockProvider"
    participant Seat as "ShowSeat (v=1)"
    participant Pay as "IdempotentPaymentProcessor"

    User->>Svc: "initiateBooking(show1, [A2, A1], userA)"
    Svc->>Locks: "lockSeats(show1, sorted [A1, A2], userA)"
    Locks->>Locks: "Acquire mutex(A1) then mutex(A2) + check lazy TTL"
    alt "All seats unlocked & AVAILABLE"
        Locks-->>Svc: "Locks granted (expires in 5m)"
        Svc->>Seat: "markLocked(expectedVer=1) -> status=LOCKED, v=2"
        Svc-->>User: "Booking(CREATED, total=40 USD)"
    else "Any seat already locked or BOOKED"
        Locks->>Locks: "Rollback acquired mutexes atomically"
        Locks-->>Svc: "false (SeatUnavailableException)"
        Svc-->>User: "409 Conflict - Seat taken"
    end

    User->>Svc: "confirmBooking(bookingId, userA, idemKey=k9)"
    Svc->>Locks: "validateLocks(show1, [A1, A2], userA)"
    alt "TTL still valid & owned by userA"
        Svc->>Pay: "chargeOnce(idemKey=k9, 40 USD)"
        Pay-->>Svc: "PaymentReceipt(SUCCESS)"
        Svc->>Seat: "markBooked(expectedVer=2) -> status=BOOKED, v=3"
        Svc->>Locks: "releaseLocks(show1, [A1, A2], userA)"
        Svc-->>User: "Booking(CONFIRMED)"
    else "TTL expired before payment"
        Svc-->>User: "410 Gone - Hold expired, re-select seats"
    end`,
      },
    },
    codeFiles: [
      {
        filename: 'BookingDomainModels.java',
        label: 'BookingDomainModels.java',
        summary: 'Seat & Booking state machines, optimistic-versioned ShowSeat entity, and immutable SeatKey / SeatLock records.',
        code: `import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;
import java.util.Map;
import java.util.Objects;

public enum SeatCategory { SILVER, GOLD, PLATINUM }

public enum SeatStatus { AVAILABLE, LOCKED, BOOKED }

public enum BookingStatus { CREATED, CONFIRMED, EXPIRED, CANCELLED }

public record SeatKey(String showId, String seatId) implements Comparable<SeatKey> {
    public SeatKey {
        Objects.requireNonNull(showId, "showId required");
        Objects.requireNonNull(seatId, "seatId required");
    }

    @Override
    public int compareTo(SeatKey other) {
        int cmp = this.showId.compareTo(other.showId);
        return cmp != 0 ? cmp : this.seatId.compareTo(other.seatId);
    }
}

public record SeatLock(SeatKey key, String userId, Instant lockedAt, Instant expiresAt) {
    public boolean isExpired(Instant now) {
        return !now.isBefore(expiresAt);
    }

    public boolean isOwnedBy(String candidateUserId, Instant now) {
        return !isExpired(now) && userId.equals(candidateUserId);
    }
}

public class ShowSeat {
    private final SeatKey key;
    private final SeatCategory category;
    private SeatStatus status = SeatStatus.AVAILABLE;
    private long version = 0L; // Optimistic concurrency token incremented on every transition

    public ShowSeat(String showId, String seatId, SeatCategory category) {
        this.key = new SeatKey(showId, seatId);
        this.category = Objects.requireNonNull(category);
    }

    public synchronized long markLocked(long expectedVersion) {
        verifyVersion(expectedVersion);
        if (status != SeatStatus.AVAILABLE) {
            throw new IllegalStateException("Seat " + key.seatId() + " is not AVAILABLE: " + status);
        }
        status = SeatStatus.LOCKED;
        return ++version;
    }

    public synchronized void markBooked(long expectedVersion) {
        verifyVersion(expectedVersion);
        if (status != SeatStatus.LOCKED) {
            throw new IllegalStateException("Seat " + key.seatId() + " must be LOCKED before booking");
        }
        status = SeatStatus.BOOKED;
        version++;
    }

    public synchronized void releaseIfLocked() {
        if (status == SeatStatus.LOCKED) {
            status = SeatStatus.AVAILABLE;
            version++;
        }
    }

    private void verifyVersion(long expectedVersion) {
        if (this.version != expectedVersion) {
            throw new IllegalStateException(
                "Optimistic lock conflict on seat " + key.seatId()
                    + ": expected v" + expectedVersion + " but found v" + this.version
            );
        }
    }

    public SeatKey getKey() { return key; }
    public SeatCategory getCategory() { return category; }
    public synchronized SeatStatus getStatus() { return status; }
    public synchronized long getVersion() { return version; }
}

public class Booking {
    private final String bookingId;
    private final String showId;
    private final String userId;
    private final List<String> seatIds;
    private final Map<String, Long> lockedSeatVersions;
    private final BigDecimal totalAmount;
    private BookingStatus status = BookingStatus.CREATED;
    private String paymentReceiptId;

    public Booking(
            String bookingId,
            String showId,
            String userId,
            List<String> seatIds,
            Map<String, Long> lockedSeatVersions,
            BigDecimal totalAmount) {
        this.bookingId = bookingId;
        this.showId = showId;
        this.userId = userId;
        this.seatIds = List.copyOf(seatIds);
        this.lockedSeatVersions = Map.copyOf(lockedSeatVersions);
        this.totalAmount = totalAmount;
    }

    public synchronized void confirm(String receiptId) {
        if (status != BookingStatus.CREATED) {
            throw new IllegalStateException("Cannot confirm booking in state: " + status);
        }
        this.paymentReceiptId = Objects.requireNonNull(receiptId);
        this.status = BookingStatus.CONFIRMED;
    }

    public synchronized void expire() {
        if (status == BookingStatus.CREATED) {
            this.status = BookingStatus.EXPIRED;
        }
    }

    public String getBookingId() { return bookingId; }
    public String getShowId() { return showId; }
    public String getUserId() { return userId; }
    public List<String> getSeatIds() { return seatIds; }
    public Map<String, Long> getLockedSeatVersions() { return lockedSeatVersions; }
    public BigDecimal getTotalAmount() { return totalAmount; }
    public synchronized BookingStatus getStatus() { return status; }
    public synchronized String getPaymentReceiptId() { return paymentReceiptId; }
}`,
        callouts: [
          {
            id: 'bms-seatkey-order',
            startLine: 13,
            endLine: 24,
            title: 'Comparable SeatKey Enables Deadlock-Free Lock Ordering',
            explanation:
              'Implementing Comparable<SeatKey> lets the lock provider sort every multi-seat request canonically before acquiring ReentrantLocks, eliminating AB-BA circular deadlocks structurally.',
            accent: 'primary',
          },
          {
            id: 'bms-opt-version',
            startLine: 47,
            endLine: 63,
            title: 'Optimistic Version Guard (Defense-in-Depth)',
            explanation:
              'Even if a TTL sweeper expires and releases a seat while a slow payment thread is mid-flight, the version bump (v=2 → v=3) causes markBooked(expectedVersion=2) to fail fast instead of overwriting another customer’s hold!',
            accent: 'amber',
          },
          {
            id: 'bms-booking-fsm',
            startLine: 112,
            endLine: 124,
            title: 'Strict Booking State Machine Guard',
            explanation:
              'Confirming a booking is legal ONLY from CREATED. Once expired by the background sweeper, late payment callbacks cannot silently resurrect the booking.',
            accent: 'emerald',
          },
        ],
      },
      {
        filename: 'InMemorySeatLockProvider.java',
        label: 'InMemorySeatLockProvider.java',
        summary: 'Fine-grained per-seat striped ReentrantLocks, canonical key sorting, lazy TTL eviction, and background sweeper.',
        code: `import java.time.Clock;
import java.time.Duration;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.locks.ReentrantLock;
import java.util.function.Consumer;

public interface SeatLockProvider {
    boolean lockSeats(String showId, List<String> seatIds, String userId);
    boolean validateLocks(String showId, List<String> seatIds, String userId);
    void releaseLocks(String showId, List<String> seatIds, String userId);
}

public class InMemorySeatLockProvider implements SeatLockProvider, AutoCloseable {
    private final Map<SeatKey, SeatLock> activeLocks = new ConcurrentHashMap<>();
    private final Map<SeatKey, ReentrantLock> seatMutexes = new ConcurrentHashMap<>();
    private final Duration lockTtl;
    private final Clock clock;
    private final Consumer<SeatKey> onLockExpired;
    private final ScheduledExecutorService sweeper;

    public InMemorySeatLockProvider(Duration lockTtl, Clock clock, Consumer<SeatKey> onLockExpired) {
        this.lockTtl = lockTtl;
        this.clock = clock;
        this.onLockExpired = onLockExpired;
        this.sweeper = Executors.newSingleThreadScheduledExecutor(r -> {
            Thread t = new Thread(r, "seat-lock-sweeper");
            t.setDaemon(true);
            return t;
        });
        this.sweeper.scheduleAtFixedRate(this::sweepExpiredLocks, 5, 5, TimeUnit.SECONDS);
    }

    @Override
    public boolean lockSeats(String showId, List<String> seatIds, String userId) {
        // Canonical sort prevents AB-BA deadlocks when two users request [A1,A2] vs [A2,A1]
        List<SeatKey> sortedKeys = seatIds.stream()
            .distinct()
            .map(seatId -> new SeatKey(showId, seatId))
            .sorted()
            .toList();

        List<ReentrantLock> acquired = new ArrayList<>(sortedKeys.size());
        try {
            for (SeatKey key : sortedKeys) {
                ReentrantLock mutex = seatMutexes.computeIfAbsent(key, k -> new ReentrantLock());
                mutex.lock();
                acquired.add(mutex);
            }

            Instant now = clock.instant();
            // Phase 1: Verify EVERY requested seat is free (or lazily expired) before mutating any
            for (SeatKey key : sortedKeys) {
                SeatLock existing = activeLocks.get(key);
                if (existing != null && !existing.isExpired(now) && !existing.userId().equals(userId)) {
                    return false; // All-or-nothing rejection: zero partial seat holds
                }
            }

            // Phase 2: Commit TTL holds atomically across the entire seat group
            Instant expiresAt = now.plus(lockTtl);
            for (SeatKey key : sortedKeys) {
                activeLocks.put(key, new SeatLock(key, userId, now, expiresAt));
            }
            return true;
        } finally {
            // Release mutexes in reverse acquisition order
            for (int i = acquired.size() - 1; i >= 0; i--) {
                acquired.get(i).unlock();
            }
        }
    }

    @Override
    public boolean validateLocks(String showId, List<String> seatIds, String userId) {
        Instant now = clock.instant();
        for (String seatId : seatIds) {
            SeatLock lock = activeLocks.get(new SeatKey(showId, seatId));
            if (lock == null || !lock.isOwnedBy(userId, now)) {
                return false;
            }
        }
        return true;
    }

    @Override
    public void releaseLocks(String showId, List<String> seatIds, String userId) {
        for (String seatId : seatIds) {
            SeatKey key = new SeatKey(showId, seatId);
            activeLocks.computeIfPresent(key, (k, lock) -> lock.userId().equals(userId) ? null : lock);
        }
    }

    public void sweepExpiredLocks() {
        Instant now = clock.instant();
        for (Map.Entry<SeatKey, SeatLock> entry : activeLocks.entrySet()) {
            SeatKey key = entry.getKey();
            SeatLock lock = entry.getValue();
            if (!lock.isExpired(now)) {
                continue;
            }
            ReentrantLock mutex = seatMutexes.computeIfAbsent(key, k -> new ReentrantLock());
            if (!mutex.tryLock()) {
                continue; // Skip seats currently mid-checkout; next sweep tick will re-check
            }
            try {
                // Re-verify under mutex to prevent race with fresh lock acquisition
                SeatLock current = activeLocks.get(key);
                if (current != null && current.isExpired(now)) {
                    activeLocks.remove(key);
                    onLockExpired.accept(key);
                }
            } finally {
                mutex.unlock();
            }
        }
    }

    @Override
    public void close() {
        sweeper.shutdownNow();
    }
}`,
        callouts: [
          {
            id: 'bms-canonical-sort',
            startLine: 42,
            endLine: 55,
            title: 'Deadlock Elimination via Sorted Striped Mutexes',
            explanation:
              'Sorting SeatKeys guarantees every thread locks A1 before A2 regardless of the click order in the UI. Striping per SeatKey means booking [A1, A2] never blocks another customer booking [C5, C6] in the same theatre!',
            accent: 'emerald',
          },
          {
            id: 'bms-all-or-nothing',
            startLine: 57,
            endLine: 71,
            title: 'Two-Phase All-or-Nothing Group Hold + Lazy Expiry',
            explanation:
              'Phase 1 verifies ALL requested seats are free (treating any expired SeatLock as lazily reclaimed immediately, even before the 5s sweeper runs!). Only if every seat passes does Phase 2 write the new holds — preventing awkward partial bookings.',
            accent: 'primary',
          },
          {
            id: 'bms-sweeper-recheck',
            startLine: 108,
            endLine: 118,
            title: 'Non-Blocking Sweeper with Double-Checked Expiry',
            explanation:
              'The background sweeper uses tryLock() so it never stalls live checkout threads, and re-reads activeLocks.get(key) inside the mutex so it never deletes a brand-new hold acquired in the microsecond after iteration started.',
            accent: 'amber',
          },
        ],
      },
      {
        filename: 'PaymentAndPricing.java',
        label: 'PaymentAndPricing.java',
        summary: 'BigDecimal tier pricing strategy and thread-safe IdempotentPaymentProcessor guaranteeing single charge capture.',
        code: `import java.math.BigDecimal;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

public record PaymentReceipt(String receiptId, String idempotencyKey, BigDecimal amount, boolean success) {}

@FunctionalInterface
public interface SeatPricingStrategy {
    BigDecimal calculateTotal(List<ShowSeat> seats);
}

public class TieredSeatPricingStrategy implements SeatPricingStrategy {
    private final Map<SeatCategory, BigDecimal> pricesByCategory;

    public TieredSeatPricingStrategy(Map<SeatCategory, BigDecimal> pricesByCategory) {
        this.pricesByCategory = Map.copyOf(pricesByCategory);
    }

    @Override
    public BigDecimal calculateTotal(List<ShowSeat> seats) {
        return seats.stream()
            .map(seat -> pricesByCategory.getOrDefault(seat.getCategory(), BigDecimal.ZERO))
            .reduce(BigDecimal.ZERO, BigDecimal::add);
    }
}

public interface PaymentGateway {
    PaymentReceipt charge(String userId, BigDecimal amount, String idempotencyKey);
    void refund(String receiptId, String reason);
}

public class IdempotentPaymentProcessor {
    private final PaymentGateway gateway;
    private final Map<String, PaymentReceipt> receiptsByKey = new ConcurrentHashMap<>();

    public IdempotentPaymentProcessor(PaymentGateway gateway) {
        this.gateway = gateway;
    }

    public PaymentReceipt chargeOnce(String idempotencyKey, String userId, BigDecimal amount) {
        if (idempotencyKey == null || idempotencyKey.isBlank()) {
            throw new IllegalArgumentException("idempotencyKey is mandatory for payment safety");
        }
        // ConcurrentHashMap.computeIfAbsent executes atomically per key — blocks duplicate charges!
        return receiptsByKey.computeIfAbsent(
            idempotencyKey,
            key -> gateway.charge(userId, amount, key)
        );
    }

    public void refund(String receiptId, String reason) {
        gateway.refund(receiptId, reason);
    }

    public static String newReceiptId() {
        return "RCPT-" + UUID.randomUUID();
    }
}`,
        callouts: [
          {
            id: 'bms-idem-atomic',
            startLine: 46,
            endLine: 50,
            title: 'Exactly-Once Capture via Idempotency Key',
            explanation:
              'If a mobile client retries confirmBooking() after a network timeout, ConcurrentHashMap.computeIfAbsent returns the original PaymentReceipt without invoking gateway.charge() a second time. In production, back this with a UNIQUE(idempotency_key) row in Postgres.',
            accent: 'emerald',
          },
          {
            id: 'bms-refund-hook',
            startLine: 53,
            endLine: 55,
            title: 'Compensating Refund Path for TTL-Race Edge Case',
            explanation:
              'If an external gateway captures funds right as the seat lock expires (network lag > 5m), BookingService invokes refund() cleanly instead of double-booking or silently eating the user’s money.',
            accent: 'amber',
          },
        ],
      },
      {
        filename: 'BookingService.java',
        label: 'BookingService.java',
        summary: 'End-to-end checkout orchestration: acquire TTL holds, lock ShowSeats, validate TTL before charge, and commit with optimistic version CAS.',
        code: `import java.math.BigDecimal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

public class BookingService {
    private final Map<SeatKey, ShowSeat> seatInventory;
    private final Map<String, Booking> bookings = new ConcurrentHashMap<>();
    private final SeatLockProvider lockProvider;
    private final SeatPricingStrategy pricingStrategy;
    private final IdempotentPaymentProcessor paymentProcessor;

    public BookingService(
            Map<SeatKey, ShowSeat> seatInventory,
            SeatLockProvider lockProvider,
            SeatPricingStrategy pricingStrategy,
            IdempotentPaymentProcessor paymentProcessor) {
        this.seatInventory = seatInventory;
        this.lockProvider = lockProvider;
        this.pricingStrategy = pricingStrategy;
        this.paymentProcessor = paymentProcessor;
    }

    public Booking initiateBooking(String showId, List<String> seatIds, String userId) {
        if (seatIds == null || seatIds.isEmpty()) {
            throw new IllegalArgumentException("At least one seat must be selected");
        }

        // Step 1: Acquire all-or-nothing TTL holds (sorted internally to prevent deadlocks)
        if (!lockProvider.lockSeats(showId, seatIds, userId)) {
            throw new IllegalStateException("One or more requested seats are currently held");
        }

        List<ShowSeat> targetSeats = seatIds.stream()
            .distinct()
            .map(seatId -> requireSeat(showId, seatId))
            .toList();

        Map<String, Long> lockedVersions = new HashMap<>();
        try {
            // Step 2: Transition each ShowSeat AVAILABLE -> LOCKED and capture new version tokens
            for (ShowSeat seat : targetSeats) {
                long newVersion = seat.markLocked(seat.getVersion());
                lockedVersions.put(seat.getKey().seatId(), newVersion);
            }

            BigDecimal total = pricingStrategy.calculateTotal(targetSeats);
            String bookingId = "BKG-" + UUID.randomUUID();
            Booking booking = new Booking(bookingId, showId, userId, seatIds, lockedVersions, total);
            bookings.put(bookingId, booking);
            return booking;
        } catch (RuntimeException ex) {
            // Rollback any partially locked seats and release TTL holds cleanly
            targetSeats.forEach(ShowSeat::releaseIfLocked);
            lockProvider.releaseLocks(showId, seatIds, userId);
            throw ex;
        }
    }

    public Booking confirmBooking(String bookingId, String userId, String idempotencyKey) {
        Booking booking = bookings.get(bookingId);
        if (booking == null || !booking.getUserId().equals(userId)) {
            throw new IllegalArgumentException("Booking not found for user: " + bookingId);
        }
        if (booking.getStatus() == BookingStatus.CONFIRMED) {
            return booking; // Idempotent replay on duplicate confirmation request
        }

        // Step 1: Fast-fail BEFORE charging card if the 5-minute TTL hold already expired
        if (!lockProvider.validateLocks(booking.getShowId(), booking.getSeatIds(), userId)) {
            booking.expire();
            throw new IllegalStateException("Seat hold expired; please re-select seats");
        }

        // Step 2: Execute idempotent payment capture
        PaymentReceipt receipt = paymentProcessor.chargeOnce(
            idempotencyKey, userId, booking.getTotalAmount()
        );
        if (!receipt.success()) {
            releaseSeatsAndExpire(booking);
            throw new IllegalStateException("Payment declined; seats released");
        }

        // Step 3: Commit BOOKED with optimistic version guard — refund if TTL lapsed during payment
        try {
            if (!lockProvider.validateLocks(booking.getShowId(), booking.getSeatIds(), userId)) {
                throw new IllegalStateException("Hold lapsed during payment gateway call");
            }
            for (String seatId : booking.getSeatIds()) {
                ShowSeat seat = requireSeat(booking.getShowId(), seatId);
                long expectedVersion = booking.getLockedSeatVersions().get(seatId);
                seat.markBooked(expectedVersion);
            }
            booking.confirm(receipt.receiptId());
            lockProvider.releaseLocks(booking.getShowId(), booking.getSeatIds(), userId);
            return booking;
        } catch (RuntimeException ex) {
            paymentProcessor.refund(receipt.receiptId(), "Seat lock expired before commit");
            booking.expire();
            throw ex;
        }
    }

    private void releaseSeatsAndExpire(Booking booking) {
        for (String seatId : booking.getSeatIds()) {
            requireSeat(booking.getShowId(), seatId).releaseIfLocked();
        }
        lockProvider.releaseLocks(booking.getShowId(), booking.getSeatIds(), booking.getUserId());
        booking.expire();
    }

    private ShowSeat requireSeat(String showId, String seatId) {
        ShowSeat seat = seatInventory.get(new SeatKey(showId, seatId));
        if (seat == null) {
            throw new IllegalArgumentException("Unknown seat: " + seatId);
        }
        return seat;
    }
}`,
        callouts: [
          {
            id: 'bms-rollback',
            startLine: 54,
            endLine: 59,
            title: 'Atomic Rollback on Partial Seat Failure',
            explanation:
              'If seat A1 succeeded in markLocked() but seat A2 was already BOOKED, the catch block restores A1 back to AVAILABLE and drops all TTL holds so zero phantom locks leak.',
            accent: 'amber',
          },
          {
            id: 'bms-double-validate',
            startLine: 71,
            endLine: 95,
            title: 'Double TTL Check + Optimistic CAS Handles Slow Payment Gateways',
            explanation:
              'Checking validateLocks() BEFORE payment avoids charging expired holds; re-checking AFTER payment AND asserting expectedVersion catches the rare race where payment takes 30s and TTL expires mid-call — issuing an automatic compensating refund.',
            accent: 'emerald',
          },
          {
            id: 'bms-idem-confirm',
            startLine: 67,
            endLine: 69,
            title: 'Idempotent Booking Confirmation Replay',
            explanation:
              'If the user’s browser loses Wi-Fi right after commit and retries confirmBooking() with the same bookingId + idempotencyKey, returning the already-CONFIRMED booking guarantees clean UX and zero double-charges.',
            accent: 'primary',
          },
        ],
      },
    ],
    solidHighlights: [
      {
        principle: 'Single Responsibility',
        application:
          'InMemorySeatLockProvider owns TTL hold concurrency and sweeping, ShowSeat owns seat state-machine invariants, IdempotentPaymentProcessor owns exactly-once billing, and BookingService orchestrates the checkout saga.',
      },
      {
        principle: 'Open/Closed',
        application:
          'Adding SurgePricingStrategy, CouponDiscountDecorator, or a RedisSeatLockProvider requires zero changes to BookingService or ShowSeat.',
      },
      {
        principle: 'Interface Segregation',
        application:
          'SeatLockProvider exposes only lockSeats/validateLocks/releaseLocks; SeatPricingStrategy exposes a single functional method calculateTotal() without dragging in payment or catalogue dependencies.',
      },
      {
        principle: 'Dependency Inversion',
        application:
          'BookingService depends strictly on SeatLockProvider, SeatPricingStrategy, and PaymentGateway abstractions — enabling deterministic Clock.fixed() unit tests simulating exact 5-minute TTL expirations.',
      },
    ],
    extensibilityScenarios: [
      {
        scenario: 'Scale Across Multiple Stateless App Nodes (Distributed BookMyShow)',
        changesRequired:
          'Swap InMemorySeatLockProvider for a RedisSeatLockProvider executing an atomic Lua script (MSETNX / SET key userId PX 300000 across all sorted seats), backed by PostgreSQL rows with an @Version column (UPDATE show_seats SET status = BOOKED, version = version + 1 WHERE id = ? AND version = ?).',
      },
      {
        scenario: 'Waitlist & Instant Notification When Expired Holds Drop',
        changesRequired:
          'Attach an Observer / Kafka event publisher inside the onLockExpired callback so the moment a 5-minute checkout hold expires, waitlisted users receive a push alert within seconds.',
      },
      {
        scenario: 'Prevent Orphan Single-Seat Gaps ("No Single Empty Seat Rule")',
        changesRequired:
          'Inject a SeatSelectionValidator strategy invoked in initiateBooking() that checks adjacent row neighbors before acquiring locks — cleanly decoupled from concurrency code.',
      },
    ],
    concurrencyChoices: [
      {
        topic: 'Optimistic Locking (version) vs. Fine-Grained Pessimistic Locks',
        mechanism: 'Hybrid: Per-seat pessimistic mutexes during short lock acquisition (<1ms) + TTL lease + Optimistic @Version check on final BOOKED commit',
        rationale:
          'Never hold a database or JVM pessimistic lock across a 5-minute user checkout or external payment call (it exhausts connection pools!). Instead, acquire a brief striped lock to record a 5-minute TTL lease, release the mutex immediately, and guard the final commit with an optimistic version CAS.',
      },
      {
        topic: 'Multi-Seat Deadlock Prevention',
        mechanism: 'Canonical lexicographical ordering of SeatKey(showId, seatId) prior to acquiring striped ReentrantLocks',
        rationale:
          'Imposing a strict global total order on lock acquisition makes circular wait (Coffman’s 4th deadlock condition) mathematically impossible even under 10,000 concurrent flash-sale threads.',
      },
      {
        topic: 'Late Payment Callback Arriving After Lock TTL Expiry',
        mechanism: 'Pre-charge TTL validation + post-charge TTL/version re-verification + compensating automatic refund',
        rationale:
          'Because payment gateways are external I/O outside our local transaction boundary, a slow 3DS bank verification can finish seconds after TTL expiry. Re-checking expectedVersion prevents double-booking and triggers an automatic refund (or optional grace-buffer where sweeper waits TTL + 30s before releasing).',
      },
    ],
  },

  /* ================================================================
   * DAY 4 HLD: CHAT APPLICATION / WHATSAPP
   * ================================================================ */
  hldLesson: {
    id: 'day4-chat-whatsapp',
    dayNumber: 4,
    kind: 'hld',
    title: 'Real-Time Chat Application (WhatsApp)',
    subtitle: 'Persistent WebSocket gateways, Redis session routing, time-bucketed Cassandra history, presence heartbeats, and delivery receipts',
    tags: ['WebSockets', 'Presence & Heartbeats', 'Cassandra Time-Buckets', 'Offline Push & Sync'],
    estimatedMinutes: 25,
    overview:
      'Design a globally available 1:1 and group messaging platform serving 500M DAU, 100M concurrent online WebSocket connections, and 20B messages/day with sub-100ms end-to-end delivery latency, reliable offline catch-up sync, ordered conversations, online/last-seen presence, and Sent/Delivered/Read receipts.',
    requirements: {
      functional: [
        'Low-latency bidirectional 1:1 chat and group chat (up to 1,024 members) with strict per-conversation message ordering.',
        'Delivery receipts tracking three states: SENT (✓ server persisted), DELIVERED (✓✓ recipient device received), and READ (blue ✓✓ recipient viewed).',
        'Online / Last-Seen presence indicator with low heartbeat overhead and privacy controls.',
        'Offline message durability, push notifications (APNs / FCM), seamless reconnect inbox sync, and encrypted media attachments (images/video/voice).',
      ],
      nonFunctional: [
        {
          metric: 'Online Delivery Latency (p99)',
          target: '< 100 ms (same region)',
          rationale: 'Real-time chat feels conversational only when persistent sockets eliminate TCP/TLS handshakes and HTTP polling lag.',
        },
        {
          metric: 'Message Durability & Ordering',
          target: 'Zero lost persisted messages; monotonic per-chat order',
          rationale: 'Once the sender sees the single check mark (✓), the message MUST survive server crashes and appear in consistent causal order on all devices.',
        },
        {
          metric: 'Concurrent Connections',
          target: '100M simultaneous persistent WebSockets',
          rationale: 'Requires stateful epoll-tuned Gateway fleets and a fast in-memory Session Registry mapping userId → gatewayNodeId.',
        },
        {
          metric: 'Availability vs. Consistency',
          target: '99.99% Availability (AP with per-conversation causal order)',
          rationale: 'Clients cache messages locally in SQLite and reconcile with server sequence numbers upon reconnect — mobile networks drop constantly.',
        },
      ],
    },
    capacityMath: {
      assumptions: [
        '500M Daily Active Users (DAU); 100M peak concurrent online WebSocket sessions',
        'Average user sends 40 messages/day → 20B messages/day (peak multiplier = 3×)',
        'Average text/metadata envelope ≈ 200 bytes (images/video stored out-of-band in S3 + CDN)',
        'Each tuned Linux WebSocket Gateway node sustains 250K persistent TCP sockets (~4 KB socket/state overhead ≈ 1 GB connection memory)',
      ],
      calculations: [
        {
          metric: 'Message Write QPS (Avg / Peak)',
          formula: '20B / 86,400 ≈ 231,481 → ×3 peak',
          result: '~231K msg/s avg · ~695K msg/s peak',
          notes: 'Write-heavy workload strongly favoring LSM-tree append storage (Cassandra / ScyllaDB) over random-B-Tree RDBMS.',
        },
        {
          metric: 'WebSocket Gateway Fleet',
          formula: '100M concurrent sockets / 250K conns/node = 400 (+25% headroom)',
          result: '~500 stateful Gateway nodes',
          notes: 'Uses epoll/kqueue event loops (Erlang/Elixir, Go, or Netty/Java) with tuned ulimit & ephemeral port ranges.',
        },
        {
          metric: 'Daily & 5-Year Text Storage',
          formula: '20B × 200 B = 4.0 TB/day × 365 × 5 yr',
          result: '4 TB/day · 7.3 PB raw (~22 PB w/ 3× RF)',
          notes: 'WhatsApp’s device-first model can purge delivered blobs after 30 days (cutting cloud storage >95%), whereas Slack/Messenger retain full multi-year cloud history.',
        },
        {
          metric: 'Redis Session Registry RAM',
          formula: '100M online sessions × ~100 B/entry (userId → gwId, deviceId)',
          result: '~10 GB raw (~30 GB w/ Redis overhead & HA)',
          notes: 'Fits comfortably on a small 3–6 shard Redis Cluster delivering sub-millisecond routing lookups.',
        },
        {
          metric: 'Presence Heartbeat Load',
          formula: '100M online users / 30s heartbeat interval',
          result: '~3.33M heartbeats/sec at edge',
          notes: 'Gateways absorb TCP/WS pings locally and ONLY emit state transitions (ONLINE/OFFLINE) or batched 60s TTL renewals to Redis — cutting backend presence writes by >10×!',
        },
        {
          metric: 'Text Messaging Bandwidth',
          formula: '231K msg/s × 200 B ≈ 46 MB/s ingress (×3 peak ≈ 140 MB/s)',
          result: '~140 MB/s ingress · ~280 MB/s egress peak',
          notes: 'Media files bypass chat brokers entirely via pre-signed S3 uploads and Edge CDN downloads.',
        },
      ],
    },
    apiAndDataModel: {
      endpoints: [
        {
          method: 'GET',
          path: '/ws/v1/connect',
          summary: 'Upgrade HTTPS to persistent WebSocket (TLS + JWT); registers userId → gatewayNodeId in Redis Session Map',
          payload: 'WS Frames: SEND {clientMsgId, convId, ciphertext}, ACK {clientMsgId, msgId, convSeq, status:"SENT"}, RECEIPT {convId, upToSeq, status:"DELIVERED"|"READ"}',
        },
        {
          method: 'GET',
          path: '/api/v1/conversations/{convId}/messages?afterSeq={lastSeq}&limit=50',
          summary: 'Offline catch-up & multi-device inbox sync fetching missed messages strictly ordered by per-conversation sequence',
          payload: '200 { "messages": [{ "msgId": "719283...", "convSeq": 412, "senderId": "u42", "body": "..." }], "hasMore": false }',
        },
        {
          method: 'PUT',
          path: '/api/v1/conversations/{convId}/receipts',
          summary: 'Batch-update high-water mark for DELIVERED or READ receipts (blue ticks) to avoid per-message ACK storms',
          payload: '{ "upToSeq": 412, "type": "READ" } → emits ReceiptEvent to sender’s active WebSocket Gateway',
        },
        {
          method: 'POST',
          path: '/api/v1/media/presign',
          summary: 'Issue time-limited S3 pre-signed URL for client-side encrypted media upload (keeps multi-MB blobs off chat queues)',
          payload: '{ "mimeType": "image/webp", "bytes": 245000 } → 200 { "uploadUrl": "https://s3...", "mediaId": "m_882a" }',
        },
      ],
      storageSchema: [
        {
          store: 'Cassandra / ScyllaDB (Time-Bucketed Message History)',
          schema: 'messages_by_conv (conversation_id UUID, month_bucket INT [YYYYMM], message_id BIGINT [Snowflake/Seq], sender_id BIGINT, payload BLOB, PRIMARY KEY ((conversation_id, month_bucket), message_id)) WITH CLUSTERING ORDER BY (message_id DESC)',
          shardingAndIndexing:
            'Composite partition key (conversation_id, month_bucket) caps partition size (<100 MB) even for hyper-active 1,000-member groups over 5 years, while clustering by message_id enables single-seek sequential range scans on reconnect sync.',
        },
        {
          store: 'Redis Session & Presence Cluster',
          schema: 'session:{userId} → HASH { deviceId → gatewayNodeId }  |  presence:{userId} → "1" EX 60  |  last_seen:{userId} → epochMs',
          shardingAndIndexing:
            'Sharded by userId. Multi-device support stores multiple deviceId → gatewayNodeId entries under one hash so a message fans out to both Phone and Web Desktop simultaneously.',
        },
        {
          store: 'Group Metadata Store (Sharded Postgres + Redis Cache)',
          schema: 'group_members (group_id BIGINT, user_id BIGINT, role SMALLINT, joined_at TIMESTAMP, PRIMARY KEY (group_id, user_id))',
          shardingAndIndexing:
            'Partitioned by group_id and aggressively cached in Redis; small group cap (≤ 1,024 members) keeps fan-out lookup O(1) in a single shard read.',
        },
      ],
    },
    architecture: {
      title: 'WhatsApp Real-Time Chat — Interactive System Architecture',
      summary: 'Click any node to inspect persistent WebSocket routing, Redis session discovery, Cassandra time-buckets, and offline push',
      defaultSelectedNodeId: 'chat-svc',
      nodes: [
        {
          id: 'clients',
          label: 'Chat Clients',
          sublabel: 'iOS · Android · Web',
          category: 'client',
          x: 14,
          y: 215,
          width: 136,
          height: 58,
          flows: ['write', 'read'],
          details: {
            role: 'End-user mobile & web apps maintaining a single multiplexed TLS WebSocket connection, local SQLite message cache, and Signal-protocol E2E encryption keys.',
            dataFlow: 'Sends encrypted messages, typing indicators, and read receipts over WSS; fetches offline history deltas via HTTPS Sync API and uploads media directly to S3.',
            scalingStrategy: 'Client-generated clientMsgId UUID enables sender-side deduplication on retries; reconnect uses exponential backoff with jitter to prevent thundering herds after tower drops.',
            failureHandling: 'Queues outbound drafts locally in SQLite while offline, syncing in strict local order once WSS reconnects and reconciling with server-assigned convSeq.',
            techChoices: ['WebSockets (TLS 1.3)', 'Local SQLite', 'Signal E2EE Protocol'],
          },
        },
        {
          id: 'ws-gateway',
          label: 'WS Gateway Fleet',
          sublabel: 'Stateful TCP · epoll',
          category: 'edge',
          x: 196,
          y: 130,
          width: 160,
          height: 58,
          flows: ['write', 'read'],
          details: {
            role: 'Stateful edge tier terminating 250K persistent WebSocket connections per server, handling TLS/auth handshake, local heartbeat termination, and frame push to connected devices.',
            dataFlow: 'Registers userId → thisGatewayId in Redis on connect; forwards inbound SEND/RECEIPT frames to Chat Service and receives internal gRPC pushes from Chat Service to deliver directly over open sockets.',
            scalingStrategy: 'Horizontally scaled across ~500 epoll/kqueue nodes behind L4 load balancers (NLB/Maglev); zero sticky-session DB dependency because any node can serve any user once registered in Redis.',
            failureHandling: 'On rolling deploy or node crash, connections drop gracefully with GOAWAY frame; clients reconnect with jitter across healthy gateways, re-register in Redis, and call /sync for any gap.',
            techChoices: ['Go / Netty / Erlang', 'AWS NLB / Envoy L4', 'Internal gRPC Push'],
          },
        },
        {
          id: 'http-gateway',
          label: 'API Gateway / LB',
          sublabel: 'Sync · Media · Auth',
          category: 'edge',
          x: 196,
          y: 302,
          width: 160,
          height: 58,
          flows: ['read', 'write'],
          details: {
            role: 'Stateless L7 HTTP gateway serving non-WebSocket control-plane APIs: offline inbox catch-up (/sync), group membership CRUD, pre-signed S3 media URLs, and key-bundle exchange.',
            dataFlow: 'Authenticates JWT tokens, enforces per-user rate limits, and forwards catch-up / media requests to Sync & Push Service.',
            scalingStrategy: 'Purely stateless autoscaled Envoy/ALB fleet isolated from stateful WebSocket memory budgets.',
            failureHandling: 'Circuit breakers and token-bucket rate limiting protect Cassandra from malicious history-scraping storms during regional reconnect spikes.',
            techChoices: ['Envoy / ALB', 'JWT Auth', 'Token-Bucket Limiter'],
          },
        },
        {
          id: 'presence-svc',
          label: 'Presence Service',
          sublabel: 'Heartbeats + Online',
          category: 'service',
          x: 398,
          y: 32,
          width: 166,
          height: 58,
          flows: ['write', 'read'],
          details: {
            role: 'Tracks ONLINE / OFFLINE status and last_seen timestamps while preventing presence-broadcast storms across millions of contacts.',
            dataFlow: 'Receives debounced connect/disconnect events and periodic 60s TTL renewals from WS Gateways, writes presence:{userId} EX 60 in Redis, and pushes status updates ONLY to users currently viewing that chat screen (lazy subscription!).',
            scalingStrategy: 'Pull-on-open + ephemeral subscription avoids O(N × friends) global fan-out whenever someone locks/unlocks their phone.',
            failureHandling: 'A 15–30s offline grace window suppresses rapid online/offline flapping when mobile users pass through elevators or switch Wi-Fi → 5G.',
            techChoices: ['Debounced Heartbeats', 'Redis TTL Keys', 'Lazy Chat-Open Sub'],
          },
        },
        {
          id: 'chat-svc',
          label: 'Chat Router & Seq',
          sublabel: '1:1 · Group Fan-Out',
          category: 'service',
          x: 398,
          y: 214,
          width: 166,
          height: 58,
          flows: ['write', 'read'],
          details: {
            role: 'Core stateless/partitioned messaging engine assigning Snowflake + per-conversation sequence IDs, persisting messages durably, sending SENT (✓) ACK, and routing to recipient WS Gateways or Kafka.',
            dataFlow: '(1) Deduplicate clientMsgId & assign seq, (2) Write to Cassandra (returns ✓ SENT ACK to sender), (3) Lookup recipient(s) in Redis Session Map, (4) Push via gRPC to peer WS Gateway if online OR publish to Kafka for group fan-out / offline push.',
            scalingStrategy: 'Consistent-hashed by conversationId so a single hot group’s sequence allocation stays serialized without distributed locks; group fan-out (>10 members) offloads asynchronously to Kafka consumers.',
            failureHandling: 'Idempotent writes keyed by (conversation_id, client_msg_id) ensure retried frames never produce duplicate messages even if the ✓ ACK drops on the return hop.',
            techChoices: ['Java / Go + gRPC', 'Snowflake + ConvSeq', 'Idempotent Dedupe'],
          },
        },
        {
          id: 'sync-push-svc',
          label: 'Sync & Push Svc',
          sublabel: 'Catch-Up · APNs/FCM',
          category: 'service',
          x: 398,
          y: 408,
          width: 166,
          height: 58,
          flows: ['read', 'write'],
          details: {
            role: 'Serves paginated offline catch-up reads (/sync?afterSeq=...) on reconnect, issues S3 pre-signed media URLs, and consumes Kafka offline events to trigger mobile OS push notifications.',
            dataFlow: 'Reads missed message ranges from Cassandra for reconnecting clients; consumes OfflineMessage events from Kafka to dispatch APNs (iOS) and FCM (Android) silent/alert pushes.',
            scalingStrategy: 'Stateless consumer + HTTP fleet autoscaled independently on reconnect bursts and Kafka consumer lag.',
            failureHandling: 'Coalesces rapid offline messages into a single "5 new messages" push banner and backs off on APNs/FCM rate limits; unread messages remain safely durable in Cassandra regardless of push delivery.',
            techChoices: ['APNs / FCM Gateways', 'Kafka Consumer Group', 'S3 Presign Signer'],
          },
        },
        {
          id: 'redis-session',
          label: 'Redis Session+TTL',
          sublabel: 'userId->GW & Presence',
          category: 'cache',
          x: 700,
          y: 24,
          width: 208,
          height: 56,
          flows: ['write', 'read'],
          details: {
            role: 'Ultra-low-latency directory storing active WebSocket routing tables (userId → {deviceId: gatewayNodeId}), ephemeral 60s online presence TTLs, and hot group-member sets.',
            dataFlow: 'Updated by WS Gateways & Presence Service; queried on every online message hop by Chat Service in <1ms to discover which gateway holds the recipient’s socket.',
            scalingStrategy: 'Clustered Redis sharded by userId (~30 GB total RAM for 100M online sessions) with read replicas for presence reads.',
            failureHandling: 'Redis state is soft/reconstructible: if a shard fails over and loses a session entry, recipient falls back to offline push and re-registers on next heartbeat/reconnect with zero message loss.',
            techChoices: ['Redis Cluster', 'Hash Multi-Device Map', 'EX 60s Presence TTL'],
          },
        },
        {
          id: 'cassandra',
          label: 'Cassandra / Scylla',
          sublabel: 'Time-Bucket Messages',
          category: 'database',
          x: 700,
          y: 142,
          width: 208,
          height: 56,
          flows: ['write', 'read'],
          details: {
            role: 'Durable, write-optimized distributed store persisting 20B messages/day partitioned by (conversation_id, month_bucket) and clustered by message_id for sequential sync scans.',
            dataFlow: 'Receives QUORUM writes from Chat Service before SENT (✓) ACK is emitted; serves range queries (message_id > lastSeq) to Sync Service when offline clients reconnect.',
            scalingStrategy: 'Linear horizontal scaling via consistent-hash token ring; LSM-tree memtable + SSTable append-only writes effortlessly absorb 700K+ writes/sec without B-Tree random I/O stalls.',
            failureHandling: 'RF=3 across Availability Zones with LOCAL_QUORUM (W=2, R=2) guarantees zero data loss on single-node/AZ outage; time-bucketing prevents unbounded wide-row compaction cliffs.',
            techChoices: ['Apache Cassandra / ScyllaDB', 'LSM-Tree Storage', 'Time-Bucketed Partitions'],
          },
        },
        {
          id: 'kafka',
          label: 'Kafka Event Bus',
          sublabel: 'Group & Offline Queue',
          category: 'queue',
          x: 700,
          y: 266,
          width: 208,
          height: 56,
          flows: ['write'],
          details: {
            role: 'Decouples Chat Service hot-path latency from 1,000-member group fan-out, offline APNs/FCM push delivery, and cross-device delivery/read receipt propagation.',
            dataFlow: 'Chat Service publishes GroupFanOut and OfflineNotify events partitioned by conversationId; Sync & Push Workers consume asynchronously to route online members or trigger mobile pushes.',
            scalingStrategy: 'Partitioned by conversationId (preserving per-chat ordering within each partition) across high-throughput broker clusters.',
            failureHandling: 'RF=3 durable log buffers spikes (e.g., New Year’s Eve midnight surge) without dropping notifications or back-pressuring live 1:1 WebSocket ACKs.',
            techChoices: ['Apache Kafka', 'Per-Conv Partitioning', 'Async Fan-Out Workers'],
          },
        },
        {
          id: 'media-cdn',
          label: 'S3 + Edge CDN',
          sublabel: 'Encrypted Media Blob',
          category: 'storage',
          x: 700,
          y: 398,
          width: 208,
          height: 56,
          flows: ['read', 'write'],
          details: {
            role: 'Stores client-side AES-encrypted photos, videos, voice notes, and thumbnails completely outside the text message broker and Cassandra storage path.',
            dataFlow: 'Sender encrypts blob locally, uploads via pre-signed S3 URL, and sends ONLY the tiny mediaId + decryption key inside the E2E-encrypted chat message; recipients download via nearest Edge CDN.',
            scalingStrategy: 'Content-addressed deduplication (for unencrypted/public assets) and global CDN caching offload >90% of total bytes from core chat infrastructure.',
            failureHandling: 'Multi-AZ S3 durability (11 nines) with lifecycle TTL policies expiring transient media blobs per product retention rules.',
            techChoices: ['Amazon S3', 'CloudFront Edge CDN', 'Client-Side AES-GCM'],
          },
        },
      ],
      edges: [
        { id: 'wa-1', from: 'clients', to: 'ws-gateway', label: 'WSS Live', flow: 'both', labelT: 0.48 },
        { id: 'wa-2', from: 'clients', to: 'http-gateway', label: 'HTTPS Sync', flow: 'read', labelT: 0.48 },
        { id: 'wa-3', from: 'ws-gateway', to: 'presence-svc', label: 'Heartbeat', flow: 'write', labelT: 0.5 },
        { id: 'wa-4', from: 'ws-gateway', to: 'chat-svc', label: 'Send / ACK', flow: 'both', labelT: 0.5 },
        { id: 'wa-5', from: 'http-gateway', to: 'sync-push-svc', label: 'Catch-Up', flow: 'read', labelT: 0.5 },
        { id: 'wa-6', from: 'presence-svc', to: 'redis-session', label: 'SET EX 60s', flow: 'write', labelT: 0.5 },
        { id: 'wa-7', from: 'chat-svc', to: 'redis-session', label: 'Lookup GW', flow: 'read', labelT: 0.65 },
        { id: 'wa-8', from: 'chat-svc', to: 'cassandra', label: 'Persist ✓', flow: 'write', labelT: 0.32 },
        { id: 'wa-9', from: 'chat-svc', to: 'kafka', label: 'Fan-Out', flow: 'write', async: true, labelT: 0.46 },
        {
          id: 'wa-10',
          from: 'kafka',
          to: 'sync-push-svc',
          label: 'Offline Push',
          flow: 'write',
          async: true,
          fromSide: 'left',
          toSide: 'right',
          labelT: 0.48,
        },
        { id: 'wa-11', from: 'sync-push-svc', to: 'cassandra', label: 'Sync Range', flow: 'read', labelT: 0.78 },
        { id: 'wa-12', from: 'sync-push-svc', to: 'media-cdn', label: 'Presign S3', flow: 'both', labelT: 0.5 },
      ],
    },
    tradeOffs: [
      {
        topic: 'Real-Time Delivery Protocol: HTTP Long Polling vs. SSE vs. Persistent WebSockets',
        context: '100M concurrent mobile/web users exchange bidirectional messages, typing events, and read receipts in under 100ms.',
        options: [
          {
            name: 'HTTP Long Polling',
            pros: ['Works trivially over standard stateless HTTP load balancers and legacy corporate proxies'],
            cons: [
              'Re-establishes HTTP requests + headers after every single message — massive CPU/header waste at 700K msg/s',
              'Server has no clean low-overhead way to detect abrupt client disconnect',
            ],
            whenToChoose: 'Fallback transport only when strict enterprise firewalls block WebSocket upgrades.',
          },
          {
            name: 'Server-Sent Events (SSE)',
            pros: ['Lightweight server-to-client streaming over HTTP/2 with automatic browser reconnect'],
            cons: [
              'Strictly unidirectional (server → client): every outbound message, heartbeat, and read receipt still needs separate HTTP POST round-trips',
            ],
            whenToChoose: 'Unidirectional live feeds (stock tickers, LLM token streaming, live sports scores).',
          },
          {
            name: 'Persistent WebSockets (Full-Duplex TLS)',
            recommended: true,
            pros: [
              'Single long-lived full-duplex TCP socket carries outbound messages, inbound deliveries, receipts, and heartbeats with just 2–6 byte framing overhead',
              'Immediate sub-50ms server-to-client push without polling cycles',
            ],
            cons: [
              'Stateful Gateway fleet requires Redis Session Registry (userId → gatewayNodeId) and graceful connection draining during deploys',
            ],
            whenToChoose: 'Any real-time interactive chat, multiplayer game, or collaborative editor.',
          },
        ],
        seniorVerdict:
          'Standardize on persistent WebSockets over TLS with custom application-level ACKs and jittered reconnect backoff, paired with stateless HTTPS endpoints for offline catch-up sync and S3 media uploads.',
      },
      {
        topic: 'Message Ordering: Client Wall-Clock vs. Snowflake IDs vs. Per-Conversation Sequence IDs',
        context: 'Users in a busy group chat must see messages in identical causal order AND detect exact missing gaps during offline reconnect sync.',
        options: [
          {
            name: 'Client Wall-Clock Timestamps',
            pros: ['Zero server coordination'],
            cons: [
              'Broken in production: mobile clocks drift by minutes/hours (NTP skew or manual timezone changes), scrambling replies ahead of questions',
            ],
            whenToChoose: 'Never for authoritative ordering (only display hints).',
          },
          {
            name: 'Distributed Snowflake 64-bit IDs Only',
            pros: ['Globally unique, time-sortable (k-sortable), zero per-chat state needed across stateless Chat pods'],
            cons: [
              'Non-contiguous IDs (cannot tell if a message was dropped between ID 9012 and 9088 without range scanning) and mild millisecond NTP clock skew across nodes',
            ],
            whenToChoose: 'Global unique primary keys and cross-conversation feeds.',
          },
          {
            name: 'Snowflake msgId + Per-Conversation Monotonic Sequence (convSeq)',
            recommended: true,
            pros: [
              'Strict total order within every conversation with contiguous integers (1, 2, 3...) so clients instantly detect gaps (got seq 414 while local max is 411 → trigger /sync?afterSeq=411!)',
              'Enables compact high-water-mark READ receipts (upToSeq = 414 marks 50 messages read in one tiny packet)',
            ],
            cons: ['Requires lightweight per-conversation sequence allocator (consistent-hashed router or Redis INCR / DB sequence)'],
            whenToChoose: 'Production chat systems (WhatsApp, Slack, Discord) requiring gap detection and reliable multi-device sync.',
          },
        ],
        seniorVerdict:
          'Combine BOTH: assign a globally unique Snowflake message_id for Cassandra clustering and cross-system tracing, PLUS a contiguous per-conversation conv_seq for gap-free sync cursors and batched blue-tick read receipts.',
      },
      {
        topic: 'Message Storage: Sharded RDBMS vs. Time-Bucketed Cassandra / ScyllaDB',
        context: '700K peak writes/sec, append-only sequential history reads, and multi-year group chats accumulating millions of rows.',
        options: [
          {
            name: 'Sharded Relational DB (MySQL / PostgreSQL)',
            pros: ['Rich ACID joins and familiar operational model'],
            cons: [
              'Random B-Tree page writes + WAL/index amplification degrade sharply at 500K+ writes/sec',
              'Manual resharding and multi-region active-active replication add severe operational toil at petabyte scale',
            ],
            whenToChoose: 'Structured low-volume metadata tables (User profiles, Group membership, Billing) — NOT raw chat logs.',
          },
          {
            name: 'Cassandra / ScyllaDB with (conversation_id, month_bucket) Partition Key',
            recommended: true,
            pros: [
              'Append-only LSM-tree storage absorbs 700K+ writes/sec with linear horizontal scaling and tunable LOCAL_QUORUM durability',
              'Clustering by message_id DESC makes "fetch latest 50 messages" or "sync afterSeq" a single sequential disk/cache scan',
              'Time-bucketing (month_bucket) prevents unbounded wide partitions in decade-old group chats',
            ],
            cons: ['Full-text search across messages requires a separate inverted index (Elasticsearch / client-side SQLite FTS5 for E2EE chats)'],
            whenToChoose: 'High-throughput time-ordered messaging histories, activity logs, and inbox sync workloads.',
          },
        ],
        seniorVerdict:
          'Use Sharded MySQL/Postgres ONLY for user/group metadata, and store message payloads in Time-Bucketed Cassandra/ScyllaDB keyed by ((conversation_id, month_bucket), message_id) — explicitly mentioning that E2EE search runs locally on the client’s SQLite FTS index!',
      },
    ],
  },
};
