import React from 'react';
import { view, store } from '@risingstack/react-easy-state';
import _ from 'lodash';
import { Input, Button, Segment, Grid, Header } from 'semantic-ui-react';

import dataStore from '../dataStore';
import DimmerImage from './dimmerImage';

const plex = require('../../lib/js/plex');

class SearchPage extends React.Component {
  constructor(props) {
    super(props);

    this.compStore = store({
      input_text: ''
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
        <Segment
          style={{
            overflow: 'auto',
            position: 'absolute',
            top: '6.5em',
            width: '90%'
          }}
          raised
        >
          <div>
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
              style={{ width: '25%' }}
            />
          </div>
        </Segment>
        <Grid
          centered
          relaxed
          columns={3}
          style={{
            margin: '6em 1.5em 4em 1.5em',
            minHeight: '350px',
            height: '100%'
          }}
        >
          {foundShows.map(show => (
            <Grid.Column key={show.id} style={{ height: 300, width: 200 }}>
              <Segment raised style={{ height: '100%', width: '100%' }}>
                <DimmerImage show={_.cloneDeep(show)} />
                <div
                  style={{
                    paddingTop: '10px',
                    paddingBottom: '10px',
                    textAlign: 'center'
                  }}
                >
                  <Header as="h4">{show.name}</Header>
                </div>
              </Segment>
            </Grid.Column>
          ))}
          {foundShows.length >= 30 ? (
            <Header size="small" style={{ color: 'white' }}>
              30 items shown. To see more, use a better query.
            </Header>
          ) : null}
        </Grid>
      </React.Fragment>
    );
  }
}

export default view(SearchPage);
