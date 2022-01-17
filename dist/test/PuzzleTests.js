"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeSolutions = exports.makeRegions = void 0;
const assert_1 = __importDefault(require("assert"));
const mocha_1 = require("mocha");
const Puzzle_1 = require("../src/Puzzle");
(0, mocha_1.describe)('Puzzle ADT tests', function () {
    /**
     *  Testing strategy:
     *      test each operation separately
     *
     *      constructor()
     *          partition on the validity of input: valid input, invalid input
     *
     *      isSolution()
     *          partition on output: true, false
     *          partition on the size of the input: input.size === solutions.size, input.size !== solutions.size
     *
     *      getRegion()
     *          partition on the validity of index input:
     *            invalid index: index < 0, index > rows, index === rows
     *            valid index
     *
     * Manual Testing:
     *      toString()
     *          assert output string in printed in console is same as expected
     */
    const puzzle1Regions = [
        [[1, 2], [1, 5], [1, 1], [1, 3], [1, 4], [1, 6], [1, 7], [1, 8], [2, 1], [2, 2], [2, 3], [2, 4], [2, 5], [2, 6], [2, 8], [3, 5]],
        [[2, 9], [4, 10], [1, 9], [1, 10], [2, 10], [3, 9], [3, 10], [4, 9], [5, 9], [5, 10], [6, 9], [6, 10], [7, 10], [8, 10]],
        [[3, 2], [3, 4], [3, 3]],
        [[2, 7], [4, 8], [3, 6], [3, 7], [3, 8]],
        [[6, 1], [9, 1], [3, 1], [4, 1], [4, 2], [4, 3], [4, 4], [5, 1], [5, 2], [5, 3], [6, 2], [7, 1], [7, 2], [8, 1], [8, 2], [8, 3], [8, 4], [8, 5], [8, 6]],
        [[5, 4], [5, 6], [4, 5], [5, 5], [6, 4], [6, 5], [6, 6]],
        [[6, 8], [8, 7], [4, 6], [4, 7], [5, 7], [5, 8], [6, 7], [7, 6], [7, 7], [7, 8], [8, 8]],
        [[7, 3], [7, 5], [6, 3], [7, 4]],
        [[8, 9], [10, 10], [7, 9], [9, 9], [9, 10]],
        [[9, 3], [10, 6], [9, 2], [9, 4], [9, 5], [9, 6], [9, 7], [9, 8], [10, 1], [10, 2], [10, 3], [10, 4], [10, 5], [10, 7], [10, 8], [10, 9]]
    ];
    const puzzle1Solution = [[[1, 2], [1, 5]], [[2, 9], [4, 10]], [[3, 2], [3, 4]], [[2, 7], [4, 8]], [[6, 1], [9, 1]], [[5, 4], [5, 6]], [[6, 8], [8, 7]], [[7, 3], [7, 5]], [[8, 9], [10, 10]], [[9, 3], [10, 6]]];
    (0, mocha_1.it)("should throw error for invalid constructor input", function () {
        const regions = makeRegions(puzzle1Regions);
        const solutionModified = [[[1, 2]], [[2, 9], [4, 10]], [[3, 2], [3, 4]], [[4, 8], [2, 7]], [[6, 1], [9, 1]], [[5, 4], [5, 6]], [[6, 8], [8, 7]], [[7, 3], [7, 5]], [[8, 9], [10, 10]], [[9, 3], [10, 6]]];
        const solutions = makeSolutions(solutionModified);
        assert_1.default.throws(() => new Puzzle_1.Puzzle(puzzle1Regions.length, puzzle1Regions.length, regions, solutions), Error, "solutions.size is incorrect");
    });
    (0, mocha_1.it)("should make a Puzzle object with correct properties for valid constructor input", function () {
        const regions = makeRegions(puzzle1Regions);
        const solutions = makeSolutions(puzzle1Solution);
        const puzzle = new Puzzle_1.Puzzle(puzzle1Regions.length, puzzle1Regions.length, regions, solutions);
        assert_1.default.deepStrictEqual(puzzle.rows, puzzle1Regions.length, "puzzle.rows must be equal to input rows");
        assert_1.default.deepStrictEqual(puzzle.cols, puzzle1Regions.length, "puzzle.cols must be equal to input cols");
    });
    (0, mocha_1.it)("should return true for a correct solution", function () {
        const solutions = makeSolutions(puzzle1Solution);
        const regions = makeRegions(puzzle1Regions);
        const puzzle1 = new Puzzle_1.Puzzle(puzzle1Regions.length, puzzle1Regions.length, regions, solutions);
        const solutionModified = [[[1, 5], [1, 2]], [[2, 9], [4, 10]], [[3, 2], [3, 4]], [[4, 8], [2, 7]], [[6, 1], [9, 1]], [[5, 4], [5, 6]], [[6, 8], [8, 7]], [[7, 3], [7, 5]], [[8, 9], [10, 10]], [[9, 3], [10, 6]]];
        const solutionTest = makeSolutions(solutionModified);
        assert_1.default.deepStrictEqual(puzzle1.isSolution(solutionTest), true, "solution is correct");
    });
    (0, mocha_1.it)("should return false for a wrong solution", function () {
        const solutions = makeSolutions(puzzle1Solution);
        const regions = makeRegions(puzzle1Regions);
        const puzzle1 = new Puzzle_1.Puzzle(puzzle1Regions.length, puzzle1Regions.length, regions, solutions);
        const solutionModified = [[[1, 5], [1, 2]], [[2, 10], [4, 10]], [[3, 1], [3, 4]], [[4, 8], [2, 7]], [[6, 1], [9, 1]], [[5, 4], [5, 6]], [[6, 8], [8, 7]], [[7, 3], [7, 5]], [[8, 9], [10, 10]], [[9, 3], [10, 6]]];
        const solutionTest = makeSolutions(solutionModified);
        assert_1.default.deepStrictEqual(puzzle1.isSolution(solutionTest), false, "solution is wrong");
    });
    (0, mocha_1.it)("should return false for a partial solution", function () {
        const solutions = makeSolutions(puzzle1Solution);
        const regions = makeRegions(puzzle1Regions);
        const puzzle1 = new Puzzle_1.Puzzle(puzzle1Regions.length, puzzle1Regions.length, regions, solutions);
        const solutionModified = [[[1, 5]], [[2, 9], [4, 10]], [[3, 2], [3, 4]], [[4, 8], [2, 7]], [[6, 1], [9, 1]], [[5, 4], [5, 6]], [[6, 8], [8, 7]], [[7, 3], [7, 5]], [[8, 9], [10, 10]], [[9, 3], [10, 6]]];
        const solutionTest = makeSolutions(solutionModified);
        assert_1.default.deepStrictEqual(puzzle1.isSolution(solutionTest), false, "solution.size !== input.size");
    });
    (0, mocha_1.it)("should throw error for invalid index input for getRegion", function () {
        const regions = makeRegions(puzzle1Regions);
        const solutionModified = [[[1, 5], [1, 2]], [[2, 9], [4, 10]], [[3, 2], [3, 4]], [[4, 8], [2, 7]], [[6, 1], [9, 1]], [[5, 4], [5, 6]], [[6, 8], [8, 7]], [[7, 3], [7, 5]], [[8, 9], [10, 10]], [[9, 3], [10, 6]]];
        const solutions = makeSolutions(solutionModified);
        const puzzle = new Puzzle_1.Puzzle(puzzle1Regions.length, puzzle1Regions.length, regions, solutions);
        assert_1.default.throws(() => puzzle.getRegion(10), Error, "index === rows");
    });
    (0, mocha_1.it)("should throw error for invalid index input for getRegion", function () {
        const regions = makeRegions(puzzle1Regions);
        const solutionModified = [[[1, 5], [1, 2]], [[2, 9], [4, 10]], [[3, 2], [3, 4]], [[4, 8], [2, 7]], [[6, 1], [9, 1]], [[5, 4], [5, 6]], [[6, 8], [8, 7]], [[7, 3], [7, 5]], [[8, 9], [10, 10]], [[9, 3], [10, 6]]];
        const solutions = makeSolutions(solutionModified);
        const puzzle = new Puzzle_1.Puzzle(puzzle1Regions.length, puzzle1Regions.length, regions, solutions);
        assert_1.default.throws(() => puzzle.getRegion(-1), Error, "index < 0");
    });
    (0, mocha_1.it)("should throw error for invalid index input for getRegion", function () {
        const regions = makeRegions(puzzle1Regions);
        const solutionModified = [[[1, 5], [1, 2]], [[2, 9], [4, 10]], [[3, 2], [3, 4]], [[4, 8], [2, 7]], [[6, 1], [9, 1]], [[5, 4], [5, 6]], [[6, 8], [8, 7]], [[7, 3], [7, 5]], [[8, 9], [10, 10]], [[9, 3], [10, 6]]];
        const solutions = makeSolutions(solutionModified);
        const puzzle = new Puzzle_1.Puzzle(puzzle1Regions.length, puzzle1Regions.length, regions, solutions);
        assert_1.default.throws(() => puzzle.getRegion(20), Error, "index > rows");
    });
    (0, mocha_1.it)("should return a set of points with valid input for getRegion", function () {
        const regions = makeRegions(puzzle1Regions);
        const solutionModified = [[[1, 5], [1, 2]], [[2, 9], [4, 10]], [[3, 2], [3, 4]], [[4, 8], [2, 7]], [[6, 1], [9, 1]], [[5, 4], [5, 6]], [[6, 8], [8, 7]], [[7, 3], [7, 5]], [[8, 9], [10, 10]], [[9, 3], [10, 6]]];
        const solutions = makeSolutions(solutionModified);
        const puzzle = new Puzzle_1.Puzzle(puzzle1Regions.length, puzzle1Regions.length, regions, solutions);
        const ptSet = puzzle.getRegion(0);
        assert_1.default.deepStrictEqual(ptSet, regions.get(0), "should return correct point set");
    });
    (0, mocha_1.it)("should print the expected string representation of this puzzle to console", function () {
        const regions = makeRegions(puzzle1Regions);
        const solutions = makeSolutions(puzzle1Solution);
        const puzzle = new Puzzle_1.Puzzle(puzzle1Regions.length, puzzle1Regions.length, regions, solutions);
        console.log(puzzle.toString());
    });
});
(0, mocha_1.describe)('Point ADT tests', function () {
    /**
     *  Testing strategy:
     *      test each operation separately
     *
     *      constructor()
     *          partition on the validity of input:
     *            valid input
     *            invalid input: non-integer input, x === 0, y === 0
     *
     *      equals()
     *          partition on output:
     *            false: different coordinate, different region
     *            true
     *
     *      toString()
     *          assert output string is same as expected
     */
    (0, mocha_1.it)("should throw error for non-integer constructor input", function () {
        assert_1.default.throws(() => new Puzzle_1.Point(1.5, 1, 3), Error, "non-integer x");
        assert_1.default.throws(() => new Puzzle_1.Point(1, 1, 3.1), Error, "non-integer y");
        assert_1.default.throws(() => new Puzzle_1.Point(1, 1.5, 3), Error, "non-integer region");
    });
    (0, mocha_1.it)("should throw error for out of bounds constructor input", function () {
        assert_1.default.throws(() => new Puzzle_1.Point(0, 1, 3), Error, "invalid x");
        assert_1.default.throws(() => new Puzzle_1.Point(1, 0, 3), Error, "invalid y");
        assert_1.default.throws(() => new Puzzle_1.Point(1, 1, -1), Error, "invalid region");
    });
    (0, mocha_1.it)("should make Point with correct properties", function () {
        const pt = new Puzzle_1.Point(1, 2, 0);
        assert_1.default.deepStrictEqual(pt.row, 1, "should have correct x");
        assert_1.default.deepStrictEqual(pt.col, 2, "should have correct y");
        assert_1.default.deepStrictEqual(pt.region, 0, "should have correct region");
    });
    (0, mocha_1.it)("should return true for 2 equal points", function () {
        const pt1 = new Puzzle_1.Point(1, 3, 0);
        const pt2 = new Puzzle_1.Point(1, 3, 0);
        assert_1.default.deepStrictEqual(pt1.equals(pt2), true, "points are equal");
    });
    (0, mocha_1.it)("should return false for 2 points with same coordinates but different region", function () {
        const pt1 = new Puzzle_1.Point(1, 3, 0);
        const pt2 = new Puzzle_1.Point(1, 3, 1);
        assert_1.default.deepStrictEqual(pt1.equals(pt2), false, "points are in different regions");
    });
    (0, mocha_1.it)("should return false for 2 points with different x", function () {
        const pt1 = new Puzzle_1.Point(1, 3, 0);
        const pt2 = new Puzzle_1.Point(2, 3, 0);
        assert_1.default.deepStrictEqual(pt1.equals(pt2), false, "points are have different x");
    });
    (0, mocha_1.it)("should return false for 2 points with different y", function () {
        const pt1 = new Puzzle_1.Point(1, 3, 0);
        const pt2 = new Puzzle_1.Point(1, 2, 0);
        assert_1.default.deepStrictEqual(pt1.equals(pt2), false, "points are have different y");
    });
    (0, mocha_1.it)("should return correct string representation", function () {
        const pt = new Puzzle_1.Point(2, 3, 1);
        assert_1.default.deepStrictEqual(pt.toString(), "2,3", "should return correct string representation");
    });
});
/**
 * helper function to make a regions map for puzzle construction
 *
 * @param solutions an array of regions in which each regions's points are represented by an array of [x,y]
 * @returns the set of Points in the solution
 */
