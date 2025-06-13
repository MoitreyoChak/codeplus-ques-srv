import mongoose from "mongoose";
const { Schema } = mongoose;

const testCaseSchema = new mongoose.Schema({
    key: { type: String },
    label: { type: String },
    val: { type: String },
    type: { type: String },

    expectedOutput: { type: String }
});

const question = new Schema(
    {
        title: {
            type: String,
            required: [true, "Title required"],
        },
        difficulty: {
            type: String,
            enum: ['Easy', 'Medium', 'Hard'],
            default: 'Medium'
        },
        description: {
            type: [String],
            required: [true, "Please provide a description for the question"],
        },
        note: {
            type: String,
            default: ''
        },
        examples: [
            { input: String, output: String, explanation: String }
        ],
        constraints: {
            type: [String],
            required: [true, " please provide Constraints for the question"],
        },
        testcases: [[testCaseSchema]],
        tags: {
            type: [String],
            required: [true, "Atleast 1 tag is required"],
            enum: [
                "array",
                "string",
                "hashmap",
                "linked-list",
                "stack",
                "queue",
                "heap",
                "priority-queue",
                "recursion",
                "backtracking",
                "dynamic-programming",
                "greedy",
                "sliding-window",
                "two-pointers",
                "binary-search",
                "searching",
                "sorting",
                "divide-and-conquer",
                "math",
                "bit-manipulation",
                "number-theory",
                "geometry",
                "graph",
                "bfs",
                "dfs",
                "topological-sort",
                "union-find",
                "disjoint-set",
                "shortest-path",
                "dijkstra",
                "bellman-ford",
                "floyd-warshall",
                "minimum-spanning-tree",
                "kruskal",
                "prim",
                "tree",
                "binary-tree",
                "binary-search-tree",
                "segment-tree",
                "fenwick-tree",
                "trie",
                "hashing",
                "monotonic-stack",
                "monotonic-queue",
                "intervals",
                "greedy-intervals",
                "matrix",
                "prefix-sum",
                "suffix-array",
                "rolling-hash",
                "combinatorics",
                "pointers",
                "game-theory",
                "state-space-search",
                "memoization",
                "modular-arithmetic",
                "implementation",
                "simulation",
                "bitmasking",
                "recursion-tree"
            ]

        }
    },
    {
        timestamps: true,
    }
);

const Question = mongoose.model("Questions", question);
export { Question };