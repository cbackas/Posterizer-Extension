import React from 'react';
import ReactDOM from 'react-dom';
import * as browser from 'webextension-polyfill';
import { view, store } from '@risingstack/react-easy-state';
import { Button, Dimmer, Header, Image, Modal, Icon } from 'semantic-ui-react';

import dataStore from '../dataStore';
const plex = require('../../lib/js/plex');

// const request = require('request');
const cheerio = require('cheerio');

const dlTitleRegex = /(.+) - (Season [0-9]+|Specials).*/;
const isPosterDownload = (i, link) => {
  return dlTitleRegex.test(link.attribs.download);
};

// this is all contained inside each plex show on the search list
class DimmerImage extends React.Component {
  constructor(props) {
    super(props);

    this.compStore = store({
      active: false,
      readyToApply: false
    });

    this.applyRef = React.createRef();
  }

  handleShow = () => (this.compStore.active = true);
  handleHide = () => (this.compStore.active = false);

  // When the modal opens, it starts gettin the the season and poster data and matching it
  handleOpen = () => {
    dataStore.seasons = [];
    const { show } = this.props;
    plex.getSeasons(show.key);

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
            let $ = cheerio.load(response.content);
            $('a')
              .filter(isPosterDownload)
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

        let token = '';
        const storageItem = browser.storage.local.get('token');
        storageItem.then(res => {
          token = res.token;

          seasons.forEach(({ title, key }) => {
            const posterDBURL = encodeURIComponent(
              posterSeasons[title.toLowerCase()]
            );
            const path = key.replace(
              'children',
              'posters?includeExternalMedia=1&url='
            );
            const postURL =
              'http://10.20.0.10:32400' +
              path +
              posterDBURL +
              `&X-Plex-Token=${token}`;
            dataStore.matchups[title.toLowerCase()] = postURL;
          });

          const { matchups } = dataStore;
          let domNode = ReactDOM.findDOMNode(this.applyRef.current);
          if (domNode) {
            this.compStore.readyToApply = true;
            domNode.addEventListener('click', () => this.handleApply(matchups));
          }
        });
      }, 1500);
    }, 1500);

    this.handleHide();
  };

  // When the apply button is clicked on the modal popup
  handleApply = m => {
    // sends the matchups to background/index.js to make the POST requests
    browser.runtime.sendMessage({ request: 'postbois', matchups: m });

    // close the popup
    setTimeout(() => {
      window.close();
    }, 500);
  };

  render() {
    const { active, readyToApply } = this.compStore;
    const content = (
      <div>
        <Header as="h2" inverted content="Posterize" />
        <Modal
          trigger={<Button primary onClick={this.handleOpen} content="Go" />}
        >
          <Modal.Header>PosterDB</Modal.Header>
          <Modal.Content>
            <Modal.Description>
              {/* Gives a little message when matchups are ready */}
              {/* TODO more info about matchups here?? */}
              {readyToApply ? 'Ok lets give it a go' : 'nothing matched up yet'}
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
      </div>
    );

    const { show } = this.props;

    return (
      <Dimmer.Dimmable
        as={Image}
        inline
        fluid
        centered
        verticalAlign="middle"
        dimmed={active}
        dimmer={{ active, content }}
        onMouseEnter={this.handleShow}
        onMouseLeave={this.handleHide}
        src={'https://10.20.0.10:32400' + show.thumb}
      />
    );
  }
}

export default view(DimmerImage);