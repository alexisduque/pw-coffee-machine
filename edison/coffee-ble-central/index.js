// Set this envars to be able to detect the beacon again
// when it changes its apparence and local_name
process.env.NOBLE_REPORT_ALL_HCI_EVENTS=1

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

var resetMachine = new Promise(function (resolve, reject) {
  setTimeout(resolve, resetInterval * 1000);
});
resetMachine.then(function () {
  console.log(chalk.underline.bgYellow('Machine reset'));
  brewScheduled = false;
  objects = [];
});

noble.on('discover', function (peripheral) {
  var serviceData = peripheral.advertisement.serviceData;
  var object = {};
  if (serviceData && serviceData.length) {
    for (var i in serviceData) {
      // check if Eddystone-URL
      var hexData = serviceData[i].data.toString('hex');
      if (hexData.substr(0, 2) === '10') {
        var url = urldecode(hexData);
        object = { 'device': peripheral.address, 'url': url, 'brewed': false };
      }
    }
    if (!object.url) {
      console.log(chalk.dim('Device found but not a Eddystone URL: ' + peripheral.address));
      return;
    }
    var found = false;
    for(var j = 0; j < objects.length; j++) {
      if (objects[j].device === object.device && objects[j].url === object.url) {
          found = true;
          console.log(chalk.dim('Eddystone URL found but allread scheduled: ' + peripheral.address));
          break;
      }
    }
    if (!found) {
      objects.push(object);
      userdata(objects[0]).then(function (user) {
        var coffee = user.coffee;
        console.log(JSON.stringify(coffee));
        var data = coffee;
        if (data.pwEnabled) {
          console.log(chalk.underline.bgGreen('Coffee is brewing !'));
          schedule(user).then(function (data) {
            scheduledCoffee.push(data);
            if (!brewScheduled && process.env.SIM !== '1'){
              processCoffee();
            }
          });
        } else {
          objects.shift();
        }
      }).catch(function (e) {
        objects.shift();
        console.log(chalk.underline.bgRed('Eddystone URL found but unable to retrieve valid coffee settings: ' + e ));
        console.log();
      });
    }
  }
});

var processCoffee = function() {
  brewScheduled = true;
  console.log(chalk.underline.bgGreen('Processing Coffee'));
    var schedule = scheduledCoffee.shift();
    var data = schedule.user.coffee;
    if (!data.hot ) {
      console.log(chalk.underline.bgYellow('Skipped'));
      brewScheduled = false;
      return;
    }
    keepHot = data.hot ? data.hotDuration * 0 : 0;
    brewDuration = data.cup * 20  + keepHot;
    relay.on();
    led.stop();
    led.on();
    brew = new Promise(function (resolve, reject) {
      setTimeout(resolve, brewDuration * 1000);
    });
    brew.then(function () {
      console.log(chalk.underline.bgGreen('Coffee Ready !'));
      relay.off();
      led.off();
      led.blink();
      var coffeeId = schedule.scheduleId;
      push(schedule);
      notify(coffeeId);
      var object = objects.shift();
      object.brewed = true;
      objects.push(object);
      if (scheduledCoffee.length > 0) {
        processCoffee();
      } else {
        brewScheduled = false;
      }
    });
};
