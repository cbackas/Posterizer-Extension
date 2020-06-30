import React from 'react';
import { view } from '@risingstack/react-easy-state';
import { Grid, Button, Header } from 'semantic-ui-react';

import dataStore from '../dataStore';

// this is all contained inside each plex show on the search list
class TopBar extends React.Component {
  constructor(props) {
    super(props);
  }

  handleSettingsCog = () => {
    const { settings_view } = dataStore;
    dataStore.settings_view = !settings_view;
  };

  render() {
    const { settings_view } = dataStore;
    return (
      <React.Fragment>
        <Grid
          centered
          relaxed
          style={{
            width: '100%',
            margin: 0,
            backgroundColor: '#FFF'
          }}
        >
          <Grid.Column style={{ width: '75%' }}>
            <Header size="large">Posterizer</Header>
          </Grid.Column>
          <Grid.Column style={{ width: '25%', textAlign: 'right' }}>
            <Button
              icon="cog"
              active={settings_view}
              color={settings_view ? 'grey' : null}
              onClick={this.handleSettingsCog}
            />
          </Grid.Column>
        </Grid>
      </React.Fragment>
    );
  }
}

export default view(TopBar);
