import React from 'react';
import * as browser from 'webextension-polyfill';
import { view } from '@risingstack/react-easy-state';

import SearchPage from './comps/searchPage';
import PlexLogin from './comps/plexLogin';

import './App.css';
import dataStore from './dataStore';

function App() {
  const storageItem = browser.storage.local.get('token');
  storageItem.then(res => {
    dataStore.token = res.token;
  });
  
  const { token = '' } = dataStore;
  console.log(token);
  return (
    <div className="App">
      <header className="App-header">
        {(token == '') ? <PlexLogin /> : <SearchPage />}
      </header>
    </div>
  );
}

export default view(App);
