"use strict";
/* Copyright (c) 2021 MIT 6.031 course staff, all rights reserved.
 * Redistribution of original or derived work requires permission of course staff.
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StarbServer = void 0;
const assert_1 = __importDefault(require("assert"));
const express_1 = __importDefault(require("express"));
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
/**
 * HTTP web game server.
 *
 */
class StarbServer {
    // Abstraction function:
    //   AF(port): A server <Server> running Application <app> running at port <port>
    // Representation invariant:
    //   true
    // Safety from rep exposure:
    //   requestedPort, and app are private and readonly. server is never returned to the client or set to a mutable value from the client.
    /**
     * Make a new web game server using board that listens for connections on port.
     *
     * @param requestedPort server port number
     */
    constructor(requestedPort) {
        this.requestedPort = requestedPort;
        this.app = (0, express_1.default)();
        this.app.use((request, response, next) => {
            // allow requests from web pages hosted anywhere
            response.set('Access-Control-Allow-Origin', '*');
            next();
        });
        this.app.use(express_1.default.static(path_1.default.join(__dirname, '..', '..')));
        /*
         * Handle a request for /play by serving the static html file, and loading a blank puzzle
         */
        this.app.get('/play', async function (request, response) {
            response.sendFile(path_1.default.join(__dirname, '..', '..', 'starb-client.html'));
        });
        /*
         * Handle a request for /puzzlelist by returning a list of files in the /puzzles directory
         */
        this.app.get('/puzzlelist', async function (request, response) {
            const files = await fs_1.default.promises.readdir('puzzles/');
            response
                .type('json')
                .status(http_status_codes_1.default.OK)
                .send(files);
        });
        /*
         * Handle a request for /initialize/<puzzleName> by sending the text from the file "puzzles/<puzzleName>
            if puzzles exists in the puzzles directory, else send 404 error indicating puzzle could not be found
         */
        this.app.get('/initialize/:puzzleName', async function (request, response) {
            const file = request.params.puzzleName ?? assert_1.default.fail();
            if (fs_1.default.existsSync('puzzles/'.concat(file))) {
                const buffer = await fs_1.default.promises.readFile('puzzles/'.concat(file));
                response
                    .type('text')
                    .status(http_status_codes_1.default.OK)
                    .send(buffer.toString());
            }
            else {
                response
                    .type('text')
                    .status(http_status_codes_1.default.NOT_FOUND)
                    .send('cannot find file');
            }
        });
    }
    /**
     * Start this server.
     *
     * @returns (a promise that) resolves when the server is listening
     */
    start() {
        return new Promise(resolve => {
            this.server = this.app.listen(this.requestedPort, () => {
                console.log('server now listening at', this.port);
                resolve();
            });
        });
    }
    /**
     * @returns the actual port that server is listening at. (May be different
     *          than the requestedPort used in the constructor, since if
     *          requestedPort = 0 then an arbitrary available port is chosen.)
     *          Requires that start() has already been called and completed.
     */
    get port() {
        const address = this.server?.address() ?? 'not connected';
        if (typeof (address) === 'string') {
            throw new Error('server is not listening at a port');
        }
        return address.port;
    }
    /**
     * Stop this server. Once stopped, this server cannot be restarted.
     */
    stop() {
        this.server?.close();
        console.log('server stopped');
    }
}
exports.StarbServer = StarbServer;
/**
 * Start a server that serves puzzles from the `puzzles` directory
 * on localhost:8789.
 *
 * @throw Error if unable to parse a file or start a server
 */
async function main() {
    const port = 8789;
    const server = new StarbServer(port);
    await server.start();
}
if (require.main === module) {
    main();
}
//# sourceMappingURL=StarbServer.js.map