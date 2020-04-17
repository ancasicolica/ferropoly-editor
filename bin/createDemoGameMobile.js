#!/usr/bin/env node
/*
 Creates a demo game for mobile access which is running today
 */
const settings    = require('../editor/settings');
const ferropolyDb = require('../common/lib/ferropolyDb');
const gplib       = require('../editor/lib/gameplayLib');

ferropolyDb.init(settings, function (err) {
  if (err) {
    console.log('DB initialisation error: ' + err);
    process.exit(code = 0);
    return;
  }
  gplib.createDemoGameplay({
    map            : 'sbb',
    gameId         : 'local-demo-game-mobile',
    gameStart      : '04:00',
    gameEnd        : '23:30',
    presets        : 'moderate',
    doNotNotifyMain: true,
    mobile         : {
      level: 10
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
