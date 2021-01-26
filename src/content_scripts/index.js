import * as browser from 'webextension-polyfill';

console.log('Content scripts has loaded');

// listens for a request to read source code - returns a promise with the loaded page's HTML
browser.runtime.onMessage.addListener(request => {
  var response = '';
  if (request.req === 'source-code') {
    response = document.documentElement.innerHTML;
  }
  return Promise.resolve({ content: response });
});