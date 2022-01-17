import assert from "assert";
import { Parser, ParseTree, compile, visualizeAsUrl } from "parserlib";
import { Point, Puzzle } from "./Puzzle";

const grammar: string = `
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
enum PuzzleGrammar {
    Puzzle,
    Dimension,
    Solution,
    Region,
    RegionSpaces,
    Square,
    Number,
    whitespace,
    Comments,
}

// compile the grammar into a parser
const parser: Parser<PuzzleGrammar> = compile(grammar, PuzzleGrammar, PuzzleGrammar.Puzzle);

/**
 * Parse a string into a puzzle object.
 * 
 * @param input string to parse
 * @returns Puzzle object parsed from the string
 * @throws ParseError if the string doesn't match the Expression grammar
 */
export function parsePuzzle(input: string): Puzzle {
    // parse the example into a parse tree
    const parseTree: ParseTree<PuzzleGrammar> = parser.parse(input);

    // Get dimensions
    const dimensions: Array<ParseTree<PuzzleGrammar>> = parseTree.childrenByName(PuzzleGrammar.Dimension);

    const rowsText = dimensions[0]?.childrenByName(PuzzleGrammar.Number)[0]?.text;
    const columnsText = dimensions[0]?.childrenByName(PuzzleGrammar.Number)[1]?.text;
    assert(rowsText !== undefined && columnsText !== undefined);
    
    // Get regions
    const regionsParsed: Array<ParseTree<PuzzleGrammar>> = parseTree.childrenByName(PuzzleGrammar.Region);

    const regions: Map<number, Set<Point>> = new Map();
    const solutions: Set<Point> = new Set();
    for (const [regionNumber, regionParsed] of regionsParsed.entries()) {
        const solutionsParsed = regionParsed?.childrenByName(PuzzleGrammar.Solution)[0]?.childrenByName(PuzzleGrammar.Square);
        const regionSpacesParsed = regionParsed?.childrenByName(PuzzleGrammar.RegionSpaces)[0]?.childrenByName(PuzzleGrammar.Square);
        assert(solutionsParsed !== undefined && regionSpacesParsed !== undefined);

        for (const solution of solutionsParsed) {
            const row = solution.childrenByName(PuzzleGrammar.Number)[0]?.text;
            const column = solution.childrenByName(PuzzleGrammar.Number)[1]?.text;
            assert(row !== undefined && column !== undefined);
            solutions.add(new Point(parseInt(row), parseInt(column), regionNumber));
            if (regions.has(regionNumber)) {
                regions.get(regionNumber)?.add(new Point(parseInt(row), parseInt(column), regionNumber));
            } else {
                regions.set(regionNumber, new Set([new Point(parseInt(row), parseInt(column), regionNumber)]));
            }
        }

        for (const regionSpace of regionSpacesParsed) {
            const row = regionSpace.childrenByName(PuzzleGrammar.Number)[0]?.text;
            const column = regionSpace.childrenByName(PuzzleGrammar.Number)[1]?.text;
            assert(row !== undefined && column !== undefined);
            if (regions.has(regionNumber)) {
                regions.get(regionNumber)?.add(new Point(parseInt(row), parseInt(column), regionNumber));
            } else {
                regions.set(regionNumber, new Set([new Point(parseInt(row), parseInt(column), regionNumber)]));
            }
        }
    }

    return new Puzzle(
        parseInt(rowsText),
        parseInt(columnsText),
        regions,
        solutions
    );
}