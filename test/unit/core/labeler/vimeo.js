/**
 * @module
 * @license MIT
 * @author Sébastien Règne
 */

import assert from "node:assert/strict";
import sinon from "sinon";
import * as labeler from "../../../../src/core/labeler/vimeo.js";

describe("core/labeler/vimeo.js", function () {
    describe("extract()", function () {
        it("shouldn't handle when it's a unsupported URL", async function () {
            const url = new URL("https://developer.vimeo.com/");

            const file = await labeler.extract(url);
            assert.equal(file, undefined);
        });

        it("should return video label", async function () {
            const stub = sinon.stub(globalThis, "fetch").resolves(
                new Response(
                    `<html><head>
                       <meta property="og:title" content="foo" />
                     </head></html>`,
                ),
            );

            const url = new URL("https://vimeo.com/bar");

            const label = await labeler.extract(url);
            assert.equal(label, "foo");

            assert.equal(stub.callCount, 1);
            assert.deepEqual(stub.firstCall.args, [
                new URL("https://vimeo.com/bar"),
            ]);
        });
    });
});
