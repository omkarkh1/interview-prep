import type { DayCurriculum } from '@/types/curriculum';

export const day6: DayCurriculum = {
  dayNumber: 6,
  title: 'Binary Search on Answer & Intervals',
  theme: 'Monotonic Feasibility Spaces, Sweep-Line Scheduling, O(1) Caching & Geo-Spatial Dispatch',
  status: 'complete',
  estimatedMinutes: 120,
  summary:
    'Master Binary Search over monotonic answer spaces and partition invariants, conquer interval merging and Min-Heap room scheduling, engineer a lock-striped thread-safe O(1) LRU & LFU Cache in Java, and architect Uber’s H3 geo-spatial dispatch and surge-pricing platform.',
  dsaLessons: [
    /* ================================================================
     * DSA 1: KOKO EATING BANANAS
     * ================================================================ */
    {
      id: 'day6-koko-eating-bananas',
      dayNumber: 6,
      kind: 'dsa',
      title: 'Koko Eating Bananas',
      subtitle: 'Binary search on a monotonic feasibility predicate over eating speed k',
      difficulty: 'Medium',
      patterns: ['Binary Search on Answer', 'Monotonic Predicate', 'Ceiling Division'],
      estimatedMinutes: 13,
      leetcodeRef: 'LC #875',
      problemStatement:
        'Koko loves to eat bananas. There are n piles of bananas where the i-th pile has piles[i] bananas, and the guards return in h hours (h ≥ n). Each hour, Koko picks one pile and eats up to k bananas from it (if the pile has fewer than k, she finishes it and waits until the next hour). Return the minimum integer eating speed k such that she can finish all bananas within h hours.',
      exampleSummary: {
        input: 'piles = [3, 6, 7, 11], h = 8',
        output: '4',
        explanation:
          'At k = 4 bananas/hour, the four piles take ⌈3/4⌉ + ⌈6/4⌉ + ⌈7/4⌉ + ⌈11/4⌉ = 1 + 2 + 2 + 3 = 8 hours (feasible). At k = 3, they take 1 + 2 + 3 + 4 = 10 > 8 hours (infeasible). Therefore k = 4 is the exact minimum.',
      },
      patternRecognition: {
        interviewCue:
          'Ask: "Can I verify whether a guessed answer X works in O(n), and if X works, does every larger (or smaller) value automatically work too?" Whenever an optimization asks for the MINIMUM feasible capacity/speed/rate over a bounded integer range, binary search the answer space directly.',
        signals: [
          'Keywords: "minimum speed / capacity / days / threshold such that all tasks finish within h"',
          'Feasibility predicate canFinish(k) is monotonic: [False, False, ..., False, True, True, ..., True]',
          'Direct greedy construction is hard, yet verifying a candidate speed k takes one linear O(n) pass',
        ],
        mentalModel:
          'Do not search the piles array — search the implicit sorted domain of candidate speeds k ∈ [1 .. max(piles)]. Compute hours(mid) = Σ ⌈pile / mid⌉. If hours(mid) ≤ h, mid is feasible so record it and squeeze hi = mid to test slower speeds; otherwise mid is too slow so discard [lo..mid] via lo = mid + 1.',
      },
      intuitionComparison: {
        bruteForce: {
          approach:
            'Linearly test every integer speed k = 1, 2, 3, ... up to max(piles), summing ceiling hours across all piles until the first speed satisfies totalHours ≤ h.',
          timeComplexity: 'O(n × M) where M = max(piles)',
          spaceComplexity: 'O(1)',
          bottleneck:
            'When piles[i] reaches 10⁹ and h ≈ n, testing speeds sequentially takes up to 10⁹ × n iterations (guaranteed TLE).',
        },
        optimal: {
          approach:
            'Binary search k ∈ [1, max(piles)] using lower-bound template while (lo < hi). For each mid, evaluate totalHours in O(n) with overflow-safe ceiling division and early exit once totalHours > h.',
          timeComplexity: 'O(n log M)',
          spaceComplexity: 'O(1)',
          keyInvariant:
            'At every iteration, the true minimum feasible speed k* is strictly contained in [lo, hi], every speed < lo is proven infeasible, and hi is always feasible.',
        },
      },
      visualizer: {
        kind: 'dp-1d-stack-heap',
        title: 'Monotonic Feasibility Binary Search Dry Run',
        inputSummary: 'piles = [3, 6, 7, 11], h = 8  →  search k ∈ [1..11]',
        steps: [
          {
            caption:
              'Establish tight search bounds: k ≥ 1 (must eat at least 1 banana/hr) and k ≤ max(piles) = 11 (since h ≥ n, eating 11/hr finishes every pile in 1 hour = 4 ≤ 8). Search range is k ∈ [1..11].',
            recurrence: 'lo = 1, hi = max(piles)  |  predicate: Σ ⌈pile / k⌉ ≤ h',
            concreteFormula: 'Search Space: k ∈ [1..11], target limit h = 8 hours',
            inputItems: { label: 'Banana Piles (h = 8 hours)', values: [3, 6, 7, 11] },
            primaryArray: {
              label: 'Candidate Speed Space k ∈ [1..11] (Hours Needed)',
              indices: ['k=1', 'k=2', 'k=3', 'k=4', 'k=5', 'k=6', 'k=7', 'k=8', 'k=9', 'k=10', 'k=11'],
              values: ['·', '·', '·', '·', '·', '·', '·', '·', '·', '·', '·'],
              pointers: [
                { label: 'lo', index: 0, tone: 'amber' },
                { label: 'hi', index: 10, tone: 'emerald' },
              ],
            },
            variables: [
              { name: 'lo', value: '1' },
              { name: 'hi', value: '11' },
              { name: 'h limit', value: '8' },
            ],
          },
          {
            caption:
              'Iter 1: mid = 1 + (11 - 1) / 2 = 6. Compute hours(6) = ⌈3/6⌉ + ⌈6/6⌉ + ⌈7/6⌉ + ⌈11/6⌉ = 1 + 1 + 2 + 2 = 6h ≤ 8h → FEASIBLE! Because 6 works, speeds 7..11 are strictly dominated; keep 6 and shrink hi = 6.',
            recurrence: 'if hours(mid) ≤ h → hi = mid (keep mid, prune right)',
            concreteFormula: 'hours(6) = 1 + 1 + 2 + 2 = 6h ≤ 8 ✓  →  hi = 6',
            inputItems: { label: 'Banana Piles (h = 8 hours)', values: [3, 6, 7, 11] },
            primaryArray: {
              label: 'Candidate Speed Space k ∈ [1..11] (Hours Needed)',
              indices: ['k=1', 'k=2', 'k=3', 'k=4', 'k=5', 'k=6', 'k=7', 'k=8', 'k=9', 'k=10', 'k=11'],
              values: ['·', '·', '·', '·', '·', '6h✓', '·', '·', '·', '·', '·'],
              activeIndex: 5,
              pointers: [
                { label: 'lo', index: 0, tone: 'amber' },
                { label: 'mid', index: 5, tone: 'primary' },
                { label: 'hi', index: 10, tone: 'emerald' },
              ],
            },
            secondaryContainer: {
              kind: 'list',
              title: 'Ceiling Hours Breakdown at k = 6',
              items: [
                { value: '⌈3/6⌉ = 1h', meta: 'pile 0' },
                { value: '⌈6/6⌉ = 1h', meta: 'pile 1' },
                { value: '⌈7/6⌉ = 2h', meta: 'pile 2' },
                { value: '⌈11/6⌉ = 2h', meta: 'pile 3' },
                { value: 'Total = 6h ≤ 8', meta: 'FEASIBLE', highlight: true },
              ],
            },
            variables: [
              { name: 'lo', value: '1' },
              { name: 'mid', value: '6', tone: 'primary' },
              { name: 'hi →', value: '6', tone: 'emerald' },
              { name: 'hours(6)', value: '6h ✓', tone: 'emerald' },
            ],
          },
          {
            caption:
              'Iter 2: range [1..6], mid = 1 + (6 - 1) / 2 = 3. Compute hours(3) = ⌈3/3⌉ + ⌈6/3⌉ + ⌈7/3⌉ + ⌈11/3⌉ = 1 + 2 + 3 + 4 = 10h > 8h → TOO SLOW! Every speed ≤ 3 is impossible; advance lo = mid + 1 = 4.',
            recurrence: 'if hours(mid) > h → lo = mid + 1 (discard left incl. mid)',
            concreteFormula: 'hours(3) = 1 + 2 + 3 + 4 = 10h > 8 ✗  →  lo = 4',
            inputItems: { label: 'Banana Piles (h = 8 hours)', values: [3, 6, 7, 11] },
            primaryArray: {
              label: 'Candidate Speed Space k ∈ [1..11] (Hours Needed)',
              indices: ['k=1', 'k=2', 'k=3', 'k=4', 'k=5', 'k=6', 'k=7', 'k=8', 'k=9', 'k=10', 'k=11'],
              values: ['·', '·', '10h✗', '·', '·', '6h✓', '·', '·', '·', '·', '·'],
              activeIndex: 2,
              dependencyIndices: [{ index: 5, label: 'hi' }],
              pointers: [
                { label: 'lo', index: 0, tone: 'amber' },
                { label: 'mid', index: 2, tone: 'rose' },
                { label: 'hi', index: 5, tone: 'emerald' },
              ],
            },
            secondaryContainer: {
              kind: 'list',
              title: 'Ceiling Hours Breakdown at k = 3',
              items: [
                { value: '⌈3/3⌉ = 1h', meta: 'pile 0' },
                { value: '⌈6/3⌉ = 2h', meta: 'pile 1' },
                { value: '⌈7/3⌉ = 3h', meta: 'pile 2' },
                { value: '⌈11/3⌉ = 4h', meta: 'pile 3' },
                { value: 'Total = 10h > 8', meta: 'INFEASIBLE' },
              ],
            },
            variables: [
              { name: 'lo →', value: '4', tone: 'amber' },
              { name: 'mid', value: '3', tone: 'rose' },
              { name: 'hi', value: '6' },
              { name: 'hours(3)', value: '10h ✗', tone: 'rose' },
            ],
          },
          {
            caption:
              'Iter 3: range [4..6], mid = 4 + (6 - 4) / 2 = 5. Compute hours(5) = ⌈3/5⌉ + ⌈6/5⌉ + ⌈7/5⌉ + ⌈11/5⌉ = 1 + 2 + 2 + 3 = 8h ≤ 8h → FEASIBLE! Tighten hi = mid = 5 to see if k = 4 still fits.',
            recurrence: 'if hours(mid) ≤ h → hi = mid',
            concreteFormula: 'hours(5) = 1 + 2 + 2 + 3 = 8h ≤ 8 ✓  →  hi = 5',
            inputItems: { label: 'Banana Piles (h = 8 hours)', values: [3, 6, 7, 11] },
            primaryArray: {
              label: 'Candidate Speed Space k ∈ [1..11] (Hours Needed)',
              indices: ['k=1', 'k=2', 'k=3', 'k=4', 'k=5', 'k=6', 'k=7', 'k=8', 'k=9', 'k=10', 'k=11'],
              values: ['·', '·', '10h✗', '·', '8h✓', '6h✓', '·', '·', '·', '·', '·'],
              activeIndex: 4,
              dependencyIndices: [
                { index: 2, label: 'fail' },
                { index: 5, label: 'ok' },
              ],
              pointers: [
                { label: 'lo', index: 3, tone: 'amber' },
                { label: 'mid', index: 4, tone: 'primary' },
                { label: 'hi', index: 5, tone: 'emerald' },
              ],
            },
            secondaryContainer: {
              kind: 'list',
              title: 'Ceiling Hours Breakdown at k = 5',
              items: [
                { value: '⌈3/5⌉ = 1h', meta: 'pile 0' },
                { value: '⌈6/5⌉ = 2h', meta: 'pile 1' },
                { value: '⌈7/5⌉ = 2h', meta: 'pile 2' },
                { value: '⌈11/5⌉ = 3h', meta: 'pile 3' },
                { value: 'Total = 8h ≤ 8', meta: 'FEASIBLE', highlight: true },
              ],
            },
            variables: [
              { name: 'lo', value: '4' },
              { name: 'mid', value: '5', tone: 'primary' },
              { name: 'hi →', value: '5', tone: 'emerald' },
              { name: 'hours(5)', value: '8h ✓', tone: 'emerald' },
            ],
          },
          {
            caption:
              'Iter 4: range [4..5], mid = 4 + (5 - 4) / 2 = 4. Compute hours(4) = ⌈3/4⌉ + ⌈6/4⌉ + ⌈7/4⌉ + ⌈11/4⌉ = 1 + 2 + 2 + 3 = 8h ≤ 8h → FEASIBLE! Set hi = mid = 4.',
            recurrence: 'if hours(mid) ≤ h → hi = mid',
            concreteFormula: 'hours(4) = 1 + 2 + 2 + 3 = 8h ≤ 8 ✓  →  hi = 4',
            inputItems: { label: 'Banana Piles (h = 8 hours)', values: [3, 6, 7, 11] },
            primaryArray: {
              label: 'Candidate Speed Space k ∈ [1..11] (Hours Needed)',
              indices: ['k=1', 'k=2', 'k=3', 'k=4', 'k=5', 'k=6', 'k=7', 'k=8', 'k=9', 'k=10', 'k=11'],
              values: ['·', '·', '10h✗', '8h✓', '8h✓', '6h✓', '·', '·', '·', '·', '·'],
              activeIndex: 3,
              dependencyIndices: [{ index: 2, label: '10h✗' }],
              pointers: [
                { label: 'lo,mid', index: 3, tone: 'primary' },
                { label: 'hi', index: 4, tone: 'emerald' },
              ],
            },
            secondaryContainer: {
              kind: 'list',
              title: 'Ceiling Hours Breakdown at k = 4',
              items: [
                { value: '⌈3/4⌉ = 1h', meta: 'pile 0' },
                { value: '⌈6/4⌉ = 2h', meta: 'pile 1' },
                { value: '⌈7/4⌉ = 2h', meta: 'pile 2' },
                { value: '⌈11/4⌉ = 3h', meta: 'pile 3' },
                { value: 'Total = 8h ≤ 8', meta: 'EXACT FIT', highlight: true },
              ],
            },
            variables: [
              { name: 'lo', value: '4' },
              { name: 'mid', value: '4', tone: 'emerald' },
              { name: 'hi →', value: '4', tone: 'emerald' },
              { name: 'hours(4)', value: '8h ✓', tone: 'emerald' },
            ],
          },
          {
            caption:
              'Converged! lo == hi == 4 exits while (lo < hi). Notice the sharp F → T transition between k = 3 (10h ✗) and k = 4 (8h ✓) discovered in only 4 probes instead of 11. Optimal eating speed = 4.',
            recurrence: 'Loop exits at lo == hi == first True in [F, F, F, T, T, ..., T]',
            concreteFormula: 'Answer = lo = 4 bananas/hour (4 probes = ⌈log₂ 11⌉)',
            inputItems: { label: 'Banana Piles (h = 8 hours)', values: [3, 6, 7, 11], processedUntil: 4 },
            primaryArray: {
              label: 'Full Monotonic Truth Table across k ∈ [1..11]',
              indices: ['k=1', 'k=2', 'k=3', 'k=4', 'k=5', 'k=6', 'k=7', 'k=8', 'k=9', 'k=10', 'k=11'],
              values: ['27h✗', '15h✗', '10h✗', '8h✓', '8h✓', '6h✓', '5h✓', '5h✓', '5h✓', '5h✓', '4h✓'],
              activeIndex: 3,
              dependencyIndices: [{ index: 2, label: 'last F' }],
              pointers: [{ label: 'lo=hi=4', index: 3, tone: 'emerald' }],
            },
            variables: [
              { name: 'probes', value: '4 / 11' },
              { name: 'minSpeed k', value: '4', tone: 'emerald' },
            ],
          },
        ],
      },
      javaSolution: {
        filename: 'KokoEatingBananas.java',
        code: `public class KokoEatingBananas {
    public int minEatingSpeed(int[] piles, int h) {
        int maxPile = 0;
        for (int pile : piles) {
            maxPile = Math.max(maxPile, pile);
        }

        int lo = 1;
        int hi = maxPile;

        // Lower-bound binary search: find smallest speed k with hours(k) <= h
        while (lo < hi) {
            int mid = lo + (hi - lo) / 2;
            if (canFinish(piles, mid, h)) {
                hi = mid;     // mid works; keep it and search slower speeds
            } else {
                lo = mid + 1; // mid is too slow; discard [lo..mid]
            }
        }

        return lo;
    }

    private boolean canFinish(int[] piles, int speed, int maxHours) {
        long hours = 0;
        for (int pile : piles) {
            // Overflow-safe integer ceiling for positive pile: 1 + (pile - 1) / speed
            hours += 1L + (pile - 1) / speed;
            if (hours > maxHours) {
                return false; // Early exit avoids unnecessary scanning
            }
        }
        return true;
    }
}`,
        callouts: [
          {
            id: 'koko-bounds',
            startLine: 8,
            endLine: 19,
            title: 'Lower-Bound Template (lo < hi, hi = mid)',
            explanation:
              'Using lo < hi with hi = mid guarantees termination without off-by-one infinite loops because mid = lo + (hi - lo) / 2 rounds DOWN (so mid < hi always holds when lo < hi).',
            accent: 'primary',
          },
          {
            id: 'koko-ceil-overflow',
            startLine: 25,
            endLine: 32,
            title: 'Overflow-Safe Ceiling & 64-Bit Accumulator',
            explanation:
              'Two classic 4.5-YOE traps: (1) (pile + speed - 1) / speed can overflow 32-bit int near Integer.MAX_VALUE, whereas 1 + (pile - 1) / speed never overflows for positive piles; (2) summing up to 10⁴ piles of 10⁹ at speed 1 reaches 10¹³, requiring a long accumulator plus early exit.',
            accent: 'amber',
          },
        ],
      },
      complexity: {
        time: 'O(n log M)',
        space: 'O(1)',
        timeExplanation:
          'M = max(piles). Binary search performs ⌈log₂ M⌉ ≤ 30 iterations (for M ≤ 10⁹), and each feasibility check scans at most n piles.',
        spaceExplanation: 'Only scalar integer/long variables are used; zero auxiliary heap allocations.',
      },
      edgeCases: [
        {
          title: 'Integer Overflow in Total Hours (piles = [10⁹, 10⁹, 10⁹], h = 10⁹)',
          scenario: 'When testing small mid speeds, summed hours easily exceeds 2.14 × 10⁹.',
          handling: 'Accumulate hours as long AND short-circuit return false the moment hours > maxHours.',
        },
        {
          title: 'Tightest Possible Deadline (h == piles.length)',
          scenario: 'Koko gets exactly 1 hour per pile — she MUST eat at speed max(piles).',
          handling: 'Every speed < maxPile returns false, driving lo steadily up to hi = maxPile.',
        },
        {
          title: 'Floating-Point Precision Trap (Math.ceil((double) pile / speed))',
          scenario: 'Casting to double introduces unnecessary floating-point conversion overhead and risks precision loss on 64-bit longs.',
          handling: 'Always prefer pure integer arithmetic: 1L + (pile - 1) / speed.',
        },
      ],
    },

    /* ================================================================
     * DSA 2: MEDIAN OF TWO SORTED ARRAYS
     * ================================================================ */
    {
      id: 'day6-median-two-sorted-arrays',
      dayNumber: 6,
      kind: 'dsa',
      title: 'Median of Two Sorted Arrays',
      subtitle: 'O(log min(m, n)) binary search over coupled left/right partition cuts',
      difficulty: 'Hard',
      patterns: ['Binary Search on Partition', 'Order Statistics', 'Sentinel ±∞ Bounds'],
      estimatedMinutes: 18,
      leetcodeRef: 'LC #4',
      problemStatement:
        'Given two sorted integer arrays A (length m) and B (length n), return the median of the combined sorted array in O(log(m + n)) time without merging the arrays.',
      exampleSummary: {
        input: 'A = [1, 3, 8, 9, 15] (m = 5), B = [7, 11, 18, 19, 21, 25] (n = 6)',
        output: '11.0',
        explanation:
          'Combined sorted sequence has 11 elements: [1, 3, 7, 8, 9, 11, 15, 18, 19, 21, 25]. Partitioning A at i = 4 ([1, 3, 8, 9] | [15]) and B at j = 2 ([7, 11] | [18, 19, 21, 25]) satisfies 9 ≤ 18 and 11 ≤ 15, yielding median = max(9, 11) = 11.0.',
      },
      patternRecognition: {
        interviewCue:
          'Whenever asked for the median or k-th smallest element across TWO sorted arrays in strictly logarithmic time, reframe "median" as a PARTITION problem: divide both arrays so Left Half has ⌈(m+n)/2⌉ elements and every Left element ≤ every Right element.',
        signals: [
          'Hard O(log(m + n)) requirement immediately rules out O(m + n) two-pointer merge',
          'Picking cut i in A uniquely determines cut j = (m + n + 1) / 2 - i in B — only ONE degree of freedom!',
          'Always binary search the SHORTER array so j stays guaranteed within [0..n] and complexity drops to O(log min(m, n))',
        ],
        mentalModel:
          'Since A and B are individually sorted, maxLeftA ≤ minRightA and maxLeftB ≤ minRightB hold automatically. We ONLY need two cross-checks: maxLeftA ≤ minRightB AND maxLeftB ≤ minRightA. If maxLeftA > minRightB, cut i is too far right (hi = i - 1); if maxLeftB > minRightA, cut i is too far left (lo = i + 1).',
      },
      intuitionComparison: {
        bruteForce: {
          approach:
            'Run the merge step of Merge Sort with two pointers until reaching index (m + n) / 2, tracking the middle one or two elements.',
          timeComplexity: 'O(m + n)',
          spaceComplexity: 'O(1) with pointer tracking / O(m + n) if materializing array',
          bottleneck:
            'Advances only 1 element per step instead of discarding half the remaining search space on every comparison.',
        },
        optimal: {
          approach:
            'Ensure m ≤ n (swap if needed). Binary search cut i ∈ [0..m], set j = (m + n + 1) / 2 - i, guard empty partition sides with Integer.MIN_VALUE / Integer.MAX_VALUE, and stop when maxLeftA ≤ minRightB && maxLeftB ≤ minRightA.',
          timeComplexity: 'O(log min(m, n))',
          spaceComplexity: 'O(1)',
          keyInvariant:
            'Left partition always contains exactly halfLeft = (m + n + 1) / 2 elements (for odd totals, the median is always the maximum of Left Half).',
        },
      },
      visualizer: {
        kind: 'array-pointers',
        title: 'O(log min(m, n)) Coupled Partition Binary Search Dry Run',
        inputSummary: 'A = [1, 3, 8, 9, 15] (m=5), B = [7, 11, 18, 19, 21, 25] (n=6)',
        steps: [
          {
            caption:
              'Verify shorter array first: m = 5 ≤ n = 6, so binary search cut i ∈ [0..5] on A! Left half needs halfLeft = (5 + 6 + 1) / 2 = 6 elements total, locking B’s cut to j = 6 - i.',
            formula: 'halfLeft = (5 + 6 + 1) / 2 = 6  |  search cut i ∈ [0..5],  j = 6 - i',
            values: [1, 3, 8, 9, 15],
            pointers: [
              { label: 'lo=0', index: 0, tone: 'amber' },
              { label: 'hi=5 (after 4)', index: 4, tone: 'primary' },
            ],
            auxStructure: {
              title: 'Partner Array B (n = 6) — Uncut',
              entries: [
                { key: 'B[0..5]', value: '[7, 11, 18, 19, 21, 25]' },
                { key: 'Total Length', value: '11 (Odd → median = max(Left))', highlight: true, tone: 'primary' },
              ],
            },
            variables: [
              { name: 'lo / hi', value: '0 / 5' },
              { name: 'halfLeft', value: '6' },
            ],
          },
          {
            caption:
              'Iter 1: mid cut i = (0 + 5) / 2 = 2 → take 2 elements from A ([1, 3] | [8, 9, 15]) and j = 6 - 2 = 4 elements from B ([7, 11, 18, 19] | [21, 25]). Read the 4 boundary elements across the cut.',
            formula: 'i = 2, j = 4  →  maxLA = A[1]=3, minRA = A[2]=8  |  maxLB = B[3]=19, minRB = B[4]=21',
            values: [1, 3, 8, 9, 15],
            windowRange: { start: 0, end: 1, tone: 'primary', label: 'A Left (i = 2 elems)' },
            cellStates: { 1: 'dependency', 2: 'active' },
            pointers: [
              { label: 'maxLA', index: 1, tone: 'amber' },
              { label: 'minRA', index: 2, tone: 'primary' },
            ],
            auxStructure: {
              title: 'Coupled Partition in B (j = 4) & Boundary Values',
              entries: [
                { key: 'B Left [0..3]', value: '[7, 11, 18, 19]', highlight: true, tone: 'amber' },
                { key: 'B Right [4..5]', value: '[21, 25]' },
                { key: 'maxLA / minRA', value: '3 / 8' },
                { key: 'maxLB / minRB', value: '19 / 21' },
              ],
            },
            variables: [
              { name: 'i (A cut)', value: '2' },
              { name: 'j (B cut)', value: '4' },
              { name: 'maxLB', value: '19' },
              { name: 'minRA', value: '8' },
            ],
          },
          {
            caption:
              'Evaluate cross-inequalities at i = 2: maxLA (3) ≤ minRB (21) ✓, BUT maxLB (19) ≤ minRA (8) FAILS (19 > 8)! Too many large elements sit in B Left because we took too few from A. Eliminate i ∈ [0..2] → set lo = i + 1 = 3.',
            formula: 'maxLB (19) > minRA (8) ✗  →  cut i too small  →  lo = i + 1 = 3',
            values: [1, 3, 8, 9, 15],
            windowRange: { start: 0, end: 1, tone: 'rose', label: 'Cut i=2 Too Far Left' },
            cellStates: { 0: 'excluded', 1: 'excluded', 2: 'active' },
            pointers: [
              { label: '19 > 8 ✗', index: 2, tone: 'rose' },
              { label: 'next lo=3', index: 3, tone: 'amber' },
            ],
            auxStructure: {
              title: 'Cross-Partition Check at i = 2, j = 4',
              entries: [
                { key: 'maxLA ≤ minRB', value: '3 ≤ 21 ✓', tone: 'emerald', highlight: true },
                { key: 'maxLB ≤ minRA', value: '19 ≤ 8 ✗ (FAIL!)', tone: 'rose', highlight: true },
                { key: 'Action', value: 'Move A cut right: lo = 3, hi = 5', tone: 'amber', highlight: true },
              ],
            },
            variables: [
              { name: 'lo →', value: '3', tone: 'amber' },
              { name: 'hi', value: '5' },
              { name: 'status', value: 'shift right', tone: 'rose' },
            ],
          },
          {
            caption:
              'Iter 2: range [3..5] → mid cut i = (3 + 5) / 2 = 4! Take 4 elements from A ([1, 3, 8, 9] | [15]) and j = 6 - 4 = 2 elements from B ([7, 11] | [18, 19, 21, 25]). Inspect all 4 boundaries.',
            formula: 'i = 4, j = 2  →  maxLA = A[3]=9, minRA = A[4]=15  |  maxLB = B[1]=11, minRB = B[2]=18',
            values: [1, 3, 8, 9, 15],
            windowRange: { start: 0, end: 3, tone: 'primary', label: 'A Left (i = 4 elems)' },
            cellStates: { 3: 'dependency', 4: 'active' },
            pointers: [
              { label: 'maxLA=9', index: 3, tone: 'amber' },
              { label: 'minRA=15', index: 4, tone: 'primary' },
            ],
            auxStructure: {
              title: 'Coupled Partition in B (j = 2) & Boundary Values',
              entries: [
                { key: 'B Left [0..1]', value: '[7, 11]', highlight: true, tone: 'emerald' },
                { key: 'B Right [2..5]', value: '[18, 19, 21, 25]' },
                { key: 'maxLA / minRA', value: '9 / 15' },
                { key: 'maxLB / minRB', value: '11 / 18' },
              ],
            },
            variables: [
              { name: 'i (A cut)', value: '4', tone: 'primary' },
              { name: 'j (B cut)', value: '2', tone: 'primary' },
              { name: 'Left Size', value: '4 + 2 = 6' },
            ],
          },
          {
            caption:
              'PERFECT PARTITION! Both cross-checks pass: maxLA (9) ≤ minRB (18) ✓ AND maxLB (11) ≤ minRA (15) ✓. Every element in Left {1,3,7,8,9,11} ≤ every element in Right {15,18,19,21,25}. Since m + n = 11 is ODD, median = max(9, 11) = 11.0!',
            formula: '9 ≤ 18 ✓  AND  11 ≤ 15 ✓  →  odd total ⇒ median = max(9, 11) = 11.0',
            values: [1, 3, 8, 9, 15],
            windowRange: { start: 0, end: 3, tone: 'emerald', label: 'Optimal Valid Partition (i = 4)' },
            cellStates: { 0: 'match', 1: 'match', 2: 'match', 3: 'best', 4: 'match' },
            pointers: [
              { label: 'maxLA=9', index: 3, tone: 'emerald' },
              { label: 'minRA=15', index: 4, tone: 'emerald' },
            ],
            auxStructure: {
              title: 'Verified Partition & Final Median',
              entries: [
                { key: 'maxLA ≤ minRB', value: '9 ≤ 18 ✓', highlight: true, tone: 'emerald' },
                { key: 'maxLB ≤ minRA', value: '11 ≤ 15 ✓', highlight: true, tone: 'emerald' },
                { key: 'Left Half (6)', value: '{1, 3, 8, 9} ∪ {7, 11}' },
                { key: 'Right Half (5)', value: '{15} ∪ {18, 19, 21, 25}' },
              ],
            },
            variables: [
              { name: 'max(Left)', value: 'max(9, 11) = 11', tone: 'emerald' },
              { name: 'median', value: '11.0', tone: 'emerald' },
            ],
          },
        ],
      },
      javaSolution: {
        filename: 'MedianTwoSortedArrays.java',
        code: `public class MedianTwoSortedArrays {
    public double findMedianSortedArrays(int[] A, int[] B) {
        // Always binary search the shorter array to guarantee j stays in [0..n]
        if (A.length > B.length) {
            return findMedianSortedArrays(B, A);
        }

        int m = A.length;
        int n = B.length;
        int halfLeft = (m + n + 1) / 2;

        int lo = 0;
        int hi = m;

        while (lo <= hi) {
            int i = lo + (hi - lo) / 2; // Elements taken from A into Left Half
            int j = halfLeft - i;       // Remaining elements taken from B into Left Half

            int maxLeftA  = (i == 0) ? Integer.MIN_VALUE : A[i - 1];
            int minRightA = (i == m) ? Integer.MAX_VALUE : A[i];
            int maxLeftB  = (j == 0) ? Integer.MIN_VALUE : B[j - 1];
            int minRightB = (j == n) ? Integer.MAX_VALUE : B[j];

            if (maxLeftA <= minRightB && maxLeftB <= minRightA) {
                if (((m + n) & 1) == 1) {
                    return Math.max(maxLeftA, maxLeftB);
                }
                return (Math.max(maxLeftA, maxLeftB) + Math.min(minRightA, minRightB)) / 2.0;
            } else if (maxLeftA > minRightB) {
                hi = i - 1; // Took too many from A -> shift cut left
            } else {
                lo = i + 1; // Took too few from A -> shift cut right
            }
        }

        throw new IllegalArgumentException("Input arrays must be sorted");
    }
}`,
        callouts: [
          {
            id: 'med-swap',
            startLine: 3,
            endLine: 6,
            title: 'Why Searching the Shorter Array Is Mandatory (Not Just Faster)',
            explanation:
              'If m > n, setting i = 0 yields j = (m + n + 1) / 2 > n, throwing ArrayIndexOutOfBoundsException! Swapping ensures m ≤ n so j = halfLeft - i ALWAYS falls safely inside [0..n] AND improves runtime to O(log min(m, n)).',
            accent: 'amber',
          },
          {
            id: 'med-sentinels',
            startLine: 19,
            endLine: 22,
            title: '±∞ Sentinels Eliminate All Empty-Side Edge Branches',
            explanation:
              'When cut i == 0 (no elements from A on the left) or i == m (no elements from A on the right), Integer.MIN_VALUE / Integer.MAX_VALUE let the exact same cross-inequality work cleanly without nested if/else guards.',
            accent: 'primary',
          },
          {
            id: 'med-parity',
            startLine: 24,
            endLine: 28,
            title: 'Even vs. Odd Parity with (m + n + 1) / 2',
            explanation:
              'Using halfLeft = (m + n + 1) / 2 places the extra middle element on the LEFT for odd lengths (so median = max(maxLeftA, maxLeftB)). For even lengths, divide by 2.0 (double) — or use ((long) maxLeft + minRight) / 2.0 if inputs approach Integer.MAX_VALUE!',
            accent: 'emerald',
          },
        ],
      },
      complexity: {
        time: 'O(log min(m, n))',
        space: 'O(1)',
        timeExplanation:
          'Binary search halves the cut range [0..min(m, n)] on every iteration, doing constant work per step.',
        spaceExplanation: 'Only scalar integer pointers and boundary values are stored.',
      },
      edgeCases: [
        {
          title: 'One Empty Array (A = [], B = [2, 3])',
          scenario: 'm = 0, n = 2 → halfLeft = 1, lo = hi = 0, i = 0, j = 1.',
          handling: 'maxLeftA = -∞, minRightA = +∞, maxLeftB = 2, minRightB = 3 → both checks pass immediately, returning (2 + 3) / 2.0 = 2.5.',
        },
        {
          title: 'Completely Non-Overlapping Arrays (A = [1, 2], B = [10, 20, 30])',
          scenario: 'All elements of A belong to the left partition (i = m = 2).',
          handling: 'minRightA becomes Integer.MAX_VALUE so maxLeftB ≤ +∞ passes cleanly without out-of-bounds access.',
        },
        {
          title: 'Integer Overflow on Even Median Sum & Duplicate Values',
          scenario: 'If maxLeft and minRight are both near 2 × 10⁹, (maxLeft + minRight) overflows int before dividing by 2.0.',
          handling: 'Cast ((double) Math.max(maxLeftA, maxLeftB) + Math.min(minRightA, minRightB)) / 2.0. Duplicate values work seamlessly because cross-checks use ≤ (non-strict).',
        },
      ],
    },

    /* ================================================================
     * DSA 3: SPLIT ARRAY LARGEST SUM
     * ================================================================ */
    {
      id: 'day6-split-array-largest-sum',
      dayNumber: 6,
      kind: 'dsa',
      title: 'Split Array Largest Sum',
      subtitle: 'Min-Max binary search on subarray sum cap with greedy linear partitioning',
      difficulty: 'Hard',
      patterns: ['Binary Search on Answer', 'Min-Max Optimization', 'Greedy Feasibility'],
      estimatedMinutes: 16,
      leetcodeRef: 'LC #410',
      problemStatement:
        'Given an integer array nums of non-negative integers and an integer k, split nums into k non-empty contiguous subarrays such that the largest sum among these k subarrays is minimized. Return that minimized largest sum.',
      exampleSummary: {
        input: 'nums = [7, 2, 5, 10, 8], k = 2',
        output: '18',
        explanation:
          'Splitting into [7, 2, 5] (sum 14) and [10, 8] (sum 18) gives a maximum subarray sum of 18. No 2-way contiguous split can keep both halves ≤ 17.',
      },
      patternRecognition: {
        interviewCue:
          'Spot the canonical "Minimize the Maximum" phrasing! Whenever you partition an array into k contiguous blocks (Book Allocation, Ship Packages Within D Days, Painter’s Partition) to minimize the heaviest block, binary search the block capacity cap ∈ [max(nums), sum(nums)] and verify greedily.',
        signals: [
          'Keywords: "split into k contiguous subarrays", "minimize the largest sum"',
          'All elements non-negative → adding elements to a bucket monotonically increases sum, making greedy packing optimal',
          'Exact same template as LC #1011 (Capacity to Ship Packages) and Painter’s Partition — O(n log S) beats O(n²·k) DP decisively!',
        ],
        mentalModel:
          'Given a candidate max-sum ceiling cap, pack elements left-to-right into the current bucket until adding the next element would exceed cap, then open a new bucket. If total buckets needed ≤ k, cap is FEASIBLE (note: having fewer than k buckets is still valid because you can always split non-empty buckets further without raising the max sum!).',
      },
      intuitionComparison: {
        bruteForce: {
          approach:
            '2D DP: dp[i][p] = min largest sum splitting prefix nums[0..i-1] into p subarrays, checking every prior cut point j < i.',
          timeComplexity: 'O(n² × k)',
          spaceComplexity: 'O(n × k)',
          bottleneck:
            'Quadratic over array length n; when n = 10⁵ and k = 500, DP times out and blows memory.',
        },
        optimal: {
          approach:
            'Binary search cap ∈ [max(nums), sum(nums)]. For each mid, count minimum contiguous buckets needed so every bucket sum ≤ mid via one O(n) greedy pass.',
          timeComplexity: 'O(n log S) where S = sum(nums) - max(nums)',
          spaceComplexity: 'O(1)',
          keyInvariant:
            'Packing each bucket as full as possible without exceeding cap strictly minimizes total buckets required (greedy exchange argument).',
        },
      },
      visualizer: {
        kind: 'dp-1d-stack-heap',
        title: 'Min-Max Capacity Binary Search + Greedy Bucketing Dry Run',
        inputSummary: 'nums = [7, 2, 5, 10, 8], k = 2  →  search cap ∈ [10..32]',
        steps: [
          {
            caption:
              'Derive exact bounds: lo = max(nums) = 10 (no bucket can hold element 10 if cap < 10) and hi = sum(nums) = 32 (all elements in 1 bucket). Search key candidate caps across [10..32].',
            recurrence: 'lo = max(nums) = 10,  hi = sum(nums) = 32  |  canSplit(cap) ⇔ buckets(cap) ≤ k',
            concreteFormula: 'Search Space: cap ∈ [10..32], target max splits k = 2',
            inputItems: { label: 'Input Array nums[] (k = 2 splits)', values: [7, 2, 5, 10, 8] },
            primaryArray: {
              label: 'Candidate Max-Sum Search Space cap ∈ [10..32] (Key Ticks)',
              indices: ['10', '12', '15', '16', '17', '18', '21', '26', '32'],
              values: ['·', '·', '·', '·', '·', '·', '·', '·', '·'],
              pointers: [
                { label: 'lo=10', index: 0, tone: 'amber' },
                { label: 'hi=32', index: 8, tone: 'emerald' },
              ],
            },
            variables: [
              { name: 'lo', value: '10' },
              { name: 'hi', value: '32' },
              { name: 'k', value: '2' },
            ],
          },
          {
            caption:
              'Iter 1: mid = 10 + (32 - 10) / 2 = 21. Greedy pack: [7, 2, 5] sums to 14 (+10 = 24 > 21 → cut!), [10, 8] sums to 18 ≤ 21. Needs 2 buckets ≤ k (2) → FEASIBLE! Shrink hi = 21.',
            recurrence: 'if buckets(mid) ≤ k → hi = mid',
            concreteFormula: 'cap = 21 → [7,2,5](14) | [10,8](18) → 2 buckets ≤ 2 ✓ → hi = 21',
            inputItems: { label: 'Input Array nums[] (k = 2 splits)', values: [7, 2, 5, 10, 8] },
            primaryArray: {
              label: 'Candidate Max-Sum Search Space cap ∈ [10..32] (Key Ticks)',
              indices: ['10', '12', '15', '16', '17', '18', '21', '26', '32'],
              values: ['·', '·', '·', '·', '·', '·', '2b✓', '·', '·'],
              activeIndex: 6,
              pointers: [
                { label: 'lo', index: 0, tone: 'amber' },
                { label: 'mid=21', index: 6, tone: 'primary' },
                { label: 'hi', index: 8, tone: 'emerald' },
              ],
            },
            secondaryContainer: {
              kind: 'list',
              title: 'Greedy Subarray Partition at cap = 21',
              items: [
                { value: '[7, 2, 5]', meta: 'sum = 14 ≤ 21' },
                { value: '[10, 8]', meta: 'sum = 18 ≤ 21' },
                { value: '2 buckets ≤ k=2', meta: 'FEASIBLE ✓', highlight: true },
              ],
            },
            variables: [
              { name: 'lo', value: '10' },
              { name: 'mid', value: '21', tone: 'primary' },
              { name: 'hi →', value: '21', tone: 'emerald' },
              { name: 'buckets', value: '2 ≤ 2 ✓', tone: 'emerald' },
            ],
          },
          {
            caption:
              'Iter 2: range [10..21] → mid = 10 + (21 - 10) / 2 = 15. Greedy pack: [7, 2, 5] = 14 (cut!), [10] = 10 (+8 = 18 > 15 → cut!), [8] = 8. Needs 3 buckets > 2 → INFEASIBLE! Raise lo = 15 + 1 = 16.',
            recurrence: 'if buckets(mid) > k → lo = mid + 1',
            concreteFormula: 'cap = 15 → [7,2,5] | [10] | [8] → 3 buckets > 2 ✗ → lo = 16',
            inputItems: { label: 'Input Array nums[] (k = 2 splits)', values: [7, 2, 5, 10, 8] },
            primaryArray: {
              label: 'Candidate Max-Sum Search Space cap ∈ [10..32] (Key Ticks)',
              indices: ['10', '12', '15', '16', '17', '18', '21', '26', '32'],
              values: ['·', '·', '3b✗', '·', '·', '·', '2b✓', '·', '·'],
              activeIndex: 2,
              dependencyIndices: [{ index: 6, label: 'hi' }],
              pointers: [
                { label: 'lo', index: 0, tone: 'amber' },
                { label: 'mid=15', index: 2, tone: 'rose' },
                { label: 'hi', index: 6, tone: 'emerald' },
              ],
            },
            secondaryContainer: {
              kind: 'list',
              title: 'Greedy Subarray Partition at cap = 15',
              items: [
                { value: '[7, 2, 5]', meta: 'sum = 14' },
                { value: '[10]', meta: '10+8=18 > 15!' },
                { value: '[8]', meta: 'sum = 8' },
                { value: '3 buckets > k=2', meta: 'TOO TIGHT ✗' },
              ],
            },
            variables: [
              { name: 'lo →', value: '16', tone: 'amber' },
              { name: 'mid', value: '15', tone: 'rose' },
              { name: 'hi', value: '21' },
              { name: 'buckets', value: '3 > 2 ✗', tone: 'rose' },
            ],
          },
          {
            caption:
              'Iter 3: range [16..21] → mid = 16 + (21 - 16) / 2 = 18. Greedy pack: [7, 2, 5] = 14 (cut!), [10, 8] = 18 ≤ 18. Needs 2 buckets ≤ 2 → FEASIBLE! Tighten hi = 18.',
            recurrence: 'if buckets(mid) ≤ k → hi = mid',
            concreteFormula: 'cap = 18 → [7,2,5](14) | [10,8](18) → 2 buckets ≤ 2 ✓ → hi = 18',
            inputItems: { label: 'Input Array nums[] (k = 2 splits)', values: [7, 2, 5, 10, 8] },
            primaryArray: {
              label: 'Candidate Max-Sum Search Space cap ∈ [10..32] (Key Ticks)',
              indices: ['10', '12', '15', '16', '17', '18', '21', '26', '32'],
              values: ['·', '·', '3b✗', '·', '·', '2b✓', '2b✓', '·', '·'],
              activeIndex: 5,
              dependencyIndices: [{ index: 2, label: '3b✗' }],
              pointers: [
                { label: 'lo=16', index: 3, tone: 'amber' },
                { label: 'mid=18', index: 5, tone: 'primary' },
                { label: 'hi=21', index: 6, tone: 'emerald' },
              ],
            },
            secondaryContainer: {
              kind: 'list',
              title: 'Greedy Subarray Partition at cap = 18',
              items: [
                { value: '[7, 2, 5]', meta: 'sum = 14 ≤ 18' },
                { value: '[10, 8]', meta: 'sum = 18 ≤ 18' },
                { value: '2 buckets ≤ k=2', meta: 'FEASIBLE ✓', highlight: true },
              ],
            },
            variables: [
              { name: 'lo', value: '16' },
              { name: 'mid', value: '18', tone: 'primary' },
              { name: 'hi →', value: '18', tone: 'emerald' },
              { name: 'buckets', value: '2 ≤ 2 ✓', tone: 'emerald' },
            ],
          },
          {
            caption:
              'Iter 4: range [16..18] → mid = 16 + (18 - 16) / 2 = 17. Greedy pack: [7, 2, 5] = 14, [10] = 10 (+8 = 18 > 17 → cut!), [8] = 8 → 3 buckets > 2 (INFEASIBLE!). Advance lo = 17 + 1 = 18.',
            recurrence: 'if buckets(mid) > k → lo = mid + 1',
            concreteFormula: 'cap = 17 → [7,2,5] | [10] | [8] → 3 buckets > 2 ✗ → lo = 18',
            inputItems: { label: 'Input Array nums[] (k = 2 splits)', values: [7, 2, 5, 10, 8] },
            primaryArray: {
              label: 'Candidate Max-Sum Search Space cap ∈ [10..32] (Key Ticks)',
              indices: ['10', '12', '15', '16', '17', '18', '21', '26', '32'],
              values: ['·', '·', '3b✗', '·', '3b✗', '2b✓', '2b✓', '·', '·'],
              activeIndex: 4,
              dependencyIndices: [{ index: 5, label: '2b✓' }],
              pointers: [
                { label: 'lo=16', index: 3, tone: 'amber' },
                { label: 'mid=17', index: 4, tone: 'rose' },
                { label: 'hi=18', index: 5, tone: 'emerald' },
              ],
            },
            secondaryContainer: {
              kind: 'list',
              title: 'Greedy Subarray Partition at cap = 17',
              items: [
                { value: '[7, 2, 5]', meta: 'sum = 14' },
                { value: '[10]', meta: '10+8=18 > 17!' },
                { value: '[8]', meta: 'sum = 8' },
                { value: '3 buckets > k=2', meta: 'INFEASIBLE ✗' },
              ],
            },
            variables: [
              { name: 'lo →', value: '18', tone: 'emerald' },
              { name: 'mid', value: '17', tone: 'rose' },
              { name: 'hi', value: '18', tone: 'emerald' },
              { name: 'buckets', value: '3 > 2 ✗', tone: 'rose' },
            ],
          },
          {
            caption:
              'Converged! lo == hi == 18 exits loop. Notice cap = 18 is GUARANTEED to be achieved as an actual subarray sum ([10, 8] = 18) — because if every subarray summed ≤ 17, cap = 17 would have been feasible!',
            recurrence: 'Optimal Min-Max Sum = lo == hi == 18 (realizable by [7,2,5] & [10,8])',
            concreteFormula: 'Answer = 18  (max(14, 18) = 18 in 4 binary-search probes)',
            inputItems: { label: 'Input Array nums[] (k = 2 splits)', values: [7, 2, 5, 10, 8], processedUntil: 5 },
            primaryArray: {
              label: 'Monotonic Feasibility Profile across cap ∈ [10..32]',
              indices: ['10', '12', '15', '16', '17', '18', '21', '26', '32'],
              values: ['4b✗', '4b✗', '3b✗', '3b✗', '3b✗', '2b✓', '2b✓', '2b✓', '1b✓'],
              activeIndex: 5,
              dependencyIndices: [{ index: 4, label: 'last ✗' }],
              pointers: [{ label: 'lo=hi=18', index: 5, tone: 'emerald' }],
            },
            secondaryContainer: {
              kind: 'list',
              title: 'Optimal 2-Way Partition',
              items: [
                { value: 'Subarray 1: [7, 2, 5]', meta: 'sum = 14' },
                { value: 'Subarray 2: [10, 8]', meta: 'sum = 18 (peak)', highlight: true },
              ],
            },
            variables: [
              { name: 'minLargestSum', value: '18', tone: 'emerald' },
              { name: 'probes', value: '4' },
            ],
          },
        ],
      },
      javaSolution: {
        filename: 'SplitArrayLargestSum.java',
        code: `public class SplitArrayLargestSum {
    public int splitArray(int[] nums, int k) {
        long lo = 0;
        long hi = 0;
        for (int num : nums) {
            lo = Math.max(lo, num); // Lower bound: single largest element
            hi += num;              // Upper bound: entire array in 1 subarray
        }

        while (lo < hi) {
            long mid = lo + (hi - lo) / 2;
            if (canSplit(nums, k, mid)) {
                hi = mid;     // mid cap is achievable -> try tighter cap
            } else {
                lo = mid + 1; // mid cap forces > k subarrays -> raise cap
            }
        }

        return (int) lo;
    }

    private boolean canSplit(int[] nums, int maxSplits, long maxSumCap) {
        int splitsUsed = 1;
        long currentSum = 0;

        for (int num : nums) {
            if (currentSum + num > maxSumCap) {
                splitsUsed++;
                currentSum = num;
                if (splitsUsed > maxSplits) {
                    return false; // Early exit once budget k is exceeded
                }
            } else {
                currentSum += num;
            }
        }

        return true;
    }
}`,
        callouts: [
          {
            id: 'sals-bounds',
            startLine: 3,
            endLine: 8,
            title: '64-Bit Bounds Prevent Sum Overflow',
            explanation:
              'Even though each nums[i] fits in 32-bit int, summing up to 1,000+ large elements easily overflows int. Using long for lo, hi, mid, and currentSum makes overflow impossible.',
            accent: 'amber',
          },
          {
            id: 'sals-realizable',
            startLine: 10,
            endLine: 19,
            title: 'Senior Proof: Why lo Is Guaranteed to Be a Real Subarray Sum',
            explanation:
              'Interviewers often ask: "How do you know the returned mid actually equals the sum of some subarray rather than an unachievable integer?" Proof by contradiction: if every subarray in the greedy split at lo had sum ≤ lo - 1, then canSplit(lo - 1) would have returned true and hi would have shrunk below lo!',
            accent: 'emerald',
          },
          {
            id: 'sals-fewer-buckets',
            startLine: 22,
            endLine: 38,
            title: 'Why splitsUsed < maxSplits Is Still Valid',
            explanation:
              'If greedy packing needs only 2 buckets when k = 4 (and n ≥ 4), we can arbitrarily split any multi-element bucket into smaller non-empty subarrays — which only LOWERS or preserves the max sum while reaching exactly k subarrays.',
            accent: 'primary',
          },
        ],
      },
      complexity: {
        time: 'O(n log S)',
        space: 'O(1)',
        timeExplanation:
          'S = sum(nums) - max(nums). Binary search performs O(log S) iterations, each calling one O(n) linear greedy feasibility pass.',
        spaceExplanation: 'Constant scalar state — completely avoids the O(n × k) DP table.',
      },
      edgeCases: [
        {
          title: 'Zero Elements in Array (nums = [0, 0, 0], k = 2)',
          scenario: 'lo = 0, hi = 0.',
          handling: 'while (lo < hi) terminates immediately and cleanly returns 0.',
        },
        {
          title: 'What If nums Contains Negative Numbers? (Interviewer Trap)',
          scenario: 'Suppose the interviewer asks: "Does your binary search still work if nums can be negative?"',
          handling:
            'NO! Negative numbers break the greedy packing invariant (adding a negative number later could pull an overflowing bucket back under cap). With negatives, you MUST fall back to O(n² · k) DP!',
        },
        {
          title: 'Extreme k Values (k == 1 or k == nums.length)',
          scenario: 'k = 1 returns sum(nums); k = n returns max(nums).',
          handling: 'Both endpoints sit directly at hi and lo, handled cleanly in O(log S) steps.',
        },
      ],
    },

    /* ================================================================
     * DSA 4: MERGE INTERVALS
     * ================================================================ */
    {
      id: 'day6-merge-intervals',
      dayNumber: 6,
      kind: 'dsa',
      title: 'Merge Intervals',
      subtitle: 'Sort-by-start linear sweep coalescing overlapping and nested intervals',
      difficulty: 'Medium',
      patterns: ['Interval Sweep', 'Sort by Start', 'Active Interval Extension'],
      estimatedMinutes: 12,
      leetcodeRef: 'LC #56',
      problemStatement:
        'Given an array of intervals where intervals[i] = [start_i, end_i], merge all overlapping intervals (including intervals that touch at endpoints) and return an array of the non-overlapping intervals covering the exact same ranges.',
      exampleSummary: {
        input: 'intervals = [[8, 10], [1, 3], [15, 18], [2, 6], [9, 12]]',
        output: '[[1, 6], [8, 12], [15, 18]]',
        explanation:
          'After sorting by start: [[1,3], [2,6], [8,10], [9,12], [15,18]]. [1,3] & [2,6] merge into [1,6]; [8,10] & [9,12] merge into [8,12]; [15,18] stays disjoint.',
      },
      patternRecognition: {
        interviewCue:
          'Whenever you receive unsorted [start, end] ranges and need to coalesce, count gaps, or insert ranges, ALWAYS sort by start time ascending first. Sorting collapses a quadratic all-pairs overlap problem into a single adjacent comparison: curr.start ≤ lastMerged.end.',
        signals: [
          'Unsorted closed/half-open time or numeric ranges [start, end]',
          'Transitive merging: once sorted by start, any interval overlapping an earlier merged block MUST overlap the MOST RECENTLY merged block',
          'Nested interval trap: [1, 10] followed by [2, 5] requires max(last.end, curr.end), NOT blind overwrite',
        ],
        mentalModel:
          'Sort by start ascending. Keep a list of finalized merged intervals; only the LAST interval in the output can ever overlap the next incoming interval curr. If curr[0] ≤ last[1], stretch last[1] = max(last[1], curr[1]); else commit a brand-new disjoint interval.',
      },
      intuitionComparison: {
        bruteForce: {
          approach:
            'Build an overlap graph connecting every pair (i, j) whose intervals intersect, then find connected components via DFS/Union-Find and take [minStart, maxEnd] per component.',
          timeComplexity: 'O(n²)',
          spaceComplexity: 'O(n²)',
          bottleneck:
            'Checking pairwise overlap across all n(n - 1)/2 pairs ignores the 1D total order of the number line.',
        },
        optimal: {
          approach:
            'Sort intervals by start ascending in O(n log n), then perform one O(n) pass comparing curr[0] against last[1] of the output list.',
          timeComplexity: 'O(n log n)',
          spaceComplexity: 'O(n) for output (or O(log n) auxiliary sort stack)',
          keyInvariant:
            'Every interval in merged[0 .. size-2] finishes strictly before merged[size-1][0] ≤ curr[0], so earlier intervals can NEVER be touched again.',
        },
      },
      visualizer: {
        kind: 'dp-1d-stack-heap',
        title: 'Sort-by-Start Linear Interval Merge Dry Run',
        inputSummary: 'Sorted: [[1,3], [2,6], [8,10], [9,12], [15,18]]',
        steps: [
          {
            caption:
              'After sorting by start ascending, seed the merged output list with the first interval [1, 3]. All subsequent intervals have start ≥ 1.',
            recurrence: 'Sort by start ASC → seed merged = [ intervals[0] ]',
            concreteFormula: 'Seed: last = [1, 3]',
            inputItems: {
              label: 'Sorted Input Intervals',
              values: ['[1,3]', '[2,6]', '[8,10]', '[9,12]', '[15,18]'],
              activeIndex: 0,
            },
            primaryArray: {
              label: 'Merged Output List',
              indices: ['out 0'],
              values: ['[1, 3]'],
              activeIndex: 0,
              pointers: [{ label: 'last', index: 0, tone: 'primary' }],
            },
            variables: [
              { name: 'curr', value: '[1, 3]' },
              { name: 'merged.size', value: '1' },
            ],
          },
          {
            caption:
              'Process [2, 6]: check overlap curr[0] ≤ last[1] → 2 ≤ 3 is TRUE! Extend last[1] = max(3, 6) = 6 in place. Merged list becomes [[1, 6]].',
            recurrence: 'if curr[0] ≤ last[1] → last[1] = max(last[1], curr[1])',
            concreteFormula: '2 ≤ 3 (Overlap!) → last[1] = max(3, 6) = 6 → [1, 6]',
            inputItems: {
              label: 'Sorted Input Intervals',
              values: ['[1,3]', '[2,6]', '[8,10]', '[9,12]', '[15,18]'],
              activeIndex: 1,
              processedUntil: 1,
            },
            primaryArray: {
              label: 'Merged Output List',
              indices: ['out 0'],
              values: ['[1, 6]'],
              activeIndex: 0,
              pointers: [{ label: 'merged', index: 0, tone: 'amber' }],
            },
            variables: [
              { name: 'curr', value: '[2, 6]' },
              { name: 'check 2 ≤ 3', value: 'TRUE (Merge)', tone: 'amber' },
              { name: 'merged.size', value: '1' },
            ],
          },
          {
            caption:
              'Process [8, 10]: check overlap curr[0] ≤ last[1] → 8 ≤ 6 is FALSE (Disjoint!). [1, 6] is now permanently finalized; append [8, 10] as out 1.',
            recurrence: 'if curr[0] > last[1] → append curr as new disjoint interval',
            concreteFormula: '8 > 6 (Disjoint!) → append [8, 10]',
            inputItems: {
              label: 'Sorted Input Intervals',
              values: ['[1,3]', '[2,6]', '[8,10]', '[9,12]', '[15,18]'],
              activeIndex: 2,
              processedUntil: 2,
            },
            primaryArray: {
              label: 'Merged Output List',
              indices: ['out 0', 'out 1'],
              values: ['[1, 6]', '[8, 10]'],
              activeIndex: 1,
              dependencyIndices: [{ index: 0, label: '6 < 8' }],
              pointers: [{ label: 'append', index: 1, tone: 'emerald' }],
            },
            variables: [
              { name: 'curr', value: '[8, 10]' },
              { name: 'check 8 ≤ 6', value: 'FALSE (Append)', tone: 'emerald' },
              { name: 'merged.size', value: '2' },
            ],
          },
          {
            caption:
              'Process [9, 12]: check overlap curr[0] ≤ last[1] → 9 ≤ 10 is TRUE! Stretch out 1 end to max(10, 12) = 12 → [8, 12].',
            recurrence: 'if curr[0] ≤ last[1] → last[1] = max(last[1], curr[1])',
            concreteFormula: '9 ≤ 10 (Overlap!) → last[1] = max(10, 12) = 12 → [8, 12]',
            inputItems: {
              label: 'Sorted Input Intervals',
              values: ['[1,3]', '[2,6]', '[8,10]', '[9,12]', '[15,18]'],
              activeIndex: 3,
              processedUntil: 3,
            },
            primaryArray: {
              label: 'Merged Output List',
              indices: ['out 0', 'out 1'],
              values: ['[1, 6]', '[8, 12]'],
              activeIndex: 1,
              pointers: [{ label: 'merged', index: 1, tone: 'amber' }],
            },
            variables: [
              { name: 'curr', value: '[9, 12]' },
              { name: 'check 9 ≤ 10', value: 'TRUE (Merge)', tone: 'amber' },
              { name: 'merged.size', value: '2' },
            ],
          },
          {
            caption:
              'Process [15, 18]: check overlap curr[0] ≤ last[1] → 15 ≤ 12 is FALSE (Disjoint!). Append [15, 18] as out 2. All 5 input intervals processed!',
            recurrence: 'if curr[0] > last[1] → append curr',
            concreteFormula: '15 > 12 (Disjoint!) → append [15, 18] → Done!',
            inputItems: {
              label: 'Sorted Input Intervals',
              values: ['[1,3]', '[2,6]', '[8,10]', '[9,12]', '[15,18]'],
              activeIndex: 4,
              processedUntil: 4,
            },
            primaryArray: {
              label: 'Final Merged Disjoint Intervals',
              indices: ['out 0', 'out 1', 'out 2'],
              values: ['[1, 6]', '[8, 12]', '[15, 18]'],
              activeIndex: 2,
              dependencyIndices: [{ index: 1, label: '12 < 15' }],
              pointers: [{ label: 'append', index: 2, tone: 'emerald' }],
            },
            variables: [
              { name: 'curr', value: '[15, 18]' },
              { name: 'check 15 ≤ 12', value: 'FALSE (Append)', tone: 'emerald' },
              { name: 'finalCount', value: '3 intervals', tone: 'emerald' },
            ],
          },
        ],
      },
      javaSolution: {
        filename: 'MergeIntervals.java',
        code: `import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

public class MergeIntervals {
    public int[][] merge(int[][] intervals) {
        if (intervals == null || intervals.length <= 1) {
            return intervals == null ? new int[0][] : intervals;
        }

        // Use Integer.compare (never a[0] - b[0]) to prevent subtraction overflow
        Arrays.sort(intervals, (a, b) -> Integer.compare(a[0], b[0]));

        List<int[]> merged = new ArrayList<>();
        int[] current = new int[] { intervals[0][0], intervals[0][1] };
        merged.add(current);

        for (int i = 1; i < intervals.length; i++) {
            int[] next = intervals[i];
            if (next[0] <= current[1]) {
                // Math.max handles nested intervals like [1, 10] followed by [2, 5]
                current[1] = Math.max(current[1], next[1]);
            } else {
                current = new int[] { next[0], next[1] };
                merged.add(current);
            }
        }

        return merged.toArray(new int[merged.size()][]);
    }
}`,
        callouts: [
          {
            id: 'mi-sort',
            startLine: 11,
            endLine: 12,
            title: 'Overflow-Safe Comparator & Defensive Copy',
            explanation:
              'Integer.compare(a[0], b[0]) avoids signed-integer overflow when negative timestamps appear. Notice we also allocate fresh int[] pairs for merged instead of mutating the caller’s input subarrays in-place.',
            accent: 'primary',
          },
          {
            id: 'mi-touch',
            startLine: 20,
            endLine: 20,
            title: 'Closed vs. Half-Open Endpoint Clarification',
            explanation:
              'Always clarify in the interview whether touching endpoints [1, 4] and [4, 5] count as overlapping (use <= for closed intervals; use < for half-open [start, end) bookings).',
            accent: 'emerald',
          },
          {
            id: 'mi-nested',
            startLine: 21,
            endLine: 22,
            title: 'Why Math.max Is Critical for Contained Intervals',
            explanation:
              'If intervals are [[1, 10], [2, 5]], writing current[1] = next[1] would SHRINK [1, 10] down to [1, 5]! Always take Math.max(current[1], next[1]).',
            accent: 'amber',
          },
        ],
      },
      complexity: {
        time: 'O(n log n)',
        space: 'O(n)',
        timeExplanation:
          'Sorting n intervals dominates at O(n log n); the single linear merge sweep runs in O(n).',
        spaceExplanation:
          'O(n) for the output list (plus O(log n) TimSort/Quicksort stack space). Note that in-place write-pointer compaction can reduce extra memory to O(log n) if mutating input is permitted.',
      },
      edgeCases: [
        {
          title: 'Fully Contained / Nested Interval ([[1, 10], [2, 5], [3, 4]])',
          scenario: 'Inner intervals end earlier than the outer interval.',
          handling: 'Math.max(current[1], next[1]) keeps [1, 10] intact without losing the right boundary.',
        },
        {
          title: 'Touching Endpoints ([[1, 4], [4, 5]])',
          scenario: 'End of first equals start of second.',
          handling: 'Inclusive check next[0] <= current[1] merges them cleanly into [[1, 5]].',
        },
        {
          title: 'Streaming / Online Follow-Up (Data Stream as Disjoint Intervals)',
          scenario: 'Senior follow-up: "What if intervals arrive continuously one by one and we must query merged ranges online?"',
          handling:
            'Maintain a TreeMap<Integer, Integer> (start → end). On addInterval(s, e), query floorEntry(s) and subMap(s, true, e, true) to absorb overlapping entries in amortized O(log n) per insertion!',
        },
      ],
    },

    /* ================================================================
     * DSA 5: MEETING ROOMS II
     * ================================================================ */
    {
      id: 'day6-meeting-rooms-ii',
      dayNumber: 6,
      kind: 'dsa',
      title: 'Meeting Rooms II',
      subtitle: 'Min-Heap earliest-ending room reuse vs. chronological two-pointer sweep',
      difficulty: 'Medium',
      patterns: ['Min-Heap (PriorityQueue)', 'Interval Scheduling', 'Sweep Line'],
      estimatedMinutes: 14,
      leetcodeRef: 'LC #253',
      problemStatement:
        'Given an array of meeting time intervals intervals[i] = [start_i, end_i], return the minimum number of conference rooms required so that no two overlapping meetings share a room. A meeting ending at time t frees its room for a meeting starting at time t.',
      exampleSummary: {
        input: 'intervals = [[0, 30], [5, 10], [15, 20], [20, 25]]',
        output: '2',
        explanation:
          'Room 1 hosts [0, 30]. Room 2 hosts [5, 10], frees at t = 10 to reuse for [15, 20], and frees at t = 20 to reuse back-to-back for [20, 25]. Peak concurrency = 2 rooms.',
      },
      patternRecognition: {
        interviewCue:
          'When asked for the PEAK number of simultaneously overlapping intervals (minimum conference rooms, CPU cores, airport gates, platforms), sort by start time and track active rooms in a Min-Heap keyed by earliest end time — OR sweep sorted start[] and end[] arrays with two pointers.',
        signals: [
          'Keywords: "minimum rooms / servers / platforms / gates needed", "maximum concurrent overlap"',
          'Greedy room reuse: whenever a new meeting starts, you ONLY ever need to check the room that frees EARLIEST (minHeap.peek())',
          'Ask yourself: do I need to output WHICH room each meeting got? If yes, Min-Heap wins; if only the integer count, two-pointer sweep is even faster in cache!',
        ],
        mentalModel:
          'Sort meetings by start time. Keep a Min-Heap storing the end time of every currently occupied room. For each meeting [s, e], if minHeap.peek() ≤ s, that earliest-finishing room is now free — poll it and reuse that room by pushing e! Otherwise all rooms are busy — push e to allocate a brand-new room.',
      },
      intuitionComparison: {
        bruteForce: {
          approach:
            'For every meeting’s start time t, linearly count how many intervals cover t (start ≤ t < end) and track the global maximum.',
          timeComplexity: 'O(n²)',
          spaceComplexity: 'O(1)',
          bottleneck:
            'Re-scans all n meetings for every candidate event timestamp instead of maintaining active rooms incrementally.',
        },
        optimal: {
          approach:
            'Sort intervals by start time ascending. Maintain a Min-Heap of active room end times: if !heap.isEmpty() && heap.peek() <= start, poll() to reuse; always offer(end). Return heap.size() (or run chronological two-pointer sweep on separate sorted starts[] & ends[]).',
          timeComplexity: 'O(n log n)',
          spaceComplexity: 'O(n)',
          keyInvariant:
            'Because each step performs at most one poll() paired with one offer(), heap.size() monotonically tracks the high-water mark (maximum simultaneous meetings) seen so far!',
        },
      },
      visualizer: {
        kind: 'dp-1d-stack-heap',
        title: 'Min-Heap Earliest-End Room Reuse Dry Run',
        inputSummary: 'Sorted Meetings: [[0,30], [5,10], [15,20], [20,25]]',
        steps: [
          {
            caption:
              'Sort all meetings by start time ascending: [[0,30], [5,10], [15,20], [20,25]]. Min-Heap starts empty (0 rooms allocated).',
            recurrence: 'Sort by start ASC  |  Min-Heap stores active room end times',
            concreteFormula: 'Init: heap = [], rooms = 0',
            inputItems: {
              label: 'Sorted Meetings [start, end]',
              values: ['[0,30]', '[5,10]', '[15,20]', '[20,25]'],
            },
            primaryArray: {
              label: 'Active Conference Room Timeline',
              indices: ['—'],
              values: ['·'],
            },
            secondaryContainer: {
              kind: 'heap',
              title: 'Min-Heap (Earliest Room End Time at Top)',
              items: [],
            },
            variables: [
              { name: 'heap.size()', value: '0' },
              { name: 'rooms', value: '0' },
            ],
          },
          {
            caption:
              'Meeting [0, 30]: heap is empty → allocate Room 1 for [0, 30] and push end time 30 into Min-Heap.',
            recurrence: 'Heap empty → allocate new room, offer(end)',
            concreteFormula: 'offer(30) → heap = [30], active rooms = 1',
            inputItems: {
              label: 'Sorted Meetings [start, end]',
              values: ['[0,30]', '[5,10]', '[15,20]', '[20,25]'],
              activeIndex: 0,
            },
            primaryArray: {
              label: 'Active Conference Room Timeline',
              indices: ['Room 1'],
              values: ['[0, 30]'],
              activeIndex: 0,
              pointers: [{ label: 'allocated', index: 0, tone: 'primary' }],
            },
            secondaryContainer: {
              kind: 'heap',
              title: 'Min-Heap (Earliest Room End Time at Top)',
              items: [{ value: '30', meta: 'Room 1 (min)', highlight: true }],
            },
            variables: [
              { name: 'meeting', value: '[0, 30]' },
              { name: 'heap.peek()', value: '30' },
              { name: 'rooms', value: '1', tone: 'primary' },
            ],
          },
          {
            caption:
              'Meeting [5, 10]: check heap.peek() ≤ start → 30 ≤ 5 is FALSE! Room 1 is still busy until t = 30. Allocate Room 2 for [5, 10] and push end time 10 (now the new heap minimum!).',
            recurrence: 'if heap.peek() > start → conflict! Allocate new room',
            concreteFormula: 'peek(30) > 5 (Busy!) → offer(10) → heap = [10, 30], rooms = 2',
            inputItems: {
              label: 'Sorted Meetings [start, end]',
              values: ['[0,30]', '[5,10]', '[15,20]', '[20,25]'],
              activeIndex: 1,
              processedUntil: 1,
            },
            primaryArray: {
              label: 'Active Conference Room Timeline',
              indices: ['Room 1', 'Room 2'],
              values: ['[0, 30]', '[5, 10]'],
              activeIndex: 1,
              dependencyIndices: [{ index: 0, label: '30 > 5' }],
              pointers: [{ label: 'new room!', index: 1, tone: 'rose' }],
            },
            secondaryContainer: {
              kind: 'heap',
              title: 'Min-Heap (Earliest Room End Time at Top)',
              items: [
                { value: '10', meta: 'Room 2 (top)', highlight: true },
                { value: '30', meta: 'Room 1' },
              ],
            },
            variables: [
              { name: 'meeting', value: '[5, 10]' },
              { name: 'peek ≤ 5?', value: '30 ≤ 5 ✗', tone: 'rose' },
              { name: 'rooms', value: '2', tone: 'amber' },
            ],
          },
          {
            caption:
              'Meeting [15, 20]: check heap.peek() ≤ start → 10 ≤ 15 is TRUE! Room 2 freed up at t = 10. Poll 10, REUSE Room 2 for [15, 20], and push 20. Room count stays at 2!',
            recurrence: 'if heap.peek() ≤ start → poll() & reuse that room, then offer(end)',
            concreteFormula: 'peek(10) ≤ 15 ✓ → poll(10), offer(20) → heap = [20, 30]',
            inputItems: {
              label: 'Sorted Meetings [start, end]',
              values: ['[0,30]', '[5,10]', '[15,20]', '[20,25]'],
              activeIndex: 2,
              processedUntil: 2,
            },
            primaryArray: {
              label: 'Active Conference Room Timeline',
              indices: ['Room 1', 'Room 2'],
              values: ['[0, 30]', '[15, 20]'],
              activeIndex: 1,
              pointers: [{ label: 'reused (10≤15)', index: 1, tone: 'emerald' }],
            },
            secondaryContainer: {
              kind: 'heap',
              title: 'Min-Heap (Earliest Room End Time at Top)',
              items: [
                { value: '20', meta: 'Room 2 (top)', highlight: true },
                { value: '30', meta: 'Room 1' },
              ],
            },
            variables: [
              { name: 'meeting', value: '[15, 20]' },
              { name: 'peek ≤ 15?', value: '10 ≤ 15 ✓', tone: 'emerald' },
              { name: 'rooms', value: '2', tone: 'emerald' },
            ],
          },
          {
            caption:
              'Meeting [20, 25]: check heap.peek() ≤ start → 20 ≤ 20 is TRUE (back-to-back handoff at t = 20)! Poll 20, REUSE Room 2 for [20, 25], and push 25. Room count remains 2!',
            recurrence: 'Inclusive ≤ allows zero-gap back-to-back handoff at t = 20',
            concreteFormula: 'peek(20) ≤ 20 ✓ → poll(20), offer(25) → heap = [25, 30]',
            inputItems: {
              label: 'Sorted Meetings [start, end]',
              values: ['[0,30]', '[5,10]', '[15,20]', '[20,25]'],
              activeIndex: 3,
              processedUntil: 3,
            },
            primaryArray: {
              label: 'Active Conference Room Timeline',
              indices: ['Room 1', 'Room 2'],
              values: ['[0, 30]', '[20, 25]'],
              activeIndex: 1,
              pointers: [{ label: 'reused (20≤20)', index: 1, tone: 'emerald' }],
            },
            secondaryContainer: {
              kind: 'heap',
              title: 'Min-Heap (Earliest Room End Time at Top)',
              items: [
                { value: '25', meta: 'Room 2 (top)', highlight: true },
                { value: '30', meta: 'Room 1' },
              ],
            },
            variables: [
              { name: 'meeting', value: '[20, 25]' },
              { name: 'peek ≤ 20?', value: '20 ≤ 20 ✓', tone: 'emerald' },
              { name: 'rooms', value: '2', tone: 'emerald' },
            ],
          },
          {
            caption:
              'Done! All 4 meetings fit in heap.size() = 2 rooms. Chronological Two-Pointer Sweep alternative: sort starts = [0, 5, 15, 20] and ends = [10, 20, 25, 30] separately — scanning s against ends[e] frees rooms at t = 15 (≥10) and t = 20 (≥20), giving the exact same answer = 2!',
            recurrence: 'Min-Heap proves room assignment; Two-Pointer Sweep gives faster cache-local count',
            concreteFormula: 'Minimum Conference Rooms Required = heap.size() = 2',
            inputItems: {
              label: 'Sorted Meetings [start, end]',
              values: ['[0,30]', '[5,10]', '[15,20]', '[20,25]'],
              processedUntil: 4,
            },
            primaryArray: {
              label: 'Final Room Schedules (Peak = 2 Rooms)',
              indices: ['Room 1', 'Room 2'],
              values: ['[0,30]', '[5,10]→[15,20]→[20,25]'],
              activeIndex: 1,
              pointers: [
                { label: '1 mtg', index: 0, tone: 'primary' },
                { label: '3 mtgs', index: 1, tone: 'emerald' },
              ],
            },
            secondaryContainer: {
              kind: 'heap',
              title: 'Final Min-Heap State (Size = Peak Rooms = 2)',
              items: [
                { value: '25', meta: 'Room 2', highlight: true },
                { value: '30', meta: 'Room 1', highlight: true },
              ],
            },
            variables: [
              { name: 'minRooms', value: '2', tone: 'emerald' },
              { name: 'sweepCheck', value: 'starts vs ends → 2', tone: 'emerald' },
            ],
          },
        ],
      },
      javaSolution: {
        filename: 'MeetingRoomsII.java',
        code: `import java.util.Arrays;
import java.util.PriorityQueue;

public class MeetingRoomsII {
    // Approach 1: Min-Heap (easily extends to return exact room ID per meeting)
    public int minMeetingRooms(int[][] intervals) {
        if (intervals == null || intervals.length == 0) {
            return 0;
        }

        Arrays.sort(intervals, (a, b) -> Integer.compare(a[0], b[0]));

        // Min-Heap tracks the earliest ending time among all currently booked rooms
        PriorityQueue<Integer> activeRoomEnds = new PriorityQueue<>();

        for (int[] meeting : intervals) {
            if (!activeRoomEnds.isEmpty() && activeRoomEnds.peek() <= meeting[0]) {
                activeRoomEnds.poll(); // Earliest-ending room is free -> reuse it
            }
            activeRoomEnds.offer(meeting[1]);
        }

        return activeRoomEnds.size();
    }

    // Approach 2: Chronological Two-Pointer Sweep (faster constant factor, no boxing)
    public int minMeetingRoomsTwoPointer(int[][] intervals) {
        int n = intervals.length;
        int[] starts = new int[n];
        int[] ends = new int[n];
        for (int i = 0; i < n; i++) {
            starts[i] = intervals[i][0];
            ends[i] = intervals[i][1];
        }

        Arrays.sort(starts);
        Arrays.sort(ends);

        int rooms = 0;
        int endPtr = 0;
        for (int start : starts) {
            if (start < ends[endPtr]) {
                rooms++;   // No room has ended yet -> allocate a new room
            } else {
                endPtr++;  // One room freed up -> reuse it without growing rooms
            }
        }
        return rooms;
    }
}`,
        callouts: [
          {
            id: 'mr2-single-poll',
            startLine: 16,
            endLine: 23,
            title: 'Why "if" (Single Poll) Instead of "while" Keeps Size = Peak',
            explanation:
              'Polling AT MOST once per meeting means heap.size() never decreases — it acts as a built-in high-water mark so you can return activeRoomEnds.size() directly without a separate maxRooms variable! (Use while ONLY if you need exact live occupancy at every instant.)',
            accent: 'primary',
          },
          {
            id: 'mr2-sweep',
            startLine: 27,
            endLine: 40,
            title: 'Chronological Two-Pointer Sweep (Zero Integer Boxing)',
            explanation:
              'Decoupling starts[] and ends[] works because we only care HOW MANY meetings have ended by time start, not WHICH specific meeting ended. Primitive int[] Arrays.sort avoids PriorityQueue Integer boxing and runs ~2–3× faster in benchmarks!',
            accent: 'emerald',
          },
          {
            id: 'mr2-strict-lt',
            startLine: 41,
            endLine: 48,
            title: 'Boundary Rule: start < ends[endPtr]',
            explanation:
              'When start == ends[endPtr] (e.g., [15, 20] followed by [20, 25]), the else branch executes, advancing endPtr and reusing the vacated room cleanly.',
            accent: 'amber',
          },
        ],
      },
      complexity: {
        time: 'O(n log n)',
        space: 'O(n)',
        timeExplanation:
          'Sorting takes O(n log n). In the Min-Heap approach, each meeting triggers at most one poll and one offer at O(log n). In the Two-Pointer Sweep, two primitive sorts take O(n log n) followed by an O(n) scan.',
        spaceExplanation:
          'Up to n end times in the Min-Heap (worst case: all meetings overlap) or two int[n] arrays in the two-pointer sweep.',
      },
      edgeCases: [
        {
          title: 'Back-to-Back Touching Meetings ([[0, 10], [10, 20]])',
          scenario: 'Second meeting starts at the exact minute the first ends.',
          handling: 'Both heap.peek() <= meeting[0] and start < ends[endPtr] treat touching meetings as non-overlapping → returns 1 room.',
        },
        {
          title: 'Follow-Up: Meeting Rooms III (LC #2402 — Assign Lowest Free Room ID)',
          scenario: 'Senior follow-up: "Return the room ID that hosted the most meetings, always picking the lowest-numbered free room."',
          handling:
            'Two-pointer sweep CANNOT answer room-ID questions! Upgrade to TWO Min-Heaps: freeRooms (by roomId) and busyRooms (by [endTime, roomId]), draining ALL busyRooms with endTime <= start using a while loop before popping freeRooms.poll()!',
        },
        {
          title: 'Zero-Duration Meetings ([[5, 5], [5, 10]])',
          scenario: 'Instantaneous event at t = 5.',
          handling: 'Sorting ties by end time ascending (or start ascending) ensures [5, 5] finishes at 5 and is immediately freed before [5, 10] needs a room.',
        },
      ],
    },
  ],

  /* ================================================================
   * DAY 6 LLD: THREAD-SAFE LRU & LFU CACHE
   * ================================================================ */
  lldLesson: {
    id: 'day6-lru-lfu-cache',
    dayNumber: 6,
    kind: 'lld',
    title: 'Thread-Safe LRU & LFU Cache',
    subtitle: 'O(1) Doubly-Linked & Frequency-Bucket Eviction, Strategy/Decorator Composition, and Why Read-Locks Break on get()',
    patterns: ['Strategy Pattern', 'Decorator / Lock Striping', 'Factory Pattern', 'Sentinel Doubly-Linked List'],
    estimatedMinutes: 25,
    problemScope: {
      summary:
        'Design a production-grade, thread-safe, in-memory generic Cache<K, V> library supporting pluggable O(1) eviction policies (LRU and LFU with LRU tie-breaking), live observability stats (hits, misses, evictions), and high-throughput concurrent reads/writes without global lock bottlenecks.',
      functionalRequirements: [
        'Expose a clean generic Cache<K, V> contract supporting get(K), put(K, V), remove(K), size(), and stats().',
        'Support O(1) Least Recently Used (LRU) eviction via HashMap + sentinel DoublyLinkedList.',
        'Support O(1) Least Frequently Used (LFU) eviction via HashMap + Frequency-Bucket DoublyLinkedLists + minFreq tracker, breaking equal-frequency ties by LRU.',
        'Allow callers to switch between LRU and LFU transparently at construction time via CacheFactory without changing client code.',
      ],
      concurrencyAndScaleAssumptions: [
        'High-concurrency backend service: 64+ worker threads hammering get()/put() concurrently (90% reads, 10% writes) targeting >500K ops/sec on a single JVM.',
        'CRITICAL CONCURRENCY INSIGHT: In both LRU and LFU, even a cache-hit get(key) MUTATES internal doubly-linked pointers (recency promotion or frequency-bucket migration). Therefore a naive ReentrantReadWriteLock using readLock() on get() causes data races and corrupted linked lists!',
        'Must eliminate global single-lock contention via hash-based Lock Striping (N power-of-two independent segments) while explicitly discussing Caffeine-style ring-buffer async promotion as the next-level optimization.',
      ],
      explicitNonGoals: [
        'Distributed multi-node cache clustering / consistent hashing across machines (covered in HLD; this is an in-process JVM cache library like Guava Cache / Caffeine).',
        'Disk spillover or off-heap DirectByteBuffer serialization (keep focus on clean OOP, O(1) invariants, and JVM concurrency).',
      ],
    },
    coreEntities: [
      {
        name: 'Cache<K, V> (Interface)',
        role: 'Unified abstraction hiding both eviction policy (LRU vs. LFU) and concurrency wrapper (Lock Striping) from application callers.',
        keyFields: ['get(K): Optional<V>', 'put(K, V): void', 'remove(K): boolean', 'stats(): CacheStats'],
        invariants: 'Rejects null keys/values fail-fast via Objects.requireNonNull to prevent ambiguous misses.',
      },
      {
        name: 'CacheNode<K, V> & DoublyLinkedList<K, V>',
        role: 'Reusable O(1) intrusive doubly-linked container anchored by dummy head (MRU) and tail (LRU) sentinel nodes.',
        keyFields: ['key: K', 'value: V', 'freq: int', 'prev: CacheNode', 'next: CacheNode'],
        invariants: 'Sentinel head/tail are never null and never hold user keys — eliminating all null boundary checks during unlink/insert.',
      },
      {
        name: 'LruCache<K, V>',
        role: 'Single-segment O(1) LRU policy maintaining recency order in one DoublyLinkedList indexed by a HashMap.',
        keyFields: ['capacity: int', 'index: Map<K, CacheNode<K, V>>', 'recencyList: DoublyLinkedList<K, V>'],
        invariants: 'index.size() == recencyList.size() <= capacity; head.next is always MRU and tail.prev is always LRU.',
      },
      {
        name: 'LfuCache<K, V>',
        role: 'Single-segment O(1) LFU policy maintaining frequency-indexed DoublyLinkedLists and a monotonic minFreq pointer.',
        keyFields: ['capacity: int', 'minFreq: int', 'index: Map<K, CacheNode<K, V>>', 'freqBuckets: Map<Integer, DoublyLinkedList<K, V>>'],
        invariants: 'Whenever index is non-empty, freqBuckets.get(minFreq) is non-empty and its tail.prev is the exact LFU+LRU eviction victim.',
      },
      {
        name: 'StripedConcurrentCache<K, V>',
        role: 'Thread-safe Decorator partitioning keys across P power-of-two CacheSegments, each pairing an isolated ReentrantLock with a dedicated inner Cache<K, V>.',
        keyFields: ['segments: CacheSegment<K, V>[]', 'segmentMask: int', 'hits/misses/evictions: LongAdder'],
        invariants: 'Every key K deterministically hashes to exactly one segment; threads hitting distinct segments execute with zero lock contention.',
      },
    ],
    designPatterns: [
      {
        pattern: 'Strategy / Polymorphic Policy (Cache<K, V> → LruCache & LfuCache)',
        whereUsed: 'Encapsulating eviction algorithms behind the shared Cache<K, V> contract.',
        whatBreaksWithoutIt:
          'A monolithic Cache class littered with if (policy == LFU) branches mixes single-list recency logic with freqBuckets/minFreq state, breaking Single Responsibility and making future policies (W-TinyLFU, FIFO, TTL-LRU) risky to add.',
        howItSolvesIt:
          'Each eviction algorithm lives in a clean, single-threaded, independently unit-testable class implementing Cache<K, V>, while reusing the shared DoublyLinkedList<K, V> primitive.',
      },
      {
        pattern: 'Decorator Pattern (StripedConcurrentCache<K, V>)',
        whereUsed: 'Layering thread-safety, hash-based lock striping, and lock-free LongAdder metrics cleanly on top of any single-threaded Cache<K, V> policy.',
        whatBreaksWithoutIt:
          'Duplicating ReentrantLock / sharding boilerplate inside both LruCache and LfuCache tangles algorithmic invariants with concurrency mechanics and makes deterministic single-threaded testing harder.',
        howItSolvesIt:
          'StripedConcurrentCache implements Cache<K, V> and composes P independent segment caches created via an IntFunction<Cache<K, V>> supplier — adding concurrency to ANY new eviction policy automatically!',
      },
      {
        pattern: 'Factory Pattern (CacheFactory)',
        whereUsed: 'Validating capacity/concurrency parameters, rounding shard counts to powers of two, distributing uneven per-segment capacities, and wiring StripedConcurrentCache with the chosen EvictionPolicy.',
        whatBreaksWithoutIt:
          'Callers manually compute power-of-two bitmasks, mis-size segment capacities (causing total capacity drift), or accidentally instantiate non-thread-safe LruCache in multi-threaded Spring beans.',
        howItSolvesIt:
          'Centralizes safe construction behind CacheFactory.create(EvictionPolicy.LFU, 10_000, 16) so callers receive a hardened, ready-to-use Cache<K, V>.',
      },
    ],
    diagrams: {
      classDiagram: {
        title: 'Thread-Safe LRU & LFU Cache — UML Class Diagram',
        caption: 'Shared sentinel DoublyLinkedList powers both O(1) LRU and O(1) LFU; StripedConcurrentCache decorates segments with per-shard ReentrantLocks',
        mermaid: `classDiagram
    class Cache {
        <<interface>>
        +get(key) Optional~V~
        +put(key, val) void
        +remove(key) boolean
        +size() int
        +stats() CacheStats
    }

    class CacheNode {
        -K key
        -V value
        -int freq
        -CacheNode prev
        -CacheNode next
    }

    class DoublyLinkedList {
        -CacheNode head
        -CacheNode tail
        -int size
        +addFirst(node) void
        +remove(node) void
        +removeLast() CacheNode
        +isEmpty() boolean
    }

    class LruCache {
        -int capacity
        -Map~K, CacheNode~ index
        -DoublyLinkedList recency
        +get(key) Optional~V~
        +put(key, val) void
    }

    class LfuCache {
        -int capacity
        -int minFreq
        -Map~K, CacheNode~ index
        -Map~Integer, DoublyLinkedList~ freqBuckets
        +get(key) Optional~V~
        +put(key, val) void
    }

    class StripedConcurrentCache {
        -List~CacheSegment~ segments
        -int segmentMask
        -LongAdder hits
        -LongAdder misses
        +get(key) Optional~V~
        +put(key, val) void
    }

    class CacheSegment {
        -ReentrantLock lock
        -Cache~K, V~ delegate
        +get(key) Optional~V~
        +put(key, val) void
    }

    class CacheFactory {
        +create(policy, cap, stripes) Cache
    }

    Cache <|.. LruCache : "implements"
    Cache <|.. LfuCache : "implements"
    Cache <|.. StripedConcurrentCache : "decorates"
    StripedConcurrentCache "1" *-- "*" CacheSegment : "routes by hash"
    CacheSegment "1" *-- "1" Cache : "guards with lock"
    LruCache "1" *-- "1" DoublyLinkedList : "tracks recency"
    LfuCache "1" *-- "*" DoublyLinkedList : "buckets by freq"
    DoublyLinkedList "1" o-- "*" CacheNode : "links O(1)"
    CacheFactory ..> StripedConcurrentCache : "builds"`,
      },
      sequenceDiagram: {
        title: 'Concurrent Striped LFU get() Promotion & Full-Capacity put() Eviction',
        caption: 'Notice why get() MUST acquire the segment exclusive ReentrantLock — promoting a node mutates doubly-linked frequency buckets and minFreq',
        mermaid: `sequenceDiagram
    participant Thread as "Worker Thread"
    participant Striped as "StripedConcurrentCache"
    participant Seg as "CacheSegment[h & mask]"
    participant Lfu as "LfuCache Segment"
    participant Buckets as "freqBuckets DLLs"

    Thread->>Striped: "get(key)"
    Striped->>Striped: "idx = spread(key.hashCode()) & mask"
    Striped->>Seg: "segment[idx].get(key)"
    Seg->>Seg: "lock.lock() [exclusive: get mutates links!]"
    Seg->>Lfu: "delegate.get(key)"
    alt "Cache Hit"
        Lfu->>Buckets: "remove(node) from bucket[freq]"
        Lfu->>Lfu: "if oldFreq == minFreq & empty -> minFreq++"
        Lfu->>Buckets: "addFirst(node) to bucket[freq + 1]"
        Lfu-->>Seg: "Optional.of(value)"
    else "Cache Miss"
        Lfu-->>Seg: "Optional.empty()"
    end
    Seg->>Seg: "lock.unlock()"
    Seg-->>Striped: "Result + LongAdder hit/miss tick"
    Striped-->>Thread: "Optional(value)"

    Thread->>Striped: "put(newKey, newVal) [segment full]"
    Striped->>Seg: "segment[idx].put(newKey, newVal)"
    Seg->>Seg: "lock.lock()"
    Seg->>Lfu: "delegate.put(newKey, newVal)"
    Lfu->>Buckets: "evict tail.prev from bucket[minFreq]"
    Lfu->>Buckets: "addFirst(newNode) to bucket[1] & minFreq = 1"
    Seg->>Seg: "lock.unlock()"
    Seg-->>Thread: "Done O(1)"`,
      },
    },
    codeFiles: [
      {
        filename: 'CacheCore.java',
        label: 'CacheCore.java',
        summary: 'Common Cache<K, V> contract, EvictionPolicy enum, immutable CacheStats, and reusable sentinel DoublyLinkedList<K, V>.',
        code: `import java.util.Objects;
import java.util.Optional;

public enum EvictionPolicy { LRU, LFU }

public record CacheStats(long hits, long misses, long evictions) {
    public double hitRate() {
        long total = hits + misses;
        return total == 0 ? 0.0 : (double) hits / total;
    }
}

public interface Cache<K, V> {
    Optional<V> get(K key);
    void put(K key, V value);
    boolean remove(K key);
    int size();
    default CacheStats stats() { return new CacheStats(0, 0, 0); }
}

final class CacheNode<K, V> {
    final K key;
    V value;
    int freq;
    CacheNode<K, V> prev;
    CacheNode<K, V> next;

    CacheNode(K key, V value) {
        this.key = key;
        this.value = value;
        this.freq = 1;
    }
}

/**
 * Reusable O(1) Doubly Linked List anchored by dummy head (MRU) and tail (LRU)
 * sentinels so unlink/insert never require null boundary branches.
 */
final class DoublyLinkedList<K, V> {
    private final CacheNode<K, V> head = new CacheNode<>(null, null);
    private final CacheNode<K, V> tail = new CacheNode<>(null, null);
    private int size = 0;

    DoublyLinkedList() {
        head.next = tail;
        tail.prev = head;
    }

    void addFirst(CacheNode<K, V> node) {
        Objects.requireNonNull(node);
        node.next = head.next;
        node.prev = head;
        head.next.prev = node;
        head.next = node;
        size++;
    }

    void remove(CacheNode<K, V> node) {
        node.prev.next = node.next;
        node.next.prev = node.prev;
        node.prev = null; // Help GC & fail fast on accidental double-unlink
        node.next = null;
        size--;
    }

    void moveToFront(CacheNode<K, V> node) {
        remove(node);
        addFirst(node);
    }

    CacheNode<K, V> removeLast() {
        if (size == 0) {
            return null;
        }
        CacheNode<K, V> lru = tail.prev;
        remove(lru);
        return lru;
    }

    boolean isEmpty() { return size == 0; }
    int size() { return size; }
}`,
        callouts: [
          {
            id: 'cc-sentinel',
            startLine: 40,
            endLine: 47,
            title: 'Dummy Head & Tail Sentinels Eliminate Null Pointer Bugs',
            explanation:
              'Anchoring head.next = tail and tail.prev = head guarantees every real node ALWAYS has non-null prev and next neighbors — collapsing 6 tricky null-edge branches into 4 clean pointer assignments.',
            accent: 'primary',
          },
          {
            id: 'cc-clear-links',
            startLine: 58,
            endLine: 64,
            title: 'Nulling Detached Pointers Aids GC & Catches Double-Remove',
            explanation:
              'Clearing node.prev and node.next on removal prevents evicted nodes from accidentally retaining stale chains in Old Gen memory and makes double-unlink bugs surface immediately during tests.',
            accent: 'amber',
          },
        ],
      },
      {
        filename: 'LruCache.java',
        label: 'LruCache.java',
        summary: 'Clean O(1) Least Recently Used implementation backed by HashMap + single DoublyLinkedList.',
        code: `import java.util.HashMap;
import java.util.Map;
import java.util.Objects;
import java.util.Optional;

public final class LruCache<K, V> implements Cache<K, V> {
    private final int capacity;
    private final Map<K, CacheNode<K, V>> index;
    private final DoublyLinkedList<K, V> recencyList = new DoublyLinkedList<>();
    private long evictions = 0;

    public LruCache(int capacity) {
        if (capacity < 0) {
            throw new IllegalArgumentException("capacity must be >= 0");
        }
        this.capacity = capacity;
        this.index = new HashMap<>(Math.min(capacity, 1024));
    }

    @Override
    public Optional<V> get(K key) {
        Objects.requireNonNull(key, "key must not be null");
        CacheNode<K, V> node = index.get(key);
        if (node == null) {
            return Optional.empty();
        }
        // NOTE: get() mutates recencyList links! NOT safe under a shared read lock.
        recencyList.moveToFront(node);
        return Optional.of(node.value);
    }

    @Override
    public void put(K key, V value) {
        Objects.requireNonNull(key, "key must not be null");
        Objects.requireNonNull(value, "value must not be null");
        if (capacity == 0) {
            return;
        }

        CacheNode<K, V> existing = index.get(key);
        if (existing != null) {
            existing.value = value;
            recencyList.moveToFront(existing);
            return;
        }

        if (index.size() == capacity) {
            CacheNode<K, V> victim = recencyList.removeLast();
            if (victim != null) {
                index.remove(victim.key);
                evictions++;
            }
        }

        CacheNode<K, V> created = new CacheNode<>(key, value);
        recencyList.addFirst(created);
        index.put(key, created);
    }

    @Override
    public boolean remove(K key) {
        Objects.requireNonNull(key, "key must not be null");
        CacheNode<K, V> removed = index.remove(key);
        if (removed == null) {
            return false;
        }
        recencyList.remove(removed);
        return true;
    }

    @Override
    public int size() { return index.size(); }

    @Override
    public CacheStats stats() { return new CacheStats(0, 0, evictions); }
}`,
        callouts: [
          {
            id: 'lru-read-mutates',
            startLine: 27,
            endLine: 29,
            title: 'Why get() Is Structurally a Write Operation',
            explanation:
              'Even though get(key) looks logically read-only, moveToFront(node) unlinks and re-links pointers across recencyList. Calling get() concurrently under a shared ReadWriteLock.readLock() will corrupt prev/next pointers and deadlock threads in cycles!',
            accent: 'rose',
          },
          {
            id: 'lru-update-order',
            startLine: 40,
            endLine: 45,
            title: 'Update Existing Key Before Checking Capacity',
            explanation:
              'A frequent interview bug is checking index.size() == capacity BEFORE checking whether key already exists — causing an unnecessary eviction when updating an existing key in a full cache.',
            accent: 'amber',
          },
        ],
      },
      {
        filename: 'LfuCache.java',
        label: 'LfuCache.java',
        summary: 'O(1) Least Frequently Used cache with Frequency-Bucket DoublyLinkedLists, minFreq tracking, and LRU tie-breaking.',
        code: `import java.util.HashMap;
import java.util.Map;
import java.util.Objects;
import java.util.Optional;

public final class LfuCache<K, V> implements Cache<K, V> {
    private final int capacity;
    private final Map<K, CacheNode<K, V>> index;
    private final Map<Integer, DoublyLinkedList<K, V>> freqBuckets = new HashMap<>();
    private int minFreq = 0;
    private long evictions = 0;

    public LfuCache(int capacity) {
        if (capacity < 0) {
            throw new IllegalArgumentException("capacity must be >= 0");
        }
        this.capacity = capacity;
        this.index = new HashMap<>(Math.min(capacity, 1024));
    }

    @Override
    public Optional<V> get(K key) {
        Objects.requireNonNull(key, "key must not be null");
        CacheNode<K, V> node = index.get(key);
        if (node == null) {
            return Optional.empty();
        }
        promote(node);
        return Optional.of(node.value);
    }

    @Override
    public void put(K key, V value) {
        Objects.requireNonNull(key, "key must not be null");
        Objects.requireNonNull(value, "value must not be null");
        if (capacity == 0) {
            return;
        }

        CacheNode<K, V> existing = index.get(key);
        if (existing != null) {
            existing.value = value;
            promote(existing);
            return;
        }

        if (index.size() == capacity) {
            DoublyLinkedList<K, V> lowestBucket = freqBuckets.get(minFreq);
            // Tail of minFreq bucket is both least-frequent AND least-recently-used
            CacheNode<K, V> victim = lowestBucket.removeLast();
            index.remove(victim.key);
            if (lowestBucket.isEmpty()) {
                freqBuckets.remove(minFreq);
            }
            evictions++;
        }

        CacheNode<K, V> fresh = new CacheNode<>(key, value); // starts at freq = 1
        index.put(key, fresh);
        freqBuckets.computeIfAbsent(1, k -> new DoublyLinkedList<>()).addFirst(fresh);
        minFreq = 1; // Brand-new entry always resets global minimum frequency to 1
    }

    @Override
    public boolean remove(K key) {
        Objects.requireNonNull(key, "key must not be null");
        CacheNode<K, V> node = index.remove(key);
        if (node == null) {
            return false;
        }
        DoublyLinkedList<K, V> bucket = freqBuckets.get(node.freq);
        bucket.remove(node);
        if (bucket.isEmpty()) {
            freqBuckets.remove(node.freq);
            if (node.freq == minFreq) {
                minFreq = freqBuckets.isEmpty() ? 0 : freqBuckets.keySet().stream()
                    .mapToInt(Integer::intValue).min().orElse(0);
            }
        }
        return true;
    }

    private void promote(CacheNode<K, V> node) {
        int oldFreq = node.freq;
        DoublyLinkedList<K, V> oldBucket = freqBuckets.get(oldFreq);
        oldBucket.remove(node);

        if (oldBucket.isEmpty()) {
            freqBuckets.remove(oldFreq);
            if (oldFreq == minFreq) {
                minFreq = oldFreq + 1; // Exact O(1) advancement — no scan needed!
            }
        }

        node.freq = oldFreq + 1;
        freqBuckets.computeIfAbsent(node.freq, k -> new DoublyLinkedList<>()).addFirst(node);
    }

    @Override
    public int size() { return index.size(); }

    @Override
    public CacheStats stats() { return new CacheStats(0, 0, evictions); }
}`,
        callouts: [
          {
            id: 'lfu-evict',
            startLine: 47,
            endLine: 61,
            title: 'O(1) LFU + LRU Tie-Breaking & minFreq = 1 Reset',
            explanation:
              'Each frequency bucket is itself an LRU DoublyLinkedList (addFirst on access, removeLast on eviction). When inserting a brand-new key, evict from freqBuckets[minFreq] FIRST, then insert at freq = 1 and reset minFreq = 1.',
            accent: 'emerald',
          },
          {
            id: 'lfu-promote',
            startLine: 83,
            endLine: 97,
            title: 'Why minFreq Advances in Strict O(1) on Promotion',
            explanation:
              'When a node at oldFreq == minFreq gets accessed, its new frequency is guaranteed to be oldFreq + 1. Therefore if oldBucket just became empty, the new global minimum frequency MUST be oldFreq + 1 — zero heap or map scanning required!',
            accent: 'primary',
          },
          {
            id: 'lfu-remove-note',
            startLine: 72,
            endLine: 79,
            title: 'Honest Trade-Off on Explicit remove(key)',
            explanation:
              'While get() and put() are strictly O(1), explicit remove() of the sole remaining minFreq key can leave a frequency gap. If frequent explicit deletes are required, link frequency buckets themselves in a doubly-linked BucketList (O(1) remove() too!).',
            accent: 'amber',
          },
        ],
      },
      {
        filename: 'StripedConcurrentCache.java',
        label: 'StripedConcurrentCache.java',
        summary: 'Lock-striped thread-safe Decorator + CacheFactory solving the ReadWriteLock-breaks-on-get() concurrency trap.',
        code: `import java.util.Objects;
import java.util.Optional;
import java.util.concurrent.atomic.LongAdder;
import java.util.concurrent.locks.ReentrantLock;
import java.util.function.IntFunction;

public final class StripedConcurrentCache<K, V> implements Cache<K, V> {
    private final CacheSegment<K, V>[] segments;
    private final int segmentMask;
    private final LongAdder hits = new LongAdder();
    private final LongAdder misses = new LongAdder();

    @SuppressWarnings("unchecked")
    public StripedConcurrentCache(
            int totalCapacity,
            int requestedStripes,
            IntFunction<Cache<K, V>> segmentFactory) {
        if (totalCapacity < 0 || requestedStripes <= 0) {
            throw new IllegalArgumentException("Invalid capacity or stripe count");
        }
        int stripeCount = nextPowerOfTwo(Math.min(requestedStripes, Math.max(1, totalCapacity)));
        this.segmentMask = stripeCount - 1;
        this.segments = new CacheSegment[stripeCount];

        // Distribute remainder cleanly so sum(segmentCapacities) == totalCapacity exactly
        int baseCap = totalCapacity / stripeCount;
        int remainder = totalCapacity % stripeCount;
        for (int i = 0; i < stripeCount; i++) {
            int segCap = baseCap + (i < remainder ? 1 : 0);
            this.segments[i] = new CacheSegment<>(segmentFactory.apply(segCap));
        }
    }

    @Override
    public Optional<V> get(K key) {
        Objects.requireNonNull(key, "key must not be null");
        Optional<V> value = segmentFor(key).get(key);
        if (value.isPresent()) {
            hits.increment();
        } else {
            misses.increment();
        }
        return value;
    }

    @Override
    public void put(K key, V value) {
        Objects.requireNonNull(key, "key must not be null");
        Objects.requireNonNull(value, "value must not be null");
        segmentFor(key).put(key, value);
    }

    @Override
    public boolean remove(K key) {
        Objects.requireNonNull(key, "key must not be null");
        return segmentFor(key).remove(key);
    }

    @Override
    public int size() {
        int total = 0;
        for (CacheSegment<K, V> segment : segments) {
            total += segment.size();
        }
        return total;
    }

    @Override
    public CacheStats stats() {
        long totalEvictions = 0;
        for (CacheSegment<K, V> segment : segments) {
            totalEvictions += segment.evictions();
        }
        return new CacheStats(hits.sum(), misses.sum(), totalEvictions);
    }

    private CacheSegment<K, V> segmentFor(K key) {
        int h = key.hashCode();
        // Mix upper bits downward (ConcurrentHashMap spread) to prevent hash clustering
        int spread = h ^ (h >>> 16);
        return segments[spread & segmentMask];
    }

    private static int nextPowerOfTwo(int n) {
        int v = Math.max(1, n - 1);
        v |= v >>> 1;
        v |= v >>> 2;
        v |= v >>> 4;
        v |= v >>> 8;
        v |= v >>> 16;
        return (v >= (1 << 16)) ? (1 << 16) : v + 1;
    }

    private static final class CacheSegment<K, V> {
        // Exclusive ReentrantLock per shard: safe for get()'s pointer mutations, P× less contention
        private final ReentrantLock lock = new ReentrantLock();
        private final Cache<K, V> delegate;

        CacheSegment(Cache<K, V> delegate) {
            this.delegate = delegate;
        }

        Optional<V> get(K key) {
            lock.lock();
            try { return delegate.get(key); } finally { lock.unlock(); }
        }

        void put(K key, V value) {
            lock.lock();
            try { delegate.put(key, value); } finally { lock.unlock(); }
        }

        boolean remove(K key) {
            lock.lock();
            try { return delegate.remove(key); } finally { lock.unlock(); }
        }

        int size() {
            lock.lock();
            try { return delegate.size(); } finally { lock.unlock(); }
        }

        long evictions() {
            lock.lock();
            try { return delegate.stats().evictions(); } finally { lock.unlock(); }
        }
    }
}

public final class CacheFactory {
    private CacheFactory() {}

    public static <K, V> Cache<K, V> create(EvictionPolicy policy, int capacity, int stripes) {
        IntFunction<Cache<K, V>> factory = switch (policy) {
            case LRU -> LruCache::new;
            case LFU -> LfuCache::new;
        };
        return new StripedConcurrentCache<>(capacity, stripes, factory);
    }
}`,
        callouts: [
          {
            id: 'sc-striping',
            startLine: 21,
            endLine: 32,
            title: 'Power-of-Two Lock Striping + Exact Capacity Distribution',
            explanation:
              'Rounding stripeCount to a power of two replaces expensive modulo (%) with a single-cycle bitwise AND (spread & segmentMask). Distributing remainder across the first R segments guarantees total capacity matches the caller’s exact budget.',
            accent: 'primary',
          },
          {
            id: 'sc-longadder',
            startLine: 10,
            endLine: 11,
            title: 'LongAdder Beats AtomicLong Under High Read Concurrency',
            explanation:
              'Under 64 concurrent threads incrementing hit counters, a single AtomicLong suffers severe CPU cache-line bouncing (CAS contention). LongAdder stripes counters across per-thread cells and sums lazily on stats().',
            accent: 'emerald',
          },
          {
            id: 'sc-lock-choice',
            startLine: 94,
            endLine: 106,
            title: 'Why ReentrantLock per Segment Beats ReentrantReadWriteLock',
            explanation:
              'ReentrantReadWriteLock cannot safely allow parallel get() calls because LRU/LFU get() mutates doubly-linked nodes; taking writeLock() on every get() makes RWLock strictly slower than a plain ReentrantLock! Striping across 16–64 ReentrantLocks scales linearly while preserving exact O(1) invariants.',
            accent: 'amber',
          },
        ],
      },
    ],
    solidHighlights: [
      {
        principle: 'Single Responsibility',
        application:
          'DoublyLinkedList manages pointer surgery, LruCache/LfuCache own eviction invariants, StripedConcurrentCache owns thread-safety and hash routing, and CacheFactory owns wiring.',
      },
      {
        principle: 'Open/Closed',
        application:
          'Adding a new W-TinyLFU or FIFO-with-TTL policy requires implementing Cache<K, V> and registering one enum branch in CacheFactory — zero changes to StripedConcurrentCache or DoublyLinkedList.',
      },
      {
        principle: 'Liskov Substitution',
        application:
          'LruCache, LfuCache, and StripedConcurrentCache all honor the exact Cache<K, V> contract (fail-fast null checks, Optional returns, bounded size), making them seamlessly swappable.',
      },
      {
        principle: 'Dependency Inversion',
        application:
          'StripedConcurrentCache depends only on the Cache<K, V> interface and IntFunction<Cache<K, V>> factory abstraction rather than hardcoding LruCache or LfuCache.',
      },
    ],
    extensibilityScenarios: [
      {
        scenario: 'Add Per-Entry TTL Expiration (Active + Lazy Expiry)',
        changesRequired:
          'Add long expiresAtNanos (using injected monotonic Clock/Ticker) to CacheNode. Check expiry lazily on get() and maintain a timing wheel (HashedWheelTimer) or background sweeper per segment to reclaim expired cold entries without O(n) scans.',
      },
      {
        scenario: 'Zero-Blocking Read Path (Caffeine-Style Async Ring Buffer)',
        changesRequired:
          'Store entries in a ConcurrentHashMap so get() reads values 100% lock-free, record accessed keys into a striped lossy ring buffer, and drain recency/frequency promotions asynchronously under tryLock() — eliminating lock acquisition on hot read hits (at the cost of slightly approximate recency).',
      },
      {
        scenario: 'LFU Frequency Aging / Cache Pollution Immunity (W-TinyLFU)',
        changesRequired:
          'Classic LFU suffers when a once-viral key accumulates freq = 10⁶ and stays pinned forever. Periodically halve all frequency counts (right-shift freq >>= 1) or introduce a 4-bit Count-Min Sketch admission filter (W-TinyLFU) to reject one-hit wonders.',
      },
    ],
    concurrencyChoices: [
      {
        topic: 'Why Pure ReentrantReadWriteLock Fails on LRU / LFU get()',
        mechanism: 'Avoid shared readLock() on get(); use Striped ReentrantLock per segment (or lock-free CHM + ring buffer)',
        rationale:
          'Both LRU (moveToFront) and LFU (move across freqBuckets + minFreq++) mutate shared doubly-linked list links during get(). Putting get() under readLock() causes pointer corruption and infinite loops; putting get() under writeLock() degenerates into a slower global mutex.',
      },
      {
        topic: 'Hot-Key Contention & Sharded Approximation Trade-Off',
        mechanism: 'Power-of-two Lock Striping with hash-bit spreading (h ^ (h >>> 16))',
        rationale:
          'Cuts lock contention by P× (e.g., 32×) with strict per-segment O(1) eviction. Call out the honest trade-off: eviction is locally exact per segment rather than globally exact across all segments, which is negligible for caches > 1,000 entries.',
      },
      {
        topic: 'Cache Stampede / Singleflight Loading (Follow-Up)',
        mechanism: 'ConcurrentHashMap.computeIfAbsent or CompletableFuture coalescing on miss',
        rationale:
          'If 500 threads miss on the same expired hot key simultaneously, coalesce them onto a single in-flight loader Future so only 1 thread queries the backing database while 499 share its result.',
      },
    ],
  },

  /* ================================================================
   * DAY 6 HLD: RIDE SHARING / UBER
   * ================================================================ */
  hldLesson: {
    id: 'day6-ride-sharing-uber',
    dayNumber: 6,
    kind: 'hld',
    title: 'Ride Sharing / Uber Dispatch',
    subtitle: 'H3 Hexagonal Spatial Indexing, 250K/s WebSocket Telemetry, Atomic Driver Offer Locks, and Streaming Surge Pricing',
    tags: ['H3 Hexagons', '250K/s GPS', 'Atomic Dispatch', 'Flink Surge'],
    estimatedMinutes: 26,
    overview:
      'Design a global real-time ride-hailing platform supporting 1M concurrent active drivers streaming GPS coordinates every 4 seconds, 20M daily trips, sub-second nearest-driver ETA matching with zero double-booked drivers, resilient trip state transitions, and dynamic H3-cell surge pricing.',
    requirements: {
      functional: [
        'Continuously ingest high-frequency GPS location updates (every 4 seconds) from active drivers and stream live driver position to matched riders.',
        'Compute upfront fare estimates (base + distance + ETA + live H3 surge multiplier) before a rider confirms a booking.',
        'Match ride requests to the optimal nearby available driver using road-network ETA (not just straight-line distance) with exclusive 15-second driver offers and automatic failover to the next candidate.',
        'Manage the end-to-end Trip State Machine (REQUESTED → OFFERED → MATCHED → ARRIVING → IN_PROGRESS → COMPLETED / CANCELLED) with durable receipts and payment settlement.',
      ],
      nonFunctional: [
        {
          metric: 'Location Ingestion Throughput',
          target: '250K–500K GPS updates/sec (Write-Heavy)',
          rationale: '1M active drivers pinging every 4s creates continuous ephemeral write pressure that would crush disk-backed relational spatial indexes.',
        },
        {
          metric: 'Matching Consistency (Driver Offer)',
          target: 'Strongly Consistent (Zero Double-Dispatch)',
          rationale: 'Location staleness of 2–4 seconds is acceptable (AP), BUT assigning the same driver to two riders simultaneously breaks physical reality and demands atomic locking (CP).',
        },
        {
          metric: 'Dispatch & Fare-Quote Latency (p99)',
          target: '< 500 ms fare quote · < 2 s initial driver offer',
          rationale: 'Fast matching directly drives rider conversion; slow matching causes riders to cancel or switch apps.',
        },
        {
          metric: 'Regional Isolation & Availability',
          target: '99.99% per metro region',
          rationale: 'Ride supply and demand are strictly local to a city/metro — sharding independently by city prevents an outage in London from affecting New York.',
        },
      ],
    },
    capacityMath: {
      assumptions: [
        '5M registered drivers; 1M active online drivers at peak sending GPS heartbeats every 4 seconds',
        '20M completed trips/day (~2M concurrent active trips at peak; 3× peak traffic multiplier)',
        'Location ping payload ≈ 64 B (driverId, lat, lng, heading, speed, status, h3Cell, timestamp)',
        'Trip durable record ≈ 1.5 KB (participants, route summary, fare breakdown, state timestamps); 5-year retention',
      ],
      calculations: [
        {
          metric: 'Driver Location Write QPS',
          formula: '1,000,000 active drivers / 4 s = 250,000 pings/sec',
          result: '250K RPS avg · ~500K RPS surge peak',
          notes: 'Ephemeral in-memory writes only — never hit disk on the hot location-update path!',
        },
        {
          metric: 'Location Ingestion Bandwidth',
          formula: '250,000 pings/sec × 64 B payload',
          result: '~16 MB/s raw (~32 MB/s w/ WS framing)',
          notes: 'Bandwidth is modest; connection fan-in (3M sockets) and spatial index write rate are the real bottlenecks.',
        },
        {
          metric: 'In-Memory Spatial Index RAM',
          formula: '1M active drivers × ~128 B (coords + H3 index + status)',
          result: '~128 MB active (~640 MB for all 5M drivers)',
          notes: 'Easily fits inside RAM! Sharding across 16–32 regional nodes isolates CPU throughput and city blast radius.',
        },
        {
          metric: 'Trip Booking & ETA Read QPS',
          formula: '20M trips/day / 86,400 s ≈ 231/s → ×3 peak (~700 book/s, ~3,500 quote/s)',
          result: '~700 bookings/s · ~3,500 ETA quotes/s peak',
          notes: '350× lower than GPS writes, yet strictly demands strong consistency for atomic driver locking and trip FSM.',
        },
        {
          metric: 'Persistent WebSocket Gateway Fleet',
          formula: '(1M active drivers + 2M live riders) / 50K sockets per server',
          result: '~60 active WS nodes (~120 w/ 2× headroom)',
          notes: 'Stateful edge nodes holding epoll sockets with lightweight heartbeat + auto-reconnect on deploy.',
        },
        {
          metric: '5-Year Trip OLTP Storage',
          formula: '20M/day × 365 × 5 yr × 1.5 KB = 36.5B × 1.5 KB',
          result: '~54.8 TB raw (~165 TB w/ 3× replication)',
          notes: 'Hot active/recent trips in sharded OLTP (by city_id / trip_id); historical trips tiered to S3/Iceberg.',
        },
      ],
    },
    apiAndDataModel: {
      endpoints: [
        {
          method: 'PUT',
          path: 'wss://edge.uber.io/v1/drivers/location (WebSocket stream)',
          summary: 'High-frequency 4-second driver GPS telemetry frame (Protobuf over persistent WebSocket)',
          payload: '{ "driverId": "d_8841", "lat": 37.7749, "lng": -122.4194, "bearing": 140, "status": "AVAILABLE", "ts": 1732166400 }',
        },
        {
          method: 'POST',
          path: '/api/v1/rides/estimate',
          summary: 'Return upfront fare, road-network ETA, and locked surge token (valid 2 min) for pickup → dropoff',
          payload: '{ "pickup": [37.7749, -122.4194], "dropoff": [37.7897, -122.4014], "tier": "UBER_X" } → 200 { "etaSec": 240, "fareCents": 1850, "surge": 1.4, "quoteId": "q_91f" }',
        },
        {
          method: 'POST',
          path: '/api/v1/rides (Idempotency-Key header)',
          summary: 'Create trip in REQUESTED state and trigger asynchronous Dispatch Engine matching',
          payload: '{ "quoteId": "q_91f", "paymentMethodId": "pm_42" } → 202 { "tripId": "t_7021", "state": "REQUESTED" }',
        },
        {
          method: 'POST',
          path: '/api/v1/dispatch/offers/{offerId}/respond',
          summary: 'Driver accepts or declines an exclusive 15-second dispatch offer (fenced by offerToken)',
          payload: '{ "driverId": "d_8841", "action": "ACCEPT", "offerToken": "tok_a82" } → 200 { "tripId": "t_7021", "state": "MATCHED" }',
        },
      ],
      storageSchema: [
        {
          store: 'In-Memory H3 Spatial Index + Offer Lock (City-Sharded Redis / Custom RAM Grid)',
          schema: 'h3_cell:{res7_hex} → Set<driverId>  |  driver:{id} → Hash(lat, lng, h3, status, ts, TTL=30s)  |  lock:driver:{id} → offerToken (SET NX PX 15000)',
          shardingAndIndexing:
            'Partitioned strictly by metro/city_id (and H3 Resolution 7 ~5 km² hexagons for supply lookup). Moving a driver between hexagons executes atomic SREM oldCell + SADD newCell via Lua script.',
        },
        {
          store: 'Trip OLTP Store (Sharded PostgreSQL / CockroachDB)',
          schema: 'trips (trip_id UUID PK, city_id INT, rider_id BIGINT, driver_id BIGINT, state VARCHAR, version INT, pickup_h3 BIGINT, fare_cents INT, surge_mult DECIMAL, created_at TIMESTAMP)',
          shardingAndIndexing:
            'Sharded by city_id + trip_id for localized low-latency ACID writes. Optimistic concurrency control (WHERE trip_id = ? AND state = "OFFERED" AND version = ?) enforces legal Trip FSM transitions.',
        },
      ],
    },
    architecture: {
      title: 'Ride Sharing / Uber — Interactive Geo-Spatial Dispatch Architecture',
      summary: 'Click any component to inspect H3 hexagonal indexing, 250K/s GPS ingestion, atomic driver offer locking, and Flink surge aggregation',
      defaultSelectedNodeId: 'dispatch-svc',
      nodes: [
        {
          id: 'driver-app',
          label: 'Driver App',
          sublabel: '1M GPS Pings (4s)',
          category: 'client',
          x: 14,
          y: 92,
          width: 134,
          height: 58,
          flows: ['write', 'read'],
          details: {
            role: 'Streams compact Protobuf GPS heartbeats every 4 seconds while online, receives exclusive 15-second ride offer popups, and reports pickup/dropoff milestones.',
            dataFlow: 'Maintains a persistent TLS WebSocket (or QUIC/UDP fallback on flaky cellular) to WS Edge Fleet for bidirectional telemetry and low-latency dispatch offers.',
            scalingStrategy: 'Adaptive ping throttling slows updates to every 10–15s when stationary or on low battery, cutting unnecessary write QPS by ~35%.',
            failureHandling: 'On cellular dead-zones, buffers trip GPS breadcrumbs locally for accurate post-trip fare reconciliation; auto-reconnects with exponential jitter.',
            techChoices: ['Protobuf over WSS', 'iOS / Android SDK', 'Adaptive GPS Throttle'],
          },
        },
        {
          id: 'rider-app',
          label: 'Rider App',
          sublabel: 'Book + Live ETA Map',
          category: 'client',
          x: 14,
          y: 344,
          width: 134,
          height: 58,
          flows: ['read', 'write'],
          details: {
            role: 'Requests upfront fare/ETA quotes, submits idempotent ride bookings, and renders smooth animated nearby/assigned driver locations on the map.',
            dataFlow: 'Sends REST/gRPC fare estimates and ride bookings via API Gateway; subscribes to live matched-driver coordinates over WebSocket.',
            scalingStrategy: 'Client-side dead-reckoning & road-snapping interpolates 4-second driver pings smoothly at 60 FPS without hammering servers.',
            failureHandling: 'Attaches client-generated Idempotency-Key on POST /rides so double-taps or flaky LTE retries never book two cars.',
            techChoices: ['REST / gRPC', 'WebSocket Live Map', 'Idempotency-Key'],
          },
        },
        {
          id: 'ws-gateway',
          label: 'WS / Edge Fleet',
          sublabel: '3M Sockets · Push',
          category: 'edge',
          x: 200,
          y: 92,
          width: 156,
          height: 58,
          flows: ['write', 'read'],
          details: {
            role: 'Terminates 3M persistent bidirectional WebSockets for active drivers and watching riders, mapping each userId → gatewayNodeId in a lightweight session directory.',
            dataFlow: 'Forwards inbound driver GPS pings to Location Service; pushes exclusive Dispatch Offers to drivers and live driver-location updates to matched riders.',
            scalingStrategy: '~60–120 epoll-tuned Go/Netty edge servers (~50K connections/node) partitioned by metro region via GeoDNS.',
            failureHandling: 'Graceful rolling drains send reconnect hints before node shutdown; if a gateway dies, drivers reconnect to a healthy node within 1–2s and re-register their session.',
            techChoices: ['Netty / Go epoll', 'Session Registry (Redis)', 'GeoDNS'],
          },
        },
        {
          id: 'api-gateway',
          label: 'API Gateway / LB',
          sublabel: 'TLS · Auth · Geo-Route',
          category: 'edge',
          x: 200,
          y: 344,
          width: 156,
          height: 58,
          flows: ['read', 'write'],
          details: {
            role: 'Handles TLS termination, JWT authentication, per-user rate limiting, and geo-aware L7 routing to regional Dispatch and Trip microservices.',
            dataFlow: 'Routes POST /rides/estimate and trip lifecycle calls to Trip & Pricing, and triggers matching workflows in Dispatch & ETA.',
            scalingStrategy: 'Stateless Envoy/ALB cluster autoscaled per city/region so local rush-hour bursts scale independently.',
            failureHandling: 'Enforces strict request deadlines, circuit breakers, and idempotency token validation at the edge before backend services are invoked.',
            techChoices: ['Envoy Proxy', 'Regional L7 LB', 'JWT + Rate Limiter'],
          },
        },
        {
          id: 'location-svc',
          label: 'Location Service',
          sublabel: '250K/s H3 Ingestion',
          category: 'service',
          x: 400,
          y: 46,
          width: 164,
          height: 58,
          flows: ['write'],
          details: {
            role: 'High-throughput stateless ingestion tier converting raw (lat, lng) into 64-bit Uber H3 hexagon indexes (Resolution 7 & 9), filtering GPS jitter, and updating live spatial state.',
            dataFlow: 'Writes latest driver pose + H3 cell to H3 Spatial Index (TTL 30s) and emits raw GPS events asynchronously to Kafka for Surge Pricing, traffic ETA calibration, and trip route logging.',
            scalingStrategy: 'Horizontally stateless fleet scaled on 250K–500K pings/sec; batches Kafka produces per 50ms window to maximize throughput.',
            failureHandling: 'Drops out-of-order stale GPS frames (comparing monotonic client timestamp); if Kafka backs up, prioritizes keeping live H3 Spatial Index fresh.',
            techChoices: ['Go / Rust / Java', 'Uber H3 C/JNI Library', 'Kalman / Map-Match Filter'],
          },
        },
        {
          id: 'dispatch-svc',
          label: 'Dispatch & ETA',
          sublabel: 'K-Ring + ETA + Lock',
          category: 'service',
          x: 400,
          y: 218,
          width: 164,
          height: 58,
          flows: ['read', 'write'],
          details: {
            role: 'Core matching engine: queries nearby AVAILABLE drivers via H3 k-ring expansion, computes true road-network ETA matrix (Contraction Hierarchies / OSRM), ranks candidates, and executes atomic exclusive offers.',
            dataFlow: 'Queries H3 Spatial Index (kRing 1 → 2) → computes road ETA + reads Surge Multiplier → acquires atomic Redis SET NX PX 15s lock on best driver → pushes offer via WS Edge Fleet → commits match to Trip Service.',
            scalingStrategy: 'Regionally sharded by metro city; supports batched bipartite matching (e.g., every 2 seconds solving Hungarian/Min-Cost-Max-Flow over city zone) to lower global average wait time vs. pure greedy first-come dispatch!',
            failureHandling: 'If a driver declines or 15s TTL expires without ACK, lock auto-releases and Dispatch advances seamlessly to candidate #2 (expanding k-ring if needed).',
            techChoices: ['H3 kRing Search', 'OSRM / Contraction Hierarchies', 'Batched Bipartite Matching'],
          },
        },
        {
          id: 'trip-svc',
          label: 'Trip & Pricing',
          sublabel: 'Trip FSM + Fare Quote',
          category: 'service',
          x: 400,
          y: 390,
          width: 164,
          height: 58,
          flows: ['read', 'write'],
          details: {
            role: 'Authoritative owner of upfront fare quotes, surge-token validation, Trip Finite State Machine transitions (REQUESTED → MATCHED → IN_PROGRESS → COMPLETED), and payment capture triggers.',
            dataFlow: 'Persists every legal state transition with optimistic version checks in Sharded Trip DB, emits demand events to Kafka for real-time surge calculation, and triggers async payment/receipt workflows on completion.',
            scalingStrategy: 'Stateless regional service fleet; quote validation uses HMAC-signed short-lived fare tokens (zero DB writes on abandoned fare estimates!).',
            failureHandling: 'Outbox pattern ensures payment capture and rider notifications run at-least-once with idempotent Stripe/PSP keys even after pod crashes.',
            techChoices: ['State Machine (Optimistic Lock)', 'Signed Quote Tokens', 'Transactional Outbox'],
          },
        },
        {
          id: 'spatial-index',
          label: 'H3 Spatial + Lock',
          sublabel: 'Redis Geo + SET NX',
          category: 'cache',
          x: 700,
          y: 46,
          width: 208,
          height: 58,
          flows: ['write', 'read'],
          details: {
            role: 'Dual-purpose ultra-fast RAM tier: (1) maps each H3 Res-7 hexagon to active AVAILABLE drivers with 30s TTL auto-expiry, and (2) holds atomic 15-second driver offer locks (SET lock:driver:{id} token NX PX 15000).',
            dataFlow: 'Updated 250K/s by Location Service (atomic Lua hexagon move); queried by Dispatch Engine via 7-cell / 19-cell H3 k-ring lookups + atomic driver lock claims.',
            scalingStrategy: 'City-sharded Redis Cluster (or Uber-style in-memory Go/Ringpop spatial nodes) — 128 MB active dataset fits easily in RAM per region with sub-millisecond reads.',
            failureHandling: '30-second TTL automatically evicts crashed/offline drivers without manual cleanup; if a spatial shard restarts, 4-second driver heartbeats rebuild 100% of live supply within 4 seconds!',
            techChoices: ['Redis Cluster + Lua', 'H3 Bucket Sets', 'SET NX PX Fencing Lock'],
          },
        },
        {
          id: 'kafka-surge',
          label: 'Kafka + Flink Surge',
          sublabel: 'H3 Demand / Supply',
          category: 'queue',
          x: 700,
          y: 218,
          width: 208,
          height: 58,
          flows: ['write', 'read'],
          details: {
            role: 'Real-time stream-processing pipeline computing per-H3-hexagon dynamic surge multipliers by joining rolling 2-minute rider demand events against live available-driver supply.',
            dataFlow: 'Ingests GPS availability ticks from Location Service and ride-open/request events from Trip Service via Kafka; Apache Flink computes smoothed surge multipliers per H3 cell and publishes them to a low-latency read cache.',
            scalingStrategy: 'Kafka partitioned by H3 Res-6/Res-7 parent cell so Flink keyed tumbling/sliding windows compute exact local supply-demand ratios without cross-node shuffles.',
            failureHandling: 'Spatial smoothing blends neighboring H3 hexagons to prevent cliff-edge surge jumps across a single street; falls back cleanly to 1.0× base pricing if Flink lags > 60s.',
            techChoices: ['Apache Kafka', 'Apache Flink Windows', 'H3 Spatial Smoothing'],
          },
        },
        {
          id: 'trip-db',
          label: 'Sharded Trip DB',
          sublabel: 'ACID FSM + Receipts',
          category: 'database',
          x: 700,
          y: 390,
          width: 208,
          height: 58,
          flows: ['read', 'write'],
          details: {
            role: 'Strongly consistent OLTP store holding active and recent trips, state-transition audit trails, fare snapshots, and idempotency keys.',
            dataFlow: 'Receives version-checked UPDATE/INSERT state transitions from Trip & Pricing Service; streams completed trips via CDC to S3/Iceberg data lake for analytics & dispute replay.',
            scalingStrategy: 'Sharded geographically by city_id + trip_id across regional clusters; hot active trips stay tiny while cold completed trips archive after 90 days.',
            failureHandling: 'Synchronous Multi-AZ Raft/quorum replication guarantees zero lost trips or corrupted billing records during zone failures.',
            techChoices: ['CockroachDB / Sharded Postgres', 'Optimistic Locking', 'CDC → S3 Archive'],
          },
        },
      ],
      edges: [
        { id: 'ub-1', from: 'driver-app', to: 'ws-gateway', label: 'WSS', flow: 'both' },
        { id: 'ub-2', from: 'rider-app', to: 'api-gateway', label: 'HTTPS', flow: 'both' },
        {
          id: 'ub-3',
          from: 'rider-app',
          to: 'ws-gateway',
          label: 'Live Map',
          flow: 'read',
          async: true,
          fromSide: 'top',
          toSide: 'bottom',
          labelT: 0.48,
        },
        {
          id: 'ub-4',
          from: 'ws-gateway',
          to: 'location-svc',
          label: '4s Ping',
          flow: 'write',
          fromSide: 'top',
          toSide: 'left',
          labelT: 0.5,
        },
        {
          id: 'ub-5',
          from: 'dispatch-svc',
          to: 'ws-gateway',
          label: 'Offer Push',
          flow: 'write',
          async: true,
          fromSide: 'left',
          toSide: 'bottom',
          labelT: 0.5,
        },
        {
          id: 'ub-6',
          from: 'api-gateway',
          to: 'dispatch-svc',
          label: 'Req Ride',
          flow: 'write',
          fromSide: 'top',
          toSide: 'left',
          labelT: 0.5,
        },
        {
          id: 'ub-7',
          from: 'api-gateway',
          to: 'trip-svc',
          label: 'Trip / Fare',
          flow: 'both',
          fromSide: 'bottom',
          toSide: 'left',
          labelT: 0.5,
        },
        { id: 'ub-8', from: 'location-svc', to: 'spatial-index', label: 'H3 Upsert', flow: 'write', labelT: 0.5 },
        {
          id: 'ub-9',
          from: 'location-svc',
          to: 'kafka-surge',
          label: 'GPS Stream',
          flow: 'write',
          async: true,
          labelT: 0.32,
        },
        {
          id: 'ub-10',
          from: 'dispatch-svc',
          to: 'spatial-index',
          label: 'K-Ring + NX',
          flow: 'both',
          labelT: 0.32,
        },
        { id: 'ub-11', from: 'dispatch-svc', to: 'kafka-surge', label: 'Read Surge', flow: 'read', labelT: 0.56 },
        { id: 'ub-12', from: 'dispatch-svc', to: 'trip-svc', label: 'Match Evt', flow: 'write', labelT: 0.5 },
        { id: 'ub-13', from: 'trip-svc', to: 'trip-db', label: 'ACID State', flow: 'both', labelT: 0.5 },
        {
          id: 'ub-14',
          from: 'trip-svc',
          to: 'kafka-surge',
          label: 'Demand Evt',
          flow: 'write',
          async: true,
          labelT: 0.48,
        },
      ],
    },
    tradeOffs: [
      {
        topic: 'Spatial Index: Geohash vs. Quadtree vs. Uber H3 Hexagons',
        context: 'Dispatch needs fast radius/k-ring lookup over 1M moving drivers AND smooth area aggregation for dynamic surge pricing.',
        options: [
          {
            name: 'Geohash (1D Z-Order Curve / Redis GEO)',
            pros: ['Built natively into Redis GEOADD/GEOSEARCH', 'Simple base32 prefix matching'],
            cons: [
              'Edge distortion: rectangular cells have 8 neighbors at TWO different distances (diagonal is √2 farther)',
              'Boundary jumps: two drivers 10 meters apart across a Geohash boundary share zero prefix, requiring 9-cell lookups',
            ],
            whenToChoose: 'Rapid MVPs or simple proximity search where Redis GEO out-of-the-box suffices.',
          },
          {
            name: 'Dynamic Quadtree (In-Memory Tree)',
            pros: ['Adapts leaf granularity automatically to dense downtown vs. sparse rural areas'],
            cons: [
              'Terrible write-lock contention at 250K/s moving vehicles as drivers constantly cross leaf boundaries, triggering tree splits/merges',
              'Harder to shard and serialize consistently across stateless workers',
            ],
            whenToChoose: 'Read-heavy STATIC Points of Interest (Yelp / Google Maps businesses) that rarely move.',
          },
          {
            name: 'Uber H3 Hexagonal Hierarchical Grid',
            recommended: true,
            pros: [
              'Every hexagon has 6 equidistant neighbors — kRing(cell, 1) = 7 cells approximates a true circle cleanly',
              'O(1) deterministic lat/lng → 64-bit H3 int conversion with zero tree rebalancing locks under 250K/s updates',
              'Clean parent/child resolution hierarchy aligns Dispatch radius search with Flink surge-pricing zones seamlessly',
            ],
            cons: ['Requires H3 library binding (C/JNI/Go) and slightly approximate parent-child containment (~15% aperture-7 overlap)'],
            whenToChoose: 'High-velocity moving-fleet dispatch, delivery logistics, and spatial surge heatmaps.',
          },
        ],
        seniorVerdict:
          'Choose Uber H3 hexagons stored in city-sharded in-memory sets (Redis or custom RAM index) with 30-second TTLs. Contrast explicitly against Quadtrees (great for static Yelp POIs, poor for 250K/s moving cars) — that comparison is a classic 4.5-YOE differentiator.',
      },
      {
        topic: 'Dispatch Matching & Double-Booking Prevention: Broadcast Race vs. Exclusive Atomic Offer Lock',
        context: 'Two riders 50 meters apart request UberX at the exact same millisecond while only one driver is nearby.',
        options: [
          {
            name: 'Broadcast Offer to Top-5 Drivers (First-to-Tap Wins)',
            pros: ['Slightly faster acceptance when drivers ignore phones'],
            cons: [
              'Hostile driver UX: 4 drivers tap Accept only to get "Trip Already Taken" — induces distracted driving and churn',
              'Amplifies lock contention on the Trip DB row under concurrent accepts',
            ],
            whenToChoose: 'Low-frequency marketplace gig boards, NOT real-time driving safety environments.',
          },
          {
            name: 'Exclusive Offer via Atomic Redis Lock (SET NX PX 15s) + Fencing Token',
            recommended: true,
            pros: [
              'Guarantees a driver receives at most ONE active offer at a time — zero double-dispatch races',
              '15-second TTL automatically releases the driver if they ignore the popup or lose cellular signal',
              'Monotonic fencing token / offerId prevents a delayed Accept packet after timeout from hijacking a reassigned trip',
            ],
            cons: ['If candidate #1 declines after 15s, total matching latency extends to ~20–30s (mitigated by Batched Bipartite Matching + ML acceptance-probability scoring)'],
            whenToChoose: 'Production ride-sharing and real-time courier dispatch (Uber, Lyft, DoorDash).',
          },
        ],
        seniorVerdict:
          'Always use Exclusive Atomic Driver Locks (SET lock:driver:{id} {offerToken} NX PX 15000) paired with optimistic version checks in Trip DB. Bonus Staff insight: batch incoming ride requests over a 2-second city window and solve global Min-Cost-Max-Flow (minimizing total road ETA across all pairs) rather than myopic greedy matching!',
      },
      {
        topic: 'Location Telemetry Storage: Direct OLTP Writes vs. Ephemeral RAM Index + Async Kafka Stream',
        context: '1M drivers × 0.25 updates/sec = 250,000 GPS writes/sec continuously.',
        options: [
          {
            name: 'Write Every GPS Ping Directly to PostGIS / Sharded SQL',
            pros: ['Single source of truth with standard SQL geospatial queries'],
            cons: [
              '250K/s B-tree / R-tree disk index updates saturate IOPS, cause WAL write amplification, and collapse p99 latency',
              '99% of intermediate pings are obsolete 4 seconds later!',
            ],
            whenToChoose: 'Never at Uber scale — only for small fleets (< 1,000 vehicles).',
          },
          {
            name: 'Ephemeral In-Memory Spatial Index (30s TTL) + Async Kafka → Flink / S3',
            recommended: true,
            pros: [
              'Sub-millisecond RAM updates absorb 250K–500K/s effortlessly',
              'Self-healing on node crash: 4-second driver heartbeats fully repopulate a fresh RAM shard in 4 seconds!',
              'Kafka decouples real-time Flink surge windows, live road-speed ETA updates, and S3 cold route archives off the ingestion critical path',
            ],
            cons: ['Latest 1–3 seconds of GPS coordinates are eventually consistent (completely acceptable for moving cars)'],
            whenToChoose: 'Every large-scale real-time telemetry, fleet tracking, or ride-hailing platform.',
          },
        ],
        seniorVerdict:
          'Split the system cleanly by consistency need: keep high-frequency driver locations AP and ephemeral in RAM (rebuilt in 4 seconds automatically after crashes), while keeping Driver Offer Locks and Trip State Machine transitions strictly CP and durable.',
      },
    ],
  },
};
