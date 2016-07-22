var http = require('https');
var chalk = require('chalk');
var url = require('url');
var q = require('q');
var host = 'physical-web-coffee.firebaseio.com';
var db_auth = 'PKTVsQeBKkbvconZxm7C25vY6w16HtQawD7PVUHt';
module.exports = function (user) {
  console.log();
  var deferred = q.defer();
  var data = user.coffee;
  if (data.hasOwnProperty('hotDuration')) {
    console.log(chalk.underline.bgBlue(' ' + data.title + ' '));
    console.log(chalk.underline.bgGreen('User:') + ' ' + data.user);
    console.log(chalk.underline.bgGreen('Hot:') + ' ' + data.hotDuration);
    console.log(chalk.underline.bgGreen('Taste:') + ' ' + data.taste);
    console.log(chalk.underline.bgGreen('PW Enabled:') + ' ' + data.pwEnabled);
    console.log(chalk.underline.bgGreen('Cup:') + ' ' + data.cup);
    console.log(chalk.underline.bgGreen('Milk:') + ' ' + data.milk);
    console.log(chalk.underline.bgGreen('Sugar:') + ' ' + data.sugar);
    console.log(chalk.underline.bgGreen('Uid:') + ' ' + data.uid);
    console.log();
  } else {
    console.log(chalk.underline.bgRed('Invalid JSON: ' + data));
    console.log();
    deferred.reject('Missing content');
  }
  var bodyString = JSON.stringify({
    user: data.user,
    uid: data.uid,
    date: new Date().getTime(),
    type: data.taste,
    cup: data.cup,
    milk: data.milk,
    sugar: data.sugar
  });
  var headers = {
    'Content-Type': 'application/json',
    'cache-control': 'no-cache'
  };
  var options = {
    host: host,
    path: '/pending.json?auth=' + db_auth,
    method: 'POST',
    port: null,
    header: headers
  };
  var req = http.request(options, function (resp) {
    resp.setEncoding('utf-8');
    var responseString = '';
    resp.on('data', function (chunk) {
      responseString += chunk;
    });
    resp.on('end', function () {
      try {
        var response = JSON.parse(responseString);
        console.log(chalk.underline.bgGreen('Created: ' + response.name));
        deferred.resolve({
          'user': user,
          'scheduleId': response.name
        });
      } catch (e) {
        console.log(chalk.underline.bgRed('Error: ' + e));
        console.log();
        deferred.reject('Missing content');
      }
    });
  });
  req.on('error', function (e) {
    console.log(chalk.underline.bgRed('Error: ' + e));
    console.log();
    deferred.reject('Invalid URL');
  });
  req.write(bodyString);
  req.end();
  return deferred.promise;
};
