var util = require('util');
var os = require('os');
var bleno = require('eddystone-beacon/node_modules/bleno');
var eddystone = require('eddystone-beacon');
var five = require('johnny-five');
var Edison = require('edison-io');
var led = '';
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
var name = 'PW_Coffee';
var url = 'https://goo.gl/TWmm3H';
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
  led.off();
  led.blink();
}
