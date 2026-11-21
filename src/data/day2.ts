import type { DayCurriculum } from '@/types/curriculum';

export const day2: DayCurriculum = {
  dayNumber: 2,
  title: 'Stacks, Monotonic Stack & Heaps',
  theme: 'Monotonic Boundary Invariants, Traffic-Shaping Strategies & Dynamo-Style Partitioning',
  status: 'complete',
  estimatedMinutes: 120,
  summary:
    'Master O(n) monotonic stack boundary sweeps and O(log k) heap frontiers across five core problems, engineer a thread-safe multi-strategy Rate Limiter in Java, and architect a Dynamo-style Distributed Key-Value Store with tunable quorum and LSM-Tree storage.',
  dsaLessons: [
    /* ================================================================
     * DSA 1: LARGEST RECTANGLE IN HISTOGRAM
     * ================================================================ */
    {
      id: 'day2-largest-rectangle-histogram',
      dayNumber: 2,
      kind: 'dsa',
      title: 'Largest Rectangle in Histogram',
      subtitle: 'Monotonic increasing stack finding exact nearest-smaller left & right bounds in one pass',
      difficulty: 'Hard',
      patterns: ['Monotonic Stack', 'Nearest Smaller Element', 'Sentinel Flush'],
      estimatedMinutes: 16,
      leetcodeRef: 'LC #84',
      problemStatement:
        'Given an array of integers heights representing the histogram’s bar heights where the width of each bar is 1, return the area of the largest rectangle that can be formed inside the histogram.',
      exampleSummary: {
        input: 'heights = [2, 1, 5, 6, 2, 3]',
        output: '10',
        explanation:
          'Bars at indices 2 (height 5) and 3 (height 6) share a limiting height of 5 across width 2, yielding area 5 × 2 = 10. Bar 4 (height 2) spans indices [2..5] for 2 × 4 = 8.',
      },
      patternRecognition: {
        interviewCue:
          'Ask: "If bar k is the limiting shortest bar of a rectangle, how far left and right can it expand?" It stops at the first strictly shorter bar on either side — the signature trigger for a Monotonic Increasing Stack.',
        signals: [
          'Objective multiplies a minimum element over a contiguous span by span width (max area, sum of subarray minimums)',
          'Need Previous Smaller Element (PSE) and Next Smaller Element (NSE) for every index in O(n)',
          'Every popped bar discovers BOTH its right boundary (current index i) and left boundary (new stack top) simultaneously',
        ],
        mentalModel:
          'Maintain a stack of bar indices in monotonically increasing height order. As long as heights keep rising, rectangles can keep stretching right. The instant a shorter bar arrives at index i, every taller bar on the stack hits its right wall — pop each one, read its left wall from the element directly beneath it on the stack, and score height × width.',
      },
      intuitionComparison: {
        bruteForce: {
          approach:
            'For every bar i, expand a left pointer until heights[l] < heights[i] and a right pointer until heights[r] < heights[i], then compute heights[i] × (r - l - 1).',
          timeComplexity: 'O(n²)',
          spaceComplexity: 'O(1)',
          bottleneck:
            'Repeatedly re-walks across tall plateaus and increasing prefixes to rediscover the same shorter boundary walls.',
        },
        optimal: {
          approach:
            'Single pass from i = 0 to n (treating i == n as a virtual sentinel bar of height 0). While stack top is taller than currHeight, pop top, compute width = i - (stack.isEmpty() ? -1 : stack.peek()) - 1, and update maxArea.',
          timeComplexity: 'O(n)',
          spaceComplexity: 'O(n)',
          keyInvariant:
            'Every index is pushed onto the monotonic stack at most once and popped at most once, guaranteeing strictly 2n stack operations and O(n) amortized runtime.',
        },
      },
      visualizer: {
        kind: 'array-pointers',
        title: 'Monotonic Increasing Stack Boundary Sweep',
        inputSummary: 'heights = [2, 1, 5, 6, 2, 3] + virtual sentinel 0 at i = 6',
        steps: [
          {
            caption:
              'Start at i = 0 (height = 2). The stack is empty, so push index 0 onto the monotonic increasing stack. Bar 0 stays open because we have not yet seen a shorter bar to its right.',
            formula: 'stack empty → push (idx=0, h=2)',
            values: [2, 1, 5, 6, 2, 3],
            barMode: { maxHeight: 6 },
            cellStates: { 0: 'active' },
            pointers: [{ label: 'i', index: 0, tone: 'primary' }],
            auxStructure: {
              title: 'Monotonic Increasing Stack (bottom → top): idx → height',
              entries: [{ key: 'idx 0', value: 'h = 2', highlight: true, tone: 'primary' }],
            },
            variables: [
              { name: 'i', value: '0' },
              { name: 'currH', value: '2' },
              { name: 'maxArea', value: '0' },
            ],
          },
          {
            caption:
              'i = 1 (height = 1) < top height 2! Index 1 is the right boundary for bar 0. Pop (0, h=2): stack becomes empty so leftBound = -1, width = 1 - (-1) - 1 = 1, area = 2 × 1 = 2. Push (1, h=1).',
            formula: 'pop(0, h=2): span [0..0], width = 1 - (-1) - 1 = 1 → area = 2',
            values: [2, 1, 5, 6, 2, 3],
            barMode: { maxHeight: 6, shadedSpan: { start: 0, end: 0, height: 2 } },
            cellStates: { 0: 'match', 1: 'active' },
            pointers: [{ label: 'i', index: 1, tone: 'amber' }],
            auxStructure: {
              title: 'Monotonic Increasing Stack (bottom → top): idx → height',
              entries: [{ key: 'idx 1', value: 'h = 1 (pushed)', highlight: true, tone: 'amber' }],
            },
            variables: [
              { name: 'popped', value: 'idx 0 (h=2)' },
              { name: 'area', value: '2 × 1 = 2' },
              { name: 'maxArea', value: '2', tone: 'emerald' },
            ],
          },
          {
            caption:
              'i = 2 (height = 5) >= stack top h = 1. Monotonic order holds — no rectangle closes yet. Push (2, h=5).',
            formula: '5 >= top(1) → push (idx=2, h=5)',
            values: [2, 1, 5, 6, 2, 3],
            barMode: { maxHeight: 6 },
            cellStates: { 0: 'excluded', 2: 'active' },
            pointers: [{ label: 'i', index: 2, tone: 'primary' }],
            auxStructure: {
              title: 'Monotonic Increasing Stack (bottom → top): idx → height',
              entries: [
                { key: 'idx 1', value: 'h = 1' },
                { key: 'idx 2', value: 'h = 5', highlight: true, tone: 'primary' },
              ],
            },
            variables: [
              { name: 'i', value: '2' },
              { name: 'currH', value: '5' },
              { name: 'maxArea', value: '2' },
            ],
          },
          {
            caption:
              'i = 3 (height = 6) >= stack top h = 5. Push (3, h=6). Notice all three bars on the stack [1, 2, 3] remain open and increasing: heights 1 < 5 < 6.',
            formula: '6 >= top(5) → push (idx=3, h=6)',
            values: [2, 1, 5, 6, 2, 3],
            barMode: { maxHeight: 6 },
            cellStates: { 0: 'excluded', 3: 'active' },
            pointers: [{ label: 'i', index: 3, tone: 'primary' }],
            auxStructure: {
              title: 'Monotonic Increasing Stack (bottom → top): idx → height',
              entries: [
                { key: 'idx 1', value: 'h = 1' },
                { key: 'idx 2', value: 'h = 5' },
                { key: 'idx 3', value: 'h = 6', highlight: true, tone: 'primary' },
              ],
            },
            variables: [
              { name: 'i', value: '3' },
              { name: 'currH', value: '6' },
              { name: 'maxArea', value: '2' },
            ],
          },
          {
            caption:
              'i = 4 (height = 2) < top h = 6! First pop: (3, h=6). New stack top is idx 2 (leftBound = 2), rightBound = 4 → span [3..3], width = 4 - 2 - 1 = 1, area = 6 × 1 = 6. New best = 6!',
            formula: 'pop(3, h=6): span [3..3], width = 4 - 2 - 1 = 1 → area = 6',
            values: [2, 1, 5, 6, 2, 3],
            barMode: { maxHeight: 6, shadedSpan: { start: 3, end: 3, height: 6 } },
            cellStates: { 0: 'excluded', 3: 'match', 4: 'active' },
            pointers: [{ label: 'i', index: 4, tone: 'amber' }],
            auxStructure: {
              title: 'Monotonic Increasing Stack (bottom → top): idx → height',
              entries: [
                { key: 'idx 1', value: 'h = 1' },
                { key: 'idx 2', value: 'h = 5 (next pop!)', highlight: true, tone: 'rose' },
              ],
            },
            variables: [
              { name: 'popped', value: 'idx 3 (h=6)' },
              { name: 'area', value: '6 × 1 = 6' },
              { name: 'maxArea', value: '6', tone: 'emerald' },
            ],
          },
          {
            caption:
              'Still at i = 4 (height = 2) < top h = 5! Second pop: (2, h=5). New top is idx 1 (leftBound = 1), rightBound = 4 → span [2..3], width = 4 - 1 - 1 = 2, area = 5 × 2 = 10! Now 2 >= top(1), so push (4, h=2).',
            formula: 'pop(2, h=5): span [2..3], width = 4 - 1 - 1 = 2 → area = 10 (BEST!)',
            values: [2, 1, 5, 6, 2, 3],
            barMode: { maxHeight: 6, shadedSpan: { start: 2, end: 3, height: 5 } },
            cellStates: { 0: 'excluded', 2: 'best', 3: 'best', 4: 'active' },
            pointers: [{ label: 'i', index: 4, tone: 'amber' }],
            auxStructure: {
              title: 'Monotonic Increasing Stack (bottom → top): idx → height',
              entries: [
                { key: 'idx 1', value: 'h = 1' },
                { key: 'idx 4', value: 'h = 2 (pushed)', highlight: true, tone: 'primary' },
              ],
            },
            variables: [
              { name: 'popped', value: 'idx 2 (h=5)' },
              { name: 'area', value: '5 × 2 = 10', tone: 'emerald' },
              { name: 'maxArea', value: '10', tone: 'emerald' },
            ],
          },
          {
            caption:
              'i = 5 (height = 3) >= stack top h = 2. Push (5, h=3). Notice idx 4 sits directly atop idx 1 — implicitly remembering that indices 2 and 3 were taller than 2 and can still extend bar 4 leftward!',
            formula: '3 >= top(2) → push (idx=5, h=3)',
            values: [2, 1, 5, 6, 2, 3],
            barMode: { maxHeight: 6 },
            cellStates: { 0: 'excluded', 5: 'active' },
            pointers: [{ label: 'i', index: 5, tone: 'primary' }],
            auxStructure: {
              title: 'Monotonic Increasing Stack (bottom → top): idx → height',
              entries: [
                { key: 'idx 1', value: 'h = 1' },
                { key: 'idx 4', value: 'h = 2' },
                { key: 'idx 5', value: 'h = 3', highlight: true, tone: 'primary' },
              ],
            },
            variables: [
              { name: 'i', value: '5' },
              { name: 'currH', value: '3' },
              { name: 'maxArea', value: '10', tone: 'emerald' },
            ],
          },
          {
            caption:
              'Sentinel flush i = 6 (virtual h = 0)! First pops (5, h=3) → span [5..5], area = 3 × 1 = 3. Next pops (4, h=2): new top is idx 1, so span reaches ALL THE WAY BACK across [2..5], width = 6 - 1 - 1 = 4 → area = 2 × 4 = 8!',
            formula: 'pop(4, h=2): leftBound = 1, rightBound = 6 → span [2..5], area = 2 × 4 = 8',
            values: [2, 1, 5, 6, 2, 3],
            barMode: { maxHeight: 6, shadedSpan: { start: 2, end: 5, height: 2 } },
            cellStates: { 2: 'match', 3: 'match', 4: 'match', 5: 'match' },
            pointers: [{ label: 'L=1', index: 1, tone: 'amber' }],
            auxStructure: {
              title: 'Monotonic Increasing Stack (Sentinel Flush i = 6)',
              entries: [{ key: 'idx 1', value: 'h = 1 (next pop)', highlight: true, tone: 'rose' }],
            },
            variables: [
              { name: 'i (sentinel)', value: '6 (h=0)' },
              { name: 'area', value: '2 × 4 = 8' },
              { name: 'maxArea', value: '10', tone: 'emerald' },
            ],
          },
          {
            caption:
              'Sentinel flush pops the last bar (1, h=1): stack is now empty (leftBound = -1), so bar 1 spans the entire histogram [0..5], width = 6 → area = 1 × 6 = 6. Stack drained cleanly!',
            formula: 'pop(1, h=1): span [0..5], width = 6 - (-1) - 1 = 6 → area = 6',
            values: [2, 1, 5, 6, 2, 3],
            barMode: { maxHeight: 6, shadedSpan: { start: 0, end: 5, height: 1 } },
            cellStates: { 0: 'match', 1: 'match', 2: 'match', 3: 'match', 4: 'match', 5: 'match' },
            pointers: [],
            auxStructure: {
              title: 'Monotonic Increasing Stack (Drained)',
              entries: [],
            },
            variables: [
              { name: 'popped', value: 'idx 1 (h=1)' },
              { name: 'area', value: '1 × 6 = 6' },
              { name: 'maxArea', value: '10', tone: 'emerald' },
            ],
          },
          {
            caption:
              'Sweep complete in O(n)! Every bar’s maximal rectangle was evaluated exactly once: {2, 6, 10, 3, 8, 6}. Optimal largest rectangle is area = 10 over indices [2..3] at height 5.',
            formula: 'Global Optimum = max(2, 6, 10, 3, 8, 6) = 10  (span [2..3], h = 5)',
            values: [2, 1, 5, 6, 2, 3],
            barMode: { maxHeight: 6, shadedSpan: { start: 2, end: 3, height: 5 } },
            cellStates: { 2: 'best', 3: 'best' },
            pointers: [],
            auxStructure: {
              title: 'Final Result Summary',
              entries: [
                { key: 'Best Span', value: '[2..3] (width 2)', highlight: true, tone: 'emerald' },
                { key: 'Limiting Height', value: '5', highlight: true, tone: 'emerald' },
                { key: 'Max Area', value: '10', highlight: true, tone: 'emerald' },
              ],
            },
            variables: [
              { name: 'bestSpan', value: '[2..3]', tone: 'emerald' },
              { name: 'maxArea', value: '10', tone: 'emerald' },
            ],
          },
        ],
      },
      javaSolution: {
        filename: 'LargestRectangleHistogram.java',
        code: `import java.util.ArrayDeque;
import java.util.Deque;

public class LargestRectangleHistogram {
    public int largestRectangleArea(int[] heights) {
        if (heights == null || heights.length == 0) {
            return 0;
        }

        int n = heights.length;
        // Store bar indices in monotonically non-decreasing height order
        Deque<Integer> stack = new ArrayDeque<>();
        int maxArea = 0;

        // Loop up to i == n with virtual height 0 to flush all remaining bars
        for (int i = 0; i <= n; i++) {
            int currHeight = (i == n) ? 0 : heights[i];

            while (!stack.isEmpty() && heights[stack.peek()] > currHeight) {
                int barHeight = heights[stack.pop()];
                // Left boundary is the new stack top (or -1 if bar extends to index 0)
                int leftBound = stack.isEmpty() ? -1 : stack.peek();
                int width = i - leftBound - 1;
                maxArea = Math.max(maxArea, barHeight * width);
            }

            stack.push(i);
        }

        return maxArea;
    }
}`,
        callouts: [
          {
            id: 'lrh-deque',
            startLine: 11,
            endLine: 12,
            title: 'ArrayDeque Over Legacy java.util.Stack',
            explanation:
              'Never reach for java.util.Stack in Java interviews — it extends Vector and acquires a synchronized monitor lock on every push/pop. ArrayDeque is faster, unsynchronized, and officially recommended by the JDK.',
            accent: 'primary',
          },
          {
            id: 'lrh-sentinel',
            startLine: 15,
            endLine: 17,
            title: 'Virtual Zero-Height Sentinel Eliminates Duplicate Drain Code',
            explanation:
              'Extending the loop to i == n with currHeight = 0 guarantees every surviving bar on the stack is strictly taller than 0 (or yields area 0), flushing the entire stack inside the exact same while-loop without duplicating width logic after the loop.',
            accent: 'amber',
          },
          {
            id: 'lrh-width',
            startLine: 19,
            endLine: 25,
            title: 'Exact Left & Right Boundary Width Formula',
            explanation:
              'When popping idx, i is the first bar strictly shorter on the right and leftBound = stack.peek() is the nearest bar shorter or equal on the left. Exclusive bounds (leftBound, i) contain exactly i - leftBound - 1 contiguous bars.',
            accent: 'emerald',
          },
        ],
      },
      complexity: {
        time: 'O(n)',
        space: 'O(n)',
        timeExplanation:
          'Even though there is a nested while-loop, each bar index 0..n-1 is pushed once and popped at most once, bounding total loop work strictly by 2n.',
        spaceExplanation:
          'In the worst case (strictly increasing histogram like [1, 2, 3, 4, 5]), all n indices sit on the stack simultaneously before the sentinel flush.',
      },
      edgeCases: [
        {
          title: 'Equal Adjacent Heights ([2, 2, 2, 2]) — Strict > vs. >=',
          scenario: 'What if multiple bars share the same height and we only pop on heights[top] > currHeight?',
          handling:
            'Using strict > leaves equal-height bars on the stack. While the rightmost equal bar temporarily computes a narrower width when popped, the leftmost equal bar beneath it eventually pops with the FULL span across all equal bars, so maxArea is 100% exact.',
        },
        {
          title: 'Strictly Increasing Bars ([1, 2, 3, 4, 5])',
          scenario: 'No bar triggers a pop during indices 0..n-1.',
          handling:
            'The virtual sentinel at i == n (currHeight = 0) guarantees every bar is popped and evaluated cleanly (yielding 3 × 3 = 9).',
        },
        {
          title: '2D Matrix Follow-Up: Maximal Rectangle (LC #85)',
          scenario: 'Interviewers frequently escalate LC #84 to finding the largest all-1s rectangle inside an R × C binary matrix.',
          handling:
            'Maintain a rolling int[C] heights array: for each row, set heights[c] = matrix[r][c] == "1" ? heights[c] + 1 : 0, and invoke largestRectangleArea(heights) per row for O(R × C) total time!',
        },
      ],
    },

    /* ================================================================
     * DSA 2: DAILY TEMPERATURES
     * ================================================================ */
    {
      id: 'day2-daily-temperatures',
      dayNumber: 2,
      kind: 'dsa',
      title: 'Daily Temperatures',
      subtitle: 'Monotonic decreasing stack resolving Next Greater Element distances in one pass',
      difficulty: 'Medium',
      patterns: ['Monotonic Stack', 'Next Greater Element', 'Deferred Resolution'],
      estimatedMinutes: 12,
      leetcodeRef: 'LC #739',
      problemStatement:
        'Given an array of integers temperatures representing daily temperatures, return an array answer such that answer[i] is the number of days you have to wait after day i to get a strictly warmer temperature. If there is no future warmer day, set answer[i] = 0.',
      exampleSummary: {
        input: 'temperatures = [73, 74, 75, 71, 69, 72, 76, 73]',
        output: '[1, 1, 4, 2, 1, 1, 0, 0]',
        explanation:
          'Day 2 (75°) waits 4 days until Day 6 (76°); Day 3 (71°) and Day 4 (69°) are both resolved simultaneously when Day 5 (72°) arrives.',
      },
      patternRecognition: {
        interviewCue:
          'Whenever a problem asks for the "next greater / next warmer / next taller element to the right" (or its distance), store unresolved indices on a Monotonic Decreasing Stack.',
        signals: [
          'Keywords: "next warmer", "next greater element", "first day strictly higher"',
          'Cooler days accumulate unresolved while waiting for a warm spike that resolves many past days at once',
          'Store INDICES (not raw temperatures) on the stack so index subtraction (currIdx - prevIdx) yields wait days directly',
        ],
        mentalModel:
          'Treat the stack as a waiting room of unresolved days sorted in descending temperature order from bottom to top. When a warmer day arrives, evict every cooler day waiting at the top and record (i - poppedDay) as its exact answer.',
      },
      intuitionComparison: {
        bruteForce: {
          approach:
            'For each day i, scan forward j = i + 1 .. n - 1 until temperatures[j] > temperatures[i] and record j - i.',
          timeComplexity: 'O(n²)',
          spaceComplexity: 'O(1) auxiliary',
          bottleneck:
            'On a long cold spell (decreasing sequence), every single day linearly scans the exact same cold valley again.',
        },
        optimal: {
          approach:
            'Maintain a monotonic decreasing stack of unresolved day indices. For each day i, pop all indices prev where temps[i] > temps[prev] and write answer[prev] = i - prev, then push i.',
          timeComplexity: 'O(n)',
          spaceComplexity: 'O(n)',
          keyInvariant:
            'Temperatures of indices remaining on the stack are strictly non-increasing from bottom to top, meaning none of them has encountered a strictly warmer day yet.',
        },
      },
      visualizer: {
        kind: 'dp-1d-stack-heap',
        title: 'Monotonic Decreasing Stack Dry Run',
        inputSummary: 'temperatures = [73, 74, 75, 71, 69, 72, 76, 73]',
        steps: [
          {
            caption:
              'Day 0 (73°): Stack is empty, so push index 0 onto the waiting-room stack. answer[] starts all zeros.',
            recurrence: 'while (!stack.isEmpty() && T[i] > T[stack.top]) answer[pop] = i - pop',
            concreteFormula: 'i = 0 (73°) → stack empty → push idx 0',
            inputItems: {
              label: 'Temperatures (°F)',
              values: [73, 74, 75, 71, 69, 72, 76, 73],
              activeIndex: 0,
              processedUntil: 0,
            },
            primaryArray: {
              label: 'answer[] — Days Until Warmer Temp',
              values: [0, 0, 0, 0, 0, 0, 0, 0],
              activeIndex: 0,
              pointers: [{ label: 'i', index: 0, tone: 'primary' }],
            },
            secondaryContainer: {
              kind: 'stack',
              title: 'Monotonic Decreasing Stack (bottom → top)',
              items: [{ value: 'idx 0', meta: '73°', highlight: true }],
            },
            variables: [
              { name: 'day i', value: '0' },
              { name: 'temp', value: '73°' },
              { name: 'pops', value: '0' },
            ],
          },
          {
            caption:
              'Day 1 (74°): 74° > top 73° (idx 0)! Pop idx 0 and set answer[0] = 1 - 0 = 1. Push idx 1 (74°).',
            recurrence: 'T[1] > T[0] → resolve idx 0 immediately',
            concreteFormula: '74° > 73° → pop 0, answer[0] = 1 - 0 = 1; push 1',
            inputItems: {
              label: 'Temperatures (°F)',
              values: [73, 74, 75, 71, 69, 72, 76, 73],
              activeIndex: 1,
              processedUntil: 1,
            },
            primaryArray: {
              label: 'answer[] — Days Until Warmer Temp',
              values: [1, 0, 0, 0, 0, 0, 0, 0],
              activeIndex: 0,
              pointers: [
                { label: 'resolved', index: 0, tone: 'emerald' },
                { label: 'i', index: 1, tone: 'primary' },
              ],
            },
            secondaryContainer: {
              kind: 'stack',
              title: 'Monotonic Decreasing Stack (bottom → top)',
              items: [{ value: 'idx 1', meta: '74°', highlight: true }],
            },
            variables: [
              { name: 'day i', value: '1 (74°)' },
              { name: 'resolved', value: 'answer[0] = 1', tone: 'emerald' },
            ],
          },
          {
            caption:
              'Day 2 (75°): 75° > top 74° (idx 1)! Pop idx 1 and set answer[1] = 2 - 1 = 1. Push idx 2 (75°).',
            recurrence: 'T[2] > T[1] → resolve idx 1',
            concreteFormula: '75° > 74° → pop 1, answer[1] = 2 - 1 = 1; push 2',
            inputItems: {
              label: 'Temperatures (°F)',
              values: [73, 74, 75, 71, 69, 72, 76, 73],
              activeIndex: 2,
              processedUntil: 2,
            },
            primaryArray: {
              label: 'answer[] — Days Until Warmer Temp',
              values: [1, 1, 0, 0, 0, 0, 0, 0],
              activeIndex: 1,
              pointers: [
                { label: 'resolved', index: 1, tone: 'emerald' },
                { label: 'i', index: 2, tone: 'primary' },
              ],
            },
            secondaryContainer: {
              kind: 'stack',
              title: 'Monotonic Decreasing Stack (bottom → top)',
              items: [{ value: 'idx 2', meta: '75°', highlight: true }],
            },
            variables: [
              { name: 'day i', value: '2 (75°)' },
              { name: 'resolved', value: 'answer[1] = 1', tone: 'emerald' },
            ],
          },
          {
            caption:
              'Day 3 (71°): 71° ≤ top 75° (idx 2). Temperature dropped, so Day 2 cannot be resolved yet. Push idx 3 (71°) atop idx 2.',
            recurrence: 'T[i] ≤ T[stack.top] → push without popping',
            concreteFormula: '71° ≤ 75° → push idx 3 (stack: 75° ≥ 71°)',
            inputItems: {
              label: 'Temperatures (°F)',
              values: [73, 74, 75, 71, 69, 72, 76, 73],
              activeIndex: 3,
              processedUntil: 3,
            },
            primaryArray: {
              label: 'answer[] — Days Until Warmer Temp',
              values: [1, 1, 0, 0, 0, 0, 0, 0],
              activeIndex: 3,
              dependencyIndices: [{ index: 2, label: 'wait' }],
              pointers: [{ label: 'i', index: 3, tone: 'primary' }],
            },
            secondaryContainer: {
              kind: 'stack',
              title: 'Monotonic Decreasing Stack (bottom → top)',
              items: [
                { value: 'idx 2', meta: '75°' },
                { value: 'idx 3', meta: '71°', highlight: true },
              ],
            },
            variables: [
              { name: 'day i', value: '3 (71°)' },
              { name: 'stackSize', value: '2' },
            ],
          },
          {
            caption:
              'Day 4 (69°): 69° ≤ top 71° (idx 3). Cold snap deepens — push idx 4 (69°). Three unresolved days now sit in strictly decreasing order: 75° → 71° → 69°.',
            recurrence: 'T[4] ≤ T[3] → push idx 4',
            concreteFormula: '69° ≤ 71° → push idx 4 (stack: 75° ≥ 71° ≥ 69°)',
            inputItems: {
              label: 'Temperatures (°F)',
              values: [73, 74, 75, 71, 69, 72, 76, 73],
              activeIndex: 4,
              processedUntil: 4,
            },
            primaryArray: {
              label: 'answer[] — Days Until Warmer Temp',
              values: [1, 1, 0, 0, 0, 0, 0, 0],
              activeIndex: 4,
              dependencyIndices: [
                { index: 2, label: 'wait' },
                { index: 3, label: 'wait' },
              ],
              pointers: [{ label: 'i', index: 4, tone: 'primary' }],
            },
            secondaryContainer: {
              kind: 'stack',
              title: 'Monotonic Decreasing Stack (bottom → top)',
              items: [
                { value: 'idx 2', meta: '75°' },
                { value: 'idx 3', meta: '71°' },
                { value: 'idx 4', meta: '69°', highlight: true },
              ],
            },
            variables: [
              { name: 'day i', value: '4 (69°)' },
              { name: 'stackSize', value: '3' },
            ],
          },
          {
            caption:
              'Day 5 (72°) triggers a CHAIN POP! 72° beats 69° (pop idx 4 → answer[4] = 5-4 = 1) AND beats 71° (pop idx 3 → answer[3] = 5-3 = 2)! Stops at 75° (idx 2) since 72° ≤ 75°. Push idx 5 (72°).',
            recurrence: 'Pop all cooler days < 72°, stop at first day ≥ 72°',
            concreteFormula: 'pop 4 (ans=1), pop 3 (ans=2); stop at 75° → push 5',
            inputItems: {
              label: 'Temperatures (°F)',
              values: [73, 74, 75, 71, 69, 72, 76, 73],
              activeIndex: 5,
              processedUntil: 5,
            },
            primaryArray: {
              label: 'answer[] — Days Until Warmer Temp',
              values: [1, 1, 0, 2, 1, 0, 0, 0],
              activeIndex: 5,
              dependencyIndices: [
                { index: 3, label: '+2d' },
                { index: 4, label: '+1d' },
              ],
              pointers: [{ label: 'i', index: 5, tone: 'emerald' }],
            },
            secondaryContainer: {
              kind: 'stack',
              title: 'Monotonic Decreasing Stack (bottom → top)',
              items: [
                { value: 'idx 2', meta: '75°' },
                { value: 'idx 5', meta: '72°', highlight: true },
              ],
            },
            variables: [
              { name: 'day i', value: '5 (72°)' },
              { name: 'resolved', value: 'idx 4→1, idx 3→2', tone: 'emerald' },
            ],
          },
          {
            caption:
              'Day 6 (76°) sweeps the entire stack! 76° > 72° (pop idx 5 → answer[5] = 6-5 = 1) AND 76° > 75° (pop idx 2 → answer[2] = 6-2 = 4)! Stack empties; push idx 6 (76°).',
            recurrence: 'Warm peak clears every remaining cooler day',
            concreteFormula: 'pop 5 (ans=1), pop 2 (ans=4) → stack empty → push 6',
            inputItems: {
              label: 'Temperatures (°F)',
              values: [73, 74, 75, 71, 69, 72, 76, 73],
              activeIndex: 6,
              processedUntil: 6,
            },
            primaryArray: {
              label: 'answer[] — Days Until Warmer Temp',
              values: [1, 1, 4, 2, 1, 1, 0, 0],
              activeIndex: 6,
              dependencyIndices: [
                { index: 2, label: '+4d' },
                { index: 5, label: '+1d' },
              ],
              pointers: [{ label: 'i', index: 6, tone: 'emerald' }],
            },
            secondaryContainer: {
              kind: 'stack',
              title: 'Monotonic Decreasing Stack (bottom → top)',
              items: [{ value: 'idx 6', meta: '76°', highlight: true }],
            },
            variables: [
              { name: 'day i', value: '6 (76°)' },
              { name: 'resolved', value: 'idx 5→1, idx 2→4', tone: 'emerald' },
            ],
          },
          {
            caption:
              'Day 7 (73°): 73° ≤ 76° → push idx 7. Input ends! Any index still sitting on the stack ({6, 7}) has no warmer future day and naturally retains Java’s default 0. Final answer = [1, 1, 4, 2, 1, 1, 0, 0].',
            recurrence: 'Unpopped stack entries keep default answer[idx] = 0',
            concreteFormula: 'Done → answer = [1, 1, 4, 2, 1, 1, 0, 0]',
            inputItems: {
              label: 'Temperatures (°F)',
              values: [73, 74, 75, 71, 69, 72, 76, 73],
              activeIndex: 7,
              processedUntil: 8,
            },
            primaryArray: {
              label: 'answer[] — Days Until Warmer Temp',
              values: [1, 1, 4, 2, 1, 1, 0, 0],
              activeIndex: 7,
              pointers: [{ label: 'done', index: 7, tone: 'emerald' }],
            },
            secondaryContainer: {
              kind: 'stack',
              title: 'Unresolved Tail (answer = 0)',
              items: [
                { value: 'idx 6', meta: '76° → 0' },
                { value: 'idx 7', meta: '73° → 0' },
              ],
            },
            variables: [
              { name: 'totalPushes', value: '8' },
              { name: 'totalPops', value: '6' },
              { name: 'result', value: '[1,1,4,2,1,1,0,0]', tone: 'emerald' },
            ],
          },
        ],
      },
      javaSolution: {
        filename: 'DailyTemperatures.java',
        code: `public class DailyTemperatures {
    public int[] dailyTemperatures(int[] temperatures) {
        if (temperatures == null || temperatures.length == 0) {
            return new int[0];
        }

        int n = temperatures.length;
        int[] answer = new int[n];
        // Primitive array-backed stack avoids Integer boxing overhead on 10^5 inputs
        int[] stack = new int[n];
        int top = -1;

        for (int i = 0; i < n; i++) {
            int todayTemp = temperatures[i];

            // Pop all unresolved prior days strictly cooler than today
            while (top >= 0 && temperatures[stack[top]] < todayTemp) {
                int prevDay = stack[top--];
                answer[prevDay] = i - prevDay;
            }

            stack[++top] = i;
        }

        return answer;
    }
}`,
        callouts: [
          {
            id: 'dt-prim-stack',
            startLine: 9,
            endLine: 11,
            title: 'Zero-Boxing Primitive Stack (Senior Java Polish)',
            explanation:
              'ArrayDeque<Integer> is clean and idiomatic, while a fixed int[n] stack with a top pointer eliminates 100,000 Integer autoboxing allocations and cuts latency ~3× in tight JVM benchmarks.',
            accent: 'primary',
          },
          {
            id: 'dt-strict-less',
            startLine: 16,
            endLine: 20,
            title: 'Strict Inequality (<) Required for "Warmer"',
            explanation:
              'An equal temperature does NOT qualify as warmer (e.g., [70, 70, 75] → [2, 1, 0]). Using strict < leaves equal temperatures stacked until a strictly higher temperature resolves all of them together.',
            accent: 'amber',
          },
          {
            id: 'dt-zero-init',
            startLine: 8,
            endLine: 8,
            title: 'No Post-Loop Cleanup Needed',
            explanation:
              'Java zero-initializes int[] arrays automatically, so any indices still waiting in stack[0..top] when the loop finishes already have answer[idx] = 0.',
            accent: 'emerald',
          },
        ],
      },
      complexity: {
        time: 'O(n)',
        space: 'O(n)',
        timeExplanation:
          'Each day index is pushed onto the stack once and popped at most once, giving at most 2n operations across the entire scan.',
        spaceExplanation:
          'The auxiliary stack holds at most n indices (worst case: monotonically non-increasing temperatures).',
      },
      edgeCases: [
        {
          title: 'O(1) Auxiliary Space Follow-Up (Backward Jump Pointers)',
          scenario: 'Staff-level follow-up: "Can you eliminate the stack completely and use O(1) extra space beyond answer[]?"',
          handling:
            'Scan right-to-left tracking hottestSoFar. If T[i] >= hottestSoFar, answer[i] = 0. Otherwise start j = i + 1 and jump j += answer[j] while T[j] <= T[i] — skipping entire cold valleys using already-computed answer[] jumps in O(n) total time!',
        },
        {
          title: 'Identical Consecutive Temperatures ([72, 72, 72, 75])',
          scenario: 'Duplicates must wait for strictly warmer 75°, not resolve each other.',
          handling: 'Strict < keeps all three 72° indices stacked until 75° pops them to produce [3, 2, 1, 0].',
        },
        {
          title: 'Circular Array Variant (Next Greater Element II, LC #503)',
          scenario: 'What if the week wraps around cyclically?',
          handling: 'Iterate i from 0 to 2n - 1 using idx = i % n, pushing indices onto the stack ONLY during the first pass (i < n) while popping across both passes.',
        },
      ],
    },

    /* ================================================================
     * DSA 3: MERGE K SORTED LISTS
     * ================================================================ */
    {
      id: 'day2-merge-k-sorted-lists',
      dayNumber: 2,
      kind: 'dsa',
      title: 'Merge K Sorted Lists',
      subtitle: 'K-way Min-Heap frontier merging N total nodes in O(N log k) time and O(k) space',
      difficulty: 'Hard',
      patterns: ['K-Way Merge', 'Min-Heap', 'Sentinel Head Rewiring'],
      estimatedMinutes: 15,
      leetcodeRef: 'LC #23',
      problemStatement:
        'You are given an array of k linked lists, each sorted in ascending order. Merge all k linked lists into one sorted linked list and return its head.',
      exampleSummary: {
        input: 'lists = [[1, 4, 5], [1, 3, 4], [2, 6]]',
        output: '[1, 1, 2, 3, 4, 4, 5, 6]',
        explanation:
          'A Min-Heap of size at most k = 3 holds only the current unmerged head of each list, extracting the global minimum in O(log k) at every step.',
      },
      patternRecognition: {
        interviewCue:
          'Whenever you must merge k sorted streams, lists, disk SSTables, or iterator cursors into a single sorted output, maintain a Min-Heap of size ≤ k containing exactly ONE active frontier element per stream.',
        signals: [
          'Keywords: "k sorted lists / arrays / streams", "smallest range covering k lists"',
          'Comparing all k heads linearly per output element costs O(N · k); a Min-Heap shrinks the k-way comparison to O(log k)',
          'Core building block behind external merge sort and LSM-Tree SSTable compaction (see Day 2 HLD!)',
        ],
        mentalModel:
          'Imagine k conveyor belts arriving in sorted order. You only ever need to look at the front package of each belt — put those k front packages in a Min-Heap, pull the smallest onto the output belt, and advance ONLY the belt it came from.',
      },
      intuitionComparison: {
        bruteForce: {
          approach:
            'Merge lists one by one sequentially (merge L0+L1, then result+L2, ..., result+Lk-1), or linearly scan all k heads to find each minimum.',
          timeComplexity: 'O(N · k)',
          spaceComplexity: 'O(1)',
          bottleneck:
            'Nodes from L0 get re-traversed k - 1 times during sequential merging, turning k = 10,000 short lists quadratic.',
        },
        optimal: {
          approach:
            'Seed a Min-Heap (PriorityQueue) with the non-null head of every list. Repeatedly poll the minimum node, attach it to tail.next, and offer minNode.next if non-null.',
          timeComplexity: 'O(N log k)',
          spaceComplexity: 'O(k)',
          keyInvariant:
            'At every moment, the heap contains at most one node per list — specifically the smallest unmerged node of each non-empty list — so heap.peek() is guaranteed to be the global next smallest node.',
        },
      },
      visualizer: {
        kind: 'dp-1d-stack-heap',
        title: 'K-Way Min-Heap Frontier Merge Dry Run',
        inputSummary: 'lists = [L0: 1→4→5, L1: 1→3→4, L2: 2→6]  (k = 3, N = 8)',
        steps: [
          {
            caption:
              'Seed phase: insert the head node of every non-empty list into the Min-Heap (size = k = 3). Only 3 nodes sit in memory regardless of how long the lists are.',
            recurrence: 'Init: offer head of each non-null list into Min-Heap (size ≤ k)',
            concreteFormula: 'Offer 1(L0), 1(L1), 2(L2) → Heap root = 1(L0)',
            inputItems: {
              label: 'Remaining List Cursors',
              values: ['L0: 1→4→5', 'L1: 1→3→4', 'L2: 2→6'],
            },
            primaryArray: {
              label: 'Merged Output List (N = 8)',
              values: ['·', '·', '·', '·', '·', '·', '·', '·'],
            },
            secondaryContainer: {
              kind: 'heap',
              title: 'Min-Heap Frontier (size = 3)',
              items: [
                { value: '1', meta: 'L0 (min)', highlight: true },
                { value: '1', meta: 'L1' },
                { value: '2', meta: 'L2' },
              ],
            },
            variables: [
              { name: 'heapSize', value: '3' },
              { name: 'merged', value: '0 / 8' },
            ],
          },
          {
            caption:
              'Poll min = 1 (L0) and wire onto output[0]. Advance L0 cursor to its next node 4 and offer 4 (L0) into the Min-Heap.',
            recurrence: 'node = heap.poll(); tail.next = node; if (node.next != null) heap.offer(node.next)',
            concreteFormula: 'poll 1(L0) → append to out[0]; offer next 4(L0)',
            inputItems: {
              label: 'Remaining List Cursors',
              values: ['L0: 4→5', 'L1: 1→3→4', 'L2: 2→6'],
              activeIndex: 0,
            },
            primaryArray: {
              label: 'Merged Output List (N = 8)',
              values: [1, '·', '·', '·', '·', '·', '·', '·'],
              activeIndex: 0,
              pointers: [{ label: 'tail', index: 0, tone: 'primary' }],
            },
            secondaryContainer: {
              kind: 'heap',
              title: 'Min-Heap Frontier (size = 3)',
              items: [
                { value: '1', meta: 'L1 (min)', highlight: true },
                { value: '2', meta: 'L2' },
                { value: '4', meta: 'L0 (new)' },
              ],
            },
            variables: [
              { name: 'polled', value: '1 (L0)', tone: 'primary' },
              { name: 'offered', value: '4 (L0)' },
              { name: 'merged', value: '1 / 8' },
            ],
          },
          {
            caption:
              'Poll min = 1 (L1) → output[1]. Advance L1 to 3 and offer 3 (L1). Notice heap size remains bounded at k = 3.',
            recurrence: 'Poll global min, replenish from the same list',
            concreteFormula: 'poll 1(L1) → append to out[1]; offer next 3(L1)',
            inputItems: {
              label: 'Remaining List Cursors',
              values: ['L0: 4→5', 'L1: 3→4', 'L2: 2→6'],
              activeIndex: 1,
            },
            primaryArray: {
              label: 'Merged Output List (N = 8)',
              values: [1, 1, '·', '·', '·', '·', '·', '·'],
              activeIndex: 1,
              pointers: [{ label: 'tail', index: 1, tone: 'primary' }],
            },
            secondaryContainer: {
              kind: 'heap',
              title: 'Min-Heap Frontier (size = 3)',
              items: [
                { value: '2', meta: 'L2 (min)', highlight: true },
                { value: '3', meta: 'L1 (new)' },
                { value: '4', meta: 'L0' },
              ],
            },
            variables: [
              { name: 'polled', value: '1 (L1)', tone: 'primary' },
              { name: 'offered', value: '3 (L1)' },
              { name: 'merged', value: '2 / 8' },
            ],
          },
          {
            caption:
              'Poll min = 2 (L2) → output[2]. Advance L2 to 6 and offer 6 (L2). Now 3 (L1) rises to the root of the Min-Heap.',
            recurrence: 'Poll global min, replenish from L2',
            concreteFormula: 'poll 2(L2) → append to out[2]; offer next 6(L2)',
            inputItems: {
              label: 'Remaining List Cursors',
              values: ['L0: 4→5', 'L1: 3→4', 'L2: 6'],
              activeIndex: 2,
            },
            primaryArray: {
              label: 'Merged Output List (N = 8)',
              values: [1, 1, 2, '·', '·', '·', '·', '·'],
              activeIndex: 2,
              pointers: [{ label: 'tail', index: 2, tone: 'primary' }],
            },
            secondaryContainer: {
              kind: 'heap',
              title: 'Min-Heap Frontier (size = 3)',
              items: [
                { value: '3', meta: 'L1 (min)', highlight: true },
                { value: '4', meta: 'L0' },
                { value: '6', meta: 'L2 (new)' },
              ],
            },
            variables: [
              { name: 'polled', value: '2 (L2)', tone: 'primary' },
              { name: 'offered', value: '6 (L2)' },
              { name: 'merged', value: '3 / 8' },
            ],
          },
          {
            caption:
              'Poll min = 3 (L1) → output[3]. Advance L1 to its final element 4 and offer 4 (L1). Both L0 and L1 now tie at 4.',
            recurrence: 'Poll global min, replenish from L1',
            concreteFormula: 'poll 3(L1) → append to out[3]; offer next 4(L1)',
            inputItems: {
              label: 'Remaining List Cursors',
              values: ['L0: 4→5', 'L1: 4', 'L2: 6'],
              activeIndex: 1,
            },
            primaryArray: {
              label: 'Merged Output List (N = 8)',
              values: [1, 1, 2, 3, '·', '·', '·', '·'],
              activeIndex: 3,
              pointers: [{ label: 'tail', index: 3, tone: 'primary' }],
            },
            secondaryContainer: {
              kind: 'heap',
              title: 'Min-Heap Frontier (size = 3)',
              items: [
                { value: '4', meta: 'L0 (min)', highlight: true },
                { value: '4', meta: 'L1 (new)' },
                { value: '6', meta: 'L2' },
              ],
            },
            variables: [
              { name: 'polled', value: '3 (L1)', tone: 'primary' },
              { name: 'offered', value: '4 (L1)' },
              { name: 'merged', value: '4 / 8' },
            ],
          },
          {
            caption:
              'Poll min = 4 (L0) → output[4]. Advance L0 to its final node 5 and offer 5 (L0).',
            recurrence: 'Poll global min, replenish from L0',
            concreteFormula: 'poll 4(L0) → append to out[4]; offer next 5(L0)',
            inputItems: {
              label: 'Remaining List Cursors',
              values: ['L0: 5', 'L1: 4', 'L2: 6'],
              activeIndex: 0,
            },
            primaryArray: {
              label: 'Merged Output List (N = 8)',
              values: [1, 1, 2, 3, 4, '·', '·', '·'],
              activeIndex: 4,
              pointers: [{ label: 'tail', index: 4, tone: 'primary' }],
            },
            secondaryContainer: {
              kind: 'heap',
              title: 'Min-Heap Frontier (size = 3)',
              items: [
                { value: '4', meta: 'L1 (min)', highlight: true },
                { value: '5', meta: 'L0 (new)' },
                { value: '6', meta: 'L2' },
              ],
            },
            variables: [
              { name: 'polled', value: '4 (L0)', tone: 'primary' },
              { name: 'offered', value: '5 (L0)' },
              { name: 'merged', value: '5 / 8' },
            ],
          },
          {
            caption:
              'Poll min = 4 (L1) → output[5]. L1.next is null (list L1 exhausted!), so nothing is re-inserted and the heap shrinks to size 2.',
            recurrence: 'If node.next == null, stream retires and heap shrinks',
            concreteFormula: 'poll 4(L1) → out[5]; L1 exhausted → heapSize = 2',
            inputItems: {
              label: 'Remaining List Cursors',
              values: ['L0: 5', 'L1: ∅', 'L2: 6'],
              activeIndex: 1,
            },
            primaryArray: {
              label: 'Merged Output List (N = 8)',
              values: [1, 1, 2, 3, 4, 4, '·', '·'],
              activeIndex: 5,
              pointers: [{ label: 'tail', index: 5, tone: 'amber' }],
            },
            secondaryContainer: {
              kind: 'heap',
              title: 'Min-Heap Frontier (size = 2)',
              items: [
                { value: '5', meta: 'L0 (min)', highlight: true },
                { value: '6', meta: 'L2' },
              ],
            },
            variables: [
              { name: 'polled', value: '4 (L1)' },
              { name: 'heapSize', value: '2', tone: 'amber' },
              { name: 'merged', value: '6 / 8' },
            ],
          },
          {
            caption:
              'Poll min = 5 (L0) → output[6]. L0 is now exhausted too, shrinking the heap to size 1 ([6 (L2)]).',
            recurrence: 'L0 exhausted → heap shrinks to 1 remaining stream',
            concreteFormula: 'poll 5(L0) → out[6]; L0 exhausted → heapSize = 1',
            inputItems: {
              label: 'Remaining List Cursors',
              values: ['L0: ∅', 'L1: ∅', 'L2: 6'],
              activeIndex: 0,
            },
            primaryArray: {
              label: 'Merged Output List (N = 8)',
              values: [1, 1, 2, 3, 4, 4, 5, '·'],
              activeIndex: 6,
              pointers: [{ label: 'tail', index: 6, tone: 'amber' }],
            },
            secondaryContainer: {
              kind: 'heap',
              title: 'Min-Heap Frontier (size = 1)',
              items: [{ value: '6', meta: 'L2 (min)', highlight: true }],
            },
            variables: [
              { name: 'polled', value: '5 (L0)' },
              { name: 'heapSize', value: '1', tone: 'amber' },
              { name: 'merged', value: '7 / 8' },
            ],
          },
          {
            caption:
              'Poll final node 6 (L2) → output[7]. Heap is now empty! Return dummy.next → [1, 1, 2, 3, 4, 4, 5, 6] in O(N log k) with zero new ListNode allocations.',
            recurrence: 'Heap empty → return dummy.next',
            concreteFormula: 'poll 6(L2) → out[7]; Complete: [1, 1, 2, 3, 4, 4, 5, 6]',
            inputItems: {
              label: 'Remaining List Cursors',
              values: ['L0: ∅', 'L1: ∅', 'L2: ∅'],
              processedUntil: 3,
            },
            primaryArray: {
              label: 'Merged Output List (N = 8)',
              values: [1, 1, 2, 3, 4, 4, 5, 6],
              activeIndex: 7,
              pointers: [{ label: 'done', index: 7, tone: 'emerald' }],
            },
            secondaryContainer: {
              kind: 'heap',
              title: 'Min-Heap Frontier (Drained)',
              items: [],
            },
            variables: [
              { name: 'heapSize', value: '0' },
              { name: 'merged', value: '8 / 8', tone: 'emerald' },
            ],
          },
        ],
      },
      javaSolution: {
        filename: 'MergeKSortedLists.java',
        code: `import java.util.Comparator;
import java.util.PriorityQueue;

public class MergeKSortedLists {
    public static class ListNode {
        int val;
        ListNode next;
        ListNode(int val) { this.val = val; }
    }

    public ListNode mergeKLists(ListNode[] lists) {
        if (lists == null || lists.length == 0) {
            return null;
        }

        // Safe Comparator.comparingInt avoids subtraction overflow on Integer.MIN_VALUE
        PriorityQueue<ListNode> minHeap = new PriorityQueue<>(
            lists.length,
            Comparator.comparingInt(node -> node.val)
        );

        for (ListNode head : lists) {
            if (head != null) {
                minHeap.offer(head);
            }
        }

        ListNode dummy = new ListNode(0);
        ListNode tail = dummy;

        while (!minHeap.isEmpty()) {
            ListNode smallest = minHeap.poll();
            tail.next = smallest;
            tail = smallest;

            if (smallest.next != null) {
                minHeap.offer(smallest.next);
            }
        }

        tail.next = null;
        return dummy.next;
    }
}`,
        callouts: [
          {
            id: 'mk-comparator',
            startLine: 16,
            endLine: 20,
            title: 'Overflow-Safe Comparator & Initial Capacity',
            explanation:
              'Never write (a, b) -> a.val - b.val in Java — subtracting negative Integer.MIN_VALUE overflows and corrupts heap ordering! Comparator.comparingInt uses Integer.compare safely, and sizing PriorityQueue to lists.length avoids resize copies.',
            accent: 'amber',
          },
          {
            id: 'mk-null-filter',
            startLine: 22,
            endLine: 26,
            title: 'Guard Against Null Sub-Lists',
            explanation:
              'Java PriorityQueue forbids null elements and throws NullPointerException on offer(null). Filtering empty lists up front handles sparse inputs like [null, [], [5]] cleanly.',
            accent: 'primary',
          },
          {
            id: 'mk-rewire',
            startLine: 28,
            endLine: 42,
            title: 'In-Place Pointer Rewiring with Sentinel Dummy Head',
            explanation:
              'Using dummy avoids special-casing the first output node, reuses existing ListNode objects with zero GC churn, and explicitly terminates tail.next = null for defensive safety.',
            accent: 'emerald',
          },
        ],
      },
      complexity: {
        time: 'O(N log k)',
        space: 'O(k)',
        timeExplanation:
          'Every one of the N total nodes across all lists enters and exits the Min-Heap once, paying O(log k) per offer/poll where k is the number of lists.',
        spaceExplanation:
          'The PriorityQueue stores at most one frontier node per list (≤ k nodes), and pointer rewiring allocates zero extra ListNodes.',
      },
      edgeCases: [
        {
          title: 'Divide-and-Conquer Pairwise Merge (O(1) Space Alternative)',
          scenario: 'Interviewer asks: "Can we achieve O(N log k) time with O(1) extra space?"',
          handling:
            'Yes — bottom-up iterative pairwise merging (interval = 1, 2, 4, ...) merges adjacent list pairs in O(N) per round across ⌈log₂ k⌉ rounds using O(1) space! However, Min-Heap is superior for STREAMING/Iterator inputs (e.g., merging K sorted SSTable files from disk without loading full lists).',
        },
        {
          title: 'All Lists Empty or Null ([null, null])',
          scenario: 'lists.length > 0, but every entry is null.',
          handling: 'Heap stays empty, loop skips, and dummy.next cleanly returns null.',
        },
        {
          title: 'Single Remaining List Fast-Path',
          scenario: 'What if k = 2 and L0 has 1 node while L1 has 1,000,000 nodes?',
          handling:
            'Bonus optimization: when minHeap.size() == 1, you can attach minHeap.poll() directly to tail.next and break immediately, skipping 1,000,000 redundant heap operations!',
        },
      ],
    },

    /* ================================================================
     * DSA 4: FIND MEDIAN FROM DATA STREAM
     * ================================================================ */
    {
      id: 'day2-find-median-data-stream',
      dayNumber: 2,
      kind: 'dsa',
      title: 'Find Median from Data Stream',
      subtitle: 'Dual-heap (Max-Heap lower half + Min-Heap upper half) for O(log n) updates and O(1) medians',
      difficulty: 'Hard',
      patterns: ['Two Heaps', 'Streaming Order Statistics', 'Balance Invariant'],
      estimatedMinutes: 15,
      leetcodeRef: 'LC #295',
      problemStatement:
        'Design a MedianFinder data structure that supports adding integers from an unbounded data stream (addNum) and returning the exact median of all elements seen so far (findMedian) in constant time.',
      exampleSummary: {
        input: 'stream = [5, 2, 8, 3, 10, 4]',
        output: 'Running medians: [5.0, 3.5, 5.0, 4.0, 5.0, 4.5]',
        explanation:
          'Partitioning numbers into a Max-Heap lower half and Min-Heap upper half exposes the 1 or 2 middle elements at the heap roots in O(1).',
      },
      patternRecognition: {
        interviewCue:
          'We do NOT need the entire stream sorted — we only need fast access to the middle boundary! Whenever a streaming problem queries the median or a fixed percentile p, split the stream across two opposing heaps.',
        signals: [
          'Online / streaming insertions interleaved with frequent median queries',
          'Full re-sort on every insert costs O(n log n); insertion-sort into an ArrayList costs O(n) shifts',
          'Exposing max(lowerHalf) and min(upperHalf) via Max-Heap + Min-Heap gives O(log n) insert and O(1) query',
        ],
        mentalModel:
          'Maintain two invariants at all times:\n1) Order Invariant: every element in lower (Max-Heap) ≤ every element in upper (Min-Heap).\n2) Size Invariant: lower.size() == upper.size() OR lower.size() == upper.size() + 1.\nThen median is either lower.peek() (odd count) or (lower.peek() + upper.peek()) / 2.0 (even count).',
      },
      intuitionComparison: {
        bruteForce: {
          approach:
            'Store elements in a sorted ArrayList using binary search to find insertion position, then shift trailing elements right.',
          timeComplexity: 'O(n) per addNum, O(1) per findMedian',
          spaceComplexity: 'O(n)',
          bottleneck:
            'ArrayList shifting takes O(n) per arrival, degrading 10⁵ stream inserts to O(n²) = 10¹⁰ operations.',
        },
        optimal: {
          approach:
            'Maintain Max-Heap lower and Min-Heap upper. On addNum(x): push x into lower, move lower.poll() into upper (enforcing order), and if lower.size() < upper.size(), move upper.poll() back into lower (enforcing size balance).',
          timeComplexity: 'O(log n) per addNum, O(1) per findMedian',
          spaceComplexity: 'O(n)',
          keyInvariant:
            'The unconditional 3-step pass-through (lower → upper → rebalance) automatically satisfies BOTH the order and size invariants with zero fragile branch edge cases.',
        },
      },
      visualizer: {
        kind: 'dp-1d-stack-heap',
        title: 'Dual-Heap Rebalancing & Live Median Dry Run',
        inputSummary: 'stream = [5, 2, 8, 3, 10, 4]',
        steps: [
          {
            caption:
              'addNum(5): offer 5 → lower, pass max(5) → upper, then rebalance because lower(0) < upper(1) → move 5 back to lower. Odd count (1): median = lower.peek() = 5.0.',
            recurrence: 'lower.offer(x) → upper.offer(lower.poll()) → if |lower| < |upper| rebalance',
            concreteFormula: 'Stream [5] → lower=[5], upper=[] → median = 5.0',
            inputItems: {
              label: 'Incoming Data Stream',
              values: [5, 2, 8, 3, 10, 4],
              activeIndex: 0,
              processedUntil: 0,
            },
            primaryArray: {
              label: 'Lower Half — Max-Heap (root = largest of lower half)',
              indices: ['max'],
              values: [5],
              activeIndex: 0,
              pointers: [{ label: 'peek', index: 0, tone: 'emerald' }],
            },
            secondaryContainer: {
              kind: 'heap',
              title: 'Upper Half — Min-Heap (root = smallest of upper half)',
              items: [],
            },
            variables: [
              { name: 'size (L/U)', value: '1 / 0' },
              { name: 'median', value: '5.0', tone: 'emerald' },
            ],
          },
          {
            caption:
              'addNum(2): offer 2 → lower([5,2]), pass max(5) → upper([5]). Sizes are now equal (1 == 1) — no rebalance needed! Even count (2): median = (2 + 5) / 2.0 = 3.5.',
            recurrence: 'Pass-through pushes 5 across boundary so max(lower) ≤ min(upper)',
            concreteFormula: 'Stream [2, 5] → lower=[2], upper=[5] → median = (2+5)/2 = 3.5',
            inputItems: {
              label: 'Incoming Data Stream',
              values: [5, 2, 8, 3, 10, 4],
              activeIndex: 1,
              processedUntil: 1,
            },
            primaryArray: {
              label: 'Lower Half — Max-Heap (root = largest of lower half)',
              indices: ['max'],
              values: [2],
              activeIndex: 0,
              pointers: [{ label: 'peek=2', index: 0, tone: 'primary' }],
            },
            secondaryContainer: {
              kind: 'heap',
              title: 'Upper Half — Min-Heap (root = smallest of upper half)',
              items: [{ value: 5, meta: 'min (peek)', highlight: true }],
            },
            variables: [
              { name: 'size (L/U)', value: '1 / 1' },
              { name: 'median', value: '3.5', tone: 'emerald' },
            ],
          },
          {
            caption:
              'addNum(8): offer 8 → lower([8,2]), pass max(8) → upper([5,8]). Now lower(1) < upper(2) → REBALANCE! Pop upper’s min(5) into lower([5,2]). Odd count (3): median = lower.peek() = 5.0.',
            recurrence: '|lower| < |upper| → pull upper.poll() into lower to restore balance',
            concreteFormula: 'Stream [2, 5, 8] → lower=[5,2], upper=[8] → median = 5.0',
            inputItems: {
              label: 'Incoming Data Stream',
              values: [5, 2, 8, 3, 10, 4],
              activeIndex: 2,
              processedUntil: 2,
            },
            primaryArray: {
              label: 'Lower Half — Max-Heap (root = largest of lower half)',
              indices: ['max', 'c1'],
              values: [5, 2],
              activeIndex: 0,
              pointers: [{ label: 'rebalanced', index: 0, tone: 'amber' }],
            },
            secondaryContainer: {
              kind: 'heap',
              title: 'Upper Half — Min-Heap (root = smallest of upper half)',
              items: [{ value: 8, meta: 'min' }],
            },
            variables: [
              { name: 'size (L/U)', value: '2 / 1' },
              { name: 'rebalance', value: '5: upper → lower', tone: 'amber' },
              { name: 'median', value: '5.0', tone: 'emerald' },
            ],
          },
          {
            caption:
              'addNum(3): offer 3 → lower([5,3,2]), pass max(5) → upper([5,8]). Sizes match (2 == 2)! Even count (4): median = (lower.peek(3) + upper.peek(5)) / 2.0 = 4.0.',
            recurrence: 'Even size → average both heap roots in O(1)',
            concreteFormula: 'Stream [2, 3, 5, 8] → lower=[3,2], upper=[5,8] → median = (3+5)/2 = 4.0',
            inputItems: {
              label: 'Incoming Data Stream',
              values: [5, 2, 8, 3, 10, 4],
              activeIndex: 3,
              processedUntil: 3,
            },
            primaryArray: {
              label: 'Lower Half — Max-Heap (root = largest of lower half)',
              indices: ['max', 'c1'],
              values: [3, 2],
              activeIndex: 0,
              pointers: [{ label: 'peek=3', index: 0, tone: 'primary' }],
            },
            secondaryContainer: {
              kind: 'heap',
              title: 'Upper Half — Min-Heap (root = smallest of upper half)',
              items: [
                { value: 5, meta: 'min (peek)', highlight: true },
                { value: 8 },
              ],
            },
            variables: [
              { name: 'size (L/U)', value: '2 / 2' },
              { name: 'median', value: '4.0', tone: 'emerald' },
            ],
          },
          {
            caption:
              'addNum(10): offer 10 → lower([10,3,2]), pass max(10) → upper([5,8,10]). lower(2) < upper(3) → REBALANCE! Move upper’s min(5) into lower([5,3,2]). Odd count (5): median = 5.0.',
            recurrence: 'Rebalance shifts 5 back to lower → |lower| = |upper| + 1',
            concreteFormula: 'Stream [2, 3, 5, 8, 10] → lower=[5,3,2], upper=[8,10] → median = 5.0',
            inputItems: {
              label: 'Incoming Data Stream',
              values: [5, 2, 8, 3, 10, 4],
              activeIndex: 4,
              processedUntil: 4,
            },
            primaryArray: {
              label: 'Lower Half — Max-Heap (root = largest of lower half)',
              indices: ['max', 'c1', 'c2'],
              values: [5, 3, 2],
              activeIndex: 0,
              pointers: [{ label: 'rebalanced', index: 0, tone: 'amber' }],
            },
            secondaryContainer: {
              kind: 'heap',
              title: 'Upper Half — Min-Heap (root = smallest of upper half)',
              items: [
                { value: 8, meta: 'min' },
                { value: 10 },
              ],
            },
            variables: [
              { name: 'size (L/U)', value: '3 / 2' },
              { name: 'rebalance', value: '5: upper → lower', tone: 'amber' },
              { name: 'median', value: '5.0', tone: 'emerald' },
            ],
          },
          {
            caption:
              'addNum(4): offer 4 → lower([5,4,3,2]), pass max(5) → upper([5,8,10]). Balanced (3 == 3)! Even count (6): median = (4 + 5) / 2.0 = 4.5. Both invariants held throughout!',
            recurrence: 'Order: max(4) ≤ min(5)  |  Size: 3 == 3',
            concreteFormula: 'Stream [2, 3, 4, 5, 8, 10] → (4 + 5) / 2.0 = 4.5',
            inputItems: {
              label: 'Incoming Data Stream',
              values: [5, 2, 8, 3, 10, 4],
              activeIndex: 5,
              processedUntil: 6,
            },
            primaryArray: {
              label: 'Lower Half — Max-Heap (root = largest of lower half)',
              indices: ['max', 'c1', 'c2'],
              values: [4, 3, 2],
              activeIndex: 0,
              pointers: [{ label: 'peek=4', index: 0, tone: 'emerald' }],
            },
            secondaryContainer: {
              kind: 'heap',
              title: 'Upper Half — Min-Heap (root = smallest of upper half)',
              items: [
                { value: 5, meta: 'min (peek)', highlight: true },
                { value: 8 },
                { value: 10 },
              ],
            },
            variables: [
              { name: 'size (L/U)', value: '3 / 3' },
              { name: 'median', value: '4.5', tone: 'emerald' },
            ],
          },
        ],
      },
      javaSolution: {
        filename: 'MedianFinder.java',
        code: `import java.util.Collections;
import java.util.PriorityQueue;

public class MedianFinder {
    // Max-Heap storing the smaller half (allowed to have 1 extra element)
    private final PriorityQueue<Integer> lowerHalf;
    // Min-Heap storing the larger half
    private final PriorityQueue<Integer> upperHalf;

    public MedianFinder() {
        this.lowerHalf = new PriorityQueue<>(Collections.reverseOrder());
        this.upperHalf = new PriorityQueue<>();
    }

    public void addNum(int num) {
        // Step 1: Insert into lowerHalf, then push its maximum across to upperHalf
        // to preserve the ordering invariant: max(lowerHalf) <= min(upperHalf)
        lowerHalf.offer(num);
        upperHalf.offer(lowerHalf.poll());

        // Step 2: Preserve size invariant: lowerHalf.size() >= upperHalf.size()
        if (lowerHalf.size() < upperHalf.size()) {
            lowerHalf.offer(upperHalf.poll());
        }
    }

    public double findMedian() {
        if (lowerHalf.isEmpty()) {
            throw new IllegalStateException("Cannot compute median of an empty stream");
        }
        if (lowerHalf.size() > upperHalf.size()) {
            return lowerHalf.peek();
        }
        // Cast to long before adding to guard against signed 32-bit int overflow
        return ((long) lowerHalf.peek() + (long) upperHalf.peek()) / 2.0;
    }
}`,
        callouts: [
          {
            id: 'mf-reverse-order',
            startLine: 11,
            endLine: 12,
            title: 'Collections.reverseOrder() Prevents Comparator Overflow',
            explanation:
              'Writing (a, b) -> b - a breaks silently when comparing Integer.MAX_VALUE and -1. Collections.reverseOrder() delegates to Integer.compare and is overflow-proof.',
            accent: 'amber',
          },
          {
            id: 'mf-three-step',
            startLine: 16,
            endLine: 24,
            title: 'Three-Line Pass-Through Guarantees Both Invariants',
            explanation:
              'Routing every new number through lowerHalf → upperHalf before rebalancing guarantees max(lowerHalf) <= min(upperHalf) without needing null checks or separate if (num <= lowerHalf.peek()) branches.',
            accent: 'primary',
          },
          {
            id: 'mf-overflow',
            startLine: 34,
            endLine: 35,
            title: 'Overflow-Safe Even Median Averaging',
            explanation:
              'If both middle values are near Integer.MAX_VALUE (e.g., 2,000,000,000), lowerHalf.peek() + upperHalf.peek() overflows 32-bit int! Widening to long before dividing by 2.0 eliminates the bug.',
            accent: 'emerald',
          },
        ],
      },
      complexity: {
        time: 'O(log n) addNum · O(1) findMedian',
        space: 'O(n)',
        timeExplanation:
          'Each addNum executes at most 3 binary heap sift operations (each O(log(n/2)) = O(log n)). findMedian reads at most two heap roots in O(1).',
        spaceExplanation: 'All n stream integers are partitioned across the two heaps with no duplication.',
      },
      edgeCases: [
        {
          title: 'Follow-Up 1: All Integers Are in [0, 100]',
          scenario: 'Standard Meta/Google follow-up when stream volume reaches billions of integers.',
          handling:
            'Replace both heaps with a fixed int[101] frequency histogram + totalCount! addNum becomes O(1) time and O(1) space; findMedian walks at most 101 buckets (O(1)) to locate the (totalCount/2)-th element.',
        },
        {
          title: 'Follow-Up 2: 99% of Integers Are in [0, 100]',
          scenario: 'Outliers exist outside [0, 100], so a pure int[101] array no longer suffices alone.',
          handling:
            'Keep int[101] for [0..100] PLUS a counter belowCount (and/or TreeMap for < 0 and > 100). Since 99% of values lie in [0..100], the median is almost always inside [0..100], found in O(1) using belowCount as the starting rank offset!',
        },
        {
          title: 'Follow-Up 3: Sliding Window Median (LC #480)',
          scenario: 'Only the most recent k elements contribute to the median, requiring deletions.',
          handling:
            'Standard PriorityQueue.remove(x) is O(k). Upgrade to either Dual Heaps with Lazy Deletion (HashMap<Integer, Integer> delayed counts) OR two TreeMap<Integer, Integer> multisets for true O(log k) removal.',
        },
      ],
    },

    /* ================================================================
     * DSA 5: TASK SCHEDULER
     * ================================================================ */
    {
      id: 'day2-task-scheduler',
      dayNumber: 2,
      kind: 'dsa',
      title: 'Task Scheduler',
      subtitle: 'Greedy Max-Heap + Cooldown Queue simulation paired with O(N) idle-frame math proof',
      difficulty: 'Medium',
      patterns: ['Max-Heap', 'Cooldown Queue', 'Greedy Idle-Frame Math'],
      estimatedMinutes: 15,
      leetcodeRef: 'LC #621',
      problemStatement:
        'Given an array of CPU tasks labeled A–Z and a non-negative cooldown interval n, identical tasks must be separated by at least n CPU cycles (either other tasks or idle slots). Return the minimum total CPU intervals needed to finish all tasks.',
      exampleSummary: {
        input: "tasks = ['A','A','A','B','B','B'], n = 2",
        output: '8',
        explanation:
          'Optimal schedule is A → B → IDLE → A → B → IDLE → A → B (8 cycles). Notice both Max-Heap simulation and the closed-form formula (maxFreq - 1) × (n + 1) + maxCount = 2 × 3 + 2 = 8 yield 8.',
      },
      patternRecognition: {
        interviewCue:
          'Always schedule the MOST frequent currently-available task first — delaying high-frequency bottlenecks forces extra idle slots at the end. In interviews, know BOTH the O(N) closed-form idle-frame formula (for minimum count) AND the Max-Heap + Cooldown Queue simulation (if asked to output the actual schedule!).',
        signals: [
          'Keywords: "minimum CPU intervals", "cooldown n between identical items", "reorganize string k distance apart"',
          'Bottleneck is governed strictly by tasks tied at maximum frequency maxFreq',
          'Max-Heap pops highest remaining count; FIFO Cooldown Queue naturally stays sorted by readyAt = time + n + 1',
        ],
        mentalModel:
          'Visual Frame Proof: lay down the most frequent task A (count = maxFreq) as pillars creating (maxFreq - 1) frames of width (n + 1): [A _ _] [A _ _] [A]. Every other task tied at maxFreq (like B) slots into every frame plus the final tail → (maxFreq - 1) × (n + 1) + maxCount. If leftover tasks overflow all idle slots, zero idle time is needed and the answer is simply tasks.length!',
      },
      intuitionComparison: {
        bruteForce: {
          approach:
            'Backtracking or scanning all 26 task frequencies at every CPU tick while tracking nextAvailableTime[26].',
          timeComplexity: 'O(totalTime × 26)',
          spaceComplexity: 'O(1)',
          bottleneck:
            'Iterates tick-by-tick even across massive idle gaps when n is large (e.g., n = 100 with 2 identical tasks).',
        },
        optimal: {
          approach:
            'Simulation: Max-Heap of ready counts + FIFO Cooldown Queue storing (remCount, readyAt) with idle fast-forward. Closed-Form Math: count freq[26], find maxFreq & maxCount, return max(tasks.length, (maxFreq - 1) * (n + 1) + maxCount).',
          timeComplexity: 'O(N) math · O(N log 26) = O(N) heap sim',
          spaceComplexity: 'O(1) (at most 26 task types)',
          keyInvariant:
            'Scheduling the ready task with maximum remaining count minimizes future idle cycles; in the FIFO cooldown queue, readyAt = t + n + 1 is strictly increasing so only the queue head ever needs checking.',
        },
      },
      visualizer: {
        kind: 'dp-1d-stack-heap',
        title: 'Max-Heap + Cooldown Queue CPU Schedule Dry Run',
        inputSummary: "tasks = ['A','A','A','B','B','B'], n = 2  (readyAt = t + n + 1 = t + 3)",
        steps: [
          {
            caption:
              'Tick t = 0 (Init): Count frequencies → A:3, B:3. Load both into the Max-Heap of ready tasks. Cooldown queue is empty.',
            recurrence: 'Pop max-freq task from Max-Heap; if rem > 0, enqueue (rem, t + n + 1)',
            concreteFormula: 'Freqs: {A:3, B:3}  |  Math preview: (3-1)×(2+1) + 2 = 8',
            primaryArray: {
              label: 'CPU Execution Timeline (ticks t1..t8)',
              indices: ['t1', 't2', 't3', 't4', 't5', 't6', 't7', 't8'],
              values: ['·', '·', '·', '·', '·', '·', '·', '·'],
            },
            secondaryContainer: {
              kind: 'heap',
              title: 'Max-Heap (Ready) & Cooldown Queue (readyAt)',
              items: [
                { value: 'A (3)', meta: 'HEAP', highlight: true },
                { value: 'B (3)', meta: 'HEAP' },
              ],
            },
            variables: [
              { name: 'tick t', value: '0' },
              { name: 'cooldown n', value: '2' },
              { name: 'remaining', value: '6' },
            ],
          },
          {
            caption:
              'Tick t = 1: Pop highest-frequency task A (rem 3 → 2) and execute A in slot t1. Enqueue A(2) into Cooldown Queue with readyAt = 1 + 2 + 1 = t4.',
            recurrence: 'Execute heap.poll() → cooldown until t + n + 1',
            concreteFormula: 't = 1: run A → A(2) cools until t4  |  Heap: [B(3)]',
            primaryArray: {
              label: 'CPU Execution Timeline (ticks t1..t8)',
              indices: ['t1', 't2', 't3', 't4', 't5', 't6', 't7', 't8'],
              values: ['A', '·', '·', '·', '·', '·', '·', '·'],
              activeIndex: 0,
              pointers: [{ label: 't1', index: 0, tone: 'primary' }],
            },
            secondaryContainer: {
              kind: 'heap',
              title: 'Max-Heap (Ready) & Cooldown Queue (readyAt)',
              items: [
                { value: 'B (3)', meta: 'HEAP', highlight: true },
                { value: 'A (2)', meta: 'COOL → t4' },
              ],
            },
            variables: [
              { name: 'tick t', value: '1' },
              { name: 'ran', value: 'A', tone: 'primary' },
              { name: 'remaining', value: '5' },
            ],
          },
          {
            caption:
              'Tick t = 2: Pop B (rem 3 → 2) from Max-Heap and execute B in slot t2. Enqueue B(2) into Cooldown Queue with readyAt = 2 + 2 + 1 = t5. Max-Heap is now empty!',
            recurrence: 'Execute B → B(2) cools until t5',
            concreteFormula: 't = 2: run B → B(2) cools until t5  |  Heap: empty',
            primaryArray: {
              label: 'CPU Execution Timeline (ticks t1..t8)',
              indices: ['t1', 't2', 't3', 't4', 't5', 't6', 't7', 't8'],
              values: ['A', 'B', '·', '·', '·', '·', '·', '·'],
              activeIndex: 1,
              pointers: [{ label: 't2', index: 1, tone: 'primary' }],
            },
            secondaryContainer: {
              kind: 'heap',
              title: 'Max-Heap (Ready) & Cooldown Queue (readyAt)',
              items: [
                { value: 'A (2)', meta: 'COOL → t4' },
                { value: 'B (2)', meta: 'COOL → t5' },
              ],
            },
            variables: [
              { name: 'tick t', value: '2' },
              { name: 'ran', value: 'B', tone: 'primary' },
              { name: 'remaining', value: '4' },
            ],
          },
          {
            caption:
              'Tick t = 3: Cooldown head A(2) is not ready until t4, and Max-Heap is empty! CPU MUST emit IDLE in slot t3. (Tip: when n is huge, jump t directly to cooldown.peek().readyAt!)',
            recurrence: 'Heap empty & cooldown.head.readyAt > t → CPU IDLE',
            concreteFormula: 't = 3: Heap empty, earliest ready = t4 → IDLE',
            primaryArray: {
              label: 'CPU Execution Timeline (ticks t1..t8)',
              indices: ['t1', 't2', 't3', 't4', 't5', 't6', 't7', 't8'],
              values: ['A', 'B', 'IDLE', '·', '·', '·', '·', '·'],
              activeIndex: 2,
              pointers: [{ label: 't3 idle', index: 2, tone: 'amber' }],
            },
            secondaryContainer: {
              kind: 'heap',
              title: 'Max-Heap (Ready) & Cooldown Queue (readyAt)',
              items: [
                { value: 'A (2)', meta: 'COOL → t4 (next!)' },
                { value: 'B (2)', meta: 'COOL → t5' },
              ],
            },
            variables: [
              { name: 'tick t', value: '3' },
              { name: 'ran', value: 'IDLE', tone: 'amber' },
              { name: 'remaining', value: '4' },
            ],
          },
          {
            caption:
              'Tick t = 4: Cooldown head A(2) hits readyAt == t4 → move A(2) back into Max-Heap! Pop and run A in slot t4 (rem 2 → 1), re-enqueueing A(1) for readyAt = 4 + 3 = t7.',
            recurrence: 'Release cooldown.head when readyAt == t, then run heap.poll()',
            concreteFormula: 't = 4: release A(2) → run A → A(1) cools until t7',
            primaryArray: {
              label: 'CPU Execution Timeline (ticks t1..t8)',
              indices: ['t1', 't2', 't3', 't4', 't5', 't6', 't7', 't8'],
              values: ['A', 'B', 'IDLE', 'A', '·', '·', '·', '·'],
              activeIndex: 3,
              dependencyIndices: [{ index: 0, label: 'gap=2' }],
              pointers: [{ label: 't4', index: 3, tone: 'primary' }],
            },
            secondaryContainer: {
              kind: 'heap',
              title: 'Max-Heap (Ready) & Cooldown Queue (readyAt)',
              items: [
                { value: 'B (2)', meta: 'COOL → t5 (next!)' },
                { value: 'A (1)', meta: 'COOL → t7' },
              ],
            },
            variables: [
              { name: 'tick t', value: '4' },
              { name: 'ran', value: 'A', tone: 'primary' },
              { name: 'remaining', value: '3' },
            ],
          },
          {
            caption:
              'Tick t = 5: Release B(2) (readyAt == t5) into Max-Heap, run B in slot t5 (rem 2 → 1), and enqueue B(1) for readyAt = 5 + 3 = t8.',
            recurrence: 'Release B(2) at t5 → run B → B(1) cools until t8',
            concreteFormula: 't = 5: release B(2) → run B → B(1) cools until t8',
            primaryArray: {
              label: 'CPU Execution Timeline (ticks t1..t8)',
              indices: ['t1', 't2', 't3', 't4', 't5', 't6', 't7', 't8'],
              values: ['A', 'B', 'IDLE', 'A', 'B', '·', '·', '·'],
              activeIndex: 4,
              dependencyIndices: [{ index: 1, label: 'gap=2' }],
              pointers: [{ label: 't5', index: 4, tone: 'primary' }],
            },
            secondaryContainer: {
              kind: 'heap',
              title: 'Max-Heap (Ready) & Cooldown Queue (readyAt)',
              items: [
                { value: 'A (1)', meta: 'COOL → t7' },
                { value: 'B (1)', meta: 'COOL → t8' },
              ],
            },
            variables: [
              { name: 'tick t', value: '5' },
              { name: 'ran', value: 'B', tone: 'primary' },
              { name: 'remaining', value: '2' },
            ],
          },
          {
            caption:
              'Tick t = 6: Heap empty and earliest cooldown is A(1) at t7 → emit second IDLE slot in t6. Two full frames [A, B, IDLE] × 2 are now complete!',
            recurrence: 'Frame 2 closes with IDLE before final tail',
            concreteFormula: 't = 6: Heap empty, earliest ready = t7 → IDLE',
            primaryArray: {
              label: 'CPU Execution Timeline (ticks t1..t8)',
              indices: ['t1', 't2', 't3', 't4', 't5', 't6', 't7', 't8'],
              values: ['A', 'B', 'IDLE', 'A', 'B', 'IDLE', '·', '·'],
              activeIndex: 5,
              pointers: [{ label: 't6 idle', index: 5, tone: 'amber' }],
            },
            secondaryContainer: {
              kind: 'heap',
              title: 'Max-Heap (Ready) & Cooldown Queue (readyAt)',
              items: [
                { value: 'A (1)', meta: 'COOL → t7 (next!)' },
                { value: 'B (1)', meta: 'COOL → t8' },
              ],
            },
            variables: [
              { name: 'tick t', value: '6' },
              { name: 'ran', value: 'IDLE', tone: 'amber' },
              { name: 'remaining', value: '2' },
            ],
          },
          {
            caption:
              'Tick t = 7: Release A(1) → run final A in slot t7 (rem 1 → 0, retired!). Then Tick t = 8: Release B(1) → run final B in slot t8 (rem 1 → 0, retired!). Total = 8 intervals — exact match with (3-1)×(2+1)+2 = 8!',
            recurrence: 'Final tail [A, B] needs NO trailing IDLE slots',
            concreteFormula: 't = 7: A (done), t = 8: B (done) → Total = 8 intervals!',
            primaryArray: {
              label: 'CPU Execution Timeline (ticks t1..t8)',
              indices: ['t1', 't2', 't3', 't4', 't5', 't6', 't7', 't8'],
              values: ['A', 'B', 'IDLE', 'A', 'B', 'IDLE', 'A', 'B'],
              activeIndex: 7,
              dependencyIndices: [{ index: 6, label: 'tail' }],
              pointers: [{ label: 'done=8', index: 7, tone: 'emerald' }],
            },
            secondaryContainer: {
              kind: 'heap',
              title: 'Max-Heap & Cooldown Queue (Both Empty)',
              items: [],
            },
            variables: [
              { name: 'totalCycles', value: '8', tone: 'emerald' },
              { name: 'formulaCheck', value: 'max(6, 2×3+2) = 8', tone: 'emerald' },
            ],
          },
        ],
      },
      javaSolution: {
        filename: 'TaskScheduler.java',
        code: `import java.util.ArrayDeque;
import java.util.Collections;
import java.util.Deque;
import java.util.PriorityQueue;

public class TaskScheduler {
    /**
     * Optimal O(N) time / O(1) space closed-form idle-frame math solution.
     */
    public int leastInterval(char[] tasks, int n) {
        if (tasks == null || tasks.length == 0) {
            return 0;
        }
        if (n == 0) {
            return tasks.length;
        }

        int[] freq = new int[26];
        int maxFreq = 0;
        for (char task : tasks) {
            int count = ++freq[task - 'A'];
            if (count > maxFreq) {
                maxFreq = count;
            }
        }

        int maxCount = 0;
        for (int count : freq) {
            if (count == maxFreq) {
                maxCount++;
            }
        }

        // (maxFreq - 1) full frames of width (n + 1), plus final tail of maxCount tasks
        int frameCycles = (maxFreq - 1) * (n + 1) + maxCount;
        return Math.max(tasks.length, frameCycles);
    }

    /**
     * Max-Heap + Cooldown Queue simulation (use when asked to emit the actual schedule).
     */
    public int leastIntervalWithHeap(char[] tasks, int n) {
        int[] freq = new int[26];
        for (char task : tasks) {
            freq[task - 'A']++;
        }

        PriorityQueue<Integer> maxHeap = new PriorityQueue<>(Collections.reverseOrder());
        for (int count : freq) {
            if (count > 0) {
                maxHeap.offer(count);
            }
        }

        // Each entry is { remainingCount, readyAtTick }
        Deque<int[]> cooldown = new ArrayDeque<>();
        int tick = 0;

        while (!maxHeap.isEmpty() || !cooldown.isEmpty()) {
            // Fast-forward idle gap directly when heap is empty
            if (maxHeap.isEmpty()) {
                tick = Math.max(tick, cooldown.peek()[1]);
            }
            while (!cooldown.isEmpty() && cooldown.peek()[1] <= tick) {
                maxHeap.offer(cooldown.poll()[0]);
            }

            int rem = maxHeap.poll() - 1;
            if (rem > 0) {
                cooldown.offer(new int[] { rem, tick + n + 1 });
            }
            tick++;
        }

        return tick;
    }
}`,
        callouts: [
          {
            id: 'ts-frame-formula',
            startLine: 34,
            endLine: 36,
            title: 'Why Math.max(tasks.length, frameCycles) Is Exact',
            explanation:
              'When diverse lower-frequency tasks exceed the empty slots inside the (maxFreq - 1) frames, we simply stretch frame widths past (n + 1) round-robin. That guarantees zero idle slots and exact length tasks.length.',
            accent: 'emerald',
          },
          {
            id: 'ts-fast-forward',
            startLine: 60,
            endLine: 66,
            title: 'Idle Fast-Forward Makes Heap Simulation Independent of Large n',
            explanation:
              'Without jumping tick directly to cooldown.peek()[1], an input like [A, A] with n = 1,000,000 would spin 1,000,000 empty ticks! Fast-forwarding keeps total iterations strictly equal to tasks.length.',
            accent: 'amber',
          },
          {
            id: 'ts-fifo-queue',
            startLine: 68,
            endLine: 71,
            title: 'Why a Plain FIFO Queue Suffices for Cooldown (No Second Heap)',
            explanation:
              'Because every task shares the same cooldown n, readyAtTick = tick + n + 1 is strictly monotonically increasing as tasks enter the queue — so the earliest task to cool down is ALWAYS at cooldown.peek() in O(1)!',
            accent: 'primary',
          },
        ],
      },
      complexity: {
        time: 'O(N) math · O(N log 26) = O(N) heap sim',
        space: 'O(1) (bounded 26-letter alphabet)',
        timeExplanation:
          'Closed-form math makes one linear pass over tasks plus a 26-slot scan. The fast-forwarded heap simulation executes exactly N heap polls of size ≤ 26 (log₂ 26 ≤ 5).',
        spaceExplanation:
          'Frequency array, Max-Heap, and Cooldown Queue each hold at most 26 task entries.',
      },
      edgeCases: [
        {
          title: 'Overflowing Idle Slots (No Idle Cycles Needed)',
          scenario: "tasks = ['A','A','A','B','B','B','C','D','E','F'], n = 2 → frameCycles = 8, tasks.length = 10.",
          handling:
            'Math.max(10, 8) = 10. All extra tasks slot between A and B cleanly with zero idle intervals.',
        },
        {
          title: 'Zero Cooldown (n = 0)',
          scenario: 'Identical tasks can execute back-to-back with no delay.',
          handling: 'Short-circuit returns tasks.length immediately (formula also agrees since max(N, maxFreq - 1 + maxCount) = N).',
        },
        {
          title: 'Follow-Up: Preserve Input Order (Task Scheduler II, LC #2365)',
          scenario: 'What if tasks MUST execute in their given sequential order rather than being reordered?',
          handling:
            'Drop the heap completely! Use a Map<Integer, Long> nextReadyDay: for each task, set day = Math.max(day + 1, nextReadyDay.getOrDefault(task, 0L)) and record nextReadyDay.put(task, day + space + 1).',
        },
      ],
    },
  ],

  /* ================================================================
   * DAY 2 LLD: RATE LIMITER LIBRARY
   * ================================================================ */
  lldLesson: {
    id: 'day2-rate-limiter',
    dayNumber: 2,
    kind: 'lld',
    title: 'Rate Limiter Library',
    subtitle: 'Thread-safe Token Bucket & Sliding Window Log strategies with per-key lock isolation and Clock injection',
    patterns: ['Strategy Pattern', 'Factory Pattern', 'Per-Key Lock Striping', 'Atomic Compute'],
    estimatedMinutes: 24,
    problemScope: {
      summary:
        'Design an extensible, thread-safe in-process API Rate Limiter library in Java that protects backend endpoints from abusive bursts and noisy neighbors. Support multiple throttling algorithms (Token Bucket for smooth burst absorption, Sliding Window Log for exact rolling quotas), per-route policies, structured rejection metadata (remaining quota & retry-after duration), and deterministic Clock injection for unit testing.',
      functionalRequirements: [
        'Evaluate allowRequest(clientKey, route) returning an immutable RateLimitDecision containing allowed, remainingQuota, and retryAfter duration for HTTP 429 headers.',
        'Support multiple configurable throttling algorithms per route or tenant tier (Token Bucket for bursty user APIs; Sliding Window Log for strict financial/auth endpoints).',
        'Allow hot registration or update of per-route RateLimitRule configurations without restarting or changing caller code.',
        'Provide explicit idle-client state eviction so high-cardinality IP addresses or ephemeral API keys cannot cause an OutOfMemoryError.',
      ],
      concurrencyAndScaleAssumptions: [
        'Handles 50K–200K concurrent request checks/sec across multi-threaded HTTP worker pools — two distinct clients must NEVER contend on a shared global lock.',
        'Multiple concurrent requests for the SAME clientKey must be strictly serialized per key so 100 parallel threads cannot race past a 10-request quota.',
      ],
      explicitNonGoals: [
        'Cross-node Redis Lua cluster synchronization (covered in distributed rate limiting HLD; here we keep RateLimiterStrategy clean enough to plug in a Redis-backed implementation later).',
        'Servlet/Netty HTTP filter wiring or API key authentication.',
      ],
    },
    coreEntities: [
      {
        name: 'RateLimiterService',
        role: 'Facade resolving the active RateLimitRule for a route, dispatching to the configured RateLimiterStrategy, and exposing cleanup hooks.',
        keyFields: ['routeRules: ConcurrentHashMap<String, RateLimitRule>', 'defaultRule: RateLimitRule', 'strategies: Map<AlgorithmType, RateLimiterStrategy>'],
        invariants: 'Every route resolves deterministically to either an explicit rule or defaultRule; never throws NullPointerException on unknown routes.',
      },
      {
        name: 'RateLimiterStrategy (Interface)',
        role: 'Behavioral abstraction decoupling algorithm mechanics (Token Bucket vs. Sliding Window Log/Counter) from request orchestration.',
        keyFields: ['tryAcquire(String clientKey, RateLimitRule rule): RateLimitDecision', 'evictIdleClients(Duration idleThreshold): int'],
        invariants: 'Implementations must be thread-safe for concurrent callers sharing the same clientKey.',
      },
      {
        name: 'RateLimitRule',
        role: 'Immutable policy record defining maximum quota, rolling time window, burst capacity, and selected algorithm.',
        keyFields: ['maxRequests: int', 'window: Duration', 'burstCapacity: int', 'algorithmType: AlgorithmType'],
        invariants: 'maxRequests > 0, burstCapacity >= maxRequests (or > 0), and window > 0 validated at construction.',
      },
      {
        name: 'RateLimitDecision',
        role: 'Immutable response DTO directly powering HTTP response headers (X-RateLimit-Remaining and Retry-After).',
        keyFields: ['allowed: boolean', 'remaining: int', 'retryAfter: Duration'],
        invariants: 'If allowed == true, retryAfter is Duration.ZERO; if allowed == false, remaining == 0 and retryAfter > 0.',
      },
      {
        name: 'BucketState / WindowLog',
        role: 'Per-client mutable state containers (fractional token balance + lastRefillMs for Token Bucket; timestamp Deque for Sliding Window Log).',
        keyFields: ['tokens: double / timestamps: Deque<Long>', 'lastAccessMillis: long', 'lock: ReentrantLock'],
        invariants: 'Tokens never exceed burstCapacity; timestamps older than (now - windowMs) are pruned before every quota check.',
      },
    ],
    designPatterns: [
      {
        pattern: 'Strategy Pattern (RateLimiterStrategy → TokenBucketStrategy, SlidingWindowLogStrategy)',
        whereUsed: 'Swapping rate-limiting algorithms per route (e.g., Token Bucket for /search, strict Sliding Window Log for /auth/otp).',
        whatBreaksWithoutIt:
          'RateLimiterService degenerates into a monolithic switch(algorithm) maintaining both token doubles and timestamp queues in the same class. Adding Sliding Window Counter or Leaky Bucket forces modifying battle-tested concurrency code.',
        howItSolvesIt:
          'Isolates each algorithm’s data structure, refill/pruning math, and locking semantics behind a uniform tryAcquire(key, rule) contract (Open/Closed Principle).',
      },
      {
        pattern: 'Factory Pattern (RateLimiterFactory)',
        whereUsed: 'Assembling the map of AlgorithmType → RateLimiterStrategy instances wired with a shared Clock dependency.',
        whatBreaksWithoutIt:
          'Callers manually instantiate concrete strategy classes across controllers and tests, scattering Clock wiring and making global decorator wrapping (e.g., Micrometer metrics) impossible.',
        howItSolvesIt:
          'Centralizes strategy creation in one exhaustive factory boundary so tests and production bootstrap cleanly from configuration.',
      },
      {
        pattern: 'Dependency Inversion with java.time.Clock',
        whereUsed: 'Injected into every RateLimiterStrategy instead of calling System.currentTimeMillis() directly.',
        whatBreaksWithoutIt:
          'Unit tests for 1-minute token refill or boundary-burst window expiration must call Thread.sleep(60_000) — turning CI flaky, slow, and nondeterministic.',
        howItSolvesIt:
          'Tests inject a mutable/fixed Clock to advance virtual time by exact milliseconds instantaneously, verifying boundary precision with zero flakiness.',
      },
    ],
    diagrams: {
      classDiagram: {
        title: 'Rate Limiter — UML Class Diagram',
        caption: 'Strategy Pattern separates Token Bucket and Sliding Window Log state machines behind a uniform RateLimiterStrategy interface',
        mermaid: `classDiagram
    class RateLimiterService {
        -Map~String,RateLimitRule~ rules
        -RateLimitRule defaultRule
        -Map~AlgorithmType,RateLimiterStrategy~ strategies
        +allowRequest(key, route) Decision
        +registerRule(route, rule) void
        +evictIdleClients(ttl) int
    }

    class RateLimiterFactory {
        +createRegistry(clock) Map
    }

    class RateLimiterStrategy {
        <<interface>>
        +tryAcquire(key, rule) Decision
        +evictIdleClients(ttl) int
    }

    class TokenBucketStrategy {
        -ConcurrentHashMap~String,BucketState~ buckets
        -Clock clock
        +tryAcquire(key, rule) Decision
        +evictIdleClients(ttl) int
    }

    class SlidingWindowLogStrategy {
        -ConcurrentHashMap~String,WindowLog~ logs
        -Clock clock
        +tryAcquire(key, rule) Decision
        +evictIdleClients(ttl) int
    }

    class RateLimitRule {
        -int maxRequests
        -Duration window
        -int burstCapacity
        -AlgorithmType algorithm
    }

    class RateLimitDecision {
        -boolean allowed
        -int remaining
        -Duration retryAfter
    }

    RateLimiterService "1" o-- "*" RateLimitRule : "maps routes"
    RateLimiterService "1" --> "*" RateLimiterStrategy : "delegates check"
    RateLimiterFactory ..> RateLimiterStrategy : "constructs"
    RateLimiterStrategy <|.. TokenBucketStrategy : "implements"
    RateLimiterStrategy <|.. SlidingWindowLogStrategy : "implements"
    RateLimiterStrategy ..> RateLimitDecision : "returns"`,
      },
      sequenceDiagram: {
        title: 'Concurrent Request Throttling & Lazy Token Refill Sequence',
        caption: 'Per-key ReentrantLock serializes concurrent bursts for one client without blocking traffic from other clients',
        mermaid: `sequenceDiagram
    participant Worker as "HTTP Worker Thread"
    participant Service as "RateLimiterService"
    participant Strategy as "TokenBucketStrategy"
    participant Map as "ConcurrentHashMap"
    participant Bucket as "BucketState (Per-Key Lock)"

    Worker->>Service: "allowRequest(clientKey, route)"
    Service->>Service: "Resolve RateLimitRule for route"
    Service->>Strategy: "tryAcquire(clientKey, rule)"
    Strategy->>Map: "computeIfAbsent(clientKey, initBucket)"
    Map-->>Strategy: "BucketState reference"
    Strategy->>Bucket: "lock.lock() + lazyRefill(clock.millis())"
    alt "availableTokens >= 1.0"
        Bucket->>Bucket: "Decrement 1.0 token & record lastAccess"
        Bucket-->>Strategy: "Decision(allowed=true, remaining)"
    else "Tokens exhausted"
        Bucket->>Bucket: "Compute retryAfter = (1 - tokens) / rate"
        Bucket-->>Strategy: "Decision(allowed=false, retryAfter)"
    end
    Strategy->>Bucket: "lock.unlock()"
    Strategy-->>Service: "RateLimitDecision"
    Service-->>Worker: "Forward request OR return HTTP 429"`,
      },
    },
    codeFiles: [
      {
        filename: 'RateLimiterModels.java',
        label: 'RateLimiterModels.java',
        summary: 'Immutable AlgorithmType, validated RateLimitRule, HTTP-ready RateLimitDecision, and Strategy contract.',
        code: `import java.time.Duration;
import java.util.Objects;

public enum AlgorithmType {
    TOKEN_BUCKET,
    SLIDING_WINDOW_LOG
}

public record RateLimitRule(
    int maxRequests,
    Duration window,
    int burstCapacity,
    AlgorithmType algorithm
) {
    public RateLimitRule {
        if (maxRequests <= 0) {
            throw new IllegalArgumentException("maxRequests must be > 0");
        }
        if (window == null || window.isZero() || window.isNegative()) {
            throw new IllegalArgumentException("window must be positive");
        }
        if (burstCapacity <= 0) {
            throw new IllegalArgumentException("burstCapacity must be > 0");
        }
        Objects.requireNonNull(algorithm, "algorithm required");
    }

    public double refillTokensPerMilli() {
        return (double) maxRequests / window.toMillis();
    }
}

public record RateLimitDecision(
    boolean allowed,
    int remaining,
    Duration retryAfter
) {
    public static RateLimitDecision permit(int remaining) {
        return new RateLimitDecision(true, Math.max(0, remaining), Duration.ZERO);
    }

    public static RateLimitDecision reject(Duration retryAfter) {
        Duration safeWait = retryAfter.isNegative() ? Duration.ofMillis(1) : retryAfter;
        return new RateLimitDecision(false, 0, safeWait);
    }
}

public interface RateLimiterStrategy {
    RateLimitDecision tryAcquire(String clientKey, RateLimitRule rule);

    int evictIdleClients(Duration idleThreshold);
}`,
        callouts: [
          {
            id: 'rl-rule-validation',
            startLine: 15,
            endLine: 26,
            title: 'Fail-Fast Compact Record Constructor',
            explanation:
              'Validating positive window and quotas at rule creation time prevents division-by-zero bugs inside hot refill math and guarantees immutable sharing across all threads.',
            accent: 'primary',
          },
          {
            id: 'rl-decision-dto',
            startLine: 33,
            endLine: 46,
            title: 'Rich Decision Record (Never Return Raw boolean)',
            explanation:
              'Returning RateLimitDecision instead of boolean immediately supports RFC-compliant HTTP 429 Retry-After and X-RateLimit-Remaining headers without breaking the API signature later.',
            accent: 'emerald',
          },
        ],
      },
      {
        filename: 'TokenBucketStrategy.java',
        label: 'TokenBucketStrategy.java',
        summary: 'Continuous lazy-refill Token Bucket with fine-grained per-key ReentrantLock and O(1) memory per client.',
        code: `import java.time.Clock;
import java.time.Duration;
import java.util.Objects;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.locks.ReentrantLock;

public class TokenBucketStrategy implements RateLimiterStrategy {
    private final ConcurrentHashMap<String, BucketState> buckets = new ConcurrentHashMap<>();
    private final Clock clock;

    public TokenBucketStrategy(Clock clock) {
        this.clock = Objects.requireNonNull(clock, "clock required");
    }

    @Override
    public RateLimitDecision tryAcquire(String clientKey, RateLimitRule rule) {
        long nowMs = clock.millis();
        BucketState state = buckets.computeIfAbsent(
            clientKey,
            k -> new BucketState(rule.burstCapacity(), nowMs)
        );

        state.lock.lock();
        try {
            // Guard against NTP backward wall-clock jumps via Math.max(0, ...)
            long elapsedMs = Math.max(0L, nowMs - state.lastRefillMs);
            double refillRate = rule.refillTokensPerMilli();
            double replenished = elapsedMs * refillRate;

            state.tokens = Math.min(rule.burstCapacity(), state.tokens + replenished);
            state.lastRefillMs = Math.max(state.lastRefillMs, nowMs);
            state.lastAccessMs = nowMs;

            if (state.tokens >= 1.0) {
                state.tokens -= 1.0;
                return RateLimitDecision.permit((int) Math.floor(state.tokens));
            }

            long waitMillis = (long) Math.ceil((1.0 - state.tokens) / refillRate);
            return RateLimitDecision.reject(Duration.ofMillis(Math.max(1L, waitMillis)));
        } finally {
            state.lock.unlock();
        }
    }

    @Override
    public int evictIdleClients(Duration idleThreshold) {
        long cutoffMs = clock.millis() - idleThreshold.toMillis();
        int[] removed = { 0 };
        buckets.forEach((key, state) -> {
            if (state.lastAccessMs < cutoffMs) {
                // Atomic remove-if-still-idle avoids racing with an active tryAcquire
                buckets.computeIfPresent(key, (k, curr) -> {
                    if (curr.lock.tryLock()) {
                        try {
                            if (curr.lastAccessMs < cutoffMs) {
                                removed[0]++;
                                return null;
                            }
                        } finally {
                            curr.lock.unlock();
                        }
                    }
                    return curr;
                });
            }
        });
        return removed[0];
    }

    private static final class BucketState {
        final ReentrantLock lock = new ReentrantLock();
        double tokens;
        long lastRefillMs;
        volatile long lastAccessMs;

        BucketState(double initialTokens, long nowMs) {
            this.tokens = initialTokens;
            this.lastRefillMs = nowMs;
            this.lastAccessMs = nowMs;
        }
    }
}`,
        callouts: [
          {
            id: 'tb-clock-skew',
            startLine: 25,
            endLine: 26,
            title: 'NTP Backward Clock-Jump Protection',
            explanation:
              'Wall clocks can jump backward during NTP adjustments. Clamping elapsedMs >= 0 prevents subtracting tokens or producing negative retryAfter values.',
            accent: 'amber',
          },
          {
            id: 'tb-lazy-refill',
            startLine: 27,
            endLine: 40,
            title: 'Lazy On-Demand Refill & Exact Retry-After (Zero Background Threads)',
            explanation:
              'Never spawn a ScheduledExecutorService to trickle tokens into 1,000,000 client buckets every second! Lazy math computes elapsedMs × refillRate right on request arrival in O(1) time and O(1) memory per key, plus exact ceiling waitMillis on rejection.',
            accent: 'emerald',
          },
          {
            id: 'tb-evict-race',
            startLine: 52,
            endLine: 65,
            title: 'Race-Free Idle Bucket Eviction',
            explanation:
              'Combining ConcurrentHashMap.computeIfPresent with tryLock() ensures we never evict a BucketState concurrently being updated by a request thread, eliminating memory leaks safely.',
            accent: 'primary',
          },
        ],
      },
      {
        filename: 'SlidingWindowLogStrategy.java',
        label: 'SlidingWindowLogStrategy.java',
        summary: 'Exact rolling-window timestamp log synchronized atomically via ConcurrentHashMap.compute().',
        code: `import java.time.Clock;
import java.time.Duration;
import java.util.ArrayDeque;
import java.util.Deque;
import java.util.Objects;
import java.util.concurrent.ConcurrentHashMap;

/**
 * Exact rolling-window limiter storing per-request timestamps.
 * Trade-off: 100% immune to fixed-window boundary spikes, at O(maxRequests) memory per active key.
 * For ultra-high quotas (e.g., 100k req/min), swap in a SlidingWindowCounterStrategy (O(1) memory).
 */
public class SlidingWindowLogStrategy implements RateLimiterStrategy {
    private final ConcurrentHashMap<String, WindowLog> logs = new ConcurrentHashMap<>();
    private final Clock clock;

    public SlidingWindowLogStrategy(Clock clock) {
        this.clock = Objects.requireNonNull(clock, "clock required");
    }

    @Override
    public RateLimitDecision tryAcquire(String clientKey, RateLimitRule rule) {
        long nowMs = clock.millis();
        long windowMs = rule.window().toMillis();
        long windowStartMs = nowMs - windowMs;
        RateLimitDecision[] holder = new RateLimitDecision[1];

        // Atomic per-bin compute guarantees check-prune-append runs without TOCTOU races
        logs.compute(clientKey, (key, log) -> {
            WindowLog active = (log != null) ? log : new WindowLog();
            active.lastAccessMs = nowMs;

            // Prune expired timestamps strictly outside [nowMs - windowMs, nowMs]
            while (!active.timestamps.isEmpty() && active.timestamps.peekFirst() <= windowStartMs) {
                active.timestamps.pollFirst();
            }

            if (active.timestamps.size() < rule.maxRequests()) {
                active.timestamps.offerLast(nowMs);
                int remaining = rule.maxRequests() - active.timestamps.size();
                holder[0] = RateLimitDecision.permit(remaining);
            } else {
                long oldestMs = active.timestamps.peekFirst();
                long retryMs = Math.max(1L, (oldestMs + windowMs) - nowMs);
                holder[0] = RateLimitDecision.reject(Duration.ofMillis(retryMs));
            }
            return active;
        });

        return holder[0];
    }

    @Override
    public int evictIdleClients(Duration idleThreshold) {
        long cutoffMs = clock.millis() - idleThreshold.toMillis();
        int[] removed = { 0 };
        logs.forEach((key, log) -> {
            if (log.lastAccessMs < cutoffMs) {
                logs.computeIfPresent(key, (k, curr) -> {
                    if (curr.lastAccessMs < cutoffMs) {
                        removed[0]++;
                        return null;
                    }
                    return curr;
                });
            }
        });
        return removed[0];
    }

    private static final class WindowLog {
        final Deque<Long> timestamps = new ArrayDeque<>();
        volatile long lastAccessMs;
    }
}`,
        callouts: [
          {
            id: 'sw-memory-note',
            startLine: 8,
            endLine: 12,
            title: 'Explicit Memory vs. Precision Trade-Off',
            explanation:
              'Sliding Window Log eliminates the 2× fixed-window boundary burst completely, but stores up to maxRequests longs per key. Call out Sliding Window Counter (two integer counters weighted by overlap ratio) for 100K-RPS keys where O(1) memory matters.',
            accent: 'amber',
          },
          {
            id: 'sw-atomic-compute',
            startLine: 28,
            endLine: 41,
            title: 'Atomic ConcurrentHashMap.compute() Per-Key Serialization',
            explanation:
              'ConcurrentHashMap.compute() locks ONLY the hash bin for clientKey for the entire prune-check-append transaction. Because all operations inside the lambda are fast in-memory ArrayDeque calls (zero I/O), contention stays microscopic and race conditions with eviction are impossible.',
            accent: 'primary',
          },
          {
            id: 'sw-exact-retry',
            startLine: 42,
            endLine: 46,
            title: 'Exact Retry-After From Oldest In-Window Request',
            explanation:
              'Because timestamps are appended in monotonic order, timestamps.peekFirst() is guaranteed to expire first at (oldestMs + windowMs), giving clients an exact millisecond backoff.',
            accent: 'emerald',
          },
        ],
      },
      {
        filename: 'RateLimiterService.java',
        label: 'RateLimiterService.java',
        summary: 'Factory wiring and thread-safe RateLimiterService facade coordinating per-route policies.',
        code: `import java.time.Clock;
import java.time.Duration;
import java.util.EnumMap;
import java.util.Map;
import java.util.Objects;
import java.util.concurrent.ConcurrentHashMap;

public final class RateLimiterFactory {
    private RateLimiterFactory() {}

    public static Map<AlgorithmType, RateLimiterStrategy> createStrategies(Clock clock) {
        Map<AlgorithmType, RateLimiterStrategy> map = new EnumMap<>(AlgorithmType.class);
        map.put(AlgorithmType.TOKEN_BUCKET, new TokenBucketStrategy(clock));
        map.put(AlgorithmType.SLIDING_WINDOW_LOG, new SlidingWindowLogStrategy(clock));
        return Map.copyOf(map);
    }
}

public class RateLimiterService {
    private final Map<AlgorithmType, RateLimiterStrategy> strategies;
    private final ConcurrentHashMap<String, RateLimitRule> routeRules = new ConcurrentHashMap<>();
    private final RateLimitRule defaultRule;

    public RateLimiterService(RateLimitRule defaultRule, Clock clock) {
        this.defaultRule = Objects.requireNonNull(defaultRule, "defaultRule required");
        this.strategies = RateLimiterFactory.createStrategies(clock);
    }

    public void registerRule(String route, RateLimitRule rule) {
        Objects.requireNonNull(route, "route required");
        Objects.requireNonNull(rule, "rule required");
        routeRules.put(route, rule);
    }

    public RateLimitDecision allowRequest(String clientId, String route) {
        Objects.requireNonNull(clientId, "clientId required");
        Objects.requireNonNull(route, "route required");

        RateLimitRule rule = routeRules.getOrDefault(route, defaultRule);
        RateLimiterStrategy strategy = strategies.get(rule.algorithm());
        if (strategy == null) {
            throw new IllegalStateException("No strategy registered for " + rule.algorithm());
        }

        // Namespace state key by route so limits on /login and /search stay isolated
        String compositeKey = clientId + "::" + route;
        return strategy.tryAcquire(compositeKey, rule);
    }

    public int evictIdleClients(Duration idleThreshold) {
        int totalEvicted = 0;
        for (RateLimiterStrategy strategy : strategies.values()) {
            totalEvicted += strategy.evictIdleClients(idleThreshold);
        }
        return totalEvicted;
    }
}`,
        callouts: [
          {
            id: 'rls-composite-key',
            startLine: 45,
            endLine: 47,
            title: 'Composite (clientId :: route) Key Isolation',
            explanation:
              'Scoping bucket state by both clientId and route ensures a client exhausting their strict /auth/otp quota does not accidentally exhaust their /health or /catalog quota.',
            accent: 'emerald',
          },
          {
            id: 'rls-immutable-map',
            startLine: 11,
            endLine: 16,
            title: 'Immutable Strategy Registry for Lock-Free Dispatch',
            explanation:
              'Map.copyOf() over an EnumMap gives thread-safe, lock-free O(1) strategy lookup on every hot-path request.',
            accent: 'primary',
          },
        ],
      },
    ],
    solidHighlights: [
      {
        principle: 'Single Responsibility',
        application:
          'RateLimiterService resolves route rules, RateLimiterFactory wires dependencies, and each Strategy owns strictly one throttling algorithm’s state and math.',
      },
      {
        principle: 'Open/Closed',
        application:
          'Adding a SlidingWindowCounterStrategy (O(1) memory weighted approximation) or LeakyBucketStrategy requires implementing RateLimiterStrategy and registering it in RateLimiterFactory — zero edits to RateLimiterService.',
      },
      {
        principle: 'Liskov Substitution',
        application:
          'Every RateLimiterStrategy honors the exact RateLimitDecision contract (positive retryAfter on reject, non-negative remaining on permit), allowing routes to swap algorithms dynamically.',
      },
      {
        principle: 'Dependency Inversion',
        application:
          'RateLimiterService depends on RateLimiterStrategy and java.time.Clock abstractions rather than hardcoded algorithm logic or System.currentTimeMillis().',
      },
    ],
    extensibilityScenarios: [
      {
        scenario: 'Add O(1)-Memory Sliding Window Counter for High-Volume Endpoints',
        changesRequired:
          'Implement SlidingWindowCounterStrategy storing only {prevWindowCount, currWindowCount, currWindowStartMs} and approximating count = curr + prev × (1 - elapsedRatio). Register under AlgorithmType.SLIDING_WINDOW_COUNTER.',
      },
      {
        scenario: 'Support Weighted / Cost-Based Requests (e.g., GraphQL Query Complexity = 5 Tokens)',
        changesRequired:
          'Overload tryAcquire(clientKey, rule, int permits) with default permits = 1. TokenBucketStrategy simply checks tokens >= permits and subtracts permits atomically.',
      },
      {
        scenario: 'Scale Across Multiple API Gateway Pods (Distributed Rate Limiting)',
        changesRequired:
          'Implement RedisLuaTokenBucketStrategy behind the exact same RateLimiterStrategy interface, executing refill+decrement atomically inside a single Redis EVALSHA Lua script with a fail-open circuit breaker if Redis times out.',
      },
    ],
    concurrencyChoices: [
      {
        topic: 'Per-Key Lock Striping vs. Global Synchronization',
        mechanism: 'Per-client ReentrantLock inside BucketState (TokenBucket) & per-bin ConcurrentHashMap.compute() (SlidingWindowLog)',
        rationale:
          'A synchronized method on RateLimiterService would bottleneck all 200K RPS on one CPU core. Per-key isolation lets thousands of distinct clients run completely in parallel while keeping same-client bursts strictly atomic.',
      },
      {
        topic: 'Zero-IO Critical Section Inside ConcurrentHashMap.compute()',
        mechanism: 'Only O(1) / amortized O(1) in-memory Deque operations execute inside the hash-bin lock',
        rationale:
          'Holding a ConcurrentHashMap bin lock during network I/O or logging causes severe bucket-collision stalls. Keeping compute() pure CPU work ensures sub-microsecond lock hold times.',
      },
      {
        topic: 'Deterministic Time & Clock Skew Resilience',
        mechanism: 'Injected java.time.Clock + Math.max(0, nowMs - lastRefillMs) clamp',
        rationale:
          'Eliminates flaky Thread.sleep() unit tests and guarantees NTP backward wall-clock adjustments can never corrupt token balances or create negative wait durations.',
      },
    ],
  },

  /* ================================================================
   * DAY 2 HLD: DISTRIBUTED KEY-VALUE STORE (DYNAMO / CASSANDRA)
   * ================================================================ */
  hldLesson: {
    id: 'day2-distributed-kv-store',
    dayNumber: 2,
    kind: 'hld',
    title: 'Distributed Key-Value Store (Dynamo / Cassandra)',
    subtitle: 'Consistent hashing with virtual nodes, tunable quorum (N/W/R), vector clocks, sloppy quorum + hinted handoff, Merkle anti-entropy, and LSM-Tree storage',
    tags: ['Consistent Hashing', 'Tunable Quorum N/W/R', 'Vector Clocks', 'LSM-Tree / SSTable'],
    estimatedMinutes: 26,
    overview:
      'Architect a globally scalable, leaderless Distributed Key-Value Store capable of storing 100B+ keys (300+ TB replicated) and serving 1M+ ops/sec at sub-10ms p99 latency. Balance availability vs. consistency dynamically using Dynamo-style Consistent Hashing with Virtual Nodes, Tunable Quorum (N/W/R), Vector Clocks, Sloppy Quorum + Hinted Handoff, Merkle Tree Anti-Entropy repair, and high-throughput LSM-Tree storage engines.',
    requirements: {
      functional: [
        'Support point operations PUT(key, value, context), GET(key), and DELETE(key) for opaque payloads up to 1 MB.',
        'Allow per-request tunable consistency (W, R over replication factor N) so callers choose strong quorum reads (W + R > N) or low-latency eventual reads (R = 1).',
        'Support seamless horizontal scaling (add/remove storage nodes) with minimal key migration and zero cluster downtime.',
        'Detect node failures automatically, stay writable during transient network partitions, and converge diverged replicas in the background.',
      ],
      nonFunctional: [
        {
          metric: 'Read & Write Latency (p99)',
          target: '< 10 ms (local-region quorum)',
          rationale: 'Serves as the primary backing store for shopping carts, user sessions, and metadata on latency-critical request paths.',
        },
        {
          metric: 'Availability (Write-Path)',
          target: '99.999% (AP-leaning, tunable to CP)',
          rationale: 'Leaderless design eliminates single-leader failover stalls; Sloppy Quorum + Hinted Handoff keeps writes succeeding even when primary replicas are unreachable.',
        },
        {
          metric: 'Durability',
          target: 'Zero acknowledged write loss',
          rationale: 'Every local write fsyncs to an append-only Commit Log (WAL) before acknowledging, replicated across N = 3 distinct Availability Zones.',
        },
        {
          metric: 'Horizontal Elasticity',
          target: 'Linear storage & throughput scaling',
          rationale: 'Consistent hashing with virtual nodes redistributes only ~1/M of keys when adding the M-th node, avoiding full-cluster rehashing.',
        },
      ],
    },
    capacityMath: {
      assumptions: [
        '1,000,000 ops/sec average (70% reads = 700K RPS, 30% writes = 300K WPS); 3× peak traffic multiplier',
        '100 Billion total keys; average record size ≈ 1 KB (key + value + vector clock/metadata)',
        'Default Replication Factor N = 3 across 3 AZs; default Strong Quorum W = 2, R = 2',
        'Each storage node has 4 TB NVMe SSD (capped at 70% utilization = 2.8 TB usable to preserve LSM compaction headroom) and 64 GB RAM',
      ],
      calculations: [
        {
          metric: 'Cluster Ops QPS (Avg / Peak)',
          formula: '700K reads + 300K writes = 1M avg → ×3 peak',
          result: '1.0M ops/s avg · 3.0M ops/s peak',
          notes: 'Coordinator fans out writes to N=3 replicas (900K local writes/s avg) and reads to R=2 replicas (1.4M local reads/s avg).',
        },
        {
          metric: 'Total Replicated Storage',
          formula: '100B keys × 1 KB × 3 (RF=3) × 1.25 (LSM headroom)',
          result: '100 TB raw · ~375 TB replicated',
          notes: 'Extra ~25% disk buffer absorbs SSTable compaction spikes and tombstones before gc_grace_seconds.',
        },
        {
          metric: 'Cluster Size (Storage-Bound)',
          formula: '375 TB / 2.8 TB usable per NVMe node ≈ 134 nodes',
          result: '~150 nodes (50 per AZ)',
          notes: 'Spreading evenly across 3 AZs ensures every key’s N=3 preference list spans 3 independent failure domains.',
        },
        {
          metric: 'Per-Node Local IOPS Load',
          formula: '(900K writes + 1.4M reads) / 150 nodes ≈ 15.3K ops/s',
          result: '~15.3K ops/s avg (~46K peak) / node',
          notes: 'LSM-Trees turn random writes into sequential WAL appends + RAM MemTable inserts, easily sustaining >100K ops/s per NVMe node.',
        },
        {
          metric: 'Virtual Nodes on Hash Ring',
          formula: '150 physical nodes × 256 vnodes/node',
          result: '38,400 ring tokens (Murmur3 128-bit)',
          notes: '256 vnodes/node keeps standard deviation of key load < 5% and lets 149 peers stream rebuild chunks in parallel if one node dies.',
        },
        {
          metric: 'Per-Node RAM Allocation (64 GB)',
          formula: '~4 GB MemTable + ~2.5 GB Bloom Filters + ~48 GB Block/Page Cache',
          result: '< 1% Bloom filter false-positive rate',
          notes: '10 bits/key × ~2B local keys ≈ 2.5 GB RAM keeps negative SSTable disk seeks near zero.',
        },
      ],
    },
    apiAndDataModel: {
      endpoints: [
        {
          method: 'PUT',
          path: '/v1/kv/{key}?w=2',
          summary: 'Write value with optional causal Vector Clock context and tunable write quorum W',
          payload: '{ "value": "<base64>", "context": {"n1": 4, "n2": 2}, "ttlSec": 86400 } → 200 { "context": {"n1": 5, "n2": 2} }',
        },
        {
          method: 'GET',
          path: '/v1/kv/{key}?r=2',
          summary: 'Read latest value(s) from R replicas; returns sibling versions if concurrent vector clocks diverge',
          payload: '200 { "versions": [{ "value": "...", "context": {"n1": 5, "n2": 2} }] }',
        },
        {
          method: 'DELETE',
          path: '/v1/kv/{key}?w=2',
          summary: 'Write a Tombstone marker with incremented vector clock (prevents deleted keys from resurrecting)',
          payload: '204 No Content (Tombstone retained until gc_grace_seconds after anti-entropy sync)',
        },
      ],
      storageSchema: [
        {
          store: 'Ring Membership & Gossip Metadata (In-Memory on Every Node)',
          schema: 'TokenRing: TreeMap<Long tokenHash, NodeId>  |  GossipTable: Map<NodeId, {heartbeatSeq, status, az, generation}>',
          shardingAndIndexing:
            'Every node stores the full lightweight ring map (~few MB) updated via O(log M) peer-to-peer Gossip + Phi Accrual Failure Detector — zero central ZooKeeper bottleneck on the data path.',
        },
        {
          store: 'Local LSM-Tree Storage Engine (Per Storage Node)',
          schema: 'CommitLog (WAL sequential segments) → MemTable (Red-Black/SkipList) → Immutable SSTables (sorted key→{val, vclock, tombstone}) + BloomFilter + SparseIndex',
          shardingAndIndexing:
            'Reads probe MemTable first, then newest-to-oldest SSTable levels guarded by Bloom Filters (skipping non-matching files in O(1) RAM) and sparse offset indexes (1 disk seek). Background Leveled Compaction merges SSTables and purges expired tombstones.',
        },
      ],
    },
    architecture: {
      title: 'Distributed KV Store — Leaderless Dynamo Architecture',
      summary: 'Click any component to inspect Consistent Hashing, Tunable Quorum (N/W/R), Hinted Handoff, Merkle Anti-Entropy, and LSM-Tree storage',
      defaultSelectedNodeId: 'coordinator',
      nodes: [
        {
          id: 'clients',
          label: 'App Clients',
          sublabel: 'SDK · Quorum W/R',
          category: 'client',
          x: 14,
          y: 215,
          width: 136,
          height: 58,
          flows: ['read', 'write'],
          details: {
            role: 'Upstream microservices issuing GET/PUT/DELETE calls with per-query consistency levels (e.g., QUORUM for checkout, ONE for analytics) and causal vector-clock context.',
            dataFlow: 'Token-aware SDK hashes key locally to pick a nearby coordinator node in the same AZ, saving one extra network hop.',
            scalingStrategy: 'Stateless client fleet maintains persistent multiplexed gRPC/CQL connection pools to multiple cluster nodes.',
            failureHandling: 'Automatic speculative retry to a backup coordinator on tail-latency timeout; merges concurrent sibling values on read when vector clocks conflict.',
            techChoices: ['Token-Aware Driver', 'gRPC / Binary Protocol', 'Causal Context Header'],
          },
        },
        {
          id: 'coordinator',
          label: 'Coordinator Node',
          sublabel: 'Hash Ring · N/W/R',
          category: 'edge',
          x: 196,
          y: 215,
          width: 156,
          height: 58,
          flows: ['read', 'write'],
          details: {
            role: 'Any node in the leaderless ring can act as Coordinator for a request: maps hash(key) onto the vnode ring, selects the top N healthy replicas in distinct AZs, fans out parallel RPCs, and enforces W or R acknowledgements.',
            dataFlow: 'On PUT: stamps/increments vector clock and waits for W replica acks. On GET: collects R responses, compares vector clocks, triggers async Read Repair on stale replicas, and returns latest version(s).',
            scalingStrategy: 'Completely peer-to-peer and stateless per request — zero leader bottleneck or single point of failure.',
            failureHandling: 'If a primary replica is marked down by Gossip, routes the write to the next healthy node on the ring with a Sloppy Quorum hint header so writes stay 99.999% available.',
            techChoices: ['Murmur3 128-bit Hash', 'Preference List (Distinct AZs)', 'Async Read Repair'],
          },
        },
        {
          id: 'replica-a',
          label: 'Replica Node A',
          sublabel: 'AZ-1 · Primary Vnode',
          category: 'service',
          x: 398,
          y: 56,
          width: 164,
          height: 58,
          flows: ['read', 'write'],
          details: {
            role: 'Primary owner of the key’s vnode range in AZ-1; persists writes locally via its LSM-Tree engine and serves quorum reads.',
            dataFlow: 'Writes append to Commit Log WAL + insert into MemTable immediately (< 1ms). Reads check MemTable then SSTables via Bloom Filter + Block Cache.',
            scalingStrategy: 'Hosts 256 virtual nodes interleaved evenly across the hash ring; adding new nodes steals small vnode slices without hotspotting any single machine.',
            failureHandling: 'If Replica A crashes and restarts, replays its un-flushed Commit Log WAL on boot, then catches up missed mutations via Hinted Handoff and Merkle Anti-Entropy.',
            techChoices: ['Peer Storage Node', '256 Virtual Nodes', 'Multi-AZ Placement'],
          },
        },
        {
          id: 'replica-b',
          label: 'Replica Node B',
          sublabel: 'AZ-2 · Quorum Peer',
          category: 'service',
          x: 398,
          y: 215,
          width: 164,
          height: 58,
          flows: ['read', 'write'],
          details: {
            role: 'Second replica on the key’s preference list in AZ-2; together with Replica A forms a strict W=2 / R=2 quorum even if AZ-3 fails completely.',
            dataFlow: 'Receives parallel quorum writes from Coordinator, serves digest or full reads on GET, and exchanges Merkle tree hashes with peers in the background.',
            scalingStrategy: 'Reads can use digest optimization (1 replica returns full payload, remaining R-1 return checksum hashes) to slash cross-AZ bandwidth unless hashes mismatch.',
            failureHandling: 'If a read digest disagrees with Replica A, Coordinator requests full payloads from both, reconciles via Vector Clock, and pushes Read Repair to the stale peer.',
            techChoices: ['Digest Read Optimization', 'Vector Clock Versioning', 'Leveled Compaction'],
          },
        },
        {
          id: 'sloppy-node',
          label: 'Hinted Standby',
          sublabel: 'AZ-3 · Sloppy Quorum',
          category: 'queue',
          x: 398,
          y: 374,
          width: 164,
          height: 58,
          flows: ['write'],
          details: {
            role: 'Temporary fallback node on the ring that absorbs writes under Sloppy Quorum whenever one of the key’s N primary replicas is temporarily unreachable.',
            dataFlow: 'Stores the write in a dedicated local Hints queue tagged with targetReplicaId rather than merging into its main token range, returning a fast write ACK to the Coordinator.',
            scalingStrategy: 'Bounded hint retention window (e.g., max 3 hours or capped disk budget) prevents a dead node from filling healthy peers’ disks.',
            failureHandling: 'Polls Gossip state continuously; the moment the downed primary replica recovers, replays queued hints asynchronously and deletes them once acknowledged.',
            techChoices: ['Sloppy Quorum', 'Hinted Handoff Log', 'Bounded Hint TTL'],
          },
        },
        {
          id: 'lsm-mem',
          label: 'WAL + MemTable',
          sublabel: 'Commit Log & SkipList',
          category: 'cache',
          x: 700,
          y: 26,
          width: 208,
          height: 56,
          flows: ['write', 'read'],
          details: {
            role: 'Hot write ingestion path inside every storage node: pairs a sequential append-only Write-Ahead Commit Log (durability) with an in-memory sorted SkipList/Red-Black MemTable.',
            dataFlow: 'PUT appends to WAL (sequential disk I/O) and mutates MemTable in RAM — zero random disk seeks! Once MemTable hits threshold (e.g., 64 MB), freezes and flushes asynchronously to a sorted SSTable.',
            scalingStrategy: 'Group-commit batching amortizes fsync cost across hundreds of concurrent writes, achieving >100K writes/sec per node.',
            failureHandling: 'Power loss wipes RAM MemTable, which is deterministically reconstructed on startup by replaying the un-flushed Commit Log segments.',
            techChoices: ['Sequential WAL', 'ConcurrentSkipListMap', 'Group Commit Fsync'],
          },
        },
        {
          id: 'sstables',
          label: 'SSTables + Bloom',
          sublabel: 'LSM Immutable Disk',
          category: 'database',
          x: 700,
          y: 152,
          width: 208,
          height: 56,
          flows: ['read', 'write'],
          details: {
            role: 'Immutable, sorted on-disk String Tables (SSTables) organized in levels (L0..Ln) with per-file Bloom Filters and sparse key-offset indexes for fast point reads.',
            dataFlow: 'MemTable flushes write new L0 SSTables sequentially. Background compaction merges overlapping SSTables via K-Way Min-Heap merge (discarding overwritten values and expired tombstones).',
            scalingStrategy: 'Bloom filters eliminate ~99% of unnecessary SSTable reads in RAM; OS Page Cache + Block Cache keep hot SSTable data blocks memory-resident.',
            failureHandling: 'Immutability prevents partial-page corruption on crash; CRC32 checksums per 64 KB block detect silent NVMe bit-rot and trigger replica repair.',
            techChoices: ['RocksDB / Cassandra Storage', 'Bloom Filters (10b/key)', 'Leveled Compaction'],
          },
        },
        {
          id: 'merkle-sync',
          label: 'Anti-Entropy Sync',
          sublabel: 'Merkle Tree + Repair',
          category: 'storage',
          x: 700,
          y: 278,
          width: 208,
          height: 56,
          flows: ['read'],
          details: {
            role: 'Background replica synchronization engine that heals silent divergence (e.g., if a node stayed down past the Hinted Handoff window or missed Read Repairs on cold keys).',
            dataFlow: 'Replicas sharing a vnode token range maintain a Merkle Hash Tree over sorted keys. Comparing root hashes first costs O(1); only subtrees with differing hashes descend and stream minimal mismatched keys.',
            scalingStrategy: 'Reduces cross-AZ repair network transfer by 1000× compared to full-range table scans; throttled to low I/O priority during peak traffic.',
            failureHandling: 'Runs periodically (e.g., every 24h) well inside gc_grace_seconds (e.g., 10 days) so deleted keys (tombstones) propagate to all replicas before compaction purges them — preventing Zombie Key Resurrection!',
            techChoices: ['Merkle Hash Trees', 'Background Anti-Entropy', 'Tombstone GC Grace'],
          },
        },
        {
          id: 'gossip-ring',
          label: 'Gossip & Vnode Ring',
          sublabel: 'Phi Accrual Failure',
          category: 'service',
          x: 700,
          y: 404,
          width: 208,
          height: 56,
          flows: ['read', 'write'],
          details: {
            role: 'Decentralized cluster membership, vnode ownership discovery, and probabilistic failure detection without a central master.',
            dataFlow: 'Every 1 second, each node exchanges heartbeat tables with 2–3 random peers (epidemic dissemination converges across 150 nodes in O(log M) ≈ 3–4 seconds).',
            scalingStrategy: 'Constant per-node bandwidth regardless of cluster size; seed nodes bootstrap newly joining storage instances cleanly.',
            failureHandling: 'Uses a Phi Accrual Failure Detector (continuous suspicion score Φ based on historical heartbeat inter-arrival distribution) instead of brittle binary timeouts, avoiding false failover storms during brief GC pauses.',
            techChoices: ['SWIM / Scuttlebutt Gossip', 'Phi Accrual Detector', 'Decentralized Ring Map'],
          },
        },
      ],
      edges: [
        { id: 'kv-1', from: 'clients', to: 'coordinator', label: 'RPC', flow: 'both', labelT: 0.5 },
        { id: 'kv-2', from: 'coordinator', to: 'replica-a', label: 'Quorum', flow: 'both', labelT: 0.45 },
        { id: 'kv-3', from: 'coordinator', to: 'replica-b', label: 'W/R', flow: 'both', labelT: 0.5 },
        { id: 'kv-4', from: 'coordinator', to: 'sloppy-node', label: 'Sloppy Hint', flow: 'write', async: true, labelT: 0.52 },
        { id: 'kv-5', from: 'replica-a', to: 'lsm-mem', label: 'WAL + Mem', flow: 'both', labelT: 0.5 },
        { id: 'kv-6', from: 'replica-a', to: 'sstables', label: 'Flush/Read', flow: 'both', labelT: 0.52 },
        { id: 'kv-7', from: 'replica-b', to: 'sstables', label: 'Bloom Read', flow: 'read', labelT: 0.48 },
        { id: 'kv-8', from: 'replica-b', to: 'merkle-sync', label: 'Merkle Diff', flow: 'read', async: true, labelT: 0.52 },
        {
          id: 'kv-9',
          from: 'sloppy-node',
          to: 'replica-b',
          label: 'Replay Hint',
          flow: 'write',
          async: true,
          fromSide: 'top',
          toSide: 'bottom',
          labelT: 0.5,
        },
        { id: 'kv-10', from: 'sloppy-node', to: 'gossip-ring', label: 'Gossip Sync', flow: 'both', async: true, labelT: 0.5 },
      ],
    },
    tradeOffs: [
      {
        topic: 'Consistency Tuning: Strong Quorum (W + R > N) vs. Eventual & Sloppy Quorum',
        context: 'With replication factor N = 3 across 3 AZs, every request picks write quorum W and read quorum R to trade off tail latency, availability, and freshness.',
        options: [
          {
            name: 'Strict Quorum (N = 3, W = 2, R = 2)',
            recommended: true,
            pros: [
              'Read set and write set mathematically overlap in ≥ 1 node (2 + 2 > 3), guaranteeing reads observe the latest committed write',
              'Tolerates 1 complete AZ outage without halting reads or writes',
              'Balances read and write latency evenly',
            ],
            cons: [
              'Even with W + R > N, a strict linearizability anomaly can still occur during concurrent writes or sloppy-quorum fallback without Read Repair / LWT Paxos',
            ],
            whenToChoose: 'Default production choice for user profiles, inventory metadata, and session state.',
          },
          {
            name: 'Eventual / Low-Latency (W = 1, R = 1) + Sloppy Quorum',
            pros: [
              'Fastest single-hop local-AZ p99 latency and extreme 99.999% write availability during multi-AZ partitions',
            ],
            cons: [
              'Clients may read stale values until async Read Repair or Merkle Anti-Entropy converges replicas',
              'Sloppy Quorum writes sitting on a standby node are invisible to primary-replica quorum reads until Hinted Handoff completes',
            ],
            whenToChoose: 'Shopping carts, telemetry counters, or social activity where always-writable availability beats strict freshness.',
          },
          {
            name: 'Read-Heavy Strong (W = 3, R = 1)',
            pros: ['Ultra-fast single-replica reads with strong freshness'],
            cons: ['A single downed replica blocks ALL writes — unacceptable for high-availability stores'],
            whenToChoose: 'Rare write-once configuration registries where writes can tolerate maintenance pauses.',
          },
        ],
        seniorVerdict:
          'Default to Strict Quorum (N=3, W=2, R=2) across 3 AZs with async Read Repair and Merkle Anti-Entropy, while exposing per-query consistency flags so latency-sensitive or partition-tolerant paths can opt into R=1 or Sloppy Quorum explicitly.',
      },
      {
        topic: 'Conflict Resolution: Last-Write-Wins (LWW) vs. Vector Clocks & Siblings',
        context: 'In a leaderless store, two coordinators can accept concurrent writes to the same key during a network split.',
        options: [
          {
            name: 'Last-Write-Wins (Physical Wall-Clock Timestamp)',
            pros: [
              'Simple O(1) resolution — storage engine silently keeps highest timestamp with zero client reconciliation complexity',
              'Constant metadata overhead (one 64-bit timestamp per cell)',
            ],
            cons: [
              'Silent Data Loss! NTP clock skew of even 50 ms can let an older write permanently overwrite a newer causal write',
            ],
            whenToChoose: 'Immutable/append-only time-series events, caches, or idempotent last-seen status fields (default in Cassandra).',
          },
          {
            name: 'Vector Clocks (Dotted Version Vectors) + Client/CRDT Merge',
            recommended: true,
            pros: [
              'Captures exact causal happens-before order without relying on synchronized physical clocks',
              'Detects genuine concurrent writes cleanly and surfaces sibling versions (or auto-merges via CRDTs like OR-Set shopping carts) — ZERO silent lost updates',
            ],
            cons: [
              'Clients must carry opaque causal context on writes and implement semantic conflict resolution',
              'Vector size grows with distinct writer nodes (bounded in practice by pruning oldest entries or using Dotted Version Vectors)',
            ],
            whenToChoose: 'Shopping carts, collaborative state, or financial metadata where silent lost updates are unacceptable (classic Amazon Dynamo).',
          },
        ],
        seniorVerdict:
          'Call out the NTP clock-skew flaw in LWW proactively: use LWW only when rare lost updates are acceptable or keys are single-writer, and choose Vector Clocks / Dotted Version Vectors (ideally paired with CRDT merge semantics) whenever concurrent multi-master edits must never vanish silently.',
      },
      {
        topic: 'Local Storage Engine: B-Tree (In-Place) vs. LSM-Tree (WAL + MemTable + SSTable)',
        context: '300K writes/sec cluster-wide (900K replicated local writes/sec) demands high sustained write throughput on NVMe SSDs.',
        options: [
          {
            name: 'B-Tree (PostgreSQL / InnoDB Style)',
            pros: [
              'Predictable O(log N) point & range reads via single in-place page hierarchy',
              'Zero background compaction stalls; strong row-level locking',
            ],
            cons: [
              'Random 4–16 KB in-place page writes cause severe write amplification and SSD wear under write-heavy KV workloads',
              'Fragmented pages lower storage density',
            ],
            whenToChoose: 'Read-heavy relational OLTP databases requiring complex secondary indexes and ACID transactions.',
          },
          {
            name: 'LSM-Tree (Commit Log WAL + MemTable + Immutable SSTables)',
            recommended: true,
            pros: [
              'Converts random key writes into blazing-fast sequential disk appends + RAM inserts',
              'Immutable compressed SSTables achieve 2–4× better disk space efficiency',
              'Bloom filters + Block Cache neutralize read amplification for point lookups',
            ],
            cons: [
              'Background SSTable compaction consumes disk I/O and can cause p99 latency jitter if unthrottled',
              'Deletes require Tombstones that temporarily slow range scans until compaction purges them',
            ],
            whenToChoose: 'Write-intensive distributed KV stores (Cassandra, RocksDB, ScyllaDB, DynamoDB storage nodes).',
          },
        ],
        seniorVerdict:
          'Use an LSM-Tree engine with Leveled Compaction (bounding space amplification to ~1.1× and read amplification to ≤1 SSTable per level), 10-bit/key Bloom Filters in RAM, and rate-limited compaction I/O so p99 reads stay under 10 ms.',
      },
    ],
  },
};
