# html2png

Take a screenshot of a HTML fragment or URL

[![build status](https://secure.travis-ci.org/eugeneware/html2png.png)](http://travis-ci.org/eugeneware/html2png)

## Installation

This module is installed via npm:

``` bash
$ npm install html2png
```

## Example Usage

Render some HTML into a PNG Buffer Object

``` js
var html2png = require('html2png');
var screenshot = html2png({ width: 1280, height: 720, browser: 'phantomjs'});
screenshot.render('<b>Hello</b>', function (err, data) {
  // If there is an error close the web browser first before calling the
  // errback
  if (err) return screenshot.error(err, cb);

  // data will contain a screenshot of the HTML as a node.js Buffer
  console.log(data);
  //<Buffer 89 50 4e 47 0d 0a 1a 0a 00 00 00 0d 49 48 44 52 00 00 02 80 ...>

  // Close the web browser (phantomjs or chrome)
  screenshot.close(done);
});
```

## API

### html2png([options])

The constructor is passed an options object:

* `width`, `height` - the width and height of the browser. NB: This is not the
maximum dimensions of each screenshot. So if the rendered page is higher than
`height` the screenshot returned will be the full rendered height of the page.
* `browser` - The browser to use for rendering. By default this is `phantomjs`
and this module bundles together a static binary of phantomjs with
[phantomjs-bin](https://github.com/eugeneware/phantomjs-bin). If you have
Google Chrome installed and `chromedriver` is in your `PATH`, then you can
render with Chrome.

## html2png#render(html, cb)

Renderes `html` into a PNG node.js `Buffer` and returns the data in the
callback.

## html2png#renderUrl(url, cb)

Renders the URL `url` into a PNG node.js `Buffer` and returns the data in the
callback.

## html2png#close(cb);

Closes the underlying webdriver web browser used for the rendering (eg.
Phantomjs or Chrome). Highly recommended.

## html2png#error(err, cb)

Helper method that will call `#close` first, before calling the usual errback
with the error.