function makeRegions(regions) {
    const regionMap = new Map();
    for (let i = 0; i < regions.length; ++i) {
        const points = [];
        const coordinates = regions[i];
        (0, assert_1.default)(coordinates !== undefined, "each region must have at least 2 squares");
        for (const pt of coordinates) {
            const x = pt[0];
            const y = pt[1];
            (0, assert_1.default)(x !== undefined && y !== undefined, "each point must have x and y");
            const newPt = new Puzzle_1.Point(x, y, i);
            points.push(newPt);
        }
        const ptSet = new Set(points);
        regionMap.set(i, ptSet);
    }
    return regionMap;
}
exports.makeRegions = makeRegions;
/**
 * helper function to make a solution set for puzzle construction
 *
 * @param solutions an array of region in which each regions's solution points are represented by an array of [x,y]
 * @returns the set of Points in the solution
 */
function makeSolutions(solutions) {
    const arr = [];
    for (let i = 0; i < solutions.length; ++i) {
        const points = solutions[i];
        (0, assert_1.default)(points !== undefined, "each region must have at least 2 squares");
        for (const pt of points) {
            const x = pt[0];
            const y = pt[1];
            (0, assert_1.default)(x !== undefined && y !== undefined, "each point must have x and y");
            const newPt = new Puzzle_1.Point(x, y, i);
            arr.push(newPt);
        }
    }
    const ptSet = new Set(arr);
    return ptSet;
}
exports.makeSolutions = makeSolutions;
//# sourceMappingURL=PuzzleTests.js.map