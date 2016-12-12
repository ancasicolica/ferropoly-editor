#!/usr/bin/env node
/*
 Creates a demo game which is running today
 */
var settings    = require('../editor/settings');
var ferropolyDb = require('../common/lib/ferropolyDb');
var gplib       = require('../editor/lib/gameplayLib');
ferropolyDb.init(settings, function (err) {
  if (err) {
    console.log('DB initialisation error: ' + err);
    process.exit(code = 0);
    return;
  }
  gplib.createDemoGameplay({
    map            : 'sbb',
    gameId         : 'local-demo-game',
    gameStart      : '04:00',
    gameEnd        : '23:30',
    doNotNotifyMain: true,
    mobile         : {
      level: 5
    }
  }, function (err) {
    if (err) {
      console.log('Demo gameplay creation error: ' + err);
      process.exit(code = 0);
      return;
    }
    console.log('OK');
    process.exit(code = 0);
  })
});
