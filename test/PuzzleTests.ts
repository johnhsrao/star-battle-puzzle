import assert from 'assert';
import { describe, it } from 'mocha';
import {Puzzle, Point} from '../src/Puzzle';

describe('Puzzle ADT tests', function () {
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
        [[1,2], [1,5], [1,1], [1,3], [1,4], [1,6], [1,7], [1,8], [2,1], [2,2], [2,3], [2,4], [2,5], [2,6], [2,8], [3,5]],
        [[2,9], [4,10], [1,9], [1,10], [2,10], [3,9], [3,10], [4,9], [5,9], [5,10], [6,9], [6,10], [7,10], [8,10]],
        [[3,2], [3,4], [3,3]],
        [[2,7], [4,8], [3,6], [3,7], [3,8]],
        [[6,1], [9, 1], [3,1], [4,1], [4,2], [4,3], [4,4], [5,1], [5,2], [5,3], [6,2], [7,1], [7,2], [8,1], [8,2], [8,3], [8,4], [8,5], [8,6]],
        [[5,4], [5,6], [4,5], [5,5], [6,4], [6,5],[6,6]],
        [[6,8], [8,7], [4,6], [4,7], [5,7], [5,8], [6,7], [7,6], [7,7], [7,8], [8,8]],
        [[7,3], [7,5], [6,3], [7,4]],
        [[8,9], [10,10], [7,9], [9,9], [9,10]],
        [[9,3], [10,6], [9,2], [9,4], [9,5], [9,6], [9,7], [9,8], [10,1], [10,2], [10,3], [10,4], [10,5], [10,7], [10,8], [10,9]]
        ];
    const puzzle1Solution = [[[1,2], [1,5]],[[2,9], [4,10]], [[3,2], [3,4]],[[2,7], [4,8]], [[6,1], [9, 1]],[[5,4], [5,6]],[[6,8], [8,7]],[[7,3], [7,5]],[[8,9], [10,10]],[[9,3], [10,6]]];

    it("should throw error for invalid constructor input", function () {
        const regions = makeRegions(puzzle1Regions);
        const solutionModified = [[[1,2]],[[2,9], [4,10]], [[3,2], [3,4]],[ [4,8], [2,7]], [[6,1], [9, 1]],[[5,4], [5,6]],[[6,8], [8,7]],[[7,3], [7,5]],[[8,9], [10,10]],[[9,3], [10,6]]];
        const solutions = makeSolutions(solutionModified);
        assert.throws(() => new Puzzle(puzzle1Regions.length, puzzle1Regions.length, regions, solutions), Error, "solutions.size is incorrect");
      });
    it("should make a Puzzle object with correct properties for valid constructor input", function () {
      const regions = makeRegions(puzzle1Regions);
      const solutions = makeSolutions(puzzle1Solution);
      const puzzle = new Puzzle(puzzle1Regions.length, puzzle1Regions.length, regions, solutions);
      assert.deepStrictEqual(puzzle.rows, puzzle1Regions.length, "puzzle.rows must be equal to input rows");
      assert.deepStrictEqual(puzzle.cols, puzzle1Regions.length, "puzzle.cols must be equal to input cols");
    });
    it("should return true for a correct solution", function(){
        const solutions = makeSolutions(puzzle1Solution);
        const regions = makeRegions(puzzle1Regions);
        const puzzle1 = new Puzzle(puzzle1Regions.length, puzzle1Regions.length, regions, solutions);
        const solutionModified = [[[1,5], [1,2]],[[2,9], [4,10]], [[3,2], [3,4]],[ [4,8], [2,7]], [[6,1], [9, 1]],[[5,4], [5,6]],[[6,8], [8,7]],[[7,3], [7,5]],[[8,9], [10,10]],[[9,3], [10,6]]];
        const solutionTest = makeSolutions(solutionModified);
        assert.deepStrictEqual(puzzle1.isSolution(solutionTest), true, "solution is correct");
    });
    it("should return false for a wrong solution", function(){
        const solutions = makeSolutions(puzzle1Solution);
        const regions = makeRegions(puzzle1Regions);
        const puzzle1 = new Puzzle(puzzle1Regions.length, puzzle1Regions.length, regions, solutions);
        const solutionModified = [[[1,5], [1,2]],[[2,10], [4,10]], [[3,1], [3,4]],[ [4,8], [2,7]], [[6,1], [9, 1]],[[5,4], [5,6]],[[6,8], [8,7]],[[7,3], [7,5]],[[8,9], [10,10]],[[9,3], [10,6]]];
        const solutionTest = makeSolutions(solutionModified);
        assert.deepStrictEqual(puzzle1.isSolution(solutionTest), false, "solution is wrong");
    });
    it("should return false for a partial solution", function(){
        const solutions = makeSolutions(puzzle1Solution);
        const regions = makeRegions(puzzle1Regions);
        const puzzle1 = new Puzzle(puzzle1Regions.length, puzzle1Regions.length, regions, solutions);
        const solutionModified = [[[1,5]],[[2,9], [4,10]], [[3,2], [3,4]],[ [4,8], [2,7]], [[6,1], [9, 1]],[[5,4], [5,6]],[[6,8], [8,7]],[[7,3], [7,5]],[[8,9], [10,10]],[[9,3], [10,6]]];
        const solutionTest = makeSolutions(solutionModified);
        assert.deepStrictEqual(puzzle1.isSolution(solutionTest), false, "solution.size !== input.size");
    });
    it("should throw error for invalid index input for getRegion", function () {
      const regions = makeRegions(puzzle1Regions);
      const solutionModified = [[[1,5], [1,2]],[[2,9], [4,10]], [[3,2], [3,4]],[ [4,8], [2,7]], [[6,1], [9, 1]],[[5,4], [5,6]],[[6,8], [8,7]],[[7,3], [7,5]],[[8,9], [10,10]],[[9,3], [10,6]]];
      const solutions = makeSolutions(solutionModified);
      const puzzle = new Puzzle(puzzle1Regions.length, puzzle1Regions.length, regions, solutions);
      assert.throws(() => puzzle.getRegion(10), Error, "index === rows");
    });
    it("should throw error for invalid index input for getRegion", function () {
      const regions = makeRegions(puzzle1Regions);
      const solutionModified = [[[1,5], [1,2]],[[2,9], [4,10]], [[3,2], [3,4]],[ [4,8], [2,7]], [[6,1], [9, 1]],[[5,4], [5,6]],[[6,8], [8,7]],[[7,3], [7,5]],[[8,9], [10,10]],[[9,3], [10,6]]];
      const solutions = makeSolutions(solutionModified);
      const puzzle = new Puzzle(puzzle1Regions.length, puzzle1Regions.length, regions, solutions);
      assert.throws(() => puzzle.getRegion(-1), Error, "index < 0");
    });
    it("should throw error for invalid index input for getRegion", function () {
      const regions = makeRegions(puzzle1Regions);
      const solutionModified = [[[1,5], [1,2]],[[2,9], [4,10]], [[3,2], [3,4]],[ [4,8], [2,7]], [[6,1], [9, 1]],[[5,4], [5,6]],[[6,8], [8,7]],[[7,3], [7,5]],[[8,9], [10,10]],[[9,3], [10,6]]];
      const solutions = makeSolutions(solutionModified);
      const puzzle = new Puzzle(puzzle1Regions.length, puzzle1Regions.length, regions, solutions);
      assert.throws(() => puzzle.getRegion(20), Error, "index > rows");
    });
    it("should return a set of points with valid input for getRegion", function () {
      const regions = makeRegions(puzzle1Regions);
      const solutionModified = [[[1,5], [1,2]],[[2,9], [4,10]], [[3,2], [3,4]],[ [4,8], [2,7]], [[6,1], [9, 1]],[[5,4], [5,6]],[[6,8], [8,7]],[[7,3], [7,5]],[[8,9], [10,10]],[[9,3], [10,6]]];
      const solutions = makeSolutions(solutionModified);
      const puzzle = new Puzzle(puzzle1Regions.length, puzzle1Regions.length, regions, solutions);
      const ptSet = puzzle.getRegion(0);
      assert.deepStrictEqual(ptSet, regions.get(0), "should return correct point set");
    });
    it("should print the expected string representation of this puzzle to console", function () {
      const regions = makeRegions(puzzle1Regions);
      const solutions = makeSolutions(puzzle1Solution);
      const puzzle = new Puzzle(puzzle1Regions.length, puzzle1Regions.length, regions, solutions);
      console.log(puzzle.toString());
    });
});

