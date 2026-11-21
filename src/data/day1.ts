import type { DayCurriculum } from '@/types/curriculum';

export const day1: DayCurriculum = {
  dayNumber: 1,
  title: 'Sliding Window, Two Pointers & Prefix Sums',
  theme: 'Linear-Time Array Invariants, SOLID Domain Design & Read-Heavy Scale',
  status: 'complete',
  estimatedMinutes: 110,
  summary:
    'Eliminate nested O(n²) scans with monotonic window boundaries and prefix-sum hashing, design an extensible thread-safe Parking Lot in Java, and architect a globally cached URL Shortener built for 100:1 read-heavy traffic.',
  dsaLessons: [
    /* ================================================================
     * DSA 1: LONGEST SUBSTRING WITHOUT REPEATING CHARACTERS
     * ================================================================ */
    {
      id: 'day1-longest-substring',
      dayNumber: 1,
      kind: 'dsa',
      title: 'Longest Substring Without Repeating Characters',
      subtitle: 'Variable-size sliding window with O(1) last-seen index jumping',
      difficulty: 'Medium',
      patterns: ['Sliding Window', 'Hash Map', 'Monotonic Left Pointer'],
      estimatedMinutes: 12,
      leetcodeRef: 'LC #3',
      problemStatement:
        'Given a string s, find the length of the longest contiguous substring that contains no duplicate characters.',
      exampleSummary: {
        input: 's = "abcbda"',
        output: '4',
        explanation:
          'The longest valid substring is "cbda" (indices 2..5). Notice how seeing "a" at index 5 must NOT pull the left boundary backward to index 1.',
      },
      patternRecognition: {
        interviewCue:
          'Ask: "Am I looking for the longest or shortest contiguous subarray/substring satisfying a monotonic validity condition?" If adding characters can break validity and removing from the left restores it, reach for a sliding window.',
        signals: [
          'Keywords: "longest substring", "contiguous", "at most / no repeating"',
          'Validity is monotonic: any sub-window of a valid window is also valid',
          'String length up to 10⁵ demands O(n) rather than O(n²) brute force',
        ],
        mentalModel:
          'Maintain an active invariant window [left..right] where every character is unique. When s[right] collides with a previous occurrence inside [left..right], teleport left directly past that duplicate in O(1) instead of shrinking one step at a time.',
      },
      intuitionComparison: {
        bruteForce: {
          approach:
            'Enumerate every starting index i and expand j forward while inserting characters into a HashSet until a duplicate appears.',
          timeComplexity: 'O(n²)',
          spaceComplexity: 'O(min(n, Σ))',
          bottleneck:
            'Re-scans overlapping valid suffixes from scratch after every collision instead of preserving the suffix after the duplicate.',
        },
        optimal: {
          approach:
            'Scan right from 0 to n-1 while storing each character’s most recent index in a map (or int[128] for ASCII). On duplicate, advance left = Math.max(left, lastSeen[c] + 1).',
          timeComplexity: 'O(n)',
          spaceComplexity: 'O(min(n, Σ))',
          keyInvariant:
            'left is strictly non-decreasing. Stale map entries located strictly left of left are ignored automatically via Math.max.',
        },
      },
      visualizer: {
        kind: 'array-pointers',
        title: 'Last-Seen Jump Sliding Window Dry Run',
        inputSummary: 's = "abcbda"',
        steps: [
          {
            caption:
              'Start at r = 0 ("a"). The character is unseen, so the valid window is [0..0] ("a") with length 1.',
            formula: 'len = r - left + 1 = 0 - 0 + 1 = 1',
            values: ['a', 'b', 'c', 'b', 'd', 'a'],
            windowRange: { start: 0, end: 0, tone: 'primary', label: 'Valid Window' },
            cellStates: { 0: 'active' },
            pointers: [
              { label: 'L', index: 0, tone: 'amber' },
              { label: 'R', index: 0, tone: 'primary' },
            ],
            auxStructure: {
              title: 'lastSeen (char → index)',
              entries: [{ key: "'a'", value: '0', highlight: true, tone: 'primary' }],
            },
            variables: [
              { name: 'left', value: '0' },
              { name: 'right', value: '0' },
              { name: 'best', value: '1', tone: 'emerald' },
            ],
          },
          {
            caption:
              'Expand r = 1 ("b"). Not in current window. Record lastSeen["b"] = 1; window grows to "ab" (length 2).',
            formula: 'len = 1 - 0 + 1 = 2  →  best = max(1, 2) = 2',
            values: ['a', 'b', 'c', 'b', 'd', 'a'],
            windowRange: { start: 0, end: 1, tone: 'primary', label: 'Valid Window' },
            cellStates: { 1: 'active' },
            pointers: [
              { label: 'L', index: 0, tone: 'amber' },
              { label: 'R', index: 1, tone: 'primary' },
            ],
            auxStructure: {
              title: 'lastSeen (char → index)',
              entries: [
                { key: "'a'", value: '0' },
                { key: "'b'", value: '1', highlight: true, tone: 'primary' },
              ],
            },
            variables: [
              { name: 'left', value: '0' },
              { name: 'right', value: '1' },
              { name: 'best', value: '2', tone: 'emerald' },
            ],
          },
          {
            caption:
              'Expand r = 2 ("c"). Unseen character. Window becomes "abc" (length 3) and best updates to 3.',
            formula: 'len = 2 - 0 + 1 = 3  →  best = max(2, 3) = 3',
            values: ['a', 'b', 'c', 'b', 'd', 'a'],
            windowRange: { start: 0, end: 2, tone: 'primary', label: 'Valid Window' },
            cellStates: { 2: 'active' },
            pointers: [
              { label: 'L', index: 0, tone: 'amber' },
              { label: 'R', index: 2, tone: 'primary' },
            ],
            auxStructure: {
              title: 'lastSeen (char → index)',
              entries: [
                { key: "'a'", value: '0' },
                { key: "'b'", value: '1' },
                { key: "'c'", value: '2', highlight: true, tone: 'primary' },
              ],
            },
            variables: [
              { name: 'left', value: '0' },
              { name: 'right', value: '2' },
              { name: 'best', value: '3', tone: 'emerald' },
            ],
          },
          {
            caption:
              'Collision at r = 3 ("b")! Previous "b" was at index 1 (>= left). Teleport left directly to 1 + 1 = 2, dropping "ab". Window is now [2..3] ("cb"), length 2.',
            formula: 'left = max(0, lastSeen["b"] + 1) = max(0, 2) = 2',
            values: ['a', 'b', 'c', 'b', 'd', 'a'],
            windowRange: { start: 2, end: 3, tone: 'amber', label: 'Shifted Window' },
            cellStates: { 0: 'excluded', 1: 'excluded', 3: 'active' },
            pointers: [
              { label: 'L', index: 2, tone: 'amber' },
              { label: 'R', index: 3, tone: 'primary' },
            ],
            auxStructure: {
              title: 'lastSeen (char → index)',
              entries: [
                { key: "'a'", value: '0' },
                { key: "'b'", value: '3 (was 1)', highlight: true, tone: 'amber' },
                { key: "'c'", value: '2' },
              ],
            },
            variables: [
              { name: 'left', value: '2', tone: 'amber' },
              { name: 'right', value: '3' },
              { name: 'best', value: '3' },
            ],
          },
          {
            caption:
              'Expand r = 4 ("d"). Fresh character. Window grows to [2..4] ("cbd"), matching current best = 3.',
            formula: 'len = 4 - 2 + 1 = 3  →  best = max(3, 3) = 3',
            values: ['a', 'b', 'c', 'b', 'd', 'a'],
            windowRange: { start: 2, end: 4, tone: 'primary', label: 'Valid Window' },
            cellStates: { 0: 'excluded', 1: 'excluded', 4: 'active' },
            pointers: [
              { label: 'L', index: 2, tone: 'amber' },
              { label: 'R', index: 4, tone: 'primary' },
            ],
            auxStructure: {
              title: 'lastSeen (char → index)',
              entries: [
                { key: "'a'", value: '0' },
                { key: "'b'", value: '3' },
                { key: "'c'", value: '2' },
                { key: "'d'", value: '4', highlight: true, tone: 'primary' },
              ],
            },
            variables: [
              { name: 'left', value: '2' },
              { name: 'right', value: '4' },
              { name: 'best', value: '3' },
            ],
          },
          {
            caption:
              'Critical Senior Trap at r = 5 ("a")! "a" exists in lastSeen at index 0, which is STALE (0 < left = 2). Math.max(2, 0 + 1) keeps left pinned at 2! Window reaches [2..5] ("cbda"), setting best = 4.',
            formula: 'left = max(2, 0 + 1) = 2  →  len = 5 - 2 + 1 = 4 (Optimal!)',
            values: ['a', 'b', 'c', 'b', 'd', 'a'],
            windowRange: { start: 2, end: 5, tone: 'emerald', label: 'Longest Valid Window' },
            cellStates: { 0: 'excluded', 1: 'excluded', 2: 'match', 3: 'match', 4: 'match', 5: 'match' },
            pointers: [
              { label: 'L', index: 2, tone: 'amber' },
              { label: 'R', index: 5, tone: 'emerald' },
            ],
            auxStructure: {
              title: 'lastSeen (char → index)',
              entries: [
                { key: "'a'", value: '5 (stale 0 ignored)', highlight: true, tone: 'emerald' },
                { key: "'b'", value: '3' },
                { key: "'c'", value: '2' },
                { key: "'d'", value: '4' },
              ],
            },
            variables: [
              { name: 'left', value: '2' },
              { name: 'right', value: '5' },
              { name: 'best', value: '4', tone: 'emerald' },
            ],
          },
        ],
      },
      javaSolution: {
        filename: 'LongestUniqueSubstring.java',
        code: `import java.util.HashMap;
import java.util.Map;

public class LongestUniqueSubstring {
    public int lengthOfLongestSubstring(String s) {
        if (s == null || s.isEmpty()) {
            return 0;
        }

        // Maps each character to its most recent index in s
        Map<Character, Integer> lastSeen = new HashMap<>();
        int left = 0;
        int best = 0;

        for (int right = 0; right < s.length(); right++) {
            char ch = s.charAt(right);

            if (lastSeen.containsKey(ch)) {
                // Guard against moving left backward on stale entries outside [left..right]
                left = Math.max(left, lastSeen.get(ch) + 1);
            }

            lastSeen.put(ch, right);
            best = Math.max(best, right - left + 1);
        }

        return best;
    }
}`,
        callouts: [
          {
            id: 'lu-map',
            startLine: 11,
            endLine: 11,
            title: 'HashMap vs. int[128] Trade-Off',
            explanation:
              'Use HashMap<Character, Integer> when Unicode/UTF-16 characters are allowed. If the interviewer guarantees 7-bit ASCII, an int[128] initialized to -1 eliminates boxing overhead and GC pressure.',
            accent: 'primary',
          },
          {
            id: 'lu-guard',
            startLine: 18,
            endLine: 21,
            title: 'Monotonic Left-Boundary Guard',
            explanation:
              'The single most common interview bug is writing left = lastSeen.get(ch) + 1 without Math.max. Because we never delete old entries from the map, Math.max prevents left from jumping backward.',
            accent: 'amber',
          },
          {
            id: 'lu-update',
            startLine: 23,
            endLine: 24,
            title: 'Overwrite Index & Measure Window',
            explanation:
              'Always update lastSeen with right AFTER adjusting left, then compute the inclusive window width right - left + 1.',
            accent: 'emerald',
          },
        ],
      },
      complexity: {
        time: 'O(n)',
        space: 'O(min(n, Σ))',
        timeExplanation:
          'Single pass over the string: right visits each character exactly once, and each HashMap lookup/put is amortized O(1).',
        spaceExplanation:
          'The map stores at most min(n, Σ) distinct characters, where Σ is the alphabet size (128 for ASCII, up to 65,536 for BMP UTF-16 chars).',
      },
      edgeCases: [
        {
          title: 'Stale Duplicate Left of Window ("abba")',
          scenario: 'When right reaches the second "a", left is already at 2 while lastSeen["a"] is 0.',
          handling: 'Math.max(left, prevIndex + 1) guarantees left never regresses.',
        },
        {
          title: 'Unicode Surrogate Pairs & Emoji',
          scenario: 'In Java, String.charAt() iterates UTF-16 code units, splitting 4-byte emoji into two chars.',
          handling: 'Mention iterating s.codePoints().toArray() with Map<Integer, Integer> if true Unicode grapheme/code-point correctness is required.',
        },
        {
          title: 'Empty String or All Identical Characters ("aaaa")',
          scenario: 'Empty input returns 0; all-same characters must jump left on every step and return 1.',
          handling: 'Explicit null/empty guard handles length 0; loop naturally yields best = 1 for "aaaa".',
        },
      ],
    },

    /* ================================================================
     * DSA 2: MINIMUM WINDOW SUBSTRING
     * ================================================================ */
    {
      id: 'day1-min-window-substring',
      dayNumber: 1,
      kind: 'dsa',
      title: 'Minimum Window Substring',
      subtitle: 'Expand-until-valid, contract-until-invalid frequency counter template',
      difficulty: 'Hard',
      patterns: ['Sliding Window', 'Frequency Counter', 'Formed/Required Invariant'],
      estimatedMinutes: 16,
      leetcodeRef: 'LC #76',
      problemStatement:
        'Given two strings s and t, return the shortest contiguous substring of s that contains every character in t (including duplicate multiplicities). Return "" if no such substring exists.',
      exampleSummary: {
        input: 's = "ADOBECODEBANC", t = "ABC"',
        output: '"BANC"',
        explanation:
          'Multiple valid windows exist ("ADOBEC", "CODEBA", "ODEBANC", "BANC"), and "BANC" (length 4) is the minimum.',
      },
      patternRecognition: {
        interviewCue:
          'Whenever a problem asks for the SHORTEST substring/subarray containing all required frequencies from a target set, use the two-phase Expand/Contract Sliding Window with a formed == required integer counter.',
        signals: [
          'Minimum length contiguous subarray/substring covering a target multiset',
          'Duplicate counts in t matter (e.g., t = "AABC" needs two A’s)',
          'Checking full map equality each step would cost O(Σ) — an integer formed counter keeps checks O(1)',
        ],
        mentalModel:
          'Expand right to satisfy unmet character quotas until formed == required. The instant the window is valid, greedily contract left to shed redundant characters and record the tightest valid window until validity breaks.',
      },
      intuitionComparison: {
        bruteForce: {
          approach:
            'Generate all O(n²) substrings of s and count character frequencies for each to verify coverage of t.',
          timeComplexity: 'O(n² · Σ)',
          spaceComplexity: 'O(Σ)',
          bottleneck:
            'Recomputes frequency tables repeatedly across overlapping substrings and fails to exploit that shrinking from the left preserves suffix work.',
        },
        optimal: {
          approach:
            'Pre-populate need[128] from t and count distinct required chars. Advance right to increment window[], bumping formed only when window[c] == need[c]. While formed == required, record best and shrink left.',
          timeComplexity: 'O(|s| + |t|)',
          spaceComplexity: 'O(Σ) = O(1) for ASCII',
          keyInvariant:
            'Both left and right move monotonically from 0 to |s| - 1; each character enters and leaves the window at most once.',
        },
      },
      visualizer: {
        kind: 'array-pointers',
        title: 'Expand & Contract Sliding Window Dry Run',
        inputSummary: 's = "ADOBECODEBANC", t = "ABC"',
        steps: [
          {
            caption:
              'Pre-process t = "ABC": need = {A:1, B:1, C:1}, so required = 3 distinct character quotas must be met. Start with left = 0, formed = 0.',
            formula: 'required = 3 (A≥1, B≥1, C≥1)',
            values: ['A', 'D', 'O', 'B', 'E', 'C', 'O', 'D', 'E', 'B', 'A', 'N', 'C'],
            pointers: [{ label: 'L,R', index: 0, tone: 'primary' }],
            auxStructure: {
              title: 'Window vs. Need Quotas',
              entries: [
                { key: 'A', value: '0 / 1' },
                { key: 'B', value: '0 / 1' },
                { key: 'C', value: '0 / 1' },
              ],
            },
            variables: [
              { name: 'formed', value: '0 / 3' },
              { name: 'best', value: 'none' },
            ],
          },
          {
            caption:
              'Expand R = 0..3: "A" satisfies quota (formed=1), "D","O" are irrelevant, and "B" at index 3 satisfies its quota (formed=2). Still missing "C".',
            formula: 'win[A]=1 == need[A], win[B]=1 == need[B]  →  formed = 2',
            values: ['A', 'D', 'O', 'B', 'E', 'C', 'O', 'D', 'E', 'B', 'A', 'N', 'C'],
            windowRange: { start: 0, end: 3, tone: 'primary', label: 'Expanding' },
            cellStates: { 0: 'match', 3: 'active' },
            pointers: [
              { label: 'L', index: 0, tone: 'amber' },
              { label: 'R', index: 3, tone: 'primary' },
            ],
            auxStructure: {
              title: 'Window vs. Need Quotas',
              entries: [
                { key: 'A', value: '1 / 1 ✓', highlight: true, tone: 'emerald' },
                { key: 'B', value: '1 / 1 ✓', highlight: true, tone: 'emerald' },
                { key: 'C', value: '0 / 1' },
              ],
            },
            variables: [
              { name: 'formed', value: '2 / 3' },
              { name: 'best', value: 'none' },
            ],
          },
          {
            caption:
              'R = 5 hits "C"! Now formed == 3 == required. First valid window found: [0..5] = "ADOBEC" (length 6). Record best = (0, 6).',
            formula: 'formed == required (3 == 3)  →  candidate "ADOBEC" (len 6)',
            values: ['A', 'D', 'O', 'B', 'E', 'C', 'O', 'D', 'E', 'B', 'A', 'N', 'C'],
            windowRange: { start: 0, end: 5, tone: 'emerald', label: 'Valid Window (len 6)' },
            cellStates: { 0: 'match', 3: 'match', 5: 'active' },
            pointers: [
              { label: 'L', index: 0, tone: 'amber' },
              { label: 'R', index: 5, tone: 'emerald' },
            ],
            auxStructure: {
              title: 'Window vs. Need Quotas',
              entries: [
                { key: 'A', value: '1 / 1 ✓', highlight: true, tone: 'emerald' },
                { key: 'B', value: '1 / 1 ✓', highlight: true, tone: 'emerald' },
                { key: 'C', value: '1 / 1 ✓', highlight: true, tone: 'emerald' },
              ],
            },
            variables: [
              { name: 'formed', value: '3 / 3', tone: 'emerald' },
              { name: 'best', value: '"ADOBEC" (6)', tone: 'emerald' },
            ],
          },
          {
            caption:
              'Contract L from 0: removing s[0]="A" drops win[A] to 0 (< need[A]), so formed falls to 2. Contraction stops at L = 1; resume expanding R to find another "A".',
            formula: 'remove s[0]="A"  →  win[A]=0 < 1  →  formed = 2, L = 1',
            values: ['A', 'D', 'O', 'B', 'E', 'C', 'O', 'D', 'E', 'B', 'A', 'N', 'C'],
            windowRange: { start: 1, end: 5, tone: 'amber', label: 'Invalid — Need A' },
            cellStates: { 0: 'excluded', 1: 'active' },
            pointers: [
              { label: 'L', index: 1, tone: 'amber' },
              { label: 'R', index: 5, tone: 'primary' },
            ],
            auxStructure: {
              title: 'Window vs. Need Quotas',
              entries: [
                { key: 'A', value: '0 / 1 ✗', highlight: true, tone: 'rose' },
                { key: 'B', value: '1 / 1 ✓' },
                { key: 'C', value: '1 / 1 ✓' },
              ],
            },
            variables: [
              { name: 'formed', value: '2 / 3', tone: 'rose' },
              { name: 'best', value: '"ADOBEC" (6)' },
            ],
          },
          {
            caption:
              'Expand R from 6 to 10: picks up a surplus "B" at index 9 (win[B]=2) and finally hits "A" at index 10! Validity restored (formed = 3) with window [1..10] (length 10).',
            formula: 's[10]="A" restores win[A]=1  →  formed = 3 (win[B]=2 surplus)',
            values: ['A', 'D', 'O', 'B', 'E', 'C', 'O', 'D', 'E', 'B', 'A', 'N', 'C'],
            windowRange: { start: 1, end: 10, tone: 'emerald', label: 'Valid (len 10)' },
            cellStates: { 0: 'excluded', 10: 'active' },
            pointers: [
              { label: 'L', index: 1, tone: 'amber' },
              { label: 'R', index: 10, tone: 'emerald' },
            ],
            auxStructure: {
              title: 'Window vs. Need Quotas',
              entries: [
                { key: 'A', value: '1 / 1 ✓', highlight: true, tone: 'emerald' },
                { key: 'B', value: '2 / 1 (surplus)', highlight: true, tone: 'amber' },
                { key: 'C', value: '1 / 1 ✓' },
              ],
            },
            variables: [
              { name: 'formed', value: '3 / 3', tone: 'emerald' },
              { name: 'best', value: '"ADOBEC" (6)' },
            ],
          },
          {
            caption:
              'Contract L aggressively past D(1), O(2), surplus B(3) [win[B] drops 2→1, still valid!], and E(4) until L = 5 ("C"). Window [5..10] = "CODEBA" ties length 6. Stepping past C(5) breaks formed → 2 at L = 6.',
            formula: 'L jumps 1→5 while formed==3 ("CODEBA", len 6), then L=6 breaks C',
            values: ['A', 'D', 'O', 'B', 'E', 'C', 'O', 'D', 'E', 'B', 'A', 'N', 'C'],
            windowRange: { start: 5, end: 10, tone: 'amber', label: 'Tightened to "CODEBA"' },
            cellStates: { 0: 'excluded', 1: 'excluded', 2: 'excluded', 3: 'excluded', 4: 'excluded', 5: 'active' },
            pointers: [
              { label: 'L', index: 5, tone: 'amber' },
              { label: 'R', index: 10, tone: 'primary' },
            ],
            auxStructure: {
              title: 'Window vs. Need Quotas (at L=5)',
              entries: [
                { key: 'A', value: '1 / 1 ✓' },
                { key: 'B', value: '1 / 1 ✓' },
                { key: 'C', value: '1 / 1 → 0 next', highlight: true, tone: 'amber' },
              ],
            },
            variables: [
              { name: 'formed', value: '3 → 2' },
              { name: 'best', value: '"ADOBEC" (6)' },
            ],
          },
          {
            caption:
              'With L = 6, expand R to 12 ("C"). Quota for "C" is satisfied again (formed = 3)! Valid window is [6..12] = "ODEBANC" (length 7). Now enter contraction loop.',
            formula: 's[12]="C"  →  formed = 3  →  contract L from 6',
            values: ['A', 'D', 'O', 'B', 'E', 'C', 'O', 'D', 'E', 'B', 'A', 'N', 'C'],
            windowRange: { start: 6, end: 12, tone: 'emerald', label: 'Valid (len 7)' },
            cellStates: { 12: 'active' },
            pointers: [
              { label: 'L', index: 6, tone: 'amber' },
              { label: 'R', index: 12, tone: 'emerald' },
            ],
            auxStructure: {
              title: 'Window vs. Need Quotas',
              entries: [
                { key: 'A', value: '1 / 1 ✓' },
                { key: 'B', value: '1 / 1 ✓' },
                { key: 'C', value: '1 / 1 ✓', highlight: true, tone: 'emerald' },
              ],
            },
            variables: [
              { name: 'formed', value: '3 / 3', tone: 'emerald' },
              { name: 'best', value: '"ADOBEC" (6)' },
            ],
          },
          {
            caption:
              'Contract L past irrelevant O(6), D(7), E(8) right up to L = 9 ("B")! Window [9..12] = "BANC" has length 4 — new global minimum! Dropping B(9) exits loop; R finishes at end of s.',
            formula: 'len = 12 - 9 + 1 = 4 < 6  →  best = "BANC"',
            values: ['A', 'D', 'O', 'B', 'E', 'C', 'O', 'D', 'E', 'B', 'A', 'N', 'C'],
            windowRange: { start: 9, end: 12, tone: 'emerald', label: 'Optimal Minimum Window' },
            cellStates: { 9: 'match', 10: 'match', 11: 'match', 12: 'match' },
            pointers: [
              { label: 'L', index: 9, tone: 'emerald' },
              { label: 'R', index: 12, tone: 'emerald' },
            ],
            auxStructure: {
              title: 'Final Quotas in "BANC"',
              entries: [
                { key: 'A', value: '1 / 1 ✓', highlight: true, tone: 'emerald' },
                { key: 'B', value: '1 / 1 ✓', highlight: true, tone: 'emerald' },
                { key: 'C', value: '1 / 1 ✓', highlight: true, tone: 'emerald' },
              ],
            },
            variables: [
              { name: 'formed', value: '3 / 3', tone: 'emerald' },
              { name: 'best', value: '"BANC" (4)', tone: 'emerald' },
            ],
          },
        ],
      },
      javaSolution: {
        filename: 'MinimumWindowSubstring.java',
        code: `public class MinimumWindowSubstring {
    public String minWindow(String s, String t) {
        if (s == null || t == null || s.length() < t.length() || t.isEmpty()) {
            return "";
        }

        int[] need = new int[128];
        int required = 0;
        for (int i = 0; i < t.length(); i++) {
            char c = t.charAt(i);
            if (need[c] == 0) {
                required++; // Count distinct characters that have a quota
            }
            need[c]++;
        }

        int[] window = new int[128];
        int formed = 0;
        int bestStart = 0;
        int bestLen = Integer.MAX_VALUE;

        for (int left = 0, right = 0; right < s.length(); right++) {
            char in = s.charAt(right);
            window[in]++;

            if (need[in] > 0 && window[in] == need[in]) {
                formed++;
            }

            while (formed == required) {
                if (right - left + 1 < bestLen) {
                    bestLen = right - left + 1;
                    bestStart = left;
                }

                char out = s.charAt(left++);
                if (need[out] > 0 && window[out] == need[out]) {
                    formed--;
                }
                window[out]--;
            }
        }

        return bestLen == Integer.MAX_VALUE ? "" : s.substring(bestStart, bestStart + bestLen);
    }
}`,
        callouts: [
          {
            id: 'mw-required',
            startLine: 7,
            endLine: 15,
            title: 'Count Distinct Quotas, Not t.length()',
            explanation:
              'Counting distinct characters (required) instead of total characters lets formed increment exactly once when window[c] crosses need[c], preventing duplicate surplus letters from prematurely declaring validity.',
            accent: 'primary',
          },
          {
            id: 'mw-strict-eq',
            startLine: 26,
            endLine: 28,
            title: 'Exact Equality Trigger (==, not >=)',
            explanation:
              'Using window[in] == need[in] ensures formed increments ONLY on the exact transition from unmet to met. If using Map<Character, Integer>, always call .intValue() or .equals() to avoid Java Integer caching bugs above 127!',
            accent: 'amber',
          },
          {
            id: 'mw-contract',
            startLine: 30,
            endLine: 41,
            title: 'Record Before Breaking Invariant',
            explanation:
              'Check and store (bestStart, bestLen) BEFORE evicting s.charAt(left). Only copy the substring once at line 44 instead of allocating O(n) Strings inside the inner loop.',
            accent: 'emerald',
          },
        ],
      },
      complexity: {
        time: 'O(|s| + |t|)',
        space: 'O(Σ) = O(1) for ASCII',
        timeExplanation:
          'Building need[] takes O(|t|). In the main loop, both right and left advance monotonically up to |s|, giving at most 2·|s| character visits.',
        spaceExplanation:
          'Two fixed-size int[128] frequency arrays occupy constant memory. For arbitrary Unicode strings, swap to HashMap<Character, Integer> for O(Σ) space.',
      },
      edgeCases: [
        {
          title: 'Java Integer Auto-Boxing Trap (> 127)',
          scenario: 'Using Map<Character, Integer> and writing window.get(c) == need.get(c) fails when a character occurs 128+ times!',
          handling: 'Java caches Integer objects only in [-128, 127]. Use primitive int[] arrays or .equals() / .intValue(). Interviewers love catching this at 4.5 YOE.',
        },
        {
          title: 'Duplicate Characters in Target t ("AA")',
          scenario: 'A naive Set<Character> misses multiplicity requirements when t repeats characters.',
          handling: 'Frequency counts + exact threshold crossing (window[c] == need[c]) handles arbitrary multiplicities cleanly.',
        },
        {
          title: 'Sparse Relevant Characters in Huge s',
          scenario: 'What if |s| = 10⁶ but only 500 characters in s appear in t?',
          handling: 'Follow-up optimization: pre-filter s into a list of (index, char) pairs containing only chars with need[c] > 0, reducing contraction overhead to O(|filtered|).',
        },
      ],
    },

    /* ================================================================
     * DSA 3: CONTAINER WITH MOST WATER
     * ================================================================ */
    {
      id: 'day1-container-water',
      dayNumber: 1,
      kind: 'dsa',
      title: 'Container With Most Water',
      subtitle: 'Greedy two-pointer search space elimination with formal proof',
      difficulty: 'Medium',
      patterns: ['Two Pointers', 'Greedy Elimination', 'Opposite Ends'],
      estimatedMinutes: 11,
      leetcodeRef: 'LC #11',
      problemStatement:
        'Given an integer array height of length n representing vertical lines at indices 0..n-1, pick two lines that together with the x-axis form a container holding the maximum amount of water: (r - l) × min(height[l], height[r]).',
      exampleSummary: {
        input: 'height = [1, 8, 6, 2, 5, 4, 8, 3, 7]',
        output: '49',
        explanation:
          'Lines at index 1 (height 8) and index 8 (height 7) span width 7 with limiting height 7, holding 7 × 7 = 49.',
      },
      patternRecognition: {
        interviewCue:
          'When optimizing a pairwise function f(i, j) = width(i, j) × bottleneck(a[i], a[j]) over indices i < j, start at maximum width (0, n-1) and prove which pointer can be safely discarded.',
        signals: [
          'Objective combines index distance (j - i) with min(a[i], a[j])',
          'Moving inward strictly reduces width, so the ONLY chance to beat current best is raising the bottleneck height',
          'No sorting allowed because original x-positions determine width',
        ],
        mentalModel:
          'Suppose height[L] < height[R]. Every untested pair (L, k) for L < k < R has strictly smaller width AND height capped at ≤ height[L]. Therefore L has already achieved its maximum possible area with R — discard L permanently.',
      },
      intuitionComparison: {
        bruteForce: {
          approach: 'Check all n(n - 1)/2 index pairs (i, j) and track max((j - i) * min(h[i], h[j])).',
          timeComplexity: 'O(n²)',
          spaceComplexity: 'O(1)',
          bottleneck:
            'Evaluates dominated pairs where the shorter endpoint cannot possibly yield a larger area at narrower widths.',
        },
        optimal: {
          approach:
            'Initialize L = 0, R = n - 1. Compute area, then advance whichever pointer stands on the shorter bar (eliminating an entire row/column of the pair matrix in one step).',
          timeComplexity: 'O(n)',
          spaceComplexity: 'O(1)',
          keyInvariant:
            'At every step, every discarded index is mathematically proven incapable of forming a strictly better container with any remaining index.',
        },
      },
      visualizer: {
        kind: 'array-pointers',
        title: 'Opposite-End Greedy Two-Pointer Dry Run',
        inputSummary: 'height = [1, 8, 6, 2, 5, 4, 8, 3, 7]',
        steps: [
          {
            caption:
              'Start at maximum width: L = 0 (h=1), R = 8 (h=7). Area = (8 - 0) × min(1, 7) = 8. Since h[L]=1 is the bottleneck, NO narrower partner for L=0 can exceed 8. Advance L++.',
            formula: 'area = (8 - 0) × min(1, 7) = 8  |  h[L] < h[R] → L++',
            values: [1, 8, 6, 2, 5, 4, 8, 3, 7],
            barMode: { maxHeight: 8, shadedSpan: { start: 0, end: 8, height: 1 } },
            cellStates: { 0: 'active', 8: 'active' },
            pointers: [
              { label: 'L', index: 0, tone: 'amber' },
              { label: 'R', index: 8, tone: 'primary' },
            ],
            variables: [
              { name: 'width', value: '8' },
              { name: 'area', value: '8' },
              { name: 'best', value: '8', tone: 'emerald' },
            ],
          },
          {
            caption:
              'L = 1 (h=8), R = 8 (h=7). Area = (8 - 1) × min(8, 7) = 49 — massive jump! Now R=8 is the shorter wall (7 < 8), so discard R--.',
            formula: 'area = (8 - 1) × min(8, 7) = 49  |  h[R] < h[L] → R--',
            values: [1, 8, 6, 2, 5, 4, 8, 3, 7],
            barMode: { maxHeight: 8, shadedSpan: { start: 1, end: 8, height: 7 } },
            cellStates: { 0: 'excluded', 1: 'best', 8: 'best' },
            pointers: [
              { label: 'L', index: 1, tone: 'emerald' },
              { label: 'R', index: 8, tone: 'emerald' },
            ],
            variables: [
              { name: 'width', value: '7' },
              { name: 'area', value: '49', tone: 'emerald' },
              { name: 'best', value: '49', tone: 'emerald' },
            ],
          },
          {
            caption:
              'L = 1 (h=8), R = 7 (h=3). Area = (7 - 1) × min(8, 3) = 18 < 49. Bottleneck is R=7 (h=3), so discard R--.',
            formula: 'area = (7 - 1) × min(8, 3) = 18  |  h[R] < h[L] → R--',
            values: [1, 8, 6, 2, 5, 4, 8, 3, 7],
            barMode: { maxHeight: 8, shadedSpan: { start: 1, end: 7, height: 3 } },
            cellStates: { 0: 'excluded', 8: 'excluded', 1: 'active', 7: 'active' },
            pointers: [
              { label: 'L', index: 1, tone: 'amber' },
              { label: 'R', index: 7, tone: 'primary' },
            ],
            variables: [
              { name: 'width', value: '6' },
              { name: 'area', value: '18' },
              { name: 'best', value: '49', tone: 'emerald' },
            ],
          },
          {
            caption:
              'L = 1 (h=8), R = 6 (h=8). Area = (6 - 1) × min(8, 8) = 40 < 49. Tie case: when h[L] == h[R], neither wall can pair with any inner wall to beat 40! Moving either (or both) is safe; advance L++.',
            formula: 'area = (6 - 1) × min(8, 8) = 40  |  tie → advance L++',
            values: [1, 8, 6, 2, 5, 4, 8, 3, 7],
            barMode: { maxHeight: 8, shadedSpan: { start: 1, end: 6, height: 8 } },
            cellStates: { 0: 'excluded', 7: 'excluded', 8: 'excluded', 1: 'active', 6: 'active' },
            pointers: [
              { label: 'L', index: 1, tone: 'amber' },
              { label: 'R', index: 6, tone: 'primary' },
            ],
            variables: [
              { name: 'width', value: '5' },
              { name: 'area', value: '40' },
              { name: 'best', value: '49', tone: 'emerald' },
            ],
          },
          {
            caption:
              'L = 2 (h=6), R = 6 (h=8). Area = 4 × 6 = 24. Moving L inward through indices 3(h=2), 4(h=5), 5(h=4) yields areas 6, 10, 4 — none exceed 49.',
            formula: 'area = (6 - 2) × min(6, 8) = 24  |  remaining widths ≤ 4',
            values: [1, 8, 6, 2, 5, 4, 8, 3, 7],
            barMode: { maxHeight: 8, shadedSpan: { start: 2, end: 6, height: 6 } },
            cellStates: { 0: 'excluded', 1: 'excluded', 7: 'excluded', 8: 'excluded', 2: 'active', 6: 'active' },
            pointers: [
              { label: 'L', index: 2, tone: 'amber' },
              { label: 'R', index: 6, tone: 'primary' },
            ],
            variables: [
              { name: 'width', value: '4' },
              { name: 'area', value: '24' },
              { name: 'best', value: '49', tone: 'emerald' },
            ],
          },
          {
            caption:
              'Pointers converge at index 6 (L == R). Search terminates in O(n) with proven global optimum 49 between lines [1] and [8].',
            formula: 'Optimal Container: indices (1, 8) → 7 × 7 = 49',
            values: [1, 8, 6, 2, 5, 4, 8, 3, 7],
            barMode: { maxHeight: 8, shadedSpan: { start: 1, end: 8, height: 7 } },
            cellStates: { 1: 'best', 8: 'best' },
            pointers: [
              { label: 'BEST L', index: 1, tone: 'emerald' },
              { label: 'BEST R', index: 8, tone: 'emerald' },
            ],
            variables: [
              { name: 'bestPair', value: '(1, 8)', tone: 'emerald' },
              { name: 'best', value: '49', tone: 'emerald' },
            ],
          },
        ],
      },
      javaSolution: {
        filename: 'ContainerWithMostWater.java',
        code: `public class ContainerWithMostWater {
    public int maxArea(int[] height) {
        if (height == null || height.length < 2) {
            return 0;
        }

        int left = 0;
        int right = height.length - 1;
        int maxArea = 0;

        while (left < right) {
            int minHeight = Math.min(height[left], height[right]);
            int width = right - left;
            maxArea = Math.max(maxArea, minHeight * width);

            // Skip all consecutive walls that cannot exceed the current bottleneck
            while (left < right && height[left] <= minHeight) {
                left++;
            }
            while (left < right && height[right] <= minHeight) {
                right--;
            }
        }

        return maxArea;
    }
}`,
        callouts: [
          {
            id: 'cw-area',
            startLine: 12,
            endLine: 14,
            title: 'Width × Bottleneck Height',
            explanation:
              'Container capacity is governed strictly by the shorter wall; internal bars do not displace water in this problem (unlike Trapping Rain Water).',
            accent: 'primary',
          },
          {
            id: 'cw-skip',
            startLine: 17,
            endLine: 22,
            title: 'Pruned Pointer Skipping (Senior Optimization)',
            explanation:
              'Since width strictly shrinks as pointers move inward, any wall ≤ minHeight cannot possibly beat maxArea. Skipping both sides cleanly handles ties (height[left] == height[right]) in a single step too!',
            accent: 'emerald',
          },
        ],
      },
      complexity: {
        time: 'O(n)',
        space: 'O(1)',
        timeExplanation:
          'left only increases and right only decreases until they meet; every index is inspected at most once.',
        spaceExplanation: 'Only scalar integer variables are allocated.',
      },
      edgeCases: [
        {
          title: 'Equal Heights Tie-Break (height[L] == height[R])',
          scenario: 'Interviewers frequently ask: "What if both walls are equal — could moving the wrong one miss the optimum?"',
          handling:
            'Prove it concisely: any container using L (or R) with an interior wall k has width < R - L and height ≤ height[L], so its area is strictly smaller than the current area. Both endpoints can actually be retired simultaneously!',
        },
        {
          title: 'Integer Overflow on Large Inputs',
          scenario: 'If height[i] up to 10⁶ and n up to 10⁵, product reaches 10¹¹, overflowing signed 32-bit int.',
          handling: 'Mention widening area calculations to long when constraints allow width × height > 2.14 × 10⁹.',
        },
        {
          title: 'Zero-Height Bars & Two-Element Input',
          scenario: 'height = [0, 0] or [5, 5].',
          handling: 'The while (left < right) loop executes once and accurately returns 0 or 5.',
        },
      ],
    },

    /* ================================================================
     * DSA 4: TRAPPING RAIN WATER
     * ================================================================ */
    {
      id: 'day1-trapping-rain-water',
      dayNumber: 1,
      kind: 'dsa',
      title: 'Trapping Rain Water',
      subtitle: 'O(1)-space two-pointer water-level invariant vs. prefix/suffix maxima',
      difficulty: 'Hard',
      patterns: ['Two Pointers', 'Prefix/Suffix Max', 'Water-Level Invariant'],
      estimatedMinutes: 15,
      leetcodeRef: 'LC #42',
      problemStatement:
        'Given n non-negative integers representing an elevation map where each bar has width 1, compute how many units of rainwater can be trapped after raining.',
      exampleSummary: {
        input: 'height = [0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1]',
        output: '6',
        explanation:
          'Water pools at indices 2 (+1), 4 (+1), 5 (+2), 6 (+1), and 9 (+1), summing to 6 units.',
      },
      patternRecognition: {
        interviewCue:
          'Water above index i depends on min(maxLeft[i], maxRight[i]) - height[i]. Whenever a per-index answer depends only on the minimum of a prefix maximum and suffix maximum, two opposite-end pointers eliminate the O(n) prefix/suffix arrays.',
        signals: [
          'Per-cell contribution depends on highest boundary on BOTH left and right',
          'Classic O(n) space solution uses leftMax[] and rightMax[] arrays',
          'Follow-up question at 4.5 YOE: "Can you reduce auxiliary memory from O(n) to O(1)?"',
        ],
        mentalModel:
          'If leftMax <= rightMax, we do NOT need to know the exact true maximum to the right of L! We already know some wall ≥ rightMax ≥ leftMax exists on the right, so leftMax is GUARANTEED to be the limiting boundary for index L.',
      },
      intuitionComparison: {
        bruteForce: {
          approach:
            'For every index i, scan left (0..i) for leftMax and scan right (i..n-1) for rightMax, then add min(leftMax, rightMax) - height[i].',
          timeComplexity: 'O(n²)',
          spaceComplexity: 'O(1)',
          bottleneck: 'Re-scans the same prefix and suffix heights for every single bar.',
        },
        optimal: {
          approach:
            'Maintain L, R, leftMax, rightMax. Always advance the side with the smaller running maximum (or smaller height), accumulating (sideMax - height[idx]) in O(1) space.',
          timeComplexity: 'O(n)',
          spaceComplexity: 'O(1)',
          keyInvariant:
            'When height[L] <= height[R], every bar processed at L is bounded on the right by at least height[R] >= leftMax, so water[L] = max(0, leftMax - height[L]) is exact.',
        },
      },
      visualizer: {
        kind: 'array-pointers',
        title: 'O(1)-Space Two-Pointer Water Accumulation',
        inputSummary: 'height = [0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1]',
        steps: [
          {
            caption:
              'Initialize L = 0 (h=0), R = 11 (h=1). Since h[L] <= h[R], process L=0: leftMax becomes 0, no water trapped, advance L → 1.',
            formula: 'h[0]=0 ≤ h[11]=1 → process L=0: water += 0',
            values: [0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1],
            barMode: { maxHeight: 3, waterLevels: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] },
            cellStates: { 0: 'active' },
            pointers: [
              { label: 'L', index: 0, tone: 'amber' },
              { label: 'R', index: 11, tone: 'primary' },
            ],
            variables: [
              { name: 'leftMax', value: '0' },
              { name: 'rightMax', value: '0' },
              { name: 'totalWater', value: '0' },
            ],
          },
          {
            caption:
              'L = 1 (h=1) <= R = 11 (h=1). Update leftMax = 1. Since h[1] == leftMax, 0 water sits on bar 1. Advance L → 2.',
            formula: 'leftMax = max(0, 1) = 1 → water[1] = 0',
            values: [0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1],
            barMode: { maxHeight: 3, waterLevels: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] },
            cellStates: { 1: 'active' },
            pointers: [
              { label: 'L', index: 1, tone: 'amber' },
              { label: 'R', index: 11, tone: 'primary' },
            ],
            variables: [
              { name: 'leftMax', value: '1', tone: 'amber' },
              { name: 'rightMax', value: '0' },
              { name: 'totalWater', value: '0' },
            ],
          },
          {
            caption:
              'L = 2 (h=0) <= R = 11 (h=1). Because R=11 is at least 1 high and leftMax=1, index 2 is bounded by height 1! Trap 1 - 0 = +1 unit at index 2.',
            formula: 'water[2] = leftMax(1) - height[2](0) = +1  →  total = 1',
            values: [0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1],
            barMode: { maxHeight: 3, waterLevels: [0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0] },
            cellStates: { 2: 'active' },
            pointers: [
              { label: 'L', index: 2, tone: 'amber' },
              { label: 'R', index: 11, tone: 'primary' },
            ],
            variables: [
              { name: 'leftMax', value: '1' },
              { name: 'rightMax', value: '0' },
              { name: 'totalWater', value: '1', tone: 'emerald' },
            ],
          },
          {
            caption:
              'L = 3 (h=2) > R = 11 (h=1)! Switch to the right side: process R=11 → rightMax = 1, water[11] = 0, R moves to 10. Next, L=3 (h=2) <= R=10 (h=2), so leftMax climbs to 2, L → 4.',
            formula: 'R=11 sets rightMax=1; then L=3 raises leftMax=2',
            values: [0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1],
            barMode: { maxHeight: 3, waterLevels: [0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0] },
            cellStates: { 3: 'active', 10: 'active' },
            pointers: [
              { label: 'L', index: 3, tone: 'amber' },
              { label: 'R', index: 10, tone: 'primary' },
            ],
            variables: [
              { name: 'leftMax', value: '2', tone: 'amber' },
              { name: 'rightMax', value: '1', tone: 'primary' },
              { name: 'totalWater', value: '1' },
            ],
          },
          {
            caption:
              'Now L walks across the deep basin [4, 5, 6] while R=10 (h=2) anchors the right! At L=4 (h=1): trap 2 - 1 = +1 unit. Total = 2.',
            formula: 'water[4] = leftMax(2) - height[4](1) = +1  →  total = 2',
            values: [0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1],
            barMode: { maxHeight: 3, waterLevels: [0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0] },
            cellStates: { 4: 'active' },
            pointers: [
              { label: 'L', index: 4, tone: 'amber' },
              { label: 'R', index: 10, tone: 'primary' },
            ],
            variables: [
              { name: 'leftMax', value: '2' },
              { name: 'rightMax', value: '1' },
              { name: 'totalWater', value: '2', tone: 'emerald' },
            ],
          },
          {
            caption:
              'L = 5 (h=0) <= R = 10 (h=2). Deepest valley cell: trap leftMax(2) - 0 = +2 units! Total jumps to 4.',
            formula: 'water[5] = leftMax(2) - height[5](0) = +2  →  total = 4',
            values: [0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1],
            barMode: { maxHeight: 3, waterLevels: [0, 0, 1, 0, 1, 2, 0, 0, 0, 0, 0, 0] },
            cellStates: { 5: 'active' },
            pointers: [
              { label: 'L', index: 5, tone: 'amber' },
              { label: 'R', index: 10, tone: 'primary' },
            ],
            variables: [
              { name: 'leftMax', value: '2' },
              { name: 'rightMax', value: '1' },
              { name: 'totalWater', value: '4', tone: 'emerald' },
            ],
          },
          {
            caption:
              'L = 6 (h=1) <= R = 10 (h=2). Trap leftMax(2) - 1 = +1 unit! Total = 5. Next L reaches the global peak at index 7 (h=3).',
            formula: 'water[6] = leftMax(2) - height[6](1) = +1  →  total = 5',
            values: [0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1],
            barMode: { maxHeight: 3, waterLevels: [0, 0, 1, 0, 1, 2, 1, 0, 0, 0, 0, 0] },
            cellStates: { 6: 'active' },
            pointers: [
              { label: 'L', index: 6, tone: 'amber' },
              { label: 'R', index: 10, tone: 'primary' },
            ],
            variables: [
              { name: 'leftMax', value: '2' },
              { name: 'rightMax', value: '1' },
              { name: 'totalWater', value: '5', tone: 'emerald' },
            ],
          },
          {
            caption:
              'L = 7 (h=3) > R = 10 (h=2): R=10 updates rightMax = 2 and steps left to R = 9 (h=1). Since h[7]=3 > h[9]=1, rightMax=2 bounds index 9 → trap 2 - 1 = +1 unit! Total = 6.',
            formula: 'water[9] = rightMax(2) - height[9](1) = +1  →  total = 6',
            values: [0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1],
            barMode: { maxHeight: 3, waterLevels: [0, 0, 1, 0, 1, 2, 1, 0, 0, 1, 0, 0] },
            cellStates: { 7: 'match', 9: 'active' },
            pointers: [
              { label: 'L', index: 7, tone: 'amber' },
              { label: 'R', index: 9, tone: 'primary' },
            ],
            variables: [
              { name: 'leftMax', value: '2' },
              { name: 'rightMax', value: '2', tone: 'primary' },
              { name: 'totalWater', value: '6', tone: 'emerald' },
            ],
          },
          {
            caption:
              'R = 8 (h=2) adds 0 water and steps to R = 7 == L. Loop terminates! Every bar was processed in a single O(n) pass with O(1) extra memory. Final trapped rainwater = 6.',
            formula: 'Total Trapped Rain Water = 1 + 1 + 2 + 1 + 1 = 6 units',
            values: [0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1],
            barMode: { maxHeight: 3, waterLevels: [0, 0, 1, 0, 1, 2, 1, 0, 0, 1, 0, 0] },
            cellStates: { 7: 'best' },
            pointers: [{ label: 'L=R', index: 7, tone: 'emerald' }],
            variables: [
              { name: 'leftMax', value: '3' },
              { name: 'rightMax', value: '2' },
              { name: 'totalWater', value: '6', tone: 'emerald' },
            ],
          },
        ],
      },
      javaSolution: {
        filename: 'TrappingRainWater.java',
        code: `public class TrappingRainWater {
    public int trap(int[] height) {
        if (height == null || height.length < 3) {
            return 0;
        }

        int left = 0;
        int right = height.length - 1;
        int leftMax = 0;
        int rightMax = 0;
        int trapped = 0;

        while (left < right) {
            if (height[left] <= height[right]) {
                // height[right] guarantees a right boundary >= leftMax
                if (height[left] >= leftMax) {
                    leftMax = height[left];
                } else {
                    trapped += leftMax - height[left];
                }
                left++;
            } else {
                // height[left] guarantees a left boundary >= rightMax
                if (height[right] >= rightMax) {
                    rightMax = height[right];
                } else {
                    trapped += rightMax - height[right];
                }
                right--;
            }
        }

        return trapped;
    }
}`,
        callouts: [
          {
            id: 'trw-guard',
            startLine: 3,
            endLine: 5,
            title: 'Minimum 3 Bars to Form a Basin',
            explanation: 'Fewer than 3 bars cannot create an interior trough, so short-circuit immediately to 0.',
            accent: 'primary',
          },
          {
            id: 'trw-invariant',
            startLine: 14,
            endLine: 21,
            title: 'Why height[left] <= height[right] Guarantees Exact Water',
            explanation:
              'Induction invariant: right only stops at values strictly greater than all previous leftMax values (or vice versa). Therefore whenever height[left] <= height[right], there exists a right wall at least as tall as leftMax, making leftMax the exact water ceiling at index left.',
            accent: 'amber',
          },
          {
            id: 'trw-symmetric',
            startLine: 22,
            endLine: 30,
            title: 'Symmetric Right-Side Accumulation',
            explanation:
              'Mirrors the left branch when height[right] < height[left]. Note that a monotonic decreasing stack can also solve this horizontally layer-by-layer in O(n) time / O(n) space, useful when water arrives in a streaming fashion.',
            accent: 'emerald',
          },
        ],
      },
      complexity: {
        time: 'O(n)',
        space: 'O(1)',
        timeExplanation: 'Each iteration strictly advances either left or right by 1, terminating in n - 1 iterations.',
        spaceExplanation: 'Constant scalar state (left, right, leftMax, rightMax, trapped).',
      },
      edgeCases: [
        {
          title: 'Strictly Increasing or Decreasing Elevation',
          scenario: 'height = [1, 2, 3, 4] or [4, 3, 2, 1].',
          handling: 'leftMax or rightMax updates every iteration, adding 0 water everywhere and returning 0.',
        },
        {
          title: '3D Extension Follow-Up (Trapping Rain Water II)',
          scenario: 'Senior interviewers often ask: "How does this generalize to a 2D elevation grid?"',
          handling:
            'Two pointers no longer suffice because water can leak around corners in 4 directions. Replace the 2-endpoint boundary with a Min-Heap (PriorityQueue) initialized with all outer perimeter cells and expand inward like Dijkstra.',
        },
        {
          title: 'Zero / Flat Plateaus',
          scenario: 'height = [2, 0, 2] or [3, 3, 3].',
          handling: 'The >= check prevents negative contributions on equal-height bars.',
        },
      ],
    },

    /* ================================================================
     * DSA 5: SUBARRAY SUM EQUALS K
     * ================================================================ */
    {
      id: 'day1-subarray-sum-k',
      dayNumber: 1,
      kind: 'dsa',
      title: 'Subarray Sum Equals K',
      subtitle: 'Prefix-sum frequency hashing when negative numbers break sliding window',
      difficulty: 'Medium',
      patterns: ['Prefix Sum', 'Hash Map', 'Complement Lookup'],
      estimatedMinutes: 13,
      leetcodeRef: 'LC #560',
      problemStatement:
        'Given an integer array nums (which may contain negative numbers and zeros) and an integer k, return the total number of contiguous subarrays whose sum equals k.',
      exampleSummary: {
        input: 'nums = [1, 2, 3, -2, 2, 1], k = 3',
        output: '5',
        explanation:
          'Five subarrays sum to 3: [1,2], [3], [2,3,-2], [3,-2,2], and [2,1].',
      },
      patternRecognition: {
        interviewCue:
          'First check the sign of elements! If all numbers are POSITIVE, sliding window works in O(1) space. The moment NEGATIVE numbers or zeros appear, monotonicity dies — immediately switch to Prefix Sum + HashMap.',
        signals: [
          'Counting contiguous subarrays with an exact target sum (or target modulo / target XOR)',
          'Array contains negative numbers → expanding right can decrease sum, shrinking left can increase sum',
          'Algebraic rewrite: sum(i..j) = prefix[j] - prefix[i - 1] = k  ⇔  prefix[i - 1] = prefix[j] - k',
        ],
        mentalModel:
          'As you scan left-to-right maintaining runningSum, ask: "How many earlier prefix sums equaled (runningSum - k)?" Every such prefix index p creates a valid subarray (p+1 .. i) ending right here.',
      },
      intuitionComparison: {
        bruteForce: {
          approach:
            'Fix every start index i and accumulate running sum for every end index j >= i, incrementing count whenever sum == k.',
          timeComplexity: 'O(n²)',
          spaceComplexity: 'O(1)',
          bottleneck:
            'Checks all pairs (i, j) explicitly instead of grouping identical historical prefix sums in a frequency map.',
        },
        optimal: {
          approach:
            'Seed prefixCount with {0 → 1}. At each index, add nums[i] to runningSum, add prefixCount.getOrDefault(runningSum - k, 0) to answer, then increment prefixCount[runningSum].',
          timeComplexity: 'O(n)',
          spaceComplexity: 'O(n)',
          keyInvariant:
            'Querying prefixCount BEFORE inserting the current runningSum guarantees we only match non-empty subarrays ending at i (critical when k = 0!).',
        },
      },
      visualizer: {
        kind: 'array-pointers',
        title: 'Prefix Sum + Frequency HashMap Dry Run',
        inputSummary: 'nums = [1, 2, 3, -2, 2, 1], k = 3',
        steps: [
          {
            caption:
              'Seed prefixCount with {0 → 1} representing the empty prefix before index 0. Without this base entry, any valid subarray starting at index 0 would be missed!',
            formula: 'Init: runningSum = 0, prefixCount = { 0: 1 }',
            values: [1, 2, 3, -2, 2, 1],
            pointers: [],
            auxStructure: {
              title: 'prefixCount (prefixSum → frequency)',
              entries: [{ key: '0', value: '1 (empty prefix)', highlight: true, tone: 'amber' }],
            },
            variables: [
              { name: 'runningSum', value: '0' },
              { name: 'k', value: '3' },
              { name: 'count', value: '0' },
            ],
          },
          {
            caption:
              'i = 0 (nums[0] = 1): runningSum = 1. Lookup need = 1 - 3 = -2 → not found (0 matches). Insert 1 into prefixCount.',
            formula: 'sum = 1  |  lookup(1 - 3 = -2) → 0 matches',
            values: [1, 2, 3, -2, 2, 1],
            cellStates: { 0: 'active' },
            pointers: [{ label: 'i', index: 0, tone: 'primary' }],
            auxStructure: {
              title: 'prefixCount (prefixSum → frequency)',
              entries: [
                { key: '0', value: '1' },
                { key: '1', value: '1', highlight: true, tone: 'primary' },
              ],
            },
            variables: [
              { name: 'runningSum', value: '1' },
              { name: 'need (sum-k)', value: '-2' },
              { name: 'count', value: '0' },
            ],
          },
          {
            caption:
              'i = 1 (nums[1] = 2): runningSum = 3. Lookup need = 3 - 3 = 0 → FOUND (freq 1)! Matches subarray [0..1] = [1, 2]. count = 1.',
            formula: 'sum = 3  |  lookup(3 - 3 = 0) → +1 match: [0..1]',
            values: [1, 2, 3, -2, 2, 1],
            windowRange: { start: 0, end: 1, tone: 'emerald', label: 'Match #1: [1, 2]' },
            cellStates: { 0: 'match', 1: 'match' },
            pointers: [{ label: 'i', index: 1, tone: 'emerald' }],
            auxStructure: {
              title: 'prefixCount (prefixSum → frequency)',
              entries: [
                { key: '0', value: '1 (HIT!)', highlight: true, tone: 'emerald' },
                { key: '1', value: '1' },
                { key: '3', value: '1', highlight: true, tone: 'primary' },
              ],
            },
            variables: [
              { name: 'runningSum', value: '3' },
              { name: 'need (sum-k)', value: '0', tone: 'emerald' },
              { name: 'count', value: '1', tone: 'emerald' },
            ],
          },
          {
            caption:
              'i = 2 (nums[2] = 3): runningSum = 6. Lookup need = 6 - 3 = 3 → FOUND (freq 1)! Matches subarray [2..2] = [3]. count = 2.',
            formula: 'sum = 6  |  lookup(6 - 3 = 3) → +1 match: [2..2]',
            values: [1, 2, 3, -2, 2, 1],
            windowRange: { start: 2, end: 2, tone: 'emerald', label: 'Match #2: [3]' },
            cellStates: { 2: 'match' },
            pointers: [{ label: 'i', index: 2, tone: 'emerald' }],
            auxStructure: {
              title: 'prefixCount (prefixSum → frequency)',
              entries: [
                { key: '0', value: '1' },
                { key: '1', value: '1' },
                { key: '3', value: '1 (HIT!)', highlight: true, tone: 'emerald' },
                { key: '6', value: '1', highlight: true, tone: 'primary' },
              ],
            },
            variables: [
              { name: 'runningSum', value: '6' },
              { name: 'need (sum-k)', value: '3', tone: 'emerald' },
              { name: 'count', value: '2', tone: 'emerald' },
            ],
          },
          {
            caption:
              'i = 3 (nums[3] = -2): NEGATIVE element lowers runningSum from 6 → 4! Lookup need = 4 - 3 = 1 → FOUND! Matches [1..3] = [2, 3, -2]. count = 3.',
            formula: 'sum = 4  |  lookup(4 - 3 = 1) → +1 match: [1..3]',
            values: [1, 2, 3, -2, 2, 1],
            windowRange: { start: 1, end: 3, tone: 'emerald', label: 'Match #3: [2, 3, -2]' },
            cellStates: { 1: 'match', 2: 'match', 3: 'match' },
            pointers: [{ label: 'i', index: 3, tone: 'emerald' }],
            auxStructure: {
              title: 'prefixCount (prefixSum → frequency)',
              entries: [
                { key: '0', value: '1' },
                { key: '1', value: '1 (HIT!)', highlight: true, tone: 'emerald' },
                { key: '3', value: '1' },
                { key: '4', value: '1', highlight: true, tone: 'primary' },
                { key: '6', value: '1' },
              ],
            },
            variables: [
              { name: 'runningSum', value: '4' },
              { name: 'need (sum-k)', value: '1', tone: 'emerald' },
              { name: 'count', value: '3', tone: 'emerald' },
            ],
          },
          {
            caption:
              'i = 4 (nums[4] = 2): runningSum returns to 6! Lookup need = 6 - 3 = 3 → FOUND! Matches [2..4] = [3, -2, 2]. Notice prefixCount[6] now increments to 2.',
            formula: 'sum = 6  |  lookup(6 - 3 = 3) → +1 match: [2..4]',
            values: [1, 2, 3, -2, 2, 1],
            windowRange: { start: 2, end: 4, tone: 'emerald', label: 'Match #4: [3, -2, 2]' },
            cellStates: { 2: 'match', 3: 'match', 4: 'match' },
            pointers: [{ label: 'i', index: 4, tone: 'emerald' }],
            auxStructure: {
              title: 'prefixCount (prefixSum → frequency)',
              entries: [
                { key: '0', value: '1' },
                { key: '1', value: '1' },
                { key: '3', value: '1 (HIT!)', highlight: true, tone: 'emerald' },
                { key: '4', value: '1' },
                { key: '6', value: '2', highlight: true, tone: 'amber' },
              ],
            },
            variables: [
              { name: 'runningSum', value: '6' },
              { name: 'need (sum-k)', value: '3', tone: 'emerald' },
              { name: 'count', value: '4', tone: 'emerald' },
            ],
          },
          {
            caption:
              'i = 5 (nums[5] = 1): runningSum = 7. Lookup need = 7 - 3 = 4 → FOUND! Matches [4..5] = [2, 1]. Final answer = 5 subarrays.',
            formula: 'sum = 7  |  lookup(7 - 3 = 4) → +1 match: [4..5]  →  Total = 5',
            values: [1, 2, 3, -2, 2, 1],
            windowRange: { start: 4, end: 5, tone: 'emerald', label: 'Match #5: [2, 1]' },
            cellStates: { 4: 'match', 5: 'match' },
            pointers: [{ label: 'i', index: 5, tone: 'emerald' }],
            auxStructure: {
              title: 'prefixCount (prefixSum → frequency)',
              entries: [
                { key: '0', value: '1' },
                { key: '1', value: '1' },
                { key: '3', value: '1' },
                { key: '4', value: '1 (HIT!)', highlight: true, tone: 'emerald' },
                { key: '6', value: '2' },
                { key: '7', value: '1' },
              ],
            },
            variables: [
              { name: 'runningSum', value: '7' },
              { name: 'need (sum-k)', value: '4', tone: 'emerald' },
              { name: 'count', value: '5', tone: 'emerald' },
            ],
          },
        ],
      },
      javaSolution: {
        filename: 'SubarraySumEqualsK.java',
        code: `import java.util.HashMap;
import java.util.Map;

public class SubarraySumEqualsK {
    public int subarraySum(int[] nums, int k) {
        if (nums == null || nums.length == 0) {
            return 0;
        }

        // Maps prefix sum -> number of times it has occurred so far
        Map<Integer, Integer> prefixCount = new HashMap<>();
        prefixCount.put(0, 1);

        int runningSum = 0;
        int totalSubarrays = 0;

        for (int num : nums) {
            runningSum += num;

            // Count how many prior prefixes satisfy: runningSum - prevPrefix == k
            totalSubarrays += prefixCount.getOrDefault(runningSum - k, 0);

            // Insert AFTER querying to prevent matching an empty subarray when k == 0
            prefixCount.merge(runningSum, 1, Integer::sum);
        }

        return totalSubarrays;
    }
}`,
        callouts: [
          {
            id: 'ssk-seed',
            startLine: 11,
            endLine: 12,
            title: 'The Empty-Prefix Base Seed {0: 1}',
            explanation:
              'Represents prefix[-1] = 0. Without it, whenever runningSum itself equals k (a valid subarray starting at index 0), runningSum - k = 0 would miss.',
            accent: 'amber',
          },
          {
            id: 'ssk-order',
            startLine: 21,
            endLine: 24,
            title: 'Query Before Insert (k == 0 Correctness)',
            explanation:
              'If k = 0 and you incremented prefixCount[runningSum] before querying, every element would spuriously match itself as an empty zero-length subarray! Always query first, then merge.',
            accent: 'emerald',
          },
        ],
      },
      complexity: {
        time: 'O(n)',
        space: 'O(n)',
        timeExplanation: 'Single pass over nums with amortized O(1) HashMap lookup and update per element.',
        spaceExplanation:
          'In the worst case (e.g., all positive numbers), every prefix sum is distinct, storing up to n + 1 entries.',
      },
      edgeCases: [
        {
          title: 'Target k = 0 with Zeros in Array ([0, 0, 0])',
          scenario: 'Multiple identical prefix sums accumulate: 0 appears 1, then 2, then 3 times.',
          handling: 'Matches 1 + 2 + 3 = 6 non-empty zero-sum subarrays because we store frequencies (not booleans) and query before inserting.',
        },
        {
          title: 'Why Not Sliding Window? (Interviewer Probe)',
          scenario: 'Interviewers specifically test whether you blindly apply Sliding Window here.',
          handling: 'State explicitly: "Sliding window requires monotonic sum changes as the window grows/shrinks. Because nums can contain negatives, shrinking left might increase the sum, invalidating window contraction. Prefix-sum hashing handles negative values cleanly."',
        },
        {
          title: 'Prefix Sum Overflow on Huge Values',
          scenario: 'If nums[i] ranges up to ±10⁹ and n = 10⁵, runningSum exceeds 32-bit int.',
          handling: 'Use Map<Long, Integer> and long runningSum when value ranges allow overflow.',
        },
      ],
    },
  ],

  /* ================================================================
   * DAY 1 LLD: PARKING LOT
   * ================================================================ */
  lldLesson: {
    id: 'day1-parking-lot',
    dayNumber: 1,
    kind: 'lld',
    title: 'Parking Lot System',
    subtitle: 'Extensible multi-floor spot allocation, strategy-driven pricing, and lock-safe concurrent entry/exit',
    patterns: ['Strategy Pattern', 'Factory Pattern', 'SOLID', 'Fine-Grained Locking'],
    estimatedMinutes: 22,
    problemScope: {
      summary:
        'Design an object-oriented, multi-floor Parking Lot management service supporting multiple vehicle classes (Motorcycle, Car, Truck), heterogeneous spot sizes (Compact, Regular, Large, EV), multiple entry/exit gates operating concurrently, pluggable spot allocation rules, and extensible fee calculation.',
      functionalRequirements: [
        'Support multiple floors, each containing typed parking spots with deterministic compatibility rules (e.g., Motorcycle fits Compact/Regular; Car fits Regular/Large; Truck requires Large).',
        'Issue a ParkingTicket upon entry with entry timestamp, assigned spot ID, and vehicle license plate.',
        'Compute fees upon exit using pluggable pricing policies (hourly tiered, flat daily cap, weekend surge, EV kWh surcharge) and atomically release the spot.',
        'Expose real-time floor availability dashboards without blocking entry gates.',
      ],
      concurrencyAndScaleAssumptions: [
        'Multiple entry and exit gates operate simultaneously across threads — two cars entering at the same millisecond must NEVER be assigned the same spot.',
        'Target throughput: ~50–200 concurrent gate requests/sec in a large airport garage; lock contention must be isolated per floor rather than locking the entire garage.',
      ],
      explicitNonGoals: [
        'Distributed multi-region database replication (handled in HLD; here we design clean in-process concurrency and clean repository interfaces).',
        'Physical boom-barrier hardware drivers or payment gateway SDK internals (modeled behind clean interfaces).',
      ],
    },
    coreEntities: [
      {
        name: 'ParkingLotService',
        role: 'Facade orchestrating entry, exit, ticket lifecycle, and availability queries.',
        keyFields: ['floors: List<ParkingFloor>', 'allocationStrategy: SpotAllocationStrategy', 'pricingStrategy: PricingStrategy', 'activeTickets: ConcurrentHashMap<String, ParkingTicket>'],
        invariants: 'A ticket ID maps 1:1 to an occupied spot until exit completes cleanly.',
      },
      {
        name: 'ParkingFloor',
        role: 'Owns a collection of ParkingSpots and a floor-scoped ReentrantLock for atomic spot reservation.',
        keyFields: ['floorNumber: int', 'spotsByType: Map<SpotType, List<ParkingSpot>>', 'floorLock: ReentrantLock'],
        invariants: 'Spot state transitions (AVAILABLE ↔ OCCUPIED) occur only while holding floorLock.',
      },
      {
        name: 'ParkingSpot',
        role: 'Represents a single physical bay with size/capability metadata and occupancy state.',
        keyFields: ['spotId: String', 'floorNumber: int', 'spotType: SpotType', 'occupiedBy: Vehicle'],
        invariants: 'canFit(vehicle) enforces size compatibility; assign() rejects already-occupied bays.',
      },
      {
        name: 'Vehicle (Hierarchy / Sealed)',
        role: 'Immutable domain value representing an entering vehicle and its sizing requirements.',
        keyFields: ['licensePlate: String', 'type: VehicleType'],
        invariants: 'Immutable after construction; equality based on normalized licensePlate.',
      },
      {
        name: 'ParkingTicket & Receipt',
        role: 'Audit records capturing entry time, assigned bay, exit time, and computed BigDecimal fee.',
        keyFields: ['ticketId: String', 'vehicle: Vehicle', 'spot: ParkingSpot', 'entryTime: Instant'],
        invariants: 'Monetary amounts always use BigDecimal (never floating-point double) to prevent penny drift.',
      },
    ],
    designPatterns: [
      {
        pattern: 'Strategy Pattern (SpotAllocationStrategy & PricingStrategy)',
        whereUsed: 'Spot selection (Nearest-to-Entry vs. Load-Balanced Floor) and Fee computation (Hourly vs. Weekend Surge vs. Flat Pass).',
        whatBreaksWithoutIt:
          'ParkingLotService turns into a tangled if/else ladder switching on day-of-week, vehicle type, and garage tier. Every new business promotion forces editing core orchestration code, risking regressions in ticket locking.',
        howItSolvesIt:
          'Encapsulates allocation and fee formulas behind single-method interfaces injected via constructor. New pricing tiers or EV-first spot finders are added as isolated classes (Open/Closed Principle).',
      },
      {
        pattern: 'Factory Pattern (ParkingSpotFactory)',
        whereUsed: 'Instantiating concrete spot variants (CompactSpot, RegularSpot, LargeSpot, EvChargingSpot) from garage floor blueprints/config.',
        whatBreaksWithoutIt:
          'Floor initialization logic becomes tightly coupled to concrete constructors and charger-metadata wiring; adding a new HandicappedSpot forces changes in every floor builder and test harness.',
        howItSolvesIt:
          'Centralizes construction rules and default attributes in one factory boundary while keeping callers dependent solely on the ParkingSpot abstraction.',
      },
      {
        pattern: 'Dependency Inversion / Facade (ParkingLotService)',
        whereUsed: 'EntryGate and ExitGate talk only to ParkingLotService, which depends on strategy interfaces rather than concrete classes.',
        whatBreaksWithoutIt:
          'Gate controllers directly mutate floor spot arrays and hold locks in inconsistent orders, creating deadlock risks and untestable business rules.',
        howItSolvesIt:
          'Concentrates lock discipline and transactional state changes inside one cohesive service boundary while keeping strategies completely stateless and unit-testable.',
      },
    ],
    diagrams: {
      classDiagram: {
        title: 'Parking Lot — UML Class Diagram',
        caption: 'Dependency inversion between ParkingLotService, floor-level locks, Strategy interfaces, and Spot Factory',
        mermaid: `classDiagram
    class ParkingLotService {
        -List~ParkingFloor~ floors
        -SpotAllocationStrategy allocator
        -PricingStrategy pricer
        -Map~String,Ticket~ tickets
        +parkVehicle(Vehicle) Ticket
        +exitVehicle(ticketId) Receipt
    }

    class ParkingFloor {
        -int floorNumber
        -List~ParkingSpot~ spots
        -ReentrantLock floorLock
        +tryReserve(v, strategy) Spot
        +releaseSpot(spot) void
    }

    class ParkingSpot {
        <<abstract>>
        -String spotId
        -SpotType type
        -Vehicle occupiedBy
        +canFit(Vehicle) boolean
        +assign(Vehicle) void
        +vacate() void
    }

    class ParkingSpotFactory {
        +createSpot(id, floor, type) Spot
    }

    class SpotAllocationStrategy {
        <<interface>>
        +selectSpot(spots, v) Spot
    }

    class BestFitNearestStrategy {
        +selectSpot(spots, v) Spot
    }

    class PricingStrategy {
        <<interface>>
        +calculateFee(ticket, exit) BigDecimal
    }

    class TieredHourlyPricing {
        -BigDecimal baseRate
        -BigDecimal hourlyRate
        +calculateFee(ticket, exit) BigDecimal
    }

    class ParkingTicket {
        -String ticketId
        -Vehicle vehicle
        -ParkingSpot spot
        -Instant entryTime
    }

    ParkingLotService "1" o-- "*" ParkingFloor : "manages floors"
    ParkingLotService --> SpotAllocationStrategy : "selects bay"
    ParkingLotService --> PricingStrategy : "computes fee"
    ParkingLotService "1" --> "*" ParkingTicket : "tracks active"
    ParkingFloor "1" *-- "*" ParkingSpot : "owns bays"
    ParkingSpotFactory ..> ParkingSpot : "creates"
    SpotAllocationStrategy <|.. BestFitNearestStrategy : "implements"
    PricingStrategy <|.. TieredHourlyPricing : "implements"
    ParkingTicket --> ParkingSpot : "reserves"`,
      },
      sequenceDiagram: {
        title: 'Concurrent Vehicle Entry & Spot Reservation Sequence',
        caption: 'Floor-scoped ReentrantLock guarantees two simultaneous entry gates never double-book the same parking bay',
        mermaid: `sequenceDiagram
    participant Gate as "Entry Gate Thread"
    participant Service as "ParkingLotService"
    participant Floor as "ParkingFloor"
    participant Strategy as "SpotAllocationStrategy"
    participant Spot as "ParkingSpot"

    Gate->>Service: "parkVehicle(Vehicle)"
    loop "Scan floors in priority order"
        Service->>Floor: "tryReserveSpot(Vehicle, Strategy)"
        Floor->>Floor: "floorLock.lock()"
        Floor->>Strategy: "selectSpot(availableSpots, Vehicle)"
        Strategy-->>Floor: "Optional(bestSpot)"
        alt "Compatible spot found"
            Floor->>Spot: "assign(Vehicle)"
            Spot-->>Floor: "occupied = true"
            Floor->>Floor: "floorLock.unlock()"
            Floor-->>Service: "Optional(bestSpot)"
        else "Floor full for vehicle type"
            Floor->>Floor: "floorLock.unlock()"
            Floor-->>Service: "Optional.empty()"
        end
    end
    Service->>Service: "Create & store ParkingTicket in ConcurrentHashMap"
    Service-->>Gate: "Return ParkingTicket"`,
      },
    },
    codeFiles: [
      {
        filename: 'DomainModels.java',
        label: 'DomainModels.java',
        summary: 'Core immutable enums, Vehicle record, ParkingSpot hierarchy, and Ticket/Receipt value objects.',
        code: `import java.math.BigDecimal;
import java.time.Instant;
import java.util.Objects;

public enum VehicleType { MOTORCYCLE, CAR, TRUCK }

public enum SpotType { COMPACT, REGULAR, LARGE, EV_CHARGING }

public record Vehicle(String licensePlate, VehicleType type) {
    public Vehicle {
        Objects.requireNonNull(licensePlate, "licensePlate required");
        Objects.requireNonNull(type, "vehicleType required");
    }
}

public abstract class ParkingSpot {
    private final String spotId;
    private final int floorNumber;
    private final SpotType spotType;
    private Vehicle currentVehicle;

    protected ParkingSpot(String spotId, int floorNumber, SpotType spotType) {
        this.spotId = Objects.requireNonNull(spotId);
        this.floorNumber = floorNumber;
        this.spotType = Objects.requireNonNull(spotType);
    }

    public abstract boolean canFit(Vehicle vehicle);

    public boolean isAvailable() {
        return currentVehicle == null;
    }

    public void assign(Vehicle vehicle) {
        if (!isAvailable()) {
            throw new IllegalStateException("Spot " + spotId + " is already occupied");
        }
        if (!canFit(vehicle)) {
            throw new IllegalArgumentException("Vehicle " + vehicle.type() + " cannot fit " + spotType);
        }
        this.currentVehicle = vehicle;
    }

    public void vacate() {
        this.currentVehicle = null;
    }

    public String getSpotId() { return spotId; }
    public int getFloorNumber() { return floorNumber; }
    public SpotType getSpotType() { return spotType; }
}

public record ParkingTicket(String ticketId, Vehicle vehicle, ParkingSpot spot, Instant entryTime) {}

public record ParkingReceipt(String ticketId, String spotId, Instant entryTime, Instant exitTime, BigDecimal totalFee) {}`,
        callouts: [
          {
            id: 'pl-record',
            startLine: 9,
            endLine: 14,
            title: 'Immutable Java Records for Value Objects',
            explanation:
              'Using Java records for Vehicle, ParkingTicket, and ParkingReceipt guarantees thread-safe sharing across gate threads without defensive copying.',
            accent: 'primary',
          },
          {
            id: 'pl-invariant',
            startLine: 34,
            endLine: 42,
            title: 'Fail-Fast Domain Invariants Inside Entity',
            explanation:
              'ParkingSpot guards its own state transitions so no misbehaving caller can overwrite an occupied bay or park a truck in a compact slot.',
            accent: 'amber',
          },
        ],
      },
      {
        filename: 'ParkingSpotFactory.java',
        label: 'ParkingSpotFactory.java',
        summary: 'Factory decoupling floor setup from concrete bay compatibility rules.',
        code: `public final class ParkingSpotFactory {
    private ParkingSpotFactory() {}

    public static ParkingSpot createSpot(String spotId, int floorNumber, SpotType type) {
        return switch (type) {
            case COMPACT -> new CompactSpot(spotId, floorNumber);
            case REGULAR -> new RegularSpot(spotId, floorNumber);
            case LARGE -> new LargeSpot(spotId, floorNumber);
            case EV_CHARGING -> new EvChargingSpot(spotId, floorNumber);
        };
    }

    private static final class CompactSpot extends ParkingSpot {
        CompactSpot(String id, int floor) { super(id, floor, SpotType.COMPACT); }

        @Override
        public boolean canFit(Vehicle vehicle) {
            return vehicle.type() == VehicleType.MOTORCYCLE;
        }
    }

    private static final class RegularSpot extends ParkingSpot {
        RegularSpot(String id, int floor) { super(id, floor, SpotType.REGULAR); }

        @Override
        public boolean canFit(Vehicle vehicle) {
            return vehicle.type() == VehicleType.MOTORCYCLE
                || vehicle.type() == VehicleType.CAR;
        }
    }

    private static final class LargeSpot extends ParkingSpot {
        LargeSpot(String id, int floor) { super(id, floor, SpotType.LARGE); }

        @Override
        public boolean canFit(Vehicle vehicle) {
            return true; // Any vehicle can overflow into Large if policy permits
        }
    }

    private static final class EvChargingSpot extends ParkingSpot {
        EvChargingSpot(String id, int floor) { super(id, floor, SpotType.EV_CHARGING); }

        @Override
        public boolean canFit(Vehicle vehicle) {
            return vehicle.type() == VehicleType.CAR;
        }
    }
}`,
        callouts: [
          {
            id: 'pl-factory-switch',
            startLine: 4,
            endLine: 11,
            title: 'Exhaustive Switch Expression',
            explanation:
              'Modern Java switch over SpotType gives compile-time exhaustiveness: adding SpotType.HANDICAPPED immediately flags the factory if you forget to wire its subclass.',
            accent: 'primary',
          },
          {
            id: 'pl-canfit',
            startLine: 26,
            endLine: 30,
            title: 'Polymorphic Sizing Rules',
            explanation:
              'Compatibility lives cleanly on each subclass rather than a centralized switch statement in the floor allocator.',
            accent: 'emerald',
          },
        ],
      },
      {
        filename: 'Strategies.java',
        label: 'Strategies.java',
        summary: 'Pluggable Strategy interfaces for spot selection (tightest-fit first) and BigDecimal hourly billing.',
        code: `import java.math.BigDecimal;
import java.time.Duration;
import java.time.Instant;
import java.util.Comparator;
import java.util.List;
import java.util.Optional;

@FunctionalInterface
public interface SpotAllocationStrategy {
    Optional<ParkingSpot> selectSpot(List<ParkingSpot> spotsOnFloor, Vehicle vehicle);
}

/**
 * Picks the smallest compatible available spot first (best-fit) to avoid wasting
 * Large bays on Motorcycles, breaking ties by lowest spotId (nearest entrance).
 */
public class BestFitNearestStrategy implements SpotAllocationStrategy {
    @Override
    public Optional<ParkingSpot> selectSpot(List<ParkingSpot> spotsOnFloor, Vehicle vehicle) {
        return spotsOnFloor.stream()
            .filter(ParkingSpot::isAvailable)
            .filter(spot -> spot.canFit(vehicle))
            .min(Comparator
                .comparingInt((ParkingSpot s) -> s.getSpotType().ordinal())
                .thenComparing(ParkingSpot::getSpotId));
    }
}

@FunctionalInterface
public interface PricingStrategy {
    BigDecimal calculateFee(ParkingTicket ticket, Instant exitTime);
}

public class TieredHourlyPricingStrategy implements PricingStrategy {
    private final BigDecimal firstHourRate;
    private final BigDecimal additionalHourRate;
    private final BigDecimal dailyCap;

    public TieredHourlyPricingStrategy(BigDecimal firstHour, BigDecimal additionalHour, BigDecimal dailyCap) {
        this.firstHourRate = firstHour;
        this.additionalHourRate = additionalHour;
        this.dailyCap = dailyCap;
    }

    @Override
    public BigDecimal calculateFee(ParkingTicket ticket, Instant exitTime) {
        long minutes = Math.max(1, Duration.between(ticket.entryTime(), exitTime).toMinutes());
        long billableHours = (minutes + 59) / 60; // Ceiling to nearest hour

        BigDecimal rawFee = firstHourRate.add(
            additionalHourRate.multiply(BigDecimal.valueOf(Math.max(0, billableHours - 1)))
        );
        return rawFee.min(dailyCap);
    }
}`,
        callouts: [
          {
            id: 'pl-bestfit',
            startLine: 17,
            endLine: 26,
            title: 'Best-Fit Prevents Fragmentation',
            explanation:
              'Sorting by SpotType ordinal before spotId prevents a motorcycle from consuming the last Large bay when Compact bays are open — a subtle real-world requirement interviewers appreciate.',
            accent: 'emerald',
          },
          {
            id: 'pl-bigdecimal',
            startLine: 46,
            endLine: 54,
            title: 'Exact Ceiling Hours & BigDecimal Money Math',
            explanation:
              '(minutes + 59) / 60 rounds up cleanly without floating-point inaccuracy, and BigDecimal avoids binary rounding errors in billing.',
            accent: 'amber',
          },
        ],
      },
      {
        filename: 'ParkingLotService.java',
        label: 'ParkingLotService.java',
        summary: 'Thread-safe floor reservation using per-floor ReentrantLock and atomic activeTickets tracking.',
        code: `import java.math.BigDecimal;
import java.time.Clock;
import java.time.Instant;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.locks.ReentrantLock;

public class ParkingFloor {
    private final int floorNumber;
    private final List<ParkingSpot> spots;
    private final ReentrantLock floorLock = new ReentrantLock();

    public ParkingFloor(int floorNumber, List<ParkingSpot> spots) {
        this.floorNumber = floorNumber;
        this.spots = List.copyOf(spots);
    }

    public Optional<ParkingSpot> tryReserveSpot(Vehicle vehicle, SpotAllocationStrategy strategy) {
        floorLock.lock();
        try {
            Optional<ParkingSpot> chosen = strategy.selectSpot(spots, vehicle);
            chosen.ifPresent(spot -> spot.assign(vehicle));
            return chosen;
        } finally {
            floorLock.unlock();
        }
    }

    public void releaseSpot(ParkingSpot spot) {
        floorLock.lock();
        try {
            spot.vacate();
        } finally {
            floorLock.unlock();
        }
    }

    public int getFloorNumber() { return floorNumber; }
}

public class ParkingLotService {
    private final List<ParkingFloor> floors;
    private final SpotAllocationStrategy allocationStrategy;
    private final PricingStrategy pricingStrategy;
    private final Clock clock;
    private final Map<String, ParkingTicket> activeTickets = new ConcurrentHashMap<>();

    public ParkingLotService(
            List<ParkingFloor> floors,
            SpotAllocationStrategy allocationStrategy,
            PricingStrategy pricingStrategy,
            Clock clock) {
        this.floors = List.copyOf(floors);
        this.allocationStrategy = allocationStrategy;
        this.pricingStrategy = pricingStrategy;
        this.clock = clock;
    }

    public ParkingTicket parkVehicle(Vehicle vehicle) {
        for (ParkingFloor floor : floors) {
            Optional<ParkingSpot> reserved = floor.tryReserveSpot(vehicle, allocationStrategy);
            if (reserved.isPresent()) {
                String ticketId = UUID.randomUUID().toString();
                ParkingTicket ticket = new ParkingTicket(ticketId, vehicle, reserved.get(), clock.instant());
                activeTickets.put(ticketId, ticket);
                return ticket;
            }
        }
        throw new IllegalStateException("Parking lot is full for vehicle type: " + vehicle.type());
    }

    public ParkingReceipt exitVehicle(String ticketId) {
        // Atomic remove prevents double-exit race condition on the same ticket
        ParkingTicket ticket = activeTickets.remove(ticketId);
        if (ticket == null) {
            throw new IllegalArgumentException("Invalid or already-settled ticket: " + ticketId);
        }

        Instant exitTime = clock.instant();
        BigDecimal fee = pricingStrategy.calculateFee(ticket, exitTime);

        ParkingFloor floor = floors.get(ticket.spot().getFloorNumber());
        floor.releaseSpot(ticket.spot());

        return new ParkingReceipt(ticketId, ticket.spot().getSpotId(), ticket.entryTime(), exitTime, fee);
    }
}`,
        callouts: [
          {
            id: 'pl-floorlock',
            startLine: 21,
            endLine: 30,
            title: 'Floor-Scoped Lock Striping',
            explanation:
              'Locking per ParkingFloor instead of synchronizing parkVehicle() lets cars entering Floor 1 and Floor 3 proceed in parallel while guaranteeing check-then-act atomicity on each floor.',
            accent: 'primary',
          },
          {
            id: 'pl-clock',
            startLine: 48,
            endLine: 48,
            title: 'Injected java.time.Clock for Deterministic Testing',
            explanation:
              'Injecting Clock instead of calling Instant.now() directly lets unit tests simulate 5-hour stays or midnight rollovers instantaneously with Clock.fixed().',
            accent: 'emerald',
          },
          {
            id: 'pl-atomic-remove',
            startLine: 75,
            endLine: 80,
            title: 'Atomic Ticket Removal Prevents Double-Exit Race',
            explanation:
              'ConcurrentHashMap.remove(ticketId) is atomic: if two exit scanners scan the same QR code concurrently, exactly one thread receives the ticket and bills the customer.',
            accent: 'amber',
          },
        ],
      },
    ],
    solidHighlights: [
      {
        principle: 'Single Responsibility',
        application:
          'ParkingFloor manages spatial bay locking, SpotAllocationStrategy decides bay preference, PricingStrategy owns billing rules, and ParkingLotService coordinates ticket lifecycles.',
      },
      {
        principle: 'Open/Closed',
        application:
          'Adding a HolidaySurgePricingStrategy or VipValetAllocationStrategy requires zero modifications to ParkingLotService or ParkingFloor.',
      },
      {
        principle: 'Liskov Substitution',
        application:
          'Every ParkingSpot subclass honors the assign()/vacate()/canFit() contract so floors treat all spot types uniformly.',
      },
      {
        principle: 'Dependency Inversion',
        application:
          'High-level ParkingLotService depends on SpotAllocationStrategy, PricingStrategy, and Clock abstractions rather than concrete implementations.',
      },
    ],
    extensibilityScenarios: [
      {
        scenario: 'Add EV Charging Billing (Time + kWh Metered Fee)',
        changesRequired:
          'Introduce an EvPricingDecorator wrapping PricingStrategy that queries an injected ChargerMeterClient for kWh consumed and adds the energy surcharge — zero changes to entry/exit locking.',
      },
      {
        scenario: 'Support Multiple Entrance Gates with Gate-Proximity Allocation',
        changesRequired:
          'Pass entranceGateId into SpotAllocationStrategy (e.g., maintaining a pre-computed Min-Heap of spots ordered by Manhattan distance per gate) without altering ParkingSpot or ParkingTicket.',
      },
      {
        scenario: 'Persist Tickets Across Service Restarts',
        changesRequired:
          'Extract TicketRepository interface backed by ConcurrentHashMap in memory or PostgreSQL with SELECT ... FOR UPDATE SKIP LOCKED in production.',
      },
    ],
    concurrencyChoices: [
      {
        topic: 'Double-Booking Prevention',
        mechanism: 'Floor-scoped ReentrantLock wrapping selectSpot() + spot.assign()',
        rationale:
          'Lock striping across floors reduces contention by a factor of F (number of floors) compared to a global garage lock, while ensuring check-then-act atomicity.',
      },
      {
        topic: 'Deadlock Avoidance',
        mechanism: 'Single-lock acquisition discipline (never hold two floor locks simultaneously)',
        rationale:
          'Each floor lock is acquired and released in a try/finally before moving to the next floor, making circular wait structurally impossible.',
      },
      {
        topic: 'Duplicate Exit Scan Protection',
        mechanism: 'ConcurrentHashMap.remove(ticketId) atomic claim',
        rationale:
          'Guarantees idempotent single-settlement even if a flaky barcode scanner fires duplicate exit requests on parallel threads.',
      },
    ],
  },

  /* ================================================================
   * DAY 1 HLD: URL SHORTENER
   * ================================================================ */
  hldLesson: {
    id: 'day1-url-shortener',
    dayNumber: 1,
    kind: 'hld',
    title: 'URL Shortener (TinyURL / bit.ly)',
    subtitle: 'Read-heavy edge caching, collision-free Base62/KGS key generation, and 301 vs. 302 semantics',
    tags: ['Read-Heavy 100:1', 'Base62 & KGS', 'Redis Cache', 'Sharded KV'],
    estimatedMinutes: 20,
    overview:
      'Design a globally available URL shortening and redirection service handling 100M new URLs/month and 10B redirects/month with sub-20ms p99 redirect latency, custom aliases, link expiration, and click analytics.',
    requirements: {
      functional: [
        'Shorten a long URL into a unique, compact 7-character alias (e.g., https://sho.rt/aB39xK1) with optional custom alias and TTL expiration.',
        'Redirect GET /{shortCode} to the original long URL with minimal latency.',
        'Capture asynchronous click telemetry (timestamp, referrer, geo/user-agent) without slowing down the redirect critical path.',
      ],
      nonFunctional: [
        {
          metric: 'Read Latency (p99)',
          target: '< 20 ms (edge/cache hit)',
          rationale: 'Redirects sit directly on the user navigation path; any delay is felt immediately before the destination page even starts loading.',
        },
        {
          metric: 'Availability',
          target: '99.99% (AP over CP)',
          rationale: 'Brief stale cache propagation on newly created or expired links is acceptable; failing redirects breaks every shared link on the internet.',
        },
        {
          metric: 'Read : Write Ratio',
          target: '100 : 1 (Read-Heavy)',
          rationale: 'Drives heavy investment in CDN + multi-tier Redis caching and stateless read replicas.',
        },
        {
          metric: 'Unpredictability & Uniqueness',
          target: 'Zero collisions, non-enumerable IDs',
          rationale: 'Sequential Base62 counters leak business volume and let scrapers enumerate private links unless randomized/obfuscated.',
        },
      ],
    },
    capacityMath: {
      assumptions: [
        '100M new shortened URLs per month (~3.3M/day)',
        '100:1 Read:Write ratio → 10B redirects per month (~333M/day)',
        '5-year data retention; average record size ≈ 500 bytes (shortCode 7B, longUrl ~200B, metadata/indexes ~293B)',
        'Peak traffic multiplier = 3× average QPS; 80/20 Pareto rule for daily cache working set',
      ],
      calculations: [
        {
          metric: 'Write QPS (Avg / Peak)',
          formula: '100M / (30 × 86,400) ≈ 38.6 → ×3 peak',
          result: '~40 RPS avg · ~120 RPS peak',
          notes: 'Modest write load — easily served by a small stateless write tier + KGS.',
        },
        {
          metric: 'Read QPS (Avg / Peak)',
          formula: '100 × Write QPS = 3,860 → ×3 peak',
          result: '~4,000 RPS avg · ~12,000 RPS peak',
          notes: 'Redis easily handles 100K+ ops/sec per node; network/edge locality is the real latency win.',
        },
        {
          metric: 'Keyspace Size (7-char Base62)',
          formula: '62⁷ = 3,521,614,606,208',
          result: '3.52 Trillion unique codes',
          notes: 'At 1.2B URLs/year, 7 chars lasts > 2,900 years without recycling.',
        },
        {
          metric: '5-Year Total Storage',
          formula: '100M/mo × 60 mo × 500 B = 6B × 500 B',
          result: '3.0 TB raw (~9 TB w/ 3× replication)',
          notes: 'Easily fits across 6–8 shards (~500 GB primary per shard) for fast index lookups.',
        },
        {
          metric: 'Hot-Set Cache Memory (20% Daily)',
          formula: '333M daily reads × 20% unique hot ≈ 66M × 500 B',
          result: '~33 GB RAM (≈ 2–3 Redis nodes)',
          notes: 'With LRU eviction + 24h TTL, >95% of viral links stay permanently hot in memory.',
        },
        {
          metric: 'Outbound Read Bandwidth',
          formula: '4,000 RPS × 500 B response ≈ 2 MB/s avg',
          result: '~2 MB/s avg · ~6 MB/s peak',
          notes: 'Lightweight HTTP 302 headers; bandwidth is negligible compared to connection handling.',
        },
      ],
    },
    apiAndDataModel: {
      endpoints: [
        {
          method: 'POST',
          path: '/api/v1/urls',
          summary: 'Create short alias (supports optional customAlias and expiresAt)',
          payload: '{ "longUrl": "https://...", "customAlias": "launch26", "ttlDays": 365 } → 201 { "shortUrl": "https://sho.rt/aB39xK1" }',
        },
        {
          method: 'GET',
          path: '/{shortCode}',
          summary: 'Resolve short code and return HTTP 302 Found (Location: longUrl)',
          payload: '302 Found · Location: https://original-destination.com/... · Cache-Control: private, max-age=60',
        },
      ],
      storageSchema: [
        {
          store: 'Primary URL Store (Sharded KV / DynamoDB / Postgres)',
          schema: 'urls (short_code PK VARCHAR(10), long_url TEXT, user_id BIGINT, created_at TIMESTAMP, expires_at TIMESTAMP)',
          shardingAndIndexing:
            'Hash-partitioned on short_code for uniform distribution across shards and single-hop O(1) point lookups without scatter-gather.',
        },
        {
          store: 'KGS Key Pool Store (Dedicated Relational / ZooKeeper Range Lease)',
          schema: 'unused_keys (short_code PK) / range_leases (worker_id, range_start, range_end)',
          shardingAndIndexing:
            'App nodes lease contiguous ID blocks (e.g., 10,000 keys in memory) and scramble via a 42-bit Feistel/XOR permutation before Base62 encoding — zero DB round-trip per write and non-guessable URLs.',
        },
      ],
    },
    architecture: {
      title: 'URL Shortener — Interactive System Architecture',
      summary: 'Explore the 100:1 read-optimized path, pre-leased Key Generation Service, and async analytics pipeline',
      defaultSelectedNodeId: 'redis',
      nodes: [
        {
          id: 'clients',
          label: 'Clients',
          sublabel: 'Web · Mobile · Social',
          category: 'client',
          x: 16,
          y: 215,
          width: 146,
          height: 58,
          flows: ['read', 'write'],
          details: {
            role: 'End users clicking short links across social feeds, SMS, and emails (reads), plus creators/APIs shortening new URLs (writes).',
            dataFlow: 'Sends HTTPS GET /{shortCode} to nearest Edge CDN POP, and POST /api/v1/urls to the API Gateway.',
            scalingStrategy: 'Globally distributed users routed via GeoDNS / Anycast to the lowest-RTT edge point of presence.',
            failureHandling: 'Clients retry idempotent GETs automatically; POST requests include an Idempotency-Key header to avoid duplicate aliases on network retries.',
            techChoices: ['Browser / Mobile', 'GeoDNS', 'Anycast IP'],
          },
        },
        {
          id: 'cdn',
          label: 'Edge CDN',
          sublabel: 'Hot Redirects + WAF',
          category: 'edge',
          x: 214,
          y: 92,
          width: 164,
          height: 58,
          flows: ['read'],
          details: {
            role: 'Absorbs massive viral link spikes (e.g., celebrity tweet links) directly at global edge POPs with sub-10ms TTFB.',
            dataFlow: 'Checks edge cache for /{shortCode}. On hit, returns HTTP 302 immediately and logs edge beacon; on miss, forwards to Redirect Service.',
            scalingStrategy: 'Horizontally distributed across 200+ edge POPs; shields origin during sudden 100× viral traffic bursts.',
            failureHandling: 'Origin shield collapses concurrent cache-miss thundering herds into a single upstream request; stale-if-error serves cached redirects if origin is degraded.',
            techChoices: ['Cloudflare Workers', 'CloudFront', 'Fastly'],
          },
        },
        {
          id: 'gateway',
          label: 'API Gateway / LB',
          sublabel: 'TLS · Auth · Rate Limit',
          category: 'edge',
          x: 214,
          y: 320,
          width: 164,
          height: 58,
          flows: ['write', 'read'],
          details: {
            role: 'Terminates TLS, enforces per-API-key write rate limits (preventing spam/link-bombing), validates URL syntax, and load-balances stateless services.',
            dataFlow: 'Routes POST /api/v1/urls to Shorten Service and cache-missed GET /{shortCode} requests to Redirect Service.',
            scalingStrategy: 'Stateless L7 load balancer fleet behind DNS round-robin / BGP Anycast; autoscaled on CPU and active connections.',
            failureHandling: 'Active health checks evict unhealthy service instances within seconds; token-bucket rate limiting sheds abusive write bursts with HTTP 429.',
            techChoices: ['Envoy', 'AWS ALB', 'NGINX + Redis Rate Limiter'],
          },
        },
        {
          id: 'redirect-svc',
          label: 'Redirect Service',
          sublabel: 'Stateless Read Fleet',
          category: 'service',
          x: 444,
          y: 112,
          width: 164,
          height: 58,
          flows: ['read'],
          details: {
            role: 'Resolves shortCode → longUrl on the critical read path, checks TTL expiration, returns HTTP 302, and emits an async click event.',
            dataFlow: 'Reads Redis first (cache-aside). On miss, queries Sharded URL DB, populates Redis with TTL, and fires non-blocking Kafka click event.',
            scalingStrategy: 'Purely stateless containers scaled horizontally on CPU/RPS; isolated from Write Service so write spikes cannot starve redirects.',
            failureHandling: 'Uses Bloom filter / negative caching (caching 404 for 60s) to block cache-penetration attacks probing random nonexistent codes. Drops analytics silently if Kafka is slow.',
            techChoices: ['Java / Go Microservice', 'Kubernetes HPA', 'Local L1 Caffeine Cache'],
          },
        },
        {
          id: 'shorten-svc',
          label: 'Shorten Service',
          sublabel: 'Stateless Write Fleet',
          category: 'service',
          x: 444,
          y: 320,
          width: 164,
          height: 58,
          flows: ['write'],
          details: {
            role: 'Validates destination URLs (safe-browsing/SSRF check), obtains a unique 7-char key from local KGS lease, writes mapping to DB, and warms Redis.',
            dataFlow: 'Acquires unused code from KGS range lease, persists (shortCode, longUrl, expiresAt) to Sharded URL DB, and returns 201 Created.',
            scalingStrategy: 'Stateless horizontal scaling; each pod caches a leased range of 10,000 IDs locally so writes require ZERO synchronization with KGS on the hot path.',
            failureHandling: 'If a pod crashes, remaining unused keys in its 10k lease are simply discarded (out of 3.5T keys, losing 10k is 0.0000003%!). Custom alias collisions return HTTP 409 via unique constraint.',
            techChoices: ['Spring Boot / Go', 'Safe Browsing Filter', 'Idempotency Middleware'],
          },
        },
        {
          id: 'redis',
          label: 'Redis Cluster',
          sublabel: 'LRU Hot-URL Cache',
          category: 'cache',
          x: 706,
          y: 36,
          width: 196,
          height: 58,
          flows: ['read', 'write'],
          details: {
            role: 'Sub-millisecond L2 cache storing the hottest ~20% of shortCode → longUrl mappings (serving >95% of origin read requests).',
            dataFlow: 'Looked up by Redirect Service via GET short:{code}; populated lazily on cache miss or eagerly on write for newly minted links.',
            scalingStrategy: 'Consistent-hashed Redis Cluster sharded by shortCode, with read replicas per shard and L1 in-process cache in Redirect Service for ultra-hot celebrity URLs.',
            failureHandling: 'Single-flight request coalescing prevents thundering herd on key expiry. If a Redis shard fails, replicas promote automatically and DB absorbs temporary miss traffic via circuit breaker.',
            techChoices: ['Redis Cluster', 'LRU Eviction', 'Singleflight Coalescing'],
          },
        },
        {
          id: 'db',
          label: 'Sharded URL DB',
          sublabel: 'Hash-Sharded on short_code',
          category: 'database',
          x: 706,
          y: 162,
          width: 196,
          height: 58,
          flows: ['read', 'write'],
          details: {
            role: 'Durable source of truth for all 6B+ shortened URL mappings, custom aliases, ownership, and expiration timestamps.',
            dataFlow: 'Receives point writes from Shorten Service and cache-miss point reads from Redirect Service using short_code as partition key.',
            scalingStrategy: 'Hash-sharded across 8+ partitions by short_code (guaranteed even key distribution, zero range hotspots). Each shard has sync/semi-sync replicas across AZs.',
            failureHandling: 'Multi-AZ replication with automated failover; TTL background compaction (or native DynamoDB TTL) purges expired rows without locking hot writes.',
            techChoices: ['DynamoDB / Cassandra', 'Sharded PostgreSQL (Citus)', 'Multi-AZ Replicas'],
          },
        },
        {
          id: 'analytics',
          label: 'Kafka → ClickHouse',
          sublabel: 'Async Click Telemetry',
          category: 'queue',
          x: 706,
          y: 288,
          width: 196,
          height: 58,
          flows: ['read'],
          details: {
            role: 'Decouples click counting, referrer breakdowns, and geo-analytics completely off the redirect latency path.',
            dataFlow: 'Redirect Service emits fire-and-forget click events to Kafka; Flink/batch consumers roll up counts per (shortCode, hour, country) into ClickHouse.',
            scalingStrategy: 'Kafka topics partitioned by shortCode; columnar ClickHouse cluster compresses billions of click events 10× for sub-second dashboard queries.',
            failureHandling: 'Kafka retains events for 7 days if analytics consumers lag; dead-letter queue isolates malformed payloads without blocking redirect traffic.',
            techChoices: ['Apache Kafka', 'Apache Flink', 'ClickHouse / Druid'],
          },
        },
        {
          id: 'kgs',
          label: 'Key Gen Service',
          sublabel: 'Range Lease + Base62',
          category: 'storage',
          x: 706,
          y: 414,
          width: 196,
          height: 58,
          flows: ['write'],
          details: {
            role: 'Allocates non-overlapping numeric ID blocks (or pre-generated Base62 key batches) to Shorten Service pods with zero collision risk.',
            dataFlow: 'Shorten Service requests a fresh block of 10,000 IDs whenever its in-memory counter depletes; KGS atomically advances the durable sequence range.',
            scalingStrategy: 'Called only once per 10,000 writes (~0.004 RPS!), making KGS trivially scalable with zero write-path bottleneck.',
            failureHandling: 'Backed by Raft/ZooKeeper/etcd or multi-region sequence offsets (Region A uses IDs ≡ 0 mod 3, Region B ≡ 1 mod 3) so active-active multi-region writes never collide even during network splits.',
            techChoices: ['etcd / ZooKeeper', 'Postgres Sequence Blocks', 'Feistel Permutation'],
          },
        },
      ],
      edges: [
        { id: 'e1', from: 'clients', to: 'cdn', label: 'GET /{code}', flow: 'read' },
        { id: 'e2', from: 'clients', to: 'gateway', label: 'POST /urls', flow: 'write' },
        { id: 'e3', from: 'cdn', to: 'redirect-svc', label: 'Cache Miss', flow: 'read' },
        { id: 'e4', from: 'gateway', to: 'shorten-svc', label: 'Create', flow: 'write' },
        { id: 'e5', from: 'gateway', to: 'redirect-svc', label: 'Direct Read', flow: 'read', labelT: 0.42 },
        { id: 'e6', from: 'redirect-svc', to: 'redis', label: 'GET cache', flow: 'read' },
        { id: 'e7', from: 'redirect-svc', to: 'db', label: 'Miss Lookup', flow: 'read', labelT: 0.56 },
        { id: 'e8', from: 'redirect-svc', to: 'analytics', label: 'Click Event', flow: 'read', async: true, labelT: 0.72 },
        { id: 'e9', from: 'shorten-svc', to: 'db', label: 'INSERT row', flow: 'write', labelT: 0.34 },
        { id: 'e10', from: 'shorten-svc', to: 'kgs', label: 'Lease 10k IDs', flow: 'write', async: true },
      ],
    },
    tradeOffs: [
      {
        topic: 'Short Code Generation: Hash Truncation vs. Range-Leased KGS',
        context: 'We need globally unique, 7-character Base62 codes with zero collision retries at write time.',
        options: [
          {
            name: 'MD5 / SHA-256 Prefix Truncation',
            pros: ['Deterministic — identical long URLs naturally deduplicate', 'No separate coordinator service'],
            cons: [
              'Birthday paradox causes collisions well before 62⁷ — requires DB check-and-retry loop with salt on every write',
              'Multi-tenant analytics break if two users share one deduplicated short code',
            ],
            whenToChoose: 'Small single-tenant tools where URL deduplication is a hard requirement.',
          },
          {
            name: 'Range-Leased Counter + Feistel Obfuscation (KGS)',
            recommended: true,
            pros: [
              'Mathematically 0% collision probability — no DB existence check needed before insert',
              'In-memory 10k block lease means zero network round-trips per write',
              'Bijective bit-permutation hides sequential order so competitors cannot scrape volume',
            ],
            cons: ['Loses up to 10k unused keys on pod crash (negligible out of 3.5T space)'],
            whenToChoose: 'High-scale multi-region shorteners requiring low write latency and non-enumerable aliases.',
          },
        ],
        seniorVerdict:
          'Pick Range-Leased KGS with regional modulo offsets (e.g., shardId + regional stride) + bit-scrambling before Base62 encoding. It eliminates collision retries, enables active-active multi-region writes, and prevents enumeration attacks.',
      },
      {
        topic: 'Redirect Status Code: HTTP 301 Permanent vs. HTTP 302 Temporary',
        context: 'Controls whether browsers permanently cache the redirect locally or check our edge/origin.',
        options: [
          {
            name: 'HTTP 301 (Moved Permanently)',
            pros: ['Lowest origin server load — browser bypasses our service entirely on repeat visits', 'Best SEO link equity transfer'],
            cons: [
              'Breaks click analytics (repeat clicks never hit our servers)',
              'Cannot expire, revoke malicious phishing links, or update destination URLs once cached by browsers',
            ],
            whenToChoose: 'Static vanity links where analytics and link revocation are explicitly NOT required.',
          },
          {
            name: 'HTTP 302 (Found / Temporary Redirect)',
            recommended: true,
            pros: [
              'Every click reaches our CDN/origin so click telemetry is accurate',
              'Supports dynamic link expiration, phishing takedowns, and destination edits immediately',
            ],
            cons: ['Higher redirect request volume — mitigated easily via CDN Edge + Redis caching'],
            whenToChoose: 'Any commercial shortener (bit.ly) offering analytics, TTL expiration, or abuse mitigation.',
          },
        ],
        seniorVerdict:
          'Default to HTTP 302 (or 307) with short edge caching and async beacons. If a customer explicitly requests SEO-friendly immutable redirects without analytics, offer 301 as a per-link option.',
      },
      {
        topic: 'Primary Database: Sharded SQL vs. Distributed KV (NoSQL)',
        context: 'Access pattern is >99% single-key point lookups by short_code with no cross-row joins.',
        options: [
          {
            name: 'Sharded Relational (PostgreSQL / MySQL)',
            pros: ['Strong ACID unique constraints for custom aliases', 'Familiar operational tooling and secondary indexes for user dashboards'],
            cons: ['Manual shard rebalancing as storage crosses multi-TB', 'Higher operational overhead for active-active multi-region writes'],
            whenToChoose: 'Teams already operating Vitess/Citus who need rich relational queries over user campaigns.',
          },
          {
            name: 'Distributed KV Store (DynamoDB / Cassandra)',
            recommended: true,
            pros: [
              'Native horizontal partitioning on short_code with predictable single-digit-ms p99 lookups',
              'Built-in TTL expiration and multi-region Global Tables out of the box',
              'Conditional PutItem (attribute_not_exists) enforces unique custom aliases cleanly',
            ],
            cons: ['Listing all links by user_id requires a dedicated Global Secondary Index (GSI)'],
            whenToChoose: 'Planet-scale read-heavy key-value workloads prioritizing availability, auto-sharding, and built-in TTL.',
          },
        ],
        seniorVerdict:
          'Choose DynamoDB (or Cassandra with QUORUM reads/writes for custom aliases) keyed by short_code, plus a GSI on (user_id, created_at) for user link management dashboards.',
      },
    ],
  },
};
