/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
// console.log('Background.js file loaded');

/* const defaultUninstallURL = () => {
  return process.env.NODE_ENV === 'production'
    ? 'https://wwww.github.com/kryptokinght'
    : '';
}; */

/* browser.runtime.onMessage.addListener(function (message) {
  console.log(message);
}); */

browser.runtime.onMessage.addListener(message => {
  if (message.request === 'postbois') {
    postFinalURLs(message.matchups);
  } else if (message.request === 'fetchToken') {
    tokenFetcher().getToken();
  }
});

const postFinalURLs = matchups => {
  Object.keys(matchups).forEach(key => {
    const url = matchups[key];
    setTimeout(() => {
      console.log(`[POST] ${url}`);

      // 'http://10.20.0.10:32400/library/metadata/7353/posters?includeExternalMedia=1&url=https%3A%2F%2Ftheposterdb.com%2Fapi%2Fassets%2F13863%2Fdownload'
      // https://10-20-0-10.efa2624cca284f5e9e6ea24484bba7ae.plex.direct:32400/library/metadata/7392/posters?includeExternalMedia=1&url=https%3A%2F%2Ftheposterdb.com%2Fapi%2Fassets%2F13856%2Fdownload&X-Plex-Product=Plex%20Web&X-Plex-Version=4.30.2&X-Plex-Client-Identifier=6hvc25pcj1aighouuzp0kjd4&X-Plex-Platform=Firefox&X-Plex-Platform-Version=76.0&X-Plex-Sync-Version=2&X-Plex-Features=external-media%2Cindirect-media&X-Plex-Model=bundled&X-Plex-Device=Windows&X-Plex-Device-Name=Firefox&X-Plex-Device-Screen-Resolution=1920x948%2C1920x1080&X-Plex-Token=wHHoExoPuYCHKojYfYDQ&X-Plex-Language=en
      fetch(url, {
        method: 'POST',
        headers: {
          Origin: '10.20.0.10'
        },
        redirect: 'follow'
      })
        .then(response => response.text())
        .then(result => console.log(result))
        .catch(error => console.log('error', error));
    }, 500);
  });
};

const tokenFetcher = () => {
  const product = 'Posterizer';
  const platform = 'Web';
  const device = `${product} (${platform})`;
  const clientId = '11442b0924c8d6a98fb7';
  const redirectUri = browser.identity.getRedirectURL('provider_cb');

  var access_token = null;

  return {
    getToken: function() {
      // in case we already have an access_token cached
      // const storageItem = browser.storage.local.get('token');
      // storageItem
      //   .then(res => {
      //     console.log(access_token, res.token);
      //     access_token = res.token;
      //   })
      //   .then(() => {
      //     if (access_token) {
      //       return;
      //     }
      //   });

      // things that come from fetches
      var id = null;
      var code = null;

      initialFetch = () => {
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
          .catch(error => console.log('[error]', error));
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
          .then(result => setAccessToken(result.authToken))
          .catch(error => console.log('error', error));
      };

      setAccessToken = token => {
        access_token = token;
        console.log('Setting access_token: ', access_token);
        browser.storage.local.set({ token: access_token });
      };

      // do the things in initial fetch first
      initialFetch();
    },

    removeCachedToken: function(token_to_remove) {
      if (access_token == token_to_remove) access_token = null;
      browser.storage.local.set({ token: null });
    }
  };
};
