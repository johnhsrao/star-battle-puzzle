"use strict";
/**
 * Testing strategy for intergation
 *
 *  partition on the state of the puzzle:
 *      -blank puzzle
 *      -puzzle with stars
 *      -solved puzzle
 *
 *  partition on the validity of the position to place star:
 *      -place a start at an invalid position:
 *          - in the same region where there are already 2 stars
 *          - in the same row where there are already 2 stars
 *          - in the same column where there are already 2 stars
 *          - adjacent to another star
 *          - outside the puzzle
 *          - in a solved puzzle
 *      -place a star at a valid position:
 *          - on a blank puzzle
 *          - on a partially solved puzzle
 *      -remove a star:
 *          - remove a placed star
 *
 *  partition on the difficulty of the puzzle: normal, medium, hard, insane
 */
/*
 * Manual tests: assert the blank puzzle is correctly served
 * Covers: blank puzzle from server
 * 1. browse to localhost: url to get a blank puzzle
 * 2. assert the blank puzzle returned by server is same as expected
 * 3. select a different puzzle from the drop down menu
 * 4. assert the new puzzle is the same as expected
 */
/*
 * Manual tests: assert puzzle state is correctly drawn
 * Covers: all partitions from above
 * 1. run npm run watchify-client
 * 2. run npm run server to start the server
 * 3. navigate to `http://localhost:8789/play` to start playing the puzzle
 * 4. Click in a square to place a star => assert the star is placed correctly
 * 5. Try placing a star next to the star you just placed => assert the action is rejected
 * 6. Place a non-adjacent star in the same row but different region as the previously placed star => assert the star is placed correctly
 * 7. Try placing another non-adjacent star randomly in the same row again => assert the action is rejected
 * 8. Place a non-adjacent star in the same region as one of the previously placed stars => assert the star is placed correctly
 * 9. Try placing another non-adjacent star in the same region => assert the action is rejected
 * 10. Place a non-adjacent star in a column that has only 1 star => assert the star is placed correctly
 * 11. Try placing another non-adjacent star in the same column => assert the action is rejected
 * 12. Try removing a star from this column by clicking on one of th stars => assert the star is removed
 * 13. Try placing a star in the same column => assert the star is placed correctly
 * 14. Try clicking outside the puzzle => assert nothing happens
 * 15. Select a puzzle from the drop down menu and click load => assert a blank puzzle is loaded correctly
 * 16. Fill in the solution for the selected puzzle => assert all stars are correctly placed
 * 17. Assert a celebratory animation is played
 * 18. Try placing another star => assert the action is rejected
 */
/*
 * Manual tests: assert the blank puzzle is correctly served
 * Covers: blank puzzle from server
 * 1. browse to localhost: url to get a blank puzzle
 * 2. assert the blank puzzle returned by server is same as expected
 * 3. select a different puzzle from the drop down menu
 * 4. assert the new puzzle is the same as expected
 */
/*
 * Manual tests: assert puzzle difficulties cause puzzle to spin at different speeds
 * Covers: all difficulties
 * 1. browse to localhost: url to get a blank puzzle
 * 2. in the drop down menu, select difficulty: medium
 * 3. click "load" and assert the new puzzle rotates clockwise slowly
 *
 * 4. select difficulty: hard
 * 5. click "load" and assert the new puzzle rotates clockwise at a medium speed
 *
 * 6. select difficulty: insane
 * 7. click "load" and assert the new puzzle rotates clockwise quickly
 *
 * 8. select difficulty: normal
 * 9. assert the spinning stops
 */ 
//# sourceMappingURL=IntegrationTests.js.map