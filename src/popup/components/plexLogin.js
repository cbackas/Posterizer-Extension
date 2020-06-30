import React from 'react';
import * as browser from 'webextension-polyfill';
import { view } from '@risingstack/react-easy-state';
import { Segment, Grid, Button, Header } from 'semantic-ui-react';

// this is all contained inside each plex show on the search list
class PlexLogin extends React.Component {
  constructor(props) {
    super(props);
  }

  // handle login button - sends it off to get the plex token
  handleLogin = () => {
    browser.runtime.sendMessage({ request: 'fetch_token' });
  };

  render() {
    return (
      <React.Fragment>
        <Grid
          centered
          relaxed
          columns={1}
          style={{
            minHeight: 300,
            width: 450,
            margin: '1.5rem',
            marginTop: '5.5rem'
          }}
        >
          <Grid.Column style={{ height: 200, width: 400 }}>
            <Segment
              raised
              style={{ height: '100%', width: '100%' }}
              textAlign="center"
            >
              <Header size="medium">
                You need to login to Plex to use Posterizer. Click login to
                trigger the OAuth process.
              </Header>
              <Button onClick={this.handleLogin} content="Login" />
            </Segment>
          </Grid.Column>
        </Grid>
      </React.Fragment>
    );
  }
}

export default view(PlexLogin);
