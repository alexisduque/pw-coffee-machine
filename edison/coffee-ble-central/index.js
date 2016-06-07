var noble = require('noble');
var chalk = require('chalk');
var urldecode = require('./urldecode.js');
var metadata = require('./metadata.js');
var Edison = require('edison-io');
var led = '';
var timer = '';
var relay = '';
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
  console.log(chalk.dim('Device found: ' + peripheral.advertisement.localName));
  if (serviceData && serviceData.length) {
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
      relay.on();
    }
  }
});
