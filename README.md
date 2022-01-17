### Star Battle
### ⭐️⚔️

A Star Battle puzzle web game develop for Software Construction (6.031) final project. In a Star Battle Puzzle, a n x n grid is divided into n regions. To solve the puzzle, the player must find a placement of 2n stars such that each row, each column, and each region of the puzzle has exactly 2 stars, and no stars are vertically, horizontally, or diagonally adjacent. More tutorials on the puzzle can be found at https://krazydad.com/starbattle/.

## How to play star battle puzzle:
0. run `npm install`
1. `npm run watchify-client` to compile and bundle StarbClient.ts
2. `npm run server` to serve the starb-client.html on the server
3. then navigate to `http://localhost:8789/play` to play the puzzle following the instruction prompted.
    - By default, the server will load the puzzle with file name `PUZZLE` in `StarbClient.ts` by default, but you can change the current puzzle by using the first drop down menu and hitting 'load' on the web page. To play more puzzles, add puzzle files to `./puzzles`.
    - You can also change the difficulty of the loaded puzzle using the second drop down menu. This won't change the actual puzzle, but increasing the difficulty will make it harder to solve.
    - To change the default puzzle, you can change the file name assigned for `PUZZLE` in `StarbClient.ts`.
4. To place a star, click on the square you want to place it in. You will not be allowed to place a star when there are already two stars in the same row or column, or there is annother star adjacent. To place a star in a block space, you must remove the appropriate stars first 
5. To remove a star, click on an existing star.

## Directories:
1. All iter1 source code files are in `./src`
    - `src/ExamplePage.ts` => Drawing prototypes
    - `src/Puzzle.ts` => Puzzle ADT implementation
    - `src/Client.ts` => Client ADT implementation
    - `src/PuzzleParser.ts` => Parser implementation
    - `src/StarbServer.ts` => Web server implementation
    - `src/StarbClient.ts` => Drawing and interaction implementation
2. All iter1 tests are in `./test`
    - `test/ClientTests.ts` => automated tests for Client ADT
    - `test/PuzzleParserTests.ts` => automated tests for Puzzle ADT
    - `test/PuzzleTests.ts` => Puzzle ADT tests
    - `test/IntegrationTests.ts` => testing strategies for manual testing of the whole system
    - `test/ServerTests.ts` => automated tests and manual testing strategy for web server
3. client web page is loaded from `./starb-client.html`

