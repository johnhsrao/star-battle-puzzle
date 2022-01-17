/* Copyright (c) 2021 MIT 6.031 course staff, all rights reserved.
 * Redistribution of original or derived work requires permission of course staff.
 */

// this code is loaded into example-page.html

import assert from 'assert';

const BOX_SIZE = 16;

// categorical colors from
// https://github.com/d3/d3-scale-chromatic/tree/v2.0.0#schemeCategory10
const COLORS: Array<string> = [
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

// semitransparent versions of those colors
const BACKGROUNDS = COLORS.map( (color) => color + '60' );

// /**
//  * Draw a black square filled with a random color.
//  * @param canvas canvas to draw on
//  * @param x x position of center of box
//  * @param y y position of center of box
//  */
// function drawBox(canvas: HTMLCanvasElement, x: number, y: number): void {
//     const context = canvas.getContext('2d');
//     assert(context, 'unable to get canvas drawing context');

//     console.log(context.save);
    
//     // save original context settings before we translate and change colors
//     context.save();

//     // translate the coordinate system of the drawing context:
//     //   the origin of `context` will now be (x,y)
//     context.translate(x, y);

//     // draw the outer outline box centered on the origin (which is now (x,y))
//     context.strokeStyle = 'black';
//     context.lineWidth = 2;
//     context.strokeRect(-BOX_SIZE/2, -BOX_SIZE/2, BOX_SIZE, BOX_SIZE);

//     // fill with a random semitransparent color
//     context.fillStyle = BACKGROUNDS[Math.floor(Math.random() * BACKGROUNDS.length)] ?? assert.fail();
//     context.fillRect(-BOX_SIZE/2, -BOX_SIZE/2, BOX_SIZE, BOX_SIZE);

//     // reset the origin and styles back to defaults
//     context.restore();
// }

// /**
//  * Print a message by appending it to an HTML element.
//  * @param outputArea HTML element that should display the message
//  * @param message message to display
//  */
// function printOutput(outputArea: HTMLElement, message: string): void {
//     // append the message to the output area
//     outputArea.innerText += message + '\n';

//     // scroll the output area so that what we just printed is visible
//     outputArea.scrollTop = outputArea.scrollHeight;
// }

// /**
//  * Set up the example page.
//  */
// function main() {
    
//     // output area for printing
//     const outputArea: HTMLElement = document.getElementById('outputArea') ?? assert.fail('missing output area');
//     // canvas for drawing
//     const canvas: HTMLCanvasElement = document.getElementById('canvas') as HTMLCanvasElement ?? assert.fail('missing drawing canvas');
    
//     // when the user clicks on the drawing canvas...
//     canvas.addEventListener('click', (event: MouseEvent) => {
//         drawBox(canvas, event.offsetX, event.offsetY);
//         printOutput(outputArea, `clicked ` + event.offsetX + ' , ' + event.offsetY);
//     });

//     // add initial instructions to the output area
//     printOutput(outputArea, `Click in the canvas above to draw a box centered at that point`);
// }

//jhsrao iter0
//comment lines 29-91 and uncomment lines 97-227 then run npm watchify-example to load this drawing prototype in example-page.html

async function getPuzzleList() {
    const response = await fetch(
        window.location.protocol + '//' + window.location.host + '/puzzlelist'
    );
    return await response.json();
}

async function getPuzzle(puzzleName: string) {
    const response = await fetch(
        window.location.protocol + '//' + window.location.host + '/initialize/' + puzzleName
    );
    return await response.text();
}

/**
 * Draw the blank puzzle in kd-1-1-1.starb where each reagion filled with a different color.
 * @param canvas canvas to draw on
 * @param o_x x coordinate of the top left corner of the puzzle
 * @param o_y y coordinate of the top left corner of the puzzle
 */
function drawBlankPuzzle(canvas: HTMLCanvasElement, o_x:number, o_y:number): void {
    console.log("drawing puzzle");
    const regions:Array<Array<Array<number>>> = [
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
    
    for(let i = 0; i < regions.length; ++i){
        const currRegion = regions[i];
        assert(currRegion !== undefined, "region must be defined");
        const color = BACKGROUNDS[i] ?? assert.fail();
        for(const box of currRegion){
            const indX = box[0];
            const indY = box[1];
            assert(indX !== undefined && indY !== undefined, "box positions must be defined");
            const x = o_x + (indX-1)*BOX_SIZE + BOX_SIZE/2;
            const y = o_y + (indY-1)*BOX_SIZE + BOX_SIZE/2;
            //for some reasonn the x and y are flipped when loaded
            //y = horizontal axis, x = vertical axis
            drawBox(canvas, y, x, color);
        }
    }
}

/**
 * Draw a black square filled with a specified color.
 * @param canvas canvas to draw on
 * @param x x position of center of box
 * @param y y position of center of box
 */
function drawBox(canvas: HTMLCanvasElement, x: number, y: number, color:string): void {
    const context = canvas.getContext('2d');
    assert(context, 'unable to get canvas drawing context');
    console.log(context.save);
    // save original context settings before we translate and change colors
    context.save();
    // translate the coordinate system of the drawing context:
    //   the origin of `context` will now be (x,y)
    context.translate(x, y);
    // draw the outer outline box centered on the origin (which is now (x,y))
    context.strokeStyle = 'black';
    context.lineWidth = 1;
    context.strokeRect(-BOX_SIZE/2, -BOX_SIZE/2, BOX_SIZE, BOX_SIZE);
    // fill with a random semitransparent color
    context.fillStyle = color;
    context.fillRect(-BOX_SIZE/2, -BOX_SIZE/2, BOX_SIZE, BOX_SIZE);
    // reset the origin and styles back to defaults
    context.restore();
}

/**
 * Draw a star at specified position
 * Note that this prototype does NOT account for the game rules
 * (a star can be drawn any where on the canvas including between gridss AND outside the puzzle)
 * 
 * @param canvas canvas to draw on
 * @param x x position of center of the star
 * @param y y position of center of the star
 */
 function drawStar(canvas: HTMLCanvasElement, x: number, y: number): void {
    const context = canvas.getContext('2d');
    assert(context, 'unable to get canvas drawing context');
    console.log(context.save);
    // save original context settings before we translate and change colors
    context.save();
    // translate the coordinate system of the drawing context:
    //   the origin of `context` will now be (x,y)
    context.translate(x, y);
    context.font = '10px serif';
    context.fillText('🌟', -5, 5);

    //reset the origin and styles back to defaults
    context.restore()
}

/**
 * Print a message by appending it to an HTML element.
 * @param outputArea HTML element that should display the message
 * @param message message to display
 */
function printOutput(outputArea: HTMLElement, message: string): void {
    // append the message to the output area
    outputArea.innerText += message + '\n';

    // scroll the output area so that what we just printed is visible
    outputArea.scrollTop = outputArea.scrollHeight;
}

/**
 * Set up the example page.
 */
function main() {
    const puzzleInput: HTMLSelectElement = document.getElementById('puzzleInput') as HTMLSelectElement ?? assert.fail('Missing puzzle input');
    getPuzzleList().then((data)=>{
        for (const fileName of data) {
            const option: HTMLOptionElement = document.createElement("option");
            option.value = fileName;
            option.text = fileName;
            puzzleInput.appendChild(option);
        }
    }).catch((err) => {
        throw err
    })
    const puzzleSubmit: HTMLElement = document.getElementById('puzzleSubmit') ?? assert.fail('Missing puzzle input');
    puzzleSubmit.addEventListener('click', async (event: Event)=>{
        // load puzzle
        const puzzleText = await getPuzzle(puzzleInput.value);
        console.log(puzzleText)
    })
    
    // output area for printing
    const outputArea: HTMLElement = document.getElementById('outputArea') ?? assert.fail('missing output area');
    // canvas for drawing
    const canvas: HTMLCanvasElement = document.getElementById('canvas') as HTMLCanvasElement ?? assert.fail('missing drawing canvas');
    let drawnPuzzle = false;
    // when the user clicks on the drawing canvas...
    canvas.addEventListener('click', (event: MouseEvent) => {
        if(!drawnPuzzle){
            getPuzzle('starb')
            //first time click draws the puzzle
            drawBlankPuzzle(canvas, event.offsetY, event.offsetX);
            //for some reasonn the x and y are flipped when loaded
            //y = horizontal axis, x = vertical axis
            printOutput(outputArea, `drew a blank puzzle at ` + event.offsetX + ',' + event.offsetY);
            drawnPuzzle = true;
            printOutput(outputArea, `Click in a square to place a star`);
        }
        else{
            drawStar(canvas, event.offsetX, event.offsetY);
            printOutput(outputArea, `drew a star at ` + event.offsetX + ',' + event.offsetY);
            printOutput(outputArea, `Click in a square to place another star`);
        }
    });
    printOutput(outputArea, `Click in the canvas to start a puzzle`);
}

main();

