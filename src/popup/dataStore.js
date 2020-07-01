import { store } from '@risingstack/react-easy-state';

const dataStore = store({
  plex_authenticated: true, // whether a token is saved or not (we dont keep it here tho)
  settings_view: false, // whether user is shown settings view or not
  selected_server: {}, // { name: ###, uri: ### }
  selected_library: {}, // { name: ###, id: ### }
  server_options: [], // list of plex server connections viable in settings
  library_options: [], // list of libraries for selected server
  inputText: '',
  foundShows: [],
  seasons: [],
  posterSeasons: {},
  matchups: {}
});

export default dataStore;
