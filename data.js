// Complete DSA Problem Data with LeetCode Links
const categoriesData = [
    {
        id: 'arrays-strings',
        title: 'Arrays & Strings',
        icon: '📊',
        resources: [
            'Big O Notation: Time & Space Complexity',
            'Static Arrays, Dynamic Arrays & Strings',
            'Full Python Course for Beginners'
        ],
        problems: [
            { id: 1, name: 'Find Closest Number to Zero', difficulty: 'Easy', leetcodeUrl: 'https://leetcode.com/problems/find-closest-number-to-zero/', score: '3/10' },
            { id: 2, name: 'Merge Strings Alternately', difficulty: 'Easy', leetcodeUrl: 'https://leetcode.com/problems/merge-strings-alternately/', score: '4/10' },
            { id: 3, name: 'Roman to Integer', difficulty: 'Easy', leetcodeUrl: 'https://leetcode.com/problems/roman-to-integer/', score: '4.5/10' },
            { id: 4, name: 'Is Subsequence', difficulty: 'Easy', leetcodeUrl: 'https://leetcode.com/problems/is-subsequence/', score: '4.5/10' },
            { id: 5, name: 'Best Time to Buy and Sell Stock', difficulty: 'Easy', leetcodeUrl: 'https://leetcode.com/problems/best-time-to-buy-and-sell-stock/', score: '5/10' },
            { id: 6, name: 'Longest Common Prefix', difficulty: 'Easy', leetcodeUrl: 'https://leetcode.com/problems/longest-common-prefix/', score: '5/10' },
            { id: 7, name: 'Summary Ranges', difficulty: 'Easy', leetcodeUrl: 'https://leetcode.com/problems/summary-ranges/', score: '5/10' },
            { id: 8, name: 'Product of Array Except Self', difficulty: 'Medium', leetcodeUrl: 'https://leetcode.com/problems/product-of-array-except-self/', score: '7/10' },
            { id: 9, name: 'Merge Intervals', difficulty: 'Medium', leetcodeUrl: 'https://leetcode.com/problems/merge-intervals/', score: '8/10' },
            { id: 10, name: 'Spiral Matrix', difficulty: 'Medium', leetcodeUrl: 'https://leetcode.com/problems/spiral-matrix/', score: '8/10' },
            { id: 11, name: 'Rotate Image', difficulty: 'Medium', leetcodeUrl: 'https://leetcode.com/problems/rotate-image/', score: '9/10' }
        ]
    },
    {
        id: 'hashmaps-sets',
        title: 'Hashmaps & Sets',
        icon: '🗂️',
        resources: [
            'Hash Tables: Hash Functions, Sets & Maps'
        ],
        problems: [
            { id: 12, name: 'Jewels and Stones', difficulty: 'Easy', leetcodeUrl: 'https://leetcode.com/problems/jewels-and-stones/', score: '3/10' },
            { id: 13, name: 'Contains Duplicate', difficulty: 'Easy', leetcodeUrl: 'https://leetcode.com/problems/contains-duplicate/', score: '3/10' },
            { id: 14, name: 'Ransom Note', difficulty: 'Easy', leetcodeUrl: 'https://leetcode.com/problems/ransom-note/', score: '4/10' },
            { id: 15, name: 'Valid Anagram', difficulty: 'Easy', leetcodeUrl: 'https://leetcode.com/problems/valid-anagram/', score: '5/10' },
            { id: 16, name: 'Maximum Number of Balloons', difficulty: 'Easy', leetcodeUrl: 'https://leetcode.com/problems/maximum-number-of-balloons/', score: '6/10' },
            { id: 17, name: 'Two Sum', difficulty: 'Easy', leetcodeUrl: 'https://leetcode.com/problems/two-sum/', score: '6/10' },
            { id: 18, name: 'Valid Sudoku', difficulty: 'Medium', leetcodeUrl: 'https://leetcode.com/problems/valid-sudoku/', score: '6.5/10' },
            { id: 19, name: 'Group Anagrams', difficulty: 'Medium', leetcodeUrl: 'https://leetcode.com/problems/group-anagrams/', score: '7.5/10' },
            { id: 20, name: 'Majority Element', difficulty: 'Easy', leetcodeUrl: 'https://leetcode.com/problems/majority-element/', score: '8/10' },
            { id: 21, name: 'Longest Consecutive Sequence', difficulty: 'Hard', leetcodeUrl: 'https://leetcode.com/problems/longest-consecutive-sequence/', score: '8.5/10' }
        ]
    },
    {
        id: 'two-pointers',
        title: '2 Pointers',
        icon: '👆',
        resources: [
            '2 Pointers: The Squeeze'
        ],
        problems: [
            { id: 22, name: 'Squares of a Sorted Array', difficulty: 'Easy', leetcodeUrl: 'https://leetcode.com/problems/squares-of-a-sorted-array/', score: '4/10' },
            { id: 23, name: 'Reverse String', difficulty: 'Easy', leetcodeUrl: 'https://leetcode.com/problems/reverse-string/', score: '4/10' },
            { id: 24, name: 'Two Sum II - Input Array Is Sorted', difficulty: 'Medium', leetcodeUrl: 'https://leetcode.com/problems/two-sum-ii-input-array-is-sorted/', score: '5/10' },
            { id: 25, name: 'Valid Palindrome', difficulty: 'Easy', leetcodeUrl: 'https://leetcode.com/problems/valid-palindrome/', score: '5/10' },
            { id: 26, name: '3Sum', difficulty: 'Medium', leetcodeUrl: 'https://leetcode.com/problems/3sum/', score: '7/10' },
            { id: 27, name: 'Container With Most Water', difficulty: 'Medium', leetcodeUrl: 'https://leetcode.com/problems/container-with-most-water/', score: '7.5/10' },
            { id: 28, name: 'Trapping Rain Water', difficulty: 'Hard', leetcodeUrl: 'https://leetcode.com/problems/trapping-rain-water/', score: '9/10' }
        ]
    },
    {
        id: 'stacks',
        title: 'Stacks',
        icon: '📚',
        resources: [
            'Stacks & Queues'
        ],
        problems: [
            { id: 29, name: 'Baseball Game', difficulty: 'Easy', leetcodeUrl: 'https://leetcode.com/problems/baseball-game/', score: '4/10' },
            { id: 30, name: 'Valid Parentheses', difficulty: 'Easy', leetcodeUrl: 'https://leetcode.com/problems/valid-parentheses/', score: '5.5/10' },
            { id: 31, name: 'Evaluate Reverse Polish Notation (RPN)', difficulty: 'Medium', leetcodeUrl: 'https://leetcode.com/problems/evaluate-reverse-polish-notation/', score: '6/10' },
            { id: 32, name: 'Daily Temperatures', difficulty: 'Medium', leetcodeUrl: 'https://leetcode.com/problems/daily-temperatures/', score: '6.5/10' },
            { id: 33, name: 'Min Stack', difficulty: 'Medium', leetcodeUrl: 'https://leetcode.com/problems/min-stack/', score: '7/10' }
        ]
    },
    {
        id: 'linked-lists',
        title: 'Linked Lists',
        icon: '🔗',
        resources: [
            'Linked Lists: Singly & Doubly Linked'
        ],
        problems: [
            { id: 34, name: 'Remove Duplicates from Sorted List', difficulty: 'Easy', leetcodeUrl: 'https://leetcode.com/problems/remove-duplicates-from-sorted-list/', score: '4/10' },
            { id: 35, name: 'Reverse Linked List', difficulty: 'Easy', leetcodeUrl: 'https://leetcode.com/problems/reverse-linked-list/', score: '5/10' },
            { id: 36, name: 'Merge Two Sorted Lists', difficulty: 'Easy', leetcodeUrl: 'https://leetcode.com/problems/merge-two-sorted-lists/', score: '5/10' },
            { id: 37, name: 'Linked List Cycle', difficulty: 'Easy', leetcodeUrl: 'https://leetcode.com/problems/linked-list-cycle/', score: '6/10' },
            { id: 38, name: 'Middle of the Linked List', difficulty: 'Easy', leetcodeUrl: 'https://leetcode.com/problems/middle-of-the-linked-list/', score: '6/10' },
            { id: 39, name: 'Remove Nth Node from End of List', difficulty: 'Medium', leetcodeUrl: 'https://leetcode.com/problems/remove-nth-node-from-end-of-list/', score: '6/10' },
            { id: 40, name: 'Copy List with Random Pointer', difficulty: 'Medium', leetcodeUrl: 'https://leetcode.com/problems/copy-list-with-random-pointer/', score: '7/10' }
        ]
    },
    {
        id: 'binary-search',
        title: 'Binary Search',
        icon: '🔍',
        resources: [
            'Binary Search: Traditional + Condition Based'
        ],
        problems: [
            { id: 41, name: 'Binary Search', difficulty: 'Easy', leetcodeUrl: 'https://leetcode.com/problems/binary-search/', score: '3/10' },
            { id: 42, name: 'Search Insert Position', difficulty: 'Easy', leetcodeUrl: 'https://leetcode.com/problems/search-insert-position/', score: '3.5/10' },
            { id: 43, name: 'First Bad Version', difficulty: 'Easy', leetcodeUrl: 'https://leetcode.com/problems/first-bad-version/', score: '4/10' },
            { id: 44, name: 'Valid Perfect Square', difficulty: 'Easy', leetcodeUrl: 'https://leetcode.com/problems/valid-perfect-square/', score: '4/10' },
            { id: 45, name: 'Search a 2D Matrix', difficulty: 'Medium', leetcodeUrl: 'https://leetcode.com/problems/search-a-2d-matrix/', score: '5/10' },
            { id: 46, name: 'Find Minimum in Rotated Sorted Array', difficulty: 'Medium', leetcodeUrl: 'https://leetcode.com/problems/find-minimum-in-rotated-sorted-array/', score: '6/10' },
            { id: 47, name: 'Search in Rotated Sorted Array', difficulty: 'Medium', leetcodeUrl: 'https://leetcode.com/problems/search-in-rotated-sorted-array/', score: '7/10' },
            { id: 48, name: 'Koko Eating Bananas', difficulty: 'Medium', leetcodeUrl: 'https://leetcode.com/problems/koko-eating-bananas/', score: '7/10' }
        ]
    },
    {
        id: 'sliding-window',
        title: 'Sliding Window',
        icon: '🪟',
        resources: [
            'Sliding Window: Variable Length + Fixed Length'
        ],
        problems: [
            { id: 49, name: 'Maximum Average Subarray I', difficulty: 'Easy', leetcodeUrl: 'https://leetcode.com/problems/maximum-average-subarray-i/', score: '5/10' },
            { id: 50, name: 'Max Consecutive Ones III', difficulty: 'Medium', leetcodeUrl: 'https://leetcode.com/problems/max-consecutive-ones-iii/', score: '5/10' },
            { id: 51, name: 'Longest Substring Without Repeating Characters', difficulty: 'Medium', leetcodeUrl: 'https://leetcode.com/problems/longest-substring-without-repeating-characters/', score: '5.5/10' },
            { id: 52, name: 'Longest Repeating Character Replacement', difficulty: 'Medium', leetcodeUrl: 'https://leetcode.com/problems/longest-repeating-character-replacement/', score: '6/10' },
            { id: 53, name: 'Minimum Size Subarray Sum', difficulty: 'Medium', leetcodeUrl: 'https://leetcode.com/problems/minimum-size-subarray-sum/', score: '6/10' },
            { id: 54, name: 'Permutation in String', difficulty: 'Medium', leetcodeUrl: 'https://leetcode.com/problems/permutation-in-string/', score: '7/10' }
        ]
    },
    {
        id: 'trees',
        title: 'Trees',
        icon: '🌳',
        resources: [
            'Introduction to Recursion',
            'Binary Trees & Binary Search Trees'
        ],
        problems: [
            { id: 55, name: 'Invert Binary Tree', difficulty: 'Easy', leetcodeUrl: 'https://leetcode.com/problems/invert-binary-tree/', score: '3/10' },
            { id: 56, name: 'Maximum Depth of Binary Tree', difficulty: 'Easy', leetcodeUrl: 'https://leetcode.com/problems/maximum-depth-of-binary-tree/', score: '4/10' },
            { id: 57, name: 'Balanced Binary Tree', difficulty: 'Easy', leetcodeUrl: 'https://leetcode.com/problems/balanced-binary-tree/', score: '5/10' },
            { id: 58, name: 'Diameter of Binary Tree', difficulty: 'Easy', leetcodeUrl: 'https://leetcode.com/problems/diameter-of-binary-tree/', score: '5/10' },
            { id: 59, name: 'Same Binary Tree', difficulty: 'Easy', leetcodeUrl: 'https://leetcode.com/problems/same-tree/', score: '5/10' },
            { id: 60, name: 'Symmetric Tree', difficulty: 'Easy', leetcodeUrl: 'https://leetcode.com/problems/symmetric-tree/', score: '5/10' },
            { id: 61, name: 'Path Sum', difficulty: 'Easy', leetcodeUrl: 'https://leetcode.com/problems/path-sum/', score: '5.5/10' },
            { id: 62, name: 'Subtree of Another Tree', difficulty: 'Medium', leetcodeUrl: 'https://leetcode.com/problems/subtree-of-another-tree/', score: '5.5/10' },
            { id: 63, name: 'Binary Tree Level Order Traversal (BFS)', difficulty: 'Medium', leetcodeUrl: 'https://leetcode.com/problems/binary-tree-level-order-traversal/', score: '6/10' },
            { id: 64, name: 'Kth Smallest Element in a BST', difficulty: 'Medium', leetcodeUrl: 'https://leetcode.com/problems/kth-smallest-element-in-a-bst/', score: '6.5/10' },
            { id: 65, name: 'Minimum Absolute Difference in BST', difficulty: 'Easy', leetcodeUrl: 'https://leetcode.com/problems/minimum-absolute-difference-in-bst/', score: '6.5/10' },
            { id: 66, name: 'Validate Binary Search Tree', difficulty: 'Medium', leetcodeUrl: 'https://leetcode.com/problems/validate-binary-search-tree/', score: '6.5/10' },
            { id: 67, name: 'Lowest Common Ancestor of a Binary Search Tree', difficulty: 'Medium', leetcodeUrl: 'https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-search-tree/', score: '7/10' },
            { id: 68, name: 'Implement Trie (Prefix Tree)', difficulty: 'Medium', leetcodeUrl: 'https://leetcode.com/problems/implement-trie-prefix-tree/', score: '8/10' }
        ]
    },
    {
        id: 'heaps',
        title: 'Heaps',
        icon: '⛰️',
        resources: [
            'Heaps & Priority Queues'
        ],
        problems: [
            { id: 69, name: 'Last Stone Weight', difficulty: 'Easy', leetcodeUrl: 'https://leetcode.com/problems/last-stone-weight/', score: '5/10' },
            { id: 70, name: 'Kth Largest Element in an Array', difficulty: 'Medium', leetcodeUrl: 'https://leetcode.com/problems/kth-largest-element-in-an-array/', score: '6/10' },
            { id: 71, name: 'Top K Frequent Elements', difficulty: 'Medium', leetcodeUrl: 'https://leetcode.com/problems/top-k-frequent-elements/', score: '6/10' },
            { id: 72, name: 'K Closest Points to Origin', difficulty: 'Medium', leetcodeUrl: 'https://leetcode.com/problems/k-closest-points-to-origin/', score: '6.5/10' },
            { id: 73, name: 'Merge K Sorted Linked Lists', difficulty: 'Hard', leetcodeUrl: 'https://leetcode.com/problems/merge-k-sorted-lists/', score: '8/10' }
        ]
    },
    {
        id: 'backtracking',
        title: 'Recursive Backtracking',
        icon: '🔄',
        resources: [
            'Introduction to Recursion',
            'Recursive Backtracking Algorithm'
        ],
        problems: [
            { id: 74, name: 'Subsets', difficulty: 'Medium', leetcodeUrl: 'https://leetcode.com/problems/subsets/', score: '6/10' },
            { id: 75, name: 'Permutations', difficulty: 'Medium', leetcodeUrl: 'https://leetcode.com/problems/permutations/', score: '6/10' },
            { id: 76, name: 'Combinations', difficulty: 'Medium', leetcodeUrl: 'https://leetcode.com/problems/combinations/', score: '6.5/10' },
            { id: 77, name: 'Combination Sum', difficulty: 'Medium', leetcodeUrl: 'https://leetcode.com/problems/combination-sum/', score: '7/10' },
            { id: 78, name: 'Letter Combinations of a Phone Number', difficulty: 'Medium', leetcodeUrl: 'https://leetcode.com/problems/letter-combinations-of-a-phone-number/', score: '7/10' },
            { id: 79, name: 'Generate Parentheses', difficulty: 'Medium', leetcodeUrl: 'https://leetcode.com/problems/generate-parentheses/', score: '8/10' },
            { id: 80, name: 'Word Search', difficulty: 'Medium', leetcodeUrl: 'https://leetcode.com/problems/word-search/', score: '9/10' }
        ]
    },
    {
        id: 'graphs',
        title: 'Graphs',
        icon: '🕸️',
        resources: [
            'Graphs: Representation, DFS & BFS'
        ],
        problems: [
            { id: 81, name: 'Find if Path Exists in Graph', difficulty: 'Easy', leetcodeUrl: 'https://leetcode.com/problems/find-if-path-exists-in-graph/', score: '5/10' },
            { id: 82, name: 'Number of Islands', difficulty: 'Medium', leetcodeUrl: 'https://leetcode.com/problems/number-of-islands/', score: '7/10' },
            { id: 83, name: 'Max Area of Island', difficulty: 'Medium', leetcodeUrl: 'https://leetcode.com/problems/max-area-of-island/', score: '7/10' },
            { id: 84, name: 'Course Schedule (Detecting Cycles)', difficulty: 'Medium', leetcodeUrl: 'https://leetcode.com/problems/course-schedule/', score: '7/10' },
            { id: 85, name: 'Course Schedule II (Topological Sort)', difficulty: 'Medium', leetcodeUrl: 'https://leetcode.com/problems/course-schedule-ii/', score: '7/10' },
            { id: 86, name: 'Pacific Atlantic Water Flow', difficulty: 'Medium', leetcodeUrl: 'https://leetcode.com/problems/pacific-atlantic-water-flow/', score: '8/10' },
            { id: 87, name: 'Clone Graph', difficulty: 'Medium', leetcodeUrl: 'https://leetcode.com/problems/clone-graph/', score: '8/10' },
            { id: 88, name: 'Rotting Oranges', difficulty: 'Medium', leetcodeUrl: 'https://leetcode.com/problems/rotting-oranges/', score: '8/10' },
            { id: 89, name: "Min Cost to Connect All Points (Prim's)", difficulty: 'Medium', leetcodeUrl: 'https://leetcode.com/problems/min-cost-to-connect-all-points/', score: '8.5/10' },
            { id: 90, name: "Network Delay Time (Dijkstra's)", difficulty: 'Medium', leetcodeUrl: 'https://leetcode.com/problems/network-delay-time/', score: '8.5/10' }
        ]
    },
    {
        id: 'dynamic-programming',
        title: 'Dynamic Programming',
        icon: '📈',
        resources: [
            'DP: Top Down Memoization & Bottom Up Tabulation'
        ],
        problems: [
            { id: 91, name: 'Fibonacci Number', difficulty: 'Easy', leetcodeUrl: 'https://leetcode.com/problems/fibonacci-number/', score: '5/10' },
            { id: 92, name: 'Climbing Stairs', difficulty: 'Easy', leetcodeUrl: 'https://leetcode.com/problems/climbing-stairs/', score: '5/10' },
            { id: 93, name: 'Min Cost Climbing Stairs', difficulty: 'Easy', leetcodeUrl: 'https://leetcode.com/problems/min-cost-climbing-stairs/', score: '6/10' },
            { id: 94, name: 'House Robber', difficulty: 'Medium', leetcodeUrl: 'https://leetcode.com/problems/house-robber/', score: '6/10' },
            { id: 95, name: 'Unique Paths', difficulty: 'Medium', leetcodeUrl: 'https://leetcode.com/problems/unique-paths/', score: '6/10' },
            { id: 96, name: "Maximum Subarray (Kadane's Algorithm)", difficulty: 'Medium', leetcodeUrl: 'https://leetcode.com/problems/maximum-subarray/', score: '6.5/10' },
            { id: 97, name: 'Jump Game', difficulty: 'Medium', leetcodeUrl: 'https://leetcode.com/problems/jump-game/', score: '7.5/10' },
            { id: 98, name: 'Coin Change', difficulty: 'Medium', leetcodeUrl: 'https://leetcode.com/problems/coin-change/', score: '7.5/10' },
            { id: 99, name: 'Longest Increasing Subsequence', difficulty: 'Medium', leetcodeUrl: 'https://leetcode.com/problems/longest-increasing-subsequence/', score: '8/10' },
            { id: 100, name: 'Longest Common Subsequence', difficulty: 'Medium', leetcodeUrl: 'https://leetcode.com/problems/longest-common-subsequence/', score: '10/10' }
        ]
    }
];

// Calculate total problems
const totalProblems = categoriesData.reduce((sum, cat) => sum + cat.problems.length, 0);
