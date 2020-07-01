import React from 'react';
import * as browser from 'webextension-polyfill';
import { view, batch } from '@risingstack/react-easy-state';
import { Grid, Button, Header, Dropdown } from 'semantic-ui-react';

import dataStore from '../dataStore';

const plex = require('../../lib/js/plex');

// this is all contained inside each plex show on the search list
class TopBar extends React.Component {
  constructor(props) {
    super(props);

    plex.getSelectedServerLibraries().then((res, rej) => {
      if (res) {
        dataStore.library_options = res;
      }
      if (rej) dataStore.library_options = [];
    });
  }

  handleDropdownClick = (e, { value }) => {
    dataStore.selected_library.id = value;

    const { library_options } = dataStore;
    const { text: name } = library_options.find(
      ({ value: val }) => val === value
    );

    batch(() => {
      dataStore.selected_library.name = name;
      dataStore.selected_library.id = value;
    });
    // set browser storage selected_lib_id to null if 'none' was selected
    browser.storage.local.set({
      selected_lib_id: value === 'none' ? null : value,
      selected_lib_name: name
    });
    console.log(`Set selected_library: ${name} - ${value}`);
  };

  handleSettingsCog = () => {
    const { settings_view } = dataStore;
    dataStore.settings_view = !settings_view;
  };

  render() {
    const {
      settings_view,
      selected_server,
      selected_library,
      library_options
    } = dataStore;
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
          <Grid.Column style={{ width: '30%' }}>
            <Header size="large" style={{ margin: 0 }}>
              Posterizer
            </Header>
          </Grid.Column>
          <Grid.Column style={{ width: '50%' }}>
            <div
              style={{
                display: 'flex',
                flexDirection: 'horizontal'
              }}
            >
              <h4 style={{ margin: 0 }}>Plex Server:&nbsp;</h4>
              {selected_server.name}
            </div>

            <Dropdown
              placeholder="select library..."
              selection
              value={selected_library.id}
              onChange={this.handleDropdownClick}
              options={library_options}
            />
          </Grid.Column>
          <Grid.Column
            style={{ width: '20%', textAlign: 'center', padding: '1.5em' }}
          >
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
