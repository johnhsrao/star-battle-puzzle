/* Copyright (c) 2021 MIT 6.031 course staff, all rights reserved.
 * Redistribution of original or derived work requires permission of course staff.
 */

import assert from 'assert';
import { describe, it } from 'mocha';
import * as parserlib from 'parserlib';

describe('ParserLib version', function () {

    it('parserlib needs to be version 3.2.x', function() {
        assert(parserlib.VERSION.startsWith("3.2"));
    });
});
