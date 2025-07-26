#!/usr/bin/env node
/*
 Creates a demo game which is running today
 */
const settings    = require('../editor/settings');
const ferropolyDb = require('../common/lib/ferropolyDb');
const gplib       = require('../editor/lib/gameplayLib');

async function main() {
  try {
    await ferropolyDb.init(settings);
    await gplib.createDemoGameplay({
      map:             'sbb',
      gameId:          'local-demo-game',
      gameStart:       '04:00',
      gameEnd:         '23:30',
      presets:         'moderate',
      doNotNotifyMain: true,
      autopilot:       {
        active:    true,
        picBucket: true,
        interval:  5 * 60 * 1000
      },
      mobile:          {
        level: 5
      }
    });
    await ferropolyDb.close();
    console.log('OK');
    process.exit(code = 0);
  }
  catch(err) {
    console.error(err);
    process.exit(code = -1);
  }
}

main();
