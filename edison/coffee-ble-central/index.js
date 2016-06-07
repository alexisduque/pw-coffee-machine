var noble = require('noble');
var chalk = require('chalk');
var urldecode = require('./urldecode.js');
var metadata = require('./metadata.js');
var led = {};
var brew = {};
var resetMachine = {};
var relay = {};
var brewScheduled = false;
var brewDuration = 60;
var resetInterval = 5 * 60;
if (process.env.TEST !== '1') {
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
    relay.off();
  });
} else {
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
    noble.startScanning(['feaa'], true);
  } else {
    noble.stopScanning();
  }
});
noble.on('scanStart', function () {
  console.log(chalk.dim('Scan started...'));
  console.log();
  led.off();
  led.blink();
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
    var objects = [];
    for (var i in serviceData) {
      // check if Eddystone-URL
      if (serviceData[i].data.toString('hex').substr(0, 2) === '10') {
        var url = urldecode(serviceData[i].data.toString('hex'));
        objects.push({ 'url': url });
      }
    }
    if (objects.length) {
      metadata(objects);
      console.log(chalk.underline.bgGreen('Coffee is brewing !'));
      brewScheduled = true;
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
        return reset;
      });
      resetMachine.then(function () {
        console.log(chalk.underline.bgYellow('Machine reset'));
        brewScheduled = false;
      });
    }
  }
});