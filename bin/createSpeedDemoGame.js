#!/usr/bin/env node
/*
 Creates a demo game which is running today with high speed
 */
const settings    = require('../editor/settings');
const ferropolyDb = require('../common/lib/ferropolyDb');
const gplib       = require('../editor/lib/gameplayLib');

async function main() {
  try {
    await ferropolyDb.init(settings);
    await gplib.createDemoGameplay({
      map:              'sbb',
      gameId:           'local-speed-game',
      gameStart:        '04:00',
      gameEnd:          '23:30',
      presets:          'moderate',
      gamename:         'Speed-Game',
      doNotNotifyMain:  false,
      random:           480,
      teamNb:           20,
      interestInterval: 10,
      autopilot:        {
        active:    true,
        picBucket: true,
        interval:  1 * 60 * 1000
      },
      mobile:           {
        level: 5
      }
    });
    await ferropolyDb.close();
    console.log('OK');
    process.exit(code = 0);
  }
  catch (err) {
    console.error(err);
    process.exit(code = -1);
  }
}

main();
