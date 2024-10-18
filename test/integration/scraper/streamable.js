/**
 * @license MIT
 * @author Sébastien Règne
 */

import assert from "node:assert/strict";
import { extract } from "../../../src/core/scrapers.js";

describe("Scraper: Streamable", function () {
    it("should return video URL [opengraph]", async function () {
        const url = new URL("https://streamable.com/bvyeck");
        const context = { depth: false, incognito: false };

        const file = await extract(url, context);
        assert.ok(
            undefined !== file && new URL(file).pathname.endsWith("bvyeck.mp4"),
            `new URL("${file}").pathname.endsWith(...)`,
        );
    });
});
