// ===== MAANG Interview Problems Data =====
// Curated collection of ~125 high-impact DSA problems for MAANG interviews

const maangCategoriesData = [
    // ===== 1. ARRAY =====
    {
        id: 'array',
        title: 'Array',
        icon: '📊',
        problems: [
            { id: 1001, name: '⭐ Two Sum', difficulty: 'Easy', leetcodeUrl: 'https://leetcode.com/problems/two-sum/', score: '9/10' },
            { id: 1002, name: '⭐ Best Time to Buy and Sell Stock', difficulty: 'Easy', leetcodeUrl: 'https://leetcode.com/problems/best-time-to-buy-and-sell-stock/', score: '9/10' },
            { id: 1003, name: 'Contains Duplicate', difficulty: 'Easy', leetcodeUrl: 'https://leetcode.com/problems/contains-duplicate/', score: '7/10' },
            { id: 1004, name: '⭐ Product of Array Except Self', difficulty: 'Medium', leetcodeUrl: 'https://leetcode.com/problems/product-of-array-except-self/', score: '9/10' },
            { id: 1005, name: '⭐ Maximum Subarray', difficulty: 'Medium', leetcodeUrl: 'https://leetcode.com/problems/maximum-subarray/', score: '10/10' },
            { id: 1006, name: 'Maximum Product Subarray', difficulty: 'Medium', leetcodeUrl: 'https://leetcode.com/problems/maximum-product-subarray/', score: '8/10' },
            { id: 1007, name: 'Find Minimum in Rotated Sorted Array', difficulty: 'Medium', leetcodeUrl: 'https://leetcode.com/problems/find-minimum-in-rotated-sorted-array/', score: '8/10' },
            { id: 1008, name: '⭐ Search in Rotated Sorted Array', difficulty: 'Medium', leetcodeUrl: 'https://leetcode.com/problems/search-in-rotated-sorted-array/', score: '9/10' },
            { id: 1009, name: '⭐ 3Sum', difficulty: 'Medium', leetcodeUrl: 'https://leetcode.com/problems/3sum/', score: '10/10' },
            { id: 1010, name: 'Container With Most Water', difficulty: 'Medium', leetcodeUrl: 'https://leetcode.com/problems/container-with-most-water/', score: '8/10' },
            { id: 1011, name: 'Next Permutation', difficulty: 'Medium', leetcodeUrl: 'https://leetcode.com/problems/next-permutation/', score: '7/10' },
            { id: 1012, name: 'Find the Duplicate Number', difficulty: 'Medium', leetcodeUrl: 'https://leetcode.com/problems/find-the-duplicate-number/', score: '8/10' }
        ],
        resources: [
            { title: 'Array Patterns Guide', url: 'https://leetcode.com/explore/learn/card/array-and-string/' }
        ]
    },

    // ===== 2. STRING =====
    {
        id: 'string',
        title: 'String',
        icon: '✍️',
        problems: [
            { id: 1013, name: '⭐ Longest Substring Without Repeating Characters', difficulty: 'Medium', leetcodeUrl: 'https://leetcode.com/problems/longest-substring-without-repeating-characters/', score: '10/10' },
            { id: 1014, name: '⭐ Longest Repeating Character Replacement', difficulty: 'Medium', leetcodeUrl: 'https://leetcode.com/problems/longest-repeating-character-replacement/', score: '8/10' },
            { id: 1015, name: '⭐ Minimum Window Substring', difficulty: 'Hard', leetcodeUrl: 'https://leetcode.com/problems/minimum-window-substring/', score: '9/10' },
            { id: 1016, name: '⭐ Valid Anagram', difficulty: 'Easy', leetcodeUrl: 'https://leetcode.com/problems/valid-anagram/', score: '8/10' },
            { id: 1017, name: '⭐ Group Anagrams', difficulty: 'Medium', leetcodeUrl: 'https://leetcode.com/problems/group-anagrams/', score: '9/10' },
            { id: 1018, name: '⭐ Valid Parentheses', difficulty: 'Easy', leetcodeUrl: 'https://leetcode.com/problems/valid-parentheses/', score: '9/10' },
            { id: 1019, name: '⭐ Valid Palindrome', difficulty: 'Easy', leetcodeUrl: 'https://leetcode.com/problems/valid-palindrome/', score: '7/10' },
            { id: 1020, name: '⭐ Longest Palindromic Substring', difficulty: 'Medium', leetcodeUrl: 'https://leetcode.com/problems/longest-palindromic-substring/', score: '9/10' },
            { id: 1021, name: 'Palindromic Substrings', difficulty: 'Medium', leetcodeUrl: 'https://leetcode.com/problems/palindromic-substrings/', score: '7/10' },
            { id: 1022, name: 'Encode and Decode Strings', difficulty: 'Medium', leetcodeUrl: 'https://leetcode.com/problems/encode-and-decode-strings/', score: '8/10' }
        ],
        resources: []
    },

    // ===== 3. LINKED LIST =====
    {
        id: 'linked-list',
        title: 'Linked List',
        icon: '⛓️',
        problems: [
            { id: 1023, name: '⭐ Reverse Linked List', difficulty: 'Easy', leetcodeUrl: 'https://leetcode.com/problems/reverse-linked-list/', score: '10/10' },
            { id: 1024, name: '⭐ Linked List Cycle', difficulty: 'Easy', leetcodeUrl: 'https://leetcode.com/problems/linked-list-cycle/', score: '9/10' },
            { id: 1025, name: '⭐ Merge Two Sorted Lists', difficulty: 'Easy', leetcodeUrl: 'https://leetcode.com/problems/merge-two-sorted-lists/', score: '9/10' },
            { id: 1026, name: '⭐ Merge k Sorted Lists', difficulty: 'Hard', leetcodeUrl: 'https://leetcode.com/problems/merge-k-sorted-lists/', score: '9/10' },
            { id: 1027, name: 'Remove Nth Node From End of List', difficulty: 'Medium', leetcodeUrl: 'https://leetcode.com/problems/remove-nth-node-from-end-of-list/', score: '8/10' },
            { id: 1028, name: 'Reorder List', difficulty: 'Medium', leetcodeUrl: 'https://leetcode.com/problems/reorder-list/', score: '8/10' }
        ],
        resources: []
    },

    // ===== 4. TWO POINTERS =====
    {
        id: 'two-pointers',
        title: 'Two Pointers',
        icon: '⚖️',
        problems: [
            { id: 1029, name: 'Sort Colors', difficulty: 'Medium', leetcodeUrl: 'https://leetcode.com/problems/sort-colors/', score: '8/10' },
            { id: 1030, name: 'Trapping Rain Water', difficulty: 'Hard', leetcodeUrl: 'https://leetcode.com/problems/trapping-rain-water/', score: '9/10' }
        ],
        resources: []
    },

    // ===== 5. SLIDING WINDOW =====
    {
        id: 'sliding-window',
        title: 'Sliding Window',
        icon: '🖼️',
        problems: [
            { id: 1031, name: 'Permutation in String', difficulty: 'Medium', leetcodeUrl: 'https://leetcode.com/problems/permutation-in-string/', score: '8/10' }
        ],
        resources: []
    },

    // ===== 6. STACK =====
    {
        id: 'stack',
        title: 'Stack',
        icon: '🥞',
        problems: [
            { id: 1032, name: 'Min Stack', difficulty: 'Medium', leetcodeUrl: 'https://leetcode.com/problems/min-stack/', score: '8/10' },
            { id: 1033, name: 'Evaluate Reverse Polish Notation', difficulty: 'Medium', leetcodeUrl: 'https://leetcode.com/problems/evaluate-reverse-polish-notation/', score: '7/10' },
            { id: 1034, name: 'Daily Temperatures', difficulty: 'Medium', leetcodeUrl: 'https://leetcode.com/problems/daily-temperatures/', score: '8/10' },
            { id: 1035, name: 'Largest Rectangle in Histogram', difficulty: 'Hard', leetcodeUrl: 'https://leetcode.com/problems/largest-rectangle-in-histogram/', score: '9/10' }
        ],
        resources: []
    },

    // ===== 7. TREE (BFS/DFS/TRAVERSAL) =====
    {
        id: 'tree-traversal',
        title: 'Tree (BFS/DFS/Traversal)',
        icon: '🌳',
        problems: [
            { id: 1036, name: '⭐ Maximum Depth of Binary Tree', difficulty: 'Easy', leetcodeUrl: 'https://leetcode.com/problems/maximum-depth-of-binary-tree/', score: '8/10' },
            { id: 1037, name: '⭐ Same Tree', difficulty: 'Easy', leetcodeUrl: 'https://leetcode.com/problems/same-tree/', score: '7/10' },
            { id: 1038, name: '⭐ Invert Binary Tree', difficulty: 'Easy', leetcodeUrl: 'https://leetcode.com/problems/invert-binary-tree/', score: '8/10' },
            { id: 1039, name: 'Subtree of Another Tree', difficulty: 'Easy', leetcodeUrl: 'https://leetcode.com/problems/subtree-of-another-tree/', score: '7/10' },
            { id: 1040, name: '⭐ Binary Tree Level Order Traversal', difficulty: 'Medium', leetcodeUrl: 'https://leetcode.com/problems/binary-tree-level-order-traversal/', score: '9/10' },
            { id: 1041, name: 'Binary Tree Right Side View', difficulty: 'Medium', leetcodeUrl: 'https://leetcode.com/problems/binary-tree-right-side-view/', score: '7/10' },
            { id: 1042, name: 'Diameter of Binary Tree', difficulty: 'Easy', leetcodeUrl: 'https://leetcode.com/problems/diameter-of-binary-tree/', score: '8/10' }
        ],
        resources: []
    },

    // ===== 8. TREE (ADVANCED & BST) =====
    {
        id: 'tree-advanced',
        title: 'Tree (Advanced & BST)',
        icon: '🌲',
        problems: [
            { id: 1043, name: '⭐ Lowest Common Ancestor of BST', difficulty: 'Medium', leetcodeUrl: 'https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-search-tree/', score: '9/10' },
            { id: 1044, name: '⭐ Validate Binary Search Tree', difficulty: 'Medium', leetcodeUrl: 'https://leetcode.com/problems/validate-binary-search-tree/', score: '9/10' },
            { id: 1045, name: '⭐ Kth Smallest Element in a BST', difficulty: 'Medium', leetcodeUrl: 'https://leetcode.com/problems/kth-smallest-element-in-a-bst/', score: '8/10' },
            { id: 1046, name: 'Construct Binary Tree from Preorder and Inorder', difficulty: 'Medium', leetcodeUrl: 'https://leetcode.com/problems/construct-binary-tree-from-preorder-and-inorder-traversal/', score: '8/10' },
            { id: 1047, name: '⭐ Binary Tree Maximum Path Sum', difficulty: 'Hard', leetcodeUrl: 'https://leetcode.com/problems/binary-tree-maximum-path-sum/', score: '9/10' },
            { id: 1048, name: 'Serialize and Deserialize Binary Tree', difficulty: 'Hard', leetcodeUrl: 'https://leetcode.com/problems/serialize-and-deserialize-binary-tree/', score: '9/10' },
            { id: 1049, name: 'Implement Trie (Prefix Tree)', difficulty: 'Medium', leetcodeUrl: 'https://leetcode.com/problems/implement-trie-prefix-tree/', score: '9/10' },
            { id: 1050, name: 'Design Add and Search Words Data Structure', difficulty: 'Medium', leetcodeUrl: 'https://leetcode.com/problems/design-add-and-search-words-data-structure/', score: '8/10' },
            { id: 1051, name: 'Word Search II', difficulty: 'Hard', leetcodeUrl: 'https://leetcode.com/problems/word-search-ii/', score: '9/10' }
        ],
        resources: []
    },

    // ===== 9. HEAP / PRIORITY QUEUE =====
    {
        id: 'heap',
        title: 'Heap / Priority Queue',
        icon: '🏔️',
        problems: [
            { id: 1052, name: '⭐ Top K Frequent Elements', difficulty: 'Medium', leetcodeUrl: 'https://leetcode.com/problems/top-k-frequent-elements/', score: '9/10' },
            { id: 1053, name: 'Kth Largest Element in an Array', difficulty: 'Medium', leetcodeUrl: 'https://leetcode.com/problems/kth-largest-element-in-an-array/', score: '8/10' },
            { id: 1054, name: 'Find Median from Data Stream', difficulty: 'Hard', leetcodeUrl: 'https://leetcode.com/problems/find-median-from-data-stream/', score: '9/10' },
            { id: 1055, name: 'Task Scheduler', difficulty: 'Medium', leetcodeUrl: 'https://leetcode.com/problems/task-scheduler/', score: '8/10' }
        ],
        resources: []
    },

    // ===== 10. BACKTRACKING =====
    {
        id: 'backtracking',
        title: 'Backtracking',
        icon: '🔙',
        problems: [
            { id: 1056, name: '⭐ Subsets', difficulty: 'Medium', leetcodeUrl: 'https://leetcode.com/problems/subsets/', score: '9/10' },
            { id: 1057, name: 'Combination Sum', difficulty: 'Medium', leetcodeUrl: 'https://leetcode.com/problems/combination-sum/', score: '8/10' },
            { id: 1058, name: 'Permutations', difficulty: 'Medium', leetcodeUrl: 'https://leetcode.com/problems/permutations/', score: '9/10' },
            { id: 1059, name: 'Subsets II', difficulty: 'Medium', leetcodeUrl: 'https://leetcode.com/problems/subsets-ii/', score: '7/10' },
            { id: 1060, name: 'Combination Sum II', difficulty: 'Medium', leetcodeUrl: 'https://leetcode.com/problems/combination-sum-ii/', score: '7/10' },
            { id: 1061, name: '⭐ Word Search', difficulty: 'Medium', leetcodeUrl: 'https://leetcode.com/problems/word-search/', score: '9/10' },
            { id: 1062, name: 'Letter Combinations of a Phone Number', difficulty: 'Medium', leetcodeUrl: 'https://leetcode.com/problems/letter-combinations-of-a-phone-number/', score: '8/10' },
            { id: 1063, name: 'N-Queens', difficulty: 'Hard', leetcodeUrl: 'https://leetcode.com/problems/n-queens/', score: '8/10' },
            { id: 1064, name: 'Palindrome Partitioning', difficulty: 'Medium', leetcodeUrl: 'https://leetcode.com/problems/palindrome-partitioning/', score: '7/10' }
        ],
        resources: []
    },

    // ===== 11. DYNAMIC PROGRAMMING (1D) =====
    {
        id: 'dp-1d',
        title: 'Dynamic Programming (1D)',
        icon: '💻',
        problems: [
            { id: 1065, name: '⭐ Climbing Stairs', difficulty: 'Easy', leetcodeUrl: 'https://leetcode.com/problems/climbing-stairs/', score: '9/10' },
            { id: 1066, name: '⭐ Coin Change', difficulty: 'Medium', leetcodeUrl: 'https://leetcode.com/problems/coin-change/', score: '10/10' },
            { id: 1067, name: '⭐ Longest Increasing Subsequence', difficulty: 'Medium', leetcodeUrl: 'https://leetcode.com/problems/longest-increasing-subsequence/', score: '9/10' },
            { id: 1068, name: '⭐ Word Break', difficulty: 'Medium', leetcodeUrl: 'https://leetcode.com/problems/word-break/', score: '9/10' },
            { id: 1069, name: '⭐ House Robber', difficulty: 'Medium', leetcodeUrl: 'https://leetcode.com/problems/house-robber/', score: '9/10' },
            { id: 1070, name: 'House Robber II', difficulty: 'Medium', leetcodeUrl: 'https://leetcode.com/problems/house-robber-ii/', score: '8/10' },
            { id: 1071, name: 'Decode Ways', difficulty: 'Medium', leetcodeUrl: 'https://leetcode.com/problems/decode-ways/', score: '8/10' },
            { id: 1072, name: 'Partition Equal Subset Sum', difficulty: 'Medium', leetcodeUrl: 'https://leetcode.com/problems/partition-equal-subset-sum/', score: '8/10' }
        ],
        resources: []
    },

    // ===== 12. DYNAMIC PROGRAMMING (2D & ADVANCED) =====
    {
        id: 'dp-2d',
        title: 'Dynamic Programming (2D & Advanced)',
        icon: '🧱',
        problems: [
            { id: 1073, name: 'Unique Paths', difficulty: 'Medium', leetcodeUrl: 'https://leetcode.com/problems/unique-paths/', score: '8/10' },
            { id: 1074, name: 'Longest Common Subsequence', difficulty: 'Medium', leetcodeUrl: 'https://leetcode.com/problems/longest-common-subsequence/', score: '9/10' },
            { id: 1075, name: 'Edit Distance', difficulty: 'Medium', leetcodeUrl: 'https://leetcode.com/problems/edit-distance/', score: '9/10' },
            { id: 1076, name: 'Best Time to Buy and Sell Stock with Cooldown', difficulty: 'Medium', leetcodeUrl: 'https://leetcode.com/problems/best-time-to-buy-and-sell-stock-with-cooldown/', score: '8/10' },
            { id: 1077, name: 'Regular Expression Matching', difficulty: 'Hard', leetcodeUrl: 'https://leetcode.com/problems/regular-expression-matching/', score: '8/10' },
            { id: 1078, name: 'Burst Balloons', difficulty: 'Hard', leetcodeUrl: 'https://leetcode.com/problems/burst-balloons/', score: '8/10' },
            { id: 1079, name: 'Maximal Square', difficulty: 'Medium', leetcodeUrl: 'https://leetcode.com/problems/maximal-square/', score: '8/10' }
        ],
        resources: []
    },

    // ===== 13. GRAPH (BFS/DFS/UNION-FIND) =====
    {
        id: 'graph-basic',
        title: 'Graph (BFS/DFS/Union-Find)',
        icon: '🌐',
        problems: [
            { id: 1080, name: '⭐ Number of Islands', difficulty: 'Medium', leetcodeUrl: 'https://leetcode.com/problems/number-of-islands/', score: '10/10' },
            { id: 1081, name: '⭐ Clone Graph', difficulty: 'Medium', leetcodeUrl: 'https://leetcode.com/problems/clone-graph/', score: '8/10' },
            { id: 1082, name: 'Pacific Atlantic Water Flow', difficulty: 'Medium', leetcodeUrl: 'https://leetcode.com/problems/pacific-atlantic-water-flow/', score: '8/10' },
            { id: 1083, name: '⭐ Course Schedule', difficulty: 'Medium', leetcodeUrl: 'https://leetcode.com/problems/course-schedule/', score: '9/10' },
            { id: 1084, name: 'Course Schedule II', difficulty: 'Medium', leetcodeUrl: 'https://leetcode.com/problems/course-schedule-ii/', score: '8/10' },
            { id: 1085, name: 'Number of Connected Components', difficulty: 'Medium', leetcodeUrl: 'https://leetcode.com/problems/number-of-connected-components-in-an-undirected-graph/', score: '8/10' },
            { id: 1086, name: 'Graph Valid Tree', difficulty: 'Medium', leetcodeUrl: 'https://leetcode.com/problems/graph-valid-tree/', score: '8/10' },
            { id: 1087, name: 'Redundant Connection', difficulty: 'Medium', leetcodeUrl: 'https://leetcode.com/problems/redundant-connection/', score: '7/10' }
        ],
        resources: []
    },

    // ===== 14. GRAPH (ADVANCED & SHORTEST PATH) =====
    {
        id: 'graph-advanced',
        title: 'Graph (Advanced & Shortest Path)',
        icon: '🗺️',
        problems: [
            { id: 1088, name: '⭐ Word Ladder', difficulty: 'Hard', leetcodeUrl: 'https://leetcode.com/problems/word-ladder/', score: '9/10' },
            { id: 1089, name: 'Network Delay Time', difficulty: 'Medium', leetcodeUrl: 'https://leetcode.com/problems/network-delay-time/', score: '8/10' },
            { id: 1090, name: 'Cheapest Flights Within K Stops', difficulty: 'Medium', leetcodeUrl: 'https://leetcode.com/problems/cheapest-flights-within-k-stops/', score: '8/10' },
            { id: 1091, name: 'Alien Dictionary', difficulty: 'Hard', leetcodeUrl: 'https://leetcode.com/problems/alien-dictionary/', score: '9/10' },
            { id: 1092, name: 'Critical Connections in a Network', difficulty: 'Hard', leetcodeUrl: 'https://leetcode.com/problems/critical-connections-in-a-network/', score: '8/10' }
        ],
        resources: []
    },

    // ===== 15. BINARY SEARCH =====
    {
        id: 'binary-search',
        title: 'Binary Search',
        icon: '🔍',
        problems: [
            { id: 1093, name: '⭐ Binary Search', difficulty: 'Easy', leetcodeUrl: 'https://leetcode.com/problems/binary-search/', score: '9/10' },
            { id: 1094, name: 'Search a 2D Matrix', difficulty: 'Medium', leetcodeUrl: 'https://leetcode.com/problems/search-a-2d-matrix/', score: '8/10' },
            { id: 1095, name: 'Time Based Key-Value Store', difficulty: 'Medium', leetcodeUrl: 'https://leetcode.com/problems/time-based-key-value-store/', score: '8/10' },
            { id: 1096, name: '⭐ Median of Two Sorted Arrays', difficulty: 'Hard', leetcodeUrl: 'https://leetcode.com/problems/median-of-two-sorted-arrays/', score: '9/10' },
            { id: 1097, name: 'Koko Eating Bananas', difficulty: 'Medium', leetcodeUrl: 'https://leetcode.com/problems/koko-eating-bananas/', score: '8/10' }
        ],
        resources: []
    },

    // ===== 16. GREEDY =====
    {
        id: 'greedy',
        title: 'Greedy',
        icon: '💡',
        problems: [
            { id: 1098, name: 'Jump Game', difficulty: 'Medium', leetcodeUrl: 'https://leetcode.com/problems/jump-game/', score: '8/10' },
            { id: 1099, name: 'Jump Game II', difficulty: 'Medium', leetcodeUrl: 'https://leetcode.com/problems/jump-game-ii/', score: '8/10' },
            { id: 1100, name: 'Gas Station', difficulty: 'Medium', leetcodeUrl: 'https://leetcode.com/problems/gas-station/', score: '8/10' },
            { id: 1101, name: 'Hand of Straights', difficulty: 'Medium', leetcodeUrl: 'https://leetcode.com/problems/hand-of-straights/', score: '7/10' },
            { id: 1102, name: 'Merge Triplets to Form Target Triplet', difficulty: 'Medium', leetcodeUrl: 'https://leetcode.com/problems/merge-triplets-to-form-target-triplet/', score: '7/10' },
            { id: 1103, name: 'Partition Labels', difficulty: 'Medium', leetcodeUrl: 'https://leetcode.com/problems/partition-labels/', score: '8/10' }
        ],
        resources: []
    },

    // ===== 17. MATH & BIT MANIPULATION =====
    {
        id: 'math-bits',
        title: 'Math & Bit Manipulation',
        icon: '📐',
        problems: [
            { id: 1104, name: 'Number of 1 Bits', difficulty: 'Easy', leetcodeUrl: 'https://leetcode.com/problems/number-of-1-bits/', score: '7/10' },
            { id: 1105, name: 'Counting Bits', difficulty: 'Easy', leetcodeUrl: 'https://leetcode.com/problems/counting-bits/', score: '7/10' },
            { id: 1106, name: 'Reverse Bits', difficulty: 'Easy', leetcodeUrl: 'https://leetcode.com/problems/reverse-bits/', score: '7/10' },
            { id: 1107, name: 'Missing Number', difficulty: 'Easy', leetcodeUrl: 'https://leetcode.com/problems/missing-number/', score: '8/10' },
            { id: 1108, name: '⭐ Sum of Two Integers', difficulty: 'Medium', leetcodeUrl: 'https://leetcode.com/problems/sum-of-two-integers/', score: '8/10' },
            { id: 1109, name: 'Reverse Integer', difficulty: 'Medium', leetcodeUrl: 'https://leetcode.com/problems/reverse-integer/', score: '7/10' },
            { id: 1110, name: 'Pow(x, n)', difficulty: 'Medium', leetcodeUrl: 'https://leetcode.com/problems/powx-n/', score: '8/10' },
            { id: 1111, name: 'Rotate Image', difficulty: 'Medium', leetcodeUrl: 'https://leetcode.com/problems/rotate-image/', score: '8/10' },
            { id: 1112, name: 'Spiral Matrix', difficulty: 'Medium', leetcodeUrl: 'https://leetcode.com/problems/spiral-matrix/', score: '8/10' },
            { id: 1113, name: 'Set Matrix Zeroes', difficulty: 'Medium', leetcodeUrl: 'https://leetcode.com/problems/set-matrix-zeroes/', score: '8/10' }
        ],
        resources: []
    },

    // ===== 18. INTERVALS =====
    {
        id: 'intervals',
        title: 'Intervals',
        icon: '🧩',
        problems: [
            { id: 1114, name: '⭐ Insert Interval', difficulty: 'Medium', leetcodeUrl: 'https://leetcode.com/problems/insert-interval/', score: '8/10' },
            { id: 1115, name: '⭐ Merge Intervals', difficulty: 'Medium', leetcodeUrl: 'https://leetcode.com/problems/merge-intervals/', score: '9/10' },
            { id: 1116, name: '⭐ Non-overlapping Intervals', difficulty: 'Medium', leetcodeUrl: 'https://leetcode.com/problems/non-overlapping-intervals/', score: '8/10' },
            { id: 1117, name: 'Meeting Rooms', difficulty: 'Easy', leetcodeUrl: 'https://leetcode.com/problems/meeting-rooms/', score: '7/10' },
            { id: 1118, name: '⭐ Meeting Rooms II', difficulty: 'Medium', leetcodeUrl: 'https://leetcode.com/problems/meeting-rooms-ii/', score: '9/10' },
            { id: 1119, name: 'Minimum Interval to Include Each Query', difficulty: 'Hard', leetcodeUrl: 'https://leetcode.com/problems/minimum-interval-to-include-each-query/', score: '8/10' }
        ],
        resources: []
    }
];
