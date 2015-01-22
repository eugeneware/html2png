var expect = require('expect.js'),
    fs = require('fs'),
    sizeOf = require('image-size'),
    path = require('path'),
    async = require('async'),
    html2png = require('..');

describe('html2png', function() {
  it('should be able to render basic HTML', function(done) {
    this.timeout(0);
    var screenshot = html2png();
    screenshot.render('<b>Hello</b>', function (err, data) {
      if (err) return screenshot.error(err, done);
      expect(sizeOf(data)).to.eql({ width: 640, height: 480, type: 'png' });
      screenshot.close(done);
    });
  });

  it('should be able to render a custom image size', function(done) {
    this.timeout(0);
    var screenshot = html2png({ width: 1280, height: 720 });
    screenshot.render('<b>Hello</b>', function (err, data) {
      if (err) return screenshot.error(err, done);
      expect(sizeOf(data)).to.eql({ width: 1280, height: 720, type: 'png' });
      screenshot.close(done);
    });
  });

  it('should keep phantomjs open', function(done) {
    this.timeout(0);
    var screenshot = html2png();
    async.map(['<b>Hello</b>', '<b>World</b>', 'Today'],
      screenshot.render.bind(screenshot),
      function (err, results) {
        if (err) return screenshot.error(err, done);
        expect(results.length).to.equal(3);
        results.forEach(function (data, i) {
          expect(sizeOf(data)).to.eql({ width: 640, height: 480, type: 'png' });
        });
        screenshot.close(done);
      });
  });

  it('should be able to render a URL', function(done) {
    this.timeout(0);
    var filePath = path.join(__dirname, 'fixtures', 'hello.html');
    var screenshot = html2png();
    screenshot.renderUrl('file:' + filePath, function (err, data) {
      if (err) return screenshot.error(err, done);
      expect(sizeOf(data)).to.eql({ width: 640, height: 480, type: 'png' });
      screenshot.close(done);
    });
  });
});
