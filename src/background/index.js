/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */

browser.runtime.onMessage.addListener(message => {
  if (message.request === 'post_matchups') {
    postFinalURLs(message.matchups);
  } else if (message.request === 'fetch_token') {
    fetchToken(function(error, access_token) {
      if (error) console.log(error);
    });
  } else if (message.request === 'clear_token') {
    removeCachedToken();
  } else if (message.request === 'clear_cache') {
    removeCache();
  }
});

const postFinalURLs = matchups => {
  let api_url = null;
  let token = null;
  const storageItem = browser.storage.local.get(['token', 'selected_uri']);
  storageItem.then(res => {
    api_url = res.selected_uri;
    token = res.token;

    if (api_url && token) sendPOSTs();
  });

  const sendPOSTs = () => {
    Object.keys(matchups).forEach(key => {
      const matchup = matchups[key];
      // 'http://10.20.0.10:32400/library/metadata/ID/posters?includeExternalMedia=1&url=ENCODEDURL&X-Plex-Token=TOKEN'
      const request_url = `${api_url}/library/metadata/${
        matchup[0]
      }/posters?includeExternalMedia=1`;

      setTimeout(() => {
        console.log(`[POST] ${request_url}`);

        var myHeaders = new Headers();
        myHeaders.append('url', matchup[1]);
        myHeaders.append('X-Plex-Token', token);

        fetch(request_url, {
          method: 'POST',
          headers: myHeaders,
          redirect: 'follow'
        })
          .then(response => response.text())
          .then(result => console.log(result))
          .catch(error => {
            console.log('error', error);
          });
      }, 250);
    });
  };
};

const fetchToken = callback => {
  const product = 'Posterizer';
  const platform = 'Web';
  const device = `${product} (${platform})`;
  const clientId = '11442b0924c8d6a98fb7';
  const redirectUri = browser.identity.getRedirectURL('provider_cb');

  var access_token = null;

  // in case we already have an access_token cached
  const storageItem = browser.storage.local.get('token');
  storageItem.then(res => {
    access_token = res.token;
    if (access_token) {
      callback(null, access_token);
      return;
    } else {
      initFlow();
    }
  });

  // things that come from fetches
  var id = null;
  var code = null;

  initFlow = () => {
    var myHeaders = new Headers();
    myHeaders.append('X-Plex-Product', product);
    myHeaders.append('X-Plex-Platform', platform);
    myHeaders.append('X-Plex-Device', device);
    myHeaders.append('X-Plex-Client-Identifier', clientId);

    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      redirect: 'follow'
    };

    fetch('https://plex.tv/api/v2/pins.json?strong=true', requestOptions)
      .then(response => response.json())
      .then(result => {
        id = result.id;
        code = result.code;
        redirectToLogin();
      })
      .catch(error => callback(error, null));
  };

  redirectToLogin = () => {
    var login_url =
      'https://app.plex.tv/auth#' +
      `?context[device][product]=${product}` +
      '&context[device][environment]=bundled' +
      '&context[device][layout]=desktop' +
      `&context[device][platform]=${platform}` +
      `&context[device][device]=${encodeURI(device)}` +
      `&clientID=${clientId}` +
      `&forwardUrl=${redirectUri}` +
      `&code=${code}`;

    browser.windows
      .create({
        url: login_url,
        type: 'popup',
        height: 700,
        width: 460
      })
      .then(popup => {
        const popup_window_id = popup.id;

        browser.windows.onRemoved.addListener(windowId => {
          if (windowId === popup_window_id) {
            codeToToken();
          }
        });
      });
  };

  codeToToken = () => {
    var myHeaders = new Headers();
    myHeaders.append('X-Plex-Client-Identifier', clientId);

    var requestOptions = {
      method: 'GET',
      headers: myHeaders,
      redirect: 'follow'
    };

    fetch(`https://plex.tv/api/v2/pins/${id}.json`, requestOptions)
      .then(response => response.json())
      .then(result => saveAccessToken(result.authToken))
      .catch(error => callback(error, null));
  };

  saveAccessToken = token => {
    access_token = token;
    console.log('Setting access_token: ', access_token);
    browser.storage.local.set({ token: access_token });
    callback(null, access_token);
  };
};

const removeCachedToken = () => {
  access_token = null;
  browser.storage.local.set({ token: null });
};

const removeCache = () => {
  browser.storage.local.set({
    selected_server_uri: null,
    selected_server_name: null,
    selected_lib_id: null,
    selected_lib_name: null
  });
};