describe('Point ADT tests', function () {
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
     it("should throw error for non-integer constructor input", function () {
      assert.throws(() => new Point(1.5, 1, 3), Error, "non-integer x");
      assert.throws(() => new Point(1, 1, 3.1), Error, "non-integer y");
      assert.throws(() => new Point(1, 1.5, 3), Error, "non-integer region");
    });
    it("should throw error for out of bounds constructor input", function () {
      assert.throws(() => new Point(0, 1, 3), Error, "invalid x");
      assert.throws(() => new Point(1, 0, 3), Error, "invalid y");
      assert.throws(() => new Point(1, 1, -1), Error, "invalid region");
    });
    it("should make Point with correct properties", function(){
      const pt = new Point(1,2,0);
      assert.deepStrictEqual(pt.row, 1, "should have correct x");
      assert.deepStrictEqual(pt.col, 2, "should have correct y");
      assert.deepStrictEqual(pt.region, 0, "should have correct region");
    });
    it("should return true for 2 equal points", function(){
      const pt1 = new Point(1,3,0);
      const pt2 = new Point(1,3,0)
      assert.deepStrictEqual(pt1.equals(pt2), true, "points are equal");
    });
    it("should return false for 2 points with same coordinates but different region", function(){
      const pt1 = new Point(1,3,0);
      const pt2 = new Point(1,3,1)
      assert.deepStrictEqual(pt1.equals(pt2), false, "points are in different regions");
    });
    it("should return false for 2 points with different x", function(){
      const pt1 = new Point(1,3,0);
      const pt2 = new Point(2,3,0)
      assert.deepStrictEqual(pt1.equals(pt2), false, "points are have different x");
    });
    it("should return false for 2 points with different y", function(){
      const pt1 = new Point(1,3,0);
      const pt2 = new Point(1,2,0)
      assert.deepStrictEqual(pt1.equals(pt2), false, "points are have different y");
    });
    it("should return correct string representation", function(){
      const pt = new Point(2,3,1);
      assert.deepStrictEqual(pt.toString(), "2,3", "should return correct string representation");
    });
});

