/**
 * @module
 * @license MIT
 * @see https://www.vtmgo.be/vtmgo
 * @author Sébastien Règne
 */

import { kodi } from "../jsonrpc/kodi.js";
import * as sendtokodiPlugin from "../plugin/sendtokodi.js";
import * as vtmgoPlugin from "../plugin/vtmgo.js";
import { matchPattern } from "../tools/matchpattern.js";

/**
 * Répartit un épisode VTM GO à un plugin de Kodi.
 *
 * @param {string} episodeUuid L'UUID de l'épisode VTM GO.
 * @returns {Promise<string>} Une promesse contenant le lien du _fichier_.
 */
const dispatchEpisode = async (episodeUuid) => {
    const addons = await kodi.addons.getAddons("video");
    if (addons.some((a) => "plugin.video.vtm.go" === a.addonid)) {
        return vtmgoPlugin.generateEpisodeUrl(episodeUuid);
    }
    if (addons.some((a) => "plugin.video.sendtokodi" === a.addonid)) {
        return sendtokodiPlugin.generateUrl(
            new URL(`https://www.vtmgo.be/vtmgo/afspelen/e${episodeUuid}`),
        );
    }
    // Envoyer par défaut au plugin VTM GO.
    return vtmgoPlugin.generateEpisodeUrl(episodeUuid);
};

/**
 * Répartit un film VTM GO à un plugin de Kodi.
 *
 * @param {string} movieUuid L'UUID du film VTM GO.
 * @returns {Promise<string>} Une promesse contenant le lien du _fichier_.
 */
const dispatchMovie = async (movieUuid) => {
    const addons = await kodi.addons.getAddons("video");
    if (addons.some((a) => "plugin.video.vtm.go" === a.addonid)) {
        return vtmgoPlugin.generateMovieUrl(movieUuid);
    }
    if (addons.some((a) => "plugin.video.sendtokodi" === a.addonid)) {
        return sendtokodiPlugin.generateUrl(
            new URL(`https://www.vtmgo.be/vtmgo/afspelen/m${movieUuid}`),
        );
    }
    // Envoyer par défaut au plugin VTM GO.
    return vtmgoPlugin.generateMovieUrl(movieUuid);
};

/**
 * Répartit une chaine VTM GO à un plugin de Kodi.
 *
 * @param {string} channelUuid L'UUID de la chaine VTM GO.
 * @returns {Promise<string>} Une promesse contenant le lien du _fichier_.
 */
const dispatchChannel = async (channelUuid) => {
    const addons = await kodi.addons.getAddons("video");
    if (addons.some((a) => "plugin.video.vtm.go" === a.addonid)) {
        return vtmgoPlugin.generateChannelUrl(channelUuid);
    }
    if (addons.some((a) => "plugin.video.sendtokodi" === a.addonid)) {
        return sendtokodiPlugin.generateUrl(
            new URL(`https://www.vtmgo.be/vtmgo/live-kijken/${channelUuid}`),
        );
    }
    // Envoyer par défaut au plugin VTM GO.
    return vtmgoPlugin.generateChannelUrl(channelUuid);
};

/**
 * Extrait les informations nécessaires pour lire un épisode sur Kodi.
 *
 * @param {URL} url L'URL d'un épisode de VTM GO.
 * @returns {Promise<string>} Une promesse contenant le lien du _fichier_.
 */
const actionEpisode = ({ pathname }) => {
    return dispatchEpisode(pathname.slice(17));
};

export const extractEpisode = matchPattern(
    actionEpisode,
    "*://www.vtmgo.be/vtmgo/afspelen/e*",
);

/**
 * Extrait les informations nécessaires pour lire un film sur Kodi.
 *
 * @param {URL} url L'URL d'un film de VTM GO.
 * @returns {Promise<string>} Une promesse contenant le lien du _fichier_.
 */
const actionMovie = ({ pathname }) => {
    return dispatchMovie(pathname.slice(17));
};

export const extractMovie = matchPattern(
    actionMovie,
    "*://www.vtmgo.be/vtmgo/afspelen/m*",
);

/**
 * Extrait les informations nécessaires pour lire un film sur Kodi.
 *
 * @param {URL} url L'URL d'une page d'un film de VTM GO.
 * @returns {Promise<string>} Une promesse contenant le lien du _fichier_.
 */
const actionMoviePage = ({ pathname }) => {
    return dispatchMovie(pathname.slice(pathname.indexOf("~m") + 2));
};

export const extractMoviePage = matchPattern(
    actionMoviePage,
    "*://www.vtmgo.be/vtmgo/*~m*",
);

/**
 * Extrait les informations nécessaires pour lire une chaine sur Kodi.
 *
 * @param {URL}      _url          L'URL d'une chaine VTM GO.
 * @param {Object}   metadata      Les métadonnées de l'URL.
 * @param {Function} metadata.html La fonction retournant la promesse contenant
 *                                 le document HTML.
 * @returns {Promise<string|undefined>} Une promesse contenant le lien du
 *                                      _fichier_ ou `undefined`.
 */
const actionChannel = async (_url, metadata) => {
    const doc = await metadata.html();
    const div = doc.querySelector("div.fjs-player[data-id]");
    return null === div ? undefined : await dispatchChannel(div.dataset.id);
};
export const extractChannel = matchPattern(
    actionChannel,
    "*://www.vtmgo.be/vtmgo/live-kijken/*",
);
