import type { DayCurriculum } from '@/types/curriculum';

export const day5: DayCurriculum = {
  dayNumber: 5,
  title: 'Dynamic Programming, State Machines & Social Feeds',
  theme: 'Optimal Substructure, Behavioral State Patterns & Hybrid Fan-Out Architecture',
  status: 'complete',
  estimatedMinutes: 125,
  summary:
    'Master 1D DP, Patience Sorting binary search, 0/1 Knapsack, 2D string Edit Distance, and Tree DP; architect a thread-safe Elevator System with State & SCAN/LOOK scheduling; and design Twitter’s hybrid Fan-Out News Feed.',
  dsaLessons: [
    /* ================================================================
     * DSA 1: COIN CHANGE
     * ================================================================ */
    {
      id: 'day5-coin-change',
      dayNumber: 5,
      kind: 'dsa',
      title: 'Coin Change',
      subtitle: 'Unbounded Knapsack minimum-cardinality 1D bottom-up DP',
      difficulty: 'Medium',
      patterns: ['1D Bottom-Up DP', 'Unbounded Knapsack', 'Optimal Substructure'],
      estimatedMinutes: 14,
      leetcodeRef: 'LC #322',
      problemStatement:
        'Given an array of distinct coin denominations coins and a target integer amount, return the fewest number of coins needed to make up that exact amount. If impossible, return -1. You have an infinite supply of each coin.',
      exampleSummary: {
        input: 'coins = [1, 2, 5], amount = 6',
        output: '2',
        explanation:
          'Optimal combination is 5 + 1 = 6 (2 coins). Notice greedy works for US coins, but fails on [1, 3, 4] for amount = 6 (greedy picks 4+1+1 = 3 coins; DP finds 3+3 = 2 coins).',
      },
      patternRecognition: {
        interviewCue:
          'First test whether Greedy breaks on a small counterexample like coins = [1, 3, 4], amount = 6. The moment local optimal choices fail to guarantee global optimality and subproblems repeat across overlapping amounts, formalize a DP state.',
        signals: [
          'Keywords: "fewest / minimum number of items to reach exact target"',
          'Unlimited reuse of items → Unbounded Knapsack (forward loop over capacity)',
          'Subproblem overlap: multiple coin paths converge on the exact same remaining amount',
        ],
        mentalModel:
          'Let dp[a] = minimum coins required to form exact sum a. To build dp[a], test every coin c ≤ a as the LAST coin added: dp[a] = min(dp[a], 1 + dp[a - c]).',
      },
      intuitionComparison: {
        bruteForce: {
          approach:
            'DFS/Recursion trying every coin at each remaining amount without memoization, exploring an exponential branching tree.',
          timeComplexity: 'O(k^amount)',
          spaceComplexity: 'O(amount) recursion stack',
          bottleneck:
            'Recomputes the exact same subproblem solve(rem) exponentially many times via different coin permutations.',
        },
        optimal: {
          approach:
            'Allocate dp[0..amount] filled with sentinel (amount + 1) and dp[0] = 0. Iterate a from 1 to amount, relaxing dp[a] across all coins c ≤ a.',
          timeComplexity: 'O(amount × k)',
          spaceComplexity: 'O(amount)',
          keyInvariant:
            'When computing dp[a], every smaller subproblem dp[a - c] is already finalized to its true global minimum.',
        },
      },
      visualizer: {
        kind: 'dp-1d-stack-heap',
        title: '1D Bottom-Up DP Table Dry Run',
        inputSummary: 'coins = [1, 2, 5], amount = 6',
        steps: [
          {
            caption:
              'Initialize dp[0] = 0 (zero coins make sum 0) and all other slots to sentinel ∞ (amount + 1 = 7) to represent unreachable states safely without integer overflow.',
            recurrence: 'dp[a] = min_{c ∈ coins, c ≤ a} (1 + dp[a - c])',
            concreteFormula: 'Base: dp[0] = 0, dp[1..6] = ∞',
            inputItems: { label: 'Available Coins', values: [1, 2, 5] },
            primaryArray: {
              label: 'dp[amount] — Min Coins',
              values: [0, '∞', '∞', '∞', '∞', '∞', '∞'],
              activeIndex: 0,
            },
            variables: [
              { name: 'amount', value: '0' },
              { name: 'sentinel', value: '7 (∞)' },
            ],
          },
          {
            caption:
              'Compute dp[1]: only coin 1 fits (1 ≤ 1). Depends on dp[1 - 1] = dp[0] = 0 → dp[1] = 1 + 0 = 1.',
            recurrence: 'dp[a] = min(1 + dp[a - c])',
            concreteFormula: 'dp[1] = 1 + dp[0] = 1 + 0 = 1',
            inputItems: { label: 'Available Coins', values: [1, 2, 5], activeIndex: 0 },
            primaryArray: {
              label: 'dp[amount] — Min Coins',
              values: [0, 1, '∞', '∞', '∞', '∞', '∞'],
              activeIndex: 1,
              dependencyIndices: [{ index: 0, label: '-1' }],
            },
            variables: [
              { name: 'a', value: '1' },
              { name: 'bestCoin', value: '1', tone: 'primary' },
              { name: 'dp[1]', value: '1', tone: 'emerald' },
            ],
          },
          {
            caption:
              'Compute dp[2]: coin 1 gives 1 + dp[1] = 2; coin 2 gives 1 + dp[0] = 1. Taking the minimum yields dp[2] = 1 (single 2-coin).',
            recurrence: 'dp[2] = min(1 + dp[1], 1 + dp[0])',
            concreteFormula: 'dp[2] = min(1 + 1, 1 + 0) = 1',
            inputItems: { label: 'Available Coins', values: [1, 2, 5], activeIndex: 1 },
            primaryArray: {
              label: 'dp[amount] — Min Coins',
              values: [0, 1, 1, '∞', '∞', '∞', '∞'],
              activeIndex: 2,
              dependencyIndices: [
                { index: 1, label: '-1' },
                { index: 0, label: '-2' },
              ],
            },
            variables: [
              { name: 'a', value: '2' },
              { name: 'bestCoin', value: '2', tone: 'primary' },
              { name: 'dp[2]', value: '1', tone: 'emerald' },
            ],
          },
          {
            caption:
              'Compute dp[3]: coin 1 → 1 + dp[2] = 2; coin 2 → 1 + dp[1] = 2. Both tie at 2 coins (2+1).',
            recurrence: 'dp[3] = min(1 + dp[2], 1 + dp[1])',
            concreteFormula: 'dp[3] = min(1 + 1, 1 + 1) = 2',
            inputItems: { label: 'Available Coins', values: [1, 2, 5] },
            primaryArray: {
              label: 'dp[amount] — Min Coins',
              values: [0, 1, 1, 2, '∞', '∞', '∞'],
              activeIndex: 3,
              dependencyIndices: [
                { index: 2, label: '-1' },
                { index: 1, label: '-2' },
              ],
            },
            variables: [
              { name: 'a', value: '3' },
              { name: 'dp[3]', value: '2', tone: 'emerald' },
            ],
          },
          {
            caption:
              'Compute dp[4]: coin 1 → 1 + dp[3] = 3; coin 2 → 1 + dp[2] = 2. Coin 2 wins, yielding dp[4] = 2 (2+2).',
            recurrence: 'dp[4] = min(1 + dp[3], 1 + dp[2])',
            concreteFormula: 'dp[4] = min(1 + 2, 1 + 1) = 2',
            inputItems: { label: 'Available Coins', values: [1, 2, 5], activeIndex: 1 },
            primaryArray: {
              label: 'dp[amount] — Min Coins',
              values: [0, 1, 1, 2, 2, '∞', '∞'],
              activeIndex: 4,
              dependencyIndices: [
                { index: 3, label: '-1' },
                { index: 2, label: '-2' },
              ],
            },
            variables: [
              { name: 'a', value: '4' },
              { name: 'bestCoin', value: '2', tone: 'primary' },
              { name: 'dp[4]', value: '2', tone: 'emerald' },
            ],
          },
          {
            caption:
              'Compute dp[5]: now coin 5 unlocks! Candidates: 1+dp[4]=3, 1+dp[3]=3, 1+dp[0]=1. Coin 5 collapses dp[5] to 1.',
            recurrence: 'dp[5] = min(1 + dp[4], 1 + dp[3], 1 + dp[0])',
            concreteFormula: 'dp[5] = min(3, 3, 1 + 0) = 1',
            inputItems: { label: 'Available Coins', values: [1, 2, 5], activeIndex: 2 },
            primaryArray: {
              label: 'dp[amount] — Min Coins',
              values: [0, 1, 1, 2, 2, 1, '∞'],
              activeIndex: 5,
              dependencyIndices: [
                { index: 4, label: '-1' },
                { index: 3, label: '-2' },
                { index: 0, label: '-5' },
              ],
            },
            variables: [
              { name: 'a', value: '5' },
              { name: 'bestCoin', value: '5', tone: 'primary' },
              { name: 'dp[5]', value: '1', tone: 'emerald' },
            ],
          },
          {
            caption:
              'Compute final dp[6]: coin 1 → 1+dp[5]=2, coin 2 → 1+dp[4]=3, coin 5 → 1+dp[1]=2. Optimal answer is dp[6] = 2 coins (5 + 1).',
            recurrence: 'dp[6] = min(1 + dp[5], 1 + dp[4], 1 + dp[1])',
            concreteFormula: 'dp[6] = min(1 + 1, 1 + 2, 1 + 1) = 2 (Optimal!)',
            inputItems: { label: 'Available Coins', values: [1, 2, 5], activeIndex: 2 },
            primaryArray: {
              label: 'dp[amount] — Min Coins',
              values: [0, 1, 1, 2, 2, 1, 2],
              activeIndex: 6,
              dependencyIndices: [
                { index: 5, label: '-1' },
                { index: 4, label: '-2' },
                { index: 1, label: '-5' },
              ],
            },
            variables: [
              { name: 'a', value: '6' },
              { name: 'dp[6]', value: '2', tone: 'emerald' },
              { name: 'answer', value: '2 (5 + 1)', tone: 'emerald' },
            ],
          },
        ],
      },
      javaSolution: {
        filename: 'CoinChange.java',
        code: `import java.util.Arrays;

public class CoinChange {
    public int coinChange(int[] coins, int amount) {
        if (amount == 0) {
            return 0;
        }

        // Sentinel amount + 1 is strictly larger than any valid answer (max = amount of 1-coins)
        int sentinel = amount + 1;
        int[] dp = new int[amount + 1];
        Arrays.fill(dp, sentinel);
        dp[0] = 0;

        for (int coin : coins) {
            for (int a = coin; a <= amount; a++) {
                // Forward loop allows unlimited reuse of the same coin
                dp[a] = Math.min(dp[a], dp[a - coin] + 1);
            }
        }

        return dp[amount] > amount ? -1 : dp[amount];
    }
}`,
        callouts: [
          {
            id: 'cc-sentinel',
            startLine: 10,
            endLine: 12,
            title: 'Sentinel (amount + 1) Beats Integer.MAX_VALUE',
            explanation:
              'Never fill dp[] with Integer.MAX_VALUE because dp[a - coin] + 1 silently wraps around to Integer.MIN_VALUE! Using amount + 1 is mathematically safe from overflow and eliminates an extra guard branch.',
            accent: 'amber',
          },
          {
            id: 'cc-loop-order',
            startLine: 15,
            endLine: 20,
            title: 'Coin Outer Loop + Forward Amount Inner Loop',
            explanation:
              'Starting the inner loop at a = coin avoids an explicit if (coin <= a) check inside the hot loop, improves CPU branch prediction, and naturally handles unbounded reuse because dp[a - coin] may already include coin.',
            accent: 'emerald',
          },
        ],
      },
      complexity: {
        time: 'O(amount × k)',
        space: 'O(amount)',
        timeExplanation:
          'k = coins.length outer iterations × up to amount inner iterations, each performing one constant-time min operation.',
        spaceExplanation: 'Single 1D array of size amount + 1.',
      },
      edgeCases: [
        {
          title: 'Unreachable Target (coins = [2], amount = 3)',
          scenario: 'No combination sums to 3.',
          handling: 'dp[3] remains sentinel (4 > 3), cleanly mapped to -1 at return.',
        },
        {
          title: 'Follow-Up: Coin Change II (Count Combinations vs. Permutations)',
          scenario: 'Interviewers love contrasting LC #322 (min coins) with LC #518 (number of distinct combinations).',
          handling:
            'For counting COMBINATIONS, the coin loop MUST be outside the amount loop (so [1,2] is counted once, never [2,1]). For counting PERMUTATIONS (Combination Sum IV), put amount outside and coins inside!',
        },
        {
          title: 'Reconstructing the Actual Coins Used',
          scenario: 'Senior follow-up: "Return the exact list of coins, not just the count."',
          handling:
            'Keep a parallel int[] lastCoin = new int[amount + 1]; whenever dp[a] improves, set lastCoin[a] = coin, then walk backwards cur -= lastCoin[cur] from amount to 0.',
        },
      ],
    },

    /* ================================================================
     * DSA 2: LONGEST INCREASING SUBSEQUENCE
     * ================================================================ */
    {
      id: 'day5-lis',
      dayNumber: 5,
      kind: 'dsa',
      title: 'Longest Increasing Subsequence',
      subtitle: 'From O(n²) DP recurrence to O(n log n) Patience Sorting with Binary Search',
      difficulty: 'Medium',
      patterns: ['DP + Binary Search', 'Patience Sorting', 'Monotonic Tails'],
      estimatedMinutes: 15,
      leetcodeRef: 'LC #300',
      problemStatement:
        'Given an integer array nums, return the length of the longest strictly increasing subsequence (elements preserve relative order but need not be contiguous).',
      exampleSummary: {
        input: 'nums = [10, 9, 2, 5, 3, 7, 101, 18]',
        output: '4',
        explanation:
          'A longest strictly increasing subsequence is [2, 3, 7, 18] (or [2, 3, 7, 101]), both of length 4.',
      },
      patternRecognition: {
        interviewCue:
          'First state the O(n²) DP clearly (dp[i] = longest LIS ending at i), then immediately volunteer the 4.5-YOE upgrade: maintain tails[len] = smallest possible tail element of any increasing subsequence of length len + 1, which stays strictly sorted and unlocks binary search.',
        signals: [
          'Longest strictly/non-decreasing subsequence, Russian Doll Envelopes, Box Stacking',
          'n up to 10⁵ makes O(n²) TLE — demands O(n log n)',
          'Greedy insight: among two increasing subsequences of equal length k, only the one with the SMALLER ending value can extend more future elements',
        ],
        mentalModel:
          'Maintain tails[] where tails[k] is the minimum ending number of an increasing subsequence of length k + 1. For each x in nums, binary search the leftmost slot tails[pos] >= x: replace it if found (strictly tightening future extendability), or append x if x > all tails (growing LIS length by 1).',
      },
      intuitionComparison: {
        bruteForce: {
          approach:
            'Classic O(n²) DP: for each i, scan every j < i where nums[j] < nums[i] and set dp[i] = max(dp[i], dp[j] + 1).',
          timeComplexity: 'O(n²)',
          spaceComplexity: 'O(n)',
          bottleneck:
            'Linearly re-scans all previous indices j < i even though only the minimum tail value per length actually matters.',
        },
        optimal: {
          approach:
            'Maintain a strictly increasing tails[] array of active length size. For each num, binary search (lower_bound) its insertion index in tails[0..size-1] and overwrite (or append if pos == size).',
          timeComplexity: 'O(n log n)',
          spaceComplexity: 'O(n)',
          keyInvariant:
            'tails[0..size-1] is ALWAYS strictly increasing, and size equals the exact LIS length over the prefix seen so far.',
        },
      },
      visualizer: {
        kind: 'dp-1d-stack-heap',
        title: 'O(n log n) Patience Sorting tails[] Binary Search Dry Run',
        inputSummary: 'nums = [10, 9, 2, 5, 3, 7, 101, 18]',
        steps: [
          {
            caption:
              'Process nums[0] = 10: tails is empty, so append 10 at index 0. Best length-1 subsequence currently ends at 10.',
            recurrence: 'pos = lowerBound(tails, 0, size, x); tails[pos] = x',
            concreteFormula: 'x = 10 → append at pos = 0 → tails = [10], size = 1',
            inputItems: { label: 'Input nums[]', values: [10, 9, 2, 5, 3, 7, 101, 18], activeIndex: 0 },
            primaryArray: {
              label: 'tails[] (min ending value for length idx + 1)',
              indices: ['len 1'],
              values: [10],
              activeIndex: 0,
              pointers: [{ label: 'pos', index: 0, tone: 'primary' }],
            },
            variables: [
              { name: 'x', value: '10' },
              { name: 'pos', value: '0' },
              { name: 'LIS size', value: '1', tone: 'emerald' },
            ],
          },
          {
            caption:
              'Process nums[1] = 9: lowerBound(9) finds pos = 0 (10 ≥ 9). Replace 10 with 9! A length-1 subsequence ending in 9 is strictly easier to extend than one ending in 10.',
            recurrence: 'Replace first tails[pos] >= x to lower future threshold',
            concreteFormula: 'x = 9 → lowerBound = 0 → tails[0] = 9',
            inputItems: { label: 'Input nums[]', values: [10, 9, 2, 5, 3, 7, 101, 18], activeIndex: 1, processedUntil: 1 },
            primaryArray: {
              label: 'tails[] (min ending value for length idx + 1)',
              indices: ['len 1'],
              values: [9],
              activeIndex: 0,
              pointers: [{ label: 'replace', index: 0, tone: 'amber' }],
            },
            variables: [
              { name: 'x', value: '9' },
              { name: 'pos', value: '0' },
              { name: 'LIS size', value: '1' },
            ],
          },
          {
            caption:
              'Process nums[2] = 2: lowerBound(2) finds pos = 0 (9 ≥ 2). Tighten tails[0] = 2.',
            recurrence: 'Replace first tails[pos] >= x',
            concreteFormula: 'x = 2 → lowerBound = 0 → tails[0] = 2',
            inputItems: { label: 'Input nums[]', values: [10, 9, 2, 5, 3, 7, 101, 18], activeIndex: 2, processedUntil: 2 },
            primaryArray: {
              label: 'tails[] (min ending value for length idx + 1)',
              indices: ['len 1'],
              values: [2],
              activeIndex: 0,
              pointers: [{ label: 'replace', index: 0, tone: 'amber' }],
            },
            variables: [
              { name: 'x', value: '2' },
              { name: 'pos', value: '0' },
              { name: 'LIS size', value: '1' },
            ],
          },
          {
            caption:
              'Process nums[3] = 5: 5 > tails[0] (2), so lowerBound returns pos = size = 1. Append 5! We now have an increasing subsequence [2, 5] of length 2.',
            recurrence: 'If x > tails[size - 1], append and increment size',
            concreteFormula: 'x = 5 > 2 → append at pos = 1 → tails = [2, 5], size = 2',
            inputItems: { label: 'Input nums[]', values: [10, 9, 2, 5, 3, 7, 101, 18], activeIndex: 3, processedUntil: 3 },
            primaryArray: {
              label: 'tails[] (min ending value for length idx + 1)',
              indices: ['len 1', 'len 2'],
              values: [2, 5],
              activeIndex: 1,
              dependencyIndices: [{ index: 0, label: '< 5' }],
              pointers: [{ label: 'append', index: 1, tone: 'emerald' }],
            },
            variables: [
              { name: 'x', value: '5' },
              { name: 'pos', value: '1' },
              { name: 'LIS size', value: '2', tone: 'emerald' },
            ],
          },
          {
            caption:
              'Process nums[4] = 3: Binary search [2, 5] finds pos = 1 (5 ≥ 3). Overwrite tails[1] = 3! Now length-2 subsequences can end as low as 3 ([2, 3]) instead of 5.',
            recurrence: 'lo=0, hi=2 → mid=1 (5 ≥ 3) → hi=1 → pos=1',
            concreteFormula: 'x = 3 → replace tails[1] = 3 → tails = [2, 3]',
            inputItems: { label: 'Input nums[]', values: [10, 9, 2, 5, 3, 7, 101, 18], activeIndex: 4, processedUntil: 4 },
            primaryArray: {
              label: 'tails[] (min ending value for length idx + 1)',
              indices: ['len 1', 'len 2'],
              values: [2, 3],
              activeIndex: 1,
              pointers: [{ label: 'lo=hi=1', index: 1, tone: 'amber' }],
            },
            variables: [
              { name: 'x', value: '3' },
              { name: 'pos', value: '1' },
              { name: 'LIS size', value: '2' },
            ],
          },
          {
            caption:
              'Process nums[5] = 7: 7 > tails[1] (3) → append at pos = 2. Then nums[6] = 101 > 7 → append at pos = 3. tails = [2, 3, 7, 101], size = 4!',
            recurrence: 'Append strictly larger elements to extend max length',
            concreteFormula: 'x = 7, then x = 101 → tails = [2, 3, 7, 101], size = 4',
            inputItems: { label: 'Input nums[]', values: [10, 9, 2, 5, 3, 7, 101, 18], activeIndex: 6, processedUntil: 6 },
            primaryArray: {
              label: 'tails[] (min ending value for length idx + 1)',
              indices: ['len 1', 'len 2', 'len 3', 'len 4'],
              values: [2, 3, 7, 101],
              activeIndex: 3,
              dependencyIndices: [{ index: 2, label: '< 101' }],
              pointers: [{ label: 'append', index: 3, tone: 'emerald' }],
            },
            variables: [
              { name: 'x', value: '101' },
              { name: 'pos', value: '3' },
              { name: 'LIS size', value: '4', tone: 'emerald' },
            ],
          },
          {
            caption:
              'Process final nums[7] = 18: Binary search finds pos = 3 (101 ≥ 18). Replace tails[3] = 18. Final tails = [2, 3, 7, 18] → LIS length = 4!',
            recurrence: 'lowerBound([2,3,7,101], 18) = 3 → replace',
            concreteFormula: 'x = 18 → tails[3] = 18 → Answer = size = 4',
            inputItems: { label: 'Input nums[]', values: [10, 9, 2, 5, 3, 7, 101, 18], activeIndex: 7, processedUntil: 7 },
            primaryArray: {
              label: 'tails[] (min ending value for length idx + 1)',
              indices: ['len 1', 'len 2', 'len 3', 'len 4'],
              values: [2, 3, 7, 18],
              activeIndex: 3,
              pointers: [{ label: 'replace', index: 3, tone: 'emerald' }],
            },
            variables: [
              { name: 'x', value: '18' },
              { name: 'LIS size', value: '4', tone: 'emerald' },
            ],
          },
        ],
      },
      javaSolution: {
        filename: 'LongestIncreasingSubsequence.java',
        code: `public class LongestIncreasingSubsequence {
    public int lengthOfLIS(int[] nums) {
        if (nums == null || nums.length == 0) {
            return 0;
        }

        // tails[len] = smallest possible ending element of an IS of length (len + 1)
        int[] tails = new int[nums.length];
        int size = 0;

        for (int num : nums) {
            int lo = 0;
            int hi = size;

            // Lower bound: first index in [0, size) with tails[mid] >= num
            while (lo < hi) {
                int mid = lo + (hi - lo) / 2;
                if (tails[mid] < num) {
                    lo = mid + 1;
                } else {
                    hi = mid;
                }
            }

            tails[lo] = num;
            if (lo == size) {
                size++;
            }
        }

        return size;
    }
}`,
        callouts: [
          {
            id: 'lis-strict',
            startLine: 16,
            endLine: 23,
            title: 'Strict vs. Non-Decreasing Variant (Single Character Diff)',
            explanation:
              'Using tails[mid] < num finds the first slot >= num (lower_bound), enforcing STRICTLY increasing subsequences (duplicates overwrite themselves instead of extending). Changing < to <= switches to Longest Non-Decreasing Subsequence (upper_bound)!',
            accent: 'amber',
          },
          {
            id: 'lis-extend',
            startLine: 25,
            endLine: 28,
            title: 'Append vs. In-Place Tightening',
            explanation:
              'When lo == size, num is strictly larger than every existing tail, extending our longest subsequence by 1. Otherwise, overwriting tails[lo] keeps size intact while making future extensions strictly easier.',
            accent: 'emerald',
          },
        ],
      },
      complexity: {
        time: 'O(n log n)',
        space: 'O(n)',
        timeExplanation:
          'Each of the n elements executes one binary search over tails[0..size-1], taking at most ⌈log₂ n⌉ comparisons.',
        spaceExplanation: 'The tails array holds at most n integers (can be updated in-place on nums if mutation is permitted for O(1) extra space).',
      },
      edgeCases: [
        {
          title: 'Senior Trap: Is tails[] Always a Valid LIS?',
          scenario: 'Try nums = [2, 5, 3, 1]. After finishing, tails = [1, 3], which is NOT a valid subsequence of [2, 5, 3, 1]!',
          handling:
            'Explain clearly: tails[] tracks the MINIMUM POSSIBLE END VALUE for each length, not a single coherent path. To reconstruct an actual LIS in O(n log n), store tailIndices[] plus a parent[] pointer array linking each element to tailIndices[lo - 1].',
        },
        {
          title: 'Duplicate Values ([7, 7, 7, 7])',
          scenario: 'Strictly increasing requires nums[i] < nums[j].',
          handling: 'lower_bound keeps returning lo = 0 and overwriting tails[0] = 7, accurately returning 1.',
        },
        {
          title: '2D Follow-Up: Russian Doll Envelopes (LC #354)',
          scenario: 'Envelopes have (width, height) and nest only if BOTH strictly increase.',
          handling: 'Sort by width ASC, then height DESC (so equal-width envelopes can never chain!), then run this exact O(n log n) LIS on heights.',
        },
      ],
    },

    /* ================================================================
     * DSA 3: PARTITION EQUAL SUBSET SUM (0/1 KNAPSACK)
     * ================================================================ */
    {
      id: 'day5-partition-equal-subset',
      dayNumber: 5,
      kind: 'dsa',
      title: 'Partition Equal Subset Sum (0/1 Knapsack)',
      subtitle: 'Boolean 0/1 Knapsack 2D recurrence and reverse-loop 1D space compression',
      difficulty: 'Medium',
      patterns: ['0/1 Knapsack', '2D Boolean DP', '1D Reverse Space Compression'],
      estimatedMinutes: 15,
      leetcodeRef: 'LC #416',
      problemStatement:
        'Given an array of positive integers nums, determine if it can be partitioned into two disjoint subsets whose elements have the exact same sum.',
      exampleSummary: {
        input: 'nums = [2, 3, 5, 4]',
        output: 'true',
        explanation:
          'Total sum = 14 (even) → target = 7. Subset {2, 5} sums to 7 and the remaining subset {3, 4} also sums to 7.',
      },
      patternRecognition: {
        interviewCue:
          'Splitting an array into two equal-sum halves reduces immediately to Subset Sum(target = totalSum / 2). Whenever each item can be taken AT MOST ONCE to hit a bounded target sum, it is canonical 0/1 Knapsack.',
        signals: [
          'Partition into equal halves / minimize subset sum difference / target sum ± assignment',
          'Each element used 0 or 1 times (unlike Coin Change’s infinite reuse)',
          'If totalSum is odd, return false immediately in O(n)',
        ],
        mentalModel:
          'dp[i][s] = true iff some subset of the first i items sums to exact total s. For item x = nums[i-1], either EXCLUDE it (dp[i-1][s]) or INCLUDE it (dp[i-1][s - x] when s ≥ x).',
      },
      intuitionComparison: {
        bruteForce: {
          approach: 'Backtracking branching include/exclude on every index to test if any subset sums to total / 2.',
          timeComplexity: 'O(2^n)',
          spaceComplexity: 'O(n) recursion stack',
          bottleneck: 'Explores distinct subsets that collapse to the exact same (index, remainingSum) state.',
        },
        optimal: {
          approach:
            '2D DP dp[i][s] = dp[i-1][s] || dp[i-1][s - x], then compress row-by-row into a 1D boolean[target + 1] array iterated BACKWARDS from target down to x.',
          timeComplexity: 'O(n × target)',
          spaceComplexity: 'O(target) with 1D compression',
          keyInvariant:
            'Iterating s from target DOWN to x ensures dp[s - x] still holds row (i - 1)’s value, preventing an item from being picked twice in the same row!',
        },
      },
      visualizer: {
        kind: 'dp-table-2d',
        title: '0/1 Knapsack 2D Subset-Sum DP Table',
        inputSummary: 'nums = [2, 3, 5, 4], total = 14 → target = 7',
        rowAxisLabel: 'Item',
        colAxisLabel: 'Sum s',
        rowHeaders: ['∅', '+2', '+3', '+5', '+4'],
        colHeaders: ['0', '1', '2', '3', '4', '5', '6', '7'],
        steps: [
          {
            caption:
              'Base row i = 0 (no items): only sum 0 is reachable (empty subset → T). Every positive sum s ∈ [1..7] is F.',
            recurrence: 'dp[i][s] = dp[i-1][s] (Exclude) OR dp[i-1][s - num] (Include)',
            concreteFormula: 'Base: dp[0][0] = T, dp[0][1..7] = F',
            grid: [
              ['T', 'F', 'F', 'F', 'F', 'F', 'F', 'F'],
              [null, null, null, null, null, null, null, null],
              [null, null, null, null, null, null, null, null],
              [null, null, null, null, null, null, null, null],
              [null, null, null, null, null, null, null, null],
            ],
            activeCell: { row: 0, col: 0 },
            variables: [
              { name: 'target', value: '7' },
              { name: 'dp[0][0]', value: 'true', tone: 'emerald' },
            ],
          },
          {
            caption:
              'Row 1 (num = 2): at s = 2, Exclude looks up dp[0][2]=F, while Include looks up dp[0][2-2=0]=T! Thus dp[1][2] = T ({2}).',
            recurrence: 'dp[1][2] = dp[0][2] || dp[0][2 - 2]',
            concreteFormula: 'dp[1][2] = F (Excl) || T (Incl: dp[0][0]) = T',
            grid: [
              ['T', 'F', 'F', 'F', 'F', 'F', 'F', 'F'],
              ['T', 'F', 'T', 'F', 'F', 'F', 'F', 'F'],
              [null, null, null, null, null, null, null, null],
              [null, null, null, null, null, null, null, null],
              [null, null, null, null, null, null, null, null],
            ],
            activeCell: { row: 1, col: 2 },
            dependencyCells: [
              { row: 0, col: 2, label: 'Excl', tone: 'rose' },
              { row: 0, col: 0, label: 'Incl', tone: 'emerald' },
            ],
            variables: [
              { name: 'num', value: '2' },
              { name: 's', value: '2' },
              { name: 'dp[1][2]', value: 'true', tone: 'emerald' },
            ],
          },
          {
            caption:
              'Row 2 (num = 3): sums 0 and 2 carry down via Exclude; Include unlocks s = 3 (from dp[1][0]=T) and s = 5 (from dp[1][2]=T → {2, 3})!',
            recurrence: 'dp[2][5] = dp[1][5] || dp[1][5 - 3]',
            concreteFormula: 'dp[2][5] = F (Excl) || T (Incl: dp[1][2]) = T',
            grid: [
              ['T', 'F', 'F', 'F', 'F', 'F', 'F', 'F'],
              ['T', 'F', 'T', 'F', 'F', 'F', 'F', 'F'],
              ['T', 'F', 'T', 'T', 'F', 'T', 'F', 'F'],
              [null, null, null, null, null, null, null, null],
              [null, null, null, null, null, null, null, null],
            ],
            activeCell: { row: 2, col: 5 },
            dependencyCells: [
              { row: 1, col: 5, label: 'Excl', tone: 'rose' },
              { row: 1, col: 2, label: 'Incl', tone: 'emerald' },
            ],
            variables: [
              { name: 'num', value: '3' },
              { name: 's', value: '5' },
              { name: 'subset', value: '{2, 3}', tone: 'emerald' },
            ],
          },
          {
            caption:
              'Row 3 (num = 5): at target s = 7, Exclude dp[2][7] is F, but Include checks dp[2][7 - 5] = dp[2][2] = T! Target sum 7 is REACHED via {2, 5}!',
            recurrence: 'dp[3][7] = dp[2][7] || dp[2][7 - 5]',
            concreteFormula: 'dp[3][7] = F (Excl) || T (Incl: dp[2][2]) = T  ✓',
            grid: [
              ['T', 'F', 'F', 'F', 'F', 'F', 'F', 'F'],
              ['T', 'F', 'T', 'F', 'F', 'F', 'F', 'F'],
              ['T', 'F', 'T', 'T', 'F', 'T', 'F', 'F'],
              ['T', 'F', 'T', 'T', 'F', 'T', 'F', 'T'],
              [null, null, null, null, null, null, null, null],
            ],
            activeCell: { row: 3, col: 7 },
            dependencyCells: [
              { row: 2, col: 7, label: 'Excl', tone: 'rose' },
              { row: 2, col: 2, label: 'Incl', tone: 'emerald' },
            ],
            variables: [
              { name: 'num', value: '5' },
              { name: 's', value: '7 (target)' },
              { name: 'dp[3][7]', value: 'true!', tone: 'emerald' },
            ],
          },
          {
            caption:
              'Row 4 (num = 4): dp[4][7] stays true (in fact BOTH Exclude {2,5} and Include dp[3][3]→{3,4} work). Early-exit as soon as dp[target] flips true! Partition confirmed.',
            recurrence: 'Answer = dp[n][target] = dp[4][7]',
            concreteFormula: 'dp[4][7] = T → Partition {2, 5} & {3, 4} both sum to 7',
            grid: [
              ['T', 'F', 'F', 'F', 'F', 'F', 'F', 'F'],
              ['T', 'F', 'T', 'F', 'F', 'F', 'F', 'F'],
              ['T', 'F', 'T', 'T', 'F', 'T', 'F', 'F'],
              ['T', 'F', 'T', 'T', 'F', 'T', 'F', 'T'],
              ['T', 'F', 'T', 'T', 'T', 'T', 'T', 'T'],
            ],
            activeCell: { row: 4, col: 7 },
            pathCells: [
              { row: 0, col: 0 },
              { row: 1, col: 2 },
              { row: 2, col: 2 },
              { row: 3, col: 7 },
              { row: 4, col: 7 },
            ],
            variables: [
              { name: 'partition A', value: '{2, 5} = 7', tone: 'emerald' },
              { name: 'partition B', value: '{3, 4} = 7', tone: 'emerald' },
              { name: 'result', value: 'true', tone: 'emerald' },
            ],
          },
        ],
      },
      javaSolution: {
        filename: 'PartitionEqualSubsetSum.java',
        code: `public class PartitionEqualSubsetSum {
    public boolean canPartition(int[] nums) {
        if (nums == null || nums.length < 2) {
            return false;
        }

        int totalSum = 0;
        int maxVal = 0;
        for (int num : nums) {
            totalSum += num;
            maxVal = Math.max(maxVal, num);
        }

        // Odd sum or single dominant element cannot be split evenly
        if ((totalSum & 1) == 1) {
            return false;
        }
        int target = totalSum / 2;
        if (maxVal > target) {
            return false;
        }

        boolean[] dp = new boolean[target + 1];
        dp[0] = true;

        for (int num : nums) {
            // CRITICAL: iterate backwards so each item is used AT MOST ONCE (0/1 Knapsack)
            for (int s = target; s >= num; s--) {
                dp[s] = dp[s] || dp[s - num];
            }
            if (dp[target]) {
                return true; // Early exit once target becomes reachable
            }
        }

        return dp[target];
    }
}`,
        callouts: [
          {
            id: 'pes-prune',
            startLine: 15,
            endLine: 21,
            title: 'O(n) Fast Rejections',
            explanation:
              'Checking odd totalSum AND maxVal > target immediately rejects impossible inputs (like [1, 2, 100]) before even allocating the DP array.',
            accent: 'primary',
          },
          {
            id: 'pes-reverse',
            startLine: 27,
            endLine: 30,
            title: 'Why the Reverse Inner Loop Is Non-Negotiable',
            explanation:
              'If you looped s from num UP to target, writing dp[s] = true would contaminate dp[s + num] later in the SAME item iteration — turning 0/1 Knapsack into Unbounded Knapsack (Coin Change)!',
            accent: 'amber',
          },
          {
            id: 'pes-early',
            startLine: 31,
            endLine: 33,
            title: 'Short-Circuit on Target Reached',
            explanation:
              'Once dp[target] becomes true, no later item can unset it, so returning immediately saves substantial work on dense inputs.',
            accent: 'emerald',
          },
        ],
      },
      complexity: {
        time: 'O(n × target)',
        space: 'O(target)',
        timeExplanation:
          'Pseudo-polynomial: n items × up to (totalSum / 2) inner transitions. With Java BigInteger bitsets (bits = bits.or(bits.shiftLeft(num))), word-level parallelism speeds this up ~64× in practice!',
        spaceExplanation: 'Compressed from O(n × target) to a single 1D boolean[target + 1] array.',
      },
      edgeCases: [
        {
          title: 'Bitset Optimization Follow-Up (Staff-Level Polish)',
          scenario: 'What if target is 10,000 and we want 64× lower constant factor?',
          handling:
            'Represent boolean[] dp as a bitset (BigInteger or long[] word array): adding num is literally dp |= (dp << num), and checking bit target is O(1).',
        },
        {
          title: 'Single Element Greater Than Half ([1, 1, 5])',
          scenario: 'Sum is 7 (odd), or [1, 1, 6] where sum is 8 (even) and target is 4, yet maxVal = 6 > 4.',
          handling: 'The maxVal > target check handles [1, 1, 6] in O(n) without running DP.',
        },
        {
          title: 'What If Numbers Can Be Negative or Partition Into k Subsets?',
          scenario: 'Follow-up LC #698 (Partition to K Equal Sum Subsets).',
          handling: 'For small n ≤ 16 and arbitrary k, use bitmask DP dp[mask] = currentBucketRemainder in O(n · 2^n).',
        },
      ],
    },

    /* ================================================================
     * DSA 4: EDIT DISTANCE (LEVENSHTEIN)
     * ================================================================ */
    {
      id: 'day5-edit-distance',
      dayNumber: 5,
      kind: 'dsa',
      title: 'Edit Distance',
      subtitle: 'Classic 2D prefix-alignment DP modeling Insert, Delete, and Replace transitions',
      difficulty: 'Medium',
      patterns: ['2D String DP', 'Prefix Alignment', 'Space Rolling Array'],
      estimatedMinutes: 16,
      leetcodeRef: 'LC #72',
      problemStatement:
        'Given two strings word1 and word2, return the minimum number of single-character operations (Insert, Delete, or Replace) required to convert word1 into word2.',
      exampleSummary: {
        input: 'word1 = "horse", word2 = "ros"',
        output: '3',
        explanation:
          'horse → rorse (replace "h" with "r") → rose (delete "r") → ros (delete "e").',
      },
      patternRecognition: {
        interviewCue:
          'Whenever two strings must be aligned, matched, interleaved, or transformed character-by-character, define dp[i][j] on prefixes word1[0..i-1] and word2[0..j-1] and inspect the last pair (word1[i-1], word2[j-1]).',
        signals: [
          'Two input sequences (LCS, Edit Distance, Distinct Subsequences, Interleaving String)',
          'Three directional dependencies in a 2D table: diagonal (i-1, j-1), top (i-1, j), and left (i, j-1)',
          'Base cases along row 0 and col 0 represent transforming to/from the empty string ""',
        ],
        mentalModel:
          'Compare last characters a = word1[i-1] and b = word2[j-1]. If a == b, pay 0 and inherit diagonal dp[i-1][j-1]. If a != b, pay 1 + best of: Replace (dp[i-1][j-1]), Delete a from word1 (dp[i-1][j]), or Insert b into word1 (dp[i][j-1]).',
      },
      intuitionComparison: {
        bruteForce: {
          approach:
            'Recursive branching on (i, j) trying Insert, Delete, and Replace whenever characters mismatch without memoization.',
          timeComplexity: 'O(3^(m + n))',
          spaceComplexity: 'O(m + n)',
          bottleneck:
            'Different sequences of edits arrive at the exact same suffix pair (i, j) exponentially many times.',
        },
        optimal: {
          approach:
            'Fill 2D DP grid dp[0..m][0..n] bottom-up (or roll two 1D rows of length min(m, n) + 1) using the three-neighbor recurrence.',
          timeComplexity: 'O(m × n)',
          spaceComplexity: 'O(m × n) table, compressible to O(min(m, n))',
          keyInvariant:
            'dp[i][j] stores the exact minimum Levenshtein edit distance to transform word1[0..i-1] into word2[0..j-1].',
        },
      },
      visualizer: {
        kind: 'dp-table-2d',
        title: 'Levenshtein 2D Edit Distance Table Dry Run',
        inputSummary: 'word1 = "horse" (m=5) → word2 = "ros" (n=3)',
        rowAxisLabel: 'word1',
        colAxisLabel: 'word2',
        rowHeaders: ['""', 'h', 'o', 'r', 's', 'e'],
        colHeaders: ['""', 'r', 'o', 's'],
        steps: [
          {
            caption:
              'Initialize base borders: converting "" to prefix of length j requires j Inserts (row 0 = [0,1,2,3]); converting prefix of length i to "" requires i Deletes (col 0 = [0,1,2,3,4,5]).',
            recurrence: 'dp[i][0] = i (Deletes),   dp[0][j] = j (Inserts)',
            concreteFormula: 'Row 0 = [0, 1, 2, 3]  |  Col 0 = [0, 1, 2, 3, 4, 5]',
            grid: [
              [0, 1, 2, 3],
              [1, null, null, null],
              [2, null, null, null],
              [3, null, null, null],
              [4, null, null, null],
              [5, null, null, null],
            ],
            activeCell: { row: 0, col: 0 },
            variables: [
              { name: 'word1', value: '"horse"' },
              { name: 'word2', value: '"ros"' },
            ],
          },
          {
            caption:
              'Cell (1, 1) comparing "h" vs "r" (mismatch): evaluate all 3 operations → Replace dp[0][0]=0, Delete dp[0][1]=1, Insert dp[1][0]=1. Minimum is Replace (0) + 1 = 1!',
            recurrence: 'dp[i][j] = 1 + min(dp[i-1][j-1] Rep, dp[i-1][j] Del, dp[i][j-1] Ins)',
            concreteFormula: 'dp[1][1] = 1 + min(0 [Rep], 1 [Del], 1 [Ins]) = 1',
            grid: [
              [0, 1, 2, 3],
              [1, 1, null, null],
              [2, null, null, null],
              [3, null, null, null],
              [4, null, null, null],
              [5, null, null, null],
            ],
            activeCell: { row: 1, col: 1 },
            dependencyCells: [
              { row: 0, col: 0, label: 'Rep', tone: 'emerald' },
              { row: 0, col: 1, label: 'Del', tone: 'amber' },
              { row: 1, col: 0, label: 'Ins', tone: 'amber' },
            ],
            variables: [
              { name: 'word1[0]', value: "'h'" },
              { name: 'word2[0]', value: "'r'" },
              { name: 'chosenOp', value: 'Replace h→r (+1)', tone: 'primary' },
            ],
          },
          {
            caption:
              'Finish Row 1 ("h" → "ro"=2, "h" → "ros"=3) and compute (2, 1) ("ho" → "r" = 2). Now evaluate (2, 2): "o" == "o" — EXACT MATCH! Copy diagonal dp[1][1] = 1 with ZERO extra cost.',
            recurrence: 'if word1[i-1] == word2[j-1] → dp[i][j] = dp[i-1][j-1] (0 cost)',
            concreteFormula: 'word1[1]="o" == word2[1]="o"  →  dp[2][2] = dp[1][1] = 1',
            grid: [
              [0, 1, 2, 3],
              [1, 1, 2, 3],
              [2, 2, 1, null],
              [3, null, null, null],
              [4, null, null, null],
              [5, null, null, null],
            ],
            activeCell: { row: 2, col: 2 },
            dependencyCells: [{ row: 1, col: 1, label: 'Match', tone: 'emerald' }],
            variables: [
              { name: 'word1[1]', value: "'o'" },
              { name: 'word2[1]', value: "'o'" },
              { name: 'chosenOp', value: 'Free Match (+0)', tone: 'emerald' },
            ],
          },
          {
            caption:
              'Row 3 ("hor" → "ro") at cell (3, 2): "r" != "o". Compare Replace dp[2][1]=2, Delete dp[2][2]=1, Insert dp[3][1]=2. Deleting "r" from "hor" ("ho"→"ro" cost 1) wins: dp[3][2] = 1 + 1 = 2!',
            recurrence: 'dp[i][j] = 1 + min(dp[i-1][j-1] Rep, dp[i-1][j] Del, dp[i][j-1] Ins)',
            concreteFormula: 'dp[3][2] = 1 + min(2 [Rep], 1 [Del], 2 [Ins]) = 2',
            grid: [
              [0, 1, 2, 3],
              [1, 1, 2, 3],
              [2, 2, 1, 2],
              [3, 2, 2, null],
              [4, null, null, null],
              [5, null, null, null],
            ],
            activeCell: { row: 3, col: 2 },
            dependencyCells: [
              { row: 2, col: 1, label: 'Rep', tone: 'amber' },
              { row: 2, col: 2, label: 'Del', tone: 'emerald' },
              { row: 3, col: 1, label: 'Ins', tone: 'amber' },
            ],
            variables: [
              { name: 'word1[2]', value: "'r'" },
              { name: 'word2[1]', value: "'o'" },
              { name: 'chosenOp', value: 'Delete r (+1)', tone: 'primary' },
            ],
          },
          {
            caption:
              'Complete Row 3 (dp[3][3] = 2) and advance to Row 4 cell (4, 3): "s" == "s" — EXACT MATCH! Inherit diagonal dp[3][2] = 2 directly with 0 cost ("hors" → "ros" needs only 2 edits).',
            recurrence: 'if word1[i-1] == word2[j-1] → dp[i][j] = dp[i-1][j-1]',
            concreteFormula: 'word1[3]="s" == word2[2]="s"  →  dp[4][3] = dp[3][2] = 2',
            grid: [
              [0, 1, 2, 3],
              [1, 1, 2, 3],
              [2, 2, 1, 2],
              [3, 2, 2, 2],
              [4, 3, 3, 2],
              [5, null, null, null],
            ],
            activeCell: { row: 4, col: 3 },
            dependencyCells: [{ row: 3, col: 2, label: 'Match', tone: 'emerald' }],
            variables: [
              { name: 'word1[3]', value: "'s'" },
              { name: 'word2[2]', value: "'s'" },
              { name: 'chosenOp', value: 'Free Match (+0)', tone: 'emerald' },
            ],
          },
          {
            caption:
              'Final cell (5, 3) ("horse" → "ros"): "e" != "s". Check Replace dp[4][2]=3, Delete dp[4][3]=2, Insert dp[5][2]=4. Delete "e" wins: 1 + 2 = 3!',
            recurrence: 'dp[5][3] = 1 + min(dp[4][2] Rep, dp[4][3] Del, dp[5][2] Ins)',
            concreteFormula: 'dp[5][3] = 1 + min(3 [Rep], 2 [Del], 4 [Ins]) = 3',
            grid: [
              [0, 1, 2, 3],
              [1, 1, 2, 3],
              [2, 2, 1, 2],
              [3, 2, 2, 2],
              [4, 3, 3, 2],
              [5, 4, 4, 3],
            ],
            activeCell: { row: 5, col: 3 },
            dependencyCells: [
              { row: 4, col: 2, label: 'Rep', tone: 'amber' },
              { row: 4, col: 3, label: 'Del', tone: 'emerald' },
              { row: 5, col: 2, label: 'Ins', tone: 'amber' },
            ],
            variables: [
              { name: 'word1[4]', value: "'e'" },
              { name: 'word2[2]', value: "'s'" },
              { name: 'minEdits', value: '3', tone: 'emerald' },
            ],
          },
          {
            caption:
              'Optimal Traceback Path highlighted in emerald: (0,0) → (1,1) Replace h→r → (2,2) Match o → (3,2) Delete r → (4,3) Match s → (5,3) Delete e. Total minimum edit distance = 3.',
            recurrence: 'Optimal Alignment: "horse" → "rorse" → "rose" → "ros"',
            concreteFormula: 'dp[5][3] = 3 operations (1 Replace + 2 Deletes)',
            grid: [
              [0, 1, 2, 3],
              [1, 1, 2, 3],
              [2, 2, 1, 2],
              [3, 2, 2, 2],
              [4, 3, 3, 2],
              [5, 4, 4, 3],
            ],
            pathCells: [
              { row: 0, col: 0 },
              { row: 1, col: 1 },
              { row: 2, col: 2 },
              { row: 3, col: 2 },
              { row: 4, col: 3 },
              { row: 5, col: 3 },
            ],
            variables: [
              { name: 'distance', value: '3', tone: 'emerald' },
              { name: 'edits', value: 'Rep(h→r), Del(r), Del(e)', tone: 'emerald' },
            ],
          },
        ],
      },
      javaSolution: {
        filename: 'EditDistance.java',
        code: `public class EditDistance {
    public int minDistance(String word1, String word2) {
        int m = word1.length();
        int n = word2.length();

        // Ensure the 1D rolling array uses O(min(m, n)) space
        if (m < n) {
            return minDistance(word2, word1);
        }

        int[] dp = new int[n + 1];
        for (int j = 0; j <= n; j++) {
            dp[j] = j; // Row 0 base case: j insertions
        }

        for (int i = 1; i <= m; i++) {
            int prevDiag = dp[0]; // Stores dp[i - 1][j - 1] before overwriting
            dp[0] = i;            // Col 0 base case: i deletions
            char c1 = word1.charAt(i - 1);

            for (int j = 1; j <= n; j++) {
                int savedTop = dp[j]; // Will become prevDiag for j + 1

                if (c1 == word2.charAt(j - 1)) {
                    dp[j] = prevDiag; // Match: 0 cost
                } else {
                    int replace = prevDiag;
                    int delete = savedTop;
                    int insert = dp[j - 1];
                    dp[j] = 1 + Math.min(replace, Math.min(delete, insert));
                }

                prevDiag = savedTop;
            }
        }

        return dp[n];
    }
}`,
        callouts: [
          {
            id: 'ed-swap',
            startLine: 7,
            endLine: 9,
            title: 'Symmetry Swap for True O(min(m, n)) Space',
            explanation:
              'Edit distance is symmetric (Insert in word1 == Delete in word2). Swapping when m < n guarantees our 1D array is always sized to the shorter string.',
            accent: 'primary',
          },
          {
            id: 'ed-diag',
            startLine: 17,
            endLine: 23,
            title: 'Preserving prevDiag (dp[i-1][j-1]) in a Single 1D Array',
            explanation:
              'When compressing a 2D table to 1D, dp[j] holds the top neighbor dp[i-1][j] before overwrite and dp[j-1] already holds the left neighbor dp[i][j-1]. Saving savedTop into prevDiag recovers the diagonal without a second array.',
            accent: 'amber',
          },
          {
            id: 'ed-three',
            startLine: 27,
            endLine: 31,
            title: 'Readable Named Operations',
            explanation:
              'Naming replace, delete, and insert explicitly makes the recurrence impossible to scramble under interview pressure and signals clean production habits.',
            accent: 'emerald',
          },
        ],
      },
      complexity: {
        time: 'O(m × n)',
        space: 'O(min(m, n))',
        timeExplanation: 'Visits every pair (i, j) in the m × n prefix matrix exactly once in O(1) work.',
        spaceExplanation:
          'Single rolling 1D array of size min(m, n) + 1. Keep the full O(m × n) matrix ONLY if asked to reconstruct the edit script (or cite Hirschberg’s divide-and-conquer algorithm for O(min(m, n)) space WITH path reconstruction!).',
      },
      edgeCases: [
        {
          title: 'One or Both Strings Empty',
          scenario: 'word1 = "", word2 = "abc" → 3.',
          handling: 'Outer loop skips (m=0) or returns immediately after initializing dp[0..n], returning n.',
        },
        {
          title: 'Weighted Operations Follow-Up (Damerau-Levenshtein / Spell Checker)',
          scenario: 'What if Replace costs 2, Insert costs 1, Delete costs 1, or adjacent transposition ("ab"↔"ba") costs 1?',
          handling:
            'Simply replace the uniform +1 with op-specific costs; for adjacent transpositions, add a 4th transition dp[i-2][j-2] + 1 when word1[i-1]==word2[j-2] && word1[i-2]==word2[j-1] (requires retaining 2 previous rows).',
        },
        {
          title: 'Bounded Edit Distance (k-Edit Search in O(k · min(m, n)))',
          scenario: 'Spell-checkers only care if edit distance ≤ k (e.g., k = 2).',
          handling: 'Only compute cells inside the diagonal band |i - j| ≤ k (Ukkonen’s banded algorithm), slashing work from O(m·n) to O(k·n).',
        },
      ],
    },

    /* ================================================================
     * DSA 5: HOUSE ROBBER III (TREE DP)
     * ================================================================ */
    {
      id: 'day5-house-robber-iii',
      dayNumber: 5,
      kind: 'dsa',
      title: 'House Robber III (Tree DP)',
      subtitle: 'Post-order bottom-up state-tuple propagation [rob, skip] on binary trees',
      difficulty: 'Medium',
      patterns: ['Tree DP', 'Post-Order DFS', 'State Tuple [rob, skip]'],
      estimatedMinutes: 14,
      leetcodeRef: 'LC #337',
      problemStatement:
        'A thief plans to rob houses arranged in a binary tree. Directly linked parent-child houses trigger an alarm if both are robbed on the same night. Return the maximum amount of money the thief can rob.',
      exampleSummary: {
        input: 'Tree: root=3, left=2 (children 4, 3), right=5 (right child 1)',
        output: '12',
        explanation:
          'Optimal set is {4, 3, 5} = 12 (skip root 3 and left child 2!). Notice naive alternating tree-level sums give 3+4+3+1 = 11 or 2+5 = 7 — BOTH wrong! Only Tree DP solves cross-subtree choices optimally.',
      },
      patternRecognition: {
        interviewCue:
          'Whenever a tree problem imposes an adjacent parent-child constraint (Independent Set, Binary Tree Cameras, Vertex Cover), return a small fixed-size state tuple from each post-order DFS call instead of memoizing a HashMap<TreeNode, Integer>.',
        signals: [
          'Parent’s optimal decision depends on whether each child was picked or skipped',
          'Level-order alternating sum FAILS because you may skip two consecutive levels in one branch while taking adjacent depth in another branch',
          'Post-order traversal ensures both children’s [rob, skip] pairs are finalized before evaluating parent',
        ],
        mentalModel:
          'Every subtree root u returns a 2-element pair [rob, skip]:\n• rob(u)  = u.val + left.skip + right.skip  (if we rob u, both children MUST be skipped)\n• skip(u) = max(left.rob, left.skip) + max(right.rob, right.skip)  (if we skip u, each child is completely free!).',
      },
      intuitionComparison: {
        bruteForce: {
          approach:
            'Recursive rob(node) that compares (node.val + grandchildren) vs (children) without memoization, recomputing subtrees redundantly.',
          timeComplexity: 'O(2^n) unmemoized / O(n) with HashMap<TreeNode, Integer>',
          spaceComplexity: 'O(n) HashMap + O(h) stack',
          bottleneck:
            'Top-down HashMap memoization pays hashing/allocation overhead per TreeNode and touches grandchildren explicitly.',
        },
        optimal: {
          approach:
            'Single post-order DFS returning int[]{rob, skip} directly up the call stack — zero HashMap, every node visited exactly once.',
          timeComplexity: 'O(n)',
          spaceComplexity: 'O(h) call stack (O(log n) balanced, O(n) skewed)',
          keyInvariant:
            'Each subtree summarizes its entire optimal decision space in just two integers: best value including root vs. excluding root.',
        },
      },
      visualizer: {
        kind: 'tree-graph',
        title: 'Post-Order Tree DP [rob, skip] Bottom-Up Dry Run',
        inputSummary: 'Tree: 3 → (2 → [4, 3], 5 → [_, 1])',
        viewBoxWidth: 760,
        viewBoxHeight: 340,
        nodes: [
          { id: 'n1', label: '3', x: 380, y: 48 },
          { id: 'n2', label: '2', x: 215, y: 145 },
          { id: 'n3', label: '5', x: 545, y: 145 },
          { id: 'n4', label: '4', x: 120, y: 248 },
          { id: 'n5', label: '3', x: 310, y: 248 },
          { id: 'n6', label: '1', x: 640, y: 248 },
        ],
        edges: [
          { from: 'n1', to: 'n2' },
          { from: 'n1', to: 'n3' },
          { from: 'n2', to: 'n4' },
          { from: 'n2', to: 'n5' },
          { from: 'n3', to: 'n6' },
        ],
        steps: [
          {
            caption:
              'Post-order DFS descends left-first to leaf node 4. Null children return [0, 0], so leaf 4 evaluates rob = 4 + 0 + 0 = 4, skip = 0 → returns [rob:4, skip:0].',
            formula: 'Leaf(4): rob = 4 + 0 + 0 = 4,  skip = 0 + 0 = 0',
            activeNodeId: 'n4',
            visitedNodeIds: ['n4'],
            nodeStates: { n4: 'rob:4, skip:0' },
            variables: [
              { name: 'node', value: '4 (leaf)' },
              { name: 'return', value: '[4, 0]', tone: 'primary' },
            ],
          },
          {
            caption:
              'Next visit right leaf 3 under node 2. Null children return [0, 0] → leaf 3 returns [rob:3, skip:0].',
            formula: 'Leaf(3): rob = 3 + 0 + 0 = 3,  skip = 0 + 0 = 0',
            activeNodeId: 'n5',
            visitedNodeIds: ['n4', 'n5'],
            nodeStates: { n4: 'rob:4, skip:0', n5: 'rob:3, skip:0' },
            variables: [
              { name: 'node', value: '3 (leaf)' },
              { name: 'return', value: '[3, 0]', tone: 'primary' },
            ],
          },
          {
            caption:
              'Bubble up to node 2 combining children [4, 0] and [3, 0]: robbing 2 forces skipping both leaves (2 + 0 + 0 = 2); skipping 2 lets both leaves rob freely (max(4,0) + max(3,0) = 7)! Returns [rob:2, skip:7].',
            formula: 'Node(2): rob = 2 + 0 + 0 = 2  |  skip = max(4,0) + max(3,0) = 7',
            activeNodeId: 'n2',
            dependencyNodeIds: ['n4', 'n5'],
            visitedNodeIds: ['n4', 'n5', 'n2'],
            activeEdges: [
              { from: 'n2', to: 'n4' },
              { from: 'n2', to: 'n5' },
            ],
            nodeStates: {
              n4: 'rob:4, skip:0',
              n5: 'rob:3, skip:0',
              n2: 'rob:2, skip:7',
            },
            variables: [
              { name: 'node', value: '2' },
              { name: 'rob(2)', value: '2' },
              { name: 'skip(2)', value: '7', tone: 'emerald' },
            ],
          },
          {
            caption:
              'Descend into right subtree to leaf 1: returns [rob:1, skip:0].',
            formula: 'Leaf(1): rob = 1,  skip = 0',
            activeNodeId: 'n6',
            visitedNodeIds: ['n4', 'n5', 'n2', 'n6'],
            nodeStates: {
              n4: 'rob:4, skip:0',
              n5: 'rob:3, skip:0',
              n2: 'rob:2, skip:7',
              n6: 'rob:1, skip:0',
            },
            variables: [
              { name: 'node', value: '1 (leaf)' },
              { name: 'return', value: '[1, 0]', tone: 'primary' },
            ],
          },
          {
            caption:
              'Bubble up to node 5 combining left=[0,0] and right=[1,0]: rob = 5 + 0 + 0 = 5; skip = 0 + max(1, 0) = 1. Returns [rob:5, skip:1].',
            formula: 'Node(5): rob = 5 + 0 + 0 = 5  |  skip = 0 + max(1,0) = 1',
            activeNodeId: 'n3',
            dependencyNodeIds: ['n6'],
            visitedNodeIds: ['n4', 'n5', 'n2', 'n6', 'n3'],
            activeEdges: [{ from: 'n3', to: 'n6' }],
            nodeStates: {
              n4: 'rob:4, skip:0',
              n5: 'rob:3, skip:0',
              n2: 'rob:2, skip:7',
              n6: 'rob:1, skip:0',
              n3: 'rob:5, skip:1',
            },
            variables: [
              { name: 'node', value: '5' },
              { name: 'rob(5)', value: '5', tone: 'emerald' },
              { name: 'skip(5)', value: '1' },
            ],
          },
          {
            caption:
              'Evaluate Root(3) from left=[2, 7] and right=[5, 1]: rob = 3 + 7 + 1 = 11; skip = max(2,7) + max(5,1) = 7 + 5 = 12! Answer = max(11, 12) = 12 by robbing {4, 3, 5}!',
            formula: 'Root(3): rob = 3+7+1 = 11  |  skip = max(2,7)+max(5,1) = 12 → Answer = 12!',
            activeNodeId: 'n1',
            dependencyNodeIds: ['n2', 'n3'],
            visitedNodeIds: ['n4', 'n5', 'n2', 'n6', 'n3', 'n1'],
            highlightedNodeIds: ['n4', 'n5', 'n3'],
            activeEdges: [
              { from: 'n1', to: 'n2' },
              { from: 'n1', to: 'n3' },
            ],
            nodeStates: {
              n4: 'ROBBED (4)',
              n5: 'ROBBED (3)',
              n2: 'rob:2, skip:7',
              n6: 'rob:1, skip:0',
              n3: 'ROBBED (5)',
              n1: 'rob:11, skip:12',
            },
            variables: [
              { name: 'rob(root)', value: '11' },
              { name: 'skip(root)', value: '12', tone: 'emerald' },
              { name: 'optimalSet', value: '{4, 3, 5} = 12', tone: 'emerald' },
            ],
          },
        ],
      },
      javaSolution: {
        filename: 'HouseRobberIII.java',
        code: `public class HouseRobberIII {
    public static class TreeNode {
        int val;
        TreeNode left;
        TreeNode right;
        TreeNode(int val) { this.val = val; }
    }

    private record RobState(int rob, int skip) {
        int best() {
            return Math.max(rob, skip);
        }
    }

    public int rob(TreeNode root) {
        return dfs(root).best();
    }

    private RobState dfs(TreeNode node) {
        if (node == null) {
            return new RobState(0, 0);
        }

        RobState left = dfs(node.left);
        RobState right = dfs(node.right);

        // If we rob this node, neither direct child can be robbed
        int robCurrent = node.val + left.skip() + right.skip();

        // If we skip this node, each child independently chooses its own optimum
        int skipCurrent = left.best() + right.best();

        return new RobState(robCurrent, skipCurrent);
    }
}`,
        callouts: [
          {
            id: 'hr3-record',
            startLine: 9,
            endLine: 13,
            title: 'Named State Record Beats Magic int[2] Indices',
            explanation:
              'Replacing cryptic res[0]/res[1] arrays with a tiny private record RobState(int rob, int skip) eliminates index-swap bugs and demonstrates clean, readable senior Java.',
            accent: 'primary',
          },
          {
            id: 'hr3-skip-freedom',
            startLine: 30,
            endLine: 31,
            title: 'Why skipCurrent Takes left.best() + right.best()',
            explanation:
              'Skipping the current house does NOT force you to rob its children! You are free to skip a child too (e.g., skipping both root 3 and left child 2 to rob grandchildren 4 and 3). That is why left.best() = max(rob, skip).',
            accent: 'emerald',
          },
        ],
      },
      complexity: {
        time: 'O(n)',
        space: 'O(h)',
        timeExplanation: 'Single post-order DFS traversal computing constant-time transitions at each of the n nodes.',
        spaceExplanation:
          'Proportional to tree height h for the recursion stack: O(log n) for balanced trees, O(n) worst-case for a skewed chain.',
      },
      edgeCases: [
        {
          title: 'Two Consecutive Skipped Levels ([4, 1, null, 2, null, 3])',
          scenario: 'Optimal choice robs 4 and 3 (sum 7), skipping BOTH 1 and 2.',
          handling: 'Because skipCurrent = left.best() + right.best(), skipping node 1 naturally selects node 2’s skip state (=3) without missing cross-gap combinations.',
        },
        {
          title: 'Deeply Skewed Tree (n = 10⁵) StackOverflowError',
          scenario: 'Recursive DFS overflows default JVM stack (~10k frames) on a linked-list-shaped tree.',
          handling: 'Mention rewriting post-order DFS iteratively using an explicit Deque<TreeNode> + topological reverse post-order map if tree depth can exceed stack limits.',
        },
        {
          title: 'Negative House Values Follow-Up',
          scenario: 'What if a house has negative value (penalty)?',
          handling: 'Our recurrence handles negatives automatically as long as best() = Math.max(0, Math.max(rob, skip)) or skip naturally floors at 0 from leaves.',
        },
      ],
    },
  ],

  /* ================================================================
   * DAY 5 LLD: ELEVATOR SYSTEM
   * ================================================================ */
  lldLesson: {
    id: 'day5-elevator-system',
    dayNumber: 5,
    kind: 'lld',
    title: 'Elevator System',
    subtitle: 'State-pattern cabin lifecycle, SCAN/LOOK scheduling strategies, and thread-safe directional queues',
    patterns: ['State Pattern', 'Strategy Pattern', 'Observer Pattern', 'Directional TreeSets'],
    estimatedMinutes: 24,
    problemScope: {
      summary:
        'Design an object-oriented multi-elevator control system for a commercial high-rise building supporting concurrent hall calls (UP/DOWN) and cabin destination requests, deterministic SCAN/LOOK scheduling, safe door/weight interlocks, and maintenance isolation.',
      functionalRequirements: [
        'Manage N elevator cars serving floors 0..M-1 with independent UP/DOWN hall buttons per floor and destination panels inside each cabin.',
        'Dispatch external hall requests to the optimal elevator car using pluggable scheduling policies (Nearest Directional LOOK, Zone-Based Peak, Energy-Aware).',
        'Process stops smoothly without erratic ping-pong reversals using directional ordered stop queues (complete all upward requests before reversing down).',
        'Support Maintenance/Emergency Stop state that rejects new hall dispatches and safely parks at the nearest floor.',
      ],
      concurrencyAndScaleAssumptions: [
        'Dozens of passengers press hall buttons and cabin buttons concurrently across floors while every ElevatorCar runs its own movement loop thread.',
        'Each ElevatorCar owns a fine-grained ReentrantLock + Condition so dispatching a hall call to Car #2 never blocks Car #1’s floor step loop.',
      ],
      explicitNonGoals: [
        'Motor acceleration physics / PID controller loop (modeled as discrete step() floor transitions).',
        'Hardware CAN-bus / PLC serial messaging protocol (abstracted behind Door & Motor interfaces).',
      ],
    },
    coreEntities: [
      {
        name: 'ElevatorController',
        role: 'Central dispatcher coordinating all elevator cars, delegating hall calls to DispatchStrategy, and exposing telemetry.',
        keyFields: ['elevators: List<ElevatorCar>', 'dispatchStrategy: DispatchStrategy'],
        invariants: 'Never dispatches a hall call to an elevator in MAINTENANCE state.',
      },
      {
        name: 'ElevatorCar',
        role: 'Stateful cabin holding currentFloor, directional TreeSet queues (upStops min-heap order, downStops max-heap order), current ElevatorState, and car-scoped lock.',
        keyFields: ['id: int', 'currentFloor: int', 'state: ElevatorState', 'upStops: NavigableSet<Integer>', 'downStops: NavigableSet<Integer>'],
        invariants: 'All state transitions and queue mutations happen exclusively under carLock.',
      },
      {
        name: 'ElevatorState (State Pattern)',
        role: 'Encapsulates valid behavior for IDLE, MOVING_UP, MOVING_DOWN, and MAINTENANCE states.',
        keyFields: ['direction(): Direction', 'step(ElevatorCar car)', 'acceptRequest(ElevatorCar car, int floor)'],
        invariants: 'Prevents illegal transitions (e.g., jumping directly from MOVING_UP to MOVING_DOWN while upStops is non-empty, or moving while doors are open).',
      },
      {
        name: 'HallRequest & CabinRequest',
        role: 'Immutable request records separating external floor+direction calls from internal destination floor clicks.',
        keyFields: ['floor: int', 'direction: Direction', 'timestamp: Instant'],
        invariants: 'Validated against building bounds [minFloor, maxFloor] at construction.',
      },
      {
        name: 'DispatchStrategy (Strategy Pattern)',
        role: 'Scores candidate elevators for an incoming HallRequest and selects the lowest-cost car.',
        keyFields: ['selectElevator(List<ElevatorCar>, HallRequest): Optional<ElevatorCar>'],
        invariants: 'Stateless & pure; reads atomic car snapshots without mutating car queues.',
      },
    ],
    designPatterns: [
      {
        pattern: 'State Pattern (IdleState, MovingUpState, MovingDownState, MaintenanceState)',
        whereUsed: 'Governs how an ElevatorCar responds to step() ticks, incoming stops, and emergency overrides.',
        whatBreaksWithoutIt:
          'ElevatorCar.step() bloats into a 200-line nested switch(status) checking direction, pending queues, door locks, and maintenance flags simultaneously — easy to introduce subtle bugs like opening doors in motion or reversing mid-trip.',
        howItSolvesIt:
          'Each operational mode is an isolated, focused class defining only its legal transitions (e.g., MovingUpState pops from upStops.ceiling(currentFloor) and transitions to MovingDownState or IdleState only when upStops empties).',
      },
      {
        pattern: 'Strategy Pattern (DispatchStrategy — LOOK vs. Morning Up-Peak Zone)',
        whereUsed: 'Choosing WHICH elevator car serves a new HallRequest.',
        whatBreaksWithoutIt:
          'Hardcoding "nearest car" causes catastrophic morning rush congestion where all 6 elevators chase upper floors while lobby crowds starve. Swapping dispatch rules for rush-hour traffic would require modifying ElevatorController.',
        howItSolvesIt:
          'ElevatorController delegates scoring to DispatchStrategy, allowing runtime hot-swapping between LookCostStrategy (normal hours) and LobbyZoningStrategy (8–10 AM peak).',
      },
      {
        pattern: 'Observer Pattern (FloorDisplayObserver)',
        whereUsed: 'Broadcasting floor arrival and direction updates to lobby LED panels and mobile accessibility apps.',
        whatBreaksWithoutIt:
          'ElevatorCar directly references UI displays, speech synthesizers, and telemetry loggers, coupling safety-critical movement logic to external I/O.',
        howItSolvesIt:
          'ElevatorCar emits immutable CarSnapshot events to registered observers asynchronously without blocking movement.',
      },
    ],
    diagrams: {
      classDiagram: {
        title: 'Elevator System — UML Class Diagram',
        caption: 'State Pattern governs per-car lifecycle transitions while Strategy Pattern decouples multi-car hall dispatching',
        mermaid: `classDiagram
    class ElevatorController {
        -List~ElevatorCar~ cars
        -DispatchStrategy strategy
        +requestHallCall(floor, dir) Car
        +requestCabinFloor(id, floor) void
    }

    class DispatchStrategy {
        <<interface>>
        +selectCar(snapshots, req) Car
    }

    class LookDispatchStrategy {
        +selectCar(snapshots, req) Car
    }

    class ElevatorCar {
        -int carId
        -int currentFloor
        -ElevatorState state
        -TreeSet~Integer~ upStops
        -TreeSet~Integer~ downStops
        -ReentrantLock carLock
        +addStop(floor) void
        +step() void
    }

    class ElevatorState {
        <<interface>>
        +getDirection() Direction
        +step(car) void
        +onStopAdded(car, floor) void
    }

    class IdleState {
        +step(car) void
    }

    class MovingUpState {
        +step(car) void
    }

    class MovingDownState {
        +step(car) void
    }

    class MaintenanceState {
        +step(car) void
    }

    ElevatorController "1" o-- "*" ElevatorCar : "dispatches to"
    ElevatorController --> DispatchStrategy : "scores cars"
    DispatchStrategy <|.. LookDispatchStrategy : "implements"
    ElevatorCar "1" *-- "1" ElevatorState : "delegates mode"
    ElevatorState <|.. IdleState : "implements"
    ElevatorState <|.. MovingUpState : "implements"
    ElevatorState <|.. MovingDownState : "implements"
    ElevatorState <|.. MaintenanceState : "implements"`,
      },
      sequenceDiagram: {
        title: 'Hall Call Dispatch & LOOK Directional Execution Sequence',
        caption: 'Controller scores car snapshots lock-free, enqueues stop under carLock, and wakes the car worker thread',
        mermaid: `sequenceDiagram
    participant Passenger as "Floor 5 Passenger"
    participant Controller as "ElevatorController"
    participant Strategy as "LookDispatchStrategy"
    participant Car as "ElevatorCar #2"
    participant State as "ElevatorState (Idle -> MovingUp)"

    Passenger->>Controller: "requestHallCall(floor=5, UP)"
    Controller->>Car: "getSnapshot() for each active car"
    Car-->>Controller: "CarSnapshot(floor=2, IDLE)"
    Controller->>Strategy: "selectElevator(snapshots, req)"
    Strategy-->>Controller: "Selected Car #2 (cost = 3 floors)"
    Controller->>Car: "addStop(5)"
    Car->>Car: "carLock.lock()"
    Car->>State: "onStopAdded(car, 5)"
    State->>Car: "Insert 5 into upStops & transition to MovingUpState"
    Car->>Car: "hasWork.signal() & carLock.unlock()"
    Car-->>Controller: "Ack assigned Car #2"
    loop "Car Worker Thread"
        Car->>State: "step(car)"
        State->>Car: "Advance floor 2 -> 3 -> 4 -> 5, open doors, pop 5"
    end`,
      },
    },
    codeFiles: [
      {
        filename: 'ElevatorModels.java',
        label: 'ElevatorModels.java',
        summary: 'Immutable Direction enum, validated HallRequest, and read-only CarSnapshot for lock-free dispatch scoring.',
        code: `public enum Direction { UP, DOWN, IDLE }

public record HallRequest(int floor, Direction direction) {
    public HallRequest {
        if (direction == Direction.IDLE) {
            throw new IllegalArgumentException("Hall call must specify UP or DOWN");
        }
    }
}

/**
 * Immutable point-in-time read view of an ElevatorCar so DispatchStrategy
 * can score all cars cleanly without holding multiple car locks simultaneously.
 */
public record CarSnapshot(
    int carId,
    int currentFloor,
    Direction direction,
    boolean operational,
    int pendingStopsCount,
    Integer highestUpStop,
    Integer lowestDownStop
) {}`,
        callouts: [
          {
            id: 'el-snapshot',
            startLine: 15,
            endLine: 23,
            title: 'Immutable Snapshots Eliminate Multi-Lock Deadlocks',
            explanation:
              'Instead of locking all 8 elevators simultaneously while DispatchStrategy compares distances, each car publishes a cheap immutable CarSnapshot under a brief lock (or volatile reference).',
            accent: 'emerald',
          },
        ],
      },
      {
        filename: 'ElevatorStates.java',
        label: 'ElevatorStates.java',
        summary: 'State Pattern implementations enforcing strict LOOK directional sweeps (no mid-trip reversal until current direction drains).',
        code: `public interface ElevatorState {
    Direction getDirection();
    boolean isOperational();
    void onStopAdded(ElevatorCar car, int targetFloor);
    void step(ElevatorCar car);
}

public final class IdleState implements ElevatorState {
    public static final IdleState INSTANCE = new IdleState();

    @Override public Direction getDirection() { return Direction.IDLE; }
    @Override public boolean isOperational() { return true; }

    @Override
    public void onStopAdded(ElevatorCar car, int targetFloor) {
        if (targetFloor > car.getCurrentFloor()) {
            car.addUpStop(targetFloor);
            car.setState(MovingUpState.INSTANCE);
        } else if (targetFloor < car.getCurrentFloor()) {
            car.addDownStop(targetFloor);
            car.setState(MovingDownState.INSTANCE);
        } else {
            car.openAndCloseDoors();
        }
    }

    @Override
    public void step(ElevatorCar car) {
        // Nothing to do while idle; worker thread awaits Condition signal
    }
}

public final class MovingUpState implements ElevatorState {
    public static final MovingUpState INSTANCE = new MovingUpState();

    @Override public Direction getDirection() { return Direction.UP; }
    @Override public boolean isOperational() { return true; }

    @Override
    public void onStopAdded(ElevatorCar car, int targetFloor) {
        // Requests ahead in current UP sweep go to upStops; requests behind wait for DOWN sweep
        if (targetFloor >= car.getCurrentFloor()) {
            car.addUpStop(targetFloor);
        } else {
            car.addDownStop(targetFloor);
        }
    }

    @Override
    public void step(ElevatorCar car) {
        Integer nextStop = car.peekNextUpStop();
        if (nextStop == null) {
            // LOOK reversal: switch directly to DOWN if waiting, else IDLE (never travel to top roof needlessly)
            car.setState(car.hasDownStops() ? MovingDownState.INSTANCE : IdleState.INSTANCE);
            return;
        }

        if (car.getCurrentFloor() < nextStop) {
            car.moveOneFloorUp();
        }
        if (car.getCurrentFloor() == nextStop) {
            car.consumeUpStop(nextStop);
            car.openAndCloseDoors();
            if (!car.hasUpStops()) {
                car.setState(car.hasDownStops() ? MovingDownState.INSTANCE : IdleState.INSTANCE);
            }
        }
    }
}`,
        callouts: [
          {
            id: 'el-flyweight',
            startLine: 8,
            endLine: 9,
            title: 'Stateless Flyweight Singletons for States',
            explanation:
              'Because all mutable state lives on ElevatorCar, each ElevatorState implementation is a stateless singleton — zero object allocation per floor transition.',
            accent: 'primary',
          },
          {
            id: 'el-look-split',
            startLine: 40,
            endLine: 46,
            title: 'Preventing Starvation via Two Directional Queues',
            explanation:
              'If Car is moving UP at Floor 5 and someone presses Floor 2, it goes into downStops rather than interrupting the current UP sweep. Once upStops drains, LOOK reverses smoothly.',
            accent: 'amber',
          },
          {
            id: 'el-look-vs-scan',
            startLine: 51,
            endLine: 56,
            title: 'LOOK Beats Classic SCAN',
            explanation:
              'Classic SCAN travels all the way to the top floor (e.g., Floor 50) even if the highest request is Floor 12. LOOK reverses immediately at the highest requested stop, cutting average wait time significantly.',
            accent: 'emerald',
          },
        ],
      },
      {
        filename: 'LookDispatchStrategy.java',
        label: 'LookDispatchStrategy.java',
        summary: 'LOOK-aligned cost function scoring every operational elevator car by exact floors to travel before serving the hall call.',
        code: `import java.util.Comparator;
import java.util.List;
import java.util.Optional;

@FunctionalInterface
public interface DispatchStrategy {
    Optional<CarSnapshot> selectElevator(List<CarSnapshot> snapshots, HallRequest request);
}

public class LookDispatchStrategy implements DispatchStrategy {
    @Override
    public Optional<CarSnapshot> selectElevator(List<CarSnapshot> snapshots, HallRequest req) {
        return snapshots.stream()
            .filter(CarSnapshot::operational)
            .min(Comparator
                .comparingInt((CarSnapshot car) -> estimateTravelCost(car, req))
                .thenComparingInt(CarSnapshot::pendingStopsCount));
    }

    private int estimateTravelCost(CarSnapshot car, HallRequest req) {
        int curr = car.currentFloor();
        int target = req.floor();

        if (car.direction() == Direction.IDLE) {
            return Math.abs(curr - target);
        }

        // Case 1: Car is heading directly toward this floor in the SAME requested direction
        if (car.direction() == Direction.UP && req.direction() == Direction.UP && target >= curr) {
            return target - curr;
        }
        if (car.direction() == Direction.DOWN && req.direction() == Direction.DOWN && target <= curr) {
            return curr - target;
        }

        // Case 2: Car must finish its current sweep to its turnaround floor before reversing
        if (car.direction() == Direction.UP) {
            int turnaround = car.highestUpStop() != null ? car.highestUpStop() : curr;
            return (turnaround - curr) + Math.abs(turnaround - target);
        } else {
            int turnaround = car.lowestDownStop() != null ? car.lowestDownStop() : curr;
            return (curr - turnaround) + Math.abs(target - turnaround);
        }
    }
}`,
        callouts: [
          {
            id: 'el-cost-same',
            startLine: 29,
            endLine: 34,
            title: 'On-The-Way Same-Direction Priority',
            explanation:
              'A car at Floor 3 moving UP serves a Floor 6 UP request in just 3 floors without changing direction — strictly beating an idle car at Floor 10.',
            accent: 'emerald',
          },
          {
            id: 'el-cost-turnaround',
            startLine: 37,
            endLine: 43,
            title: 'Exact Turnaround Penalty Accounting',
            explanation:
              'A car at Floor 4 moving UP with a stop at Floor 15 cannot serve a Floor 3 DOWN call until it climbs to 15 and returns to 3 (cost = 11 + 12 = 23 floors). Modeling turnaround prevents bad dispatches.',
            accent: 'amber',
          },
        ],
      },
      {
        filename: 'ElevatorCarAndController.java',
        label: 'ElevatorCarAndController.java',
        summary: 'Thread-safe ElevatorCar using ReentrantLock + Condition wakeup and TreeSet directional queues.',
        code: `import java.util.Collections;
import java.util.List;
import java.util.NavigableSet;
import java.util.TreeSet;
import java.util.concurrent.locks.Condition;
import java.util.concurrent.locks.ReentrantLock;

public class ElevatorCar {
    private final int carId;
    private final int minFloor;
    private final int maxFloor;
    private int currentFloor;
    private ElevatorState state = IdleState.INSTANCE;

    // Ascending order for UP sweep; descending order for DOWN sweep
    private final NavigableSet<Integer> upStops = new TreeSet<>();
    private final NavigableSet<Integer> downStops = new TreeSet<>(Collections.reverseOrder());

    private final ReentrantLock carLock = new ReentrantLock();
    private final Condition hasWork = carLock.newCondition();

    public ElevatorCar(int carId, int minFloor, int maxFloor, int startFloor) {
        this.carId = carId;
        this.minFloor = minFloor;
        this.maxFloor = maxFloor;
        this.currentFloor = startFloor;
    }

    public void addStop(int floor) {
        if (floor < minFloor || floor > maxFloor) {
            throw new IllegalArgumentException("Floor out of bounds: " + floor);
        }
        carLock.lock();
        try {
            if (!state.isOperational()) {
                throw new IllegalStateException("Elevator " + carId + " is in maintenance");
            }
            state.onStopAdded(this, floor);
            hasWork.signal(); // Wake worker thread immediately if it was sleeping in IDLE
        } finally {
            carLock.unlock();
        }
    }

    public void runTick() throws InterruptedException {
        carLock.lock();
        try {
            while (state == IdleState.INSTANCE && upStops.isEmpty() && downStops.isEmpty()) {
                hasWork.await(); // Zero CPU busy-spinning while idle
            }
            state.step(this);
        } finally {
            carLock.unlock();
        }
    }

    public CarSnapshot getSnapshot() {
        carLock.lock();
        try {
            return new CarSnapshot(
                carId, currentFloor, state.getDirection(), state.isOperational(),
                upStops.size() + downStops.size(),
                upStops.isEmpty() ? null : upStops.last(),
                downStops.isEmpty() ? null : downStops.last()
            );
        } finally {
            carLock.unlock();
        }
    }

    void addUpStop(int f) { upStops.add(f); }
    void addDownStop(int f) { downStops.add(f); }
    Integer peekNextUpStop() { return upStops.isEmpty() ? null : upStops.first(); }
    void consumeUpStop(int f) { upStops.remove(f); }
    boolean hasUpStops() { return !upStops.isEmpty(); }
    boolean hasDownStops() { return !downStops.isEmpty(); }
    int getCurrentFloor() { return currentFloor; }
    void moveOneFloorUp() { currentFloor++; }
    void setState(ElevatorState next) { this.state = next; }
    void openAndCloseDoors() { /* hardware door cycle + weight sensor check */ }
}`,
        callouts: [
          {
            id: 'el-treeset',
            startLine: 15,
            endLine: 17,
            title: 'TreeSet Deduplicates & Sorts Simultaneously',
            explanation:
              'Unlike PriorityQueue (which allows duplicate stops when 5 passengers press Floor 8), NavigableSet/TreeSet automatically deduplicates identical floor presses in O(log F) and gives O(1)-amortized first()/last() bounds.',
            accent: 'primary',
          },
          {
            id: 'el-condition',
            startLine: 45,
            endLine: 55,
            title: 'Condition.await() Prevents Busy-Wait CPU Burn',
            explanation:
              'Idle elevator threads park cleanly on hasWork.await() inside a while-loop guard (handling spurious wakeups) and resume instantly when addStop() signals hasWork.',
            accent: 'emerald',
          },
        ],
      },
    ],
    solidHighlights: [
      {
        principle: 'Single Responsibility',
        application:
          'ElevatorCar owns floor queues and locking, ElevatorState implementations own movement transition rules, and DispatchStrategy owns fleet-wide scoring.',
      },
      {
        principle: 'Open/Closed',
        application:
          'Adding a VIPExpressDispatchStrategy or EnergySavingIdleParkingStrategy requires adding one new class with zero edits to ElevatorCar or ElevatorController.',
      },
      {
        principle: 'Interface Segregation',
        application:
          'External hall panels only call requestHallCall(floor, dir), internal cabin panels call requestCabinFloor(carId, floor), and admins call setMaintenance(carId).',
      },
      {
        principle: 'Dependency Inversion',
        application:
          'ElevatorController depends on the DispatchStrategy abstraction; ElevatorCar depends on ElevatorState rather than boolean status flags.',
      },
    ],
    extensibilityScenarios: [
      {
        scenario: 'Destination Dispatch (Modern Skyscraper Smart Kiosks)',
        changesRequired:
          'Passengers enter their destination floor in the lobby before boarding. Group passengers heading to similar floor zones (e.g., Floors 20–25) into the same car by swapping in a DestinationGroupingDispatchStrategy.',
      },
      {
        scenario: 'Overweight Sensor Interlock & Full-Car Bypass',
        changesRequired:
          'Add currentLoadKg / maxLoadKg to CarSnapshot. When load ≥ 90%, LookDispatchStrategy skips the car for external HallRequests while still serving internal cabin stops.',
      },
      {
        scenario: 'VIP Keycard / Fire Emergency Recall',
        changesRequired:
          'Introduce EmergencyRecallState (draining stops and descending nonstop to Floor 0 with doors locked open) — seamlessly plugs into ElevatorState without modifying MovingUp/MovingDown.',
      },
    ],
    concurrencyChoices: [
      {
        topic: 'Per-Car Lock Isolation',
        mechanism: 'Each ElevatorCar owns a dedicated ReentrantLock + Condition',
        rationale:
          'Car #1 stepping through floors or opening doors never blocks Car #2..#8 from accepting button presses or updating floor positions.',
      },
      {
        topic: 'Avoiding Multi-Car Lock Deadlocks During Dispatch',
        mechanism: 'Snapshot-based scoring (read CarSnapshot per car independently, then lock ONLY the chosen car)',
        rationale:
          'Because we never hold two car locks at once, lock-ordering deadlocks are structurally impossible. Mild snapshot staleness (1 floor off) is harmless in elevator scheduling.',
      },
      {
        topic: 'Idempotent Button Presses',
        mechanism: 'NavigableSet (TreeSet) for upStops and downStops',
        rationale:
          'If 10 impatient passengers mash the Floor 7 button concurrently, TreeSet deduplicates it into a single stop entry.',
      },
    ],
  },

  /* ================================================================
   * DAY 5 HLD: NEWS FEED / TWITTER
   * ================================================================ */
  hldLesson: {
    id: 'day5-news-feed',
    dayNumber: 5,
    kind: 'hld',
    title: 'News Feed / Twitter Timeline',
    subtitle: 'Hybrid Fan-Out on Write vs. Read, Redis Sorted-Set timeline caching, and celebrity hot-key mitigation',
    tags: ['Hybrid Fan-Out', 'Redis ZSET', 'Kafka Async', 'Read-Heavy Feed'],
    estimatedMinutes: 25,
    overview:
      'Design a globally scalable home timeline / news feed system serving 300M DAU, 50M new posts/day, and 30B timeline reads/day with sub-150ms p99 feed load latency — gracefully handling both regular users (200 followers) and mega-celebrities (50M+ followers).',
    requirements: {
      functional: [
        'Publish a new post (text + optional media URLs) visible to followers within seconds.',
        'Render a user’s Home Timeline showing the most recent posts from everyone they follow, supporting smooth infinite-scroll cursor pagination.',
        'Follow / Unfollow users with near-real-time reflection in the timeline.',
      ],
      nonFunctional: [
        {
          metric: 'Feed Read Latency (p99)',
          target: '< 150 ms (server-side)',
          rationale: 'Users open their feed dozens of times per day; cold scatter-gather across 500 followed authors on every request would blow past 1–2 seconds.',
        },
        {
          metric: 'Post Visibility Propagation',
          target: '< 5 seconds (Eventual Consistency)',
          rationale: 'Social feeds strongly favor Availability + low latency (AP) over linearizable global visibility across followers.',
        },
        {
          metric: 'Skewed Power-Law Graph Tolerance',
          target: 'Handles 50M-follower celebrities without write storms',
          rationale: 'Blind fan-out-on-write for a 50M-follower post writes 50M Redis entries, saturating memory and starving Kafka queues.',
        },
      ],
    },
    capacityMath: {
      assumptions: [
        '300M Daily Active Users (DAU); average user follows 200 accounts',
        '50M new posts/day (~1.7 posts/user/week); average user refreshes Home Feed 10×/day → 3B feed reads/day',
        'Timeline cache stores only lightweight 16-byte tuples (postId 8B + authorId/timestamp 8B) capped at latest 800 posts/user',
        'Peak traffic multiplier = 3× average; ~100M active users cached hot in Redis',
      ],
      calculations: [
        {
          metric: 'Post Write QPS (Avg / Peak)',
          formula: '50M / 86,400 ≈ 580 → ×3 peak',
          result: '~600 RPS avg · ~1,800 RPS peak',
          notes: 'Modest ingress write QPS, BUT amplified 200× by fan-out workers (~120K Redis writes/sec avg)!',
        },
        {
          metric: 'Feed Read QPS (Avg / Peak)',
          formula: '3B / 86,400 ≈ 34,700 → ×3 peak',
          result: '~35,000 RPS avg · ~105,000 RPS peak',
          notes: '60:1 Read:Write ratio justifies pre-materializing timelines in Redis for rapid O(log N + 20) reads.',
        },
        {
          metric: 'Fan-Out Write Amplification',
          formula: '580 posts/s × 200 avg followers (excluding celebrities)',
          result: '~116K Redis ZADD/sec avg (~350K peak)',
          notes: 'Pipelined in batches of 100 across a 32-shard Redis cluster (~11K ops/sec/shard — very comfortable).',
        },
        {
          metric: 'Timeline Cache RAM Sizing',
          formula: '100M hot users × 800 postIds × 24 B (incl. ZSET overhead)',
          result: '~1.92 TB RAM (~32 nodes × 64 GB)',
          notes: 'Storing ONLY post IDs (not hydrated post text/avatars) saves ~20× RAM and eliminates duplicate text edits!',
        },
        {
          metric: '5-Year Post Metadata Storage',
          formula: '50M/day × 365 × 5 yr × 1 KB/post = 91.25B × 1 KB',
          result: '~91 TB raw (~275 TB w/ 3× replication)',
          notes: 'Media (images/video) stored separately in Object Storage (S3) + CDN, keeping Post DB lean.',
        },
        {
          metric: 'Feed Read Egress Bandwidth',
          formula: '35K RPS × 20 posts/page × 1.5 KB JSON ≈ 1.05 GB/s',
          result: '~1.05 GB/s avg · ~3.1 GB/s peak (text JSON)',
          notes: 'Images/video stream directly from Edge CDN, keeping origin bandwidth focused on compact JSON.',
        },
      ],
    },
    apiAndDataModel: {
      endpoints: [
        {
          method: 'POST',
          path: '/api/v1/posts',
          summary: 'Publish post (returns immediately after durable DB write + Kafka enqueue)',
          payload: '{ "text": "...", "mediaIds": ["m_91a"] } → 201 { "postId": "71829301928374", "createdAt": "..." }',
        },
        {
          method: 'GET',
          path: '/api/v1/feed?cursor={lastPostId}&limit=20',
          summary: 'Cursor-paginated Home Timeline read merging pre-computed Redis feed + followed celebrities',
          payload: '200 { "posts": [...], "nextCursor": "71829301800112" }',
        },
      ],
      storageSchema: [
        {
          store: 'Post Store (Sharded MySQL/Postgres or Cassandra)',
          schema: 'posts (post_id BIGINT PK [Snowflake ID], author_id BIGINT, body TEXT, media_urls JSON, created_at TIMESTAMP)',
          shardingAndIndexing:
            'Snowflake 64-bit IDs embed millisecond timestamp in upper bits (k-sortable!). Secondary table user_posts(author_id PK, post_id CK DESC) enables O(1) slice reads of celebrity posts.',
        },
        {
          store: 'Redis Timeline Cache (Clustered Sorted Sets)',
          schema: 'Key: feed:{userId}  →  ZSET { score = snowflakePostId, member = postId } (trimmed to top 800)',
          shardingAndIndexing:
            'Sharded by userId. Because Snowflake IDs are monotonically time-ordered, ZREVRANGEBYSCORE with cursor executes pagination in O(log 800 + 20) with zero offset drift.',
        },
      ],
    },
    architecture: {
      title: 'News Feed — Hybrid Fan-Out Interactive Architecture',
      summary: 'Click any component to inspect how Fan-Out on Write (regular users) merges with Fan-Out on Read (celebrities)',
      defaultSelectedNodeId: 'fanout-workers',
      nodes: [
        {
          id: 'clients',
          label: 'Mobile & Web',
          sublabel: '300M DAU Clients',
          category: 'client',
          x: 14,
          y: 215,
          width: 136,
          height: 58,
          flows: ['read', 'write'],
          details: {
            role: 'End-user iOS, Android, and Web apps publishing new posts and scrolling infinite Home Timelines.',
            dataFlow: 'Sends POST /api/v1/posts for publishing and GET /api/v1/feed?cursor=... for paginated reads; downloads media directly from Edge CDN.',
            scalingStrategy: 'Client-side local feed caching + cursor tokens prevent duplicate items when new posts arrive at the top of the feed.',
            failureHandling: 'Exponential backoff on 5xx; offline draft queue stores unsent posts with client-generated idempotency UUIDs.',
            techChoices: ['GraphQL / REST', 'Cursor Pagination', 'CDN Media Offload'],
          },
        },
        {
          id: 'gateway',
          label: 'API Gateway / LB',
          sublabel: 'Auth · Rate Limit · L7',
          category: 'edge',
          x: 196,
          y: 215,
          width: 158,
          height: 58,
          flows: ['read', 'write'],
          details: {
            role: 'Edge termination, JWT/session validation, spam/bot rate limiting, and L7 routing split between write and read microservices.',
            dataFlow: 'Routes POST /posts to Post Service and GET /feed to Timeline Read Service with user auth claims attached in headers.',
            scalingStrategy: 'Stateless Envoy/ALB fleet autoscaled horizontally across availability zones.',
            failureHandling: 'Circuit breakers shed non-critical recommendations if Timeline Service latency spikes; per-user write limits stop bot spam storms.',
            techChoices: ['Envoy Proxy', 'AWS NLB/ALB', 'Token-Bucket Limiter'],
          },
        },
        {
          id: 'post-svc',
          label: 'Post Service',
          sublabel: 'Snowflake ID + Persist',
          category: 'service',
          x: 398,
          y: 62,
          width: 162,
          height: 58,
          flows: ['write'],
          details: {
            role: 'Generates a globally unique, time-sortable 64-bit Snowflake postId, persists the post durably, and publishes a PostCreated event to Kafka.',
            dataFlow: 'Writes post to Post DB (and author’s own user_posts index), then appends event to Kafka (transactional outbox) and returns 201 immediately.',
            scalingStrategy: 'Stateless horizontal pods; Snowflake generators run locally in-memory using (41b timestamp | 10b nodeId | 12b sequence) with zero central coordination.',
            failureHandling: 'Transactional Outbox pattern guarantees that if DB commits, the Kafka fan-out event is NEVER lost even if the pod crashes mid-request.',
            techChoices: ['Java / Go', 'Snowflake ID Generator', 'Transactional Outbox'],
          },
        },
        {
          id: 'fanout-workers',
          label: 'Fan-Out Workers',
          sublabel: 'Hybrid Cutoff Engine',
          category: 'service',
          x: 398,
          y: 215,
          width: 162,
          height: 58,
          flows: ['write'],
          details: {
            role: 'Core Hybrid Fan-Out engine: consumes PostCreated events, checks author follower count, pushes to follower timelines for regular users (< 10K followers), and SKIPS push for celebrities (≥ 10K followers)!',
            dataFlow: 'Reads PostCreated from Kafka → fetches active follower IDs from Social Graph Cache → pipelines ZADD feed:{followerId} postId into Redis Timeline Cache (skipping inactive users!).',
            scalingStrategy: 'Auto-scaled Kafka consumer group; Redis pipelining batches 100+ ZADDs per round-trip. Skipping users inactive > 30 days cuts fan-out writes by ~60%.',
            failureHandling: 'Idempotent ZADD (same score+member overwrites safely) allows at-least-once Kafka retries on worker crashes without duplicating posts in any user’s timeline.',
            techChoices: ['Kafka Consumer Fleet', 'Redis Pipelining', 'Hybrid Celebrity Cutoff'],
          },
        },
        {
          id: 'feed-svc',
          label: 'Timeline Service',
          sublabel: 'Merge Cache + Celebs',
          category: 'service',
          x: 398,
          y: 390,
          width: 162,
          height: 58,
          flows: ['read'],
          details: {
            role: 'Serves GET /feed in <150ms by reading pre-computed postIds from Redis, pulling recent posts of any CELEBRITIES the user follows on-the-fly, k-way merging by Snowflake timestamp, and hydrating full post payloads.',
            dataFlow: 'Parallel fan-in: (1) ZREVRANGEBYSCORE on Redis Timeline Cache, (2) fetch user’s followed celebrity IDs from Social Graph → read each celebrity’s cached outbox, (3) k-way merge top 20 IDs, (4) MGET hydration from User/Post Cache.',
            scalingStrategy: 'Stateless read fleet scaled independently on read QPS; typically a user follows only 5–20 celebrities, making the on-read merge tiny and fast.',
            failureHandling: 'If a celebrity cache shard times out, degrades gracefully by serving the cached regular timeline immediately rather than failing the whole page. Rebuilds cold inactive-user feeds lazily from DB on login.',
            techChoices: ['Parallel Async Fan-In', 'K-Way Heap Merge', 'Graceful Degradation'],
          },
        },
        {
          id: 'post-db',
          label: 'Post DB + S3 CDN',
          sublabel: 'Sharded Posts & Media',
          category: 'database',
          x: 700,
          y: 20,
          width: 208,
          height: 54,
          flows: ['write', 'read'],
          details: {
            role: 'Durable system of record for post content, author timeline index (used for celebrity reads & cold rebuilds), plus object storage/CDN for attached images & videos.',
            dataFlow: 'Receives synchronous writes from Post Service; serves cache-miss hydrations and celebrity author_posts slices.',
            scalingStrategy: 'Sharded by author_id (so fetching a celebrity’s latest 20 posts hits a single shard) with a secondary post_id lookup index; media served globally via S3 + CloudFront.',
            failureHandling: 'Multi-AZ synchronous primary/standby replication with read replicas absorbing cold-user timeline rebuild bursts.',
            techChoices: ['Cassandra / Sharded MySQL', 'Amazon S3', 'CloudFront CDN'],
          },
        },
        {
          id: 'kafka',
          label: 'Kafka Event Bus',
          sublabel: 'PostCreated Stream',
          category: 'queue',
          x: 700,
          y: 112,
          width: 208,
          height: 54,
          flows: ['write'],
          details: {
            role: 'Decouples Post publishing latency from async timeline fan-out, search indexing, and push notifications.',
            dataFlow: 'Post Service produces PostCreated events partitioned by authorId; Fan-Out Workers consume asynchronously in parallel.',
            scalingStrategy: 'High partition count (e.g., 128+ partitions) enables elastic consumer concurrency during breaking-news traffic spikes.',
            failureHandling: 'RF=3 durability across AZs; if Fan-Out Workers lag during a World Cup spike, Kafka buffers events cleanly while POST /posts stays <50ms.',
            techChoices: ['Apache Kafka', 'Partitioned Topics', 'Dead-Letter Queue'],
          },
        },
        {
          id: 'graph-svc',
          label: 'Social Graph Service',
          sublabel: 'Followers & Celeb Flags',
          category: 'cache',
          x: 700,
          y: 210,
          width: 208,
          height: 54,
          flows: ['write', 'read'],
          details: {
            role: 'Maintains directed follower/following adjacency lists (backed by TAO-like graph cache + sharded DB) and flags high-fanout celebrity accounts.',
            dataFlow: 'Queried by Fan-Out Workers for followers(authorId) and by Timeline Service for followedCelebrities(viewerId).',
            scalingStrategy: 'In-memory adjacency list cache sharded by userId; separates celebrity-followees into a compact dedicated Redis Set per viewer so read-time celebrity lookup is a single O(1) SMEMBERS call.',
            failureHandling: 'Read replicas per graph shard; stale edge updates during unfollow are filtered defensively during Timeline hydration.',
            techChoices: ['TAO / Redis Sets', 'Sharded Graph DB', 'Celebrity Bitflag'],
          },
        },
        {
          id: 'timeline-cache',
          label: 'Redis Timeline Cache',
          sublabel: 'ZSET of 800 postIds/user',
          category: 'cache',
          x: 700,
          y: 318,
          width: 208,
          height: 54,
          flows: ['write', 'read'],
          details: {
            role: 'Stores pre-materialized reverse-chronological home timelines as compact Sorted Sets of (score=SnowflakeId, member=postId) capped at 800 entries per active user.',
            dataFlow: 'Written by Fan-Out Workers via ZADD + ZREMRANGEBYRANK; read by Timeline Service via ZREVRANGEBYSCORE using cursor pagination.',
            scalingStrategy: '32+ Redis Cluster shards partitioned by viewer userId; storing IDs only (~24B/entry) keeps 100M active users under ~2 TB RAM.',
            failureHandling: 'Evicted/cold users (inactive >30d) trigger an on-demand cache rebuild from DB + followed authors on next login; replica promotion handles shard failures.',
            techChoices: ['Redis Cluster', 'Sorted Sets (ZSET)', 'ZREMRANGEBYRANK Cap'],
          },
        },
        {
          id: 'hydrator-cache',
          label: 'Post & User Cache',
          sublabel: 'MGET Payload Hydration',
          category: 'cache',
          x: 700,
          y: 418,
          width: 208,
          height: 54,
          flows: ['read'],
          details: {
            role: 'Hydrates the final 20 merged postIds into rich JSON cards (post text, author handle/avatar, like/retweet counts) in a single batched round-trip.',
            dataFlow: 'Timeline Service sends batched MGET for 20 postIds + distinct authorIds; misses fall back to Post DB / User DB and backfill cache.',
            scalingStrategy: 'Replicated Memcached/Redis cluster with local L1 hot-post cache on Timeline pods — viral celebrity posts stay cached in local RAM, eliminating hot-shard bottlenecks!',
            failureHandling: 'Because Timeline Cache stores IDs only, deleting or editing a post updates ONE key here and instantly reflects across millions of viewers’ feeds.',
            techChoices: ['Redis / Memcached', 'L1 Local Hot-Key Cache', 'Batched MGET'],
          },
        },
      ],
      edges: [
        { id: 'nf-1', from: 'clients', to: 'gateway', label: 'HTTPS', flow: 'both' },
        { id: 'nf-2', from: 'gateway', to: 'post-svc', label: 'POST /posts', flow: 'write', labelT: 0.45 },
        { id: 'nf-3', from: 'gateway', to: 'feed-svc', label: 'GET /feed', flow: 'read', labelT: 0.45 },
        { id: 'nf-4', from: 'post-svc', to: 'post-db', label: 'Write Post', flow: 'write', labelT: 0.5 },
        { id: 'nf-5', from: 'post-svc', to: 'kafka', label: 'Emit Event', flow: 'write', async: true, labelT: 0.5 },
        {
          id: 'nf-6',
          from: 'kafka',
          to: 'fanout-workers',
          label: 'Consume',
          flow: 'write',
          async: true,
          fromSide: 'left',
          toSide: 'right',
          labelT: 0.5,
        },
        { id: 'nf-7', from: 'fanout-workers', to: 'graph-svc', label: 'Followers', flow: 'write', labelT: 0.5 },
        {
          id: 'nf-8',
          from: 'fanout-workers',
          to: 'timeline-cache',
          label: 'ZADD Push',
          flow: 'write',
          async: true,
          labelT: 0.28,
        },
        { id: 'nf-9', from: 'feed-svc', to: 'timeline-cache', label: 'ZREVRANGE', flow: 'read', labelT: 0.58 },
        { id: 'nf-10', from: 'feed-svc', to: 'graph-svc', label: 'Celeb Pull', flow: 'read', labelT: 0.68 },
        { id: 'nf-11', from: 'feed-svc', to: 'hydrator-cache', label: 'Hydrate 20', flow: 'read', labelT: 0.5 },
      ],
    },
    tradeOffs: [
      {
        topic: 'Timeline Generation: Fan-Out on Write vs. Fan-Out on Read vs. Hybrid',
        context: 'Follower graphs follow a brutal power law: 99% of users have < 1,000 followers, while 0.01% of celebrities have 50M+ followers.',
        options: [
          {
            name: 'Pure Fan-Out on Write (Push)',
            pros: ['O(1) read latency — timeline is pre-built in Redis before the user opens the app'],
            cons: [
              'Celebrity Hot-Key Disaster: one post by a 50M-follower user triggers 50M Redis writes, causing multi-minute lag and memory churn',
              'Wastes write IOPS pushing posts to millions of dormant users who never log in',
            ],
            whenToChoose: 'Symmetric small-cap networks (e.g., Facebook Friends capped at 5,000).',
          },
          {
            name: 'Pure Fan-Out on Read (Pull)',
            pros: ['Zero write amplification; zero wasted work on inactive users'],
            cons: [
              'Catastrophic read latency: a user following 1,000 accounts forces 1,000-way scatter-gather + merge on every single feed refresh',
            ],
            whenToChoose: 'Very early-stage MVPs or write-heavy low-read internal logs.',
          },
          {
            name: 'Hybrid Push + Pull (Celebrity Threshold)',
            recommended: true,
            pros: [
              'Push (Fan-Out on Write) for normal authors (< 10K followers) keeps 99% of feeds pre-built in Redis',
              'Pull (Fan-Out on Read) for celebrity authors (≥ 10K followers) completely eliminates 50M-write storms',
              'Timeline Service merges cached Redis feed + ~10 followed celebrities in < 20ms',
            ],
            cons: ['Slightly higher read-service orchestration complexity (k-way merge + deduplication)'],
            whenToChoose: 'Production social feeds (Twitter/X, Instagram, LinkedIn) with skewed follower distributions.',
          },
        ],
        seniorVerdict:
          'Always propose the Hybrid model with a dynamic follower threshold (e.g., 10K–50K) PLUS skipping push for inactive followers (>30 days dormant). Call out both optimizations proactively — they immediately differentiate a 4.5-YOE answer.',
      },
      {
        topic: 'What to Store in Redis Timeline Cache: Full Post JSON vs. Post IDs Only',
        context: '100M active users × 800 timeline slots = 80 Billion cached timeline entries.',
        options: [
          {
            name: 'Denormalized Full Post JSON in Every Follower’s Feed',
            pros: ['Eliminates the final MGET hydration hop on read'],
            cons: [
              'Explodes RAM ~20× (from ~2 TB to ~40+ TB)',
              'Editing a typo, updating like counts, or deleting a TOS-violating post requires mutating millions of copies across follower caches',
            ],
            whenToChoose: 'Rarely — only for tiny immutable feeds with near-zero fan-out.',
          },
          {
            name: 'Compact Post IDs Only (ZSET) + Batched MGET Hydration',
            recommended: true,
            pros: [
              '20× smaller Redis memory footprint (~24 B per entry)',
              'Edits, deletions, and live engagement counters stay consistent from a single Post Cache key',
              'Enforces privacy/mute/block filters cleanly right at hydration time',
            ],
            cons: ['Adds one fast (~2ms) batched MGET round-trip for the 20 visible posts'],
            whenToChoose: 'Every large-scale social feed.',
          },
        ],
        seniorVerdict:
          'Store ONLY compact Snowflake postIds in Redis Sorted Sets and hydrate the visible page of 20 items via batched MGET against a hot Post/User cache.',
      },
      {
        topic: 'Pagination Strategy: Offset Pagination vs. Snowflake Cursor Pagination',
        context: 'New posts constantly arrive at the top of the Home Timeline while the user scrolls down.',
        options: [
          {
            name: 'OFFSET / LIMIT (Page 1, Page 2)',
            pros: ['Trivial SQL syntax'],
            cons: [
              'Duplicate/skipped items whenever new posts shift indices while scrolling',
              'O(offset) scan cost degrades sharply on deep scrolls',
            ],
            whenToChoose: 'Static admin tables where total page jumps are required.',
          },
          {
            name: 'Keyset / Cursor Pagination (score < lastPostId)',
            recommended: true,
            pros: [
              'Zero duplicate or skipped posts even during high-velocity live updates',
              'Constant O(log N + limit) seek time in both Redis ZREVRANGEBYSCORE and B-Tree indexes',
            ],
            cons: ['Cannot jump directly to "Page 47" (unnecessary for infinite-scroll feeds)'],
            whenToChoose: 'All real-time feeds, chat histories, and activity streams.',
          },
        ],
        seniorVerdict:
          'Use Snowflake postIds as opaque keyset cursors (ZREVRANGEBYSCORE feed:{uid} (cursor -inf LIMIT 0 20) — guarantees stable, duplicate-free infinite scroll at constant cost.',
      },
    ],
  },
};
