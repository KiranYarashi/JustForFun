
// Combined Problem Data for Backend Usage
// Source of truth for difficulty lookups

// 1. NEEETCODE 150 / ROADMAP DATA
const roadmapCategories = [
    {
        id: 'arrays-strings',
        problems: [
            { id: 1, name: 'Find Closest Number to Zero', difficulty: 'Easy' },
            { id: 2, name: 'Merge Strings Alternately', difficulty: 'Easy' },
            { id: 3, name: 'Roman to Integer', difficulty: 'Easy' },
            { id: 4, name: 'Is Subsequence', difficulty: 'Easy' },
            { id: 5, name: 'Best Time to Buy and Sell Stock', difficulty: 'Easy' },
            { id: 6, name: 'Longest Common Prefix', difficulty: 'Easy' },
            { id: 7, name: 'Summary Ranges', difficulty: 'Easy' },
            { id: 8, name: 'Product of Array Except Self', difficulty: 'Medium' },
            { id: 9, name: 'Merge Intervals', difficulty: 'Medium' },
            { id: 10, name: 'Spiral Matrix', difficulty: 'Medium' },
            { id: 11, name: 'Rotate Image', difficulty: 'Medium' }
        ]
    },
    {
        id: 'hashmaps-sets',
        problems: [
            { id: 12, name: 'Jewels and Stones', difficulty: 'Easy' },
            { id: 13, name: 'Contains Duplicate', difficulty: 'Easy' },
            { id: 14, name: 'Ransom Note', difficulty: 'Easy' },
            { id: 15, name: 'Valid Anagram', difficulty: 'Easy' },
            { id: 16, name: 'Maximum Number of Balloons', difficulty: 'Easy' },
            { id: 17, name: 'Two Sum', difficulty: 'Easy' },
            { id: 18, name: 'Valid Sudoku', difficulty: 'Medium' },
            { id: 19, name: 'Group Anagrams', difficulty: 'Medium' },
            { id: 20, name: 'Majority Element', difficulty: 'Easy' },
            { id: 21, name: 'Longest Consecutive Sequence', difficulty: 'Hard' }
        ]
    },
    {
        id: 'two-pointers',
        problems: [
            { id: 22, name: 'Squares of a Sorted Array', difficulty: 'Easy' },
            { id: 23, name: 'Reverse String', difficulty: 'Easy' },
            { id: 24, name: 'Two Sum II - Input Array Is Sorted', difficulty: 'Medium' },
            { id: 25, name: 'Valid Palindrome', difficulty: 'Easy' },
            { id: 26, name: '3Sum', difficulty: 'Medium' },
            { id: 27, name: 'Container With Most Water', difficulty: 'Medium' },
            { id: 28, name: 'Trapping Rain Water', difficulty: 'Hard' }
        ]
    },
    {
        id: 'stacks',
        problems: [
            { id: 29, name: 'Baseball Game', difficulty: 'Easy' },
            { id: 30, name: 'Valid Parentheses', difficulty: 'Easy' },
            { id: 31, name: 'Evaluate Reverse Polish Notation (RPN)', difficulty: 'Medium' },
            { id: 32, name: 'Daily Temperatures', difficulty: 'Medium' },
            { id: 33, name: 'Min Stack', difficulty: 'Medium' }
        ]
    },
    {
        id: 'linked-lists',
        problems: [
            { id: 34, name: 'Remove Duplicates from Sorted List', difficulty: 'Easy' },
            { id: 35, name: 'Reverse Linked List', difficulty: 'Easy' },
            { id: 36, name: 'Merge Two Sorted Lists', difficulty: 'Easy' },
            { id: 37, name: 'Linked List Cycle', difficulty: 'Easy' },
            { id: 38, name: 'Middle of the Linked List', difficulty: 'Easy' },
            { id: 39, name: 'Remove Nth Node from End of List', difficulty: 'Medium' },
            { id: 40, name: 'Copy List with Random Pointer', difficulty: 'Medium' }
        ]
    },
    {
        id: 'binary-search',
        problems: [
            { id: 41, name: 'Binary Search', difficulty: 'Easy' },
            { id: 42, name: 'Search Insert Position', difficulty: 'Easy' },
            { id: 43, name: 'First Bad Version', difficulty: 'Easy' },
            { id: 44, name: 'Valid Perfect Square', difficulty: 'Easy' },
            { id: 45, name: 'Search a 2D Matrix', difficulty: 'Medium' },
            { id: 46, name: 'Find Minimum in Rotated Sorted Array', difficulty: 'Medium' },
            { id: 47, name: 'Search in Rotated Sorted Array', difficulty: 'Medium' },
            { id: 48, name: 'Koko Eating Bananas', difficulty: 'Medium' }
        ]
    },
    {
        id: 'sliding-window',
        problems: [
            { id: 49, name: 'Maximum Average Subarray I', difficulty: 'Easy' },
            { id: 50, name: 'Max Consecutive Ones III', difficulty: 'Medium' },
            { id: 51, name: 'Longest Substring Without Repeating Characters', difficulty: 'Medium' },
            { id: 52, name: 'Longest Repeating Character Replacement', difficulty: 'Medium' },
            { id: 53, name: 'Minimum Size Subarray Sum', difficulty: 'Medium' },
            { id: 54, name: 'Permutation in String', difficulty: 'Medium' }
        ]
    },
    {
        id: 'trees',
        problems: [
            { id: 55, name: 'Invert Binary Tree', difficulty: 'Easy' },
            { id: 56, name: 'Maximum Depth of Binary Tree', difficulty: 'Easy' },
            { id: 57, name: 'Balanced Binary Tree', difficulty: 'Easy' },
            { id: 58, name: 'Diameter of Binary Tree', difficulty: 'Easy' },
            { id: 59, name: 'Same Binary Tree', difficulty: 'Easy' },
            { id: 60, name: 'Symmetric Tree', difficulty: 'Easy' },
            { id: 61, name: 'Path Sum', difficulty: 'Easy' },
            { id: 62, name: 'Subtree of Another Tree', difficulty: 'Medium' },
            { id: 63, name: 'Binary Tree Level Order Traversal (BFS)', difficulty: 'Medium' },
            { id: 64, name: 'Kth Smallest Element in a BST', difficulty: 'Medium' },
            { id: 65, name: 'Minimum Absolute Difference in BST', difficulty: 'Easy' },
            { id: 66, name: 'Validate Binary Search Tree', difficulty: 'Medium' },
            { id: 67, name: 'Lowest Common Ancestor of a Binary Search Tree', difficulty: 'Medium' },
            { id: 68, name: 'Implement Trie (Prefix Tree)', difficulty: 'Medium' }
        ]
    },
    {
        id: 'heaps',
        problems: [
            { id: 69, name: 'Last Stone Weight', difficulty: 'Easy' },
            { id: 70, name: 'Kth Largest Element in an Array', difficulty: 'Medium' },
            { id: 71, name: 'Top K Frequent Elements', difficulty: 'Medium' },
            { id: 72, name: 'K Closest Points to Origin', difficulty: 'Medium' },
            { id: 73, name: 'Merge K Sorted Linked Lists', difficulty: 'Hard' }
        ]
    },
    {
        id: 'backtracking',
        problems: [
            { id: 74, name: 'Subsets', difficulty: 'Medium' },
            { id: 75, name: 'Permutations', difficulty: 'Medium' },
            { id: 76, name: 'Combinations', difficulty: 'Medium' },
            { id: 77, name: 'Combination Sum', difficulty: 'Medium' },
            { id: 78, name: 'Letter Combinations of a Phone Number', difficulty: 'Medium' },
            { id: 79, name: 'Generate Parentheses', difficulty: 'Medium' },
            { id: 80, name: 'Word Search', difficulty: 'Medium' }
        ]
    },
    {
        id: 'graphs',
        problems: [
            { id: 81, name: 'Find if Path Exists in Graph', difficulty: 'Easy' },
            { id: 82, name: 'Number of Islands', difficulty: 'Medium' },
            { id: 83, name: 'Max Area of Island', difficulty: 'Medium' },
            { id: 84, name: 'Course Schedule (Detecting Cycles)', difficulty: 'Medium' },
            { id: 85, name: 'Course Schedule II (Topological Sort)', difficulty: 'Medium' },
            { id: 86, name: 'Pacific Atlantic Water Flow', difficulty: 'Medium' },
            { id: 87, name: 'Clone Graph', difficulty: 'Medium' },
            { id: 88, name: 'Rotting Oranges', difficulty: 'Medium' },
            { id: 89, name: "Min Cost to Connect All Points (Prim's)", difficulty: 'Medium' },
            { id: 90, name: "Network Delay Time (Dijkstra's)", difficulty: 'Medium' }
        ]
    },
    {
        id: 'dynamic-programming',
        problems: [
            { id: 91, name: 'Fibonacci Number', difficulty: 'Easy' },
            { id: 92, name: 'Climbing Stairs', difficulty: 'Easy' },
            { id: 93, name: 'Min Cost Climbing Stairs', difficulty: 'Easy' },
            { id: 94, name: 'House Robber', difficulty: 'Medium' },
            { id: 95, name: 'Unique Paths', difficulty: 'Medium' },
            { id: 96, name: "Maximum Subarray (Kadane's Algorithm)", difficulty: 'Medium' },
            { id: 97, name: 'Jump Game', difficulty: 'Medium' },
            { id: 98, name: 'Coin Change', difficulty: 'Medium' },
            { id: 99, name: 'Longest Increasing Subsequence', difficulty: 'Medium' },
            { id: 100, name: 'Longest Common Subsequence', difficulty: 'Medium' }
        ]
    }
];

