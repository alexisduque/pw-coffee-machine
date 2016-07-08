var noble = require('noble');
var chalk = require('chalk');
var FCM = require('fcm-push');
var serverKey = 'AIzaSyDkgbBA2Hc1U94c0cssPhO3v0Qj_KABQPs';
var fcm = new FCM(serverKey);
var urldecode = require('./urldecode.js');
var userdata = require('./userdata.js');
var schedule = require('./schedule.js');
var notify = require('./notify.js');
var led = {};
var brew = {};
var resetMachine = {};
var relay = {};
var brewScheduled = false;
var brewDuration = 60;
var resetInterval = 50 * 60;
var objects = [];
var scheduledCoffee = [];
var data =  {
  hotDuration: 10,
  cup: 2,
  taste: 'Espresso'
};
if (process.env.TEST !== '1') {
  var five = require('johnny-five');
  var Edison = require('edison-io');
  var board = new five.Board({ io: new Edison() });
  board.on('ready', function () {
    led = new five.Led('J19-6');
    relay = new five.Relay('J19-10');
    relay.off();
    led.on();
  });
  board.on('warn', function () {
    led.off();
    led.stop();
    relay.off();
  });
} else {
  // notify('-KLknPTAzP1H5g9dEeB4').then(function(data) {});
  // schedule(data);
  var message = {
      to: 'dpEsYqVCNkM:APA91bFJf6T0izwbcUiNGSnIiJgY_eGZjLLG3rxF_zGo3QWE2v2BGB1QXbjQUnxfVpzvwh7aYM0TvdmBch90k5r9pDX1nyutmgtpHFRCwm8TRvfD1VMuaIAFOw4VeiT6VgSQ-53qvPag', // required
  };
  fcm.send(message, function(err, response){
      if (err) {
          console.log("Something has gone wrong!");
      } else {
          console.log("Successfully sent with response: ", response);
      }
  });
  led.off = function () {
    console.log(chalk.underline.bgRed('LED OFF !'));
  };
  led.on = function () {
    console.log(chalk.underline.bgBlue('LED ON'));
  };
  led.blink = function () {
    console.log(chalk.underline.bgBlue('LED BLINKING'));
  };
  led.stop = function () {
    console.log(chalk.underline.bgRed('LED STOP'));
  };
  relay.on = function () {
    console.log(chalk.underline.bgBlue('Relay ON'));
  };
  relay.off = function () {
    console.log(chalk.underline.bgRed('Relay OFF !'));
  };
}

noble.on('stateChange', function (state) {
  if (state === 'poweredOn') {
    noble.startScanning(['fed8'], true);
  } else {
    noble.stopScanning();
  }
});
noble.on('scanStart', function () {
  console.log(chalk.dim('Scan started...'));
  console.log();
  led.off();
  led.blink();
  userdata({url: 'https://goo.gl/7LGLLK'});
});
noble.on('scanStop', function () {
  console.log(chalk.dim('Scan stopped...'));
  console.log();
  led.stop();
});
noble.on('discover', function (peripheral) {
  var serviceData = peripheral.advertisement.serviceData;
  console.log(chalk.dim('Device found: ' + peripheral.address));
  if (serviceData && serviceData.length && !brewScheduled) {
    for (var i in serviceData) {
      // check if Eddystone-URL
      var hexData = serviceData[i].data.toString('hex');
      if (hexData.substr(0, 2) === '00') {
        var url = urldecode(hexData);
        var object = { 'url': url };
      }
    }
    if (object && !objects.length && !brewScheduled) {
      objects.push(object);
      userdata(objects[0]).then(function(data) {
        if (data.pwEnabled) {
          console.log(chalk.underline.bgGreen('Coffee is brewing !'));
          pending(data).then(function(data) {
            scheduledCoffee.push(data);
            notify(data).then(function(data) {
            });
          });
          brewScheduled = true;
          keepHot = data.hot ? data.hotDuration * 60 : 0;
          brewDuration = data.cup * 180 + keepHot;
          relay.on();
          brew = new Promise(function (resolve, reject) {
            setTimeout(resolve, brewDuration * 1000);
          });
          resetMachine = new Promise(function (resolve, reject) {
            setTimeout(resolve, resetInterval * 1000);
          });
          brew.then(function () {
            console.log(chalk.underline.bgGreen('Coffee Ready !'));
            relay.off();
            var coffeeId = scheduledCoffee.shift();
            notify(coffeeId).then(function(data) {
              scheduledCoffee.push(data);
            });
            return reset;
          });
          resetMachine.then(function () {
            console.log(chalk.underline.bgYellow('Machine reset'));
            brewScheduled = false;
            objects.pop();
          })
        } else {
          objects.pop();
        }
      }).catch(function (e) {
        objects.pop();
        console.log(chalk.underline.bgRed('Error: ' + e));
        console.log();
      });
    }
  }
});
