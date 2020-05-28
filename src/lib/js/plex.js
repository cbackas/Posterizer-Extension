import dataStore from '../../popup/dataStore';
import * as browser from 'webextension-polyfill';
const PlexAPI = require('plex-api');
const credentials = require('plex-api-credentials');

// plex client used in requests, it uses tokens
function PlexClient() {

  return new Promise(function(resolve) {
    const storageItem = browser.storage.local.get('token');
    storageItem.then(res => {
      const { token = '' } = res;
      resolve(
        new PlexAPI({
          hostname: '10.20.0.10',
          port: 32400,
          https: true,
          token: token
        })
      );
    });
  });
}

// searches plex for shows based on search text box
const searchShows = () => {
  PlexClient().then(client => {
    client.query('/library/sections/2/all').then(
      result => {
        const shows = result.MediaContainer.Metadata;
        dataStore.foundShows = shows.filter(({ title }) =>
          title.toLowerCase().includes(dataStore.inputText)
        );
      },
      function(err) {
        console.error('Could not connect to server', err);
      }
    );
  });
};

// Pulls plex season info out of a URL and saves it to store
const getSeasons = libURL => {
  PlexClient().then(client => {
    client.query(libURL).then(
      result => {
        const resultObjects = result.MediaContainer.Metadata;
        dataStore.seasons = resultObjects.filter(({ title }) =>
          title.match('Season ([0-9]+)')
        );
      },
      function(err) {
        console.error('Could not connect to server', err);
      }
    );
  });
};

// call into this with user and path to get a new token
function userAuth(user, pass) {
  // make login credentials
  const userAndPass = credentials({
    username: user,
    password: pass
  });

  // set listener for a token from the credentials
  userAndPass.on('token', function(token) {
    dataStore.token = token;
    browser.storage.local.set({ token: token });
    console.log(`Updated Plex token: ${token}`);
  });

  // call into the API and authenticate
  new PlexAPI({
    hostname: '10.20.0.10',
    port: 32400,
    https: true,
    authenticator: userAndPass
  })._authenticate();
}

export { searchShows, getSeasons, userAuth };
