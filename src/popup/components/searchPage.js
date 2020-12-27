import React from 'react';
import { view, store } from '@risingstack/react-easy-state';
import _ from 'lodash';
import { Input, Button, Header, List } from 'semantic-ui-react';

import dataStore from '../dataStore';
import SearchItem from './searchItem';

const plex = require('../../lib/js/plex');

class SearchPage extends React.Component {
  constructor(props) {
    super(props);

    this.compStore = store({
      input_text: '',
      readyToApply: false
    });
  }

  handleInput = event => (this.compStore.input_text = event.target.value);

  handleSearch = () => {
    const { input_text } = this.compStore;
    plex.searchShows(input_text);
  };

  handleKeyPress = event => {
    if (event.key === 'Enter') {
      this.handleSearch();
    }
  };

  render() {
    const { foundShows } = dataStore;
    const { input_text } = this.compStore;

    return (
      <React.Fragment>
        <div
          style={{
            width: '90%',
            textAlign: 'center',
            paddingTop: '1em'
          }}
        >
          <Input
            placeholder="Search for a show..."
            value={input_text}
            onChange={this.handleInput}
            onKeyPress={this.handleKeyPress}
            style={{ width: '70%' }}
          />
          <Button
            onClick={this.handleSearch}
            content="Search"
            style={{
              width: '25%',
              marginLeft: '1em'
            }}
          />
        </div>
        <List
          size="huge"
          style={{
            marginTop: '1em',
            marginBottom: '1em',
            minHeight: '350px',
            height: '100%',
            width: '90%'
          }}
        >
          {foundShows.map(show => (
            <SearchItem key={show.id} show={_.cloneDeep(show)} />
          ))}
        </List>
        {foundShows.length >= 30 ? (
          <Header size="small" style={{ color: 'white' }}>
            Max of 30 items shown. Try a better query.
          </Header>
        ) : null}
      </React.Fragment>
    );
  }
}

export default view(SearchPage);
