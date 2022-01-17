"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Client = void 0;
const assert_1 = __importDefault(require("assert"));
class Client {
    /**
     *  mutable ADT that describes the state of client's puzzle board of star battle puzzle
     */
    // Abstraction function
    //    AF(puzzle, starsIndices, starsMap) = a client is playing the star battle puzzle puzzle;
    //                           the stars this client has placed are stored in starsIndices, as the stars' indices of their position on the board
    //                           starsMap maps the indices of elements in starsIndices to the Point object representing that star's position
    // Rep invariant
    //    -elements in starsIndices must be >= 0 && < puzzle.rows*puzzle.cols
    //    -all elements in starsIndices must be a key in starsMap, vice verse
    //    -elements in starsIndices should not represent adjacent positions
    //    -no more than 2 values in starsMap can have the same point.region, point.row, point.col
    // Safety from rep exposure
    //    -Puzzle is immutable, private and readonly
    //    -starsIndices and starsMap are private readonly and are never returned
    //    -placedNum() and isSolved() don't return the rep
    /**
     *
     * @param puzzle a puzzle this client is trying to solve
     * @param placedStars the list of stars the client has placed so far, default = an empty set
     */
    constructor(puzzle) {
        this.puzzle = puzzle;
        this.starsIndices = new Set();
        this.starsMap = new Map();
        this.checkRep();
    }
    /**
     * asserts RIs:
     *   all elements in starsIndices are keys in starsMap, vice verse
     *   all elements in starsIndices >= 0 && < puzzle.rows*puzzle.cols
     *   other RI representing game rules are checked when adding to the board
     *
     */
    checkRep() {
        for (const index of this.starsIndices) {
            (0, assert_1.default)(index >= 0 && index < this.puzzle.rows * this.puzzle.cols, "index in starsIndices out of bounds");
            (0, assert_1.default)(this.starsMap.has(index), "all elements in starsIndices must be a key in starsMap");
        }
        for (const key of this.starsMap.keys()) {
            (0, assert_1.default)(this.starsIndices.has(key), "all keys in starsMap must be in starsIndices");
        }
    }
    /**
     * helper function to get the index number from a Point object representing a star's position
     *
     * @param star the Point object representng the position of the star
     * @throws error if the star's position is out of bounds
     * @returns the index number representing the star's position on the board
     */
    getIndex(star) {
        (0, assert_1.default)(star.row > 0 &&
            star.col > 0 &&
            star.row <= this.puzzle.rows &&
            star.col <= this.puzzle.cols, "star position put of bounds");
        (0, assert_1.default)(star.region >= 0 && star.region < this.puzzle.rows, "star region out of bounds");
        const starIndex = (star.row - 1) * this.puzzle.cols + (star.col - 1);
        (0, assert_1.default)(starIndex >= 0 && starIndex < this.puzzle.rows * this.puzzle.cols, "star index out of bounds");
        return starIndex;
    }
    /**
     * client attempts to place a star on the board
     *
     * @param star the Point object representing the star where you want to place the star
     *             REQUIRE: each input star's region must be correctly assigned/consistent with the puzzle
     * @throws error if the star's position is out of bounds
     * @returns true if this board is not solved and star is not already added onto the board,
     *          and can be added without violating the rules that each row, column and region only has maximum 2 stars
     *          false otherwise
     */
    addStar(star) {
        this.checkRep();
        if (this.isSolved()) {
            return false;
        }
        const starIndex = this.getIndex(star);
        const neighbors = [
            starIndex,
            starIndex - this.puzzle.cols,
            starIndex + this.puzzle.cols,
        ];
        for (const n of neighbors) {
            if (this.starsIndices.has(n)) {
                //has vertical neighbors
                return false;
            }
            if (this.starsIndices.has(n - 1) && star.col !== 1) {
                //for left most column only check vertical and right side neighbors
                return false;
            }
            if (this.starsIndices.has(n + 1) && star.col !== this.puzzle.cols) {
                //for right most column only check vertical and left side neighbors
                return false;
            }
        }
        let rowCount = 0;
        let colCount = 0;
        let regionCount = 0;
        for (const [index, pt] of this.starsMap) {
            if (star.row === pt.row) {
                rowCount += 1;
            }
            if (star.col === pt.col) {
                colCount += 1;
            }
            if (star.region === pt.region) {
                regionCount += 1;
            }
        }
        if (rowCount > 2 || colCount > 2 || regionCount > 2) {
            throw new Error("there are already more than 2 stars in this row, col, region");
        }
        else if (rowCount < 2 && colCount < 2 && regionCount < 2) {
            this.starsMap.set(starIndex, star);
            this.starsIndices.add(starIndex);
            this.checkRep();
            return true;
        }
        return false;
    }
    /**
     * client attempts to remove a star from the board
     *
     * @param star the Point object representing the star client wants to remove
     *            REQUIRE: each star's region must be correctly assigned/consistent with the puzzle
     * @throws error if the star's position is out of bounds
     * @returns true if a Point object representing the exits and has been removed, false other wise
     */
    removeStar(star) {
        this.checkRep();
        const starIndex = this.getIndex(star);
        if (this.starsIndices.has(starIndex)) {
            this.starsIndices.delete(starIndex);
            this.starsMap.delete(starIndex);
            this.checkRep();
            return true;
        }
        return false;
    }
    /**
     * get the number of star the client has successfully placed
     *
     * @returns the number of stars the client has added to the board
     */
    placedNum() {
        this.checkRep();
        return this.starsIndices.size;
    }
    /**
     * check if this client has successfully solved the puzzle
     *
     * @returns true if this puzzle is solved false otherwise
     */
    isSolved() {
        this.checkRep();
        const placed = [];
        for (const pt of this.starsMap.values()) {
            placed.push(pt);
        }
        return this.puzzle.isSolution(new Set(placed));
    }
}
exports.Client = Client;
//# sourceMappingURL=Client.js.map