'use strict';

import * as registerPushNotifications from './actions/push_notifications';
import { default as GabSocial, store } from './containers/gabsocial';
import ReactDOM from 'react-dom';
import ready from './ready';

function main() {
  // : todo :
  // if (window.history && history.replaceState) {
  //   const { pathname, search, hash } = window.location;
  //   const path = pathname + search + hash;
  //   if (!(/^\/[$/]/).test(path)) {
  //     console.log('redirecting you to hell');
  //     history.replaceState(null, document.title, `${path}`);
  //   }
  // }

  ready(() => {
    const mountNode = document.getElementById('gabsocial');
    const props = JSON.parse(mountNode.getAttribute('data-props'));

    ReactDOM.render(<GabSocial {...props} />, mountNode);
    if (process.env.NODE_ENV === 'production') {
      // avoid offline in dev mode because it's harder to debug
      require('offline-plugin/runtime').install();
      store.dispatch(registerPushNotifications.register());
    }
  });
}

export default main;
