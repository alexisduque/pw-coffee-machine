var push = require('./push.js');
var urldecode = require('./urldecode.js');
var userdata = require('./userdata.js');
var schedule = require('./schedule.js');
var notify = require('./notify.js');
var self = this;
module.exports = {
  self: this,
  user: {
    'coffee': {
      '-KNHJ61GYK4VJ5d6dUaN': {
        'body': '',
        'cup': 10,
        'hot': true,
        'hotDuration': 20,
        'pwEnabled': true,
        'taste': 2,
        'title': 'Your coffee machine configuration',
        'user': 'Alexis Duque',
        'user_uid': 'NV3qodvAKLW7Iiwh29BvcWAw4UH3'
      }
    },
    'subscription': {
      'd0j3Dfwm7gQ:APA91bFCqoCs5BlNrSQsSKgvzq6KnLv0YQ6T2PG2ktfSVIcAVCtb4bCKJdu6XFt4NSDpeMJNbt9BDqsNCxrrxuUSv52bUxcSykB22o5GnF_GEnRb-yTx2GlaPvXlRo2gbGjKgF5gqM_w': { 'date': '08/07/2016 à 17:34:29' },
      'dpEsYqVCNkM:APA91bFJf6T0izwbcUiNGSnIiJgY_eGZjLLG3rxF_zGo3QWE2v2BGB1QXbjQUnxfVpzvwh7aYM0TvdmBch90k5r9pDX1nyutmgtpHFRCwm8TRvfD1VMuaIAFOw4VeiT6VgSQ-53qvPag': { 'date': '08/07/2016 à 21:33:28' },
      'e23Yy-pMbns:APA91bFE3Z6z1rYF7_h558QZu-G6VQTG2pdf-4nnx2UMlKPq7Rz6TEbonclvKAhlVzVBFFievbNy-9kJeEr2opwJQKJCFWsdXGKceevmvGKD9t8adm1WRfTTdSV-TdWSWo3AyP95FMeT': { 'date': '8/7/2016 17:31:21' },
      'ecjM_rFD524:APA91bFCLr8UqupyHf_ZPyZ3xeQqIuMZveZzQDoDCR5NK7qQgDqer0I7-jlaKKTuDDGQJSWS5UFaFUv5ZAJJmxsAZZaietIGtTOPmWmpHPvV-k5o6LbpCkxSoB8oQeMLWe-hwHiXzeXa': { 'date': '09/07/2016 à 09:56:07' }
    },
    'url': { 'value': 'https://goo.gl/ptgcCw' }
  },
  userForSchedule: {
    'coffee': {
      'body': '',
      'milk': 3,
      'sugar': 4,
      'cup': 10,
      'hot': true,
      'hotDuration': 20,
      'pwEnabled': true,
      'taste': 2,
      'title': 'Your coffee machine configuration',
      'user': 'Alexis Duque'
    },
    'subscription': {
      'd0j3Dfwm7gQ:APA91bFCqoCs5BlNrSQsSKgvzq6KnLv0YQ6T2PG2ktfSVIcAVCtb4bCKJdu6XFt4NSDpeMJNbt9BDqsNCxrrxuUSv52bUxcSykB22o5GnF_GEnRb-yTx2GlaPvXlRo2gbGjKgF5gqM_w': { 'date': '08/07/2016 à 17:34:29' },
      'dpEsYqVCNkM:APA91bFJf6T0izwbcUiNGSnIiJgY_eGZjLLG3rxF_zGo3QWE2v2BGB1QXbjQUnxfVpzvwh7aYM0TvdmBch90k5r9pDX1nyutmgtpHFRCwm8TRvfD1VMuaIAFOw4VeiT6VgSQ-53qvPag': { 'date': '08/07/2016 à 21:33:28' },
      'e23Yy-pMbns:APA91bFE3Z6z1rYF7_h558QZu-G6VQTG2pdf-4nnx2UMlKPq7Rz6TEbonclvKAhlVzVBFFievbNy-9kJeEr2opwJQKJCFWsdXGKceevmvGKD9t8adm1WRfTTdSV-TdWSWo3AyP95FMeT': { 'date': '8/7/2016 17:31:21' },
      'ecjM_rFD524:APA91bFCLr8UqupyHf_ZPyZ3xeQqIuMZveZzQDoDCR5NK7qQgDqer0I7-jlaKKTuDDGQJSWS5UFaFUv5ZAJJmxsAZZaietIGtTOPmWmpHPvV-k5o6LbpCkxSoB8oQeMLWe-hwHiXzeXa': { 'date': '09/07/2016 à 09:56:07' }
    },
    'url': { 'value': 'https://goo.gl/ptgcCw' }
  },
  push: function () {
    push(this.user).finally(function (obj) {
      console.log(obj);
    });
  },
  schedule: function () {
    var coffee = this.user.coffee;
    var data = coffee[Object.keys(coffee)[0]];
    schedule(this.userForSchedule);
  },
  notify: function () {
    notify('-KM9BW3MW15ELVMhSeL6').then(function (data) {
    });
  },
  userdata: function () {
    userdata({ url: 'https://physical-web-coffee.firebaseio.com/NV3qodvAKLW7Iiwh29BvcWAw4UH3.json' });
  }
};
