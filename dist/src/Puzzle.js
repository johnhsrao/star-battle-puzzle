"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Point = exports.Puzzle = void 0;
const assert_1 = __importDefault(require("assert"));
class Puzzle {
    /**
     * immutable ADT to describe a star battle puzzle
     */
    // Abstraction function
    //    AF(rows, cols, regions, solutions) = a star puzzle with rows rows and cols columns
    //      with the correct solution locations' indices in the set solutions;
    //      each individual region in the puzzle is represented by an integer key in regions, and all its
    //      corresponding points in an array of the value
    // Rep invariant
    //    -rows > 0
    //    -cols > 0
    //    -rows === cols
    //    -solutions.size === 2 * rows
    //    -elements in solutions must be >= 0 && < rows * cols
    //    -regions.size === rows === cols
    //    -regions should map total rows number of keys to total of rows * cols number of values
    //    -for key of regions, the first key = 0, and the next key += 1
    //    -for each point in regions[key], 1 <= point.row <= cols and 1<= point.col <= rows
    //    the union of all regions[key] contains all possible integer points in range [1, rows] and [1. cols]
    // Safety from rep exposure
    //    -rows and cols are public but immutable and readonly
    //    -regions and solutions are private and readonly
    //    -constructor takes immutable type number for rows and cols
    //    -constructor uses ReadonlyMap and ReadonlySet for regions so no elements can be added or deleted after construction
    //    -solutions in constructor is copied into a new ReadonlySet
    //    -all public methods return immutable and readonly types
    /**
     *construct a new Puzzle object
     *
     * @param rows an integer describing the number of rows in this board
     * @param cols an intger describing the number of cols in this board
     * @param regions a map describing the each region and the Points in each region
     * @param solutions an array with Points containing the correct placements for the stars in the map
     * @throws AssertionError if inputs fail to satify rep invariants
     */
    constructor(rows, cols, regions, solutions) {
        this.rows = rows;
        this.cols = cols;
        this.regions = regions;
        const indices = [];
        for (const pt of solutions) {
            const ptIndex = (pt.row - 1) * this.cols + (pt.col - 1);
            indices.push(ptIndex);
        }
        this.solutions = new Set(indices);
        this.checkRep();
    }
    /**
     * asserts all rep invariant
     */
    checkRep() {
        (0, assert_1.default)(this.rows > 0 && this.cols > 0, "puzzle dimensions must be > 0");
        (0, assert_1.default)(this.rows === this.cols, "puzzle must have dimension n x n");
        (0, assert_1.default)(this.solutions.size === 2 * this.rows, "there must be 2n stars in solution");
        (0, assert_1.default)(this.regions.size === this.rows, "there must be n regions");
        let pointCount = 0;
        let currIndex = 0;
        for (const [index, points] of this.regions) {
            (0, assert_1.default)(index === currIndex, "region indices must increment sequentially");
            pointCount += points.size;
            currIndex += 1;
            for (const pt of points) {
                (0, assert_1.default)(pt.row >= 1 && pt.col >= 1 && pt.row <= this.cols && pt.col <= this.rows, "point coordinates must be between 1 and n");
            }
        }
        (0, assert_1.default)(pointCount === this.rows * this.cols, "puzzle must have n x n squares");
        for (const answer of this.solutions) {
            (0, assert_1.default)(answer < this.rows * this.cols && answer >= 0, "indices of solution points must be >= 0 && <= rows*cols");
        }
    }
    /**
     * check if a given set is the solution to this puzzle
     *
     * @param stars a set of points that is the attempted solution
     * @returns true if this set of points is the solution to this puzzle
     */
    isSolution(stars) {
        if (stars.size !== this.solutions.size) {
            return false;
        }
        for (const pt of stars) {
            const starIndex = (pt.row - 1) * this.cols + (pt.col - 1);
            if (!this.solutions.has(starIndex)) {
                return false;
            }
        }
        return true;
    }
    /**
     * get all the Points in a specified region
     *
     * @param index the index of the region
     * @throws Error if index is out of bounds
     * @returns the set of Points in the specified region
     */
    getRegion(index) {
        if (index < 0 && index >= this.rows)
            throw new Error("index of region must be >=0 and < number of rows");
        const points = this.regions.get(index);
        if (points !== undefined) {
            return points;
        }
        else {
            throw new Error("regions[index] must be defined");
        }
    }
    /**
     * get string representation of this Puzzle in following format
     *
     * rows x cols
     * Regions:
     * i: row,col row,col row,col
     * Solution:
     * row,col row,col row,col
     * @returns a string representation of this Puzzle in above format
     */
    toString() {
        let output = this.rows + " x " + this.cols + "\n" + "Regions:\n";
        for (const [index, points] of this.regions) {
            output += index + ": ";
            for (const pt of points) {
                output += pt.toString() + " ";
            }
            output += "\n";
        }
        output += "Solution:\n";
        for (const index of this.solutions) {
            const row = Math.floor(index / this.cols) + 1;
            const y = (index - (row - 1) * this.cols) + 1;
            const coordinate = row + "," + y;
            output += coordinate + " ";
        }
        return output;
    }
}
exports.Puzzle = Puzzle;
class Point {
    /**
     * immutable ADT to describe a coordinate on the puzzle
     */
    // Abstraction function
    //    AF(row, y, region) = the square at row row and column col in region region of a star battle puzzle
    // Rep invariant
    //   -row > 0 && col > 0
    //   -row, col, region are integers
    //   -region >= 0
    // Safety from rep exposure
    //    -all fields are immutable and readonly
    /**
     *
     * @param row the row corresponding to this point
     * @param col the column corresponding to this point
     */
    constructor(row, col, region) {
        this.row = row;
        this.col = col;
        this.region = region;
        this.checkRep();
    }
    /**
     * asserts all rep invariant
     */
    checkRep() {
        (0, assert_1.default)(!isNaN(this.row) && this.row % 1 === 0 && this.row > 0, "row must be integer > 0");
        (0, assert_1.default)(!isNaN(this.col) && this.col % 1 === 0 && this.col > 0, "y must be integer > 0");
        (0, assert_1.default)(!isNaN(this.region) && this.region % 1 === 0 && this.region >= 0, "region must be integer >= 0");
    }
    /**
     * check if a Point is equal to another Point
     *
     * @param that another Point object to compare this too
     * @returns true if two Points are the same false otherwise
     */
    equals(that) {
        if (this.row === that.row && this.col === that.col && this.region === that.region) {
            return true;
        }
        return false;
    }
    /**
     * get string represetation of this Point
     *
     * @returns a string representation of this Point in format => row,y
     */
    toString() {
        return this.row + "," + this.col;
    }
}
exports.Point = Point;
//# sourceMappingURL=Puzzle.js.map