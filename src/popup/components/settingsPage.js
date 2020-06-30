import React from 'react';
import * as browser from 'webextension-polyfill';
import { view } from '@risingstack/react-easy-state';
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

    const storageItem = browser.storage.local.get('selected_uri');
    storageItem.then(res => {
      const { selected_uri } = res;
      if (selected_uri) {
        dataStore.selected_server_uri = selected_uri;
      } else {
        dataStore.selected_server_uri = 'none';
      }
    });
  }

  // handle server selection dropdown
  handleDropdownClick = (e, { value }) => {
    console.log('Setting selected_uri: ', value);
    dataStore.selected_server_uri = value;
    // set browser storage selected_uri to null if 'none' was selected
    browser.storage.local.set({
      selected_uri: value === 'none' ? null : value
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
    const { selected_server_uri, server_options } = dataStore;

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
              value={selected_server_uri}
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
