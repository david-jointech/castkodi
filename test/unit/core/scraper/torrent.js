/**
 * @license MIT
 * @author Sébastien Règne
 */

import assert from "node:assert/strict";
import * as scraper from "../../../../src/core/scraper/torrent.js";

describe("core/scraper/torrent.js", function () {
    describe("extract()", function () {
        it("shouldn't handle when it's a unsupported URL", async function () {
            const url = new URL("https://fr.wikipedia.org/wiki/BitTorrent");

            const file = await scraper.extract(url);
            assert.equal(file, undefined);
        });

        it("should return video URL from torrent", async function () {
            const url = new URL("https://foo.com/bar.torrent");

            const file = await scraper.extract(url);
            assert.equal(
                file,
                "plugin://plugin.video.elementum/play" +
                    "?uri=https%3A%2F%2Ffoo.com%2Fbar.torrent",
            );
        });

        it("should return video URL from magnet", async function () {
            const url = new URL("magnet:?foo=bar:baz&qux=quux");

            const file = await scraper.extract(url);
            assert.equal(
                file,
                "plugin://plugin.video.elementum/play" +
                    "?uri=magnet%3A%3Ffoo%3Dbar%3Abaz%26qux%3Dquux",
            );
        });
    });
});
