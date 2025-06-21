#!/usr/bin/env node
/*
 Creates a demo game which is running today
 */
const settings    = require('../editor/settings');
const ferropolyDb = require('../common/lib/ferropolyDb');
const gplib       = require('../editor/lib/gameplayLib');

ferropolyDb.init(settings, async function (err) {
  if (err) {
    console.log('DB initialisation error: ' + err);
    process.exit(code = 0);
    return;
  }
  try {
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
    console.log('OK');
    process.exit(code = 0);

  }
  catch (err) {
    console.log('Demo gameplay creation error: ' + err);
    process.exit(code = 0);
  }

});
