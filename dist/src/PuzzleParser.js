"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.parsePuzzle = void 0;
const assert_1 = __importDefault(require("assert"));
const parserlib_1 = require("parserlib");
const Puzzle_1 = require("./Puzzle");
const grammar = `
@skip comments {
    puzzle ::= whitespace* dimension (whitespace region)* whitespace*;
}
dimension ::= number 'x' number;
region ::= solution '|' regionSpaces;
solution ::= square whitespace square whitespace;
regionSpaces ::= ([ ]+ square)+;
square ::= number ',' number;
number ::= [0-9]+;
whitespace ::= [ \\t\\r\\n]+;
comments ::= whitespace? '#' [^\\n]* whitespace;
`;
// the nonterminals of the grammar
var PuzzleGrammar;
(function (PuzzleGrammar) {
    PuzzleGrammar[PuzzleGrammar["Puzzle"] = 0] = "Puzzle";
    PuzzleGrammar[PuzzleGrammar["Dimension"] = 1] = "Dimension";
    PuzzleGrammar[PuzzleGrammar["Solution"] = 2] = "Solution";
    PuzzleGrammar[PuzzleGrammar["Region"] = 3] = "Region";
    PuzzleGrammar[PuzzleGrammar["RegionSpaces"] = 4] = "RegionSpaces";
    PuzzleGrammar[PuzzleGrammar["Square"] = 5] = "Square";
    PuzzleGrammar[PuzzleGrammar["Number"] = 6] = "Number";
    PuzzleGrammar[PuzzleGrammar["whitespace"] = 7] = "whitespace";
    PuzzleGrammar[PuzzleGrammar["Comments"] = 8] = "Comments";
})(PuzzleGrammar || (PuzzleGrammar = {}));
// compile the grammar into a parser
const parser = (0, parserlib_1.compile)(grammar, PuzzleGrammar, PuzzleGrammar.Puzzle);
/**
 * Parse a string into a puzzle object.
 *
 * @param input string to parse
 * @returns Puzzle object parsed from the string
 * @throws ParseError if the string doesn't match the Expression grammar
 */
function parsePuzzle(input) {
    // parse the example into a parse tree
    const parseTree = parser.parse(input);
    // Get dimensions
    const dimensions = parseTree.childrenByName(PuzzleGrammar.Dimension);
    const rowsText = dimensions[0]?.childrenByName(PuzzleGrammar.Number)[0]?.text;
    const columnsText = dimensions[0]?.childrenByName(PuzzleGrammar.Number)[1]?.text;
    (0, assert_1.default)(rowsText !== undefined && columnsText !== undefined);
    // Get regions
    const regionsParsed = parseTree.childrenByName(PuzzleGrammar.Region);
    const regions = new Map();
    const solutions = new Set();
    for (const [regionNumber, regionParsed] of regionsParsed.entries()) {
        const solutionsParsed = regionParsed?.childrenByName(PuzzleGrammar.Solution)[0]?.childrenByName(PuzzleGrammar.Square);
        const regionSpacesParsed = regionParsed?.childrenByName(PuzzleGrammar.RegionSpaces)[0]?.childrenByName(PuzzleGrammar.Square);
        (0, assert_1.default)(solutionsParsed !== undefined && regionSpacesParsed !== undefined);
        for (const solution of solutionsParsed) {
            const row = solution.childrenByName(PuzzleGrammar.Number)[0]?.text;
            const column = solution.childrenByName(PuzzleGrammar.Number)[1]?.text;
            (0, assert_1.default)(row !== undefined && column !== undefined);
            solutions.add(new Puzzle_1.Point(parseInt(row), parseInt(column), regionNumber));
            if (regions.has(regionNumber)) {
                regions.get(regionNumber)?.add(new Puzzle_1.Point(parseInt(row), parseInt(column), regionNumber));
            }
            else {
                regions.set(regionNumber, new Set([new Puzzle_1.Point(parseInt(row), parseInt(column), regionNumber)]));
            }
        }
        for (const regionSpace of regionSpacesParsed) {
            const row = regionSpace.childrenByName(PuzzleGrammar.Number)[0]?.text;
            const column = regionSpace.childrenByName(PuzzleGrammar.Number)[1]?.text;
            (0, assert_1.default)(row !== undefined && column !== undefined);
            if (regions.has(regionNumber)) {
                regions.get(regionNumber)?.add(new Puzzle_1.Point(parseInt(row), parseInt(column), regionNumber));
            }
            else {
                regions.set(regionNumber, new Set([new Puzzle_1.Point(parseInt(row), parseInt(column), regionNumber)]));
            }
        }
    }
    return new Puzzle_1.Puzzle(parseInt(rowsText), parseInt(columnsText), regions, solutions);
}
exports.parsePuzzle = parsePuzzle;
//# sourceMappingURL=PuzzleParser.js.map