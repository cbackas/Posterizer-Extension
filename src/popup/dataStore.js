import { store } from '@risingstack/react-easy-state';

const dataStore = store({
  plex_authenticated: true,
  settings_view: false, // whether user is shown settings view or not
  selected_server_uri: null,
  server_options: [],
  inputText: '',
  foundShows: [],
  seasons: [],
  posterSeasons: {},
  matchups: {}
});

export default dataStore;