/**
 * helper function to make a regions map for puzzle construction
 *
 * @param solutions an array of regions in which each regions's points are represented by an array of [x,y]
 * @returns the set of Points in the solution
 */
export function makeRegions(
    regions: Array<Array<Array<number>>>
  ): ReadonlyMap<number, ReadonlySet<Point>> {
    const regionMap: Map<number, ReadonlySet<Point>> = new Map();
    for (let i = 0; i < regions.length; ++i) {
      const points = [];
      const coordinates = regions[i];
      assert(
        coordinates !== undefined,
        "each region must have at least 2 squares"
      );
      for (const pt of coordinates) {
        const x = pt[0];
        const y = pt[1];
        assert(
          x !== undefined && y !== undefined,
          "each point must have x and y"
        );
        const newPt = new Point(x, y, i);
        points.push(newPt);
      }
      const ptSet: ReadonlySet<Point> = new Set(points);
      regionMap.set(i, ptSet);
    }
    return regionMap as ReadonlyMap<number, ReadonlySet<Point>>;
  }
  
  /**
   * helper function to make a solution set for puzzle construction
   *
   * @param solutions an array of region in which each regions's solution points are represented by an array of [x,y]
   * @returns the set of Points in the solution
   */
export function makeSolutions(solutions: Array<Array<Array<number>>>): Set<Point> {
    const arr: Array<Point> = [];
    for (let i = 0; i < solutions.length; ++i) {
      const points = solutions[i];
      assert(points !== undefined, "each region must have at least 2 squares");
      for (const pt of points) {
        const x = pt[0];
        const y = pt[1];
        assert(
          x !== undefined && y !== undefined,
          "each point must have x and y"
        );
        const newPt = new Point(x, y, i);
        arr.push(newPt);
      }
    }
    const ptSet: Set<Point> = new Set(arr);
    return ptSet;
  }
  