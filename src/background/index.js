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

browser.runtime.onMessage.addListener(request => {
  if (request.req === 'postbois') {
    const { matchups } = request;
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
  }
});
