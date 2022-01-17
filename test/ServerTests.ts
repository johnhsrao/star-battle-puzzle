import assert from 'assert';
import { describe, it } from 'mocha';
import * as parserlib from 'parserlib';
import { StarbServer } from '../src/StarbServer';
import HttpStatus from 'http-status-codes';
import fs from 'fs';
import fetch from 'node-fetch';
import { async } from 'q';

describe('web server tests', function() {
    /**
     * Testing strategy
     *      unit tests:
     *          port should always be 8789
     * 
     *          invalid request address
     * 
     *          initialize/puzzleName:
     *              valid puzzle name (filename exists in puzzles directory)
     *              invalid puzzle name (filename does not exist in puzzles directory)
     *          puzzleList:
     *                 make sure every response contains all files in puzzles directory
     *       Manual Tests:
     *          localhost:8789/play
     *               partition on play loading valid html page
     *                  1) run npm run watchify-client
     *                  2) run npm run server
     *                  3) navigate to localhost/8789
     *                  4) make sure /play loads all html elements correctly according to
     *                      starb-client.html
     *                  5) make sure the blank puzzle is loaded correctly
     *          see IntegrationTests.ts for more testing of whole system and manual tests
     */

    it("covers response for initialize if puzzleName is not in directory, port should be 8789", async function() {
        const server = new StarbServer(8789);
        await server.start();
        assert.strictEqual(server.port, 8789);
        const url: string = 'http://localhost:8789/initialize/puzzle.starb';
        const response = await fetch(url);
        assert.strictEqual(response.status, HttpStatus.NOT_FOUND);
        server.stop();
    });
    it("covers response for invalid request", async function() {
        const server = new StarbServer(8789);
        await server.start();
        assert.strictEqual(server.port, 8789);
        const url: string = 'http://localhost:8789/starb';
        const response = await fetch(url);
        assert.strictEqual(response.status, HttpStatus.NOT_FOUND);
        server.stop();
    });
    it("covers response for initialize if puzzleName is in directory, port should be 8789", async function() {
        const server = new StarbServer(8789);
        await server.start();
        assert.strictEqual(server.port, 8789);
        const url: string = 'http://localhost:8789/initialize/kd-1-1-1.starb';
        const response = await fetch(url);
        assert.strictEqual(response.status, HttpStatus.OK);
        const responseBuffer = await fs.promises.readFile('puzzles/kd-1-1-1.starb');
        const text: string = await response.text();
        assert.strictEqual(responseBuffer.toString(), text);
        server.stop();
    });
    it('covers response for puzzleList should be all files in puzzles directory, port should be 8789', async function () {
        const server = new StarbServer(8789);
        await server.start();
        assert.strictEqual(server.port, 8789);
        const url: string = 'http://localhost:8789/puzzlelist';
        const response = await fetch(url);
        const filesResponse: JSON = await response.json();
        const allPuzzles = await fs.promises.readdir('puzzles/');
        assert.deepStrictEqual(allPuzzles, filesResponse);
        server.stop();
    });
});