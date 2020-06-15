import loadPolyfills from '../gabsocial/load_polyfills';
import ready from '../gabsocial/ready';
import { start } from '../gabsocial/common';

start();

/**
 * : todo : deleting this unused main() [the import of MediaContainer] or MediaContainer or the Poll import in MediaContainer causes this error:
 * commenting out or putting return; works fine. but cannot delete that import or reactComponents variable for some reason.
 * Webpacker::Manifest::MissingEntryError at /settings/preferences
 * Webpacker can't find common in gab-social/public/packs/manifest.json. Possible causes:
 * 1. You want to set webpacker.yml value of compile to true for your environment
 *    unless you are using the `webpack -w` or the webpack-dev-server.
 * 2. webpack has not yet re-run to reflect updates.
 * 3. You have misconfigured Webpacker's config/webpacker.yml file.
 * 4. Your webpack configuration is not creating a manifest.
 */
function main ( ) {
  ready(() => {
    const reactComponents = document.querySelectorAll('[data-component]');
    if (reactComponents.length > 0) {
      import(/* webpackChunkName: "defunct/media_container" */ '../gabsocial/containers/media_container').then(() => {})
    }
  });
}

loadPolyfills().catch((error) => {
  console.error(error);
});
