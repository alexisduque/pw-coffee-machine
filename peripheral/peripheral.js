var util = require('util');
var os = require('os');
var bleno = require('eddystone-beacon/node_modules/bleno');
var eddystone = require('eddystone-beacon');

if (process.arch !== 'x64') {
  var five = require('johnny-five');
  var Edison = require('edison-io');
  var led;
  var board = new five.Board({ io: new Edison() });
  board.on('ready', function () {
    led = new five.Led('J19-6');
    led.on();
  });
  board.on('warn', function () {
    led.off();
  });
}

var name = 'PW_Coffee';
var url = 'https://google.fr';
bleno.on('stateChange', function (state) {
  console.log('on -> stateChange: ' + state);
  if (state === 'poweredOn') {
    bleno.startAdvertising();
    startBeacon();
  } else {
    bleno.stopAdvertising();
  }
});
bleno.on('advertisingStart', function (error) {
  console.log('on -> advertisingStart: ' + (error ? 'error ' + error : 'success'));
  if (error) {
    console.error('Can not start advertising');
    exit();
  }
});
function startBeacon() {
  console.log('Starting beacon.');
  var config = { 'name': name };
  eddystone.advertiseUrl(url, config);
}
