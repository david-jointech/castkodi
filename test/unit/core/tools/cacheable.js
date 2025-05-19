/**
 * @license MIT
 * @author Sébastien Règne
 */

import assert from "node:assert/strict";
import { mock } from "node:test";
import { cacheable } from "../../../../src/core/tools/cacheable.js";

describe("core/tools/cacheable.js", function () {
    afterEach(function () {
        mock.reset();
    });

    describe("cacheable()", function () {
        it("should call one times", function () {
            const func = mock.fn(() => "foo");
            const cached = cacheable(func);
            assert.deepEqual(
                Object.getOwnPropertyDescriptor(cached, "name"),
                Object.getOwnPropertyDescriptor(func, "name"),
            );

            assert.equal(cached(), "foo");
            assert.equal(cached(), "foo");

            assert.equal(func.mock.callCount(), 1);
        });

        it("should support arguments", function () {
            const func = mock.fn((...args) => JSON.stringify(args));
            const cached = cacheable(func);

            assert.equal(cached(true), "[true]");
            assert.equal(cached(1, 2), "[1,2]");
            assert.equal(cached(1, 2), "[1,2]");
            assert.equal(cached([1, 2]), "[[1,2]]");

            assert.equal(func.mock.callCount(), 3);
            assert.deepEqual(func.mock.calls[0].arguments, [true]);
            assert.deepEqual(func.mock.calls[1].arguments, [1, 2]);
            assert.deepEqual(func.mock.calls[2].arguments, [[1, 2]]);
        });
    });
});
