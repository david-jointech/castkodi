/**
 * @module
 * @license MIT
 * @see https://www.reddit.com/
 * @author Sébastien Règne
 */

import { matchPattern } from "../tools/matchpattern.js";
// eslint-disable-next-line import/no-cycle
import { extract as iframeExtract } from "./iframe.js";

/**
 * Extrait les informations nécessaires pour lire une vidéo sur Kodi.
 *
 * @param {URL}      _url          L'URL d'une vidéo Reddit.
 * @param {Object}   metadata      Les métadonnées de l'URL.
 * @param {Function} metadata.html La fonction retournant la promesse contenant
 *                                 le document HTML.
 * @returns {Promise<string|undefined>} Une promesse contenant le lien du
 *                                      _fichier_ ou `undefined`.
 */
const action = async (_url, metadata) => {
    const doc = await metadata.html();
    const player = doc.querySelector("shreddit-player-2[src]");
    return player?.getAttribute("src");
};
export const extract = matchPattern(action, "*://www.reddit.com/r/*");

/**
 * Extrait les informations nécessaires pour lire une vidéo sur Kodi.
 *
 * @param {URL}      url               L'URL d'une vidéo embarquée sur Reddit.
 * @param {Object}   metadata          Les métadonnées de l'URL.
 * @param {Function} metadata.html     La fonction retournant la promesse
 *                                     contenant le document HTML.
 * @param {Object}   context           Le contexte de l'extraction.
 * @param {boolean}  context.depth     La marque indiquant si l'extraction est
 *                                     en profondeur.
 * @param {boolean}  context.incognito La marque indiquant si l'utilisateur est
 *                                     en navigation privée.
 * @returns {Promise<string|undefined>} Une promesse contenant le lien du
 *                                      _fichier_ ou `undefined`.
 */
const actionEmbed = async (url, metadata, context) => {
    const doc = await metadata.html();
    for (const embed of doc.querySelectorAll("shreddit-embed[html]")) {
        const subMetadata = {
            html: () =>
                Promise.resolve(
                    new DOMParser().parseFromString(
                        embed.getAttribute("html"),
                        "text/html",
                    ),
                ),
        };
        const file = await iframeExtract(url, subMetadata, context);
        if (undefined !== file) {
            return file;
        }
    }
    return undefined;
};
export const extractEmbed = matchPattern(actionEmbed, "*://www.reddit.com/r/*");
