import dataStore from '../../popup/dataStore';
import * as browser from 'webextension-polyfill';
// import _ from 'lodash';
const PlexAPI = require('plex-api');
const parseString = require('xml2js').parseString;

// plex client used in requests, it uses tokens
function PlexClient() {
  return new Promise((resolve, reject) => {
    const storageItem = browser.storage.local.get([
      'token',
      'selected_server_uri'
    ]);
    storageItem.then(res => {
      const { token, selected_server_uri } = res;

      if (!selected_server_uri) {
        // TODO open settings page
        dataStore.settings_view = true;
        return reject('Selected URI NULL');
      }

      const url = new URL(selected_server_uri);
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
const searchShows = inputText => {
  PlexClient().then(
    resolve => {
      const storageItem = browser.storage.local.get('selected_lib_id');
      storageItem.then(res => {
        const { selected_lib_id } = res;

        resolve
          .query(`/library/sections/${selected_lib_id}/all?search=${inputText}`)
          .then(
            result => {
              const shows = [];
              result.MediaContainer.Metadata.forEach(show => {
                // stop the list from getting too big
                if (shows.length >= 30) return;
                shows.push({
                  id: show.ratingKey,
                  name: show.title,
                  thumb: show.thumb
                });
              });
              dataStore.foundShows = shows;
            },
            err => {
              console.error('Could not connect to server', err);
            }
          );
      });
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
        const seasons = result.MediaContainer.Metadata.filter(({ title }) =>
          title.match('(Season ([0-9]+)|Specials)')
        );
        dataStore.seasons = seasons;
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
          let valid_URIs = [
            { key: 'none', value: 'none', name: 'none', text: 'None' }
          ];

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
                  name: device.name,
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

// searches plex for shows based on search text box
const getSelectedServerLibraries = () => {
  return new Promise((resolve, reject) => {
    // check if we have a token stored and tell the view not to show login screen
    const storageItem = browser.storage.local.get([
      'token',
      'selected_server_uri',
      'selected_server_name',
      'selected_lib_id',
      'selected_lib_name'
    ]);
    storageItem
      .then(res => {
        const { token, selected_server_uri } = res;

        fetchLibraries(token, selected_server_uri);
      })
      .catch(error => {
        return reject(error, null);
      });

    const fetchLibraries = (token, selected_server_uri) => {
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

      fetch(`${selected_server_uri}/library/sections/`, requestOptions)
        // convert response XML to json
        .then(response => response.json())
        .then(json => {
          let valid_libs = [{ key: 'none', value: 'none', text: 'None' }];

          const libraries = json.MediaContainer.Directory;
          Object.keys(libraries).forEach(lib_index => {
            const library = libraries[lib_index];
            if (library.type === 'show') {
              valid_libs.push({
                key: library.key,
                value: library.key,
                text: `${library.title}`.trim()
              });
            }
          });
          resolve(valid_libs);
        });
    };
  });
};

export { searchShows, getSeasons, getOwnedServers, getSelectedServerLibraries };
