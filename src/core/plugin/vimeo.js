/**
 * @module
 * @license MIT
 * @see https://kodi.wiki/view/Add-on:Vimeo
 * @author Sébastien Règne
 */

/**
 * L'URL de l'extension pour lire des vidéos issues de Vimeo.
 *
 * @type {string}
 */
const PLUGIN_URL = "plugin://plugin.video.vimeo/play/?video_id=";

/**
 * Génère l'URL d'une vidéo dans l'extension SoundCloud.
 *
 * @param {string}           videoId L'identifiant de la vidéo Vimeo.
 * @param {string|undefined} hash    L'éventuel _hash_ pour accéder à une vidéo
 *                                   non-listée.
 * @returns {string} Le lien du _fichier_.
 */
export const generateUrl = function (videoId, hash) {
    return PLUGIN_URL + videoId + (undefined === hash ? "" : `:${hash}`);
};
