import assert from 'assert';
import { describe, it } from 'mocha';
import {Puzzle, Point} from '../src/Puzzle';
import {Client} from '../src/Client';

describe('Client ADT tests', function () {
    /**
     * testing strategy
     *  test each of the ADT operations
     * 
     *  partition on adding a star:
     *      add a star out of bounds of the board
     *      add a star that is adjacent to another placed star: horizontal, diagonal, vertical
     *      add a star in a row that already has 2 stars
     *      add a star in a clomun that already has 2 sars
     *      add a star in a region that already has 2 stars
     *      add a star to a position with star already
     *      add a star to a valid position w/. no other stars in the same row, col or region
     *      add a star to a valid position w/. 1 other star in the same row, col or region
     *      add a star to a solved board
     * partition on removing a star:
     *      removing a star out of bounds
     *      removing a star not placed
     *      removing a star that has been added
     * partition on is solved:
     *      correct solution to this board
     *      incorrect solution to this board
     *      client board has no stars
     * partition on placedNum():
     *      the number n of stars client has successfully placed: n = 0, n > 0
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
    const regions = makeRegions(puzzle1Regions);
    const solutions = makeSolutions(puzzle1Solution);
    const puzzle = new Puzzle(puzzle1Regions.length, puzzle1Regions.length, regions, solutions);
    
    it("should throw error when adding out of bounds star position", function () {
        const user = new Client(puzzle);
        assert.throws(() => user.addStar(new Point(0, 1, 3)), Error, "invalid x position");
        assert.throws(() => user.addStar(new Point(1, 0, 3)), Error, "invalid y position");
        assert.throws(() => user.addStar(new Point(11, 1, 3)), Error, "invalid x position");
        assert.throws(() => user.addStar(new Point(1, 12, 3)), Error, "invalid y position");
        assert.throws(() => user.addStar(new Point(1, 1, 12)), Error, "invalid region");
        assert.throws(() => user.addStar(new Point(1, 1, 10)), Error, "invalid region");
    });
    it("should throw error when removing out of bounds star position", function () {
        const user = new Client(puzzle);
        assert.throws(() => user.removeStar(new Point(0, 1, 1)), Error, "invalid x position");
        assert.throws(() => user.removeStar(new Point(1, 0, 1)), Error, "invalid y position");
        assert.throws(() => user.removeStar(new Point(12, 2, 0)), Error, "invalid x position");
        assert.throws(() => user.removeStar(new Point(3, 15, 0)), Error, "invalid y position");
        assert.throws(() => user.removeStar(new Point(1, 2, 15)), Error, "invalid region");
        assert.throws(() => user.removeStar(new Point(2, 1, 10)), Error, "invalid region");
    });
    it("should return true when adding a star to a blank puzzle", function(){
        const user = new Client(puzzle);
        const pt = new Point(1,1,0);
        assert.deepStrictEqual(user.addStar(pt), true, "valid add star to blank puzzle");
        assert.deepStrictEqual(user.placedNum(), 1, "client should have added 1 star");
    });
    it("should return false when removing a star from a blank puzzle", function(){
        const user = new Client(puzzle);
        const pt = new Point(1,1,0);
        assert.deepStrictEqual(user.placedNum(), 0, "client should have added no stars");
        assert.deepStrictEqual(user.removeStar(pt), false, "cannot remove star from blank puzzle");
    });
    it("should return false when removing a star that hasn't been added", function(){
        const user = new Client(puzzle);
        const pt = new Point(1,2,0);
        user.addStar(pt);
        const pt2 = new Point(1,5,0);
        assert.deepStrictEqual(user.placedNum(), 1, "client should have added 1 star");
        assert.deepStrictEqual(user.removeStar(pt2), false, "cannot remove star that hasn't been added");
    });
    it("should return true when removing a star that was added to the board", function(){
        const user = new Client(puzzle);
        const pt = new Point(1,2,0);
        user.addStar(pt);
        const pt2 = new Point(1,5,0);
        user.addStar(pt2);
        assert.deepStrictEqual(user.placedNum(), 2, "client should have added 2 stars");
        assert.deepStrictEqual(user.removeStar(pt2), true, "valid remove an added star");
    });
    it("should return true when adding a star to a valid position w/. 1 other star in same region", function(){
        const user = new Client(puzzle);
        const pt1 = new Point(1,1,0);
        user.addStar(pt1);
        const pt2 = new Point(2,5,0);
        assert.deepStrictEqual(user.addStar(pt2), true, "valid add star to region w/. 1 star");
        assert.deepStrictEqual(user.placedNum(), 2, "client should have added 2 stars");
    });
    it("should return true when adding a star to a valid position w/. 1 other star in same row", function(){
        const user = new Client(puzzle);
        const pt1 = new Point(2,2,0);
        user.addStar(pt1);
        const pt2 = new Point(2,9,1);
        assert.deepStrictEqual(user.addStar(pt2), true, "valid add star to region w/. 1 star");
        assert.deepStrictEqual(user.placedNum(), 2, "client should have added 2 stars");
    });
    it("should return true when adding a star to a valid position w/. 1 other star in same column", function(){
        const user = new Client(puzzle);
        const pt1 = new Point(1,2,0);
        user.addStar(pt1);
        const pt2 = new Point(3,2,2);
        assert.deepStrictEqual(user.addStar(pt2), true, "valid add star to column w/. 1 star");
        assert.deepStrictEqual(user.placedNum(), 2, "client should have added 2 stars");
    });
    it("should return false when adding a star horizontally adjacent to another star", function(){
        const user = new Client(puzzle);
        const pt1 = new Point(2,2,0);
        user.addStar(pt1);
        const pt2 = new Point(2,3,0);
        const pt3 = new Point(2,1,0);
        assert.deepStrictEqual(user.addStar(pt2), false, "cannot add start horizontally adjacent to another star");
        assert.deepStrictEqual(user.placedNum(), 1, "client should have added only 1 star");
        assert.deepStrictEqual(user.addStar(pt3), false, "cannot add start horizontally adjacent to another star");
        assert.deepStrictEqual(user.placedNum(), 1, "client should have added only 1 star");
    });
    it("should return false when adding a star vertically adjacent to another star", function(){
        const user = new Client(puzzle);
        const pt1 = new Point(3,2,2);
        user.addStar(pt1);
        const pt2 = new Point(2,2,0);
        const pt3 = new Point(4,2,4);
        assert.deepStrictEqual(user.addStar(pt2), false, "cannot add start vertically adjacent to another star");
        assert.deepStrictEqual(user.placedNum(), 1, "client should have added only 1 star");
        assert.deepStrictEqual(user.addStar(pt3), false, "cannot add start vertically adjacent to another star");
        assert.deepStrictEqual(user.placedNum(), 1, "client should have added only 1 star");
    });
    it("should return false when adding a star diagonally adjacent to another star", function(){
        const user = new Client(puzzle);
        const pt1 = new Point(3,2,2);
        user.addStar(pt1);
        const pt2 = new Point(2,3,0);
        const pt3 = new Point(4,3,4);
        const pt4 = new Point(2,1,0);
        const pt5 = new Point(4,1,4);
        assert.deepStrictEqual(user.addStar(pt2), false, "cannot add start diagonally adjacent to another star");
        assert.deepStrictEqual(user.placedNum(), 1, "client should have added only 1 star");
        assert.deepStrictEqual(user.addStar(pt3), false, "cannot add start diagonally adjacent to another star");
        assert.deepStrictEqual(user.addStar(pt4), false, "cannot add start diagonally adjacent to another star");
        assert.deepStrictEqual(user.addStar(pt5), false, "cannot add start diagonally adjacent to another star");
        assert.deepStrictEqual(user.placedNum(), 1, "client should have added only 1 star");
    });
    it("should return false when adding a star to position w/. a star already", function(){
        const user = new Client(puzzle);
        const pt1 = new Point(2,2,0);
        user.addStar(pt1);
        const pt2 = new Point(2,2,0);
        assert.deepStrictEqual(user.addStar(pt2), false, "cannot add start horizontally adjacent to another star");
        assert.deepStrictEqual(user.placedNum(), 1, "client should have added only 1 star");
    });
    it("should return false when adding a star to a region w/. 2 stars already", function(){
        const user = new Client(puzzle);
        const pt1 = new Point(2,2,0);
        user.addStar(pt1);
        const pt2 = new Point(1,5,0);
        user.addStar(pt2);
        assert.deepStrictEqual(user.placedNum(), 2, "client should have added 2 stars");
        const pt3 = new Point(1,8,0);
        assert.deepStrictEqual(user.addStar(pt3), false, "cannot add start to a region w/. 2 stars already");
        assert.deepStrictEqual(user.placedNum(), 2, "client should have added 2 stars");
    });
    it("should return false when adding a star to a row w/. 2 stars already", function(){
        const user = new Client(puzzle);
        const pt1 = new Point(2,9,1);
        user.addStar(pt1);
        const pt2 = new Point(2,2,0);
        user.addStar(pt2);
        assert.deepStrictEqual(user.placedNum(), 2, "client should have added 2 stars");
        const pt3 = new Point(2,7,3);
        assert.deepStrictEqual(user.addStar(pt3), false, "cannot add start to a row w/. 2 stars already");
        assert.deepStrictEqual(user.placedNum(), 2, "client should have added 2 stars");
    });
    it("should return false when adding a star to a column w/. 2 stars already", function(){
        const user = new Client(puzzle);
        const pt1 = new Point(1,2,0);
        user.addStar(pt1);
        const pt2 = new Point(3,2,2);
        user.addStar(pt2);
        assert.deepStrictEqual(user.placedNum(), 2, "client should have added 2 stars");
        const pt3 = new Point(10,2,9);
        assert.deepStrictEqual(user.addStar(pt3), false, "cannot add start to a column w/. 2 stars already");
        assert.deepStrictEqual(user.placedNum(), 2, "client should have added 2 stars");
    });
    it("should return false when checking if a blank board is solved", function(){
        const user = new Client(puzzle);
        assert.deepStrictEqual(user.isSolved(), false, "blank board is not solved");
    });
    it("should return true when checking correctly solved board && should not let user add any more stars", function(){
        const user = new Client(puzzle);
        for(const pt of solutions){
            user.addStar(pt);
        }
        assert.deepStrictEqual(user.placedNum(), 20, "client should have added 20 correct stars");
        assert.deepStrictEqual(user.isSolved(), true, "board is solved");
        assert.deepStrictEqual(user.addStar(new Point(1,8,0)), false, "user cannot add to solved board");
    });
    it("should return false when checking incorrectly solved board", function(){
        const user = new Client(puzzle);
        const arr = [[[1,2], [1,5]],[[2,9], [4,10]], [[3,4]], [[2,7], [4,8]], [[6,1], [9,1]], [[5,4], [5,6]], [[6,8], [8,7]], [[7,3], [7,5]], [[10,10]], [[10,6]]];
        const incorrectSol = makeSolutions(arr);
        for(const pt of incorrectSol){
            user.addStar(pt);
        }
        assert.deepStrictEqual(user.isSolved(), false, "board not solved");
    });
});
/**
 * helper function to make a regions map for puzzle construction
 *
 * @param solutions an array of regions in which each regions's points are represented by an array of [x,y]
 * @returns the set of Points in the solution
 */
 function makeRegions(
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
  function makeSolutions(solutions: Array<Array<Array<number>>>): Set<Point> {
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
  