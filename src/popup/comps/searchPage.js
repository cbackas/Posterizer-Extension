import React from 'react';
import { view } from '@risingstack/react-easy-state';
import _ from 'lodash';
import { Input, Button, Segment, Grid, Header } from 'semantic-ui-react';

import dataStore from '../dataStore';
import DimmerImage from './dimmerImage';

const plex = require('../../lib/js/plex');

function SearchPage() {
  const handleInput = event => (dataStore.inputText = event.target.value);

  // eslint-disable-next-line no-unused-vars
  const handleSearch = (event, data) => {
    if (dataStore.inputText !== '') {
      plex.searchShows();
    }
  };

  const handleKeyPress = (event) => {
    if(event.key === 'Enter'){
      handleSearch();
    }
  };

  return (
    <React.Fragment>
      <Segment
        style={{
          margin: '1rem',
          overflow: 'auto',
          position: 'absolute',
          top: 0
        }}
        raised
      >
        <div>
          <Input
            placeholder="Search for a show..."
            value={dataStore.inputText}
            onChange={handleInput}
            onKeyPress={handleKeyPress}
          />
          <Button onClick={handleSearch} content="Search" />
        </div>
      </Segment>
      <Grid
        centered
        relaxed
        columns={3}
        style={{
          minHeight: 600,
          width: 450,
          margin: '1.5rem',
          marginTop: '5.5rem'
        }}
      >
        {dataStore.foundShows.map(show => (
          <Grid.Column key={show.ratingKey} style={{ height: 300, width: 200 }}>
            <Segment raised style={{ height: '100%', width: '100%' }}>
              <DimmerImage show={_.cloneDeep(show)} />
              <div
                style={{
                  paddingTop: '10px',
                  paddingBottom: '10px',
                  textAlign: 'center'
                }}
              >
                <Header as="h4">{show.title}</Header>
              </div>
            </Segment>
          </Grid.Column>
        ))}
      </Grid>
    </React.Fragment>
  );
}

export default view(SearchPage);
