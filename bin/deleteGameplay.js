#!/usr/bin/env node
const ferropolyDb = require('../common/lib/ferropolyDb');
const gpLib = require('../editor/lib/gameplayLib');
const settings = require('../editor/settings');

/**
 * Deletes a gameplay
 *
 * Parameter:
 *   --gameid : name of the gameplay to delete
 *   --owner: email of the owner
 *
 * Christian Kuster, CH-8342 Wernetshausen, christian@kusti.ch
 * Created: 07.05.22
 **/
const argv  = require('minimist')(process.argv.slice(2));
if (!argv.gameid || !argv.owner) {
  console.log('all params must be supplied');
  console.log('error');
  process.exit(code = -1);
}


async function main() {
  try {
    await ferropolyDb.init(settings);
    await gpLib.deleteGameplay({gameId: argv.gameid, ownerEmail: argv.owner});

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


