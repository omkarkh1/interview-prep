import type { DayCurriculum } from '@/types/curriculum';

export const day7: DayCurriculum = {
  dayNumber: 7,
  title: 'Backtracking & Hard Mixed Patterns',
  theme: 'Constraint-Pruned Search, Interval DP, Debt-Graph LLD & Double-Entry Payment Ledgers',
  status: 'complete',
  estimatedMinutes: 130,
  summary:
    'Master O(1)-pruned backtracking (N-Queens & Combination Sum II), 1D segmentation DP (Word Break), reverse-thinking 2D Interval DP (Burst Balloons), and Trie filesystem design; build a thread-safe Splitwise debt-simplification engine in Java; and architect an ACID Double-Entry Stripe-grade Payment Ledger.',
  dsaLessons: [
    /* ================================================================
     * DSA 1: N-QUEENS
     * ================================================================ */
    {
      id: 'day7-n-queens',
      dayNumber: 7,
      kind: 'dsa',
      title: 'N-Queens',
      subtitle: 'Row-by-row constraint-pruned backtracking with O(1) column and diagonal hashing',
      difficulty: 'Hard',
      patterns: ['Backtracking', 'Constraint Propagation', 'Diagonal Indexing (r-c, r+c)'],
      estimatedMinutes: 16,
      leetcodeRef: 'LC #51',
      problemStatement:
        'Place n queens on an n × n chessboard so that no two queens attack each other (no shared row, column, main diagonal, or anti-diagonal). Return all distinct valid board configurations.',
      exampleSummary: {
        input: 'n = 4',
        output: '[[".Q..","...Q","Q...","..Q."], ["..Q.","Q...","...Q",".Q.."]]',
        explanation:
          'There are exactly 2 valid solutions for 4-Queens. Placing a queen at (0,0) forces dead-ends on row 2 and row 3, so backtracking unwinds to (0,1) and discovers [(0,1), (1,3), (2,0), (3,2)] and its horizontal mirror.',
      },
      patternRecognition: {
        interviewCue:
          'Whenever you must place items under global mutual-exclusion constraints and enumerate ALL valid configurations, assign one decision variable per row (eliminating row conflicts by construction) and prune impossible branches in O(1) using boolean constraint sets.',
        signals: [
          'Keywords: "return all distinct valid placements / boards / configurations"',
          'Small constraint bound (n ≤ 9–12) signaling factorial/exponential search with heavy pruning',
          'Grid diagonal invariants: every main diagonal (\\) shares constant (r - c); every anti-diagonal (/) shares constant (r + c)',
        ],
        mentalModel:
          'Place exactly one queen in row r (for r = 0..n-1). Before dropping a queen at (r, c), verify in O(1) that cols[c], diag1[r - c + n - 1], and diag2[r + c] are all false. Recurse to r + 1, and unconditionally undo all three flags when backtracking.',
      },
      intuitionComparison: {
        bruteForce: {
          approach:
            'Choose n cells out of n² squares — C(n², n) combinations — and scan all pairs of queens in O(n²) to validate non-attacking geometry.',
          timeComplexity: 'O(C(n², n) · n²)',
          spaceComplexity: 'O(n²)',
          bottleneck:
            'Wastes nearly all search effort placing multiple queens on the same row or validating illegal partial boards only after placing all n queens.',
        },
        optimal: {
          approach:
            'Backtrack row-by-row (guaranteeing 1 queen/row) while tracking occupied columns, main diagonals (r - c), and anti-diagonals (r + c) in boolean arrays (or 3 integer bitmasks).',
          timeComplexity: 'O(n!)',
          spaceComplexity: 'O(n²) board + O(n) state & stack',
          keyInvariant:
            'Every partial assignment across rows [0..r-1] is already 100% conflict-free; any dead-end row triggers immediate backtracking before exploring deeper rows.',
        },
      },
      visualizer: {
        kind: 'dp-table-2d',
        title: '4-Queens Backtracking & Diagonal Conflict Trace',
        inputSummary: 'n = 4 chessboard · cols, diag1 (r - c), diag2 (r + c)',
        rowAxisLabel: 'Row r',
        colAxisLabel: 'Col c',
        rowHeaders: ['r=0', 'r=1', 'r=2', 'r=3'],
        colHeaders: ['c=0', 'c=1', 'c=2', 'c=3'],
        steps: [
          {
            caption:
              'Row 0: try c = 0 at (0, 0). All three constraint sets are empty, so place Q at (0, 0) and lock col = 0, diag1 (r-c) = 0, diag2 (r+c) = 0.',
            recurrence: 'Safe(r, c) ⇔ !cols[c] && !diag1[r - c] && !diag2[r + c]',
            concreteFormula: 'Place Q(0,0) → cols={0}, d1={0}, d2={0}',
            grid: [
              ['Q', null, null, null],
              [null, null, null, null],
              [null, null, null, null],
              [null, null, null, null],
            ],
            activeCell: { row: 0, col: 0 },
            variables: [
              { name: 'row', value: '0' },
              { name: 'cols', value: '{0}' },
              { name: 'd1 (r-c)', value: '{0}' },
              { name: 'd2 (r+c)', value: '{0}' },
            ],
          },
          {
            caption:
              'Row 1: c=0 fails (col 0) and c=1 fails (d1 = 1-1 = 0). First safe column is c = 2 at (1, 2)! Place Q(1,2) and lock col=2, d1=-1, d2=3.',
            recurrence: 'Skip (1,0)[col=0], (1,1)[d1=0] → Place Q(1,2)',
            concreteFormula: 'Q(1,2): col=2, d1=1-2=-1, d2=1+2=3 — All free!',
            grid: [
              ['Q', null, null, null],
              ['×', '×', 'Q', null],
              [null, null, null, null],
              [null, null, null, null],
            ],
            activeCell: { row: 1, col: 2 },
            dependencyCells: [
              { row: 0, col: 0, label: 'Q', tone: 'emerald' },
              { row: 1, col: 0, label: 'col', tone: 'rose' },
              { row: 1, col: 1, label: 'd1', tone: 'rose' },
            ],
            variables: [
              { name: 'row', value: '1' },
              { name: 'cols', value: '{0, 2}' },
              { name: 'd1 (r-c)', value: '{0, -1}' },
              { name: 'd2 (r+c)', value: '{0, 3}' },
            ],
          },
          {
            caption:
              'Row 2 DEAD END! Every column fails: (2,0) hits col=0, (2,1) hits d2=3, (2,2) hits col=2, and (2,3) hits d1=-1. Backtrack to Row 1 and remove Q(1,2)!',
            recurrence: 'No safe column in row 2 → Unwind Q(1,2) and continue row 1',
            concreteFormula: 'Row 2 blocked: (2,0)col · (2,1)d2 · (2,2)col · (2,3)d1 → BACKTRACK',
            grid: [
              ['Q', null, null, null],
              [null, null, 'Q', null],
              ['×', '×', '×', '×'],
              [null, null, null, null],
            ],
            activeCell: { row: 1, col: 2 },
            dependencyCells: [
              { row: 0, col: 0, label: 'Q', tone: 'emerald' },
              { row: 2, col: 0, label: 'col', tone: 'rose' },
              { row: 2, col: 1, label: 'd2', tone: 'rose' },
              { row: 2, col: 2, label: 'col', tone: 'rose' },
              { row: 2, col: 3, label: 'd1', tone: 'rose' },
            ],
            variables: [
              { name: 'row', value: '2 → 1' },
              { name: 'status', value: 'Dead End', tone: 'rose' },
              { name: 'action', value: 'Undo Q(1,2)', tone: 'amber' },
            ],
          },
          {
            caption:
              'Back in Row 1, advance to c = 3: Q(1,3) is safe (col=3, d1=-2, d2=4). Recurse to Row 2: c=0 fails (col 0), but c = 1 is SAFE! Place Q(2,1) (col=1, d1=1, d2=3).',
            recurrence: 'Place Q(1,3), then descend to row 2 → Place Q(2,1)',
            concreteFormula: 'Q(1,3)[d1=-2,d2=4] + Q(2,1)[d1=1,d2=3] → Recurse to r=3',
            grid: [
              ['Q', null, null, null],
              [null, null, null, 'Q'],
              ['×', 'Q', null, null],
              [null, null, null, null],
            ],
            activeCell: { row: 2, col: 1 },
            dependencyCells: [
              { row: 0, col: 0, label: 'Q', tone: 'emerald' },
              { row: 1, col: 3, label: 'Q', tone: 'emerald' },
              { row: 2, col: 0, label: 'col', tone: 'rose' },
            ],
            variables: [
              { name: 'row', value: '2' },
              { name: 'cols', value: '{0, 3, 1}' },
              { name: 'd1 (r-c)', value: '{0, -2, 1}' },
              { name: 'd2 (r+c)', value: '{0, 4, 3}' },
            ],
          },
          {
            caption:
              'Row 3 DEAD END! (3,0) hits col=0/d2=3, (3,1) hits col=1, (3,2) hits d1=1, (3,3) hits col=3/d1=0. Entire subtree rooted at Q(0,0) is exhausted — unwind Q(2,1), Q(1,3), AND Q(0,0)!',
            recurrence: 'All columns in row 3 blocked → Backtrack all the way to Row 0',
            concreteFormula: 'Subtree Q(0,0) has 0 solutions → Reset & try (0, 1)',
            grid: [
              ['Q', null, null, null],
              [null, null, null, 'Q'],
              [null, 'Q', null, null],
              ['×', '×', '×', '×'],
            ],
            activeCell: { row: 0, col: 0 },
            dependencyCells: [
              { row: 3, col: 0, label: 'col', tone: 'rose' },
              { row: 3, col: 1, label: 'col', tone: 'rose' },
              { row: 3, col: 2, label: 'd1', tone: 'rose' },
              { row: 3, col: 3, label: 'd1', tone: 'rose' },
            ],
            variables: [
              { name: 'row', value: '3 → 0' },
              { name: 'status', value: 'Branch Pruned', tone: 'rose' },
              { name: 'nextTry', value: '(0, 1)', tone: 'amber' },
            ],
          },
          {
            caption:
              'Row 0 tries c = 1: place Q(0,1) (col=1, d1=-1, d2=1). Descend to Row 1: c=0 (d2=1), c=1 (col=1), and c=2 (d1=-1) are all attacked, leaving c = 3 SAFE! Place Q(1,3).',
            recurrence: 'Place Q(0,1) → Row 1 prunes c=0,1,2 → Place Q(1,3)',
            concreteFormula: 'Q(0,1)[c=1,d1=-1,d2=1] + Q(1,3)[c=3,d1=-2,d2=4]',
            grid: [
              [null, 'Q', null, null],
              ['×', '×', '×', 'Q'],
              [null, null, null, null],
              [null, null, null, null],
            ],
            activeCell: { row: 1, col: 3 },
            dependencyCells: [
              { row: 0, col: 1, label: 'Q', tone: 'emerald' },
              { row: 1, col: 0, label: 'd2', tone: 'rose' },
              { row: 1, col: 1, label: 'col', tone: 'rose' },
              { row: 1, col: 2, label: 'd1', tone: 'rose' },
            ],
            variables: [
              { name: 'row', value: '1' },
              { name: 'cols', value: '{1, 3}' },
              { name: 'd1 (r-c)', value: '{-1, -2}' },
              { name: 'd2 (r+c)', value: '{1, 4}' },
            ],
          },
          {
            caption:
              'Row 2: immediately check c = 0 at (2, 0). col=0 is free, d1 = 2-0 = 2 is free, d2 = 2+0 = 2 is free! Place Q(2,0) and recurse to the final row r = 3.',
            recurrence: 'Q(2,0) passes all three O(1) checks → Recurse to row 3',
            concreteFormula: 'Q(2,0): col=0, d1=2, d2=2 — Safe! cols={1,3,0}',
            grid: [
              [null, 'Q', null, null],
              [null, null, null, 'Q'],
              ['Q', null, null, null],
              [null, null, null, null],
            ],
            activeCell: { row: 2, col: 0 },
            dependencyCells: [
              { row: 0, col: 1, label: 'Q', tone: 'emerald' },
              { row: 1, col: 3, label: 'Q', tone: 'emerald' },
            ],
            variables: [
              { name: 'row', value: '2' },
              { name: 'cols', value: '{1, 3, 0}' },
              { name: 'd1 (r-c)', value: '{-1, -2, 2}' },
              { name: 'd2 (r+c)', value: '{1, 4, 2}' },
            ],
          },
          {
            caption:
              'Row 3: c=0 and c=1 fail col checks; c = 2 at (3, 2) has col=2, d1 = 3-2 = 1, d2 = 3+2 = 5 — ALL FREE! Base case row == 4 reached! Valid Solution #1 found: [(0,1), (1,3), (2,0), (3,2)].',
            recurrence: 'row == n → Snapshot board! (Mirror solution found at r=0, c=2)',
            concreteFormula: 'VALID: [(0,1), (1,3), (2,0), (3,2)] → [".Q..","...Q","Q...","..Q."]',
            grid: [
              ['.', 'Q', '.', '.'],
              ['.', '.', '.', 'Q'],
              ['Q', '.', '.', '.'],
              ['.', '.', 'Q', '.'],
            ],
            pathCells: [
              { row: 0, col: 1 },
              { row: 1, col: 3 },
              { row: 2, col: 0 },
              { row: 3, col: 2 },
            ],
            variables: [
              { name: 'queens', value: '(0,1),(1,3),(2,0),(3,2)', tone: 'emerald' },
              { name: 'solutions', value: '1 found (2 total)', tone: 'emerald' },
            ],
          },
        ],
      },
      javaSolution: {
        filename: 'NQueens.java',
        code: `import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

public class NQueens {
    public List<List<String>> solveNQueens(int n) {
        List<List<String>> solutions = new ArrayList<>();
        char[][] board = new char[n][n];
        for (char[] row : board) {
            Arrays.fill(row, '.');
        }

        boolean[] cols = new boolean[n];
        boolean[] diag1 = new boolean[2 * n - 1]; // Main diagonal: (r - c) shifted by +(n - 1)
        boolean[] diag2 = new boolean[2 * n - 1]; // Anti-diagonal: (r + c) in [0..2n-2]

        backtrack(0, n, board, cols, diag1, diag2, solutions);
        return solutions;
    }

    private void backtrack(
            int row,
            int n,
            char[][] board,
            boolean[] cols,
            boolean[] diag1,
            boolean[] diag2,
            List<List<String>> solutions) {
        if (row == n) {
            solutions.add(snapshotBoard(board));
            return;
        }

        for (int col = 0; col < n; col++) {
            int d1 = row - col + (n - 1);
            int d2 = row + col;
            if (cols[col] || diag1[d1] || diag2[d2]) {
                continue; // O(1) conflict prune
            }

            // Choose
            board[row][col] = 'Q';
            cols[col] = diag1[d1] = diag2[d2] = true;

            // Explore next row
            backtrack(row + 1, n, board, cols, diag1, diag2, solutions);

            // Unchoose (restore exact state for next column candidate)
            board[row][col] = '.';
            cols[col] = diag1[d1] = diag2[d2] = false;
        }
    }

    private List<String> snapshotBoard(char[][] board) {
        List<String> rows = new ArrayList<>(board.length);
        for (char[] row : board) {
            rows.add(new String(row));
        }
        return rows;
    }
}`,
        callouts: [
          {
            id: 'nq-diag-arrays',
            startLine: 13,
            endLine: 15,
            title: 'Boolean Diagonal Arrays Beat HashSet<Integer>',
            explanation:
              'Main diagonals satisfy r - c ∈ [-(n-1), n-1], so shifting by +(n - 1) maps cleanly into boolean[2n - 1]. Using primitive boolean arrays eliminates Integer boxing and hashing overhead inside the tightest recursion loop.',
            accent: 'primary',
          },
          {
            id: 'nq-o1-prune',
            startLine: 34,
            endLine: 39,
            title: 'O(1) Safety Check Instead of O(n) Board Scan',
            explanation:
              'Checking cols[col], diag1[d1], and diag2[d2] is O(1) vs. scanning upward along 3 rays in O(n). Mentioning bitmask compression (int cols, d1, d2 with lowbit trick avail & -avail) for N-Queens II is a strong 4.5-YOE polish.',
            accent: 'amber',
          },
          {
            id: 'nq-symmetry',
            startLine: 41,
            endLine: 50,
            title: 'Strict Choose / Explore / Unchoose Symmetry',
            explanation:
              'Every mutation made before the recursive call is mirrored in reverse immediately after. Only allocate String snapshots in the base case (row == n), never on pruned branches.',
            accent: 'emerald',
          },
        ],
      },
      complexity: {
        time: 'O(n!)',
        space: 'O(n²)',
        timeExplanation:
          'Row 0 has at most n choices, row 1 at most n - 1 (actually ≤ n - 2 after diagonal pruning), yielding an upper bound of O(n!) calls plus O(n²) per valid solution snapshot (S(n) solutions, e.g., 92 for n=8).',
        spaceExplanation:
          'O(n²) for the mutable char[][] board (or O(n) if storing only int[] queenCol and constructing strings only on hit), plus O(n) for boolean constraint arrays and recursion depth n.',
      },
      edgeCases: [
        {
          title: 'n = 1 (Trivial Valid) vs. n = 2, 3 (Zero Solutions)',
          scenario: 'n = 1 returns [["Q"]], whereas n = 2 and n = 3 have NO valid placements.',
          handling: 'Loop finishes with empty solutions list for n = 2, 3 without special-casing; n = 1 immediately hits row == 1 base case.',
        },
        {
          title: 'Bitmask Optimization for N-Queens II (LC #52 — Count Only)',
          scenario: 'Interview follow-up: "If we only need the count for n = 14, how do you make this 10× faster?"',
          handling:
            'Replace boolean[] with three int bitmasks (cols, d1, d2). Available slots in current row = ((1 << n) - 1) & ~(cols | d1 | d2). Extract lowest set bit via bit = avail & -avail and shift diagonals on recurse: (d1 | bit) << 1 and (d2 | bit) >>> 1!',
        },
        {
          title: 'Horizontal Mirror Symmetry Halving',
          scenario: 'Every valid board mirrored left-to-right is also valid.',
          handling: 'For row 0, you can search only col ∈ [0, n/2 - 1] and emit both the board and its mirror (plus the middle column alone when n is odd), cutting search work in half.',
        },
      ],
    },

    /* ================================================================
     * DSA 2: COMBINATION SUM II
     * ================================================================ */
    {
      id: 'day7-combination-sum-ii',
      dayNumber: 7,
      kind: 'dsa',
      title: 'Combination Sum II',
      subtitle: 'Sorted backtracking with O(1) sibling deduplication and early overshoot pruning',
      difficulty: 'Medium',
      patterns: ['Backtracking', 'Sort + Sibling Dedup', 'Subset Sum Pruning'],
      estimatedMinutes: 15,
      leetcodeRef: 'LC #40',
      problemStatement:
        'Given an integer array candidates (which may contain duplicate numbers) and a target integer, find all unique combinations where chosen numbers sum to target. Each element in candidates may be used AT MOST ONCE, and the output must contain no duplicate combinations.',
      exampleSummary: {
        input: 'candidates = [1, 1, 2, 5, 6], target = 8',
        output: '[[1, 1, 6], [1, 2, 5], [2, 6]]',
        explanation:
          'Notice [1, 1, 6] uses BOTH 1s at different tree depths (allowed!), while starting a second root branch with the duplicate 1 at index 1 is pruned to avoid emitting [1, 2, 5] twice.',
      },
      patternRecognition: {
        interviewCue:
          'Whenever input contains DUPLICATE values and you must emit UNIQUE combinations/subsets without using a slow HashSet<List<Integer>>, ALWAYS sort first and apply the universal sibling-dedup rule: if (i > start && nums[i] == nums[i - 1]) continue.',
        signals: [
          'Input array contains duplicate numbers, each usable at most once',
          'Output requires unique combinations (no duplicate sets like two [1, 2, 5]s)',
          'Positive integers + sorted array unlocks early-exit break whenever candidates[i] > remain',
        ],
        mentalModel:
          'Distinguish VERTICAL reuse (child depth, i == start) from HORIZONTAL reuse (same loop frame, i > start). Picking the second 1 as a CHILD of the first 1 explores [1, 1, ...]. Picking the second 1 as a SIBLING after backtracking from the first 1 would explore a strict subset of what the first 1 already covered — skip it!',
      },
      intuitionComparison: {
        bruteForce: {
          approach:
            'Run standard 0/1 subset backtracking across all 2^n subsets without sorting, sort each valid combination, and deduplicate inside a HashSet<List<Integer>>.',
          timeComplexity: 'O(2^n · n log n)',
          spaceComplexity: 'O(2^n · n)',
          bottleneck:
            'Explores massively redundant identical subtrees when candidates has many repeated values (e.g., twenty 1s) and pays list-hashing/sorting cost on every hit.',
        },
        optimal: {
          approach:
            'Sort candidates once in O(n log n). In each DFS frame (start, remain), break immediately if candidates[i] > remain, and skip duplicate siblings via if (i > start && candidates[i] == candidates[i - 1]) continue.',
          timeComplexity: 'O(2^n · n) worst-case (heavily pruned)',
          spaceComplexity: 'O(n) recursion stack + path buffer',
          keyInvariant:
            'At every tree depth, each distinct candidate value is branched at most once, guaranteeing 100% unique combinations without auxiliary sets.',
        },
      },
      visualizer: {
        kind: 'tree-graph',
        title: 'Sorted Backtracking Tree & Sibling Deduplication Prune',
        inputSummary: 'Sorted candidates = [1, 1, 2, 5, 6], target = 8',
        viewBoxWidth: 940,
        viewBoxHeight: 410,
        nodes: [
          { id: 'root', label: '∅', x: 470, y: 46 },
          { id: 'n_1a', label: '+1', x: 210, y: 148 },
          { id: 'n_1b', label: '✗1', x: 470, y: 148 },
          { id: 'n_2', label: '+2', x: 680, y: 148 },
          { id: 'n_5', label: '+5', x: 845, y: 148 },
          { id: 'n_1_1', label: '+1', x: 115, y: 254 },
          { id: 'n_1_2', label: '+2', x: 315, y: 254 },
          { id: 'n_2_6', label: '+6', x: 680, y: 254 },
          { id: 'n_1_1_2', label: '+2', x: 80, y: 350 },
          { id: 'n_1_1_6', label: '+6', x: 230, y: 350 },
          { id: 'n_1_2_5', label: '+5', x: 420, y: 350 },
        ],
        edges: [
          { from: 'root', to: 'n_1a', weight: 'i=0' },
          { from: 'root', to: 'n_1b', weight: 'i=1 dup' },
          { from: 'root', to: 'n_2', weight: 'i=2' },
          { from: 'root', to: 'n_5', weight: 'i=3' },
          { from: 'n_1a', to: 'n_1_1', weight: 'i=1=start' },
          { from: 'n_1a', to: 'n_1_2', weight: 'i=2' },
          { from: 'n_2', to: 'n_2_6', weight: 'i=4' },
          { from: 'n_1_1', to: 'n_1_1_2', weight: 'i=2' },
          { from: 'n_1_1', to: 'n_1_1_6', weight: 'i=4' },
          { from: 'n_1_2', to: 'n_1_2_5', weight: 'i=3' },
        ],
        steps: [
          {
            caption:
              'Step 1: Sort candidates → [1, 1, 2, 5, 6] so duplicates sit adjacent and sorted early-break works. Start DFS at root(start=0, remain=8, path=[]).',
            formula: 'dfs(start=0, remain=8, path=[])',
            activeNodeId: 'root',
            visitedNodeIds: ['root'],
            nodeStates: { root: 'rem=8, s=0' },
            variables: [
              { name: 'path', value: '[]' },
              { name: 'remain', value: '8' },
              { name: 'found', value: '0' },
            ],
          },
          {
            caption:
              'Pick i=0 (+1 → rem=7), then recurse with start=1. At i=1 (val=1): because i == start (NOT i > start), vertical reuse of the second 1 IS ALLOWED! Path = [1, 1], rem = 6.',
            formula: 'i=1 == start=1 → Duplicate value ALLOWED at child depth! path=[1,1]',
            activeNodeId: 'n_1_1',
            dependencyNodeIds: ['n_1a'],
            visitedNodeIds: ['root', 'n_1a', 'n_1_1'],
            activeEdges: [
              { from: 'root', to: 'n_1a' },
              { from: 'n_1a', to: 'n_1_1' },
            ],
            nodeStates: {
              root: 'rem=8, s=0',
              n_1a: '[1] rem=7',
              n_1_1: '[1,1] rem=6',
            },
            variables: [
              { name: 'path', value: '[1, 1]', tone: 'primary' },
              { name: 'remain', value: '6' },
              { name: 'guard', value: 'i == start ✓', tone: 'emerald' },
            ],
          },
          {
            caption:
              'From [1, 1] (rem=6): i=2 (+2 → rem=4) hits cand[3]=5 > 4 → sorted early BREAK! i=3 (+5 → rem=1) breaks on 6 > 1. i=4 (+6 → rem=0) hits TARGET! Record #1: [1, 1, 6]!',
            formula: 'rem == 0 → HIT #1: [1, 1, 6]! (Notice [1,1,2] pruned via 5 > 4)',
            activeNodeId: 'n_1_1_6',
            dependencyNodeIds: ['n_1_1_2'],
            visitedNodeIds: ['root', 'n_1a', 'n_1_1', 'n_1_1_2', 'n_1_1_6'],
            highlightedNodeIds: ['n_1_1_6'],
            activeEdges: [
              { from: 'n_1_1', to: 'n_1_1_2' },
              { from: 'n_1_1', to: 'n_1_1_6' },
            ],
            nodeStates: {
              root: 'rem=8',
              n_1a: '[1] rem=7',
              n_1_1: '[1,1] rem=6',
              n_1_1_2: 'break 5>4',
              n_1_1_6: 'HIT [1,1,6]',
            },
            variables: [
              { name: 'path', value: '[1, 1, 6]', tone: 'emerald' },
              { name: 'remain', value: '0', tone: 'emerald' },
              { name: 'found', value: '1', tone: 'emerald' },
            ],
          },
          {
            caption:
              'Backtrack to [1] (rem=7, start=1) and try i=2 (+2 → [1, 2], rem=5). Recurse with start=3: i=3 (+5 → rem=0) hits TARGET! Record #2: [1, 2, 5]! Next i=4 (6 > 5) breaks immediately.',
            formula: 'path=[1,2] + cand[3](5) → rem=0 → HIT #2: [1, 2, 5]!',
            activeNodeId: 'n_1_2_5',
            dependencyNodeIds: ['n_1_2'],
            visitedNodeIds: ['root', 'n_1a', 'n_1_1', 'n_1_1_2', 'n_1_1_6', 'n_1_2', 'n_1_2_5'],
            highlightedNodeIds: ['n_1_1_6', 'n_1_2_5'],
            activeEdges: [
              { from: 'n_1a', to: 'n_1_2' },
              { from: 'n_1_2', to: 'n_1_2_5' },
            ],
            nodeStates: {
              root: 'rem=8',
              n_1a: '[1] rem=7',
              n_1_1_6: 'HIT [1,1,6]',
              n_1_2: '[1,2] rem=5',
              n_1_2_5: 'HIT [1,2,5]',
            },
            variables: [
              { name: 'path', value: '[1, 2, 5]', tone: 'emerald' },
              { name: 'remain', value: '0', tone: 'emerald' },
              { name: 'found', value: '2', tone: 'emerald' },
            ],
          },
          {
            caption:
              'CRITICAL DEDUP PRUNE! Backtrack to root (start=0, rem=8) and advance loop to i=1 (val=1). Since i (1) > start (0) AND cand[1] == cand[0], CONTINUE! Skips the entire duplicate subtree that would re-emit [1, 2, 5]!',
            formula: 'if (i > start && cand[i] == cand[i-1]) continue  →  1 > 0 && 1 == 1 → PRUNED!',
            activeNodeId: 'n_1b',
            dependencyNodeIds: ['n_1a'],
            visitedNodeIds: ['root', 'n_1a', 'n_1_1', 'n_1_1_2', 'n_1_1_6', 'n_1_2', 'n_1_2_5'],
            highlightedNodeIds: ['n_1_1_6', 'n_1_2_5'],
            activeEdges: [{ from: 'root', to: 'n_1b' }],
            nodeStates: {
              root: 'rem=8, s=0',
              n_1a: 'i=0 done',
              n_1b: 'PRUNE i>s!',
              n_1_1_6: 'HIT [1,1,6]',
              n_1_2_5: 'HIT [1,2,5]',
            },
            variables: [
              { name: 'i / start', value: '1 / 0 (i > s)', tone: 'amber' },
              { name: 'action', value: 'SKIP SIBLING', tone: 'rose' },
              { name: 'found', value: '2' },
            ],
          },
          {
            caption:
              'Advance at root to i=2 (+2 → [2], rem=6). Under [2]: i=3 (+5 → rem=1, 6>1 break), then i=4 (+6 → rem=0) hits TARGET! Record #3: [2, 6]!',
            formula: 'path=[2] + cand[4](6) → rem=0 → HIT #3: [2, 6]!',
            activeNodeId: 'n_2_6',
            dependencyNodeIds: ['n_2'],
            visitedNodeIds: ['root', 'n_1a', 'n_1_1', 'n_1_1_2', 'n_1_1_6', 'n_1_2', 'n_1_2_5', 'n_2', 'n_2_6'],
            highlightedNodeIds: ['n_1_1_6', 'n_1_2_5', 'n_2_6'],
            activeEdges: [
              { from: 'root', to: 'n_2' },
              { from: 'n_2', to: 'n_2_6' },
            ],
            nodeStates: {
              root: 'rem=8',
              n_1b: 'PRUNE i>s!',
              n_2: '[2] rem=6',
              n_2_6: 'HIT [2,6]',
              n_1_1_6: 'HIT [1,1,6]',
              n_1_2_5: 'HIT [1,2,5]',
            },
            variables: [
              { name: 'path', value: '[2, 6]', tone: 'emerald' },
              { name: 'remain', value: '0', tone: 'emerald' },
              { name: 'found', value: '3', tone: 'emerald' },
            ],
          },
          {
            caption:
              'Finally try i=3 (+5 → rem=3): next cand[4]=6 > 3 breaks immediately; i=4 (+6 → rem=2) has no elements left. Search ends cleanly with all 3 unique combinations: [[1,1,6], [1,2,5], [2,6]].',
            formula: 'Complete! Unique Combinations = [[1, 1, 6], [1, 2, 5], [2, 6]]',
            activeNodeId: 'n_5',
            visitedNodeIds: ['root', 'n_1a', 'n_1_1', 'n_1_1_2', 'n_1_1_6', 'n_1_2', 'n_1_2_5', 'n_2', 'n_2_6', 'n_5'],
            highlightedNodeIds: ['n_1_1_6', 'n_1_2_5', 'n_2_6'],
            activeEdges: [{ from: 'root', to: 'n_5' }],
            nodeStates: {
              n_1b: 'PRUNE i>s!',
              n_5: 'break 6>3',
              n_1_1_6: 'HIT [1,1,6]',
              n_1_2_5: 'HIT [1,2,5]',
              n_2_6: 'HIT [2,6]',
            },
            variables: [
              { name: 'result', value: '3 unique sets', tone: 'emerald' },
              { name: 'hashSetUsed', value: 'None (O(1) prune)', tone: 'emerald' },
            ],
          },
        ],
      },
      javaSolution: {
        filename: 'CombinationSumII.java',
        code: `import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

public class CombinationSumII {
    public List<List<Integer>> combinationSum2(int[] candidates, int target) {
        List<List<Integer>> result = new ArrayList<>();
        if (candidates == null || candidates.length == 0) {
            return result;
        }

        // Sorting groups duplicates together AND enables sorted early-break pruning
        Arrays.sort(candidates);
        backtrack(candidates, 0, target, new ArrayList<>(), result);
        return result;
    }

    private void backtrack(
            int[] candidates,
            int start,
            int remain,
            List<Integer> path,
            List<List<Integer>> result) {
        if (remain == 0) {
            result.add(new ArrayList<>(path));
            return;
        }

        for (int i = start; i < candidates.length; i++) {
            // Early exit: because array is sorted, all subsequent numbers also exceed remain
            if (candidates[i] > remain) {
                break;
            }

            // Skip horizontal duplicate siblings at the same tree depth (allow vertical child reuse when i == start)
            if (i > start && candidates[i] == candidates[i - 1]) {
                continue;
            }

            path.add(candidates[i]);
            backtrack(candidates, i + 1, remain - candidates[i], path, result);
            path.remove(path.size() - 1);
        }
    }
}`,
        callouts: [
          {
            id: 'cs2-sort',
            startLine: 12,
            endLine: 14,
            title: 'One Sort Unlocks Both Optimizations',
            explanation:
              'Arrays.sort(candidates) runs in O(n log n) once upfront — placing identical numbers adjacent for O(1) sibling dedup AND guaranteeing monotonically non-decreasing values for early break.',
            accent: 'primary',
          },
          {
            id: 'cs2-break',
            startLine: 30,
            endLine: 33,
            title: 'break vs. continue on Overshoot',
            explanation:
              'Because candidates is sorted and positive, once candidates[i] > remain, every j > i will ALSO exceed remain. Using break (not continue) prunes the rest of the loop immediately.',
            accent: 'emerald',
          },
          {
            id: 'cs2-dedup',
            startLine: 35,
            endLine: 38,
            title: 'Why i > start (and NOT i > 0)!',
            explanation:
              'Writing i > 0 would forbid picking the second 1 even inside a child frame, losing valid answers like [1, 1, 6]! Writing i > start allows duplicates across different depths while forbidding duplicate branches at the same depth.',
            accent: 'amber',
          },
        ],
      },
      complexity: {
        time: 'O(2^n · n)',
        space: 'O(n)',
        timeExplanation:
          'In the worst case (e.g., distinct numbers whose subsets hit target), there are up to 2^n subsets and copying each valid path costs O(n). Sorting adds negligible O(n log n).',
        spaceExplanation:
          'O(n) auxiliary space for recursion depth and the mutable path buffer (excluding the output list itself).',
      },
      edgeCases: [
        {
          title: 'All Identical Elements ([1, 1, 1, 1], target = 2)',
          scenario: 'Naive backtracking explores C(4, 2) = 6 duplicate paths for [1, 1].',
          handling: 'Our i > start guard explores exactly ONE [1, 1] path and skips every duplicate sibling in O(1).',
        },
        {
          title: 'Combination Sum I (LC #39) vs. II (LC #40) vs. III (LC #216)',
          scenario: 'Interviewers frequently ask you to contrast the three variants on the spot.',
          handling:
            'LC #39 (unlimited reuse, distinct inputs): pass i instead of i + 1 on recurse. LC #40 (single use, duplicate inputs): pass i + 1 AND add i > start dedup. LC #216 (fixed k digits 1..9): add path.size() == k bound.',
        },
        {
          title: 'Defensive Copy on Base Case (new ArrayList<>(path))',
          scenario: 'Adding path directly without copying leaves every entry in result empty after backtracking finishes.',
          handling: 'Always snapshot with new ArrayList<>(path) when remain == 0.',
        },
      ],
    },

    /* ================================================================
     * DSA 3: WORD BREAK
     * ================================================================ */
    {
      id: 'day7-word-break',
      dayNumber: 7,
      kind: 'dsa',
      title: 'Word Break',
      subtitle: '1D prefix-reachability DP overcoming greedy traps with max-word-length pruning',
      difficulty: 'Medium',
      patterns: ['1D Prefix DP', 'HashSet / Trie Lookup', 'Max-Length Window Pruning'],
      estimatedMinutes: 14,
      leetcodeRef: 'LC #139',
      problemStatement:
        'Given a string s and a dictionary of strings wordDict, return true if s can be segmented into a space-separated sequence of one or more dictionary words. Words in wordDict may be reused unlimited times.',
      exampleSummary: {
        input: 's = "catsanddog", wordDict = ["cat", "cats", "sand", "dog"]',
        output: 'true',
        explanation:
          'Greedy matching picks "cats" first and gets stranded on "anddog"! 1D DP preserves BOTH valid prefix cuts dp[3] ("cat") and dp[4] ("cats"), letting index 7 recover via dp[3] + "sand" and reach dp[10] via + "dog".',
      },
      patternRecognition: {
        interviewCue:
          'Whenever greedy longest-prefix or shortest-prefix string matching can trap you in a dead end (e.g., "cats" vs "cat" + "sand"), model prefix reachability with 1D DP: dp[i] = true iff s[0..i-1] is cleanly segmentable.',
        signals: [
          'Partitioning a string into valid dictionary tokens / decodings (Word Break, Decode Ways, Palindrome Partitioning II)',
          'Overlapping suffixes: multiple earlier word boundaries land on the exact same remaining suffix index',
          'Capping the inner lookback by maxWordLen turns O(n³) into O(n · L²) (or O(n · L) with a Trie)',
        ],
        mentalModel:
          'Think of indices 0..n as stepping stones across string s. Start at stone 0 (dp[0] = true). Stone i is reachable iff there exists a previously reachable stone j < i (dp[j] == true) whose bridge s[j..i) is a word in wordDict.',
      },
      intuitionComparison: {
        bruteForce: {
          approach:
            'Unmemoized backtracking trying every matching dictionary prefix from index start and recursing on the remainder.',
          timeComplexity: 'O(2^n)',
          spaceComplexity: 'O(n)',
          bottleneck:
            'On adversarial inputs like s = "aaaa...aaab", dict = ["a", "aa", "aaa"], exponentially many prefix splits converge on the same failing suffix.',
        },
        optimal: {
          approach:
            'Bottom-up boolean[] dp of length n + 1 with dp[0] = true. For each end i = 1..n, scan backward j from i - 1 down to max(0, i - maxLen) and break as soon as dp[j] && dict.contains(s.substring(j, i)).',
          timeComplexity: 'O(n · L² + W) where L = maxWordLen, W = total dict chars',
          spaceComplexity: 'O(n + W)',
          keyInvariant:
            'dp[i] == true iff prefix s[0..i) can be completely tiled by dictionary words. Checking dp[j] BEFORE calling s.substring(j, i) skips pointless String allocations.',
        },
      },
      visualizer: {
        kind: 'dp-1d-stack-heap',
        title: '1D Prefix-Reachability DP Dry Run (Greedy Trap Fallback)',
        inputSummary: 's = "catsanddog" (n=10), wordDict = ["cat", "cats", "sand", "dog"]',
        steps: [
          {
            caption:
              'Initialize dp[0] = T (empty prefix "" is trivially segmentable) and dp[1..10] = F. Precompute dict HashSet and maxWordLen = 4.',
            recurrence: 'dp[i] = ∃ j ∈ [max(0, i-L), i-1] : dp[j] == T && s[j..i) ∈ dict',
            concreteFormula: 'Base: dp[0] = T, maxWordLen = 4',
            inputItems: {
              label: 'Characters s[0..9]',
              values: ['c', 'a', 't', 's', 'a', 'n', 'd', 'd', 'o', 'g'],
            },
            primaryArray: {
              label: 'dp[0..10] — Is prefix s[0..i) segmentable?',
              values: ['T', 'F', 'F', 'F', 'F', 'F', 'F', 'F', 'F', 'F', 'F'],
              activeIndex: 0,
            },
            secondaryContainer: {
              kind: 'list',
              title: 'wordDict Set (maxWordLen = 4)',
              items: [{ value: '"cat"' }, { value: '"cats"' }, { value: '"sand"' }, { value: '"dog"' }],
            },
            variables: [
              { name: 'i', value: '0' },
              { name: 'maxLen', value: '4' },
            ],
          },
          {
            caption:
              'i = 1 ("c") and i = 2 ("ca") have no valid dictionary split → F. At i = 3 ("cat"): j = 0 has dp[0] == T AND s[0..3] = "cat" ∈ dict → dp[3] = T!',
            recurrence: 'dp[3] ← dp[0] && ("cat" ∈ dict)',
            concreteFormula: 'j = 0: dp[0]=T && s[0..3]="cat" ∈ dict  →  dp[3] = T ✓',
            inputItems: {
              label: 'Characters s[0..9]',
              values: ['c', 'a', 't', 's', 'a', 'n', 'd', 'd', 'o', 'g'],
              activeIndex: 2,
              processedUntil: 3,
            },
            primaryArray: {
              label: 'dp[0..10] — Is prefix s[0..i) segmentable?',
              values: ['T', 'F', 'F', 'T', 'F', 'F', 'F', 'F', 'F', 'F', 'F'],
              activeIndex: 3,
              dependencyIndices: [{ index: 0, label: '"cat"' }],
              pointers: [
                { label: 'j=0', index: 0, tone: 'amber' },
                { label: 'i=3', index: 3, tone: 'emerald' },
              ],
            },
            secondaryContainer: {
              kind: 'list',
              title: 'wordDict Set (maxWordLen = 4)',
              items: [
                { value: '"cat"', meta: 'MATCH', highlight: true },
                { value: '"cats"' },
                { value: '"sand"' },
                { value: '"dog"' },
              ],
            },
            variables: [
              { name: 's[j..i)', value: '"cat"', tone: 'emerald' },
              { name: 'dp[3]', value: 'true', tone: 'emerald' },
            ],
          },
          {
            caption:
              'i = 4 ("cats"): j = 0 has dp[0] == T AND s[0..4] = "cats" ∈ dict → dp[4] = T! Notice DP keeps BOTH dp[3]=T ("cat") AND dp[4]=T ("cats") alive simultaneously.',
            recurrence: 'dp[4] ← dp[0] && ("cats" ∈ dict)',
            concreteFormula: 'j = 0: dp[0]=T && s[0..4]="cats" ∈ dict  →  dp[4] = T ✓',
            inputItems: {
              label: 'Characters s[0..9]',
              values: ['c', 'a', 't', 's', 'a', 'n', 'd', 'd', 'o', 'g'],
              activeIndex: 3,
              processedUntil: 4,
            },
            primaryArray: {
              label: 'dp[0..10] — Is prefix s[0..i) segmentable?',
              values: ['T', 'F', 'F', 'T', 'T', 'F', 'F', 'F', 'F', 'F', 'F'],
              activeIndex: 4,
              dependencyIndices: [{ index: 0, label: '"cats"' }],
              pointers: [
                { label: 'j=0', index: 0, tone: 'amber' },
                { label: 'i=4', index: 4, tone: 'emerald' },
              ],
            },
            secondaryContainer: {
              kind: 'list',
              title: 'wordDict Set (maxWordLen = 4)',
              items: [
                { value: '"cat"' },
                { value: '"cats"', meta: 'MATCH', highlight: true },
                { value: '"sand"' },
                { value: '"dog"' },
              ],
            },
            variables: [
              { name: 's[j..i)', value: '"cats"', tone: 'emerald' },
              { name: 'trueCuts', value: '{0, 3, 4}', tone: 'primary' },
            ],
          },
          {
            caption:
              'i = 5 ("catsa") & i = 6 ("catsan"): checking true stones j ∈ {3, 4} yields "sa", "a", "san", "an" — none in dict → dp[5] = F, dp[6] = F.',
            recurrence: 'Skip all j where dp[j] == F (zero wasted substring copies!)',
            concreteFormula: 'i=6: j=4("an") ✗, j=3("san") ✗ → dp[5]=F, dp[6]=F',
            inputItems: {
              label: 'Characters s[0..9]',
              values: ['c', 'a', 't', 's', 'a', 'n', 'd', 'd', 'o', 'g'],
              activeIndex: 5,
              processedUntil: 6,
            },
            primaryArray: {
              label: 'dp[0..10] — Is prefix s[0..i) segmentable?',
              values: ['T', 'F', 'F', 'T', 'T', 'F', 'F', 'F', 'F', 'F', 'F'],
              activeIndex: 6,
              dependencyIndices: [
                { index: 3, label: '"san"✗' },
                { index: 4, label: '"an"✗' },
              ],
              pointers: [{ label: 'i=6', index: 6, tone: 'rose' }],
            },
            secondaryContainer: {
              kind: 'list',
              title: 'wordDict Set (maxWordLen = 4)',
              items: [{ value: '"cat"' }, { value: '"cats"' }, { value: '"sand"' }, { value: '"dog"' }],
            },
            variables: [
              { name: 'checked', value: 'j=4, j=3' },
              { name: 'dp[6]', value: 'false', tone: 'rose' },
            ],
          },
          {
            caption:
              'GREEDY FALLBACK AT i = 7 ("catsand")! First check j = 4 (greedy "cats" cut): s[4..7] = "and" ∉ dict (DEAD END!). Fallback to j = 3 (dp[3]=T): s[3..7] = "sand" ∈ dict → dp[7] = T!',
            recurrence: 'j=4 ("and") fails → Fallback to j=3: dp[3] && ("sand" ∈ dict)',
            concreteFormula: 'j=4: "and" ✗  |  j=3: dp[3]=T && s[3..7]="sand" ∈ dict → dp[7] = T!',
            inputItems: {
              label: 'Characters s[0..9]',
              values: ['c', 'a', 't', 's', 'a', 'n', 'd', 'd', 'o', 'g'],
              activeIndex: 6,
              processedUntil: 7,
            },
            primaryArray: {
              label: 'dp[0..10] — Is prefix s[0..i) segmentable?',
              values: ['T', 'F', 'F', 'T', 'T', 'F', 'F', 'T', 'F', 'F', 'F'],
              activeIndex: 7,
              dependencyIndices: [
                { index: 4, label: '"and"✗' },
                { index: 3, label: '"sand"✓' },
              ],
              pointers: [
                { label: 'j=3 ✓', index: 3, tone: 'emerald' },
                { label: 'i=7', index: 7, tone: 'emerald' },
              ],
            },
            secondaryContainer: {
              kind: 'list',
              title: 'wordDict Set (maxWordLen = 4)',
              items: [
                { value: '"cat"' },
                { value: '"cats"' },
                { value: '"sand"', meta: 'FALLBACK MATCH', highlight: true },
                { value: '"dog"' },
              ],
            },
            variables: [
              { name: 'greedy j=4', value: '"and" ✗', tone: 'rose' },
              { name: 'dp fallback', value: 'j=3 "sand" ✓', tone: 'emerald' },
              { name: 'dp[7]', value: 'true', tone: 'emerald' },
            ],
          },
          {
            caption:
              'i = 8 ("d") and i = 9 ("do") stay F. At final i = 10 ("catsanddog"): lookback window [6..9] checks j = 7 (dp[7] == T) → s[7..10] = "dog" ∈ dict! dp[10] = T → Return true!',
            recurrence: 'dp[10] ← dp[7] && ("dog" ∈ dict)  |  Path: "cat" + "sand" + "dog"',
            concreteFormula: 'j = 7: dp[7]=T && s[7..10]="dog" ∈ dict  →  dp[10] = true!',
            inputItems: {
              label: 'Characters s[0..9]',
              values: ['c', 'a', 't', 's', 'a', 'n', 'd', 'd', 'o', 'g'],
              activeIndex: 9,
              processedUntil: 10,
            },
            primaryArray: {
              label: 'dp[0..10] — Is prefix s[0..i) segmentable?',
              values: ['T', 'F', 'F', 'T', 'T', 'F', 'F', 'T', 'F', 'F', 'T'],
              activeIndex: 10,
              dependencyIndices: [{ index: 7, label: '"dog"✓' }],
              pointers: [
                { label: 'j=7', index: 7, tone: 'amber' },
                { label: 'ANS=T', index: 10, tone: 'emerald' },
              ],
            },
            secondaryContainer: {
              kind: 'list',
              title: 'wordDict Set (maxWordLen = 4)',
              items: [
                { value: '"cat"', meta: '0..3', highlight: true },
                { value: '"cats"' },
                { value: '"sand"', meta: '3..7', highlight: true },
                { value: '"dog"', meta: '7..10', highlight: true },
              ],
            },
            variables: [
              { name: 'split', value: '"cat" + "sand" + "dog"', tone: 'emerald' },
              { name: 'dp[10]', value: 'true', tone: 'emerald' },
            ],
          },
        ],
      },
      javaSolution: {
        filename: 'WordBreak.java',
        code: `import java.util.HashSet;
import java.util.List;
import java.util.Set;

public class WordBreak {
    public boolean wordBreak(String s, List<String> wordDict) {
        if (s == null || s.isEmpty()) {
            return true;
        }

        Set<String> dict = new HashSet<>(wordDict.size() * 2);
        int maxWordLen = 0;
        for (String word : wordDict) {
            dict.add(word);
            maxWordLen = Math.max(maxWordLen, word.length());
        }

        int n = s.length();
        // dp[i] = true iff prefix s[0..i) can be segmented into dictionary words
        boolean[] dp = new boolean[n + 1];
        dp[0] = true;

        for (int i = 1; i <= n; i++) {
            int minStart = Math.max(0, i - maxWordLen);
            for (int j = i - 1; j >= minStart; j--) {
                // Guard dp[j] BEFORE calling substring() to avoid pointless allocations
                if (dp[j] && dict.contains(s.substring(j, i))) {
                    dp[i] = true;
                    break;
                }
            }
        }

        return dp[n];
    }
}`,
        callouts: [
          {
            id: 'wb-maxlen',
            startLine: 11,
            endLine: 16,
            title: 'Track maxWordLen to Cap Inner Loop',
            explanation:
              'Without maxWordLen, the inner loop scans all j ∈ [0..i-1], giving O(n³) time when substring copying is counted. Capping lookback at L = maxWordLen drops runtime to O(n · L²) — massive speedup when n = 10,000 and L ≤ 20.',
            accent: 'primary',
          },
          {
            id: 'wb-guard-order',
            startLine: 25,
            endLine: 30,
            title: 'Short-Circuit dp[j] Before s.substring(j, i)',
            explanation:
              'In Java 7+, String.substring() copies a fresh char[]/byte[] array (O(L) allocation + hashing). Checking boolean dp[j] first skips allocating substrings for every unreachable split point, and breaking immediately stops redundant checks.',
            accent: 'emerald',
          },
        ],
      },
      complexity: {
        time: 'O(n · L² + W)',
        space: 'O(n + W)',
        timeExplanation:
          'n outer steps × at most L = maxWordLen inner iterations × O(L) substring extraction & hashing, plus O(W) to build the HashSet from total dictionary characters W. Replacing HashSet with a Trie eliminates substring creation and cuts time to O(n · L + W)!',
        spaceExplanation: 'O(n) for boolean[] dp plus O(W) for the dictionary HashSet.',
      },
      edgeCases: [
        {
          title: 'Trie + Forward DP Upgrade (Eliminating Substring Allocations)',
          scenario: 'Senior follow-up: "Can you eliminate s.substring() allocations completely?"',
          handling:
            'Build a Trie from wordDict. Whenever dp[i] is true, walk the Trie forward starting at s[i], setting dp[k + 1] = true every time a Trie node has isWord == true. Cuts time strictly to O(n · L + W) with ZERO temporary String allocations!',
        },
        {
          title: 'Word Break II Follow-Up (LC #140 — Return All Sentences)',
          scenario: 'What if the interviewer asks for ALL valid space-separated segmentations?',
          handling:
            'First run this exact boolean DP (or backward reachability array) to prune dead suffixes, then run memoized DFS collecting List<String> only along proven reachable transitions.',
        },
        {
          title: 'Dictionary Contains Words Longer Than s or Empty Dictionary',
          scenario: 'wordDict = ["superlongword"], s = "abc" or wordDict = [].',
          handling: 'Math.max(0, i - maxWordLen) safely clamps minStart to 0; empty dict leaves maxWordLen = 0 so inner loop never runs and returns false.',
        },
      ],
    },

    /* ================================================================
     * DSA 4: BURST BALLOONS
     * ================================================================ */
    {
      id: 'day7-burst-balloons',
      dayNumber: 7,
      kind: 'dsa',
      title: 'Burst Balloons',
      subtitle: 'Reverse-thinking 2D Interval DP where choosing the LAST balloon decouples subproblems',
      difficulty: 'Hard',
      patterns: ['2D Interval DP', 'Reverse Thinking Invariant', 'Sentinel Boundary Padding'],
      estimatedMinutes: 18,
      leetcodeRef: 'LC #312',
      problemStatement:
        'Given n balloons indexed 0..n-1 with coin values nums[i], bursting balloon i awards nums[left] × nums[i] × nums[right] coins where left and right are its CURRENT adjacent unburst neighbors (virtual 1s outside array bounds). Return the maximum coins you can collect by bursting all balloons.',
      exampleSummary: {
        input: 'nums = [3, 1, 5, 8]  →  padded arr = [1, 3, 1, 5, 8, 1]',
        output: '167',
        explanation:
          'Optimal burst sequence: burst 1 (+3×1×5=15) → burst 5 (+3×5×8=120) → burst 3 (+1×3×8=24) → burst 8 (+1×8×1=8) = 167 coins.',
      },
      patternRecognition: {
        interviewCue:
          'When bursting/removing an element FIRST makes the remaining left and right subarrays collide and become interdependent, REVERSE YOUR PERSPECTIVE: pick which element k is acted upon LAST! Then left (l, k) and right (k, r) stay completely walled off by k until the very end.',
        signals: [
          'Removing an element causes its left and right neighbors to become newly adjacent (Burst Balloons, Minimum Cost to Merge Stones, Matrix Chain Multiplication)',
          'Subarray state depends on fixed outside boundary elements → pad array with sentinel 1s at index 0 and n + 1',
          'Constraint n ≤ 300 strongly hints at O(n³) Interval DP filled by increasing interval gap (len = r - l)',
        ],
        mentalModel:
          'Pad arr = [1, ...nums, 1]. Define dp[l][r] = max coins from bursting ALL balloons strictly inside open interval (l, r) while arr[l] and arr[r] remain intact. If balloon k ∈ (l, r) bursts LAST, every balloon in (l, k) and (k, r) is already gone, so k’s exact neighbors are guaranteed to be arr[l] and arr[r]!',
      },
      intuitionComparison: {
        bruteForce: {
          approach:
            'Backtrack by choosing which balloon to burst FIRST at each step, shrinking the array and recursing over all n! permutations.',
          timeComplexity: 'O(n!)',
          spaceComplexity: 'O(n)',
          bottleneck:
            'Forward subproblems cannot be memoized cleanly by (l, r) because bursting k first stitches indices k - 1 and k + 1 together, breaking subproblem independence.',
        },
        optimal: {
          approach:
            'Pad with sentinel 1s at both ends. Fill 2D Interval DP dp[l][r] in increasing gap order len = r - l from 2 to n + 1, trying every split k ∈ (l, r) as the LAST balloon burst.',
          timeComplexity: 'O(n³)',
          spaceComplexity: 'O(n²)',
          keyInvariant:
            'Because k is burst LAST inside (l, r), subproblems dp[l][k] and dp[k][r] are 100% independent and k’s final burst yields exact product arr[l] × arr[k] × arr[r].',
        },
      },
      visualizer: {
        kind: 'dp-table-2d',
        title: '2D Interval DP Diagonal-by-Diagonal Dry Run',
        inputSummary: 'Padded arr = [1, 3, 1, 5, 8, 1] · dp[l][r] = max coins strictly inside (l, r)',
        rowAxisLabel: 'Left l',
        colAxisLabel: 'Right r',
        rowHeaders: ['1 (0)', '3 (1)', '1 (2)', '5 (3)', '8 (4)', '1 (5)'],
        colHeaders: ['1 (0)', '3 (1)', '1 (2)', '5 (3)', '8 (4)', '1 (5)'],
        steps: [
          {
            caption:
              'Pad nums=[3,1,5,8] with virtual boundaries → arr = [1, 3, 1, 5, 8, 1]. Base diagonal (gap = r - l = 1) has ZERO balloons strictly between l and l + 1, so dp[l][l+1] = 0.',
            recurrence: 'dp[l][r] = max_{l < k < r} (dp[l][k] + arr[l]·arr[k]·arr[r] + dp[k][r])',
            concreteFormula: 'Base gap = 1: dp[0][1] = dp[1][2] = dp[2][3] = dp[3][4] = dp[4][5] = 0',
            grid: [
              [null, 0, null, null, null, null],
              [null, null, 0, null, null, null],
              [null, null, null, 0, null, null],
              [null, null, null, null, 0, null],
              [null, null, null, null, null, 0],
              [null, null, null, null, null, null],
            ],
            activeCell: { row: 0, col: 1 },
            variables: [
              { name: 'gap (r-l)', value: '1 (empty)' },
              { name: 'padded arr', value: '[1, 3, 1, 5, 8, 1]' },
            ],
          },
          {
            caption:
              'Gap = 2 (single balloon k inside (l, l+2)): dp[0][2]=1·3·1=3, dp[1][3]=3·1·5=15, dp[2][4]=1·5·8=40, dp[3][5]=5·8·1=40. Highlighting dp[1][3] where balloon 1 bursts between boundaries 3 and 5.',
            recurrence: 'Single balloon k = l + 1: dp[l][l+2] = arr[l] · arr[l+1] · arr[l+2]',
            concreteFormula: 'dp[1][3] (k=2, val 1) = 0 + 3×1×5 + 0 = 15',
            grid: [
              [null, 0, 3, null, null, null],
              [null, null, 0, 15, null, null],
              [null, null, null, 0, 40, null],
              [null, null, null, null, 0, 40],
              [null, null, null, null, null, 0],
              [null, null, null, null, null, null],
            ],
            activeCell: { row: 1, col: 3 },
            dependencyCells: [
              { row: 1, col: 2, label: 'L=0', tone: 'amber' },
              { row: 2, col: 3, label: 'R=0', tone: 'amber' },
            ],
            variables: [
              { name: 'gap (r-l)', value: '2 (1 balloon)' },
              { name: 'dp[1][3]', value: '15 (3×1×5)', tone: 'emerald' },
            ],
          },
          {
            caption:
              'Gap = 3 (2 balloons): compute dp[0][3] = max(k=1: 0+1·3·5+15=30, k=2: 3+1·1·5+0=8) = 30. Now evaluate dp[1][4] (balloons 1, 5 between 3 & 8): k=2 gives 0+24+40=64, k=3 (5 last!) gives 15 + 3·5·8 + 0 = 135!',
            recurrence: 'dp[1][4] = max(k=2: 0+3·1·8+40,  k=3: 15+3·5·8+0)',
            concreteFormula: 'dp[1][4] = dp[1][3](15) + 3×5×8(120) + dp[3][4](0) = 135!',
            grid: [
              [null, 0, 3, 30, null, null],
              [null, null, 0, 15, 135, null],
              [null, null, null, 0, 40, 48],
              [null, null, null, null, 0, 40],
              [null, null, null, null, null, 0],
              [null, null, null, null, null, null],
            ],
            activeCell: { row: 1, col: 4 },
            dependencyCells: [
              { row: 1, col: 3, label: 'L=15', tone: 'emerald' },
              { row: 3, col: 4, label: 'R=0', tone: 'amber' },
            ],
            variables: [
              { name: 'gap (r-l)', value: '3 (2 balloons)' },
              { name: 'best k', value: 'k=3 (val 5 last)', tone: 'primary' },
              { name: 'dp[1][4]', value: '135', tone: 'emerald' },
            ],
          },
          {
            caption:
              'Gap = 4 (3 balloons): compute dp[0][4] (balloons 3, 1, 5 between boundaries 1 & 8). Try k=1 (val 3 last): dp[0][1](0) + 1·3·8(24) + dp[1][4](135) = 159! Beats k=2 (51) and k=3 (70).',
            recurrence: 'dp[0][4] = max(k=1: 159, k=2: 51, k=3: 70)',
            concreteFormula: 'dp[0][4] (k=1, val 3 last) = 0 + 1×3×8(24) + 135 = 159!',
            grid: [
              [null, 0, 3, 30, 159, null],
              [null, null, 0, 15, 135, null],
              [null, null, null, 0, 40, 48],
              [null, null, null, null, 0, 40],
              [null, null, null, null, null, 0],
              [null, null, null, null, null, null],
            ],
            activeCell: { row: 0, col: 4 },
            dependencyCells: [
              { row: 0, col: 1, label: 'L=0', tone: 'amber' },
              { row: 1, col: 4, label: 'R=135', tone: 'emerald' },
            ],
            variables: [
              { name: 'gap (r-l)', value: '4 (3 balloons)' },
              { name: 'best k', value: 'k=1 (val 3 last)', tone: 'primary' },
              { name: 'dp[0][4]', value: '159', tone: 'emerald' },
            ],
          },
          {
            caption:
              'Complete Gap = 4 with dp[1][5] (balloons 1, 5, 8 between 3 & 1): k=2 gives 51, k=3 gives 70, and k=4 (val 8 last) gives dp[1][4](135) + 3·8·1(24) + dp[4][5](0) = 159!',
            recurrence: 'dp[1][5] = max(k=2: 51, k=3: 70, k=4: 159)',
            concreteFormula: 'dp[1][5] (k=4, val 8 last) = 135 + 3×8×1(24) + 0 = 159!',
            grid: [
              [null, 0, 3, 30, 159, null],
              [null, null, 0, 15, 135, 159],
              [null, null, null, 0, 40, 48],
              [null, null, null, null, 0, 40],
              [null, null, null, null, null, 0],
              [null, null, null, null, null, null],
            ],
            activeCell: { row: 1, col: 5 },
            dependencyCells: [
              { row: 1, col: 4, label: 'L=135', tone: 'emerald' },
              { row: 4, col: 5, label: 'R=0', tone: 'amber' },
            ],
            variables: [
              { name: 'gap (r-l)', value: '4 (3 balloons)' },
              { name: 'best k', value: 'k=4 (val 8 last)', tone: 'primary' },
              { name: 'dp[1][5]', value: '159', tone: 'emerald' },
            ],
          },
          {
            caption:
              'Final Gap = 5: evaluate dp[0][5] across all k ∈ {1, 2, 3, 4}: k=1→162, k=2→52, k=3→75, k=4 (val 8 LAST!) → dp[0][4](159) + 1·8·1(8) + dp[4][5](0) = 167! Optimal answer = 167!',
            recurrence: 'dp[0][5] = max(k=1: 162, k=2: 52, k=3: 75, k=4: 167)',
            concreteFormula: 'dp[0][5] (k=4, val 8 last) = 159 + 1×8×1(8) + 0 = 167!',
            grid: [
              [null, 0, 3, 30, 159, 167],
              [null, null, 0, 15, 135, 159],
              [null, null, null, 0, 40, 48],
              [null, null, null, null, 0, 40],
              [null, null, null, null, null, 0],
              [null, null, null, null, null, null],
            ],
            activeCell: { row: 0, col: 5 },
            dependencyCells: [
              { row: 0, col: 4, label: 'L=159', tone: 'emerald' },
              { row: 4, col: 5, label: 'R=0', tone: 'amber' },
            ],
            variables: [
              { name: 'k=1..4', value: '162, 52, 75, 167' },
              { name: 'winner', value: 'k=4 (val 8 last)', tone: 'emerald' },
              { name: 'dp[0][5]', value: '167', tone: 'emerald' },
            ],
          },
          {
            caption:
              'Optimal Decomposition Chain highlighted in emerald: dp[1][3](15: burst 1) → dp[1][4](135: burst 5) → dp[0][4](159: burst 3) → dp[0][5](167: burst 8 last). Total = 15 + 120 + 24 + 8 = 167!',
            recurrence: 'Optimal Burst Order: 1 (15) → 5 (120) → 3 (24) → 8 (8)',
            concreteFormula: 'Answer = dp[0][5] = 167 coins',
            grid: [
              [null, 0, 3, 30, 159, 167],
              [null, null, 0, 15, 135, 159],
              [null, null, null, 0, 40, 48],
              [null, null, null, null, 0, 40],
              [null, null, null, null, null, 0],
              [null, null, null, null, null, null],
            ],
            pathCells: [
              { row: 1, col: 3 },
              { row: 1, col: 4 },
              { row: 0, col: 4 },
              { row: 0, col: 5 },
            ],
            variables: [
              { name: 'burstOrder', value: '1 → 5 → 3 → 8', tone: 'emerald' },
              { name: 'maxCoins', value: '167', tone: 'emerald' },
            ],
          },
        ],
      },
      javaSolution: {
        filename: 'BurstBalloons.java',
        code: `public class BurstBalloons {
    public int maxCoins(int[] nums) {
        int n = nums.length;
        // Pad with virtual sentinel 1s at index 0 and n + 1 so boundaries are always valid
        int[] arr = new int[n + 2];
        arr[0] = 1;
        arr[n + 1] = 1;
        System.arraycopy(nums, 0, arr, 1, n);

        int m = arr.length; // n + 2
        // dp[left][right] = max coins from bursting all balloons strictly inside (left, right)
        int[][] dp = new int[m][m];

        // Fill strictly by increasing open-interval gap: len = right - left
        for (int len = 2; len < m; len++) {
            for (int left = 0; left + len < m; left++) {
                int right = left + len;
                int boundaryProduct = arr[left] * arr[right];
                int best = 0;

                // Try every k in (left, right) as the LAST balloon burst in this open interval
                for (int k = left + 1; k < right; k++) {
                    int coins = dp[left][k] + boundaryProduct * arr[k] + dp[k][right];
                    if (coins > best) {
                        best = coins;
                    }
                }
                dp[left][right] = best;
            }
        }

        return dp[0][m - 1];
    }
}`,
        callouts: [
          {
            id: 'bb-sentinel',
            startLine: 5,
            endLine: 8,
            title: 'Sentinel 1-Padding Eliminates Every Edge Branch',
            explanation:
              'Wrapping nums with arr[0] = 1 and arr[n + 1] = 1 turns the whole problem into a single uniform open interval (0, n + 1) with zero boundary if-checks inside the O(n³) inner loop.',
            accent: 'primary',
          },
          {
            id: 'bb-loop-order',
            startLine: 14,
            endLine: 19,
            title: 'Why Loop by Gap Length (and Hoist arr[left] * arr[right])',
            explanation:
              'dp[left][right] depends on strictly narrower intervals dp[left][k] and dp[k][right] (both have gap < len). Iterating len from 2..n+1 guarantees all dependencies are already computed, and hoisting boundaryProduct cuts multiplications inside the hot loop.',
            accent: 'amber',
          },
          {
            id: 'bb-last-k',
            startLine: 21,
            endLine: 28,
            title: 'The Reverse-Thinking Recurrence',
            explanation:
              'Because k bursts LAST inside (left, right), its left and right sub-intervals never interact across k, and when k finally pops, its only remaining neighbors are guaranteed to be arr[left] and arr[right].',
            accent: 'emerald',
          },
        ],
      },
      complexity: {
        time: 'O(n³)',
        space: 'O(n²)',
        timeExplanation:
          'There are O(n²) intervals (left, right), and each interval iterates over up to O(n) last-burst candidates k, yielding Σ len·(n - len) ≈ n³/6 operations.',
        spaceExplanation: 'The 2D DP table dp[n + 2][n + 2] occupies O(n²) memory (only the upper triangle left < right is used).',
      },
      edgeCases: [
        {
          title: 'Zero-Value Balloons (nums = [3, 0, 5])',
          scenario: 'Zero balloons can be burst immediately for 0 coins without hurting neighbors.',
          handling: 'Mention as a senior pre-processing optimization: filtering out all 0s from nums before padding preserves the exact answer while shrinking n³ significantly on sparse arrays!',
        },
        {
          title: 'Single Balloon (nums = [7])',
          scenario: 'Padded arr = [1, 7, 1], m = 3, len = 2.',
          handling: 'Evaluates dp[0][2] with k = 1 → 0 + 1×7×1 + 0 = 7 cleanly.',
        },
        {
          title: 'Family of Twin Interval-DP Problems',
          scenario: 'Interviewers love recognizing the same skeleton across disguises.',
          handling:
            'Matrix Chain Multiplication, Minimum Score Triangulation of Polygon (LC #1039), Minimum Cost to Cut a Stick (LC #1547), and Strange Printer (LC #664) share this exact len-outer, (left, right, k) Interval DP template!',
        },
      ],
    },

    /* ================================================================
     * DSA 5: DESIGN IN-MEMORY FILE SYSTEM
     * ================================================================ */
    {
      id: 'day7-in-memory-file-system',
      dayNumber: 7,
      kind: 'dsa',
      title: 'Design In-Memory File System',
      subtitle: 'Directory/File Trie backed by sorted TreeMap children for O(1)-sorted ls traversal',
      difficulty: 'Hard',
      patterns: ['Trie (N-ary Tree)', 'TreeMap Sorted Children', 'Composite Node Design'],
      estimatedMinutes: 15,
      leetcodeRef: 'LC #588',
      problemStatement:
        'Design an in-memory file system supporting four operations: ls(path) returning sorted directory entries (or [fileName] if path points to a file), mkdir(path) creating intermediate directories recursively, addContentToFile(filePath, content) creating or appending to a file, and readContentFromFile(filePath).',
      exampleSummary: {
        input: 'mkdir("/a/b/c") → addContentToFile("/a/b/c/d", "hello") → addContentToFile("/a/b/app", "v1") → ls("/a/b") → readContentFromFile("/a/b/c/d")',
        output: 'ls("/a/b") = ["app", "c"] · read("/a/b/c/d") = "hello"',
        explanation:
          'Each directory node stores children in a TreeMap<String, FsNode> so insertion keeps names lexicographically ordered, letting ls() return an already-sorted list in O(C) without per-call sorting.',
      },
      patternRecognition: {
        interviewCue:
          'Whenever an interview combines hierarchical slash-delimited paths ("/a/b/c") with lexicographically sorted listings (ls), model the hierarchy as a Path Trie where each node holds a TreeMap<String, FsNode> and a file flag + StringBuilder buffer.',
        signals: [
          'Hierarchical paths parsed by "/" delimiter with prefix sharing (like a Trie on path segments instead of characters)',
          'ls() requires lexicographical sorting → TreeMap keeps children sorted on write vs. HashMap sorting on every read',
          'Unified FsNode (Composite pattern) cleanly handles both directories and files in a single traverse() helper',
        ],
        mentalModel:
          'Root node represents "/". Every operation splits the path into segments and calls one shared helper navigate(path, createMissing). If the target FsNode is a file, ls returns [basename]; if a directory, ls returns new ArrayList<>(node.children.keySet()) — already sorted by TreeMap!',
      },
      intuitionComparison: {
        bruteForce: {
          approach:
            'Store a flat HashMap<String, String> mapping full path strings to contents, scanning every key with startsWith(path) and sorting on every ls() call.',
          timeComplexity: 'O(N · L + C log C) per ls()',
          spaceComplexity: 'O(N · L) duplicated path prefixes',
          bottleneck:
            'Scans the ENTIRE filesystem on every ls() and duplicates shared directory prefixes like "/var/log/app/..." across millions of keys.',
        },
        optimal: {
          approach:
            'N-ary Path Trie where each FsNode stores TreeMap<String, FsNode> children, boolean isFile, and StringBuilder content. All four APIs share O(depth · log C) path traversal.',
          timeComplexity: 'mkdir/add/read: O(P + D log C) · ls: O(P + D log C + C)',
          spaceComplexity: 'O(total distinct path segments + total file bytes)',
          keyInvariant:
            'TreeMap maintains sorted key order incrementally on write, and StringBuilder supports amortized O(1) appends on addContentToFile instead of O(M²) String concatenation.',
        },
      },
      visualizer: {
        kind: 'tree-graph',
        title: 'In-Memory File System Trie & TreeMap Trace',
        inputSummary: 'mkdir("/a/b/c") → addContent("/a/b/c/d","hello") → addContent("/a/b/app","v1") → ls("/a/b") → read("/a/b/c/d")',
        viewBoxWidth: 860,
        viewBoxHeight: 300,
        nodes: [
          { id: 'root', label: '/', x: 82, y: 140 },
          { id: 'a', label: 'a', x: 256, y: 140 },
          { id: 'b', label: 'b', x: 430, y: 140 },
          { id: 'app', label: 'app', x: 604, y: 68 },
          { id: 'c', label: 'c', x: 604, y: 212 },
          { id: 'd', label: 'd', x: 774, y: 212 },
        ],
        edges: [
          { from: 'root', to: 'a', weight: 'a' },
          { from: 'a', to: 'b', weight: 'b' },
          { from: 'b', to: 'app', weight: 'app' },
          { from: 'b', to: 'c', weight: 'c' },
          { from: 'c', to: 'd', weight: 'd' },
        ],
        steps: [
          {
            caption:
              'Initialize FileSystem with an empty root directory node "/" (isFile = false, children = new TreeMap<>()). Calling ls("/") returns [].',
            formula: 'Init: root = FsNode(isFile=false, children=TreeMap{})',
            activeNodeId: 'root',
            visitedNodeIds: ['root'],
            nodeStates: { root: 'dir {}' },
            variables: [
              { name: 'op', value: 'new FileSystem()' },
              { name: 'ls("/")', value: '[]' },
            ],
          },
          {
            caption:
              'mkdir("/a/b/c"): split into ["a", "b", "c"] (skipping index 0 empty split). Walk from root creating missing directory nodes a → b → c via TreeMap.computeIfAbsent().',
            formula: 'mkdir("/a/b/c")  →  root.children["a"] → a["b"] → b["c"]',
            activeNodeId: 'c',
            dependencyNodeIds: ['a', 'b'],
            visitedNodeIds: ['root', 'a', 'b', 'c'],
            activeEdges: [
              { from: 'root', to: 'a' },
              { from: 'a', to: 'b' },
              { from: 'b', to: 'c' },
            ],
            nodeStates: {
              root: 'dir [a]',
              a: 'dir [b]',
              b: 'dir [c]',
              c: 'dir {}',
            },
            variables: [
              { name: 'op', value: 'mkdir("/a/b/c")', tone: 'primary' },
              { name: 'created', value: 'a, b, c (dirs)', tone: 'emerald' },
            ],
          },
          {
            caption:
              'addContentToFile("/a/b/c/d", "hello"): navigate / → a → b → c, create leaf "d", flip d.isFile = true, and append "hello" to its StringBuilder content buffer.',
            formula: 'addContent("/a/b/c/d", "hello")  →  d.isFile=true, d.buf="hello"',
            activeNodeId: 'd',
            dependencyNodeIds: ['c'],
            visitedNodeIds: ['root', 'a', 'b', 'c', 'd'],
            activeEdges: [
              { from: 'root', to: 'a' },
              { from: 'a', to: 'b' },
              { from: 'b', to: 'c' },
              { from: 'c', to: 'd' },
            ],
            nodeStates: {
              root: 'dir [a]',
              a: 'dir [b]',
              b: 'dir [c]',
              c: 'dir [d]',
              d: 'file "hello"',
            },
            variables: [
              { name: 'op', value: 'addContent("/a/b/c/d")', tone: 'primary' },
              { name: 'd.content', value: '"hello"', tone: 'emerald' },
            ],
          },
          {
            caption:
              'addContentToFile("/a/b/app", "v1"): insert file "app" under /a/b. Because b.children is a TreeMap, "app" is automatically ordered BEFORE "c" in O(log k) — no sorting needed at ls() time!',
            formula: 'b.children (TreeMap) auto-orders: ["app", "c"]',
            activeNodeId: 'app',
            dependencyNodeIds: ['b'],
            visitedNodeIds: ['root', 'a', 'b', 'c', 'd', 'app'],
            activeEdges: [
              { from: 'root', to: 'a' },
              { from: 'a', to: 'b' },
              { from: 'b', to: 'app' },
            ],
            nodeStates: {
              root: 'dir [a]',
              a: 'dir [b]',
              b: 'TreeMap[app,c]',
              app: 'file "v1"',
              c: 'dir [d]',
              d: 'file "hello"',
            },
            variables: [
              { name: 'op', value: 'addContent("/a/b/app")', tone: 'primary' },
              { name: 'b.keys()', value: '["app", "c"]', tone: 'emerald' },
            ],
          },
          {
            caption:
              'ls("/a/b"): navigate / → a → b. Node b is a directory (isFile == false), so simply copy b.children.keySet() → returns ["app", "c"] already lexicographically sorted!',
            formula: 'ls("/a/b")  →  new ArrayList<>(b.children.keySet()) = ["app", "c"]',
            activeNodeId: 'b',
            dependencyNodeIds: ['app', 'c'],
            visitedNodeIds: ['root', 'a', 'b', 'c', 'd', 'app'],
            highlightedNodeIds: ['app', 'c'],
            activeEdges: [
              { from: 'b', to: 'app' },
              { from: 'b', to: 'c' },
            ],
            nodeStates: {
              root: 'dir [a]',
              a: 'dir [b]',
              b: 'ls → [app,c]',
              app: 'file "v1"',
              c: 'dir [d]',
              d: 'file "hello"',
            },
            variables: [
              { name: 'op', value: 'ls("/a/b")', tone: 'primary' },
              { name: 'return', value: '["app", "c"]', tone: 'emerald' },
            ],
          },
          {
            caption:
              'Edge Case ls("/a/b/c/d"): navigate to leaf "d". Because d.isFile == true, ls() MUST return a singleton list containing ONLY the file’s own name ["d"] (NOT its full path or contents).',
            formula: 'd.isFile == true  →  return List.of("d")',
            activeNodeId: 'd',
            visitedNodeIds: ['root', 'a', 'b', 'c', 'd', 'app'],
            highlightedNodeIds: ['d'],
            activeEdges: [{ from: 'c', to: 'd' }],
            nodeStates: {
              b: 'TreeMap[app,c]',
              app: 'file "v1"',
              c: 'dir [d]',
              d: 'ls → ["d"]',
            },
            variables: [
              { name: 'op', value: 'ls("/a/b/c/d")', tone: 'amber' },
              { name: 'return', value: '["d"]', tone: 'emerald' },
            ],
          },
          {
            caption:
              'readContentFromFile("/a/b/c/d"): walk / → a → b → c → d in O(depth) and return d.content.toString() = "hello". Calling addContentToFile again appends to StringBuilder in amortized O(1)!',
            formula: 'readContentFromFile("/a/b/c/d")  →  "hello"',
            activeNodeId: 'd',
            visitedNodeIds: ['root', 'a', 'b', 'c', 'd', 'app'],
            highlightedNodeIds: ['d'],
            activeEdges: [
              { from: 'root', to: 'a' },
              { from: 'a', to: 'b' },
              { from: 'b', to: 'c' },
              { from: 'c', to: 'd' },
            ],
            nodeStates: {
              root: 'dir [a]',
              a: 'dir [b]',
              b: 'TreeMap[app,c]',
              app: 'file "v1"',
              c: 'dir [d]',
              d: 'read→"hello"',
            },
            variables: [
              { name: 'op', value: 'read("/a/b/c/d")', tone: 'primary' },
              { name: 'return', value: '"hello"', tone: 'emerald' },
            ],
          },
        ],
      },
      javaSolution: {
        filename: 'InMemoryFileSystem.java',
        code: `import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.TreeMap;

public class InMemoryFileSystem {
    private static final class FsNode {
        // TreeMap keeps directory children lexicographically sorted for O(C) ls()
        final Map<String, FsNode> children = new TreeMap<>();
        boolean isFile;
        StringBuilder content;

        void appendContent(String text) {
            this.isFile = true;
            if (this.content == null) {
                this.content = new StringBuilder();
            }
            this.content.append(text);
        }
    }

    private final FsNode root = new FsNode();

    public List<String> ls(String path) {
        FsNode node = navigate(path, false);
        if (node == null) {
            return Collections.emptyList();
        }
        if (node.isFile) {
            // File ls returns a singleton list containing only the file's basename
            String basename = path.substring(path.lastIndexOf('/') + 1);
            return Collections.singletonList(basename);
        }
        return new ArrayList<>(node.children.keySet());
    }

    public void mkdir(String path) {
        navigate(path, true);
    }

    public void addContentToFile(String filePath, String content) {
        FsNode fileNode = navigate(filePath, true);
        fileNode.appendContent(content);
    }

    public String readContentFromFile(String filePath) {
        FsNode fileNode = navigate(filePath, false);
        if (fileNode == null || !fileNode.isFile || fileNode.content == null) {
            throw new IllegalArgumentException("File not found: " + filePath);
        }
        return fileNode.content.toString();
    }

    private FsNode navigate(String path, boolean createMissing) {
        if (path == null || path.isEmpty() || path.equals("/")) {
            return root;
        }
        String[] parts = path.split("/");
        FsNode curr = root;
        // Start at index 1 because leading '/' produces parts[0] == ""
        for (int i = 1; i < parts.length; i++) {
            String segment = parts[i];
            if (segment.isEmpty()) {
                continue;
            }
            if (createMissing) {
                curr = curr.children.computeIfAbsent(segment, k -> new FsNode());
            } else {
                curr = curr.children.get(segment);
                if (curr == null) {
                    return null;
                }
            }
        }
        return curr;
    }
}`,
        callouts: [
          {
            id: 'fs-treemap',
            startLine: 9,
            endLine: 12,
            title: 'TreeMap vs. HashMap + Sort Trade-Off',
            explanation:
              'TreeMap pays O(log C) on lookup/insert so ls() runs in O(C) already sorted — ideal for read-heavy ls workloads. If write/read lookups dominate and ls() is rare, HashMap gives O(1) traversal and O(C log C) sort only during ls(). Lazy-allocating StringBuilder avoids allocating empty buffers on directory nodes.',
            accent: 'primary',
          },
          {
            id: 'fs-file-ls',
            startLine: 30,
            endLine: 35,
            title: 'File vs. Directory Semantics in ls()',
            explanation:
              'A classic LC #588 bug is returning an empty list when ls() is called on a file path! Checking node.isFile and extracting path.substring(lastIndexOf(\'/\') + 1) returns [basename] cleanly without storing redundant name strings on every FsNode.',
            accent: 'amber',
          },
          {
            id: 'fs-split-root',
            startLine: 55,
            endLine: 67,
            title: 'Java split("/") Edge Case & Unified Traversal',
            explanation:
              '"/".split("/") returns [] while "/a/b".split("/") returns ["", "a", "b"]. Guarding path.equals("/") and starting at i = 1 handles root and nested paths uniformly across all four methods with zero duplicated traversal logic.',
            accent: 'emerald',
          },
        ],
      },
      complexity: {
        time: 'mkdir/add/read: O(P + D log C) · ls: O(P + D log C + C)',
        space: 'O(N · L + B)',
        timeExplanation:
          'P = path string length (for splitting), D = directory depth, C = max entries in a directory (TreeMap lookup costs log C; copying sorted keySet for ls costs O(C)). Appending content of length M is amortized O(M) via StringBuilder.',
        spaceExplanation:
          'Stores N distinct Trie nodes (each segment stored once without prefix duplication) plus B total bytes of file content.',
      },
      edgeCases: [
        {
          title: 'Appending Multiple Times to the Same File',
          scenario: 'addContentToFile("/a/f", "hello") followed by addContentToFile("/a/f", " world").',
          handling: 'Must APPEND ("hello world"), never overwrite. StringBuilder.append() avoids quadratic String reallocation on repeated writes.',
        },
        {
          title: 'Calling addContentToFile When Parent Directories Do Not Exist',
          scenario: 'addContentToFile("/x/y/z.txt", "data") on an empty filesystem.',
          handling: 'navigate(filePath, true) creates intermediate directory nodes x and y automatically before marking z.txt as a file.',
        },
        {
          title: 'Concurrency & Thread Safety Follow-Up (Senior LLD Bridge)',
          scenario: 'Interviewers often ask: "How do you make this thread-safe for concurrent readers and writers?"',
          handling:
            'Swap TreeMap to ConcurrentSkipListMap for lock-free sorted directory ops, guard each file’s StringBuilder with a per-node ReentrantReadWriteLock, and use lock-coupling if supporting atomic mv()/rm -rf.',
        },
      ],
    },
  ],

  /* ================================================================
   * DAY 7 LLD: SPLITWISE (EXPENSE SHARING & DEBT SIMPLIFICATION)
   * ================================================================ */
  lldLesson: {
    id: 'day7-splitwise',
    dayNumber: 7,
    kind: 'lld',
    title: 'Splitwise (Expense Sharing & Debt Simplification)',
    subtitle: 'Strategy-driven BigDecimal splits with exact penny allocation, Greedy Min/Max Heap vs. Exact Backtracking debt simplification, and per-group locking',
    patterns: ['Strategy Pattern', 'Factory Pattern', 'BigDecimal Penny Invariant', 'Greedy Heap & Exact DFS Simplifier'],
    estimatedMinutes: 24,
    problemScope: {
      summary:
        'Design an extensible, thread-safe expense-sharing and debt-simplification engine (Splitwise) supporting multi-member groups, pluggable split policies (EQUAL, EXACT, PERCENT), exact BigDecimal monetary arithmetic with deterministic penny-remainder allocation, and pluggable debt-graph simplification.',
      functionalRequirements: [
        'Create expense groups with members and record expenses paid by one user and shared across a subset of members using EQUAL, EXACT, or PERCENT split modes.',
        'Guarantee strict monetary conservation on every expense: SUM(participant shares) == totalAmount down to the exact cent (e.g., $100.00 / 3 → $33.34, $33.33, $33.33 — zero penny drift).',
        'Maintain each user’s real-time net balance within a group (positive = owed money, negative = owes money) such that SUM(all net balances) == 0.00 ALWAYS holds.',
        'Simplify tangled group debts into a minimal set of SettlementTransactions (Debtor → Creditor) using pluggable simplification algorithms (fast Greedy Min/Max Heap vs. Exact Backtracking for small groups) and allow recording settle-up payments.',
      ],
      concurrencyAndScaleAssumptions: [
        'Members of different groups record expenses and click "Simplify Debts" concurrently — contention MUST be isolated per ExpenseGroup via a ReentrantReadWriteLock rather than locking the entire service.',
        'Mobile clients frequently retry POST /expenses on flaky Wi-Fi; expense creation MUST deduplicate by idempotent expenseId so a trip dinner is never double-counted.',
      ],
      explicitNonGoals: [
        'Real-money ACH/Venmo bank rail settlement (modeled here as an internal ledger recording settle-up receipts; external payment rails are covered in Day 7 HLD).',
        'Multi-currency live FX conversion tables (discussed under Extensibility Scenarios with immutable FX-rate snapshots).',
      ],
    },
    coreEntities: [
      {
        name: 'SplitwiseService',
        role: 'Facade managing groups, delegating split calculation to SplitStrategyFactory, and exposing thread-safe expense recording, balance queries, and debt simplification.',
        keyFields: ['groups: ConcurrentHashMap<String, ExpenseGroup>', 'debtSimplifier: DebtSimplifier'],
        invariants: 'Routes all group mutations through the target ExpenseGroup’s scoped lock.',
      },
      {
        name: 'ExpenseGroup',
        role: 'Aggregate root owning members, append-only expense history, idempotent expenseId set, netBalances map, and a group-scoped ReentrantReadWriteLock.',
        keyFields: ['groupId: String', 'members: Set<String>', 'netBalances: Map<String, BigDecimal>', 'processedExpenseIds: Set<String>', 'rwLock: ReentrantReadWriteLock'],
        invariants: 'Zero-sum invariant: SUM(netBalances.values()) == 0.00 holds atomically before and after every write lock release.',
      },
      {
        name: 'Expense & Split (Immutable Records)',
        role: 'Append-only domain ledger records capturing payer, validated BigDecimal totalAmount, currency, and exact resolved participant Split entries.',
        keyFields: ['expenseId: String', 'paidByUserId: String', 'totalAmount: BigDecimal', 'splits: List<Split>'],
        invariants: 'All amounts have scale 2 (cents), are strictly > 0, and SUM(splits) equals totalAmount exactly.',
      },
      {
        name: 'SplitStrategy (Strategy Pattern)',
        role: 'Validates inputs and computes exact BigDecimal Split shares (including penny-remainder allocation) for EQUAL, EXACT, and PERCENT modes.',
        keyFields: ['calculateSplits(BigDecimal totalAmount, List<SplitInput> inputs): List<Split>'],
        invariants: 'Pure and stateless; throws IllegalArgumentException if exact shares or percentages fail validation.',
      },
      {
        name: 'DebtSimplifier (Strategy Pattern)',
        role: 'Reduces a group’s net balance map into minimal (fromUser → toUser, amount) SettlementTransactions.',
        keyFields: ['simplify(Map<String, BigDecimal> netBalances): List<SettlementTransaction>'],
        invariants: 'Applying all returned SettlementTransactions brings every participant’s net balance to 0.00.',
      },
    ],
    designPatterns: [
      {
        pattern: 'Strategy Pattern (EqualSplitStrategy, ExactSplitStrategy, PercentSplitStrategy)',
        whereUsed: 'Computing and validating participant shares when an expense is recorded.',
        whatBreaksWithoutIt:
          'ExpenseGroup.addExpense() becomes a brittle switch(splitType) mixing percentage validation, penny-rounding logic, and lock management in one class. Adding SHARES (e.g., 2:1:1 weighted split) or ITEMIZED receipt splits forces modifying core ledger code.',
        howItSolvesIt:
          'Each split rule is a stateless, unit-testable SplitStrategy resolved by SplitStrategyFactory. ExpenseGroup only consumes validated List<Split> objects whose sum is already guaranteed equal to totalAmount.',
      },
      {
        pattern: 'Strategy Pattern (DebtSimplifier — Greedy Min/Max Heap vs. Exact Backtracking)',
        whereUsed: 'Generating simplified settlement plans from net group balances.',
        whatBreaksWithoutIt:
          'Hardcoding one algorithm forces an ugly trade-off: Greedy Heap is blazing fast O(N log N) for 200-person events but occasionally emits 1 extra transfer when disjoint zero-sum subgroups exist, whereas Exact Backtracking (NP-Complete, LC #465) finds the theoretical minimum transfers for N ≤ 12 roommates but times out on large groups.',
        howItSolvesIt:
          'Abstracting DebtSimplifier behind an interface lets us run a hybrid policy: Exact Backtracking for small groups (≤ 12 non-zero balances) and O(N log N) Greedy Min/Max Heap for larger groups!',
      },
      {
        pattern: 'Immutable Ledger Records + Zero-Sum Aggregate Guard',
        whereUsed: 'Expense, Split, SettlementTransaction, and ExpenseGroup net-balance updates.',
        whatBreaksWithoutIt:
          'Using mutable floating-point double balances accumulates IEEE-754 rounding errors ($0.1 + $0.2 = $0.30000000000000004), causing "ghost pennies" where a group can never settle to $0.00.',
        howItSolvesIt:
          'Converting to exact minor units (cents) via BigDecimal scale 2 and distributing remainder cents deterministically guarantees mathematical zero-sum conservation on every single expense.',
      },
    ],
    diagrams: {
      classDiagram: {
        title: 'Splitwise — UML Class Diagram',
        caption: 'Dual Strategy architecture separating Split calculation from Debt Simplification, anchored by per-group ReadWriteLock',
        mermaid: `classDiagram
    class SplitwiseService {
        -Map~String,ExpenseGroup~ groups
        -DebtSimplifier simplifier
        +recordExpense(groupId, req) Expense
        +simplifyDebts(groupId) List~Settlement~
        +settleUp(groupId, from, to, amt) void
    }

    class ExpenseGroup {
        -String groupId
        -Map~String,BigDecimal~ netBalances
        -Set~String~ processedExpenseIds
        -ReentrantReadWriteLock rwLock
        +applyExpense(Expense) boolean
        +snapshotBalances() Map~String,BigDecimal~
    }

    class Expense {
        -String expenseId
        -String paidBy
        -BigDecimal totalAmount
        -List~Split~ splits
    }

    class SplitStrategy {
        <<interface>>
        +calculate(total, inputs) List~Split~
    }

    class EqualSplitStrategy {
        +calculate(total, inputs) List~Split~
    }

    class ExactSplitStrategy {
        +calculate(total, inputs) List~Split~
    }

    class PercentSplitStrategy {
        +calculate(total, inputs) List~Split~
    }

    class DebtSimplifier {
        <<interface>>
        +simplify(balances) List~Settlement~
    }

    class GreedyHeapSimplifier {
        +simplify(balances) List~Settlement~
    }

    class ExactBacktrackSimplifier {
        +simplify(balances) List~Settlement~
    }

    SplitwiseService "1" o-- "*" ExpenseGroup : "manages groups"
    SplitwiseService --> SplitStrategy : "computes shares"
    SplitwiseService --> DebtSimplifier : "minimizes edges"
    ExpenseGroup "1" *-- "*" Expense : "appends ledger"
    SplitStrategy <|.. EqualSplitStrategy : "implements"
    SplitStrategy <|.. ExactSplitStrategy : "implements"
    SplitStrategy <|.. PercentSplitStrategy : "implements"
    DebtSimplifier <|.. GreedyHeapSimplifier : "implements"
    DebtSimplifier <|.. ExactBacktrackSimplifier : "implements"`,
      },
      sequenceDiagram: {
        title: 'Idempotent Expense Recording & Thread-Safe Debt Simplification',
        caption: 'Strategy computes exact penny-safe splits outside the lock, then ExpenseGroup updates net balances atomically under writeLock',
        mermaid: `sequenceDiagram
    participant Client as "Mobile Client"
    participant Service as "SplitwiseService"
    participant Strategy as "EqualSplitStrategy"
    participant Group as "ExpenseGroup (Trip)"
    participant Simplifier as "GreedyHeapSimplifier"

    Client->>Service: "recordExpense(expId, paidBy=Alice, $100.00, EQUAL)"
    Service->>Strategy: "calculate($100.00, [Alice, Bob, Carol])"
    Strategy-->>Service: "Splits [Alice:$33.34, Bob:$33.33, Carol:$33.33]"
    Service->>Group: "applyExpense(Expense)"
    Group->>Group: "rwLock.writeLock().lock()"
    alt "expId already in processedExpenseIds"
        Group->>Group: "rwLock.writeLock().unlock()"
        Group-->>Service: "Idempotent no-op (existing Expense)"
    else "New expenseId"
        Group->>Group: "Credit Alice +$100.00, Debit splits (-$33.34, -$33.33, -$33.33)"
        Group->>Group: "Verify SUM(netBalances) == 0.00 & unlock"
        Group-->>Service: "Applied Expense"
    end
    Service-->>Client: "201 Expense Recorded"
    Client->>Service: "simplifyDebts(groupId)"
    Service->>Group: "snapshotBalances() under readLock"
    Group-->>Service: "{Alice:+66.66, Bob:-33.33, Carol:-33.33}"
    Service->>Simplifier: "simplify(snapshot)"
    Simplifier-->>Service: "[Bob->Alice $33.33, Carol->Alice $33.33]"
    Service-->>Client: "200 Settlement Plan"`,
      },
    },
    codeFiles: [
      {
        filename: 'SplitwiseModels.java',
        label: 'SplitwiseModels.java',
        summary: 'Immutable BigDecimal value objects enforcing 2-decimal currency precision and zero-drift conversion helpers.',
        code: `import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.Instant;
import java.util.List;
import java.util.Objects;

public enum SplitType { EQUAL, EXACT, PERCENT }

public record SplitInput(String userId, BigDecimal value) {
    public SplitInput {
        Objects.requireNonNull(userId, "userId required");
    }
}

public record Split(String userId, BigDecimal amount) {
    public Split {
        Objects.requireNonNull(userId, "userId required");
        amount = MoneyUtils.requirePositiveScale2(amount, "split amount");
    }
}

public record Expense(
        String expenseId,
        String groupId,
        String description,
        String paidByUserId,
        BigDecimal totalAmount,
        List<Split> splits,
        Instant createdAt) {
    public Expense {
        Objects.requireNonNull(expenseId, "expenseId required");
        Objects.requireNonNull(groupId, "groupId required");
        Objects.requireNonNull(paidByUserId, "paidByUserId required");
        totalAmount = MoneyUtils.requirePositiveScale2(totalAmount, "totalAmount");
        splits = List.copyOf(Objects.requireNonNull(splits, "splits required"));

        BigDecimal sum = splits.stream()
            .map(Split::amount)
            .reduce(MoneyUtils.ZERO, BigDecimal::add);
        if (sum.compareTo(totalAmount) != 0) {
            throw new IllegalArgumentException(
                "Splits sum " + sum + " != totalAmount " + totalAmount);
        }
    }
}

public record SettlementTransaction(String fromUserId, String toUserId, BigDecimal amount) {
    public SettlementTransaction {
        Objects.requireNonNull(fromUserId);
        Objects.requireNonNull(toUserId);
        amount = MoneyUtils.requirePositiveScale2(amount, "settlement amount");
    }
}

public final class MoneyUtils {
    public static final BigDecimal ZERO = BigDecimal.ZERO.setScale(2, RoundingMode.UNNECESSARY);

    private MoneyUtils() {}

    public static BigDecimal normalize(BigDecimal value) {
        return Objects.requireNonNull(value, "amount required").setScale(2, RoundingMode.HALF_UP);
    }

    public static BigDecimal requirePositiveScale2(BigDecimal value, String field) {
        BigDecimal scaled = normalize(value);
        if (scaled.compareTo(ZERO) <= 0) {
            throw new IllegalArgumentException(field + " must be > 0, got: " + scaled);
        }
        return scaled;
    }

    public static long toCents(BigDecimal amount) {
        return normalize(amount).movePointRight(2).longValueExact();
    }

    public static BigDecimal fromCents(long cents) {
        return BigDecimal.valueOf(cents, 2);
    }
}`,
        callouts: [
          {
            id: 'sw-expense-invariant',
            startLine: 37,
            endLine: 44,
            title: 'Constructor-Enforced Conservation Invariant',
            explanation:
              'Expense validates SUM(splits) == totalAmount inside its compact record constructor using compareTo (not equals, since 10.0 vs 10.00 differ in equals!). It is structurally impossible to instantiate an unbalanced Expense.',
            accent: 'emerald',
          },
          {
            id: 'sw-minor-units',
            startLine: 72,
            endLine: 78,
            title: 'Exact Minor-Unit (Cents) Arithmetic Helper',
            explanation:
              'Converting BigDecimal to long cents via movePointRight(2).longValueExact() lets division and remainder math operate with zero floating-point drift before wrapping cleanly back via BigDecimal.valueOf(cents, 2).',
            accent: 'primary',
          },
        ],
      },
      {
        filename: 'SplitStrategies.java',
        label: 'SplitStrategies.java',
        summary: 'Strategy implementations for EQUAL (with deterministic penny-remainder allocation), EXACT, and PERCENT splits.',
        code: `import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;

@FunctionalInterface
public interface SplitStrategy {
    List<Split> calculateSplits(BigDecimal totalAmount, List<SplitInput> inputs);
}

public final class EqualSplitStrategy implements SplitStrategy {
    @Override
    public List<Split> calculateSplits(BigDecimal totalAmount, List<SplitInput> inputs) {
        if (inputs == null || inputs.isEmpty()) {
            throw new IllegalArgumentException("At least one participant required");
        }
        // Sort deterministically by userId so penny remainder is reproducible across retries
        List<SplitInput> ordered = inputs.stream()
            .sorted(Comparator.comparing(SplitInput::userId))
            .toList();

        long totalCents = MoneyUtils.toCents(totalAmount);
        int n = ordered.size();
        long baseCents = totalCents / n;
        long remainderCents = totalCents % n; // Guaranteed 0 <= remainderCents < n

        List<Split> result = new ArrayList<>(n);
        for (int i = 0; i < n; i++) {
            long shareCents = baseCents + (i < remainderCents ? 1L : 0L);
            result.add(new Split(ordered.get(i).userId(), MoneyUtils.fromCents(shareCents)));
        }
        return result;
    }
}

public final class ExactSplitStrategy implements SplitStrategy {
    @Override
    public List<Split> calculateSplits(BigDecimal totalAmount, List<SplitInput> inputs) {
        BigDecimal target = MoneyUtils.requirePositiveScale2(totalAmount, "totalAmount");
        List<Split> splits = new ArrayList<>(inputs.size());
        BigDecimal runningSum = MoneyUtils.ZERO;

        for (SplitInput input : inputs) {
            BigDecimal share = MoneyUtils.requirePositiveScale2(input.value(), "exact share");
            splits.add(new Split(input.userId(), share));
            runningSum = runningSum.add(share);
        }

        if (runningSum.compareTo(target) != 0) {
            throw new IllegalArgumentException(
                "Exact shares sum (" + runningSum + ") != total (" + target + ")");
        }
        return splits;
    }
}

public final class PercentSplitStrategy implements SplitStrategy {
    private static final BigDecimal HUNDRED = new BigDecimal("100.00");

    @Override
    public List<Split> calculateSplits(BigDecimal totalAmount, List<SplitInput> inputs) {
        BigDecimal target = MoneyUtils.requirePositiveScale2(totalAmount, "totalAmount");
        BigDecimal percentSum = inputs.stream()
            .map(in -> MoneyUtils.requirePositiveScale2(in.value(), "percent"))
            .reduce(MoneyUtils.ZERO, BigDecimal::add);

        if (percentSum.compareTo(HUNDRED) != 0) {
            throw new IllegalArgumentException("Percentages must sum to 100.00, got: " + percentSum);
        }

        // Largest-Remainder Allocation: floor to cents, then assign leftover pennies to largest fractions
        record ShareRow(String userId, long floorCents, BigDecimal fractionalRemainder) {}
        List<ShareRow> rows = new ArrayList<>(inputs.size());
        long allocatedCents = 0L;
        long totalCents = MoneyUtils.toCents(target);

        for (SplitInput in : inputs) {
            BigDecimal exactCents = BigDecimal.valueOf(totalCents)
                .multiply(in.value())
                .divide(HUNDRED, 6, RoundingMode.HALF_UP);
            long floored = exactCents.setScale(0, RoundingMode.DOWN).longValueExact();
            BigDecimal frac = exactCents.subtract(BigDecimal.valueOf(floored));
            rows.add(new ShareRow(in.userId(), floored, frac));
            allocatedCents += floored;
        }

        long leftover = totalCents - allocatedCents;
        rows.sort(Comparator.comparing(ShareRow::fractionalRemainder).reversed()
            .thenComparing(ShareRow::userId));

        List<Split> splits = new ArrayList<>(rows.size());
        for (int i = 0; i < rows.size(); i++) {
            long finalCents = rows.get(i).floorCents() + (i < leftover ? 1L : 0L);
            splits.add(new Split(rows.get(i).userId(), MoneyUtils.fromCents(finalCents)));
        }
        return splits;
    }
}

public final class SplitStrategyFactory {
    private static final EqualSplitStrategy EQUAL = new EqualSplitStrategy();
    private static final ExactSplitStrategy EXACT = new ExactSplitStrategy();
    private static final PercentSplitStrategy PERCENT = new PercentSplitStrategy();

    private SplitStrategyFactory() {}

    public static SplitStrategy forType(SplitType type) {
        return switch (type) {
            case EQUAL -> EQUAL;
            case EXACT -> EXACT;
            case PERCENT -> PERCENT;
        };
    }
}`,
        callouts: [
          {
            id: 'sw-penny-equal',
            startLine: 18,
            endLine: 32,
            title: 'Deterministic Penny-Remainder Allocation ($100 / 3)',
            explanation:
              'Naive totalAmount.divide(n, 2, HALF_UP) turns $100 / 3 into $33.33 × 3 = $99.99, silently losing 1 cent! Computing baseCents = 3333 and distributing remainderCents = 1 across sorted participants guarantees exact $100.00 conservation.',
            accent: 'amber',
          },
          {
            id: 'sw-largest-rem',
            startLine: 72,
            endLine: 97,
            title: 'Hamilton / Largest-Remainder Method for Percent Splits',
            explanation:
              'For $10.01 split 50% / 50%, flooring yields $5.00 + $5.00 with 1 leftover cent. Assigning leftover cents by descending fractional remainder (breaking ties by userId) is the standard banking algorithm for exact percentage allocation.',
            accent: 'emerald',
          },
        ],
      },
      {
        filename: 'DebtSimplifier.java',
        label: 'DebtSimplifier.java',
        summary: 'O(N log N) Greedy Min/Max Heap debt simplifier plus Exact Backtracking minimum-transaction solver (LC #465) for small groups.',
        code: `import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.PriorityQueue;
import java.util.Set;

public interface DebtSimplifier {
    List<SettlementTransaction> simplify(Map<String, BigDecimal> netBalances);
}

/**
 * Net-Balance Greedy Heap Simplifier: O(N log N) time, produces at most (N - 1) transfers.
 * Always matches the largest creditor against the largest debtor to eliminate at least one
 * person from the graph per step.
 */
public final class GreedyHeapDebtSimplifier implements DebtSimplifier {
    private record Entry(String userId, long cents) {}

    @Override
    public List<SettlementTransaction> simplify(Map<String, BigDecimal> netBalances) {
        PriorityQueue<Entry> creditors = new PriorityQueue<>(
            Comparator.comparingLong(Entry::cents).reversed().thenComparing(Entry::userId));
        PriorityQueue<Entry> debtors = new PriorityQueue<>(
            Comparator.comparingLong(Entry::cents).reversed().thenComparing(Entry::userId));

        for (Map.Entry<String, BigDecimal> e : netBalances.entrySet()) {
            long cents = MoneyUtils.toCents(e.getValue());
            if (cents > 0) {
                creditors.offer(new Entry(e.getKey(), cents));
            } else if (cents < 0) {
                debtors.offer(new Entry(e.getKey(), -cents)); // Store positive magnitude owed
            }
        }

        List<SettlementTransaction> plan = new ArrayList<>();
        while (!creditors.isEmpty() && !debtors.isEmpty()) {
            Entry cred = creditors.poll();
            Entry debt = debtors.poll();
            long settled = Math.min(cred.cents(), debt.cents());

            plan.add(new SettlementTransaction(
                debt.userId(), cred.userId(), MoneyUtils.fromCents(settled)));

            if (cred.cents() > settled) {
                creditors.offer(new Entry(cred.userId(), cred.cents() - settled));
            }
            if (debt.cents() > settled) {
                debtors.offer(new Entry(debt.userId(), debt.cents() - settled));
            }
        }
        return plan;
    }
}

/**
 * Exact Minimum-Transaction Solver (LC #465 — NP-Complete in general).
 * Finds true minimum edge count when disjoint zero-sum subsets exist (e.g., {+10,-10} & {+5,-5}),
 * suitable for small roommate/trip groups (N <= 12).
 */
public final class ExactBacktrackingDebtSimplifier {
    public int minimumTransactions(Map<String, BigDecimal> netBalances) {
        long[] nonZero = netBalances.values().stream()
            .mapToLong(MoneyUtils::toCents)
            .filter(c -> c != 0L)
            .toArray();
        return dfs(0, nonZero);
    }

    private int dfs(int start, long[] debts) {
        while (start < debts.length && debts[start] == 0L) {
            start++;
        }
        if (start == debts.length) {
            return 0;
        }

        int best = Integer.MAX_VALUE;
        Set<Long> triedAmounts = new HashSet<>(); // Skip duplicate sibling debt values

        for (int i = start + 1; i < debts.length; i++) {
            // Only settle opposite-sign balances; Long.signum avoids long*long overflow
            if (Long.signum(debts[start]) * Long.signum(debts[i]) >= 0) {
                continue;
            }
            if (!triedAmounts.add(debts[i])) {
                continue;
            }

            debts[i] += debts[start];
            best = Math.min(best, 1 + dfs(start + 1, debts));
            debts[i] -= debts[start];

            // Exact opposite pair cancels 2 accounts in 1 transfer — provably optimal!
            if (debts[i] + debts[start] == 0L) {
                break;
            }
        }
        return best;
    }
}`,
        callouts: [
          {
            id: 'sw-heap-bound',
            startLine: 23,
            endLine: 55,
            title: 'Why Netting Collapses O(E) Pairwise Edges to ≤ (N - 1)',
            explanation:
              'If Alice owes Bob $10 and Bob owes Carol $10, their pairwise graph has 2 edges, but Bob’s net balance is $0! Collapsing to net balances drops Bob completely, and every heap pop settles at least one account, bounding transfers by N - 1 in O(N log N) time.',
            accent: 'primary',
          },
          {
            id: 'sw-exact-np',
            startLine: 63,
            endLine: 100,
            title: 'Greedy Heap vs. NP-Complete Exact Minimum (4.5-YOE Distinction)',
            explanation:
              'Greedy Heap is NOT always strictly minimal: on balances [+10, +5, -6, -5, -4], greedy pairs +10 with -6 (4 transfers), whereas pairing (+5,-5) and (+10,-6,-4) takes 3 transfers! Exact Backtracking (with exact-opposite early break & sibling value dedup) finds the true minimum for small N ≤ 12.',
            accent: 'amber',
          },
        ],
      },
      {
        filename: 'ExpenseGroupService.java',
        label: 'ExpenseGroupService.java',
        summary: 'Thread-safe ExpenseGroup with per-group ReentrantReadWriteLock, idempotent expense deduplication, and SplitwiseService facade.',
        code: `import java.math.BigDecimal;
import java.time.Clock;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.locks.ReentrantReadWriteLock;

public final class ExpenseGroup {
    private final String groupId;
    private final Set<String> memberIds;
    private final Map<String, BigDecimal> netBalances = new HashMap<>();
    private final List<Expense> ledger = new ArrayList<>();
    private final Set<String> processedExpenseIds = new HashSet<>();
    private final ReentrantReadWriteLock rwLock = new ReentrantReadWriteLock();

    public ExpenseGroup(String groupId, Set<String> memberIds) {
        this.groupId = groupId;
        this.memberIds = Set.copyOf(memberIds);
        for (String member : this.memberIds) {
            netBalances.put(member, MoneyUtils.ZERO);
        }
    }

    public boolean applyExpense(Expense expense) {
        rwLock.writeLock().lock();
        try {
            // Idempotency guard: duplicate mobile retries return safely without double-counting
            if (!processedExpenseIds.add(expense.expenseId())) {
                return false;
            }
            validateMember(expense.paidByUserId());
            for (Split split : expense.splits()) {
                validateMember(split.userId());
            }

            // Credit payer for total upfront outlay, then debit each participant's exact share
            netBalances.merge(expense.paidByUserId(), expense.totalAmount(), BigDecimal::add);
            for (Split split : expense.splits()) {
                netBalances.merge(split.userId(), split.amount().negate(), BigDecimal::add);
            }
            ledger.add(expense);
            return true;
        } finally {
            rwLock.writeLock().unlock();
        }
    }

    public Map<String, BigDecimal> snapshotBalances() {
        rwLock.readLock().lock();
        try {
            return Collections.unmodifiableMap(new HashMap<>(netBalances));
        } finally {
            rwLock.readLock().unlock();
        }
    }

    private void validateMember(String userId) {
        if (!memberIds.contains(userId)) {
            throw new IllegalArgumentException("User " + userId + " is not in group " + groupId);
        }
    }
}

public final class SplitwiseService {
    private final Map<String, ExpenseGroup> groups = new ConcurrentHashMap<>();
    private final DebtSimplifier debtSimplifier;
    private final Clock clock;

    public SplitwiseService(DebtSimplifier debtSimplifier, Clock clock) {
        this.debtSimplifier = debtSimplifier;
        this.clock = clock;
    }

    public void createGroup(String groupId, Set<String> memberIds) {
        if (groups.putIfAbsent(groupId, new ExpenseGroup(groupId, memberIds)) != null) {
            throw new IllegalArgumentException("Group already exists: " + groupId);
        }
    }

    public Expense recordExpense(
            String expenseId,
            String groupId,
            String description,
            String paidByUserId,
            BigDecimal totalAmount,
            SplitType splitType,
            List<SplitInput> inputs) {
        ExpenseGroup group = requireGroup(groupId);
        // Run pure strategy math OUTSIDE the group write lock to minimize critical section
        List<Split> splits = SplitStrategyFactory.forType(splitType).calculateSplits(totalAmount, inputs);
        Expense expense = new Expense(
            expenseId, groupId, description, paidByUserId, totalAmount, splits, clock.instant());

        group.applyExpense(expense);
        return expense;
    }

    public List<SettlementTransaction> simplifyDebts(String groupId) {
        Map<String, BigDecimal> snapshot = requireGroup(groupId).snapshotBalances();
        return debtSimplifier.simplify(snapshot);
    }

    public Expense settleUp(String groupId, String debtorId, String creditorId, BigDecimal amount) {
        // Modeling settlement as an exact-split Expense preserves a single unified append-only ledger!
        return recordExpense(
            "settle-" + UUID.randomUUID(),
            groupId,
            "Settlement: " + debtorId + " -> " + creditorId,
            debtorId,
            amount,
            SplitType.EXACT,
            List.of(new SplitInput(creditorId, amount))
        );
    }

    private ExpenseGroup requireGroup(String groupId) {
        ExpenseGroup group = groups.get(groupId);
        if (group == null) {
            throw new IllegalArgumentException("Unknown group: " + groupId);
        }
        return group;
    }
}`,
        callouts: [
          {
            id: 'sw-rwlock',
            startLine: 30,
            endLine: 52,
            title: 'Per-Group ReadWriteLock + Idempotent Expense Guard',
            explanation:
              'Multiple users viewing balances or simplifying debts acquire readLock concurrently, while expense writes lock ONLY that single ExpenseGroup. Checking processedExpenseIds under writeLock guarantees atomic deduplication of retried requests.',
            accent: 'primary',
          },
          {
            id: 'sw-outside-lock',
            startLine: 94,
            endLine: 100,
            title: 'Execute Strategy Math Outside the Critical Section',
            explanation:
              'SplitStrategy.calculateSplits() and DebtSimplifier.simplify() run on immutable inputs/snapshots completely outside rwLock, keeping lock hold durations to nanoseconds.',
            accent: 'emerald',
          },
          {
            id: 'sw-settle-unified',
            startLine: 109,
            endLine: 120,
            title: 'Settle-Up Modeled as a Unified Ledger Expense',
            explanation:
              'When Bob pays Alice $33.33 to settle up, recording it as an Expense paid by Bob with 100% EXACT split to Alice credits Bob +$33.33 and debits Alice -$33.33 — zero special balance-mutation code and complete audit history!',
            accent: 'amber',
          },
        ],
      },
    ],
    solidHighlights: [
      {
        principle: 'Single Responsibility',
        application:
          'MoneyUtils enforces cent-scale arithmetic, SplitStrategy computes valid participant shares, DebtSimplifier minimizes transfer graphs, and ExpenseGroup guards concurrent ledger updates.',
      },
      {
        principle: 'Open/Closed',
        application:
          'Adding a SharesSplitStrategy (e.g., 2:1:1 weighted split) or a HybridDebtSimplifier (Exact DFS for N ≤ 12, Greedy Heap for N > 12) requires adding new strategy classes without altering ExpenseGroup.',
      },
      {
        principle: 'Liskov Substitution',
        application:
          'Every SplitStrategy guarantees SUM(returned Splits) == totalAmount and positive scale-2 BigDecimals, so Expense construction succeeds uniformly regardless of split mode.',
      },
      {
        principle: 'Dependency Inversion',
        application:
          'SplitwiseService depends on the DebtSimplifier interface and java.time.Clock rather than concrete graph solvers or system wall-clock calls.',
      },
    ],
    extensibilityScenarios: [
      {
        scenario: 'Add Weighted Shares Split (e.g., 2 shares for Alice, 1 share each for Bob & Carol)',
        changesRequired:
          'Add SplitType.SHARES and a SharesSplitStrategy computing totalCents * share_i / totalShares using the exact same Largest-Remainder penny allocator — zero changes to ExpenseGroup or DebtSimplifier.',
      },
      {
        scenario: 'Multi-Currency Trip Expenses (EUR Hotel + USD Flights)',
        changesRequired:
          'Attach Currency + immutable fxRateToGroupBase snapshot on Expense at creation time, converting into the group’s base currency before updating netBalances (never retroactively re-valuing past expenses when exchange rates move!).',
      },
      {
        scenario: 'Cross-Group Global Debt Simplification (Friend Balances Across Multiple Trips)',
        changesRequired:
          'Keep per-group ledgers isolated for auditability, and aggregate a user’s net balances across shared groups in a read-only GlobalBalanceAggregator before passing the merged map to DebtSimplifier.',
      },
    ],
    concurrencyChoices: [
      {
        topic: 'Per-Group Lock Striping (ReadWriteLock)',
        mechanism: 'ReentrantReadWriteLock owned per ExpenseGroup inside ConcurrentHashMap',
        rationale:
          'Expense writes in Group A never contend with Group B, and concurrent balance/simplification reads within the same group execute in parallel under readLock.',
      },
      {
        topic: 'Atomic Zero-Sum Balance Consistency',
        mechanism: 'All payer credit + participant debits apply within one writeLock block; reads return a defensive Map copy',
        rationale:
          'No reader can ever observe a half-applied expense where Alice was credited +$100 before Bob and Carol were debited (which would violate SUM(balances) == 0 and corrupt DebtSimplifier!).',
      },
      {
        topic: 'Idempotent Mobile Retry Handling',
        mechanism: 'processedExpenseIds Set checked atomically under writeLock (backed by UNIQUE(expense_id) in SQL)',
        rationale:
          'Prevents double-charging friends when a user taps "Save Expense" twice on spotty cellular connectivity.',
      },
    ],
  },

  /* ================================================================
   * DAY 7 HLD: PAYMENT SYSTEM / STRIPE LEDGER
   * ================================================================ */
  hldLesson: {
    id: 'day7-payment-stripe-ledger',
    dayNumber: 7,
    kind: 'hld',
    title: 'Payment System / Stripe Ledger',
    subtitle: 'Idempotency-key request hashing, immutable double-entry accounting, transactional outbox PSP integration, and T+1 reconciliation',
    tags: ['Double-Entry Ledger', 'Idempotency Keys', 'Transactional Outbox', 'ACID CP System'],
    estimatedMinutes: 26,
    overview:
      'Design a financial-grade payment processing and double-entry ledger platform (Stripe / Adyen core) handling 10M payments/day with zero double charges, mathematically balanced immutable accounting books (SUM(debits) == SUM(credits)), resilient third-party PSP integration, and automated T+1 settlement reconciliation.',
    requirements: {
      functional: [
        'Process merchant payment intents (Authorize & Capture, Refunds, Payouts) safely across arbitrary client network retries via strict Idempotency-Key enforcement.',
        'Record every money movement in an append-only Double-Entry Accounting Ledger where every journal transaction satisfies SUM(debits) == SUM(credits) with full audit history.',
        'Orchestrate external Payment Service Providers (Visa/Mastercard/Adyen/Chase) asynchronously via Outbox + signed Webhooks without holding open database locks during external HTTP calls.',
        'Run continuous/daily Reconciliation comparing internal Ledger entries against external PSP settlement files to surface and resolve any 1-cent discrepancy.',
      ],
      nonFunctional: [
        {
          metric: 'Correctness & Consistency',
          target: 'Strict CP / ACID Serializable or Optimistic Locking — ZERO double charges, ZERO lost cents',
          rationale: 'Unlike social feeds, payments NEVER trade correctness for availability: a double charge destroys merchant trust and incurs regulatory/chargeback penalties.',
        },
        {
          metric: 'Exactly-Once Money Movement',
          target: 'At-least-once delivery + End-to-End Idempotency = Effective Exactly-Once',
          rationale: 'True distributed exactly-once transport does not exist over unreliable networks; combining client idempotency keys, DB unique constraints, and PSP idempotency keys guarantees single execution.',
        },
        {
          metric: 'End-to-End Checkout Latency (p99)',
          target: '< 800 ms sync auth (internal overhead < 80 ms)',
          rationale: 'External card network round-trips dominate (~300–600 ms); our internal gateway, idempotency check, and DB commit must stay lean and non-blocking.',
        },
        {
          metric: 'Auditability & Retention',
          target: '100% immutable ledger, 7-year WORM compliance (PCI-DSS / SOX)',
          rationale: 'Financial regulators prohibit mutating or deleting historical entries; errors and refunds must be recorded via compensating reversing entries.',
        },
      ],
    },
    capacityMath: {
      assumptions: [
        '10M payment transactions per day (~300M/month) across global merchants',
        '5× peak spike multiplier (flash sales / Black Friday bursts); 10:1 Read:Write ratio (status polling & merchant dashboards)',
        'Each payment persists ~2 KB total across payment_intents (~600 B), 4 double-entry ledger_entries rows (~1 KB), and outbox/audit metadata (~400 B)',
        '24-hour hot Idempotency-Key window (~500 B/key including SHA-256 request hash & cached response JSON); 7-year regulatory ledger retention',
      ],
      calculations: [
        {
          metric: 'Payment Write TPS (Avg / Peak)',
          formula: '10M / 86,400 ≈ 115.7 TPS → ×5 peak',
          result: '~116 TPS avg · ~580 TPS peak',
          notes: 'Modest raw TPS compared to social apps — lets us prioritize strict ACID guarantees and clean transactional isolation over AP NoSQL hacks.',
        },
        {
          metric: 'Double-Entry Ledger Row Writes',
          formula: '116 TPS × 4 journal legs/payment (Buyer, Merchant, Platform Fee, PSP Fee)',
          result: '~465 rows/s avg · ~2,320 rows/s peak',
          notes: 'Easily absorbed by PostgreSQL / CockroachDB / Spanner partitioned by merchant_id with append-only B-Tree/LSM inserts.',
        },
        {
          metric: 'Read QPS (Status & Dashboards)',
          formula: '10 × 116 TPS = 1,160 RPS → ×3 peak',
          result: '~1,160 RPS avg · ~3,500 RPS peak',
          notes: 'Terminal payments (SUCCEEDED/FAILED) are immutable and safely cached in Redis/read-replicas to isolate primary write DB.',
        },
        {
          metric: '7-Year Immutable Ledger Storage',
          formula: '10M/day × 365 × 7 yr = 25.55B payments × 2 KB',
          result: '~51.1 TB raw (~153 TB w/ 3× replication)',
          notes: 'Range-partition ledger_entries by month; archive partitions > 12 months to S3 Glacier with Object Lock (WORM) for 7-year audits.',
        },
        {
          metric: '24-Hour Idempotency Cache Memory',
          formula: '10M daily keys × 500 B (key + SHA-256 + cached response)',
          result: '~5.0 GB RAM',
          notes: 'Fits comfortably in a single HA Redis cluster backed by durable SQL unique index (merchant_id, idempotency_key) so cache eviction NEVER permits double charging!',
        },
        {
          metric: 'Daily T+1 Reconciliation Volume',
          formula: '10M settled payments × 300 B settlement record',
          result: '~3.0 GB/day batch file',
          notes: 'Processed in < 10 minutes via Spark/Flink outer-join against Ledger snapshot to flag any missing capture, orphan charge, or 1-cent fee mismatch.',
        },
      ],
    },
    apiAndDataModel: {
      endpoints: [
        {
          method: 'POST',
          path: '/api/v1/payment_intents',
          summary: 'Create & submit payment with mandatory Idempotency-Key header (validated against SHA-256 body hash)',
          payload: 'Headers: Idempotency-Key: uuid-991 · Body: { "amountCents": 4999, "currency": "USD", "merchantId": "m_42", "paymentMethodToken": "pm_tok_..." } → 200 { "paymentId": "pi_881", "status": "PENDING" }',
        },
        {
          method: 'POST',
          path: '/api/v1/webhooks/psp/{provider}',
          summary: 'Receive HMAC-SHA256 signed asynchronous capture/failure settlement events from external PSPs',
          payload: 'Headers: X-PSP-Signature: hmac... · Body: { "pspEventId": "evt_102", "paymentId": "pi_881", "outcome": "SUCCEEDED" } → 200 OK',
        },
        {
          method: 'GET',
          path: '/api/v1/payment_intents/{paymentId}',
          summary: 'Fetch authoritative payment state and double-entry ledger journal summary',
          payload: '200 { "paymentId": "pi_881", "status": "SUCCEEDED", "journalId": "jr_551", "settledAt": "..." }',
        },
      ],
      storageSchema: [
        {
          store: 'Payment Intents & Idempotency Store (ACID PostgreSQL / Spanner)',
          schema: 'idempotency_keys (merchant_id, idempotency_key PK, request_sha256 CHAR(64), status, response_json, expires_at)  |  payment_intents (payment_id PK, merchant_id, amount_cents BIGINT, currency, state ENUM[CREATED,PENDING,SUCCEEDED,FAILED], version INT)',
          shardingAndIndexing:
            'Co-located by merchant_id so atomic check-idempotency + create-payment + insert-outbox commits inside ONE single-shard ACID transaction. Optimistic locking (WHERE payment_id=? AND state=\'PENDING\' AND version=?) prevents out-of-order webhooks from corrupting terminal states.',
        },
        {
          store: 'Immutable Double-Entry Ledger (Append-Only SQL)',
          schema: 'ledger_journals (journal_id PK, payment_id UNIQUE, created_at)  |  ledger_entries (entry_id PK, journal_id FK, account_id, direction ENUM[DEBIT,CREDIT], amount_cents BIGINT CHECK(>0), created_at)',
          shardingAndIndexing:
            'DB trigger/application constraint enforces SUM(DEBIT) == SUM(CREDIT) per journal_id inside the commit transaction. Entries are strictly INSERT-only (REVOKE UPDATE, DELETE on ledger_entries); refunds post a new reversing journal. Hot merchant account balances use bucketed/async materialized rollups or advisory row locks.',
        },
      ],
    },
    architecture: {
      title: 'Payment System & Double-Entry Ledger — Interactive Architecture',
      summary: 'Explore idempotent ingress, ACID ledger + outbox commits, resilient PSP execution, webhook ingestion, and T+1 reconciliation',
      defaultSelectedNodeId: 'ledger-db',
      nodes: [
        {
          id: 'clients',
          label: 'Merchants / SDK',
          sublabel: 'Idempotency-Key',
          category: 'client',
          x: 14,
          y: 215,
          width: 132,
          height: 58,
          flows: ['write', 'read'],
          details: {
            role: 'Merchant backends and checkout SDKs initiating charges, refunds, and polling payment status.',
            dataFlow: 'Attaches a UUIDv4 Idempotency-Key header generated per checkout attempt before calling POST /payment_intents; tokenizes raw PAN card numbers at PCI-vault edge so raw cards never hit core services.',
            scalingStrategy: 'SDKs implement bounded exponential backoff with jitter reusing the EXACT same Idempotency-Key across network timeouts.',
            failureHandling: 'On 5xx or client socket timeout, retrying with the same Idempotency-Key guarantees either the cached original response or safe in-flight recovery — zero double charges.',
            techChoices: ['Stripe-Style SDK', 'PCI Card Tokenization', 'UUIDv4 Idempotency'],
          },
        },
        {
          id: 'gateway',
          label: 'API Gateway',
          sublabel: 'Auth · TLS · Rate Limit',
          category: 'edge',
          x: 202,
          y: 215,
          width: 154,
          height: 58,
          flows: ['write', 'read'],
          details: {
            role: 'Terminates mTLS/HTTPS, authenticates merchant API keys, enforces strict PCI boundary isolation, validates required Idempotency-Key headers, and rate-limits runaway retry storms.',
            dataFlow: 'Routes POST /payment_intents to Payment Service and GET /payment_intents/{id} + balance queries to Ledger & Recon Service.',
            scalingStrategy: 'Stateless multi-AZ Envoy fleet; isolates high-volume merchant dashboard reads from checkout write capacity pools.',
            failureHandling: 'Rejects malformed or missing Idempotency-Key immediately with HTTP 400; per-merchant circuit breakers prevent one broken merchant integration from exhausting DB connections.',
            techChoices: ['Envoy / Kong', 'mTLS + API Keys', 'PCI-DSS DMZ'],
          },
        },
        {
          id: 'payment-svc',
          label: 'Payment Service',
          sublabel: 'State Machine + Outbox',
          category: 'service',
          x: 398,
          y: 56,
          width: 166,
          height: 58,
          flows: ['write'],
          details: {
            role: 'Owns the Payment State Machine (CREATED → PENDING → SUCCEEDED/FAILED), validates Idempotency-Key + SHA-256 request fingerprint, and atomically commits payment intent + outbox event without holding DB locks across external PSP HTTP calls.',
            dataFlow: 'Acquires idempotency lock → validates SHA-256 payload match → runs single ACID transaction inserting payment_intents(PENDING) + outbox_events + pending authorization journal → returns deterministic response.',
            scalingStrategy: 'Horizontally stateless pods partitioned cleanly by merchant_id affinity; short microsecond DB transactions prevent connection-pool starvation.',
            failureHandling: 'If a client reuses an existing Idempotency-Key with a DIFFERENT amount or currency (SHA-256 mismatch), immediately rejects with HTTP 409 Conflict! If an identical request is currently in-flight, returns HTTP 409/425 Retry-After.',
            techChoices: ['Java / Go Core', 'State Machine Guard', 'Transactional Outbox'],
          },
        },
        {
          id: 'psp-executor',
          label: 'PSP Executor',
          sublabel: 'Stripe · Adyen · Retry',
          category: 'service',
          x: 398,
          y: 215,
          width: 166,
          height: 58,
          flows: ['write'],
          details: {
            role: 'Consumes Outbox payment events from Kafka and executes external card-network/PSP capture requests using smart multi-PSP routing and strict outbound PSP idempotency keys.',
            dataFlow: 'Reads payment_id from Kafka → selects healthiest PSP route (e.g., Adyen primary, Chase fallback) → sends POST /capture with psp_idempotency_key = payment_id → handles sync result or awaits async webhook.',
            scalingStrategy: 'Auto-scaled Kafka consumer pool partitioned by payment_id; bulkhead thread pools isolate slow PSP #1 from healthy PSP #2.',
            failureHandling: 'Critical rule: if a PSP call times out (unknown outcome!), NEVER blindly route to a second PSP (that would double-charge the card!). Instead, retry the SAME PSP with the SAME psp_idempotency_key or query PSP status API.',
            techChoices: ['Kafka Consumers', 'Resilience4j Bulkheads', 'Smart PSP Router'],
          },
        },
        {
          id: 'ledger-query',
          label: 'Ledger & Recon',
          sublabel: 'Balances + Audit Diff',
          category: 'service',
          x: 398,
          y: 384,
          width: 166,
          height: 58,
          flows: ['read', 'write'],
          details: {
            role: 'Verifies signed PSP Webhooks, posts final double-entry settlement journals into Ledger DB, serves merchant balance/status queries, and executes hourly/T+1 Reconciliation against PSP settlement files.',
            dataFlow: 'Ingests HMAC-verified webhook → transitions payment PENDING → SUCCEEDED/FAILED (optimistic lock) + inserts balanced DEBIT/CREDIT journal entries → compares T+1 S3 settlement files against DB ledger.',
            scalingStrategy: 'Webhook ingestion workers scale independently from read query pods; batch reconciliation runs on Spark/Flink reading from a dedicated DB read replica.',
            failureHandling: 'Deduplicates redelivered webhooks via UNIQUE(psp_event_id); rejects out-of-order stale events using monotonic state transitions (terminal states are immutable). Pages on-call automatically if reconciliation detects any mismatch.',
            techChoices: ['HMAC Webhook Verifier', 'Apache Spark Recon', 'Read Replicas'],
          },
        },
        {
          id: 'idemp-store',
          label: 'Idempotency Store',
          sublabel: 'Key + SHA256 + Response',
          category: 'cache',
          x: 700,
          y: 20,
          width: 208,
          height: 54,
          flows: ['write'],
          details: {
            role: 'Fast-path idempotency coordination layer storing (merchant_id, idempotency_key) → {request_sha256, lock_state, cached_response} with atomic SET NX + durable SQL unique-constraint backing.',
            dataFlow: 'Checked first by Payment Service: cache HIT with matching SHA-256 replays the exact cached HTTP 200/4xx JSON response without touching downstream PSPs; SHA-256 mismatch triggers 409 Conflict.',
            scalingStrategy: 'Clustered Redis (5 GB covers 24h of 10M keys) paired with durable PostgreSQL idempotency_keys table for 72h+ authoritative guarantees.',
            failureHandling: 'Redis is ONLY a latency/in-flight lock optimization — the authoritative UNIQUE(merchant_id, idempotency_key) constraint in ACID SQL guarantees zero double charges even if Redis fails over or evicts a key!',
            techChoices: ['Redis SET NX PX', 'SQL UNIQUE Backup', 'SHA-256 Fingerprint'],
          },
        },
        {
          id: 'ledger-db',
          label: 'Double-Entry DB',
          sublabel: 'ACID Postgres / Spanner',
          category: 'database',
          x: 700,
          y: 112,
          width: 208,
          height: 54,
          flows: ['write', 'read'],
          details: {
            role: 'Authoritative ACID system of record storing payment_intents, idempotency_keys, outbox_events, and the strictly append-only Double-Entry Ledger (ledger_journals + ledger_entries).',
            dataFlow: 'Every settled $100 payment (with $3 platform fee) atomically inserts balanced entries: DEBIT Clearing $100 | CREDIT Merchant $97 | CREDIT PlatformRevenue $3 → SUM(DEBIT) == SUM(CREDIT) == $100.',
            scalingStrategy: 'Sharded by merchant_id (or globally ACID CockroachDB / Cloud Spanner); monthly range partitions keep hot B-Trees in RAM while older partitions archive to cold WORM storage.',
            failureHandling: 'Synchronous multi-AZ replication (RPO = 0 — ZERO committed transaction loss on AZ failure!). High-contention platform fee accounts use sharded sub-accounts (e.g., 64 fee buckets summed at read time) to prevent row-lock hotspots.',
            techChoices: ['PostgreSQL / Spanner', 'Sync Multi-AZ (RPO=0)', 'Append-Only Ledger'],
          },
        },
        {
          id: 'kafka-outbox',
          label: 'Kafka + Outbox',
          sublabel: 'Ordered Payment Events',
          category: 'queue',
          x: 700,
          y: 212,
          width: 208,
          height: 54,
          flows: ['write'],
          details: {
            role: 'Reliably bridges ACID database commits to asynchronous PSP execution and downstream fraud/receipt consumers via Change Data Capture (Debezium) tailing the SQL outbox_events table.',
            dataFlow: 'Payment Service commits payment + outbox row in ONE DB transaction → Debezium streams WAL into Kafka topic payments.execute partitioned by payment_id → PSP Executor consumes.',
            scalingStrategy: 'Partitioned by payment_id (preserving per-payment ordering) with RF=3 and min.insync.replicas=2.',
            failureHandling: 'Eliminates the dual-write bug completely: if Payment Service crashes right after DB commit, Debezium still publishes the outbox row to Kafka once healthy; if DB rolls back, no phantom Kafka message is ever emitted.',
            techChoices: ['Debezium CDC', 'Apache Kafka (RF=3)', 'Dead-Letter Queue'],
          },
        },
        {
          id: 'ext-psp',
          label: 'External PSPs',
          sublabel: 'Card Networks + Webhooks',
          category: 'edge',
          x: 700,
          y: 314,
          width: 208,
          height: 54,
          flows: ['write'],
          details: {
            role: 'External acquiring banks and card networks (Visa, Mastercard, Adyen, Stripe, Chase Paymentech) executing actual funds authorization, capture, and clearing.',
            dataFlow: 'Receives idempotent capture API calls from PSP Executor; pushes asynchronous HMAC-signed settlement/chargeback webhooks back to Ledger & Recon and drops nightly T+1 batch clearing files.',
            scalingStrategy: 'Multi-PSP active-active routing distributes traffic across acquirers and provides regional fee optimization + outage resilience.',
            failureHandling: 'Unreliable third-party latency/timeouts handled via bounded retries with identical psp_idempotency_key; dropped webhooks are healed automatically by polling stuck PENDING payments (>5m) and T+1 reconciliation.',
            techChoices: ['Visa / Mastercard Rails', 'Multi-Acquirer Routing', 'Signed Webhooks'],
          },
        },
        {
          id: 'recon-store',
          label: 'Settlement S3',
          sublabel: 'T+1 PSP Files + Alerts',
          category: 'storage',
          x: 700,
          y: 416,
          width: 208,
          height: 54,
          flows: ['read'],
          details: {
            role: 'Three-way financial safety net storing raw external PSP settlement reports (T+1 CSV/ISO-20022), bank statements, reconciliation diff reports, and immutable 7-year compliance archives.',
            dataFlow: 'External PSPs upload daily clearing files → Ledger & Recon runs three-way outer join (Internal Ledger vs. PSP File vs. Bank Deposit) → auto-heals missed webhooks or opens PagerDuty/ops adjustment tickets.',
            scalingStrategy: 'Object storage scales effortlessly to petabytes with lifecycle policies moving >1yr ledger snapshots to S3 Glacier with WORM Object Lock.',
            failureHandling: 'Catches silent bugs that unit tests miss: orphaned captures where PSP charged the card after our timeout, wrong interchange fee deductions, or duplicate bank payouts.',
            techChoices: ['Amazon S3 + Object Lock', 'ISO-20022 / CSV Files', '3-Way Recon Alerts'],
          },
        },
      ],
      edges: [
        { id: 'pm-1', from: 'clients', to: 'gateway', label: 'HTTPS', flow: 'both' },
        { id: 'pm-2', from: 'gateway', to: 'payment-svc', label: 'POST /pay', flow: 'write', labelT: 0.46 },
        { id: 'pm-3', from: 'gateway', to: 'ledger-query', label: 'GET Status', flow: 'read', labelT: 0.46 },
        { id: 'pm-4', from: 'payment-svc', to: 'idemp-store', label: 'Lock Key', flow: 'write', labelT: 0.50 },
        { id: 'pm-5', from: 'payment-svc', to: 'ledger-db', label: 'ACID Tx', flow: 'write', labelT: 0.50 },
        { id: 'pm-6', from: 'payment-svc', to: 'kafka-outbox', label: 'Outbox', flow: 'write', async: true, labelT: 0.70 },
        {
          id: 'pm-7',
          from: 'kafka-outbox',
          to: 'psp-executor',
          label: 'Consume',
          flow: 'write',
          async: true,
          fromSide: 'left',
          toSide: 'right',
          labelT: 0.56,
        },
        { id: 'pm-8', from: 'psp-executor', to: 'ext-psp', label: 'Capture', flow: 'write', labelT: 0.66 },
        {
          id: 'pm-9',
          from: 'ext-psp',
          to: 'ledger-query',
          label: 'Webhook',
          flow: 'write',
          async: true,
          fromSide: 'left',
          toSide: 'right',
          labelT: 0.55,
        },
        { id: 'pm-10', from: 'ledger-query', to: 'ledger-db', label: 'Ledger R/W', flow: 'both', labelT: 0.36 },
        { id: 'pm-11', from: 'ledger-query', to: 'recon-store', label: 'T+1 Recon', flow: 'read', async: true, labelT: 0.50 },
      ],
    },
    tradeOffs: [
      {
        topic: 'Ledger Data Model: Single Mutable Balance Column vs. Immutable Double-Entry Ledger',
        context: 'We need real-time merchant balance reads, split fees, refunds, chargebacks, and strict SOX/financial audit trails.',
        options: [
          {
            name: 'Single Mutable Balance Column (UPDATE accounts SET balance = balance + 97)',
            pros: ['Simple schema and O(1) balance reads'],
            cons: [
              'Destroys audit history — impossible to prove WHY a balance changed or trace a $0.03 rounding bug six months later',
              'Vulnerable to lost updates, race conditions, and silent drift because there is no self-checking zero-sum invariant',
            ],
            whenToChoose: 'Non-financial toy counters (e.g., arcade points or game XP) where audits do not exist.',
          },
          {
            name: 'Append-Only Double-Entry Ledger (SUM(DEBIT) == SUM(CREDIT)) + Materialized Account Balances',
            recommended: true,
            pros: [
              'Every single cent has a source and destination — mathematical zero-sum check catches accounting bugs at commit time',
              '100% immutable audit trail: refunds and chargebacks post explicit reversing journals without erasing history',
              'Supports multi-leg splits (Merchant + Platform Fee + Tax + PSP Fee) in a single atomic journal',
            ],
            cons: ['Higher row count (~4× writes) and requires careful sharding/bucketing for ultra-hot platform revenue accounts'],
            whenToChoose: 'Every production payment gateway, digital wallet, marketplace, or fintech ledger.',
          },
        ],
        seniorVerdict:
          'Always design an immutable Double-Entry Ledger as the single source of truth, and treat any cached balance column strictly as a derived materialized view backed by ledger_entries. Mention sharding hot system accounts (e.g., Platform_Fee_Bucket_0..63) to avoid lock contention!',
      },
      {
        topic: 'External PSP Call Architecture: Inside DB Transaction vs. Transactional Outbox + Async Webhooks',
        context: 'External card networks take 300 ms–10 s and occasionally time out with an ambiguous outcome.',
        options: [
          {
            name: 'Synchronous PSP HTTP Call Inside an Open SQL Transaction',
            pros: ['Linear imperative code that looks easy on a whiteboard'],
            cons: [
              'Catastrophic DB connection-pool exhaustion: if Visa stalls for 8 seconds, all 200 DB connections hang holding row locks, taking down the entire platform!',
              'If the pod crashes right after Visa captures the card but before SQL COMMIT, the customer is charged with ZERO record in our database',
            ],
            whenToChoose: 'NEVER in a production payment system.',
          },
          {
            name: 'Commit PENDING + Outbox First → Execute PSP Outside DB Tx → Finalize via Webhook + Poller',
            recommended: true,
            pros: [
              'DB transactions hold locks for < 5 ms regardless of external PSP slowness or outages',
              'Zero dual-write gap: if PSP captures the card and our worker crashes, the payment_id is already durably recorded as PENDING and recovered by webhook/reconciliation',
              'Passing payment_id as psp_idempotency_key makes retries across network timeouts completely safe',
            ],
            cons: ['Requires designing a clean finite state machine (CREATED → PENDING → SUCCEEDED/FAILED) and handling async webhooks'],
            whenToChoose: 'Every reliable payment processor integrating with third-party financial networks.',
          },
        ],
        seniorVerdict:
          'Never hold a database transaction open across an external network RPC. Persist intent (PENDING) + outbox atomically first, invoke the PSP out-of-band with an idempotency key, and treat T+1 Reconciliation as the mandatory final backstop for silent failures.',
      },
      {
        topic: 'Concurrency Control on Hot Accounts: Pessimistic SELECT FOR UPDATE vs. Optimistic Locking vs. Bucketed Accounts',
        context: 'A viral flash-sale merchant or the global Platform_Fee account receives hundreds of concurrent credits per second.',
        options: [
          {
            name: 'Pessimistic Row Lock (SELECT ... FOR UPDATE) on Single Balance Row',
            pros: ['Guaranteed serializable updates with zero retry waste under light-to-moderate contention'],
            cons: [
              'Serializes ALL transactions touching the global Platform_Fee account into a single-threaded queue (~300–500 TPS ceiling) and risks deadlocks unless accounts are locked in strict sorted account_id order',
            ],
            whenToChoose: 'Individual buyer wallets or low-TPS merchant accounts (always acquire locks in ascending account_id order to prevent AB-BA deadlocks!).',
          },
          {
            name: 'Optimistic Concurrency (version check) + Sharded Sub-Accounts for Hot Platform Ledgers',
            recommended: true,
            pros: [
              'Split global Platform_Fee / Clearing accounts into K = 64 sub-account shards (fee_bucket_0..63), multiplying write throughput 64× with zero row contention',
              'Optimistic version checks on payment_intents guarantee idempotent, monotonic state transitions (PENDING → SUCCEEDED) without long locks',
              'Append-only ledger_entries inserts need NO row locks at all — only balance snapshots contend',
            ],
            cons: ['Reading total Platform_Fee balance sums 64 bucket rows (trivial O(64) query)'],
            whenToChoose: 'High-throughput payment platforms combining strict per-wallet safety with flash-sale scale.',
          },
        ],
        seniorVerdict:
          'Use strict sorted-order row locks (or SERIALIZABLE/optimistic version checks) for user debit checks where overdrafts must be prevented, combine with strictly append-only ledger_entries, and shard hot platform/clearing accounts across K buckets to eliminate lock hotspots.',
      },
    ],
  },
};
