"use strict";
/* Copyright (c) 2021 MIT 6.031 course staff, all rights reserved.
 * Redistribution of original or derived work requires permission of course staff.
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// this code is loaded into starb-client.html
const assert_1 = __importDefault(require("assert"));
const Puzzle_1 = require("./Puzzle");
const Client_1 = require("./Client");
const PuzzleParser_1 = require("./PuzzleParser");
/**
 * Puzzle to request and play.
 * Project instructions: this constant is a [for now] requirement in the project spec.
 */
const PUZZLE = "kd-1-1-1.starb";
const COLORS = [
    '#1f77b4',
    '#ff7f0e',
    '#2ca02c',
    '#d62728',
    '#9467bd',
    '#8c564b',
    '#e377c2',
    '#7f7f7f',
    '#bcbd22',
    '#17becf',
];
const BACKGROUNDS = COLORS.map((color) => color + '95');
const BOX_SIZE = 25.6;
// The current client
let client = undefined;
// Map of boxes drawn on the array to their row/col points in the puzzle
let elements = new Map();
/**
 * Immutable ADT to represent a location on the canvas
 */
class Coords {
    // Abstraction function
    //    AF(x, y) = the pixel on the canvas with x coordinate <x> and y coordinate <y>
    // Rep invariant
    //   true
    // Safety from rep exposure
    //    -all fields are immutable and readonly
    /**
     *
     * @param x x coordinate of this location
     * @param y y coordinate of this location
     */
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}
/**
 * Draw the blank puzzle in kd-1-1-1.starb where each reagion filled with a different color.
 * @param canvas canvas to draw on
 * @param o_x x coordinate of the top left corner of the puzzle
 * @param o_y y coordinate of the top left corner of the puzzle
 * @param puzzle the puzzle to draw
 */
function drawBlankPuzzle(canvas, o_x, o_y, puzzle) {
    let regions = [];
    for (let i = 0; i < puzzle.rows; ++i) {
        const points = puzzle.getRegion(i);
        const regionPoints = [];
        for (const point of points) {
            regionPoints.push([point.row, point.col]);
        }
        regions.push(regionPoints);
    }
    for (let i = 0; i < regions.length; ++i) {
        const currRegion = regions[i];
        (0, assert_1.default)(currRegion !== undefined, "region must be defined");
        const color = BACKGROUNDS[i] ?? assert_1.default.fail();
        for (const box of currRegion) {
            const row = box[0];
            const col = box[1];
            (0, assert_1.default)(row !== undefined && col !== undefined, "box positions must be defined");
            const y = o_x + (row - 1) * BOX_SIZE + BOX_SIZE / 2;
            const x = o_y + (col - 1) * BOX_SIZE + BOX_SIZE / 2;
            elements.set(new Coords(x, y), new Puzzle_1.Point(row, col, i));
            drawBox(canvas, x, y, color);
        }
    }
}
/**
 * Erase everything on the canvas
 * @param canvas Canvas that the puzzle is drawn on
 */
function clearCanvas(canvas) {
    const context = canvas.getContext('2d');
    (0, assert_1.default)(context, 'unable to get canvas drawing context');
    context.clearRect(0, 0, canvas.width, canvas.height);
}
/**
 * Draw a square filled with a specified color representing a blank space on the puzzle
 * @param canvas canvas to draw on
 * @param x x position of center of box
 * @param y y position of center of box
 * @param color the color of the square
 */
function drawBox(canvas, x, y, color) {
    const context = canvas.getContext('2d');
    (0, assert_1.default)(context, 'unable to get canvas drawing context');
    // save original context settings before we translate and change colors
    context.save();
    // translate the coordinate system of the drawing context:
    //   the origin of `context` will now be (x,y)
    context.translate(x, y);
    // draw the outer outline box centered on the origin (which is now (x,y))
    context.strokeStyle = 'black';
    context.lineWidth = 1;
    context.strokeRect(-BOX_SIZE / 2, -BOX_SIZE / 2, BOX_SIZE, BOX_SIZE);
    // fill with a random semitransparent color
    context.fillStyle = color;
    context.fillRect(-BOX_SIZE / 2, -BOX_SIZE / 2, BOX_SIZE, BOX_SIZE);
    // reset the origin and styles back to defaults
    context.restore();
}
/**
 * Draw a star at specified position
 * Note that this function does NOT account for the game rules
 * (a star can be drawn any where on the canvas including between gridss AND outside the puzzle)
 *
 * @param canvas canvas to draw on
 * @param x x position of center of the star
 * @param y y position of center of the star
 */
function drawStar(canvas, x, y) {
    const context = canvas.getContext('2d');
    (0, assert_1.default)(context, 'unable to get canvas drawing context');
    // save original context settings before we translate and change colors
    context.save();
    // translate the coordinate system of the drawing context:
    //   the origin of `context` will now be (x,y)
    context.translate(x, y);
    context.font = '10px serif';
    context.fillText('🌟', -6, 5);
    //reset the origin and styles back to defaults
    context.restore();
}
/**
 * Print a message by appending it to an HTML element.
 * @param outputArea HTML element that should display the message
 * @param message message to display
 */
