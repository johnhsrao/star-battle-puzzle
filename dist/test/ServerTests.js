"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const assert_1 = __importDefault(require("assert"));
const mocha_1 = require("mocha");
const StarbServer_1 = require("../src/StarbServer");
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const fs_1 = __importDefault(require("fs"));
const node_fetch_1 = __importDefault(require("node-fetch"));
(0, mocha_1.describe)('web server tests', function () {
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
    (0, mocha_1.it)("covers response for initialize if puzzleName is not in directory, port should be 8789", async function () {
        const server = new StarbServer_1.StarbServer(8789);
        await server.start();
        assert_1.default.strictEqual(server.port, 8789);
        const url = 'http://localhost:8789/initialize/puzzle.starb';
        const response = await (0, node_fetch_1.default)(url);
        assert_1.default.strictEqual(response.status, http_status_codes_1.default.NOT_FOUND);
        server.stop();
    });
    (0, mocha_1.it)("covers response for invalid request", async function () {
        const server = new StarbServer_1.StarbServer(8789);
        await server.start();
        assert_1.default.strictEqual(server.port, 8789);
        const url = 'http://localhost:8789/starb';
        const response = await (0, node_fetch_1.default)(url);
        assert_1.default.strictEqual(response.status, http_status_codes_1.default.NOT_FOUND);
        server.stop();
    });
    (0, mocha_1.it)("covers response for initialize if puzzleName is in directory, port should be 8789", async function () {
        const server = new StarbServer_1.StarbServer(8789);
        await server.start();
        assert_1.default.strictEqual(server.port, 8789);
        const url = 'http://localhost:8789/initialize/kd-1-1-1.starb';
        const response = await (0, node_fetch_1.default)(url);
        assert_1.default.strictEqual(response.status, http_status_codes_1.default.OK);
        const responseBuffer = await fs_1.default.promises.readFile('puzzles/kd-1-1-1.starb');
        const text = await response.text();
        assert_1.default.strictEqual(responseBuffer.toString(), text);
        server.stop();
    });
    (0, mocha_1.it)('covers response for puzzleList should be all files in puzzles directory, port should be 8789', async function () {
        const server = new StarbServer_1.StarbServer(8789);
        await server.start();
        assert_1.default.strictEqual(server.port, 8789);
        const url = 'http://localhost:8789/puzzlelist';
        const response = await (0, node_fetch_1.default)(url);
        const filesResponse = await response.json();
        const allPuzzles = await fs_1.default.promises.readdir('puzzles/');
        assert_1.default.deepStrictEqual(allPuzzles, filesResponse);
        server.stop();
    });
});
//# sourceMappingURL=ServerTests.js.map