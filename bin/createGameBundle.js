#!/usr/bin/env node
/*
 Creates a few games running tomorrow: testing how the system behaves with several games
 */
var settings = require('../editor/settings');
var ferropolyDb = require('../common/lib/ferropolyDb');
var gplib = require('../editor/lib/gameplayLib');


function createGame1(callback) {
  gplib.createDemoGameplay({
    gameId: 'bundle-game-1',
    gamename: 'Bundle Spiel 1 (shorty)',
    interestInterval: 20,
    gameStart: '05:00',
    gameEnd: '7:00',
    random: 100,
    teamNb: 4,
    tomorrow: true,
    doNotNotifyMain: false
  }, callback);
}

function createGame2(callback) {
  gplib.createDemoGameplay({
    gameId: 'bundle-game-2',
    gamename: 'Bundle Spiel 2',
    interestInterval: 60,
    gameStart: '05:00',
    gameEnd: '20:00',
    random: 100,
    teamNb: 12,
    tomorrow: true,
    doNotNotifyMain: false
  }, callback);
}


function createGame3(callback) {
  gplib.createDemoGameplay({
    gameId: 'bundle-game-3',
    gamename: 'Bundle Spiel 3 (full)',
    interestInterval: 60,
    gameStart: '05:00',
    gameEnd: '19:00',
    random: 200,
    teamNb: 20,
    tomorrow: true,
    doNotNotifyMain: false
  }, callback);
}


function createGame4(callback) {
  gplib.createDemoGameplay({
    gameId: 'bundle-game-4',
    gamename: 'Bundle Spiel 4',
    interestInterval: 60,
    gameStart: '05:00',
    gameEnd: '18:00',
    random: 80,
    teamNb: 8,
    tomorrow: true,
    doNotNotifyMain: false
  }, callback);
}

ferropolyDb.init(settings, function (err) {
  if (err) {
    console.log('DB initialisation error: ' + err);
    process.exit(code = 0);
    return;
  }
  createGame1(function (err) {
    if (err) {
      console.log('Sample gameplay 1 creation error: ' + err);
      process.exit(code = 0);
      return;
    }

    createGame2(function (err) {
      if (err) {
        console.log('Sample gameplay 2 creation error: ' + err);
        process.exit(code = 0);
        return;
      }

      createGame3(function (err) {
        if (err) {
          console.log('Sample gameplay 3 creation error: ' + err);
          process.exit(code = 0);
          return;
        }

        createGame4(function (err) {
          if (err) {
            console.log('Sample gameplay 4 creation error: ' + err);
            process.exit(code = 0);
            return;
          }

          console.log('OK');
          process.exit(code = 0);
        });
      });
    });
  })
});
