# Posterizer browser extension for PosterDB and Plex

Posterizer is made to quickly POST image URLs to Plex Media Server directly from the web while browsing poster sets on [theposterdb.com](https://theposterdb.com/)

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


## Compress :nut_and_bolt: 

```bash
# compress build folder to {manifest.name}.zip and crx
$ npm run build
$ npm run compress -- [options]
```

## License

The code is available under the [MIT license](LICENSE).
