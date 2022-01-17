/* Copyright (c) 2021 MIT 6.031 course staff, all rights reserved.
 * Redistribution of original or derived work requires permission of course staff.
 */

import assert from 'assert';
import { Server } from 'http';
import express, { Application, json } from 'express';
import HttpStatus from 'http-status-codes';
import fs from 'fs';
import path from 'path';

/**
 * HTTP web game server.
 * 
 */

export class StarbServer {

    private readonly app: Application;
    private server: Server|undefined;

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
    public constructor(
        private readonly requestedPort: number
    ) {
        this.app = express();
        this.app.use((request, response, next) => {
            // allow requests from web pages hosted anywhere
            response.set('Access-Control-Allow-Origin', '*');
            next();
        });
        this.app.use(express.static(path.join(__dirname, '..', '..')))

        /*
         * Handle a request for /play by serving the static html file, and loading a blank puzzle
         */
        this.app.get('/play', async function(request, response) {
            response.sendFile(path.join(__dirname, '..', '..', 'starb-client.html'));
        });

        /*
         * Handle a request for /puzzlelist by returning a list of files in the /puzzles directory
         */
        this.app.get('/puzzlelist', async function(request, response) {
            const files = await fs.promises.readdir('puzzles/');
            response
            .type('json')
            .status(HttpStatus.OK)
            .send(files);
        });

        /*
         * Handle a request for /initialize/<puzzleName> by sending the text from the file "puzzles/<puzzleName>
            if puzzles exists in the puzzles directory, else send 404 error indicating puzzle could not be found
         */
        this.app.get('/initialize/:puzzleName', async function(request, response) {
            const file = request.params.puzzleName??assert.fail();
            if( fs.existsSync('puzzles/'.concat(file))) {
                const buffer = await fs.promises.readFile('puzzles/'.concat(file));
                response
                .type('text')
                .status(HttpStatus.OK)
                .send(buffer.toString());
            } else {
                response
                .type('text')
                .status(HttpStatus.NOT_FOUND)
                .send('cannot find file')
            }
        });
    }

    /**
     * Start this server.
     * 
     * @returns (a promise that) resolves when the server is listening
     */
    public start(): Promise<void> {
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
    public get port(): number {
        const address = this.server?.address() ?? 'not connected';
        if (typeof(address) === 'string') {
            throw new Error('server is not listening at a port');
        }
        return address.port;
    }

    /**
     * Stop this server. Once stopped, this server cannot be restarted.
     */
     public stop(): void {
        this.server?.close();
        console.log('server stopped');
    }
}

/**
 * Start a server that serves puzzles from the `puzzles` directory
 * on localhost:8789.
 * 
 * @throw Error if unable to parse a file or start a server
 */

async function main(): Promise<void> {
    const port = 8789;
    
    const server: StarbServer = new StarbServer(port);
    await server.start();
}

if (require.main === module) {
    main();
}
