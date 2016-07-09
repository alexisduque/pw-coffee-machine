var FCM = require('fcm-push');
var serverKey = 'AIzaSyDkgbBA2Hc1U94c0cssPhO3v0Qj_KABQPs';
var fcm = new FCM(serverKey);
var chalk = require('chalk');
var q = require('q');
var host = 'physical-web-coffee.firebaseio.com';
var db_auth = 'PKTVsQeBKkbvconZxm7C25vY6w16HtQawD7PVUHt';
module.exports = function (data) {
  console.log();
  console.log(chalk.underline.bgBlue(' Send Push Notification to: ') + JSON.stringify(data));
  console.log();
  var promises = [];
  var targets = Object.keys(data.user.subscription);
  targets.forEach(function (val) {
    promises.push(sendPush(val));
  });
  function sendPush(dest) {
    var deferred = q.defer();
    var message = { to: dest };
    fcm.send(message, function (err, response) {
      if (err) {
        console.log('Something has gone wrong!');
        deferred.reject(err);
      } else {
        console.log('Successfully sent with response: ', response);
        deferred.resolve();
      }
    });
    return deferred.promise;
  }
  q.all(promises).finally(function () {
    console.log('All Good !');
  });
};