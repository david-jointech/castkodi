/**
 * @license MIT
 * @author Sébastien Règne
 */

import assert from "node:assert/strict";
import sinon from "sinon";
import { complete, extract } from "../../../src/core/labelers.js";

describe("core/labelers.js", function () {
    describe("extract()", function () {
        it("should return label", async function () {
            const stub = sinon.stub(globalThis, "fetch").resolves(
                new Response(
                    `<html><head>
                       <meta property="og:title" content="bar" />
                     </head></html>`,
                ),
            );

            const url = new URL(
                "plugin://plugin.video.youtube/play/?video_id=foo",
            );

            const label = await extract(url);
            assert.equal(label, "bar");

            assert.equal(stub.callCount, 1);
            assert.deepEqual(stub.firstCall.args, [
                new URL("https://www.youtube.com/watch?v=foo"),
            ]);
        });

        it("should return undefined", async function () {
            const url = new URL("https://foo.com/");

            const label = await extract(url);
            assert.equal(label, undefined);
        });
    });

    describe("complete()", function () {
        it("should return 'title' when it's present", async function () {
            const item = {
                file: "https://foo.com/",
                label: "bar",
                position: 0,
                title: "baz",
                type: "",
            };

            const result = await complete(item);
            assert.deepEqual(result, {
                file: "https://foo.com/",
                label: "baz",
                position: 0,
                title: "baz",
                type: "",
            });
        });

        it("should return 'title' striped", async function () {
            const item = {
                file: "https://foo.com/",
                label: "bar",
                position: 0,
                title: "[B]baz[/B]",
                type: "",
            };

            const result = await complete(item);
            assert.deepEqual(result, {
                file: "https://foo.com/",
                label: "baz",
                position: 0,
                title: "[B]baz[/B]",
                type: "",
            });
        });

        it("should return 'label' when no labeler", async function () {
            const item = {
                file: "https://foo.com/",
                label: "bar",
                position: 0,
                title: "",
                type: "",
            };

            const result = await complete(item);
            assert.deepEqual(result, {
                file: "https://foo.com/",
                label: "bar",
                position: 0,
                title: "",
                type: "",
            });
        });

        it("should return 'file' when no labeler and no 'label'", async function () {
            const item = {
                file: "https://foo.com/",
                label: "",
                position: 0,
                title: "",
                type: "",
            };

            const result = await complete(item);
            assert.deepEqual(result, {
                file: "https://foo.com/",
                label: "https://foo.com/",
                position: 0,
                title: "",
                type: "",
            });
        });

        it("should return 'label' from labeler", async function () {
            const stub = sinon.stub(globalThis, "fetch").resolves(
                new Response(
                    `<html><head>
                       <meta property="og:title" content="bar" />
                     </head></html>`,
                ),
            );

            const item = {
                file: "plugin://plugin.video.youtube/play/?video_id=foo",
                label: "baz",
                position: 0,
                title: "",
                type: "",
            };

            const result = await complete(item);
            assert.deepEqual(result, {
                file: "plugin://plugin.video.youtube/play/?video_id=foo",
                label: "bar",
                position: 0,
                title: "",
                type: "",
            });

            assert.equal(stub.callCount, 1);
            assert.deepEqual(stub.firstCall.args, [
                new URL("https://www.youtube.com/watch?v=foo"),
            ]);
        });

        it("should support local file", async function () {
            const item = {
                file: "/foo/bar.mp3",
                label: "",
                position: 0,
                title: "",
                type: "",
            };

            const result = await complete(item);
            assert.deepEqual(result, {
                file: "/foo/bar.mp3",
                label: "/foo/bar.mp3",
                position: 0,
                title: "",
                type: "",
            });
        });

        it("should strip tags in label", async function () {
            const item = {
                file: "/foo.mkv",
                label: "[B][UPPERCASE]Bar[/UPPERCASE][/B] !",
                position: 0,
                title: "",
                type: "",
            };

            const result = await complete(item);
            assert.deepEqual(result, {
                file: "/foo.mkv",
                label: "BAR !",
                position: 0,
                title: "",
                type: "",
            });
        });
    });
});
