import React from 'react';
import * as browser from 'webextension-polyfill';
import { view } from '@risingstack/react-easy-state';

import SearchPage from './components/searchPage';
import PlexLogin from './components/plexLogin';

import './App.css';
import dataStore from './dataStore';

function App() {
  // check if we have a token stored and tell the view not to show login screen
  const storageItem = browser.storage.local.get('token');
  storageItem.then(res => {
    if (res.token != '' && res.token != null) {
      dataStore.plex_authenticated = true;
    } else {
      dataStore.plex_authenticated = false;
    }
  });

  const { plex_authenticated } = dataStore;
  console.log(plex_authenticated);
  return (
    <div className="App">
      <header className="App-header">
        {plex_authenticated ? <SearchPage /> : <PlexLogin />}
      </header>
    </div>
  );
}

export default view(App);
