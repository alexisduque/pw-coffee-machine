var noble = require('noble');
var chalk = require('chalk');
var push = require('./push.js');
var urldecode = require('./urldecode.js');
var userdata = require('./userdata.js');
var schedule = require('./schedule.js');
var notify = require('./notify.js');
var test = require('./test.js');
var led = {};
var brew = {};
var resetMachine = {};
var relay = {};
var brewScheduled = false;
var brewDuration = 60;
var resetInterval = 50 * 60;
var objects = [];
var scheduledCoffee = [];
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
  //test.schedule();
  //test.push();
  //test.notify();
  //test.userdata();
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
    noble.startScanning(['fed8', 'feaa'], true);
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
    for (var i in serviceData) {
      // check if Eddystone-URL
      var hexData = serviceData[i].data.toString('hex');
      if (hexData.substr(0, 2) === '10') {
        var url = urldecode(hexData);
        var object = { 'url': url };
      }
    }
    if (object && !objects.length && !brewScheduled) {
      objects.push(object);
      userdata(objects[0]).then(function (user) {
        var coffee = user.coffee;
        console.log(JSON.stringify(coffee));
        var data = coffee;
        if (data.pwEnabled) {
          console.log(chalk.underline.bgGreen('Coffee is brewing !'));
          schedule(user).then(function (data) {
            scheduledCoffee.push(data);
          });
          brewScheduled = true;
          keepHot = data.hot ? data.hotDuration * 60 : 0;
          brewDuration = data.cup * 20  + keepHot;
          relay.on();
          led.stop();
          led.on();
          brew = new Promise(function (resolve, reject) {
            setTimeout(resolve, brewDuration * 1000);
          });
          resetMachine = new Promise(function (resolve, reject) {
            setTimeout(resolve, resetInterval * 1000);
          });
          brew.then(function () {
            console.log(chalk.underline.bgGreen('Coffee Ready !'));
            relay.off();
            led.off();
            led.blink();
            var schedule = scheduledCoffee.shift();
            var coffeeId = schedule.scheduleId;
            push(schedule);
            notify(coffeeId);
          });
          resetMachine.then(function () {
            console.log(chalk.underline.bgYellow('Machine reset'));
            brewScheduled = false;
            objects.pop();
          });
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
