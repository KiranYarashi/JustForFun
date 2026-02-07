// Patterns Mastery Data - 3-Level Hierarchy
// Structure: Main Topic → Patterns (Sub-Sections) → Problems

const patternsData = [
    // ===== WEEK 1-2: ARRAYS =====
    {
        id: 'topic-arrays',
        title: 'Arrays',
        icon: '📊',
        subSections: [
            {
                id: 'pattern-sliding-window',
                title: 'Sliding Window',
                problems: [
                    { id: 'p-sw-1', name: 'Maximum Subarray (Kadane\'s Algo)', difficulty: 'Medium', leetcodeUrl: 'https://leetcode.com/problems/maximum-subarray/', score: '6/10' },
                    { id: 'p-sw-2', name: 'Longest Substring Without Repeating Characters', difficulty: 'Medium', leetcodeUrl: 'https://leetcode.com/problems/longest-substring-without-repeating-characters/', score: '6/10' }
                ]
            },
            {
                id: 'pattern-prefix-sum',
                title: 'Prefix Sum',
                problems: [
                    { id: 'p-ps-1', name: 'Range Sum Query - Immutable', difficulty: 'Easy', leetcodeUrl: 'https://leetcode.com/problems/range-sum-query-immutable/', score: '5/10' },
                    { id: 'p-ps-2', name: 'Subarray Sum Equals K', difficulty: 'Medium', leetcodeUrl: 'https://leetcode.com/problems/subarray-sum-equals-k/', score: '6/10' }
                ]
            },
            {
                id: 'pattern-binary-search',
                title: 'Binary Search',
                problems: [
                    { id: 'p-bs-1', name: 'Binary Search', difficulty: 'Easy', leetcodeUrl: 'https://leetcode.com/problems/binary-search/', score: '4/10' },
                    { id: 'p-bs-2', name: 'Find First and Last Position of Element in Sorted Array', difficulty: 'Medium', leetcodeUrl: 'https://leetcode.com/problems/find-first-and-last-position-of-element-in-sorted-array/', score: '6/10' }
                ]
            },
            {
                id: 'pattern-two-pointers',
                title: 'Two Pointers',
                problems: [
                    { id: 'p-tp-1', name: 'Container With Most Water', difficulty: 'Medium', leetcodeUrl: 'https://leetcode.com/problems/container-with-most-water/', score: '7/10' },
                    { id: 'p-tp-2', name: '3Sum', difficulty: 'Medium', leetcodeUrl: 'https://leetcode.com/problems/3sum/', score: '7/10' },
                    { id: 'p-tp-3', name: 'Two Sum', difficulty: 'Easy', leetcodeUrl: 'https://leetcode.com/problems/two-sum/', score: '5/10' },
                    { id: 'p-tp-4', name: 'Best Time to Buy and Sell Stock', difficulty: 'Easy', leetcodeUrl: 'https://leetcode.com/problems/best-time-to-buy-and-sell-stock/', score: '5/10' }
                ]
            },
            {
                id: 'pattern-sorting',
                title: 'Sorting Techniques',
                problems: [
                    { id: 'p-st-1', name: 'Merge Intervals', difficulty: 'Medium', leetcodeUrl: 'https://leetcode.com/problems/merge-intervals/', score: '7/10' },
                    { id: 'p-st-2', name: 'Sort Colors (Dutch National Flag)', difficulty: 'Medium', leetcodeUrl: 'https://leetcode.com/problems/sort-colors/', score: '6/10' }
                ]
            }
        ]
    },
    
    // ===== STRINGS + HASHING =====
    {
        id: 'topic-strings',
        title: 'Strings + Hashing',
        icon: '🔤',
        subSections: [
            {
                id: 'pattern-char-count',
                title: 'Character Count & Frequency',
                problems: [
                    { id: 'p-cc-1', name: 'Valid Anagram', difficulty: 'Easy', leetcodeUrl: 'https://leetcode.com/problems/valid-anagram/', score: '5/10' },
                    { id: 'p-cc-2', name: 'Ransom Note', difficulty: 'Easy', leetcodeUrl: 'https://leetcode.com/problems/ransom-note/', score: '4/10' }
                ]
            },
            {
                id: 'pattern-palindrome',
                title: 'Palindrome Problems',
                problems: [
                    { id: 'p-pal-1', name: 'Valid Palindrome', difficulty: 'Easy', leetcodeUrl: 'https://leetcode.com/problems/valid-palindrome/', score: '4/10' },
                    { id: 'p-pal-2', name: 'Longest Palindromic Substring', difficulty: 'Medium', leetcodeUrl: 'https://leetcode.com/problems/longest-palindromic-substring/', score: '7/10' }
                ]
            },
            {
                id: 'pattern-string-sliding',
                title: 'Sliding Window on Strings',
                problems: [
                    { id: 'p-ss-1', name: 'Minimum Window Substring', difficulty: 'Hard', leetcodeUrl: 'https://leetcode.com/problems/minimum-window-substring/', score: '8/10' },
                    { id: 'p-ss-2', name: 'Permutation in String', difficulty: 'Medium', leetcodeUrl: 'https://leetcode.com/problems/permutation-in-string/', score: '7/10' }
                ]
            },
            {
                id: 'pattern-hashmap',
                title: 'HashMap Fundamentals',
                problems: [
                    { id: 'p-hm-1', name: 'Group Anagrams', difficulty: 'Medium', leetcodeUrl: 'https://leetcode.com/problems/group-anagrams/', score: '6/10' },
                    { id: 'p-hm-2', name: 'Contains Duplicate', difficulty: 'Easy', leetcodeUrl: 'https://leetcode.com/problems/contains-duplicate/', score: '3/10' },
                    { id: 'p-hm-3', name: 'Longest Consecutive Sequence', difficulty: 'Medium', leetcodeUrl: 'https://leetcode.com/problems/longest-consecutive-sequence/', score: '7/10' }
                ]
            }
        ]
    },
    
    // ===== LINKED LISTS =====
    {
        id: 'topic-linked-lists',
        title: 'Linked Lists',
        icon: '🔗',
        subSections: [
            {
                id: 'pattern-ll-basics',
                title: 'Basics & Traversal',
                problems: [
                    { id: 'p-ll-1', name: 'Reverse Linked List', difficulty: 'Easy', leetcodeUrl: 'https://leetcode.com/problems/reverse-linked-list/', score: '5/10' },
                    { id: 'p-ll-2', name: 'Middle of the Linked List', difficulty: 'Easy', leetcodeUrl: 'https://leetcode.com/problems/middle-of-the-linked-list/', score: '4/10' }
                ]
            },
            {
                id: 'pattern-ll-cycle',
                title: 'Cycle Detection (Floyd\'s)',
                problems: [
                    { id: 'p-llc-1', name: 'Linked List Cycle', difficulty: 'Easy', leetcodeUrl: 'https://leetcode.com/problems/linked-list-cycle/', score: '5/10' },
                    { id: 'p-llc-2', name: 'Linked List Cycle II', difficulty: 'Medium', leetcodeUrl: 'https://leetcode.com/problems/linked-list-cycle-ii/', score: '6/10' }
                ]
            },
            {
                id: 'pattern-ll-merge',
                title: 'Merge & Sort',
                problems: [
                    { id: 'p-llm-1', name: 'Merge Two Sorted Lists', difficulty: 'Easy', leetcodeUrl: 'https://leetcode.com/problems/merge-two-sorted-lists/', score: '5/10' },
                    { id: 'p-llm-2', name: 'Sort List', difficulty: 'Medium', leetcodeUrl: 'https://leetcode.com/problems/sort-list/', score: '7/10' }
                ]
            },
            {
                id: 'pattern-ll-reversal',
                title: 'Advanced Reversals',
                problems: [
                    { id: 'p-llr-1', name: 'Reverse Linked List II', difficulty: 'Medium', leetcodeUrl: 'https://leetcode.com/problems/reverse-linked-list-ii/', score: '7/10' },
                    { id: 'p-llr-2', name: 'Reverse Nodes in k-Group', difficulty: 'Hard', leetcodeUrl: 'https://leetcode.com/problems/reverse-nodes-in-k-group/', score: '9/10' }
                ]
            }
        ]
    },
    
    // ===== STACKS & QUEUES =====
    {
        id: 'topic-stacks-queues',
        title: 'Stacks & Queues',
        icon: '📚',
        subSections: [
            {
                id: 'pattern-stack-basics',
                title: 'Stack Basics',
                problems: [
                    { id: 'p-stk-1', name: 'Valid Parentheses', difficulty: 'Easy', leetcodeUrl: 'https://leetcode.com/problems/valid-parentheses/', score: '5/10' },
                    { id: 'p-stk-2', name: 'Min Stack', difficulty: 'Medium', leetcodeUrl: 'https://leetcode.com/problems/min-stack/', score: '6/10' }
                ]
            },
            {
                id: 'pattern-monotonic-stack',
                title: 'Monotonic Stack',
                problems: [
                    { id: 'p-ms-1', name: 'Daily Temperatures', difficulty: 'Medium', leetcodeUrl: 'https://leetcode.com/problems/daily-temperatures/', score: '7/10' },
                    { id: 'p-ms-2', name: 'Next Greater Element I', difficulty: 'Easy', leetcodeUrl: 'https://leetcode.com/problems/next-greater-element-i/', score: '5/10' },
                    { id: 'p-ms-3', name: 'Asteroid Collision', difficulty: 'Medium', leetcodeUrl: 'https://leetcode.com/problems/asteroid-collision/', score: '6/10' }
                ]
            },
            {
                id: 'pattern-queue-deque',
                title: 'Queue & Deque',
                problems: [
                    { id: 'p-que-1', name: 'Implement Queue using Stacks', difficulty: 'Easy', leetcodeUrl: 'https://leetcode.com/problems/implement-queue-using-stacks/', score: '5/10' },
                    { id: 'p-que-2', name: 'Sliding Window Maximum', difficulty: 'Hard', leetcodeUrl: 'https://leetcode.com/problems/sliding-window-maximum/', score: '9/10' }
                ]
            }
        ]
    },
    
    // ===== RECURSION & BACKTRACKING =====
    {
        id: 'topic-backtracking',
        title: 'Recursion & Backtracking',
        icon: '🔄',
        subSections: [
            {
                id: 'pattern-subsets',
                title: 'Subsets & Combinations',
                problems: [
                    { id: 'p-sub-1', name: 'Subsets', difficulty: 'Medium', leetcodeUrl: 'https://leetcode.com/problems/subsets/', score: '6/10' },
                    { id: 'p-sub-2', name: 'Subsets II', difficulty: 'Medium', leetcodeUrl: 'https://leetcode.com/problems/subsets-ii/', score: '6/10' },
                    { id: 'p-sub-3', name: 'Combination Sum', difficulty: 'Medium', leetcodeUrl: 'https://leetcode.com/problems/combination-sum/', score: '6/10' }
                ]
            },
            {
                id: 'pattern-permutations',
                title: 'Permutations',
                problems: [
                    { id: 'p-perm-1', name: 'Permutations', difficulty: 'Medium', leetcodeUrl: 'https://leetcode.com/problems/permutations/', score: '6/10' },
                    { id: 'p-perm-2', name: 'Letter Combinations of a Phone Number', difficulty: 'Medium', leetcodeUrl: 'https://leetcode.com/problems/letter-combinations-of-a-phone-number/', score: '6/10' }
                ]
            },
            {
                id: 'pattern-constraint-bt',
                title: 'Constraint-Based Backtracking',
                problems: [
                    { id: 'p-cbt-1', name: 'N-Queens', difficulty: 'Hard', leetcodeUrl: 'https://leetcode.com/problems/n-queens/', score: '9/10' },
                    { id: 'p-cbt-2', name: 'Word Search', difficulty: 'Medium', leetcodeUrl: 'https://leetcode.com/problems/word-search/', score: '7/10' },
                    { id: 'p-cbt-3', name: 'Sudoku Solver', difficulty: 'Hard', leetcodeUrl: 'https://leetcode.com/problems/sudoku-solver/', score: '9/10' }
                ]
            }
        ]
    },
    
    // ===== BINARY TREES & BST =====
    {
        id: 'topic-trees',
        title: 'Binary Trees & BST',
        icon: '🌳',
        subSections: [
            {
                id: 'pattern-tree-traversal',
                title: 'Tree Traversals',
                problems: [
                    { id: 'p-tt-1', name: 'Binary Tree Inorder Traversal', difficulty: 'Easy', leetcodeUrl: 'https://leetcode.com/problems/binary-tree-inorder-traversal/', score: '5/10' },
                    { id: 'p-tt-2', name: 'Binary Tree Level Order Traversal', difficulty: 'Medium', leetcodeUrl: 'https://leetcode.com/problems/binary-tree-level-order-traversal/', score: '6/10' },
                    { id: 'p-tt-3', name: 'Binary Tree Zigzag Level Order', difficulty: 'Medium', leetcodeUrl: 'https://leetcode.com/problems/binary-tree-zigzag-level-order-traversal/', score: '6/10' }
                ]
            },
            {
                id: 'pattern-tree-dfs',
                title: 'Tree DFS',
                problems: [
                    { id: 'p-tdfs-1', name: 'Maximum Depth of Binary Tree', difficulty: 'Easy', leetcodeUrl: 'https://leetcode.com/problems/maximum-depth-of-binary-tree/', score: '4/10' },
                    { id: 'p-tdfs-2', name: 'Path Sum', difficulty: 'Easy', leetcodeUrl: 'https://leetcode.com/problems/path-sum/', score: '5/10' },
                    { id: 'p-tdfs-3', name: 'Diameter of Binary Tree', difficulty: 'Easy', leetcodeUrl: 'https://leetcode.com/problems/diameter-of-binary-tree/', score: '5/10' }
                ]
            },
            {
                id: 'pattern-lca',
                title: 'Lowest Common Ancestor',
                problems: [
                    { id: 'p-lca-1', name: 'Lowest Common Ancestor of a Binary Tree', difficulty: 'Medium', leetcodeUrl: 'https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-tree/', score: '7/10' },
                    { id: 'p-lca-2', name: 'Invert Binary Tree', difficulty: 'Easy', leetcodeUrl: 'https://leetcode.com/problems/invert-binary-tree/', score: '4/10' }
                ]
            },
            {
                id: 'pattern-bst',
                title: 'BST Operations',
                problems: [
                    { id: 'p-bst-1', name: 'Validate Binary Search Tree', difficulty: 'Medium', leetcodeUrl: 'https://leetcode.com/problems/validate-binary-search-tree/', score: '6/10' },
                    { id: 'p-bst-2', name: 'Search in a Binary Search Tree', difficulty: 'Easy', leetcodeUrl: 'https://leetcode.com/problems/search-in-a-binary-search-tree/', score: '4/10' },
                    { id: 'p-bst-3', name: 'Delete Node in a BST', difficulty: 'Medium', leetcodeUrl: 'https://leetcode.com/problems/delete-node-in-a-bst/', score: '7/10' }
                ]
            }
        ]
    },
    
    // ===== HEAPS & TRIES =====
    {
        id: 'topic-heaps-tries',
        title: 'Heaps & Tries',
        icon: '⛰️',
        subSections: [
            {
                id: 'pattern-heap-basics',
                title: 'Heap Basics',
                problems: [
                    { id: 'p-hp-1', name: 'Kth Largest Element in an Array', difficulty: 'Medium', leetcodeUrl: 'https://leetcode.com/problems/kth-largest-element-in-an-array/', score: '6/10' },
                    { id: 'p-hp-2', name: 'Top K Frequent Elements', difficulty: 'Medium', leetcodeUrl: 'https://leetcode.com/problems/top-k-frequent-elements/', score: '6/10' }
                ]
            },
            {
                id: 'pattern-two-heaps',
                title: 'Two Heaps',
                problems: [
                    { id: 'p-th-1', name: 'Find Median from Data Stream', difficulty: 'Hard', leetcodeUrl: 'https://leetcode.com/problems/find-median-from-data-stream/', score: '9/10' }
                ]
            },
            {
                id: 'pattern-trie',
                title: 'Trie (Prefix Tree)',
                problems: [
                    { id: 'p-tr-1', name: 'Implement Trie (Prefix Tree)', difficulty: 'Medium', leetcodeUrl: 'https://leetcode.com/problems/implement-trie-prefix-tree/', score: '6/10' },
                    { id: 'p-tr-2', name: 'Word Search II', difficulty: 'Hard', leetcodeUrl: 'https://leetcode.com/problems/word-search-ii/', score: '9/10' }
                ]
            }
        ]
    },
    
    // ===== GRAPHS =====
    {
        id: 'topic-graphs',
        title: 'Graphs',
        icon: '🕸️',
        subSections: [
            {
                id: 'pattern-graph-dfs-bfs',
                title: 'DFS & BFS',
                problems: [
                    { id: 'p-gr-1', name: 'Number of Islands', difficulty: 'Medium', leetcodeUrl: 'https://leetcode.com/problems/number-of-islands/', score: '6/10' },
                    { id: 'p-gr-2', name: 'Clone Graph', difficulty: 'Medium', leetcodeUrl: 'https://leetcode.com/problems/clone-graph/', score: '6/10' },
                    { id: 'p-gr-3', name: 'Rotting Oranges', difficulty: 'Medium', leetcodeUrl: 'https://leetcode.com/problems/rotting-oranges/', score: '6/10' }
                ]
            },
            {
                id: 'pattern-cycle-detection',
                title: 'Cycle Detection',
                problems: [
                    { id: 'p-cy-1', name: 'Course Schedule', difficulty: 'Medium', leetcodeUrl: 'https://leetcode.com/problems/course-schedule/', score: '7/10' },
                    { id: 'p-cy-2', name: 'Course Schedule II', difficulty: 'Medium', leetcodeUrl: 'https://leetcode.com/problems/course-schedule-ii/', score: '7/10' }
                ]
            },
            {
                id: 'pattern-shortest-path',
                title: 'Shortest Path',
                problems: [
                    { id: 'p-sp-1', name: 'Network Delay Time', difficulty: 'Medium', leetcodeUrl: 'https://leetcode.com/problems/network-delay-time/', score: '7/10' },
                    { id: 'p-sp-2', name: 'Shortest Path in Binary Matrix', difficulty: 'Medium', leetcodeUrl: 'https://leetcode.com/problems/shortest-path-in-binary-matrix/', score: '6/10' }
                ]
            },
            {
                id: 'pattern-union-find',
                title: 'Union Find (DSU)',
                problems: [
                    { id: 'p-uf-1', name: 'Redundant Connection', difficulty: 'Medium', leetcodeUrl: 'https://leetcode.com/problems/redundant-connection/', score: '6/10' },
                    { id: 'p-uf-2', name: 'Accounts Merge', difficulty: 'Medium', leetcodeUrl: 'https://leetcode.com/problems/accounts-merge/', score: '7/10' }
                ]
            }
        ]
    },
    
    // ===== DYNAMIC PROGRAMMING =====
    {
        id: 'topic-dp',
        title: 'Dynamic Programming',
        icon: '📈',
        subSections: [
            {
                id: 'pattern-dp-basics',
                title: 'DP Basics',
                problems: [
                    { id: 'p-dpb-1', name: 'Fibonacci Number', difficulty: 'Easy', leetcodeUrl: 'https://leetcode.com/problems/fibonacci-number/', score: '4/10' },
                    { id: 'p-dpb-2', name: 'Climbing Stairs', difficulty: 'Easy', leetcodeUrl: 'https://leetcode.com/problems/climbing-stairs/', score: '5/10' }
                ]
            },
            {
                id: 'pattern-knapsack',
                title: '0/1 Knapsack',
                problems: [
                    { id: 'p-ks-1', name: 'Partition Equal Subset Sum', difficulty: 'Medium', leetcodeUrl: 'https://leetcode.com/problems/partition-equal-subset-sum/', score: '7/10' },
                    { id: 'p-ks-2', name: 'Coin Change', difficulty: 'Medium', leetcodeUrl: 'https://leetcode.com/problems/coin-change/', score: '7/10' }
                ]
            },
            {
                id: 'pattern-lcs',
                title: 'Longest Common Subsequence',
                problems: [
                    { id: 'p-lcs-1', name: 'Longest Common Subsequence', difficulty: 'Medium', leetcodeUrl: 'https://leetcode.com/problems/longest-common-subsequence/', score: '7/10' },
                    { id: 'p-lcs-2', name: 'Longest Palindromic Subsequence', difficulty: 'Medium', leetcodeUrl: 'https://leetcode.com/problems/longest-palindromic-subsequence/', score: '7/10' }
                ]
            },
            {
                id: 'pattern-lis',
                title: 'Longest Increasing Subsequence',
                problems: [
                    { id: 'p-lis-1', name: 'Longest Increasing Subsequence', difficulty: 'Medium', leetcodeUrl: 'https://leetcode.com/problems/longest-increasing-subsequence/', score: '7/10' }
                ]
            },
            {
                id: 'pattern-dp-grid',
                title: 'DP on Grids',
                problems: [
                    { id: 'p-dpg-1', name: 'Unique Paths', difficulty: 'Medium', leetcodeUrl: 'https://leetcode.com/problems/unique-paths/', score: '6/10' },
                    { id: 'p-dpg-2', name: 'Minimum Path Sum', difficulty: 'Medium', leetcodeUrl: 'https://leetcode.com/problems/minimum-path-sum/', score: '6/10' }
                ]
            },
            {
                id: 'pattern-dp-trees',
                title: 'DP on Trees',
                problems: [
                    { id: 'p-dpt-1', name: 'House Robber III', difficulty: 'Medium', leetcodeUrl: 'https://leetcode.com/problems/house-robber-iii/', score: '7/10' }
                ]
            }
        ]
    }
];

// Calculate total problems
const patternsTotalProblems = patternsData.reduce((sum, topic) => {
    return sum + topic.subSections.reduce((subSum, pattern) => subSum + pattern.problems.length, 0);
}, 0);