// 2. MAANG PREP DATA
const maangCategories = [
    {
        id: 'array',
        problems: [
            { id: 1001, name: '⭐ Two Sum', difficulty: 'Easy' },
            { id: 1002, name: '⭐ Best Time to Buy and Sell Stock', difficulty: 'Easy' },
            { id: 1003, name: 'Contains Duplicate', difficulty: 'Easy' },
            { id: 1004, name: '⭐ Product of Array Except Self', difficulty: 'Medium' },
            { id: 1005, name: '⭐ Maximum Subarray', difficulty: 'Medium' },
            { id: 1006, name: 'Maximum Product Subarray', difficulty: 'Medium' },
            { id: 1007, name: 'Find Minimum in Rotated Sorted Array', difficulty: 'Medium' },
            { id: 1008, name: '⭐ Search in Rotated Sorted Array', difficulty: 'Medium' },
            { id: 1009, name: '⭐ 3Sum', difficulty: 'Medium' },
            { id: 1010, name: 'Container With Most Water', difficulty: 'Medium' },
            { id: 1011, name: 'Next Permutation', difficulty: 'Medium' },
            { id: 1012, name: 'Find the Duplicate Number', difficulty: 'Medium' }
        ]
    },
    {
        id: 'string',
        problems: [
            { id: 1013, name: '⭐ Longest Substring Without Repeating Characters', difficulty: 'Medium' },
            { id: 1014, name: '⭐ Longest Repeating Character Replacement', difficulty: 'Medium' },
            { id: 1015, name: '⭐ Minimum Window Substring', difficulty: 'Hard' },
            { id: 1016, name: '⭐ Valid Anagram', difficulty: 'Easy' },
            { id: 1017, name: '⭐ Group Anagrams', difficulty: 'Medium' },
            { id: 1018, name: '⭐ Valid Parentheses', difficulty: 'Easy' },
            { id: 1019, name: '⭐ Valid Palindrome', difficulty: 'Easy' },
            { id: 1020, name: '⭐ Longest Palindromic Substring', difficulty: 'Medium' },
            { id: 1021, name: 'Palindromic Substrings', difficulty: 'Medium' },
            { id: 1022, name: 'Encode and Decode Strings', difficulty: 'Medium' }
        ]
    },
    {
        id: 'linked-list',
        problems: [
            { id: 1023, name: '⭐ Reverse Linked List', difficulty: 'Easy' },
            { id: 1024, name: '⭐ Linked List Cycle', difficulty: 'Easy' },
            { id: 1025, name: '⭐ Merge Two Sorted Lists', difficulty: 'Easy' },
            { id: 1026, name: '⭐ Merge k Sorted Lists', difficulty: 'Hard' },
            { id: 1027, name: 'Remove Nth Node From End of List', difficulty: 'Medium' },
            { id: 1028, name: 'Reorder List', difficulty: 'Medium' }
        ]
    },
    {
        id: 'two-pointers',
        problems: [
            { id: 1029, name: 'Sort Colors', difficulty: 'Medium' },
            { id: 1030, name: 'Trapping Rain Water', difficulty: 'Hard' }
        ]
    },
    {
        id: 'sliding-window',
        problems: [
            { id: 1031, name: 'Permutation in String', difficulty: 'Medium' }
        ]
    },
    {
        id: 'stack',
        problems: [
            { id: 1032, name: 'Min Stack', difficulty: 'Medium' },
            { id: 1033, name: 'Evaluate Reverse Polish Notation', difficulty: 'Medium' },
            { id: 1034, name: 'Daily Temperatures', difficulty: 'Medium' },
            { id: 1035, name: 'Largest Rectangle in Histogram', difficulty: 'Hard' }
        ]
    },
    {
        id: 'tree-traversal',
        problems: [
            { id: 1036, name: '⭐ Maximum Depth of Binary Tree', difficulty: 'Easy' },
            { id: 1037, name: '⭐ Same Tree', difficulty: 'Easy' },
            { id: 1038, name: '⭐ Invert Binary Tree', difficulty: 'Easy' },
            { id: 1039, name: 'Subtree of Another Tree', difficulty: 'Easy' },
            { id: 1040, name: '⭐ Binary Tree Level Order Traversal', difficulty: 'Medium' },
            { id: 1041, name: 'Binary Tree Right Side View', difficulty: 'Medium' },
            { id: 1042, name: 'Diameter of Binary Tree', difficulty: 'Easy' }
        ]
    },
    {
        id: 'tree-advanced',
        problems: [
            { id: 1043, name: '⭐ Lowest Common Ancestor of BST', difficulty: 'Medium' },
            { id: 1044, name: '⭐ Validate Binary Search Tree', difficulty: 'Medium' },
            { id: 1045, name: '⭐ Kth Smallest Element in a BST', difficulty: 'Medium' },
            { id: 1046, name: 'Construct Binary Tree from Preorder and Inorder', difficulty: 'Medium' },
            { id: 1047, name: '⭐ Binary Tree Maximum Path Sum', difficulty: 'Hard' },
            { id: 1048, name: 'Serialize and Deserialize Binary Tree', difficulty: 'Hard' },
            { id: 1049, name: 'Implement Trie (Prefix Tree)', difficulty: 'Medium' },
            { id: 1050, name: 'Design Add and Search Words Data Structure', difficulty: 'Medium' },
            { id: 1051, name: 'Word Search II', difficulty: 'Hard' }
        ]
    },
    {
        id: 'heap',
        problems: [
            { id: 1052, name: '⭐ Top K Frequent Elements', difficulty: 'Medium' },
            { id: 1053, name: 'Kth Largest Element in an Array', difficulty: 'Medium' },
            { id: 1054, name: 'Find Median from Data Stream', difficulty: 'Hard' },
            { id: 1055, name: 'Task Scheduler', difficulty: 'Medium' }
        ]
    },
    {
        id: 'backtracking',
        problems: [
            { id: 1056, name: '⭐ Subsets', difficulty: 'Medium' },
            { id: 1057, name: 'Combination Sum', difficulty: 'Medium' },
            { id: 1058, name: 'Permutations', difficulty: 'Medium' },
            { id: 1059, name: 'Subsets II', difficulty: 'Medium' },
            { id: 1060, name: 'Combination Sum II', difficulty: 'Medium' },
            { id: 1061, name: '⭐ Word Search', difficulty: 'Medium' },
            { id: 1062, name: 'Letter Combinations of a Phone Number', difficulty: 'Medium' },
            { id: 1063, name: 'N-Queens', difficulty: 'Hard' },
            { id: 1064, name: 'Palindrome Partitioning', difficulty: 'Medium' }
        ]
    },
    {
        id: 'dp-1d',
        problems: [
            { id: 1065, name: '⭐ Climbing Stairs', difficulty: 'Easy' },
            { id: 1066, name: '⭐ Coin Change', difficulty: 'Medium' },
            { id: 1067, name: '⭐ Longest Increasing Subsequence', difficulty: 'Medium' },
            { id: 1068, name: '⭐ Word Break', difficulty: 'Medium' },
            { id: 1069, name: '⭐ House Robber', difficulty: 'Medium' },
            { id: 1070, name: 'House Robber II', difficulty: 'Medium' },
            { id: 1071, name: 'Decode Ways', difficulty: 'Medium' },
            { id: 1072, name: 'Partition Equal Subset Sum', difficulty: 'Medium' }
        ]
    },
    {
        id: 'dp-2d',
        problems: [
            { id: 1073, name: 'Unique Paths', difficulty: 'Medium' },
            { id: 1074, name: 'Longest Common Subsequence', difficulty: 'Medium' },
            { id: 1075, name: 'Edit Distance', difficulty: 'Medium' },
            { id: 1076, name: 'Best Time to Buy and Sell Stock with Cooldown', difficulty: 'Medium' },
            { id: 1077, name: 'Regular Expression Matching', difficulty: 'Hard' },
            { id: 1078, name: 'Burst Balloons', difficulty: 'Hard' },
            { id: 1079, name: 'Maximal Square', difficulty: 'Medium' }
        ]
    },
    {
        id: 'graph-basic',
        problems: [
            { id: 1080, name: '⭐ Number of Islands', difficulty: 'Medium' },
            { id: 1081, name: '⭐ Clone Graph', difficulty: 'Medium' },
            { id: 1082, name: 'Pacific Atlantic Water Flow', difficulty: 'Medium' },
            { id: 1083, name: '⭐ Course Schedule', difficulty: 'Medium' },
            { id: 1084, name: 'Course Schedule II', difficulty: 'Medium' },
            { id: 1085, name: 'Number of Connected Components', difficulty: 'Medium' },
            { id: 1086, name: 'Graph Valid Tree', difficulty: 'Medium' },
            { id: 1087, name: 'Redundant Connection', difficulty: 'Medium' }
        ]
    },
    {
        id: 'graph-advanced',
        problems: [
            { id: 1088, name: '⭐ Word Ladder', difficulty: 'Hard' },
            { id: 1089, name: 'Network Delay Time', difficulty: 'Medium' },
            { id: 1090, name: 'Cheapest Flights Within K Stops', difficulty: 'Medium' },
            { id: 1091, name: 'Alien Dictionary', difficulty: 'Hard' },
            { id: 1092, name: 'Critical Connections in a Network', difficulty: 'Hard' }
        ]
    },
    {
        id: 'binary-search',
        problems: [
            { id: 1093, name: '⭐ Binary Search', difficulty: 'Easy' },
            { id: 1094, name: 'Search a 2D Matrix', difficulty: 'Medium' },
            { id: 1095, name: 'Time Based Key-Value Store', difficulty: 'Medium' },
            { id: 1096, name: '⭐ Median of Two Sorted Arrays', difficulty: 'Hard' },
            { id: 1097, name: 'Koko Eating Bananas', difficulty: 'Medium' }
        ]
    },
    {
        id: 'greedy',
        problems: [
            { id: 1098, name: 'Jump Game', difficulty: 'Medium' },
            { id: 1099, name: 'Jump Game II', difficulty: 'Medium' },
            { id: 1100, name: 'Gas Station', difficulty: 'Medium' },
            { id: 1101, name: 'Hand of Straights', difficulty: 'Medium' },
            { id: 1102, name: 'Merge Triplets to Form Target Triplet', difficulty: 'Medium' },
            { id: 1103, name: 'Partition Labels', difficulty: 'Medium' }
        ]
    },
    {
        id: 'math-bits',
        problems: [
            { id: 1104, name: 'Number of 1 Bits', difficulty: 'Easy' },
            { id: 1105, name: 'Counting Bits', difficulty: 'Easy' },
            { id: 1106, name: 'Reverse Bits', difficulty: 'Easy' },
            { id: 1107, name: 'Missing Number', difficulty: 'Easy' },
            { id: 1108, name: '⭐ Sum of Two Integers', difficulty: 'Medium' },
            { id: 1109, name: 'Reverse Integer', difficulty: 'Medium' },
            { id: 1110, name: 'Pow(x, n)', difficulty: 'Medium' },
            { id: 1111, name: 'Rotate Image', difficulty: 'Medium' },
            { id: 1112, name: 'Spiral Matrix', difficulty: 'Medium' },
            { id: 1113, name: 'Set Matrix Zeroes', difficulty: 'Medium' }
        ]
    },
    {
        id: 'intervals',
        problems: [
            { id: 1114, name: '⭐ Insert Interval', difficulty: 'Medium' },
            { id: 1115, name: '⭐ Merge Intervals', difficulty: 'Medium' },
            { id: 1116, name: '⭐ Non-overlapping Intervals', difficulty: 'Medium' },
            { id: 1117, name: 'Meeting Rooms', difficulty: 'Easy' },
            { id: 1118, name: '⭐ Meeting Rooms II', difficulty: 'Medium' },
            { id: 1119, name: 'Minimum Interval to Include Each Query', difficulty: 'Hard' }
        ]
    }
];

// Flatten and index for fast lookup
function createDifficultyMap() {
    const map = new Map();
    
    // Add Roadmap problems
    roadmapCategories.forEach(cat => {
        cat.problems.forEach(p => {
            // Store difficulty, name, and score
            map.set(String(p.id), { difficulty: p.difficulty, name: p.name });
            map.set(String(p.name), { difficulty: p.difficulty, id: p.id }); // Also map by name if needed
        });
    });

    // Add MAANG problems
    maangCategories.forEach(cat => {
        cat.problems.forEach(p => {
            map.set(String(p.id), { difficulty: p.difficulty, name: p.name });
            map.set(String(p.name), { difficulty: p.difficulty, id: p.id });
        });
    });

    return map;
}

const difficultyMap = createDifficultyMap();

module.exports = {
    getDifficulty: function(identifier) {
        const data = difficultyMap.get(String(identifier));
        return data ? data.difficulty : 'Medium'; // Default to Medium if unknown
    },
    
    getProblemData: function(identifier) {
        return difficultyMap.get(String(identifier));
    }
};
