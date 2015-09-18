#!/usr/bin/env node
/*
 Creates a sample game which is running tomorrow
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
    gameId: 'sample-game-1',
    gamename: 'Volles Spiel',
    interestInterval: 60,
    gameStart: '05:00',
    gameEnd: '18:00',
    random: 200,
    teamNb: 20,
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
