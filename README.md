# Posterizer browser extension for PosterDB and Plex

#### !! Using this extension in it's current state is against The PosterDB terms of service. A few lines of code "scrape" URLs out of the loaded page which is against the TOS. This extension mostly serves as a proof of concept for now until the PosterDB team releases an API that can be used. This extension wont be made available on the mozilla extension store until then.

Posterizer is made to quickly POST image URLs to Plex Media Server directly from the web while browsing poster sets on [ThePosterDB.com](https://theposterdb.com/)

When looking at a TV show poster set while logged into ThePosterDB, the extension can be used to search for a show in your Plex library. Once a show is selected, the extension parses the HTML to find download URLs of each season poster and matches it up to the corresponding season in Plex which results in a list of POST URLs that can be used to update plex images. This means you don't need to right click on each image's download button, copy the url, then walk through the Plex edit menus and paste the URL - saving a crazy amount of time with no additional requests to either Plex or the PosterDB!

#### Screenshots
Search                     |  Apply                    |  Recording               |
:-------------------------:|:-------------------------:|:-------------------------:
<img src="https://raw.githubusercontent.com/cbackas/Posterizer-Extension/master/screenshots/search.png" width="300" /> | <img src="https://raw.githubusercontent.com/cbackas/Posterizer-Extension/master/screenshots/apply.png" width="300" /> | <img src="https://raw.githubusercontent.com/cbackas/Posterizer-Extension/master/screenshots/recording.gif" width="300" />

### ToDo before it would be ready for public use:
<em>
  
  :white_check_mark: Plex oAUTH instead of simple form/API combo <br/>
  :white_check_mark: Ability to clear auth and cache <br/>
  :white_check_mark: Replace hard coded IP address calls to Plex API<br/>
  :white_check_mark: Fix matching for 'Specials' posters <br/>
  :large_orange_diamond: Detect API failure and respond appropriately <br/>
  :x: Movie/Collection compatability? <br/>
  :x: **PosterDB API instead of pulling from HTML** <br/>

</em>

*Built using [React Extension Boilerplate](https://github.com/kryptokinght/react-extension-boilerplate)*

## License

The code is available under the [MIT license](LICENSE).
