import React from 'react';
import { view, store } from '@risingstack/react-easy-state';
import { Segment, Input, Grid, Button } from 'semantic-ui-react';

const { userAuth } = require('../../lib/js/plex');

// this is all contained inside each plex show on the search list
class PlexLogin extends React.Component {
  constructor(props) {
    super(props);

    this.compStore = store({
      user: 'zgibson@live.com',
      pass: ''
    });
  }

  // handle typing in text boxes
  handleUserInput = event => (this.compStore.user = event.target.value);
  handlePassInput = event => (this.compStore.pass = event.target.value);

  // handle login button - sends it off to get the plex token
  handleLogin = () => {
    const { user, pass } = this.compStore;
    if (user != '' && pass != '') {
      userAuth(user, pass);
    }
  };

  handleKeyPress = event => {
    if (event.key === 'Enter') {
      this.handleLogin();
    }
  };

  render() {
    const { user, pass } = this.compStore;

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
            <Segment raised style={{ height: '100%', width: '100%' }}>
              <Input
                style={{ padding: 5 }}
                fluid
                placeholder="Username..."
                value={user}
                onChange={this.handleUserInput}
              />
              <Input
                style={{ padding: 5 }}
                type="password"
                fluid
                placeholder="Password..."
                value={pass}
                onChange={this.handlePassInput}
                onKeyPress={this.handleKeyPress}
              />
              <Button onClick={this.handleLogin} content="Login" />
            </Segment>
          </Grid.Column>
        </Grid>
      </React.Fragment>
    );
  }
}

export default view(PlexLogin);
