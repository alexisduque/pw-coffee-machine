var http = require('https');
var chalk = require('chalk');
var url = require('url');
var q = require('q');
var host = 'physical-web-coffee.firebaseio.com';
var db_auth = 'PKTVsQeBKkbvconZxm7C25vY6w16HtQawD7PVUHt';
module.exports = function (scheduleId) {
  var deferred = q.defer();
  console.log();
  console.log(chalk.underline.bgBlue(' Coffee ' + scheduleId + ' ready '));
  console.log();
  var options = {
    host: host,
    path: '/pending/' + scheduleId + '.json?auth=' + db_auth,
    method: 'DELETE',
    port: null,
    header: null
  };
  var req = http.request(options, function (resp) {
    resp.setEncoding('utf-8');
    var responseString = '';
    resp.on('data', function (chunk) {
      responseString += chunk;
    });
    resp.on('end', function () {
      console.log(chalk.underline.bgGreen('Deleted'));
      deferred.resolve();
    });
  });
  req.on('error', function (e) {
    console.log(chalk.underline.bgRed('Error: ' + e));
    console.log();
    deferred.reject('Invalid URL');
  });
  req.end();
  return deferred.promise;
};