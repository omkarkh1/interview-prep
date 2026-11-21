import type { DayCurriculum } from '@/types/curriculum';

export const day3: DayCurriculum = {
  dayNumber: 3,
  title: 'Trees, BST & Tries',
  theme: 'Post-Order Signals, Invariant Bounds, Prefix Pruning & Resilient Async Delivery',
  status: 'complete',
  estimatedMinutes: 125,
  summary:
    'Master bottom-up tree signal propagation, sentinel serialization, negative-clamped Tree DP, top-down BST range invariants, and pruned Trie grid search; design a concurrent partitioned Pub-Sub Message Queue in Java; and architect a multi-channel Notification System with priority queues, deduplication, and vendor failover.',
  dsaLessons: [
    /* ================================================================
     * DSA 1: LOWEST COMMON ANCESTOR OF A BINARY TREE
     * ================================================================ */
    {
      id: 'day3-lca-binary-tree',
      dayNumber: 3,
      kind: 'dsa',
      title: 'Lowest Common Ancestor of a Binary Tree',
      subtitle: 'Post-order bottom-up signal propagation handling split-subtree and ancestor-descendant cases',
      difficulty: 'Medium',
      patterns: ['Post-Order DFS', 'Bottom-Up Signal Propagation', 'Divide & Conquer'],
      estimatedMinutes: 13,
      leetcodeRef: 'LC #236',
      problemStatement:
        'Given the root of a binary tree and two distinct nodes p and q guaranteed to exist in the tree, return their Lowest Common Ancestor (LCA): the deepest node that has both p and q as descendants (where a node is allowed to be a descendant of itself).',
      exampleSummary: {
        input: 'Tree = [3, 5, 1, 6, 2, 0, 8], p = 6, q = 0 (split) and p = 5, q = 2 (ancestor)',
        output: '3 (split-subtree) and 5 (ancestor-descendant)',
        explanation:
          'Nodes 6 and 0 reside in opposite subtrees of root 3, so both child calls return non-null at node 3. For p = 5 and q = 2, DFS short-circuits at 5 and bubbles 5 upward because the opposite subtree returns null.',
      },
      patternRecognition: {
        interviewCue:
          'Ask: "Does a parent’s decision depend on whether targets were found in its left subtree, its right subtree, or both?" When a node acts as a convergence junction for signals arriving from below, reach for single-pass post-order DFS returning the found node or resolved LCA.',
        signals: [
          'Unordered binary tree (NOT a BST) — cannot discard half the tree by value comparison',
          'Both target nodes p and q are guaranteed present in the tree',
          'A node can be an ancestor of itself (crucial for early-return short-circuiting)',
        ],
        mentalModel:
          'Every recursive call lca(u, p, q) answers: "If my subtree contains BOTH p and q, return their LCA; if it contains ONLY ONE of them, bubble that found node upward; if it contains NEITHER, return null." The unique node receiving non-null from BOTH left and right is the split-subtree LCA.',
      },
      intuitionComparison: {
        bruteForce: {
          approach:
            'Run two separate DFS traversals to record the full root-to-p path and root-to-q path in two Lists, then scan both lists from index 0 to find the last matching node.',
          timeComplexity: 'O(n)',
          spaceComplexity: 'O(n) for explicit path lists + recursion stack',
          bottleneck:
            'Performs redundant traversals and allocates two extra O(h) path lists (or a full parent HashMap) instead of resolving convergence inline during a single unwind.',
        },
        optimal: {
          approach:
            'Single post-order DFS: return root immediately if root == null || root == p || root == q; recurse left and right; if both are non-null return root, else forward whichever child is non-null.',
          timeComplexity: 'O(n)',
          spaceComplexity: 'O(h) call stack (O(log n) balanced, O(n) skewed)',
          keyInvariant:
            'Because p and q are guaranteed to exist in the tree, returning early upon hitting p (when q lies inside p’s subtree) still produces the exact LCA p once the sibling branch returns null.',
        },
      },
      visualizer: {
        kind: 'tree-graph',
        title: 'Post-Order LCA Signal Propagation (Split-Subtree & Ancestor Cases)',
        inputSummary: 'Tree = [3, 5, 1, 6, 2, 0, 8] · Case A: (6, 0) → 3 · Case B: (5, 2) → 5',
        viewBoxWidth: 760,
        viewBoxHeight: 340,
        nodes: [
          { id: 'n3', label: '3', x: 380, y: 44 },
          { id: 'n5', label: '5', x: 190, y: 142 },
          { id: 'n1', label: '1', x: 570, y: 142 },
          { id: 'n6', label: '6', x: 95, y: 250 },
          { id: 'n2', label: '2', x: 285, y: 250 },
          { id: 'n0', label: '0', x: 475, y: 250 },
          { id: 'n8', label: '8', x: 665, y: 250 },
        ],
        edges: [
          { from: 'n3', to: 'n5' },
          { from: 'n3', to: 'n1' },
          { from: 'n5', to: 'n6' },
          { from: 'n5', to: 'n2' },
          { from: 'n1', to: 'n0' },
          { from: 'n1', to: 'n8' },
        ],
        steps: [
          {
            caption:
              'Case A (Split-Subtree: p = 6, q = 0). Post-order DFS descends 3 → 5 → 6. Node 6 matches p! Base case triggers immediately and returns signal 6 upward.',
            formula: 'node == p (6)  →  short-circuit & return 6',
            activeNodeId: 'n6',
            visitedNodeIds: ['n6'],
            activeEdges: [
              { from: 'n3', to: 'n5' },
              { from: 'n5', to: 'n6' },
            ],
            nodeStates: {
              n6: 'HIT p → ret 6',
            },
            variables: [
              { name: 'case', value: 'A: Split (6, 0)' },
              { name: 'active', value: '6 (p)', tone: 'primary' },
              { name: 'return', value: '6', tone: 'emerald' },
            ],
          },
          {
            caption:
              'Check 5’s right child (node 2): neither 6 nor 0 exists in its subtree, so node 2 returns null.',
            formula: 'lca(2): left = null, right = null  →  return null',
            activeNodeId: 'n2',
            visitedNodeIds: ['n6', 'n2'],
            activeEdges: [{ from: 'n5', to: 'n2' }],
            nodeStates: {
              n6: 'ret 6',
              n2: 'ret null',
            },
            variables: [
              { name: 'case', value: 'A: Split (6, 0)' },
              { name: 'active', value: '2' },
              { name: 'return', value: 'null' },
            ],
          },
          {
            caption:
              'Unwind to node 5 with left = 6, right = null. Only one branch reported a target, so node 5 forwards the non-null signal 6 up to root 3.',
            formula: 'lca(5): L = 6, R = null  →  forward 6',
            activeNodeId: 'n5',
            dependencyNodeIds: ['n6', 'n2'],
            visitedNodeIds: ['n6', 'n2', 'n5'],
            activeEdges: [
              { from: 'n5', to: 'n6' },
              { from: 'n5', to: 'n2' },
            ],
            nodeStates: {
              n6: 'ret 6',
              n2: 'ret null',
              n5: 'L=6, R=∅ → 6',
            },
            variables: [
              { name: 'left(5)', value: '6', tone: 'emerald' },
              { name: 'right(5)', value: 'null' },
              { name: 'return', value: '6', tone: 'primary' },
            ],
          },
          {
            caption:
              'Now explore root 3’s right subtree: node 1 visits left child 0 (matches q → returns 0!) and right child 8 (returns null). Node 1 forwards non-null signal 0 upward.',
            formula: 'lca(1): L = 0 (HIT q), R = null  →  forward 0',
            activeNodeId: 'n1',
            dependencyNodeIds: ['n0', 'n8'],
            visitedNodeIds: ['n6', 'n2', 'n5', 'n0', 'n8', 'n1'],
            activeEdges: [
              { from: 'n1', to: 'n0' },
              { from: 'n1', to: 'n8' },
            ],
            nodeStates: {
              n5: 'ret 6',
              n0: 'HIT q → ret 0',
              n8: 'ret null',
              n1: 'L=0, R=∅ → 0',
            },
            variables: [
              { name: 'left(1)', value: '0 (q)', tone: 'emerald' },
              { name: 'right(1)', value: 'null' },
              { name: 'return', value: '0', tone: 'primary' },
            ],
          },
          {
            caption:
              'Split-Subtree Convergence at root 3! BOTH left (6) and right (0) are non-null. Because p and q split across opposite sides of 3, node 3 is the exact LCA!',
            formula: 'lca(3): L = 6 ≠ null AND R = 0 ≠ null  →  LCA = 3!',
            activeNodeId: 'n3',
            dependencyNodeIds: ['n5', 'n1'],
            visitedNodeIds: ['n6', 'n2', 'n5', 'n0', 'n8', 'n1', 'n3'],
            highlightedNodeIds: ['n3', 'n6', 'n0'],
            activeEdges: [
              { from: 'n3', to: 'n5' },
              { from: 'n3', to: 'n1' },
            ],
            nodeStates: {
              n5: 'ret 6',
              n1: 'ret 0',
              n6: 'target p',
              n0: 'target q',
              n3: 'L=6, R=0 → LCA!',
            },
            variables: [
              { name: 'left(3)', value: '6', tone: 'emerald' },
              { name: 'right(3)', value: '0', tone: 'emerald' },
              { name: 'LCA(6, 0)', value: '3', tone: 'emerald' },
            ],
          },
          {
            caption:
              'Case B (Ancestor-Descendant: p = 5, q = 2). Reset! Descending from 3 to 5 immediately hits node == p (5). Short-circuit and return 5 WITHOUT visiting 6 or 2!',
            formula: 'node == p (5)  →  early return 5 (2 stays unvisited)',
            activeNodeId: 'n5',
            visitedNodeIds: ['n5'],
            activeEdges: [{ from: 'n3', to: 'n5' }],
            nodeStates: {
              n5: 'HIT p → ret 5',
              n2: 'q (unvisited)',
            },
            variables: [
              { name: 'case', value: 'B: Ancestor (5, 2)' },
              { name: 'active', value: '5 (p)', tone: 'amber' },
              { name: 'return', value: '5 (early!)', tone: 'amber' },
            ],
          },
          {
            caption:
              'Root 3 checks right subtree (1 → 0, 8): neither 5 nor 2 appears anywhere in right subtree, so node 1 returns null.',
            formula: 'lca(1): neither 5 nor 2 found  →  return null',
            activeNodeId: 'n1',
            dependencyNodeIds: ['n0', 'n8'],
            visitedNodeIds: ['n5', 'n0', 'n8', 'n1'],
            activeEdges: [
              { from: 'n1', to: 'n0' },
              { from: 'n1', to: 'n8' },
            ],
            nodeStates: {
              n5: 'ret 5',
              n2: 'q inside 5',
              n0: 'ret null',
              n8: 'ret null',
              n1: 'ret null',
            },
            variables: [
              { name: 'left(3)', value: '5' },
              { name: 'right(3)', value: 'null' },
            ],
          },
          {
            caption:
              'Root 3 receives L = 5, R = null and forwards 5! Since q = 2 exists in the tree and was NOT in R, q MUST be a descendant of 5 — proving early return 5 is the exact LCA!',
            formula: 'lca(3): L = 5, R = null  →  return 5 (Ancestor LCA!)',
            activeNodeId: 'n3',
            dependencyNodeIds: ['n5', 'n1'],
            visitedNodeIds: ['n5', 'n0', 'n8', 'n1', 'n3'],
            highlightedNodeIds: ['n5', 'n2'],
            activeEdges: [
              { from: 'n3', to: 'n5' },
              { from: 'n3', to: 'n1' },
            ],
            nodeStates: {
              n5: 'LCA = 5!',
              n2: 'descendant q',
              n1: 'ret null',
              n3: 'L=5, R=∅ → 5',
            },
            variables: [
              { name: 'left(3)', value: '5', tone: 'emerald' },
              { name: 'right(3)', value: 'null' },
              { name: 'LCA(5, 2)', value: '5', tone: 'emerald' },
            ],
          },
        ],
      },
      javaSolution: {
        filename: 'LowestCommonAncestor.java',
        code: `public class LowestCommonAncestor {
    public static class TreeNode {
        int val;
        TreeNode left;
        TreeNode right;
        TreeNode(int val) { this.val = val; }
    }

    public TreeNode lowestCommonAncestor(TreeNode root, TreeNode p, TreeNode q) {
        // Base case: empty branch or hit either target (handles ancestor-descendant case)
        if (root == null || root == p || root == q) {
            return root;
        }

        TreeNode left = lowestCommonAncestor(root.left, p, q);
        TreeNode right = lowestCommonAncestor(root.right, p, q);

        // Both subtrees reported a target -> current node is the split-subtree LCA
        if (left != null && right != null) {
            return root;
        }

        // Otherwise bubble up whichever non-null signal (target or resolved LCA) was found
        return left != null ? left : right;
    }
}`,
        callouts: [
          {
            id: 'lca-base',
            startLine: 11,
            endLine: 13,
            title: 'Reference Equality & Early Short-Circuit',
            explanation:
              'Comparing root == p || root == q uses object identity (safe even if node values were not unique). Returning early works ONLY because p and q are guaranteed to exist in the tree; if q is under p, the sibling subtree returns null and p naturally bubbles to the root.',
            accent: 'amber',
          },
          {
            id: 'lca-postorder',
            startLine: 15,
            endLine: 16,
            title: 'Post-Order Divide & Conquer',
            explanation:
              'Both child subtrees are queried before evaluating root so the parent receives exact presence/LCA signals from below.',
            accent: 'primary',
          },
          {
            id: 'lca-converge',
            startLine: 19,
            endLine: 24,
            title: 'Split Convergence vs. Single-Branch Forwarding',
            explanation:
              'If left != null && right != null, p and q live in opposite subtrees, making root the unique deepest convergence point. Otherwise, return whichever side is non-null to preserve either a single found target or an already-resolved LCA deeper down.',
            accent: 'emerald',
          },
        ],
      },
      complexity: {
        time: 'O(n)',
        space: 'O(h)',
        timeExplanation:
          'Each node in the binary tree is visited at most once in post-order traversal doing O(1) work per node.',
        spaceExplanation:
          'Recursion call stack depth equals tree height h: O(log n) for balanced trees, O(n) worst case for a skewed chain.',
      },
      edgeCases: [
        {
          title: 'Follow-Up (LC #1644): What If p or q Might NOT Exist in the Tree?',
          scenario: 'If p = 5 exists and q = 99 is absent, standard LC #236 early-returns 5 instead of null!',
          handling:
            'Remove the early return on root == p || root == q! Always recurse into BOTH children first (true post-order), track boolean foundP and foundQ flags, and return (foundP && foundQ) ? candidate : null.',
        },
        {
          title: 'Follow-Up (LC #235 & #1650): BST or Parent Pointers',
          scenario: 'Interviewer adds ordering (BST) or a TreeNode.parent pointer.',
          handling:
            'For a BST, walk iteratively down from root in O(h) time / O(1) space (go left if both < cur, right if both > cur, else split!). With parent pointers, solve identically to Intersection of Two Linked Lists in O(h) time / O(1) space.',
        },
        {
          title: 'Follow-Up: Q = 10⁵ Repeated LCA Queries on a Static Tree',
          scenario: 'Running O(n) DFS per query yields O(Q · n) TLE.',
          handling:
            'Precompute Binary Lifting table up[node][k] (2^k-th ancestor) + depth[] in O(n log n), then equalize depths and jump powers of two to answer every LCA query in O(log n).',
        },
      ],
    },

    /* ================================================================
     * DSA 2: SERIALIZE AND DESERIALIZE BINARY TREE
     * ================================================================ */
    {
      id: 'day3-serialize-deserialize-tree',
      dayNumber: 3,
      kind: 'dsa',
      title: 'Serialize and Deserialize Binary Tree',
      subtitle: 'Preorder DFS encoding with "#" null sentinels and O(n) cursor-driven stream reconstruction',
      difficulty: 'Hard',
      patterns: ['Preorder DFS', 'Null Sentinel Encoding', 'Streaming Deserialization'],
      estimatedMinutes: 15,
      leetcodeRef: 'LC #297',
      problemStatement:
        'Design an algorithm to serialize a binary tree into a string and deserialize that string back into the exact original tree structure, preserving null branches and arbitrary positive/negative node values.',
      exampleSummary: {
        input: 'root = [1, 2, 3, null, null, 4, 5]',
        output: '"1,2,#,#,3,4,#,#,5,#,#" → exact reconstructed tree',
        explanation:
          'Preorder traversal emits every node value before its subtrees and marks every null child with "#". Exactly n + 1 null sentinels uniquely determine where every subtree ends during decoding.',
      },
      patternRecognition: {
        interviewCue:
          'Remember: a single traversal (preorder, inorder, or postorder) WITHOUT null markers is ambiguous — multiple distinct trees produce the same list. Adding explicit "#" null sentinels makes Preorder DFS (or Level-Order BFS) 100% bijective in O(n) time and space.',
        signals: [
          'Codec / round-trip persistence / transmitting trees over RPC or disk',
          'Need unambiguous structural reconstruction including skewed or sparse trees',
          'Every n-node binary tree has exactly n + 1 null child links → output size is strictly 2n + 1 tokens',
        ],
        mentalModel:
          'Preorder emits [root, ...leftSubtree, ...rightSubtree]. During deserialization, maintain a single forward cursor over the token array: read one token — if "#" return null; otherwise construct node, recursively build node.left (advancing cursor through the entire left subtree), then build node.right!',
      },
      intuitionComparison: {
        bruteForce: {
          approach:
            'Heap-index array representation (storing node i’s children at 2i+1 and 2i+2) or storing both Preorder and Inorder traversals.',
          timeComplexity: 'O(2^h) for heap-index on skewed trees; O(n) for pre+in (breaks on duplicate values!)',
          spaceComplexity: 'O(2^h) exponential blowup on a 30-node right-skewed chain',
          bottleneck:
            'Array-index encoding wastes exponential space on sparse trees, and Preorder+Inorder fails completely whenever the tree contains duplicate node values.',
        },
        optimal: {
          approach:
            'Preorder DFS serialization into a StringBuilder with "," delimiters and "#" null sentinels; deserialize recursively via a single shared index cursor over split tokens.',
          timeComplexity: 'O(n) serialize & O(n) deserialize',
          spaceComplexity: 'O(n) serialized payload + O(h) recursion stack',
          keyInvariant:
            'Every recursive build(tokens, cursor) call consumes the EXACT contiguous token slice belonging to its subtree and leaves cursor[0] pointing at the first token of the next sibling subtree.',
        },
      },
      visualizer: {
        kind: 'tree-graph',
        title: 'Preorder "#" Sentinel Encoding & Cursor Reconstruction Dry Run',
        inputSummary: 'Tree = [1, 2, 3, null, null, 4, 5] ⇔ "1,2,#,#,3,4,#,#,5,#,#"',
        viewBoxWidth: 760,
        viewBoxHeight: 340,
        nodes: [
          { id: 'n1', label: '1', x: 380, y: 44 },
          { id: 'n2', label: '2', x: 200, y: 144 },
          { id: 'n3', label: '3', x: 550, y: 144 },
          { id: 'n4', label: '4', x: 445, y: 250 },
          { id: 'n5', label: '5', x: 655, y: 250 },
        ],
        edges: [
          { from: 'n1', to: 'n2' },
          { from: 'n1', to: 'n3' },
          { from: 'n3', to: 'n4' },
          { from: 'n3', to: 'n5' },
        ],
        steps: [
          {
            caption:
              'SERIALIZE Step 1: Preorder visits root 1 first, appends "1," to StringBuilder, and descends into 1.left.',
            formula: 'emit("1") → recurse(1.left)',
            activeNodeId: 'n1',
            visitedNodeIds: ['n1'],
            activeEdges: [{ from: 'n1', to: 'n2' }],
            nodeStates: {
              n1: 'emit "1"',
            },
            variables: [
              { name: 'phase', value: 'Serialize', tone: 'primary' },
              { name: 'stream', value: '"1"' },
            ],
          },
          {
            caption:
              'SERIALIZE Step 2: Visit leaf 2 → emit "2". Both 2.left and 2.right are null, so emit two "#" sentinels! Those "#,#" markers seal node 2’s entire subtree.',
            formula: 'emit("2") → L=null ("#") → R=null ("#")',
            activeNodeId: 'n2',
            visitedNodeIds: ['n1', 'n2'],
            activeEdges: [{ from: 'n1', to: 'n2' }],
            nodeStates: {
              n1: 'emit "1"',
              n2: 'emit "2,#,#"',
            },
            variables: [
              { name: 'phase', value: 'Serialize', tone: 'primary' },
              { name: 'stream', value: '"1,2,#,#"', tone: 'amber' },
            ],
          },
          {
            caption:
              'SERIALIZE Step 3: Unwind to 1 and descend 1.right → node 3. Emit "3" and recurse into 3.left (node 4).',
            formula: 'emit("3") → recurse(3.left = 4)',
            activeNodeId: 'n3',
            visitedNodeIds: ['n1', 'n2', 'n3'],
            activeEdges: [
              { from: 'n1', to: 'n3' },
              { from: 'n3', to: 'n4' },
            ],
            nodeStates: {
              n1: 'emit "1"',
              n2: 'emit "2,#,#"',
              n3: 'emit "3"',
            },
            variables: [
              { name: 'phase', value: 'Serialize', tone: 'primary' },
              { name: 'stream', value: '"1,2,#,#,3"' },
            ],
          },
          {
            caption:
              'SERIALIZE Step 4: Leaf 4 emits "4,#,#", then leaf 5 emits "5,#,#". Serialization finishes with 5 values + 6 "#" sentinels = 11 tokens (2n + 1).',
            formula: 'Final Stream = "1,2,#,#,3,4,#,#,5,#,#" (2·5 + 1 = 11 tokens)',
            activeNodeId: 'n5',
            dependencyNodeIds: ['n4'],
            visitedNodeIds: ['n1', 'n2', 'n3', 'n4', 'n5'],
            highlightedNodeIds: ['n1', 'n2', 'n3', 'n4', 'n5'],
            activeEdges: [
              { from: 'n3', to: 'n4' },
              { from: 'n3', to: 'n5' },
            ],
            nodeStates: {
              n1: 'idx 0: "1"',
              n2: 'idx 1..3: "2,#,#"',
              n3: 'idx 4: "3"',
              n4: 'idx 5..7: "4,#,#"',
              n5: 'idx 8..10: "5,#,#"',
            },
            variables: [
              { name: 'phase', value: 'Encoded ✓', tone: 'emerald' },
              { name: 'tokens', value: '11 (5 vals + 6 #)', tone: 'emerald' },
            ],
          },
          {
            caption:
              'DESERIALIZE Step 5: Split stream into tokens[] with cursor idx = 0. Consume tokens[0]="1" to allocate root 1, then immediately recurse for 1.left consuming tokens[1]="2".',
            formula: 'tokens[0]="1" → new Node(1)  |  tokens[1]="2" → 1.left = Node(2)',
            activeNodeId: 'n2',
            visitedNodeIds: ['n1', 'n2'],
            activeEdges: [{ from: 'n1', to: 'n2' }],
            nodeStates: {
              n1: 'built (idx 0)',
              n2: 'built (idx 1)',
            },
            variables: [
              { name: 'phase', value: 'Deserialize', tone: 'amber' },
              { name: 'cursor', value: 'idx = 2' },
              { name: 'nextToken', value: '"#"' },
            ],
          },
          {
            caption:
              'DESERIALIZE Step 6: Build 2.left reads tokens[2]="#" → null; 2.right reads tokens[3]="#" → null! Node 2 finishes and returns to 1.left — cursor now sits cleanly at idx = 4 ("3")!',
            formula: '2.left = "#" (null), 2.right = "#" (null) → unwind to 1.right (idx=4)',
            activeNodeId: 'n2',
            visitedNodeIds: ['n1', 'n2'],
            nodeStates: {
              n1: 'waiting R',
              n2: 'L=#, R=# sealed!',
            },
            variables: [
              { name: 'phase', value: 'Deserialize', tone: 'amber' },
              { name: 'cursor', value: 'idx = 4', tone: 'primary' },
              { name: 'nextToken', value: '"3"', tone: 'primary' },
            ],
          },
          {
            caption:
              'DESERIALIZE Step 7: 1.right consumes tokens[4]="3" → Node(3), then 3.left consumes tokens[5]="4" plus tokens[6..7]="#,#" sealing leaf 4. Cursor advances to idx = 8 ("5").',
            formula: 'tokens[4]="3", tokens[5..7]="4,#,#" → 3.left = Node(4)',
            activeNodeId: 'n4',
            dependencyNodeIds: ['n3'],
            visitedNodeIds: ['n1', 'n2', 'n3', 'n4'],
            activeEdges: [
              { from: 'n1', to: 'n3' },
              { from: 'n3', to: 'n4' },
            ],
            nodeStates: {
              n1: 'L=2, building R',
              n2: 'sealed ✓',
              n3: 'built (idx 4)',
              n4: 'L=#, R=# sealed!',
            },
            variables: [
              { name: 'phase', value: 'Deserialize', tone: 'amber' },
              { name: 'cursor', value: 'idx = 8' },
              { name: 'nextToken', value: '"5"' },
            ],
          },
          {
            caption:
              'DESERIALIZE Step 8: 3.right consumes tokens[8]="5" and tokens[9..10]="#,#". All 11 tokens consumed (idx == 11) — exact original tree restored in single O(n) pass!',
            formula: 'tokens[8..10]="5,#,#" → idx = 11 (EOF) → Exact Round-Trip ✓',
            activeNodeId: 'n5',
            visitedNodeIds: ['n1', 'n2', 'n3', 'n4', 'n5'],
            highlightedNodeIds: ['n1', 'n2', 'n3', 'n4', 'n5'],
            activeEdges: [{ from: 'n3', to: 'n5' }],
            nodeStates: {
              n1: 'root ✓',
              n2: '1.left ✓',
              n3: '1.right ✓',
              n4: '3.left ✓',
              n5: '3.right ✓',
            },
            variables: [
              { name: 'phase', value: 'Restored ✓', tone: 'emerald' },
              { name: 'cursor', value: '11 / 11', tone: 'emerald' },
            ],
          },
        ],
      },
      javaSolution: {
        filename: 'TreeCodec.java',
        code: `public class TreeCodec {
    private static final String NULL_TOKEN = "#";
    private static final String DELIM = ",";

    public static class TreeNode {
        int val;
        TreeNode left;
        TreeNode right;
        TreeNode(int val) { this.val = val; }
    }

    public String serialize(TreeNode root) {
        StringBuilder sb = new StringBuilder();
        encodePreorder(root, sb);
        return sb.toString();
    }

    private void encodePreorder(TreeNode node, StringBuilder sb) {
        if (sb.length() > 0) {
            sb.append(DELIM);
        }
        if (node == null) {
            sb.append(NULL_TOKEN);
            return;
        }
        sb.append(node.val);
        encodePreorder(node.left, sb);
        encodePreorder(node.right, sb);
    }

    public TreeNode deserialize(String data) {
        if (data == null || data.isEmpty()) {
            return null;
        }
        String[] tokens = data.split(DELIM);
        int[] cursor = new int[1]; // Single-element mutable cursor avoids Queue allocation
        return decodePreorder(tokens, cursor);
    }

    private TreeNode decodePreorder(String[] tokens, int[] cursor) {
        if (cursor[0] >= tokens.length) {
            return null;
        }
        String token = tokens[cursor[0]++];
        if (NULL_TOKEN.equals(token)) {
            return null;
        }

        TreeNode node = new TreeNode(Integer.parseInt(token));
        node.left = decodePreorder(tokens, cursor);
        node.right = decodePreorder(tokens, cursor);
        return node;
    }
}`,
        callouts: [
          {
            id: 'ser-sb',
            startLine: 13,
            endLine: 29,
            title: 'StringBuilder Guarantees O(n) Serialization',
            explanation:
              'Never concatenate Strings inside recursion (left + "," + right), which degrades to O(n²) copying on skewed trees. Appending to a single StringBuilder keeps total work strictly O(n).',
            accent: 'primary',
          },
          {
            id: 'ser-cursor',
            startLine: 35,
            endLine: 37,
            title: 'Shared int[1] Cursor Beats List.remove(0)',
            explanation:
              'Using tokens[cursor[0]++] reads each token in O(1) with zero extra Queue/LinkedList node allocations — and avoids the classic O(n²) trap of calling ArrayList.remove(0) during recursion.',
            accent: 'amber',
          },
          {
            id: 'ser-order',
            startLine: 49,
            endLine: 51,
            title: 'Strict Preorder Symmetry (Root → Left → Right)',
            explanation:
              'Because decodePreorder consumes tokens in the exact same Root → Left → Right order as encodePreorder emitted them, cursor[0] is guaranteed to sit at the start of right subtree the moment left subtree finishes.',
            accent: 'emerald',
          },
        ],
      },
      complexity: {
        time: 'O(n)',
        space: 'O(n)',
        timeExplanation:
          'Every node and every null sentinel (2n + 1 tokens total) is written once during serialize and parsed once during deserialize.',
        spaceExplanation:
          'Output string and split token array occupy O(n) memory; recursion stack takes O(h) additional space.',
      },
      edgeCases: [
        {
          title: 'Empty Tree & Single-Node Tree',
          scenario: 'root = null encodes to "#"; root = [42] encodes to "42,#,#".',
          handling: 'decodePreorder sees "#" at cursor[0] = 0 and cleanly returns null without throwing NumberFormatException.',
        },
        {
          title: 'Negative & Multi-Digit Values (-1000..1000)',
          scenario: 'Encoding values without a delimiter breaks immediately on negative signs or multi-digit integers.',
          handling: 'Explicit comma delimiter "," separates arbitrary signed integers cleanly before Integer.parseInt().',
        },
        {
          title: 'Follow-Up: Compact BST Serialization (LC #449) & Stack-Safe BFS',
          scenario: 'Interviewer asks: "How would you shrink the payload by 50% if it’s a BST, or avoid StackOverflow on depth 10⁵?"',
          handling:
            'For a BST, drop all "#" sentinels and decode preorder values using top-down (min, max) bounds (exactly n tokens!). For extreme skewed depth, swap DFS for iterative Level-Order BFS using a Queue so recursion stack depth is O(1).',
        },
      ],
    },

    /* ================================================================
     * DSA 3: BINARY TREE MAXIMUM PATH SUM
     * ================================================================ */
    {
      id: 'day3-max-path-sum',
      dayNumber: 3,
      kind: 'dsa',
      title: 'Binary Tree Maximum Path Sum',
      subtitle: 'Post-order Tree DP separating upward single-branch gain from local inverted-V bridge updates',
      difficulty: 'Hard',
      patterns: ['Post-Order Tree DP', 'Branch Gain vs. Bridge Path', 'Negative Clamping'],
      estimatedMinutes: 16,
      leetcodeRef: 'LC #124',
      problemStatement:
        'A path in a binary tree is any non-empty sequence of connected nodes where each node appears at most once (it does NOT need to pass through the root). Given a binary tree whose node values may be negative, return the maximum possible path sum.',
      exampleSummary: {
        input: 'Tree = [-10, 9, 20, -5, null, 15, 7]',
        output: '42',
        explanation:
          'The optimal path is 15 → 20 → 7 = 42. Notice how node 9 clamps negative child -5 to 0, node 20 updates globalMax with bridge 15+20+7=42 yet returns single-branch gain 20+15=35 to parent -10, and root -10’s bridge (-10+9+35=34) never beats 42.',
      },
      patternRecognition: {
        interviewCue:
          'Whenever a tree problem asks for the longest or highest-sum path that can turn/bend at ANY node (Diameter LC #543, Max Path Sum LC #124, Longest Univalue Path LC #687), decouple TWO values at every node: (1) the "bridge" path bending through node (updates a global best), and (2) the single downward "gain" returned to parent.',
        signals: [
          'Path may start and end at ANY two nodes (need not pass through root)',
          'Path cannot fork (a node cannot use both children AND continue up to its parent)',
          'Negative node values mean optional subtrees should be pruned via max(0, childGain)',
        ],
        mentalModel:
          'At every node u, compute clamped gains: leftGain = max(0, dfs(u.left)) and rightGain = max(0, dfs(u.right)). First test u as the highest turning point (bridge = u.val + leftGain + rightGain → update globalMax). Then return ONLY the best straight branch (u.val + max(leftGain, rightGain)) to u’s parent!',
      },
      intuitionComparison: {
        bruteForce: {
          approach:
            'Enumerate all O(n²) pairs of nodes (u, v), compute their LCA, and sum every node along the path u → LCA → v.',
          timeComplexity: 'O(n²)',
          spaceComplexity: 'O(h)',
          bottleneck:
            'Recomputes overlapping sub-path sums from scratch for every pair instead of caching each subtree’s single best downward branch during one post-order sweep.',
        },
        optimal: {
          approach:
            'Single post-order DFS returning max downward gain from each node while updating a shared globalMax (initialized to Integer.MIN_VALUE) with val + leftGain + rightGain at every node.',
          timeComplexity: 'O(n)',
          spaceComplexity: 'O(h) recursion stack',
          keyInvariant:
            'Every valid path in a tree has a UNIQUE highest node (its apex/LCA). Evaluating bridge(u) = u.val + leftGain + rightGain at every node u guarantees every candidate path’s apex is inspected.',
        },
      },
      visualizer: {
        kind: 'tree-graph',
        title: 'Post-Order Gain Clamping vs. Bridge Update Dry Run',
        inputSummary: 'Tree = [-10, 9, 20, -5, null, 15, 7] → Optimal Bridge = 42',
        viewBoxWidth: 760,
        viewBoxHeight: 340,
        nodes: [
          { id: 'n1', label: '-10', x: 380, y: 44 },
          { id: 'n2', label: '9', x: 200, y: 144 },
          { id: 'n3', label: '20', x: 550, y: 144 },
          { id: 'n4', label: '-5', x: 110, y: 250 },
          { id: 'n5', label: '15', x: 445, y: 250 },
          { id: 'n6', label: '7', x: 655, y: 250 },
        ],
        edges: [
          { from: 'n1', to: 'n2' },
          { from: 'n1', to: 'n3' },
          { from: 'n2', to: 'n4' },
          { from: 'n3', to: 'n5' },
          { from: 'n3', to: 'n6' },
        ],
        steps: [
          {
            caption:
              'Initialize globalMax = -∞ (NEVER 0, in case all nodes are negative!). Post-order hits leaf -5: bridge = -5 updates globalMax = -5, returns gain = -5 upward.',
            formula: 'Leaf(-5): bridge = -5 → globalMax = max(-∞, -5) = -5 | ret -5',
            activeNodeId: 'n4',
            visitedNodeIds: ['n4'],
            nodeStates: {
              n4: 'br:-5, ret:-5',
            },
            variables: [
              { name: 'node', value: '-5' },
              { name: 'bridge', value: '-5' },
              { name: 'globalMax', value: '-5', tone: 'amber' },
            ],
          },
          {
            caption:
              'Unwind to node 9: left child returned -5, so CLAMP leftGain = max(0, -5) = 0! Discarding negative branch yields bridge = 9 + 0 + 0 = 9 (globalMax = 9) and return gain = 9.',
            formula: 'Node(9): L = max(0, -5) = 0, R = 0 → bridge = 9 → ret 9',
            activeNodeId: 'n2',
            dependencyNodeIds: ['n4'],
            visitedNodeIds: ['n4', 'n2'],
            activeEdges: [{ from: 'n2', to: 'n4' }],
            nodeStates: {
              n4: 'clamped → 0',
              n2: 'br:9, ret:9',
            },
            variables: [
              { name: 'leftGain', value: 'max(0,-5) = 0', tone: 'amber' },
              { name: 'bridge(9)', value: '9' },
              { name: 'globalMax', value: '9', tone: 'emerald' },
            ],
          },
          {
            caption:
              'Descend into right subtree to leaf 15: L = 0, R = 0 → bridge = 15 raises globalMax to 15; returns gain = 15 to node 20.',
            formula: 'Leaf(15): bridge = 15 → globalMax = 15 | ret 15',
            activeNodeId: 'n5',
            visitedNodeIds: ['n4', 'n2', 'n5'],
            nodeStates: {
              n4: 'clamped → 0',
              n2: 'ret:9',
              n5: 'br:15, ret:15',
            },
            variables: [
              { name: 'node', value: '15' },
              { name: 'bridge', value: '15' },
              { name: 'globalMax', value: '15', tone: 'emerald' },
            ],
          },
          {
            caption:
              'Visit leaf 7 under node 20: bridge = 7 (less than globalMax = 15); returns gain = 7 to node 20.',
            formula: 'Leaf(7): bridge = 7 < 15 → globalMax stays 15 | ret 7',
            activeNodeId: 'n6',
            visitedNodeIds: ['n4', 'n2', 'n5', 'n6'],
            nodeStates: {
              n4: 'clamped → 0',
              n2: 'ret:9',
              n5: 'ret:15',
              n6: 'br:7, ret:7',
            },
            variables: [
              { name: 'node', value: '7' },
              { name: 'bridge', value: '7' },
              { name: 'globalMax', value: '15' },
            ],
          },
          {
            caption:
              'Key Pivot at node 20! Bridge bends through BOTH children: 20 + 15 + 7 = 42 → new globalMax = 42! Yet to continue upward to -10, node 20 may pick ONLY ONE branch: returns 20 + max(15, 7) = 35!',
            formula: 'Node(20): bridge = 20+15+7 = 42 (NEW MAX!) | ret = 20+max(15,7) = 35',
            activeNodeId: 'n3',
            dependencyNodeIds: ['n5', 'n6'],
            visitedNodeIds: ['n4', 'n2', 'n5', 'n6', 'n3'],
            highlightedNodeIds: ['n5', 'n3', 'n6'],
            activeEdges: [
              { from: 'n3', to: 'n5' },
              { from: 'n3', to: 'n6' },
            ],
            nodeStates: {
              n2: 'ret:9',
              n5: 'gain:15',
              n6: 'gain:7',
              n3: 'br:42!, ret:35',
            },
            variables: [
              { name: 'bridge(20)', value: '42', tone: 'emerald' },
              { name: 'retGain(20)', value: '35 (1 branch)', tone: 'amber' },
              { name: 'globalMax', value: '42', tone: 'emerald' },
            ],
          },
          {
            caption:
              'Final evaluation at root -10: L = max(0, 9) = 9, R = max(0, 35) = 35 → bridge = -10 + 9 + 35 = 34 < 42. globalMax stays 42 from path 15 → 20 → 7!',
            formula: 'Root(-10): bridge = -10 + 9 + 35 = 34 < 42 → Answer = 42!',
            activeNodeId: 'n1',
            dependencyNodeIds: ['n2', 'n3'],
            visitedNodeIds: ['n4', 'n2', 'n5', 'n6', 'n3', 'n1'],
            highlightedNodeIds: ['n5', 'n3', 'n6'],
            activeEdges: [
              { from: 'n1', to: 'n2' },
              { from: 'n1', to: 'n3' },
            ],
            nodeStates: {
              n4: 'pruned (-5)',
              n2: 'gain:9',
              n5: 'BEST (15)',
              n3: 'BEST (20)',
              n6: 'BEST (7)',
              n1: 'br:34 < 42',
            },
            variables: [
              { name: 'bridge(-10)', value: '34' },
              { name: 'bestPath', value: '15 → 20 → 7', tone: 'emerald' },
              { name: 'globalMax', value: '42', tone: 'emerald' },
            ],
          },
        ],
      },
      javaSolution: {
        filename: 'BinaryTreeMaxPathSum.java',
        code: `public class BinaryTreeMaxPathSum {
    public static class TreeNode {
        int val;
        TreeNode left;
        TreeNode right;
        TreeNode(int val) { this.val = val; }
    }

    private int globalMax;

    public int maxPathSum(TreeNode root) {
        // Initialize inside method so instance is stateless across multiple calls
        this.globalMax = Integer.MIN_VALUE;
        maxGain(root);
        return globalMax;
    }

    private int maxGain(TreeNode node) {
        if (node == null) {
            return 0;
        }

        // Discard negative child branches: taking nothing (0) strictly beats adding a penalty
        int leftGain = Math.max(0, maxGain(node.left));
        int rightGain = Math.max(0, maxGain(node.right));

        // Candidate 1 (Bridge): path turns at this node using both left and right branches
        int bridgeSum = node.val + leftGain + rightGain;
        globalMax = Math.max(globalMax, bridgeSum);

        // Candidate 2 (Upward Gain): parent can only extend ONE linear branch through this node
        return node.val + Math.max(leftGain, rightGain);
    }
}`,
        callouts: [
          {
            id: 'mps-init',
            startLine: 12,
            endLine: 15,
            title: 'Reset globalMax to Integer.MIN_VALUE Per Call',
            explanation:
              'Initializing globalMax = 0 fails on all-negative trees like [-3] (returns 0 instead of -3). Resetting it inside maxPathSum() also keeps the class safe for repeated calls in a test suite.',
            accent: 'amber',
          },
          {
            id: 'mps-clamp',
            startLine: 23,
            endLine: 25,
            title: 'Clamping Negative Gains at Zero',
            explanation:
              'Math.max(0, maxGain(child)) cleanly models the choice "do not extend into this child subtree" without complicating the bridge or return formulas.',
            accent: 'primary',
          },
          {
            id: 'mps-split',
            startLine: 27,
            endLine: 32,
            title: 'Bridge Update vs. Single-Branch Return (The Core Distinction)',
            explanation:
              'A bridge (node.val + leftGain + rightGain) bends across both children and CANNOT extend upward without creating an illegal Y-shaped fork. Therefore we update globalMax with the bridge, then return only node.val + max(leftGain, rightGain).',
            accent: 'emerald',
          },
        ],
      },
      complexity: {
        time: 'O(n)',
        space: 'O(h)',
        timeExplanation:
          'Single post-order traversal visiting every node exactly once and executing constant-time clamping and max operations.',
        spaceExplanation:
          'Recursion stack proportional to tree height h (O(log n) balanced, O(n) skewed).',
      },
      edgeCases: [
        {
          title: 'All-Negative Tree ([-3] or [-2, -1])',
          scenario: 'Path must contain AT LEAST ONE node — empty path sum 0 is illegal!',
          handling:
            'Because globalMax starts at Integer.MIN_VALUE and bridgeSum always includes node.val (with children clamped to ≥ 0), [-2, -1] correctly returns -1.',
        },
        {
          title: 'Thread-Safe / Pure Functional Style (Avoid Mutable Instance Field)',
          scenario: 'Senior interviewer asks: "What if two threads invoke maxPathSum() on a singleton bean?"',
          handling:
            'Pass a local int[] best = {Integer.MIN_VALUE} into maxGain(root, best) or return a tiny record PathResult(int maxGain, int bestSubtree) so the method is 100% stateless and thread-safe.',
        },
        {
          title: 'Integer Overflow on Large Trees',
          scenario: 'Up to 3×10⁴ nodes × 1000 = 3×10⁷ fits in int, but larger weights could exceed 2.14×10⁹.',
          handling: 'Mention widening globalMax and maxGain to long if node values span full 32-bit int range.',
        },
      ],
    },

    /* ================================================================
     * DSA 4: VALIDATE BINARY SEARCH TREE
     * ================================================================ */
    {
      id: 'day3-validate-bst',
      dayNumber: 3,
      kind: 'dsa',
      title: 'Validate Binary Search Tree',
      subtitle: 'Top-down exclusive (min, max) bound propagation catching deep ancestor-subtree violations',
      difficulty: 'Medium',
      patterns: ['Top-Down Range Propagation', 'Exclusive Bounds (min, max)', 'BST Invariant'],
      estimatedMinutes: 13,
      leetcodeRef: 'LC #98',
      problemStatement:
        'Given the root of a binary tree, determine if it is a valid Binary Search Tree (BST): EVERY node in a node’s left subtree must have a key strictly less than the node’s key, and EVERY node in its right subtree must have a key strictly greater than the node’s key.',
      exampleSummary: {
        input: 'Tree = [5, 1, 6, null, null, 4, 8]',
        output: 'false',
        explanation:
          'Node 4 is the left child of 6 (so local check 4 < 6 passes!), YET 4 sits inside the right subtree of root 5 where EVERY node must satisfy val > 5. Top-down bounds (5, 6) immediately catch 4 <= 5.',
      },
      patternRecognition: {
        interviewCue:
          'Never validate a BST by checking only node.left.val < node.val < node.right.val! Whenever a tree property constrains an ENTIRE subtree relative to EVERY ancestor above it, push tightened (min, max) exclusive bounds top-down during DFS (or verify strictly increasing In-Order traversal).',
        signals: [
          'Global ancestor-to-descendant ordering constraint across arbitrary depth',
          'Strict inequality required — duplicates violate the standard BST definition',
          'Classic interview trap: node values can equal Integer.MIN_VALUE or Integer.MAX_VALUE!',
        ],
        mentalModel:
          'Start at root with unbounded open interval (-∞, +∞). Going LEFT from u tightens the upper ceiling to (min, u.val); going RIGHT from u raises the lower floor to (u.val, max). Every node must strictly satisfy min < node.val < max.',
      },
      intuitionComparison: {
        bruteForce: {
          approach:
            'At every node u, scan its entire left subtree to find max(left) and entire right subtree to find min(right), checking max(left) < u.val < min(right).',
          timeComplexity: 'O(n²) on skewed trees (O(n log n) balanced)',
          spaceComplexity: 'O(h)',
          bottleneck:
            'Re-scans deep descendants repeatedly for every ancestor above them instead of carrying the tightest ancestor ceiling/floor down in O(1) per edge.',
        },
        optimal: {
          approach:
            'Top-down DFS passing nullable exclusive bounds (Integer min, Integer max): check (min == null || val > min) && (max == null || val < max), then recurse (min, val) left and (val, max) right.',
          timeComplexity: 'O(n)',
          spaceComplexity: 'O(h) call stack',
          keyInvariant:
            'At any node u, (min, max) equals the exact intersection of constraints imposed by EVERY ancestor where the root-to-u path turned right (lower bound) or left (upper bound).',
        },
      },
      visualizer: {
        kind: 'tree-graph',
        title: 'Top-Down Exclusive (min, max) Bounds Catching Subtree Violation',
        inputSummary: 'Tree = [5, 1, 6, null, null, 4, 8] → Local 4 < 6 fools naive check, fails (5, 6)!',
        viewBoxWidth: 760,
        viewBoxHeight: 340,
        nodes: [
          { id: 'n5', label: '5', x: 380, y: 44 },
          { id: 'n1', label: '1', x: 200, y: 144 },
          { id: 'n6', label: '6', x: 550, y: 144 },
          { id: 'n4', label: '4', x: 445, y: 250 },
          { id: 'n8', label: '8', x: 655, y: 250 },
        ],
        edges: [
          { from: 'n5', to: 'n1' },
          { from: 'n5', to: 'n6' },
          { from: 'n6', to: 'n4' },
          { from: 'n6', to: 'n8' },
        ],
        steps: [
          {
            caption:
              'Start at root 5 with unbounded interval (-∞, +∞): 5 is valid! Going left tightens max → (-∞, 5); going right tightens min → (5, +∞).',
            formula: 'check(5, -∞, +∞) = true → L: (-∞, 5), R: (5, +∞)',
            activeNodeId: 'n5',
            visitedNodeIds: ['n5'],
            nodeStates: {
              n5: '(-∞, +∞) ✓',
            },
            variables: [
              { name: 'node', value: '5' },
              { name: 'bounds', value: '(-∞, +∞)' },
              { name: 'valid', value: 'true', tone: 'emerald' },
            ],
          },
          {
            caption:
              'Descend left to node 1 with inherited bounds (-∞, 5). Check -∞ < 1 < 5 → VALID! Its null children trivially return true, so left subtree passes.',
            formula: 'check(1, -∞, 5): 1 < 5 → true (left subtree valid)',
            activeNodeId: 'n1',
            visitedNodeIds: ['n5', 'n1'],
            activeEdges: [{ from: 'n5', to: 'n1' }],
            nodeStates: {
              n5: '(-∞, +∞) ✓',
              n1: '(-∞, 5) ✓',
            },
            variables: [
              { name: 'node', value: '1' },
              { name: 'bounds', value: '(-∞, 5)' },
              { name: 'valid', value: 'true', tone: 'emerald' },
            ],
          },
          {
            caption:
              'Descend right to node 6 with bounds (5, +∞). Check 5 < 6 < +∞ → VALID! Now tighten bounds for 6’s children: 6.left gets (5, 6) — keeping root 5’s floor!',
            formula: 'check(6, 5, +∞) = true → 6.left inherits min=5, sets max=6 → (5, 6)',
            activeNodeId: 'n6',
            visitedNodeIds: ['n5', 'n1', 'n6'],
            activeEdges: [{ from: 'n5', to: 'n6' }],
            nodeStates: {
              n5: '(-∞, +∞) ✓',
              n1: '(-∞, 5) ✓',
              n6: '(5, +∞) ✓',
            },
            variables: [
              { name: 'node', value: '6' },
              { name: 'bounds', value: '(5, +∞)' },
              { name: 'nextLeft', value: '(5, 6)', tone: 'amber' },
            ],
          },
          {
            caption:
              'SUBTREE VIOLATION CAUGHT at node 4! Locally 4 < 6 looks legal, YET inherited lower bound min = 5 demands 4 > 5! Since 4 ∉ (5, 6), immediately return false!',
            formula: 'check(4, 5, 6): 4 <= min(5) → VIOLATION! return false',
            activeNodeId: 'n4',
            dependencyNodeIds: ['n5', 'n6'],
            visitedNodeIds: ['n5', 'n1', 'n6'],
            activeEdges: [
              { from: 'n5', to: 'n6' },
              { from: 'n6', to: 'n4' },
            ],
            nodeStates: {
              n5: 'floor min=5!',
              n1: '(-∞, 5) ✓',
              n6: '4 < 6 fools local!',
              n4: '(5, 6) ✗ 4≤5',
            },
            variables: [
              { name: 'node', value: '4', tone: 'rose' },
              { name: 'bounds', value: '(5, 6)', tone: 'amber' },
              { name: 'valid', value: 'FALSE ✗', tone: 'rose' },
            ],
          },
          {
            caption:
              'Logical && short-circuits: false unwinds 4 → 6 → 5 without ever inspecting node 8. Notice in-order traversal [1, 5, 4, 6, 8] also exposes the inversion 5 → 4!',
            formula: 'Short-circuit unwind → isValidBST = false (In-order: [1, 5, 4, ...])',
            activeNodeId: 'n5',
            dependencyNodeIds: ['n4'],
            visitedNodeIds: ['n1', 'n6'],
            activeEdges: [
              { from: 'n5', to: 'n6' },
              { from: 'n6', to: 'n4' },
            ],
            nodeStates: {
              n5: 'INVALID BST ✗',
              n1: '(-∞, 5) ✓',
              n6: 'ret false',
              n4: 'violates 5',
              n8: 'skipped',
            },
            variables: [
              { name: 'inOrder', value: '[1, 5, 4 ✗]', tone: 'rose' },
              { name: 'result', value: 'false', tone: 'rose' },
            ],
          },
        ],
      },
      javaSolution: {
        filename: 'ValidateBST.java',
        code: `public class ValidateBST {
    public static class TreeNode {
        int val;
        TreeNode left;
        TreeNode right;
        TreeNode(int val) { this.val = val; }
    }

    public boolean isValidBST(TreeNode root) {
        // Nullable Integer bounds handle Integer.MIN_VALUE and Integer.MAX_VALUE safely
        return validate(root, null, null);
    }

    private boolean validate(TreeNode node, Integer minExclusive, Integer maxExclusive) {
        if (node == null) {
            return true;
        }

        if (minExclusive != null && node.val <= minExclusive) {
            return false;
        }
        if (maxExclusive != null && node.val >= maxExclusive) {
            return false;
        }

        // Left subtree tightens upper bound to node.val; right subtree raises lower bound to node.val
        return validate(node.left, minExclusive, node.val)
            && validate(node.right, node.val, maxExclusive);
    }
}`,
        callouts: [
          {
            id: 'bst-nullable',
            startLine: 10,
            endLine: 11,
            title: 'Why Nullable Integer Bounds Beat Integer.MIN_VALUE / MAX_VALUE',
            explanation:
              'A classic interview bug is initializing min = Integer.MIN_VALUE, max = Integer.MAX_VALUE — which falsely returns false on the valid single-node tree [2147483647]! Using nullable Integer (or Long.MIN_VALUE / Long.MAX_VALUE) eliminates boundary collisions completely.',
            accent: 'amber',
          },
          {
            id: 'bst-strict',
            startLine: 19,
            endLine: 24,
            title: 'Strict Inequality Rejects Duplicates',
            explanation:
              'Checking <= minExclusive and >= maxExclusive enforces strict BST ordering. Clarify duplicate semantics with your interviewer (some domain BSTs permit left <= root).',
            accent: 'primary',
          },
          {
            id: 'bst-tighten',
            startLine: 27,
            endLine: 28,
            title: 'Top-Down Bound Intersection & Short-Circuiting',
            explanation:
              'Each recursive branch preserves one ancestor bound while tightening the other, and Java’s && immediately halts traversal the moment a left-subtree violation occurs.',
            accent: 'emerald',
          },
        ],
      },
      complexity: {
        time: 'O(n)',
        space: 'O(h)',
        timeExplanation:
          'Visits each node at most once performing two O(1) bound comparisons (short-circuiting early on violation).',
        spaceExplanation:
          'O(h) recursion stack depth (O(log n) balanced, O(n) skewed). Mention Morris In-Order Traversal if O(1) auxiliary space is demanded.',
      },
      edgeCases: [
        {
          title: '32-Bit Int Extremes ([2147483647] or [-2147483648])',
          scenario: 'Root or leaf node holds exact Integer.MAX_VALUE or Integer.MIN_VALUE.',
          handling: 'Nullable Integer min/max treats null as ±∞, validating all 32-bit int boundaries flawlessly.',
        },
        {
          title: 'Duplicate Values ([2, 2, 2] or [5, 5, null])',
          scenario: 'Adjacent equal keys violate strict BST ordering.',
          handling: 'Inclusive rejection (node.val <= min || node.val >= max) returns false immediately.',
        },
        {
          title: 'Iterative In-Order Alternative & Related BST Follow-Ups',
          scenario: 'Interviewer asks: "How would you solve this iteratively, or find two swapped BST nodes (LC #99)?"',
          handling:
            'Walk an explicit Deque<TreeNode> in-order while tracking Integer prev: if prev != null && curr.val <= prev return false. That same in-order prev pattern directly solves Kth Smallest (LC #230) and Recover BST (LC #99)!',
        },
      ],
    },

    /* ================================================================
     * DSA 5: IMPLEMENT TRIE & WORD SEARCH II
     * ================================================================ */
    {
      id: 'day3-trie-word-search-ii',
      dayNumber: 3,
      kind: 'dsa',
      title: 'Implement Trie & Word Search II',
      subtitle: 'Prefix-tree construction, board DFS backtracking, and O(1) leaf-node pruning optimization',
      difficulty: 'Hard',
      patterns: ['Trie (Prefix Tree)', 'DFS Backtracking', 'Leaf Pruning Optimization'],
      estimatedMinutes: 18,
      leetcodeRef: 'LC #208 & #212',
      problemStatement:
        'First implement a Trie (Prefix Tree) supporting insert(word), search(word), and startsWith(prefix). Then use that Trie to find all dictionary words present in an m × n character board using 4-directional adjacent cells (each cell used at most once per word).',
      exampleSummary: {
        input: 'board = [["o","a","a","n"],["e","t","a","e"],["i","h","k","r"],["i","f","l","v"]], words = ["oath", "eat"]',
        output: '["oath", "eat"]',
        explanation:
          'Building one Trie over all dictionary words lets a single grid DFS walk shared prefixes simultaneously — and pruning empty Trie leaves right after discovering each word eliminates redundant future traversals.',
      },
      patternRecognition: {
        interviewCue:
          'Whenever you must match MANY target strings against a grid, stream, or autocomplete query simultaneously, invert the search: index the dictionary into a Trie ONCE, then drive a single DFS/scan guided by valid Trie child edges.',
        signals: [
          'Thousands of dictionary words (W up to 3×10⁴) checked against a small m × n board (m, n ≤ 12)',
          'Shared prefixes ("oath", "oats", "oat") would be re-walked redundantly if searching one word at a time',
          'Without leaf-node pruning, LC #212 hits TLE on pathological boards packed with repeated prefixes (e.g., "aaaa...a")!',
        ],
        mentalModel:
          'Each TrieNode stores children[26], an optional terminal String word (eliminating StringBuilder overhead), and childCount. During board DFS, only step into neighbors matching curr.children[ch - \'a\']. When a word matches, collect it, clear node.word = null, and cascade-delete empty leaves back up the Trie!',
      },
      intuitionComparison: {
        bruteForce: {
          approach:
            'Run single-word DFS (Word Search I, LC #79) independently across the entire m × n grid for each of the W words in the dictionary.',
          timeComplexity: 'O(W · m · n · 3^L)',
          spaceComplexity: 'O(L) recursion stack',
          bottleneck:
            'Repeats the exact same board prefix exploration W separate times — catastrophic when W = 30,000 words share common prefixes.',
        },
        optimal: {
          approach:
            'Insert all W words into a Trie in O(Σ|w|). Launch one DFS per board cell following existing Trie edges, marking visited cells in-place with "#", clearing found word markers, and pruning empty Trie leaves on backtrack.',
          timeComplexity: 'O(Σ|w| + m · n · 3^(L-1)) worst-case, dramatically faster with leaf pruning',
          spaceComplexity: 'O(Σ|w|) Trie nodes + O(L) DFS stack',
          keyInvariant:
            'Any Trie branch whose terminal words have all been discovered is detached in O(1) via childCount == 0, shrinking the Trie dynamically until zero words remain.',
        },
      },
      visualizer: {
        kind: 'tree-graph',
        title: 'Trie Insertion, Grid DFS Matching & Leaf-Node Pruning Dry Run',
        inputSummary: 'Trie for ["oath", "eat"] on 4×4 board · Path 1: (0,0)→(0,1)→(1,1)→(2,1) · Path 2: (1,3)→(1,2)→(1,1)',
        viewBoxWidth: 760,
        viewBoxHeight: 340,
        nodes: [
          { id: 'root', label: '∅', x: 76, y: 162 },
          { id: 'o', label: 'o', x: 224, y: 76 },
          { id: 'a1', label: 'a', x: 374, y: 76 },
          { id: 't1', label: 't', x: 524, y: 76 },
          { id: 'h', label: 'h*', x: 674, y: 76 },
          { id: 'e', label: 'e', x: 224, y: 242 },
          { id: 'a2', label: 'a', x: 374, y: 242 },
          { id: 't2', label: 't*', x: 524, y: 242 },
        ],
        edges: [
          { from: 'root', to: 'o' },
          { from: 'o', to: 'a1' },
          { from: 'a1', to: 't1' },
          { from: 't1', to: 'h' },
          { from: 'root', to: 'e' },
          { from: 'e', to: 'a2' },
          { from: 'a2', to: 't2' },
        ],
        steps: [
          {
            caption:
              'Step 1 (Trie Insert "oath"): Walk root → o → a → t → h creating child pointers, bumping each parent’s childCount = 1, and storing terminal word = "oath" on node h*.',
            formula: 'insert("oath"): root → o → a → t → h* (word = "oath")',
            activeNodeId: 'h',
            visitedNodeIds: ['root', 'o', 'a1', 't1', 'h'],
            activeEdges: [
              { from: 'root', to: 'o' },
              { from: 'o', to: 'a1' },
              { from: 'a1', to: 't1' },
              { from: 't1', to: 'h' },
            ],
            nodeStates: {
              root: 'children:1',
              o: 'cnt:1',
              a1: 'cnt:1',
              t1: 'cnt:1',
              h: 'word="oath"',
            },
            variables: [
              { name: 'phase', value: 'Trie Build', tone: 'primary' },
              { name: 'inserted', value: '"oath"' },
              { name: 'found', value: '[]' },
            ],
          },
          {
            caption:
              'Step 2 (Trie Insert "eat"): Branch from root → e → a → t* storing word = "eat". Now root has childCount = 2 ({o, e}); any board cell outside {o, e} aborts in O(1)!',
            formula: 'insert("eat"): root → e → a → t* (root.childCount = 2)',
            activeNodeId: 't2',
            visitedNodeIds: ['root', 'o', 'a1', 't1', 'h', 'e', 'a2', 't2'],
            activeEdges: [
              { from: 'root', to: 'e' },
              { from: 'e', to: 'a2' },
              { from: 'a2', to: 't2' },
            ],
            nodeStates: {
              root: 'children:2 {o,e}',
              h: 'word="oath"',
              e: 'cnt:1',
              a2: 'cnt:1',
              t2: 'word="eat"',
            },
            variables: [
              { name: 'phase', value: 'Trie Ready', tone: 'emerald' },
              { name: 'words', value: '2 indexed' },
              { name: 'found', value: '[]' },
            ],
          },
          {
            caption:
              'Step 3 (Grid DFS Prefix Match): Board cell (0,0)="o" enters root.children[\'o\']! DFS steps (0,0)→(0,1)="a"→(1,1)="t", temporarily marking visited cells "#" in-place.',
            formula: 'Board DFS: (0,0)o → (0,1)a → (1,1)t  [marked "#" in-place]',
            activeNodeId: 't1',
            visitedNodeIds: ['root', 'o', 'a1', 't1'],
            activeEdges: [
              { from: 'root', to: 'o' },
              { from: 'o', to: 'a1' },
              { from: 'a1', to: 't1' },
            ],
            nodeStates: {
              root: 'children:2',
              o: 'cell (0,0) #',
              a1: 'cell (0,1) #',
              t1: 'cell (1,1) #',
              h: 'word="oath"',
              t2: 'word="eat"',
            },
            variables: [
              { name: 'boardCell', value: '(1,1) = "t"', tone: 'primary' },
              { name: 'prefix', value: '"oat"' },
              { name: 'found', value: '[]' },
            ],
          },
          {
            caption:
              'Step 4 (Terminal Word Hit!): Neighbor (2,1)="h" hits node h* where word != null! Record "oath" and immediately set h.word = null so alternate board paths never duplicate it.',
            formula: 'HIT h*.word = "oath" → found.add("oath"), h*.word = null',
            activeNodeId: 'h',
            visitedNodeIds: ['root', 'o', 'a1', 't1', 'h'],
            highlightedNodeIds: ['o', 'a1', 't1', 'h'],
            activeEdges: [
              { from: 'root', to: 'o' },
              { from: 'o', to: 'a1' },
              { from: 'a1', to: 't1' },
              { from: 't1', to: 'h' },
            ],
            nodeStates: {
              root: 'children:2',
              o: '(0,0) o',
              a1: '(0,1) a',
              t1: '(1,1) t',
              h: 'MATCH! word=∅',
              t2: 'word="eat"',
            },
            variables: [
              { name: 'boardCell', value: '(2,1) = "h"', tone: 'emerald' },
              { name: 'found', value: '["oath"]', tone: 'emerald' },
            ],
          },
          {
            caption:
              'Step 5 (Leaf-Node Pruning Cascade!): Backtracking from h* sees childCount == 0 & word == null → unlink t.children[\'h\'] = null! Emptiness cascades h → t → a → o, dropping root.childCount from 2 → 1!',
            formula: 'if (next.childCount == 0 && next.word == null) parent.children[c] = null',
            activeNodeId: 'root',
            dependencyNodeIds: ['o', 'a1', 't1', 'h'],
            visitedNodeIds: ['root'],
            activeEdges: [
              { from: 'root', to: 'o' },
              { from: 'o', to: 'a1' },
              { from: 'a1', to: 't1' },
              { from: 't1', to: 'h' },
            ],
            nodeStates: {
              root: 'children:1 {e}',
              o: 'PRUNED ✂',
              a1: 'PRUNED ✂',
              t1: 'PRUNED ✂',
              h: 'PRUNED ✂',
              t2: 'word="eat"',
            },
            variables: [
              { name: 'pruned', value: 'o→a→t→h ✂', tone: 'amber' },
              { name: 'root.children', value: '{e} only', tone: 'amber' },
              { name: 'found', value: '["oath"]' },
            ],
          },
          {
            caption:
              'Step 6 (Second Match "eat"): Future "o" cells abort in O(1). Board DFS at (1,3)="e" → (1,2)="a" → (1,1)="t" walks surviving branch root → e → a → t* and collects "eat"!',
            formula: 'Board DFS: (1,3)e → (1,2)a → (1,1)t → HIT "eat"!',
            activeNodeId: 't2',
            visitedNodeIds: ['root', 'e', 'a2', 't2'],
            highlightedNodeIds: ['e', 'a2', 't2'],
            activeEdges: [
              { from: 'root', to: 'e' },
              { from: 'e', to: 'a2' },
              { from: 'a2', to: 't2' },
            ],
            nodeStates: {
              root: 'children:1 {e}',
              o: 'PRUNED',
              e: '(1,3) e',
              a2: '(1,2) a',
              t2: 'MATCH "eat"!',
            },
            variables: [
              { name: 'boardCell', value: '(1,1) = "t"', tone: 'emerald' },
              { name: 'found', value: '["oath", "eat"]', tone: 'emerald' },
            ],
          },
          {
            caption:
              'Step 7 (Complete Pruning & Early Termination): Backtracking prunes t* → a → e, dropping root.childCount to 0! Outer board loop sees root.childCount == 0 and terminates immediately!',
            formula: 'root.childCount == 0 → Early Exit! Answer = ["oath", "eat"]',
            activeNodeId: 'root',
            highlightedNodeIds: ['root'],
            nodeStates: {
              root: 'EMPTY (0) → EXIT!',
              o: 'PRUNED ✂',
              e: 'PRUNED ✂',
            },
            variables: [
              { name: 'root.children', value: '0 (all found!)', tone: 'emerald' },
              { name: 'result', value: '["oath", "eat"]', tone: 'emerald' },
            ],
          },
        ],
      },
      javaSolution: {
        filename: 'TrieWordSearch.java',
        code: `import java.util.ArrayList;
import java.util.List;

public class TrieWordSearch {
    private static final int[][] DIRS = {{1, 0}, {-1, 0}, {0, 1}, {0, -1}};

    public static class TrieNode {
        final TrieNode[] children = new TrieNode[26];
        String word;      // Non-null only at terminal nodes; avoids StringBuilder in DFS
        int childCount;   // Enables O(1) leaf-node pruning without scanning 26 slots
    }

    public static class Trie {
        private final TrieNode root = new TrieNode();

        public void insert(String word) {
            TrieNode curr = root;
            for (int i = 0; i < word.length(); i++) {
                int idx = word.charAt(i) - 'a';
                if (curr.children[idx] == null) {
                    curr.children[idx] = new TrieNode();
                    curr.childCount++;
                }
                curr = curr.children[idx];
            }
            curr.word = word;
        }

        public boolean search(String word) {
            TrieNode node = findNode(word);
            return node != null && node.word != null;
        }

        public boolean startsWith(String prefix) {
            return findNode(prefix) != null;
        }

        private TrieNode findNode(String s) {
            TrieNode curr = root;
            for (int i = 0; i < s.length(); i++) {
                curr = curr.children[s.charAt(i) - 'a'];
                if (curr == null) {
                    return null;
                }
            }
            return curr;
        }

        TrieNode getRoot() { return root; }
    }

    public List<String> findWords(char[][] board, String[] words) {
        List<String> result = new ArrayList<>();
        if (board == null || board.length == 0 || words == null) {
            return result;
        }

        Trie trie = new Trie();
        for (String w : words) {
            if (w != null && !w.isEmpty()) {
                trie.insert(w);
            }
        }

        TrieNode root = trie.getRoot();
        for (int r = 0; r < board.length && root.childCount > 0; r++) {
            for (int c = 0; c < board[0].length && root.childCount > 0; c++) {
                dfs(board, r, c, root, result);
            }
        }
        return result;
    }

    private void dfs(char[][] board, int r, int c, TrieNode parent, List<String> result) {
        char ch = board[r][c];
        if (ch == '#') {
            return;
        }
        int idx = ch - 'a';
        TrieNode next = parent.children[idx];
        if (next == null) {
            return;
        }

        if (next.word != null) {
            result.add(next.word);
            next.word = null; // Deduplicate: never report the same word twice
        }

        board[r][c] = '#'; // Mark visited in-place (zero boolean[][] allocation)
        for (int[] d : DIRS) {
            int nr = r + d[0];
            int nc = c + d[1];
            if (nr >= 0 && nr < board.length && nc >= 0 && nc < board[0].length) {
                dfs(board, nr, nc, next, result);
            }
        }
        board[r][c] = ch; // Restore cell on backtrack

        // Leaf-node pruning: detach exhausted Trie branches in O(1)
        if (next.word == null && next.childCount == 0) {
            parent.children[idx] = null;
            parent.childCount--;
        }
    }
}`,
        callouts: [
          {
            id: 'trie-node-design',
            startLine: 7,
            endLine: 11,
            title: 'Storing String word + int childCount on TrieNode',
            explanation:
              'Storing the complete terminal String word avoids maintaining a mutable StringBuilder during DFS, while tracking childCount lets us detect exhausted leaf branches in O(1) instead of looping over all 26 slots.',
            accent: 'primary',
          },
          {
            id: 'trie-dedup',
            startLine: 85,
            endLine: 88,
            title: 'Clear next.word Instead of Using a Result HashSet',
            explanation:
              'Nulling out next.word immediately upon discovery prevents duplicate results cleanly AND unlocks leaf pruning right after the word is matched.',
            accent: 'amber',
          },
          {
            id: 'trie-prune',
            startLine: 100,
            endLine: 104,
            title: 'O(1) Cascading Leaf Pruning (The Senior LC #212 Difference)',
            explanation:
              'After returning from all 4 neighbors, if next has no remaining terminal word and zero children, detach it from parent and decrement parent.childCount. Emptiness cascades all the way to root, cutting worst-case runtime by 10–100× on dense prefix boards.',
            accent: 'emerald',
          },
        ],
      },
      complexity: {
        time: 'O(Σ|w| + m · n · 3^(L-1))',
        space: 'O(Σ|w|)',
        timeExplanation:
          'Trie insertion takes O(Σ|w|) across all dictionary characters. From each of the m·n cells, DFS branches at most 4 ways on step 1 and 3 ways thereafter (cannot step back to the parent cell) up to max word length L, aggressively reduced in practice by leaf pruning.',
        spaceExplanation:
          'Trie occupies at most O(Σ|w|) nodes (fixed 26-slot arrays; swap to HashMap<Character, TrieNode> for sparse Unicode alphabets). In-place "#" marking uses O(L) stack space only.',
      },
      edgeCases: [
        {
          title: 'Prefix Overlap ("oa" AND "oath" Both in Dictionary)',
          scenario: 'Matching "oa" must NOT stop DFS or prune node "a" because "oath" still lives underneath it!',
          handling:
            'After collecting "oa" and setting a.word = null, DFS continues exploring neighbors and pruning checks a.childCount == 0 (which is false since "t" still exists).',
        },
        {
          title: 'Duplicate Words in Input Array (["eat", "eat"])',
          scenario: 'Naive childCount++ on duplicate insert would corrupt childCount and break pruning.',
          handling: 'insert() increments curr.childCount ONLY when curr.children[idx] == null, keeping childCount exact.',
        },
        {
          title: 'Memory Trade-Off: TrieNode[26] vs. HashMap vs. Compressed Radix Tree',
          scenario: 'Staff follow-up: "What if the Trie stores 10M URLs or Unicode strings?"',
          handling:
            'Replace fixed 26-way arrays (208 bytes/node on 64-bit JVM!) with compact HashMap/sorted byte-arrays on sparse internal nodes, or compress single-child chains into a Radix Tree (Patricia Trie) to slash heap usage by 5–10×.',
        },
      ],
    },
  ],

  /* ================================================================
   * DAY 3 LLD: PUB-SUB MESSAGE QUEUE
   * ================================================================ */
  lldLesson: {
    id: 'day3-pub-sub-queue',
    dayNumber: 3,
    kind: 'lld',
    title: 'Pub-Sub Message Queue',
    subtitle: 'Partitioned append-only topic logs, consumer groups with independent offsets, and lock-isolated async dispatch',
    patterns: ['Observer / Pub-Sub', 'Producer-Consumer', 'Strategy Pattern', 'Lock-Striped Partition Logs'],
    estimatedMinutes: 25,
    problemScope: {
      summary:
        'Design an in-process, thread-safe Pub-Sub Message Broker (inspired by Kafka’s core topic/partition/consumer-group abstraction) supporting multiple named topics, keyed partition routing for per-key ordering, independent Consumer Groups tracking committed offsets with replay capability, and isolated worker execution so slow subscribers never stall publishers.',
      functionalRequirements: [
        'Create named topics with configurable partition counts (P partitions per topic) and append-only ordered PartitionRecords.',
        'Publish messages asynchronously with an optional routingKey guaranteeing strict FIFO ordering for all messages sharing the same key.',
        'Register multiple Consumer Groups per topic: every Consumer Group independently receives every message (fan-out pub-sub), while each partition is processed sequentially within a group.',
        'Track per-partition committed offsets for each Consumer Group and support resetOffset(topic, groupId, partitionId, offset) for deterministic message replay.',
      ],
      concurrencyAndScaleAssumptions: [
        'Dozens of producer threads publish concurrently across topics while independent consumer group workers continuously tail partitions.',
        'Slow, blocking, or exception-throwing subscribers in Group B MUST NEVER block publisher threads OR delay Group A’s delivery latency.',
        'Zero busy-wait polling: idle partition workers must block cleanly on a Condition variable and wake immediately when new records append.',
      ],
      explicitNonGoals: [
        'Distributed disk WAL segments, Raft/ZooKeeper leader election, and network TCP wire framing (covered in HLD; here we build clean in-process domain boundaries and thread-safe memory primitives).',
        'Exactly-once two-phase distributed transactions across external databases (we provide at-least-once delivery with explicit offset commits and dead-letter hooks).',
      ],
    },
    coreEntities: [
      {
        name: 'MessageBroker',
        role: 'Central facade owning topic creation, keyed publishing, consumer-group registration, offset replay, and bounded executor lifecycle.',
        keyFields: [
          'topics: ConcurrentHashMap<String, Topic>',
          'routingStrategy: PartitionRoutingStrategy',
          'workerPool: ExecutorService',
        ],
        invariants: 'Topic lookup is lock-free via ConcurrentHashMap; broker shutdown drains workers cleanly without dangling threads.',
      },
      {
        name: 'Topic',
        role: 'Logical event stream owning N ordered TopicPartitions and a thread-safe registry of subscribed ConsumerGroups.',
        keyFields: [
          'name: String',
          'partitions: List<TopicPartition>',
          'consumerGroups: CopyOnWriteArrayList<ConsumerGroup>',
        ],
        invariants: 'Partition list is immutable after topic creation; group iteration during publish/metrics is lock-free via CopyOnWriteArrayList.',
      },
      {
        name: 'TopicPartition',
        role: 'Append-only log segment protected by a partition-scoped ReentrantLock + Condition for zero-spin producer-consumer signaling.',
        keyFields: [
          'partitionId: int',
          'records: List<PartitionRecord>',
          'partitionLock: ReentrantLock',
          'dataAvailable: Condition',
        ],
        invariants: 'Offsets are strictly sequential (0, 1, 2, ...); records are immutable once appended.',
      },
      {
        name: 'ConsumerGroup & PartitionWorker',
        role: 'Tracks per-partition AtomicLong offsets and runs isolated background worker tasks delivering records to a Subscriber.',
        keyFields: [
          'groupId: String',
          'subscriber: Subscriber',
          'offsets: ConcurrentHashMap<Integer, AtomicLong>',
          'running: AtomicBoolean',
        ],
        invariants: 'Each (groupId, partitionId) pair is owned by at most one active worker loop, preserving strict per-partition order while enabling offset resets.',
      },
      {
        name: 'Message & PartitionRecord',
        role: 'Immutable Java records representing producer payloads and broker-stamped offset envelopes.',
        keyFields: ['messageId: String', 'routingKey: String', 'payload: String', 'offset: long'],
        invariants: 'Immutable after construction — safe to fan out across arbitrary consumer groups with zero defensive copying.',
      },
    ],
    designPatterns: [
      {
        pattern: 'Observer / Pub-Sub Decoupled via Pull-Log (Topic + ConsumerGroup)',
        whereUsed: 'Fan-out notification from Topics to multiple independent ConsumerGroups.',
        whatBreaksWithoutIt:
          'Synchronous Observer callbacks (for (sub : subs) sub.onMessage(msg)) execute directly on the publisher’s thread: a single slow email subscriber taking 500ms stalls EVERY publisher and EVERY other healthy subscriber!',
        howItSolvesIt:
          'Publishers append to TopicPartition in O(1) and signal dataAvailable; each ConsumerGroup runs its own asynchronous offset-tracking worker loop on an isolated executor pool so slow consumers lag independently without ever blocking producers.',
      },
      {
        pattern: 'Strategy Pattern (PartitionRoutingStrategy)',
        whereUsed: 'Mapping Message.routingKey to a deterministic TopicPartition index.',
        whatBreaksWithoutIt:
          'Hardcoding Math.abs(key.hashCode()) % P inside MessageBroker makes it impossible to swap in Sticky-Batch routing, Priority-Key routing, or Murmur3 consistent hashing without editing core broker code (also risks Integer.MIN_VALUE abs bug!).',
        howItSolvesIt:
          'Encapsulates partition selection behind PartitionRoutingStrategy injected into MessageBroker, using bitwise mask (hash & 0x7fffffff) % P for safe non-negative hashing and round-robin fallback for keyless messages.',
      },
      {
        pattern: 'Producer-Consumer Monitor (ReentrantLock + Condition)',
        whereUsed: 'Coordinating concurrent publisher appends with sleeping partition workers inside TopicPartition.',
        whatBreaksWithoutIt:
          'Using while (offset >= log.size()) Thread.sleep(10) wastes CPU cycles, adds 10ms tail latency, and scales poorly across hundreds of idle partitions; using synchronized(this) lacks interruptible/timed waits and fair locking.',
        howItSolvesIt:
          'TopicPartition holds a fine-grained ReentrantLock + Condition dataAvailable. Workers await() with zero CPU burn until append() calls signalAll(), waking every consumer group subscribed to that partition in microseconds.',
      },
    ],
    diagrams: {
      classDiagram: {
        title: 'Pub-Sub Message Queue — UML Class Diagram',
        caption: 'Lock-striped TopicPartitions decouple publishers from offset-tracking ConsumerGroups and pluggable routing strategies',
        mermaid: `classDiagram
    class MessageBroker {
        -ConcurrentHashMap~String,Topic~ topics
        -PartitionRoutingStrategy router
        -ExecutorService workerPool
        +createTopic(name, partitions) Topic
        +publish(topic, msg) PartitionRecord
        +subscribe(topic, groupId, sub) void
        +resetOffset(topic, group, part, off) void
    }

    class PartitionRoutingStrategy {
        <<interface>>
        +selectPartition(key, count) int
    }

    class HashKeyRoutingStrategy {
        -AtomicInteger roundRobin
        +selectPartition(key, count) int
    }

    class Topic {
        -String name
        -List~TopicPartition~ partitions
        -CopyOnWriteArrayList~ConsumerGroup~ groups
        +getPartition(id) TopicPartition
        +registerGroup(group) void
    }

    class TopicPartition {
        -int partitionId
        -List~PartitionRecord~ log
        -ReentrantLock lock
        -Condition dataAvailable
        +append(msg) PartitionRecord
        +poll(offset, timeoutMs) PartitionRecord
    }

    class ConsumerGroup {
        -String groupId
        -Subscriber subscriber
        -ConcurrentHashMap~Integer,AtomicLong~ offsets
        +start(pool) void
        +resetOffset(partId, offset) void
    }

    class Subscriber {
        <<interface>>
        +getId() String
        +onMessage(record) void
    }

    class PartitionRecord {
        +long offset
        +Message message
    }

    MessageBroker "1" o-- "*" Topic : "manages topics"
    MessageBroker --> PartitionRoutingStrategy : "routes keys"
    PartitionRoutingStrategy <|.. HashKeyRoutingStrategy : "implements"
    Topic "1" *-- "*" TopicPartition : "owns partitions"
    Topic "1" o-- "*" ConsumerGroup : "registers groups"
    TopicPartition "1" *-- "*" PartitionRecord : "appends log"
    ConsumerGroup ..> TopicPartition : "polls by offset"
    ConsumerGroup --> Subscriber : "delivers records"`,
      },
      sequenceDiagram: {
        title: 'Async Publish & Isolated Consumer Group Offset Delivery Sequence',
        caption: 'Publisher returns immediately after partition append + signalAll; independent consumer workers consume at their own pace',
        mermaid: `sequenceDiagram
    participant Producer as "Producer Thread"
    participant Broker as "MessageBroker"
    participant Partition as "TopicPartition #1"
    participant GroupA as "Fast Worker (Group A)"
    participant GroupB as "Slow Worker (Group B)"

    Producer->>Broker: "publish(orders, msg[key=u42])"
    Broker->>Broker: "selectPartition(u42, 4) -> Partition #1"
    Broker->>Partition: "append(msg)"
    Partition->>Partition: "lock() -> assign offset=7 -> log.add(rec)"
    Partition->>Partition: "dataAvailable.signalAll() -> unlock()"
    Partition-->>Broker: "PartitionRecord(offset=7)"
    Broker-->>Producer: "Ack offset=7 (never waits for consumers!)"
    par "Isolated Worker Pool Threads"
        Partition-->>GroupA: "wake from await() -> deliver offset=7"
        GroupA->>GroupA: "onMessage(rec) [2ms] -> commit offset=8"
    and "Independent Offset Tracking"
        Partition-->>GroupB: "wake from await() -> deliver offset=7"
        GroupB->>GroupB: "onMessage(rec) [400ms] -> commit offset=8"
    end`,
      },
    },
    codeFiles: [
      {
        filename: 'MessageModels.java',
        label: 'MessageModels.java',
        summary: 'Immutable Message & PartitionRecord envelopes, Subscriber contract, and bitwise-safe PartitionRoutingStrategy.',
        code: `import java.time.Instant;
import java.util.Objects;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicInteger;

public record Message(String messageId, String routingKey, String payload, Instant createdAt) {
    public Message {
        Objects.requireNonNull(messageId, "messageId required");
        Objects.requireNonNull(payload, "payload required");
        Objects.requireNonNull(createdAt, "createdAt required");
    }

    public static Message of(String routingKey, String payload) {
        return new Message(UUID.randomUUID().toString(), routingKey, payload, Instant.now());
    }
}

public record PartitionRecord(int partitionId, long offset, Message message) {}

public interface Subscriber {
    String getId();
    void onMessage(PartitionRecord record);
}

@FunctionalInterface
public interface PartitionRoutingStrategy {
    int selectPartition(String routingKey, int partitionCount);
}

public final class HashKeyRoutingStrategy implements PartitionRoutingStrategy {
    private final AtomicInteger roundRobin = new AtomicInteger(0);

    @Override
    public int selectPartition(String routingKey, int partitionCount) {
        if (partitionCount <= 0) {
            throw new IllegalArgumentException("partitionCount must be positive");
        }
        // Mask sign bit to avoid Math.abs(Integer.MIN_VALUE) negative overflow bug
        if (routingKey != null && !routingKey.isEmpty()) {
            return (routingKey.hashCode() & 0x7fffffff) % partitionCount;
        }
        return (roundRobin.getAndIncrement() & 0x7fffffff) % partitionCount;
    }
}`,
        callouts: [
          {
            id: 'ps-records',
            startLine: 6,
            endLine: 18,
            title: 'Immutable Records for Safe Zero-Copy Fan-Out',
            explanation:
              'Because Message and PartitionRecord are deeply immutable, one PartitionRecord object in the partition log can be safely delivered to 20 concurrent ConsumerGroups without defensive copying or mutation bugs.',
            accent: 'primary',
          },
          {
            id: 'ps-hashmask',
            startLine: 38,
            endLine: 42,
            title: 'Bitwise Sign-Mask Beats Math.abs(hashCode())',
            explanation:
              'Math.abs(Integer.MIN_VALUE) returns Integer.MIN_VALUE (negative!) in Java, causing ArrayIndexOutOfBoundsException on modulo! Masking with & 0x7fffffff guarantees a strictly non-negative bucket for every possible key and round-robin counter rollover.',
            accent: 'amber',
          },
        ],
      },
      {
        filename: 'TopicPartition.java',
        label: 'TopicPartition.java',
        summary: 'Lock-striped append-only partition log using ReentrantLock + Condition for zero-spin producer-consumer wakeup.',
        code: `import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.locks.Condition;
import java.util.concurrent.locks.ReentrantLock;

public final class TopicPartition {
    private final int partitionId;
    private final List<PartitionRecord> log = new ArrayList<>();
    private final ReentrantLock lock = new ReentrantLock();
    private final Condition dataAvailable = lock.newCondition();

    public TopicPartition(int partitionId) {
        this.partitionId = partitionId;
    }

    public PartitionRecord append(Message message) {
        lock.lock();
        try {
            long offset = log.size();
            PartitionRecord record = new PartitionRecord(partitionId, offset, message);
            log.add(record);
            // Wake all consumer groups currently awaiting new records on this partition
            dataAvailable.signalAll();
            return record;
        } finally {
            lock.unlock();
        }
    }

    public Optional<PartitionRecord> poll(long expectedOffset, long timeoutMillis)
            throws InterruptedException {
        if (expectedOffset < 0) {
            throw new IllegalArgumentException("Offset cannot be negative: " + expectedOffset);
        }
        long remainingNanos = TimeUnit.MILLISECONDS.toNanos(timeoutMillis);
        lock.lock();
        try {
            // While-loop guards against spurious wakeups and concurrent offset resets
            while (expectedOffset >= log.size()) {
                if (remainingNanos <= 0L) {
                    return Optional.empty();
                }
                remainingNanos = dataAvailable.awaitNanos(remainingNanos);
            }
            return Optional.of(log.get((int) expectedOffset));
        } finally {
            lock.unlock();
        }
    }

    public long getHighWatermark() {
        lock.lock();
        try {
            return log.size();
        } finally {
            lock.unlock();
        }
    }

    public int getPartitionId() { return partitionId; }
}`,
        callouts: [
          {
            id: 'tp-signalall',
            startLine: 18,
            endLine: 29,
            title: 'Why signalAll() Instead of signal()',
            explanation:
              'Multiple independent ConsumerGroups (Analytics, Billing, Fraud) may be sleeping on the same TopicPartition’s dataAvailable Condition simultaneously. Calling signal() would wake only ONE group, starving all others!',
            accent: 'amber',
          },
          {
            id: 'tp-awaitnanos',
            startLine: 39,
            endLine: 47,
            title: 'Spurious-Wakeup Safe Timed awaitNanos()',
            explanation:
              'Using awaitNanos inside a while-loop handles spurious OS wakeups and bounds shutdown latency cleanly: when a worker’s running flag flips false, it exits cleanly within timeoutMillis without leaking blocked threads.',
            accent: 'emerald',
          },
        ],
      },
      {
        filename: 'ConsumerGroup.java',
        label: 'ConsumerGroup.java',
        summary: 'Per-partition offset tracker and fault-isolated async consumer workers supporting offset replay and DLQ handling.',
        code: `import java.util.List;
import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.atomic.AtomicBoolean;
import java.util.concurrent.atomic.AtomicLong;
import java.util.function.BiConsumer;

public final class ConsumerGroup {
    private static final long POLL_TIMEOUT_MS = 200L;

    private final String groupId;
    private final Subscriber subscriber;
    private final List<TopicPartition> partitions;
    private final ConcurrentHashMap<Integer, AtomicLong> offsets = new ConcurrentHashMap<>();
    private final BiConsumer<PartitionRecord, Exception> deadLetterHandler;
    private final AtomicBoolean running = new AtomicBoolean(false);

    public ConsumerGroup(
            String groupId,
            Subscriber subscriber,
            List<TopicPartition> partitions,
            BiConsumer<PartitionRecord, Exception> deadLetterHandler) {
        this.groupId = groupId;
        this.subscriber = subscriber;
        this.partitions = List.copyOf(partitions);
        this.deadLetterHandler = deadLetterHandler;
        for (TopicPartition p : this.partitions) {
            offsets.put(p.getPartitionId(), new AtomicLong(0L));
        }
    }

    public void start(ExecutorService workerPool) {
        if (!running.compareAndSet(false, true)) {
            return; // Idempotent start guard
        }
        for (TopicPartition partition : partitions) {
            workerPool.submit(() -> consumePartitionLoop(partition));
        }
    }

    private void consumePartitionLoop(TopicPartition partition) {
        AtomicLong cursor = offsets.get(partition.getPartitionId());
        while (running.get() && !Thread.currentThread().isInterrupted()) {
            long currentOffset = cursor.get();
            try {
                Optional<PartitionRecord> maybeRecord = partition.poll(currentOffset, POLL_TIMEOUT_MS);
                if (maybeRecord.isEmpty()) {
                    continue;
                }
                PartitionRecord record = maybeRecord.get();
                try {
                    subscriber.onMessage(record);
                } catch (Exception ex) {
                    // Isolate faulty subscriber so one poison message never kills the partition worker
                    deadLetterHandler.accept(record, ex);
                }
                // CAS ensures an external resetOffset() call is never clobbered by stale increment
                cursor.compareAndSet(currentOffset, currentOffset + 1);
            } catch (InterruptedException ie) {
                Thread.currentThread().interrupt();
                break;
            }
        }
    }

    public void resetOffset(int partitionId, long newOffset) {
        AtomicLong cursor = offsets.get(partitionId);
        if (cursor == null || newOffset < 0) {
            throw new IllegalArgumentException("Invalid partition or offset");
        }
        cursor.set(newOffset);
    }

    public void stop() {
        running.set(false);
    }

    public String getGroupId() { return groupId; }
}`,
        callouts: [
          {
            id: 'cg-isolation',
            startLine: 51,
            endLine: 57,
            title: 'Fault Isolation via Dead-Letter Callback',
            explanation:
              'If subscriber.onMessage() throws a RuntimeException on a malformed JSON payload, catching and routing it to deadLetterHandler prevents the ExecutorService thread from dying silently and halting the entire partition.',
            accent: 'rose',
          },
          {
            id: 'cg-cas',
            startLine: 58,
            endLine: 59,
            title: 'Compare-And-Set Protects Concurrent Offset Replay',
            explanation:
              'If an operator calls resetOffset(partitionId, 0) while offset 42 is mid-processing, a blind incrementAndGet() would jump to 1 (skipping 0!). Using compareAndSet(42, 43) preserves the operator’s reset to 0 cleanly.',
            accent: 'amber',
          },
          {
            id: 'cg-interrupt',
            startLine: 60,
            endLine: 63,
            title: 'Always Restore Thread Interruption Flag',
            explanation:
              'Calling Thread.currentThread().interrupt() when catching InterruptedException respects cooperative JVM shutdown semantics.',
            accent: 'primary',
          },
        ],
      },
      {
        filename: 'MessageBroker.java',
        label: 'MessageBroker.java',
        summary: 'Thread-safe broker coordinating Topics (CopyOnWriteArrayList groups), keyed publish, and isolated executor pool.',
        code: `import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.CopyOnWriteArrayList;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.TimeUnit;
import java.util.function.BiConsumer;

public final class Topic {
    private final String name;
    private final List<TopicPartition> partitions;
    private final CopyOnWriteArrayList<ConsumerGroup> groups = new CopyOnWriteArrayList<>();

    public Topic(String name, int partitionCount) {
        if (partitionCount <= 0) {
            throw new IllegalArgumentException("partitionCount must be > 0");
        }
        this.name = name;
        List<TopicPartition> created = new ArrayList<>(partitionCount);
        for (int i = 0; i < partitionCount; i++) {
            created.add(new TopicPartition(i));
        }
        this.partitions = List.copyOf(created);
    }

    public TopicPartition getPartition(int id) { return partitions.get(id); }
    public int getPartitionCount() { return partitions.size(); }
    public List<TopicPartition> getPartitions() { return partitions; }
    public String getName() { return name; }

    public void addGroup(ConsumerGroup group) { groups.add(group); }
    public List<ConsumerGroup> getGroups() { return groups; }
}

public class MessageBroker implements AutoCloseable {
    private final Map<String, Topic> topics = new ConcurrentHashMap<>();
    private final PartitionRoutingStrategy routingStrategy;
    private final ExecutorService consumerPool;
    private final BiConsumer<PartitionRecord, Exception> deadLetterHandler;

    public MessageBroker(
            PartitionRoutingStrategy routingStrategy,
            int maxConsumerThreads,
            BiConsumer<PartitionRecord, Exception> deadLetterHandler) {
        this.routingStrategy = routingStrategy;
        this.deadLetterHandler = deadLetterHandler;
        this.consumerPool = Executors.newFixedThreadPool(maxConsumerThreads, r -> {
            Thread t = new Thread(r, "pubsub-worker");
            t.setDaemon(true);
            return t;
        });
    }

    public Topic createTopic(String topicName, int partitionCount) {
        return topics.computeIfAbsent(topicName, name -> new Topic(name, partitionCount));
    }

    public PartitionRecord publish(String topicName, Message message) {
        Topic topic = requireTopic(topicName);
        int partitionId = routingStrategy.selectPartition(message.routingKey(), topic.getPartitionCount());
        // O(1) non-blocking append on chosen partition; publishers never wait for subscribers
        return topic.getPartition(partitionId).append(message);
    }

    public ConsumerGroup subscribe(String topicName, String groupId, Subscriber subscriber) {
        Topic topic = requireTopic(topicName);
        ConsumerGroup group = new ConsumerGroup(groupId, subscriber, topic.getPartitions(), deadLetterHandler);
        topic.addGroup(group);
        group.start(consumerPool);
        return group;
    }

    public void resetOffset(String topicName, String groupId, int partitionId, long offset) {
        Topic topic = requireTopic(topicName);
        topic.getGroups().stream()
            .filter(g -> g.getGroupId().equals(groupId))
            .findFirst()
            .orElseThrow(() -> new IllegalArgumentException("Unknown group: " + groupId))
            .resetOffset(partitionId, offset);
    }

    @Override
    public void close() throws InterruptedException {
        topics.values().forEach(t -> t.getGroups().forEach(ConsumerGroup::stop));
        consumerPool.shutdown();
        if (!consumerPool.awaitTermination(5, TimeUnit.SECONDS)) {
            consumerPool.shutdownNow();
        }
    }

    private Topic requireTopic(String topicName) {
        Topic topic = topics.get(topicName);
        if (topic == null) {
            throw new IllegalArgumentException("Topic not found: " + topicName);
        }
        return topic;
    }
}`,
        callouts: [
          {
            id: 'mb-cow',
            startLine: 14,
            endLine: 14,
            title: 'CopyOnWriteArrayList for Read-Heavy Group Registry',
            explanation:
              'Consumer group registrations happen rarely (at service startup), whereas monitoring, offset resets, and shutdowns iterate groups frequently. CopyOnWriteArrayList gives lock-free, ConcurrentModificationException-free traversal.',
            accent: 'primary',
          },
          {
            id: 'mb-publish-fast',
            startLine: 60,
            endLine: 65,
            title: 'Zero Publisher-to-Subscriber Coupling on Hot Path',
            explanation:
              'publish() only locks the single target TopicPartition for an in-memory ArrayList.add() + signalAll(). Even if 10 subscribers stall on downstream HTTP calls, publisher latency stays sub-microsecond.',
            accent: 'emerald',
          },
          {
            id: 'mb-shutdown',
            startLine: 84,
            endLine: 91,
            title: 'Graceful Two-Phase Broker Shutdown',
            explanation:
              'Implementing AutoCloseable flips every group’s running flag first so workers exit their poll loop cleanly, then awaits pool termination before falling back to shutdownNow() interrupts.',
            accent: 'amber',
          },
        ],
      },
    ],
    solidHighlights: [
      {
        principle: 'Single Responsibility',
        application:
          'TopicPartition handles ordered log storage and monitor signaling, PartitionRoutingStrategy maps keys to partitions, ConsumerGroup owns offset tracking and worker fault isolation, and MessageBroker coordinates lifecycle.',
      },
      {
        principle: 'Open/Closed',
        application:
          'Swapping HashKeyRoutingStrategy for StickyBatchRoutingStrategy or adding a RetryingSubscriberDecorator requires zero modifications to MessageBroker or TopicPartition.',
      },
      {
        principle: 'Interface Segregation',
        application:
          'Subscribers implement a minimal 2-method interface (getId + onMessage) without being forced to know about locks, partitions, or executor internals.',
      },
      {
        principle: 'Dependency Inversion',
        application:
          'MessageBroker depends on PartitionRoutingStrategy, Subscriber, and BiConsumer dead-letter abstractions rather than concrete consumer classes.',
      },
    ],
    extensibilityScenarios: [
      {
        scenario: 'Bounded Retention / Ring-Buffer Memory Cap (Prevent OOM on Long Streams)',
        changesRequired:
          'Replace ArrayList<PartitionRecord> inside TopicPartition with a bounded circular ring buffer (or segmented log storing baseOffset) that evicts records older than TTL or maxCapacity — ConsumerGroup already tracks logical long offsets, so zero API changes are required!',
      },
      {
        scenario: 'Per-Subscriber Exponential Backoff & Automatic DLQ Topic',
        changesRequired:
          'Wrap Subscriber in a RetryingSubscriber decorator (attempting 3 retries with jittered backoff before publishing the failed PartitionRecord to topicName + ".dlq" via MessageBroker).',
      },
      {
        scenario: 'Dynamic Consumer Rebalancing Across Multiple Subscribers in One Group',
        changesRequired:
          'Introduce a PartitionAssignor strategy (RangeAssignor / StickyAssignor) mapping topic partitions across M member instances inside ConsumerGroup while keeping one worker per partition.',
      },
    ],
    concurrencyChoices: [
      {
        topic: 'Lock-Striped Partition Concurrency',
        mechanism: 'Per-TopicPartition ReentrantLock + Condition (not a broker-wide synchronized lock)',
        rationale:
          'Producers writing to Partition 0..7 execute in full parallel; contention scales down by 1/P with partition count while maintaining strict sequential offset assignment within each partition.',
      },
      {
        topic: 'Slow-Subscriber Isolation',
        mechanism: 'Dedicated ExecutorService pool + pull-by-offset workers decoupled from publish()',
        rationale:
          'Publishers never invoke Subscriber.onMessage() directly. In production, further isolate per-ConsumerGroup bounded ThreadPoolExecutors (Bulkhead Pattern) so a stuck Analytics group cannot exhaust threads needed by Payments.',
      },
      {
        topic: 'Race-Free Offset Commits vs. Replay Resets',
        mechanism: 'ConcurrentHashMap<Integer, AtomicLong> updated via compareAndSet(curr, curr + 1)',
        rationale:
          'Allows lock-free offset reads for lag monitoring and prevents a worker finishing offset N from overwriting a concurrent operator resetOffset(0) call.',
      },
    ],
  },

  /* ================================================================
   * DAY 3 HLD: MULTI-CHANNEL NOTIFICATION SYSTEM
   * ================================================================ */
  hldLesson: {
    id: 'day3-notification-system',
    dayNumber: 3,
    kind: 'hld',
    title: 'Multi-Channel Notification System',
    subtitle: 'Priority-isolated Kafka lanes (P0 OTP vs. P2 Marketing), idempotent deduplication, per-user rate limits, and multi-vendor failover',
    tags: ['Priority Queues', 'Multi-Channel', 'Idempotency & DLQ', 'Vendor Failover'],
    estimatedMinutes: 25,
    overview:
      'Design a fault-tolerant, multi-channel notification platform delivering 100M notifications/day across Mobile Push (APNs/FCM), SMS (Twilio/Vonage), Email (SES/SendGrid), and In-App Feeds — guaranteeing sub-5s delivery for P0 login OTPs even during 10M-user Black Friday marketing blasts.',
    requirements: {
      functional: [
        'Support 4 delivery channels (Push, SMS, Email, In-App) with localized templated payloads and dynamic variable substitution.',
        'Respect per-user channel preferences, global opt-outs, quiet hours (timezone-aware), and frequency caps (e.g., max 3 promos/day).',
        'Enforce strict priority isolation: P0 critical alerts (2FA OTP, fraud alerts) bypass marketing queues and never suffer head-of-line blocking.',
        'Guarantee at-least-once delivery with deduplication (idempotency keys), exponential backoff retries, Dead-Letter Queues (DLQ), and real-time delivery audit logs.',
      ],
      nonFunctional: [
        {
          metric: 'P0 Critical Latency (p99)',
          target: '< 5 seconds end-to-end (OTP / Security)',
          rationale: 'Users waiting for a login 2FA code abandon checkout within 10–15 seconds; P0 must have dedicated queues and worker fleets.',
        },
        {
          metric: 'Availability & Durability',
          target: '99.99% ingestion · Zero silent drops',
          rationale: 'Once POST /notifications returns 202 Accepted, the event is durably committed to replicated Kafka and retried across vendor outages.',
        },
        {
          metric: 'Duplicate Prevention',
          target: 'Effectively-once within 24h idempotency window',
          rationale: 'Upstream payment/auth retries must never spam a user with 5 identical SMS OTPs (hurts UX AND burns SMS vendor spend!).',
        },
        {
          metric: 'Vendor Resilience',
          target: '< 30s automatic failover across SMS/Email providers',
          rationale: 'Third-party gateways (Twilio, SES, APNs) experience regional brownouts; circuit breakers must shift traffic to backup providers seamlessly.',
        },
      ],
    },
    capacityMath: {
      assumptions: [
        '50M Daily Active Users (DAU) receiving 100M total notifications/day: 65M Push, 20M Email, 10M In-App, 5M SMS',
        'Priority mix: 10% P0 Critical (10M/day), 30% P1 Transactional (30M/day), 60% P2 Bulk Promo (60M/day)',
        'Campaign burst peak multiplier = 5× average QPS; average notification + audit record ≈ 1 KB',
        'Idempotency dedup TTL = 24 hours; hot delivery audit retention = 90 days (older archived to S3)',
      ],
      calculations: [
        {
          metric: 'Total Ingress QPS (Avg / Peak)',
          formula: '100M / 86,400 ≈ 1,157 → ×5 campaign peak',
          result: '~1,160 RPS avg · ~5,800 RPS peak',
          notes: 'Easily ingested by a stateless API fleet; external provider rate limits are the real bottleneck.',
        },
        {
          metric: 'P0 OTP Isolated Lane QPS',
          formula: '10M / 86,400 ≈ 116 → ×5 login spike peak',
          result: '~116 RPS avg · ~580 RPS peak',
          notes: 'Dedicated Kafka topic + isolated P0 worker pool keeps P0 queue lag near zero during 5K RPS promo bursts.',
        },
        {
          metric: 'SMS Vendor Rate & Cost Guard',
          formula: '5M / 86,400 ≈ 58 RPS avg (~290 peak) × $0.0075/SMS',
          result: '~58 RPS avg · ~$37.5K / day spend',
          notes: 'Per-user sliding-window rate limits + idempotency dedup directly protect against runaway SMS billing storms.',
        },
        {
          metric: 'Redis Guard Memory (Dedup + Prefs)',
          formula: '(100M keys × 100 B dedup) + (50M users × 200 B prefs)',
          result: '~20 GB RAM (~40 GB w/ replica + overhead)',
          notes: 'Fits effortlessly in a 3-shard Redis Cluster (16 GB/node) delivering sub-1ms dedup + rate checks.',
        },
        {
          metric: '90-Day Hot Delivery Audit Storage',
          formula: '100M/day × 90 days × 1 KB = 9B × 1 KB',
          result: '9 TB raw (~27 TB w/ 3× replication)',
          notes: 'Time-partitioned Cassandra/DynamoDB tables with 90-day TTL keep write throughput linear and hot storage flat.',
        },
        {
          metric: 'Peak Kafka Bus Bandwidth',
          formula: '5,800 RPS × 1 KB payload (×3 RF internally)',
          result: '~5.8 MB/s ingress · ~17.4 MB/s cluster',
          notes: 'Modest network footprint — partition Kafka topics by userId (32–64 partitions) for parallel dispatch.',
        },
      ],
    },
    apiAndDataModel: {
      endpoints: [
        {
          method: 'POST',
          path: '/api/v1/notifications',
          summary: 'Accept notification request idempotently (returns 202 Accepted immediately after Kafka publish)',
          payload: 'Header: Idempotency-Key: uuid · Body: { "userId": "u_42", "priority": "P0", "templateId": "otp_login", "channels": ["SMS","PUSH"], "params": {"code":"491022"} } → 202 { "notifId": "n_881a" }',
        },
        {
          method: 'PUT',
          path: '/api/v1/users/{userId}/preferences',
          summary: 'Update channel opt-in/opt-out flags, quiet hours window, and frequency limits',
          payload: '{ "marketingEmail": false, "pushEnabled": true, "quietHours": "22:00-07:00", "tz": "America/Los_Angeles" } → 200 OK',
        },
        {
          method: 'GET',
          path: '/api/v1/users/{userId}/inbox?cursor={ts}&limit=20',
          summary: 'Fetch paginated In-App notification feed and read/unread badge counts',
          payload: '200 { "unreadCount": 4, "items": [{ "notifId": "n_881a", "title": "...", "read": false }] }',
        },
      ],
      storageSchema: [
        {
          store: 'Preference & Template DB (PostgreSQL / Aurora)',
          schema: 'user_prefs (user_id PK, channel_flags JSONB, quiet_start, quiet_end, tz) · templates (template_id PK, locale, channel, subject, body_mustache, version)',
          shardingAndIndexing:
            'Strong ACID updates for compliance opt-outs (CAN-SPAM / GDPR), read-through cached in Redis Guard Cache with immediate invalidation on PUT /preferences.',
        },
        {
          store: 'Delivery Audit & In-App Inbox Store (Cassandra / DynamoDB)',
          schema: 'inbox (user_id PK, created_at CK DESC, notif_id, payload, is_read) · delivery_log (notif_id PK, channel, vendor, status, attempt_count, error_code)',
          shardingAndIndexing:
            'Partitioned by user_id with clustering key created_at DESC for O(1) paginated inbox reads; 90-day native TTL auto-expires cold logs after S3 archival.',
        },
      ],
    },
    architecture: {
      title: 'Multi-Channel Notification System — Interactive Architecture',
      summary: 'Inspect how P0 OTP isolation, Redis idempotency guards, template rendering, and exponential retry DLQs collaborate',
      defaultSelectedNodeId: 'priority-kafka',
      nodes: [
        {
          id: 'callers',
          label: 'Producers & Users',
          sublabel: 'Services · Mobile',
          category: 'client',
          x: 14,
          y: 216,
          width: 136,
          height: 58,
          flows: ['write', 'read'],
          details: {
            role: 'Upstream backend microservices (Auth OTP, Payments, Order Tracking, Marketing Campaigns) triggering notifications, plus end-user apps reading In-App feeds and updating opt-out preferences.',
            dataFlow: 'Sends POST /api/v1/notifications with an Idempotency-Key header to Notification API, and GET /inbox or PUT /preferences to Pref & Inbox API.',
            scalingStrategy: 'Bulk marketing jobs send batched campaign requests (up to 1,000 recipients/call) throttled by a campaign pacer to avoid overwhelming ingress gateways.',
            failureHandling: 'Callers safely retry timed-out POST requests using the exact same Idempotency-Key without causing duplicate SMS or push deliveries.',
            techChoices: ['Internal gRPC / REST', 'Idempotency-Key UUID', 'Campaign Pacer'],
          },
        },
        {
          id: 'notif-api',
          label: 'Notification API',
          sublabel: 'Auth · Dedup · Limit',
          category: 'edge',
          x: 196,
          y: 94,
          width: 158,
          height: 56,
          flows: ['write'],
          details: {
            role: 'Stateless ingestion gateway that authenticates callers, enforces idempotent deduplication, checks per-user preferences & frequency caps, classifies priority (P0/P1/P2), and returns 202 Accepted.',
            dataFlow: 'Calls Redis Guard for atomic SETNX dedup + sliding-window quota + cached preferences, then publishes validated envelopes to the matching Priority Kafka topic.',
            scalingStrategy: 'Purely stateless horizontally autoscaled pods behind L7 ALB; never blocks on external vendor HTTP calls.',
            failureHandling: 'If Redis is transiently unreachable, P0 security/OTP notifications fail-OPEN (allow delivery rather than locking users out of accounts!) while P2 marketing fails-CLOSED.',
            techChoices: ['Java / Go Stateless Fleet', 'Envoy / ALB', 'Fail-Open P0 Policy'],
          },
        },
        {
          id: 'inbox-api',
          label: 'Pref & Inbox API',
          sublabel: 'Opt-Out · Read Feed',
          category: 'service',
          x: 196,
          y: 356,
          width: 158,
          height: 56,
          flows: ['read', 'write'],
          details: {
            role: 'Serves user-facing notification settings (opt-outs, DND quiet hours, device push token registration) and low-latency paginated In-App notification center reads.',
            dataFlow: 'Writes preference updates to Pref & Template DB (invalidating Redis cache), and serves cursor-paginated GET /inbox + mark-as-read mutations from Delivery Log & Inbox DB.',
            scalingStrategy: 'Scaled independently on read QPS so millions of mobile app opens checking notification badges never contend with backend ingestion bursts.',
            failureHandling: 'Degrades gracefully on cache miss directly to Cassandra/DynamoDB read replicas; push-token deregistration triggers automatically when APNs/FCM returns HTTP 410 Unregistered.',
            techChoices: ['REST / GraphQL', 'Read-Through Cache', 'Cursor Pagination'],
          },
        },
        {
          id: 'redis-guard',
          label: 'Redis Guard Cache',
          sublabel: 'Idempotency · Quota',
          category: 'cache',
          x: 398,
          y: 16,
          width: 166,
          height: 56,
          flows: ['write', 'read'],
          details: {
            role: 'Sub-millisecond gatekeeper enforcing 24h idempotency deduplication, per-user channel frequency caps (e.g., max 3 promos/day), and hot user preference caching.',
            dataFlow: 'Executes Lua-scripted atomic SETNX dedup:{key} (24h TTL) + sliding-window token counter per (userId, category) in a single round-trip from Notification API.',
            scalingStrategy: '3+ shard Redis Cluster (~20 GB active set) partitioned by userId; multi-AZ read replicas absorb preference lookups.',
            failureHandling: 'AOF persistence + replica failover; circuit breaker skips non-critical quota checks for P0 OTPs during shard failover to preserve login availability.',
            techChoices: ['Redis Cluster', 'Atomic Lua Scripts', 'SETNX 24h TTL'],
          },
        },
        {
          id: 'priority-kafka',
          label: 'Priority Kafka',
          sublabel: 'P0 OTP · P1 · P2 Bulk',
          category: 'queue',
          x: 398,
          y: 174,
          width: 166,
          height: 56,
          flows: ['write'],
          details: {
            role: 'Durable multi-topic event backbone strictly segregating traffic into separate topics: notif.p0.critical, notif.p1.transactional, and notif.p2.marketing (plus per-channel sub-topics).',
            dataFlow: 'Receives accepted events from Notification API and delayed re-enqueues from Retry Scheduler; feeds isolated P0 Fast-Lane Workers and Channel Dispatchers.',
            scalingStrategy: '32–64 partitions per topic keyed by userId; absorbs 5×–20× marketing flash bursts cleanly on disk while P0 partitions stay empty and instant.',
            failureHandling: 'RF=3 with min.insync.replicas=2 across AZs; retains 7 days of events so a 2-hour downstream vendor outage causes zero data loss.',
            techChoices: ['Apache Kafka', 'Priority-Isolated Topics', 'Partitioned by userId'],
          },
        },
        {
          id: 'pref-tpl-db',
          label: 'Pref & Template DB',
          sublabel: 'Opt-In · i18n Copy',
          category: 'database',
          x: 398,
          y: 276,
          width: 166,
          height: 56,
          flows: ['read', 'write'],
          details: {
            role: 'ACID source of truth for user channel opt-out compliance, device tokens (iOS APNs / Android FCM), and versioned multi-language Mustache/Handlebars message templates.',
            dataFlow: 'Updated by Pref & Inbox API; read by Channel Dispatchers (and cached locally in worker L1 RAM with 60s TTL for templates) to render localized Push/SMS/Email copy.',
            scalingStrategy: 'Templates are small (<100K rows) and 99.9% read-heavy — cached in local worker memory; user_prefs sharded by userId with read replicas.',
            failureHandling: 'Immutable template versioning guarantees an in-flight campaign never renders broken variables mid-rollout; automatic failover standby across AZs.',
            techChoices: ['PostgreSQL / Aurora', 'Versioned Templates', 'L1 Worker Cache'],
          },
        },
        {
          id: 'delivery-db',
          label: 'Delivery Log & Inbox',
          sublabel: 'Status · In-App Store',
          category: 'storage',
          x: 398,
          y: 434,
          width: 166,
          height: 56,
          flows: ['write', 'read'],
          details: {
            role: 'High-throughput write store recording every delivery attempt, vendor message ID, webhook callback (SENT → DELIVERED / BOUNCED), and persisting rendered In-App notifications.',
            dataFlow: 'Written asynchronously by Channel Dispatchers and vendor delivery webhooks; queried by Pref & Inbox API for user notification centers and support debugging.',
            scalingStrategy: 'Wide-column store (Cassandra/DynamoDB) partitioned by user_id (inbox) and notif_id (audit), sustaining 10K+ writes/sec with linear node scaling and 90-day TTL.',
            failureHandling: 'Tunable quorum writes; cold logs stream via CDC to S3/ClickHouse for analytics and regulatory compliance audits.',
            techChoices: ['Apache Cassandra / DynamoDB', '90-Day Native TTL', 'S3 Cold Archive'],
          },
        },
        {
          id: 'p0-workers',
          label: 'P0 Fast-Lane Workers',
          sublabel: 'OTP · Multi-Vendor SMS',
          category: 'service',
          x: 700,
          y: 42,
          width: 208,
          height: 56,
          flows: ['write'],
          details: {
            role: 'Dedicated, over-provisioned consumer fleet exclusively processing notif.p0.critical (2FA OTPs, fraud alerts) with multi-vendor active-failover adapters (Twilio primary → Vonage/SNS backup).',
            dataFlow: 'Consumes P0 Kafka topic immediately → renders template from local L1 cache → dispatches SMS/Push with strict 2s vendor timeout → fails over instantaneously to backup provider on 5xx/timeout.',
            scalingStrategy: 'Isolated Kubernetes deployment & thread pools (Bulkhead Pattern) so a 10M marketing blast cannot steal a single CPU core or connection slot from login OTPs.',
            failureHandling: 'Per-vendor sliding-window circuit breaker trips within 10s of elevated failure rates, routing 100% of OTPs to the healthy secondary SMS carrier automatically.',
            techChoices: ['Isolated Consumer Group', 'Resilience4j Circuit Breaker', 'Twilio + Vonage Failover'],
          },
        },
        {
          id: 'channel-workers',
          label: 'Channel Dispatchers',
          sublabel: 'APNs · FCM · SES · App',
          category: 'service',
          x: 700,
          y: 198,
          width: 208,
          height: 56,
          flows: ['write'],
          details: {
            role: 'Channel-specialized worker pools (Push, Email, SMS, In-App) that render i18n templates, apply provider-level token-bucket pacing, invoke vendor SDKs/APIs, and persist delivery logs.',
            dataFlow: 'Consumes P1/P2 Kafka topics → resolves templates from Pref & Template DB → dispatches to APNs/FCM/SES/In-App → records audit row in Delivery Log DB or routes transient errors to Retry Delay + DLQ.',
            scalingStrategy: 'Separate worker fleets per channel prevent a slow SMTP/Email provider from delaying fast HTTP/2 APNs/FCM mobile pushes; batch-sends up to 500 FCM tokens per request.',
            failureHandling: 'Distinguishes permanent errors (HTTP 400 invalid phone / 410 uninstalled token → drop & clean token) from transient errors (HTTP 429 / 503 → forward to Retry Scheduler).',
            techChoices: ['Per-Channel Worker Pools', 'APNs HTTP/2 · FCM · SES', 'Permanent vs Transient Error Classifier'],
          },
        },
        {
          id: 'retry-dlq',
          label: 'Retry Delay + DLQ',
          sublabel: 'Exp Backoff · Poison Q',
          category: 'queue',
          x: 700,
          y: 372,
          width: 208,
          height: 56,
          flows: ['write'],
          details: {
            role: 'Manages tiered exponential backoff retry topics (1m → 5m → 30m → 2h with jitter) and parks permanently exhausted or malformed poison messages into an inspectable Dead-Letter Queue.',
            dataFlow: 'Receives transient failures from Channel Dispatchers → delays until nextAttemptAt → re-enqueues back into Priority Kafka (or moves to DLQ after maxAttempts = 5 and triggers PagerDuty alert).',
            scalingStrategy: 'Tiered delay Kafka topics (or Redis ZSET delay wheel for sub-minute OTP retries) prevent failed messages from blocking healthy partitions behind them.',
            failureHandling: 'Operators inspect DLQ payloads via replay dashboard after fixing broken templates or provider credentials; P0 OTP messages skip long retries (TTL = 2 min — stale OTPs are useless!).',
            techChoices: ['Tiered Delay Topics', 'Jittered Exp Backoff', 'DLQ Replay Console'],
          },
        },
      ],
      edges: [
        { id: 'ns-1', from: 'callers', to: 'notif-api', label: 'POST /notify', flow: 'write', labelT: 0.5 },
        { id: 'ns-2', from: 'callers', to: 'inbox-api', label: 'GET /inbox', flow: 'read', labelT: 0.5 },
        { id: 'ns-3', from: 'notif-api', to: 'redis-guard', label: 'Dedup/Limit', flow: 'write', labelT: 0.5 },
        { id: 'ns-4', from: 'notif-api', to: 'priority-kafka', label: 'P0/P1/P2', flow: 'write', async: true, labelT: 0.5 },
        { id: 'ns-5', from: 'inbox-api', to: 'pref-tpl-db', label: 'User Prefs', flow: 'both', labelT: 0.5 },
        { id: 'ns-6', from: 'inbox-api', to: 'delivery-db', label: 'Read Inbox', flow: 'read', labelT: 0.5 },
        { id: 'ns-7', from: 'priority-kafka', to: 'p0-workers', label: 'P0 OTP', flow: 'write', async: true, labelT: 0.5 },
        { id: 'ns-8', from: 'priority-kafka', to: 'channel-workers', label: 'P1/P2 Fanout', flow: 'write', async: true, labelT: 0.5 },
        {
          id: 'ns-9',
          from: 'channel-workers',
          to: 'pref-tpl-db',
          label: 'Render Tpl',
          flow: 'write',
          fromSide: 'left',
          toSide: 'right',
          labelT: 0.42,
        },
        {
          id: 'ns-10',
          from: 'channel-workers',
          to: 'delivery-db',
          label: 'Audit + App',
          flow: 'write',
          fromSide: 'left',
          toSide: 'right',
          labelT: 0.72,
        },
        {
          id: 'ns-11',
          from: 'channel-workers',
          to: 'retry-dlq',
          label: 'Transient Fail',
          flow: 'write',
          async: true,
          fromSide: 'bottom',
          toSide: 'top',
          labelT: 0.5,
        },
        {
          id: 'ns-12',
          from: 'retry-dlq',
          to: 'priority-kafka',
          label: 'Re-Enqueue',
          flow: 'write',
          async: true,
          fromSide: 'left',
          toSide: 'right',
          labelT: 0.34,
        },
      ],
    },
    tradeOffs: [
      {
        topic: 'Queue Topology: Single Priority Queue vs. Physically Isolated Priority Topics (P0 / P1 / P2)',
        context: 'A 10M-user Black Friday promotional push campaign fires at the exact minute thousands of shoppers request 2FA login OTPs.',
        options: [
          {
            name: 'Single Shared Topic with Priority Metadata Header',
            pros: ['Simpler broker topic provisioning and fewer consumer deployments'],
            cons: [
              'Catastrophic head-of-line blocking: Kafka partitions are strict FIFO, so P0 OTPs get stuck behind millions of queued P2 promo messages',
              'Shared worker threads get saturated by slow email/promo vendor timeouts',
            ],
            whenToChoose: 'Low-volume internal tools with homogeneous latency SLAs.',
          },
          {
            name: 'Dedicated Topics + Isolated Worker Fleets per Priority & Channel',
            recommended: true,
            pros: [
              'Zero head-of-line blocking: P0 OTP topic stays sub-second even if P2 has 10M queued messages',
              'Independent autoscaling, retry TTLs (2 min for OTP vs. 24h for promos), and bulkhead thread pools per lane',
              'Allows P0 fail-open guard policies while keeping strict P2 marketing caps',
            ],
            cons: ['More Kafka topics and consumer deployments to monitor'],
            whenToChoose: 'Any production platform mixing critical auth/payment alerts with bulk marketing notifications.',
          },
        ],
        seniorVerdict:
          'Physically separate P0 Critical, P1 Transactional, and P2 Bulk into dedicated Kafka topics AND dedicated worker deployments (Bulkhead Pattern). Also segregate workers by channel (Push vs. SMS vs. Email) so a degraded SMTP gateway never slows mobile push.',
      },
      {
        topic: 'Delivery Guarantees: At-Most-Once vs. At-Least-Once + Idempotent Deduplication',
        context: 'External SMS/Push gateways (Twilio, APNs) cannot participate in distributed 2PC transactions with our Kafka offsets.',
        options: [
          {
            name: 'At-Most-Once (Commit Offset Before Calling Vendor)',
            pros: ['Never sends duplicate notifications'],
            cons: [
              'Worker crash mid-request permanently drops critical password-reset, fraud, or payment alerts silently',
            ],
            whenToChoose: 'Ephemeral, low-value telemetry or typing indicators where occasional drops are harmless.',
          },
          {
            name: 'At-Least-Once + Redis Idempotency Window + Vendor Dedup IDs',
            recommended: true,
            pros: [
              'Zero silent loss: offset commits only after vendor acknowledges or failure enters Retry Delay topic',
              'Redis SETNX (24h TTL) blocks duplicate upstream caller retries before enqueueing',
              'Passing notifId as vendor deduplication key (e.g., APNs apns-collapse-id / Twilio idempotency) minimizes crash-window duplicates',
            ],
            cons: ['Tiny residual window for duplicate delivery if worker crashes AFTER vendor accepts HTTP 200 but BEFORE marking sent'],
            whenToChoose: 'All commercial notification systems balancing reliability and anti-spam UX.',
          },
        ],
        seniorVerdict:
          'Commit to At-Least-Once delivery backed by an explicit caller Idempotency-Key in Redis (24h TTL) plus an atomic worker status transition (PENDING → DISPATCHED) before committing offsets. Be transparent about the rare post-HTTP-200 crash window — interviewers respect honest distributed-systems realism.',
      },
      {
        topic: 'Vendor Reliability: Single Carrier vs. Multi-Vendor Circuit-Breaker Failover',
        context: 'SMS and Email providers suffer regional outages, carrier throttling, and sudden latency spikes.',
        options: [
          {
            name: 'Single Hardcoded Vendor (e.g., Twilio Only)',
            pros: ['Lowest initial SDK integration effort and volume-tier pricing concentration'],
            cons: [
              'Single point of failure: a 45-minute Twilio outage breaks 100% of user logins and 2FA checkouts globally',
              'No leverage for geo-specific routing costs (e.g., local SMS aggregators in India/EU)',
            ],
            whenToChoose: 'Early MVPs before 2FA/transactional SMS becomes revenue-critical.',
          },
          {
            name: 'Vendor Adapter Abstraction + Health-Scored Circuit Breaker Failover',
            recommended: true,
            pros: [
              'Automatic sub-30s failover to backup carrier (Twilio → Vonage / AWS SNS) when error rate or p99 crosses threshold',
              'Supports active-active weighted routing (e.g., 85% Primary / 15% Canary) so the backup carrier’s credentials and sender IDs stay continuously warm and verified',
              'Enables cost-optimal regional routing by country code',
            ],
            cons: ['Must maintain dual carrier contracts, sender-ID registrations, and normalized webhook parsers'],
            whenToChoose: 'Production platforms with strict P0 OTP SLAs and international user bases.',
          },
        ],
        seniorVerdict:
          'Abstract every channel behind a ChannelProvider adapter with active-active canary traffic (e.g., 90/10 split) plus sliding-window circuit breakers. Running 10% live traffic through the backup carrier prevents the classic trap of discovering an expired backup API key during an outage!',
      },
    ],
  },
};
