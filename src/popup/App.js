import React from 'react';
import * as browser from 'webextension-polyfill';
import { view, batch } from '@risingstack/react-easy-state';

import SearchPage from './components/searchPage';
import SettingsPage from './components/settingsPage';
import PlexLogin from './components/plexLogin';
import TopBar from './components/topBar';

import './App.css';
import dataStore from './dataStore';

function App() {
  // check if we have a token stored and tell the view not to show login screen
  const storageItem = browser.storage.local.get([
    'token',
    'selected_server_uri',
    'selected_server_name',
    'selected_lib_id',
    'selected_lib_name'
  ]);
  storageItem.then(res => {
    const {
      token,
      selected_server_uri,
      selected_server_name,
      selected_lib_id,
      selected_lib_name
    } = res;

    batch(() => {
      dataStore.plex_authenticated = token && token != '';

      dataStore.selected_server = {
        name: selected_server_name,
        uri: selected_server_uri
      };
      dataStore.selected_library = {
        name: selected_lib_name,
        id: selected_lib_id
      };
    });
  });

  const { plex_authenticated, settings_view } = dataStore;
  return (
    <div className="app">
      {plex_authenticated ? (
        <div className="top">
          <TopBar />
        </div>
      ) : null}
      <div className="body">
        {plex_authenticated ? (
          !settings_view ? (
            <SearchPage />
          ) : (
            <SettingsPage />
          )
        ) : (
          <PlexLogin />
        )}
      </div>
    </div>
  );
}

export default view(App);
