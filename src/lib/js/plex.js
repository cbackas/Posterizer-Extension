import dataStore from '../../popup/dataStore';
import * as browser from 'webextension-polyfill';
const PlexAPI = require('plex-api');
const parseString = require('xml2js').parseString;

// plex client used in requests, it uses tokens
function PlexClient() {
  return new Promise((resolve, reject) => {
    const storageItem = browser.storage.local.get(['token', 'selected_uri']);
    storageItem.then(res => {
      const { token, selected_uri } = res;

      if (!selected_uri) {
        // TODO open settings page
        dataStore.settings_view = true;
        return reject('Selected URI NULL');
      }

      const url = new URL(selected_uri);
      resolve(
        new PlexAPI({
          hostname: url.hostname,
          port: url.port,
          https: url.protocol === 'http:',
          token: token
        })
      );
    });
  });
}

// searches plex for shows based on search text box
const searchShows = () => {
  PlexClient().then(
    resolve => {
      resolve.query('/library/sections/2/all').then(
        result => {
          const shows = result.MediaContainer.Metadata;
          dataStore.foundShows = shows.filter(({ title }) =>
            title.toLowerCase().includes(dataStore.inputText.toLowerCase())
          );
        },
        err => {
          console.error('Could not connect to server', err);
        }
      );
    },
    err => {
      console.log(`[Posterizer-Error] ${err}`);
    }
  );
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

// searches plex for shows based on search text box
const getOwnedServers = () => {
  return new Promise((resolve, reject) => {
    const storageItem = browser.storage.local.get('token');
    storageItem.then(res => {
      const { token } = res;
      if (!token) return reject(``);

      var myHeaders = new Headers();
      myHeaders.append('Content-Type', 'application/json');
      myHeaders.append('Accept', 'application/json');
      myHeaders.append('X-Plex-Token', token);

      var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
      };

      fetch('https://plex.tv/api/resources/', requestOptions)
        // convert response XML to json
        .then(response => response.text())
        .then(str => {
          let output = {};
          parseString(str, (err, result) => {
            output = result;
          });
          return output;
        })
        .then(json => {
          let valid_URIs = [{ key: 'none', value: 'none', text: 'None' }];

          const devices = json.MediaContainer.Device;
          Object.keys(devices).forEach(device_key => {
            const device = devices[device_key].$;
            if (device.provides === 'server' && device.owned === '1') {
              const connections = devices[device_key].Connection;
              Object.keys(connections).forEach(connection_key => {
                const connection = connections[connection_key].$;
                // if (connection.local === '0') {}
                valid_URIs.push({
                  key: connection.uri,
                  value: connection.uri,
                  text: `${device.name} - ${connection.uri}`
                });
              });
            }
          });
          resolve(valid_URIs);
        })
        .catch(error => {
          return reject(error, null);
        });
    });
  });
};

export { searchShows, getSeasons, getOwnedServers };
