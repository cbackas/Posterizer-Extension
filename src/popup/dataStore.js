import { store } from '@risingstack/react-easy-state';

const dataStore = store({
  plex_authenticated: false,
  inputText: '',
  foundShows: [],
  seasons: [],
  posterSeasons: {},
  matchups: {}
});

export default dataStore;
