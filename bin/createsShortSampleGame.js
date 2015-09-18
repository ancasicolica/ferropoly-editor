#!/usr/bin/env node
/*
 Creates a sample game which is running tomorrow in the early morning, short version
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
  gplib.createDemoGameplay({
    gameId: 'sample-game-sprint',
    gamename: 'Sprint Spiel',
    interestInterval: 15,
    gameStart: '04:00',
    gameEnd: '07:00',
    random: 100,
    teamNb: 4,
    tomorrow: true,
    doNotNotifyMain: false
  }, function (err) {
    if (err) {
      console.log('Sample gameplay creation error: ' + err);
      process.exit(code = 0);
      return;
    }
    console.log('OK');
    process.exit(code = 0);
  })
});
