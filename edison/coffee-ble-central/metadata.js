var http = require('http');
var chalk = require('chalk');
module.exports = function (urldata) {
  var urls = JSON.stringify({ 'objects': urldata });
  var headers = {
    'Content-Type': 'application/json',
    'Content-Length': urls.length
  };
  var options = {
    'host': 'service.physical-web.org',
    'port': 80,
    'path': '/resolve-scan',
    'method': 'POST',
    'headers': headers
  };
  var urlOnly = function () {
    var data = JSON.parse(urls);
    for (var i in data.objects) {
      if (data.objects.hasOwnProperty(i)) {
        console.log(chalk.underline.bgBlue(' ' + data.objects[i].url + ' '));
        console.log(data.objects[i].url);
      }
    }
  };
  var req = http.request(options, function (res) {
    res.setEncoding('utf-8');
    var responseString = '';
    res.on('data', function (data) {
      responseString += data;
    });
    res.on('end', function () {
      try {
        var response = JSON.parse(responseString);
        for (var i in response.metadata) {
          if (response.metadata.hasOwnProperty(i)) {
            var data = response.metadata[i];
            console.log(chalk.underline.bgBlue(' ' + data.title + ' '));
            console.log(chalk.gray(data.description));
            console.log(data.displayUrl);
            console.log();
          }
        }
      } catch (e) {
        console.log(chalk.underline.bgRed('Error: ' + e));
        console.log();
        urlOnly();
      }
    });
  });
  req.on('error', function (e) {
    console.log(chalk.underline.bgRed('Error: ' + e));
    console.log();
    urlOnly();
  });
  req.write(urls);
  req.end();
};