const { getDefaultConfig } = require('@expo/metro-config');

/** 
 * Charge la config Metro compatible avec Expo 
 * (c’est ici que loadAsync sera défini)
 */
const config = getDefaultConfig(__dirname);

module.exports = config;
