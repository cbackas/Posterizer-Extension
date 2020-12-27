import React from 'react';
import ReactDOM from 'react-dom';
import * as browser from 'webextension-polyfill';
import _ from 'lodash';
import { view, store } from '@risingstack/react-easy-state';
import { Button, Image, Modal, Icon, List } from 'semantic-ui-react';

import dataStore from '../dataStore';
const plex = require('../../lib/js/plex');

// const request = require('request');
const cheerio = require('cheerio');

// this is all contained inside each plex show on the search list
class SearchItem extends React.Component {
  constructor(props) {
    super(props);

    this.compStore = store({
      active: false,
      readyToApply: false,
      matchedSeasons: []
    });

    this.applyRef = React.createRef();
  }

  handleShow = () => (this.compStore.active = true);
  handleHide = () => (this.compStore.active = false);

  visualMatchups = <h3>No Matchups</h3>;

  // When the modal opens, it starts gettin the the season and poster data and matching it
  handleModalOpen = () => {
    dataStore.seasons = [];
    const { show } = this.props;
    plex.getSeasons(show.api_children);

    // threw some timeouts in to get around async issues but will use Promises later maybe
    setTimeout(() => {
      // parse the posterDB web page for URLs
      // request source-code it from listener in content_scripts/index.js for current tab
      dataStore.posterSeasons = {};
      browser.tabs.query({ active: true, currentWindow: true }).then(tabs => {
        browser.tabs
          .sendMessage(tabs[0].id, { req: 'source-code' })
          .then(response => {
            // use cheerio to parse out URLs with appropriate titles (seasons)
            const dlTitleRegex = /(.+) - (Season [0-9]+|Specials).*/;
            let $ = cheerio.load(response.content);
            $('a')
              .filter((i, link) => {
                return dlTitleRegex.test(link.attribs.download);
              })
              .each((i, link) => {
                const href = link.attribs.href;
                const seasonTitle = link.attribs.download.match(
                  dlTitleRegex
                )[2];

                // save poster URLs to data store
                dataStore.posterSeasons[
                  seasonTitle.toLowerCase()
                ] = href.toLowerCase();
              });
          });
      });
      setTimeout(() => {
        // matchups of posterDB
        dataStore.matchups = {};
        const { seasons, posterSeasons } = dataStore;
        seasons.forEach(({ title, key }) => {
          // pull the key PLEX id out of the season
          const regex_db_id = /\/library\/metadata\/([0-9]+)\//;
          const db_id_match = key.match(regex_db_id);
          if (db_id_match) {
            // if key found
            const db_id = db_id_match[1];
            // get posterDBURL from posterSeasons[seasonTitle]
            const posterDBURL = encodeURIComponent(
              posterSeasons[title.toLowerCase()]
            );
            // add that matchup to the datastore
            dataStore.matchups[title.toLowerCase()] = [db_id, posterDBURL];
          }
        });

        const { matchups } = dataStore;
        console.log(matchups);
        let domNode = ReactDOM.findDOMNode(this.applyRef.current);
        if (domNode) {
          // set the visual matchups that show on screen
          const m = _.cloneDeep(matchups);
          this.visualMatchups = Object.keys(m).map(season => {
            const isMatchedUp = m[season][1] != 'undefined';
            return (
              <p key={season}>
                {season} - {isMatchedUp ? 'matched' : 'unmatched'}
              </p>
            );
          });

          this.compStore.readyToApply = true;
          domNode.addEventListener('click', () => this.handleApply(matchups));
        }
      }, 1500);
    }, 1500);

    this.handleHide();
  };

  // When the apply button is clicked on the modal popup
  handleApply = m => {
    // sends the matchups to background/index.js to make the POST requests
    browser.runtime.sendMessage({ request: 'post_matchups', matchups: m });

    // close the popup
    setTimeout(() => {
      window.close();
    }, 350);
  };

  render() {
    const { readyToApply } = this.compStore;
    const { show } = this.props;

    return (
      <List.Item key={show.id}>
        <Image width="78" height="110" src={show.thumb} />
        <Image />
        <List.Content>
          <Modal
            trigger={
              <List.Header as="a" onClick={this.handleModalOpen}>
                {show.name}
              </List.Header>
            }
          >
            <Modal.Header>PosterDB</Modal.Header>
            <Modal.Content>
              <Modal.Description>
                {/* Gives a little message when matchups are ready */}
                {readyToApply ? this.visualMatchups : 'Matching up seasons...'}
              </Modal.Description>
            </Modal.Content>
            <Modal.Actions>
              {/* Apply button in the modal - grey and disabled until data is ready */}
              <Button
                color={readyToApply ? 'green' : 'grey'}
                disabled={readyToApply ? false : true}
                ref={this.applyRef}
              >
                <Icon name="checkmark" />
                Apply
              </Button>
            </Modal.Actions>
          </Modal>
        </List.Content>
      </List.Item>
    );
  }
}

export default view(SearchItem);