function printOutput(outputArea, message) {
    // append the message to the output area
    outputArea.innerText += message + '\n';
    // scroll the output area so that what we just printed is visible
    outputArea.scrollTop = outputArea.scrollHeight;
}
/**
 * Get a list of puzzles in the puzzle directory on the server
 *
 * @returns list of possible puzzle file names
 */
async function getPuzzleList() {
    const response = await fetch(window.location.protocol + '//' + window.location.host + '/puzzlelist');
    return await response.json();
}
/**
 * Gets puzzle text from server
 *
 * @param puzzleName the name of the puzzle file
 * @returns the (promise of) Puzzle object representing the puzzle requested
 */
async function getPuzzle(puzzleName) {
    const response = await fetch(window.location.protocol + '//' + window.location.host + '/initialize/' + puzzleName);
    return (0, PuzzleParser_1.parsePuzzle)(await response.text());
}
/**
 * Load a puzzle
 *
 * @param puzzleName name of puzzle to load from server
 * @param output HTML element that should display the message
 */
async function loadPuzzle(canvas, output, puzzleName) {
    clearCanvas(canvas);
    const puzzle = await getPuzzle(puzzleName);
    client = new Client_1.Client(puzzle);
    // RESET STATE
    canvas.classList.remove('spinningmedium');
    canvas.classList.remove('spinninghard');
    canvas.classList.remove('spinninginsane');
    canvas.classList.remove('expanding');
    elements = new Map();
    drawBlankPuzzle(canvas, 0, 0, puzzle);
    printOutput(output, "STARTING A NEW PUZZLE!!");
}
/**
 * Every time the canvas is clicked, handle the click and place or remove star at the clicked box.
 * If the puzzle is solved, play animation and disable user interaction with the board.
 *
 * @param canvas Canvas element where the puzzle is drawn
 * @param output HTML element that should display the prompt message
 * @param event Mouse event
 */
function canvasListener(canvas, output, event) {
    if (client !== undefined) {
        const x = event.offsetX;
        const y = event.offsetY;
        // Collision detection between click location and puzzle boxes.
        elements.forEach(function (point, element) {
            if (x < element.x + BOX_SIZE / 2 && x > element.x - BOX_SIZE / 2
                && y < element.y + BOX_SIZE / 2 && y > element.y - BOX_SIZE / 2) {
                // ATTEMPT TO PLACE/REMOVE STAR
                (0, assert_1.default)(client !== undefined);
                if (client.removeStar(point)) {
                    const context = canvas.getContext('2d') ?? assert_1.default.fail();
                    context.clearRect(element.x - BOX_SIZE / 2, element.y - BOX_SIZE / 2, BOX_SIZE, BOX_SIZE);
                    printOutput(output, "Removed a star from " + point.row + "," + point.col);
                    drawBox(canvas, element.x, element.y, BACKGROUNDS[point.region] ?? assert_1.default.fail());
                }
                else if (client.addStar(point)) {
                    drawStar(canvas, element.x, element.y);
                    printOutput(output, "Added a star to " + point.row + "," + point.col);
                    if (client.isSolved()) {
                        printOutput(output, "CONGRATULATIONS!! YOU SOLVED THIS PUZZLE!!");
                        canvas.classList.add('expanding');
                        elements = new Map();
                    }
                }
                else {
                    printOutput(output, "Cannot add a star to " + point.row + "," + point.col);
                }
            }
        });
    }
}
/**
 * Set up the page.
 */
function main() {
    const canvas = document.getElementById('canvas') ?? assert_1.default.fail('missing drawing canvas');
    const outputArea = document.getElementById('outputArea') ?? assert_1.default.fail('missing output area');
    canvas.addEventListener('click', (event) => canvasListener(canvas, outputArea, event));
    // output area for printing
    const puzzleInput = document.getElementById('puzzleInput') ?? assert_1.default.fail('Missing puzzle input');
    const puzzleDifficulty = document.getElementById('puzzleDifficulty') ?? assert_1.default.fail('Missing puzzle input');
    // Load puzzle list from server into the puzzle select box
    getPuzzleList().then((data) => {
        for (const fileName of data) {
            const option = document.createElement("option");
            option.value = fileName;
            option.text = fileName;
            puzzleInput.appendChild(option);
        }
    }).catch((err) => {
        throw err;
    });
    const puzzleSubmit = document.getElementById('puzzleSubmit') ?? assert_1.default.fail('Missing puzzle input');
    // Add listener for when the "Load" button is clicked
    puzzleSubmit.addEventListener('click', async (event) => {
        // load puzzle
        await loadPuzzle(canvas, outputArea, puzzleInput.value);
        // set difficulty
        switch (puzzleDifficulty.value) {
            case "medium":
                canvas.classList.add('spinningmedium');
                break;
            case "hard":
                canvas.classList.add('spinninghard');
                break;
            case "insane":
                canvas.classList.add('spinninginsane');
                break;
        }
    });
    // At first, load default puzzle
    loadPuzzle(canvas, outputArea, PUZZLE);
}
main();
//# sourceMappingURL=StarbClient.js.map