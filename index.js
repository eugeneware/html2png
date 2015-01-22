var phantomjs = require('phantomjs-bin'),
    webdriver = require('selenium-webdriver'),
    path = require('path');

module.exports = Html2Png;

var URL_REGEX = /^(http|https|file)\:/;

function Html2Png(opts) {
  if (!(this instanceof Html2Png)) {
    return new Html2Png(opts);
  }

  if (typeof opts === 'undefined') opts = {};
  opts.browser = opts.browser || 'phantomjs';
  opts.width = opts.width || 640;
  opts.height = opts.height || 480;
  opts.chromeHeight = opts.chromeHeight || 72;
  opts.scriptTimeout = opts.scriptTimeout || 30*1000;

  this.opts = opts;

  var driver = this.driver = new webdriver.Builder()
  .withCapabilities({
     browserName: opts.browser
  })
  .build();
  driver.manage().timeouts().setScriptTimeout(opts.scriptTimeout);
  driver.get('file:' + path.join(__dirname, 'empty.html'));

  this.resized = false;
}

Html2Png.prototype._resize = function () {
  var driver = this.driver, opts = this.opts;
  if (!this.resized) {
    // remove the chrome 'chrome' from the window size
    driver.manage().window().setSize(opts.width,
      opts.height + (opts.browser === 'chrome' ? opts.chromeHeight : 0));
    this.resized = true;
  }
};

Html2Png.prototype.render = function (html, cb) {
  var self = this, driver = this.driver, opts = this.opts;
  this._resize();

  driver.executeAsyncScript(function(html, opts, cb) {
    document.open('text/html');
    document.onreadystatechange = function () {
      if (document.readyState === 'complete') {
        if (opts.browser === 'chrome') {
          // HACK: Images still not loaded
          setTimeout(cb, 1000);
        } else cb();
      }
    };
    document.write(html);
    document.close();
  }, html, opts);

  driver.takeScreenshot().then(function (data) {
    cb(null, new Buffer(data, 'base64'));
  });
};

Html2Png.prototype.renderUrl = function (url, cb) {
  var self = this, driver = this.driver, opts = this.opts;
  this._resize();

  driver.get(url);

  driver.takeScreenshot().then(function (data) {
    cb(null, new Buffer(data, 'base64'));
  });
};

Html2Png.prototype.close = function (cb) {
  var driver = this.driver;
  if (typeof cb !== 'function') cb = function () {};
  if (driver) {
    driver.quit().then(cb);
  } else cb();
};

Html2Png.prototype.error = function (err, cb) {
  this.close(function () {
    cb(err);
  });
};

