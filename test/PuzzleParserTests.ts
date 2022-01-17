import assert from 'assert';
import { describe, it } from 'mocha';
import {Puzzle, Point} from '../src/Puzzle';
import { parsePuzzle } from '../src/PuzzleParser';
import { makeRegions, makeSolutions } from './PuzzleTests';

describe('Parser tests', function () {
    /**
     * testing strategy
     *  test each of the ADT operations
     * 
     *  parsePuzzle():
     *      partiiton on whether parse is valid: 
     *      if valid:
     *          partition on if file contains comments (#): yes, no
     *          partition on if file contains unnecessary whitespace between lines: yes, no
     *      if invalid:
     *          partition on error reason: invalid grammar, valid grammar but invalid puzzle 
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
    
    const expectedRegions: ReadonlyMap<number, ReadonlySet<Point>> =  makeRegions(puzzle1Regions);
    const expectedSolutions: Set<Point> = makeSolutions(puzzle1Solution);

    const puzzle1 = new Puzzle(10, 10, expectedRegions, expectedSolutions);

    it("should return correct puzzle for a file with comments", function () {
        const input = `
# Star Battle Puzzles by KrazyDad, Volume 1, Book 1, Number 1
# from https://krazydad.com/starbattle/
# (also shown in the project handout)
10x10
1,2  1,5  | 1,1 1,3 1,4 1,6 1,7 1,8 2,1 2,2 2,3 2,4 2,5 2,6 2,8 3,5
2,9  4,10 | 1,9 1,10 2,10 3,9 3,10 4,9 5,9 5,10 6,9 6,10 7,10 8,10
3,2  3,4  | 3,3
2,7  4,8  | 3,6 3,7 3,8
6,1  9,1  | 3,1 4,1 4,2 4,3 4,4 5,1 5,2 5,3 6,2 7,1 7,2 8,1 8,2 8,3 8,4 8,5 8,6
5,4  5,6  | 4,5 5,5 6,4 6,5 6,6
6,8  8,7  | 4,6 4,7 5,7 5,8 6,7 7,6 7,7 7,8 8,8
7,3  7,5  | 6,3 7,4
8,9 10,10 | 7,9 9,9 9,10
9,3  10,6 | 9,2 9,4 9,5 9,6 9,7 9,8 10,1 10,2 10,3 10,4 10,5 10,7 10,8 10,9
`;
        const result: Puzzle = parsePuzzle(input);

        assert.deepStrictEqual(result, puzzle1, 'Parsed puzzle has incorrect values');
    });

    it("should return correct puzzle for a file with no comments and white space", function () {
        // has multiple solutions but just make sure a valid solution is valid
        const input = `
10x10


1,2  1,5  | 1,1 1,3 1,4 1,6 1,7 1,8 2,1 2,2 2,3 2,4 2,5 2,6 2,8 3,5

2,9  4,10 | 1,9 1,10 2,10 3,9 3,10 4,9 5,9          5,10 6,9 6,10 7,10 8,10
3,2  3,4  | 3,3
2,7  4,8  | 3,6 3,7 3,8




6,1  9,1    | 3,1                 4,1 4,2 4,3 4,4 5,1 5,2 5,3 6,2 7,1 7,2 8,1 8,2 8,3 8,4 8,5 8,6
5,4  5,6  | 4,5 5,5 6,4 6,5 6,6
6,8  8,7  | 4,6 4,7 5,7 5,8 6,7 7,6 7,7 7,8 8,8
7,3  7,5  | 6,3 7,4
8,9 10,10 | 7,9 9,9 9,10

9,3  10,6 | 9,2 9,4 9,5 9,6 9,7 9,8 10,1 10,2 10,3 10,4 10,5 10,7 10,8 10,9`;
        const result: Puzzle = parsePuzzle(input);

        assert.deepStrictEqual(result, puzzle1, 'Incorrect parsed puzzle');
    });

    it("should throw error when grammar is invalid (space in point)", function () {
        const input = `
10x10
1, 2  1,5  | 1,1 1,3 1,4 1,6 1,7 1,8 2,1 2,2 2,3 2,4 2,5 2,6 2,8 3,5
2,9  4,10 | 1,9 1,10 2,10 3,9 3,10 4,9 5,9 5,10 6,9 6,10 7,10 8,10
3,2  3,4  | 3,3
2,7  4,8  | 3,6 3,7 3,8
6,1  9,1  | 3,1 4,1 4,2 4,3 4,4 5,1 5,2 5,3 6,2 7,1 7,2 8,1 8,2 8,3 8,4 8,5 8,6
5,4  5,6  | 4,5 5,5 6,4 6,5 6,6
6,8  8,7  | 4,6 4,7 5,7 5,8 6,7 7,6 7,7 7,8 8,8
7,3  7,5  | 6,3 7,4
8,9 10,10 | 7,9 9,9 9,10
9,3  10,6 | 9,2 9,4 9,5 9,6 9,7 9,8 10,1 10,2 10,3 10,4 10,5 10,7 10,8 10,9
        `;
        assert.throws(()=>{
            parsePuzzle(input);
        }, Error, 'Coordinates cannot have a space in them');
    });

    it("should throw error when grammar is invalid (two regions in one line)", function () {
        const input = `
10x10
1,2  1,5  | 1,1 1,3 1,4 1,6 1,7 1,8 2,1 2,2 2,3 2,4 2,5 2,6 2,8 3,5     2,9  4,10 | 1,9 1,10 2,10 3,9 3,10 4,9 5,9 5,10 6,9 6,10 7,10 8,10
3,2  3,4  | 3,3
2,7  4,8  | 3,6 3,7 3,8
6,1  9,1  | 3,1 4,1 4,2 4,3 4,4 5,1 5,2 5,3 6,2 7,1 7,2 8,1 8,2 8,3 8,4 8,5 8,6
5,4  5,6  | 4,5 5,5 6,4 6,5 6,6
6,8  8,7  | 4,6 4,7 5,7 5,8 6,7 7,6 7,7 7,8 8,8
7,3  7,5  | 6,3 7,4
8,9 10,10 | 7,9 9,9 9,10
9,3  10,6 | 9,2 9,4 9,5 9,6 9,7 9,8 10,1 10,2 10,3 10,4 10,5 10,7 10,8 10,9
        `;
        assert.throws(()=>{
            parsePuzzle(input);
        }, Error, 'Cannot have two | in one line');
    });

    it("should throw error when grammar is valid but puzzle is invalid (wrong number of points)", function () {
        const input = `
10x10
1,2  1,5  | 1,1 1,3 1,4 1,6 1,7 1,8 2,1 2,2 2,3 2,4 2,5 2,6 2,8 3,5     
2,9  4,10 | 1,9 1,10 2,10 3,9 3,10 4,9 5,9 5,10 6,9 6,10 7,10 8,10
3,2  3,4  | 3,3
2,7  4,8  | 3,6 3,7 3,8
6,1  9,1  | 3,1 4,1 4,2 4,3 4,4 5,1 5,2 5,3 6,2 7,1 7,2 8,1 8,2 8,3 8,4 8,5 8,6
5,4  5,6  | 4,5 5,5 6,4 6,5 6,6
6,8  8,7  | 4,6 4,7 5,7 5,8 6,7 7,6 7,7 7,8 8,8
7,3  7,5  | 6,3 7,4
8,9 10,10 | 7,9 9,9 9,10
9,3  10,6 | 9,2 9,4 9,5 9,6 9,7 9,8 10,1 10,2 10,3 10,4 10,5 10,7 10,8
        `;
        assert.throws(()=>{
            parsePuzzle(input);
        }, Error, 'Valid grammar but puzzle has the wrong number of points');
    });
});