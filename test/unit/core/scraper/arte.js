/**
 * @license MIT
 * @author Sébastien Règne
 */

import assert from "node:assert/strict";
import { mock } from "node:test";
import * as scraper from "../../../../src/core/scraper/arte.js";

describe("core/scraper/arte.js", function () {
    afterEach(function () {
        mock.reset();
    });

    describe("extract()", function () {
        it("shouldn't handle when it's a unsupported URL", async function () {
            const url = new URL("https://www.arte.tv/fr/guide/");

            const file = await scraper.extract(url);
            assert.equal(file, undefined);
        });

        it("should return undefined when video is unavailable", async function () {
            const fetch = mock.method(globalThis, "fetch", () =>
                Promise.resolve(
                    Response.json({ data: { attributes: { streams: [] } } }),
                ),
            );

            const url = new URL("https://www.arte.tv/de/videos/foo/bar");

            const file = await scraper.extract(url);
            assert.equal(file, undefined);

            assert.equal(fetch.mock.callCount(), 1);
            assert.deepEqual(fetch.mock.calls[0].arguments, [
                "https://api.arte.tv/api/player/v2/config/de/foo",
            ]);
        });

        it("should return video URL", async function () {
            const fetch = mock.method(globalThis, "fetch", () =>
                Promise.resolve(
                    Response.json({
                        data: {
                            attributes: {
                                streams: [{ url: "https://foo.tv/bar.mp4" }],
                            },
                        },
                    }),
                ),
            );

            const url = new URL("https://www.arte.tv/fr/videos/baz/qux");

            const file = await scraper.extract(url);
            assert.equal(file, "https://foo.tv/bar.mp4");

            assert.equal(fetch.mock.callCount(), 1);
            assert.deepEqual(fetch.mock.calls[0].arguments, [
                "https://api.arte.tv/api/player/v2/config/fr/baz",
            ]);
        });
    });
});
