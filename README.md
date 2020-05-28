# Posterizer browser extension for PosterDB and Plex

Posterizer is made to quickly POST image URLs to Plex Media Server directly from the web while browsing poster sets on [ThePosterDB.com](https://theposterdb.com/)

When looking at a TV show poster set while logged into ThePosterDB, the extension can be used to search for a show in your Plex library. Once a show is selected, the extension parses the HTML to find download URLs of each season poster and matches it up to the corresponding season in Plex which results in a list of POST URLs that can be used to update plex images. This means you don't need to right click on each image's download button, copy the url, then walk through the Plex edit menus and paste the URL.

As of now this project has hard coded internal IP addresses for API calls as it's for personal use. Thing's needed before it's ready for public use:
<em>
  
  :x: Remove hard coded IP address calls and use Plex API <br/>
  :x: Fix matching for 'Specials' posters <br/>
  :x: Detection for API failure and request user/pass auth again / clearing of token out of storage <br/>
  :x: Plex oAUTH instead of simple form/API combo <br/>
  :x: Movie compatability? <br/>
  :x: PosterDB API instead of parsing? <br/>

</em>

*Built using [React Extension Boilerplate](https://github.com/kryptokinght/react-extension-boilerplate)*


## Installation

*Before you begin installing this project you need [**NodeJS**](https://nodejs.org/en/) and [**npm**](https://www.npmjs.com/get-npm) installed on your machine. Make sure to install the latest version of node.*

```bash
# clone the git repo
$ git clone https://gitlab.com/cbackas/posterizer-extension.git

# Install dependencies
$ npm install
```

## Development

* Run script
```bash
# build files to './dev' 
# and launches the web ext in a new chrome instance, watches for changes and updates
$ npm run start:chrome
# launches in firefox
$ npm run start:firefox
# runs storybook
$ npm run storybook
```

* If you want to load your unpacked extension by yourself, then run `npm run dev`. This will create the extension inside an **dev** folder in `development` mode and will watch the `src` folder for changes.   
* [Load unpacked extensions](https://developer.chrome.com/extensions/getstarted#unpacked) with `./dev` folder. Though you have to reload the extension by yourself every time the `./dev` folder updates.
  
These assets are copied as it is to the build folder, just like the `/src/lib` folder.


## Build

```bash
# build files to './extension'
$ npm run build
```


## Compress

```bash
# compress build folder to {manifest.name}.zip and crx
$ npm run build
$ npm run compress -- [options]
```

## License

The code is available under the [MIT license](LICENSE).
