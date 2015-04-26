#!/usr/bin/env node
/*
 Creates a demo game which is running today
 */
var settings = require('../editor/settings');
var ferropolyDb = require('../common/lib/ferropolyDb');
var gplib = require('../editor/lib/gameplayLib');
ferropolyDb.init(settings, function (err) {
  if (err) {
    console.log('DB initialisation error: ' + err);
    process.exit(code = 0);
    return;
  }
  gplib.createDemoGameplay({gameStart: '04:00', gameEnd: '23:30'}, function (err) {
    if (err) {
      console.log('DB initialisation error: ' + err);
      process.exit(code = 0);
      return;
    }
    console.log('OK');
    process.exit(code = 0);
  })
});
