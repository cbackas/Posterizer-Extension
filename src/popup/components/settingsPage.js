import React from 'react';
import * as browser from 'webextension-polyfill';
import { view, batch } from '@risingstack/react-easy-state';
// import { Input, Button, Segment, Grid, Header } from 'semantic-ui-react';
import { Button, Dropdown, Segment } from 'semantic-ui-react';

import '..//';
import dataStore from '../dataStore';

const plex = require('../../lib/js/plex');

class SettingsPage extends React.Component {
  constructor(props) {
    super(props);

    plex.getOwnedServers().then((resolve, reject) => {
      if (resolve) {
        dataStore.server_options = resolve;
      }
      if (reject) console.log(reject);
    });

    const storageItem = browser.storage.local.get([
      'selected_server_uri',
      'selected_server_name'
    ]);
    storageItem.then(res => {
      const { selected_server_uri, selected_server_name } = res;
      if (selected_server_uri && selected_server_name) {
        batch(() => {
          dataStore.selected_server = {
            name: selected_server_name,
            uri: selected_server_uri
          };
        });
      } else {
        dataStore.selected_server = {};
      }
    });
  }

  // handle server selection dropdown
  handleDropdownClick = (e, { value }) => {
    const { server_options } = dataStore;
    const { name } = server_options.find(({ value: val }) => val === value);

    batch(() => {
      dataStore.selected_server.name = name;
      dataStore.selected_server.uri = value;
    });
    // set browser storage selected_uri to null if 'none' was selected
    browser.storage.local.set({
      selected_server_uri: value === 'none' ? null : value,
      selected_server_name: name
    });
    console.log(`Setting selected_uri: ${name} ${value}`);

    plex.getSelectedServerLibraries().then((res, rej) => {
      if (res) {
        dataStore.library_options = res;
      }
      if (rej) dataStore.library_options = [];
    });
  };

  // clear Auth button
  handleClearAuth = () => {
    browser.runtime.sendMessage({ request: 'clear_token' });
    browser.runtime.sendMessage({ request: 'clear_cache' });

    // close the popup to reset the extension's flow
    setTimeout(() => {
      window.close();
    }, 100);
  };

  render() {
    const { selected_server, server_options } = dataStore;
    const { uri } = selected_server;

    const segmentStyle = {
      width: '90vw',
      backgroundColor: '#0f141a',
      textAlign: 'left',
      margin: '0em 2em 0em 1em'
    };

    const groupStyle = {
      marginTop: '1em'
    };

    return (
      <React.Fragment>
        <Segment.Group style={groupStyle}>
          <Segment style={segmentStyle}>
            <h4>Select Plex Server</h4>
          </Segment>
          <Segment style={segmentStyle}>
            <Dropdown
              placeholder="Plex Server"
              selection
              fluid
              value={uri}
              onChange={this.handleDropdownClick}
              options={server_options}
            />
          </Segment>
        </Segment.Group>
        <Segment.Group style={groupStyle}>
          <Segment style={segmentStyle}>
            <h4>Clear Plex Authentication and reset cache</h4>
          </Segment>
          <Segment style={segmentStyle}>
            <Button negative onClick={this.handleClearAuth}>
              Clear Auth
            </Button>
          </Segment>
        </Segment.Group>
      </React.Fragment>
    );
  }
}

export default view(SettingsPage);
