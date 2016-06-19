var https = require('follow-redirects').https;
var chalk = require('chalk');
var url = require('url');
var q = require('q');
module.exports = function (urldata) {
  console.log();
  var deferred = q.defer();
  var myUrl = url.parse(urldata.url);
  var options = {
    host: myUrl.hostname,
    port: myUrl.port,
    path: myUrl.path,
    method: 'GET',
    agent: false
  };
  var req = https.get(options, function(resp){
    resp.setEncoding('utf-8');
    var responseString = '';
    if (resp.headers['content-type'] !== 'application/json; charset=utf-8') {
      console.log(chalk.underline.bgRed('Error: ' + resp.headers['content-type']));
      console.log();
      deferred.reject('Invalid content');
    }
    resp.on('data', function(chunk){
      responseString += chunk;
    });
    resp.on('end', function () {
      try {
        var response = JSON.parse(responseString);
        for (var i in response) {
          if (response.hasOwnProperty(i)) {
            var data = response[i];
            if (data.hasOwnProperty('hotDuration')) {
              console.log(chalk.underline.bgBlue(' ' + data.title + ' '));
              console.log(chalk.underline.bgGreen('Hot:') + ' ' + data.hotDuration);
              console.log(chalk.underline.bgGreen('Taste:') + ' ' + data.taste);
              console.log();
              deferred.resolve(data);
            } else {
              console.log(chalk.underline.bgRed('Invalid JSON: ' + data));
              console.log();
              deferred.reject('Missing content');
            }

          }
        }
      } catch (e) {
        console.log(chalk.underline.bgRed('Error: ' + e));
        console.log();
        deferred.reject('Missing content');
      }
    });
  });
  req.on("error", function(e){
    console.log(chalk.underline.bgRed('Error: ' + e));
    console.log();
    deferred.reject('Invalid URL');
  });
  req.end();
  return deferred.promise;
};
