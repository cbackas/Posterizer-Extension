import React from 'react';
import * as browser from 'webextension-polyfill';
import { view } from '@risingstack/react-easy-state';

import SearchPage from './components/searchPage';
import SettingsPage from './components/settingsPage';
import PlexLogin from './components/plexLogin';
import TopBar from './components/topBar';

import './App.css';
import dataStore from './dataStore';

function App() {
  // check if we have a token stored and tell the view not to show login screen
  const storageItem = browser.storage.local.get(['token']);
  storageItem.then(res => {
    const { token } = res;
    if (token != '' && token != null) {
      dataStore.plex_authenticated = true;
    } else {
      dataStore.plex_authenticated = false;
    }
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
