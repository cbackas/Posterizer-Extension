import { store } from '@risingstack/react-easy-state';

const dataStore = store({
  token: '',
  inputText: '',
  foundShows: [],
  seasons: [],
  posterSeasons: {},
  matchups: {}
});

export default dataStore;
