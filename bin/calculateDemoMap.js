#!/usr/bin/env node
/*
 Calculates the map
 */
const settings    = require('../editor/settings');
const ferropolyDb = require('../common/lib/ferropolyDb');
const map         = require('../common/lib/propertyMap');

ferropolyDb.init(settings, function (err) {
  if (err) {
    console.log('DB initialisation error: ' + err);
    process.exit(code = 0);
    return;
  }

  map.create({gameId: 'local-demo-game', squaresOnShortSide: 4}, (err, info) => {
    if (err) {
      console.error(err);
      process.exit(code = 0);
      return;
    }

    console.log(info);
    console.log('OK');
    process.exit(code = 0);
  });
});
