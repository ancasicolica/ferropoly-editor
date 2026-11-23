#!/usr/bin/env node
/**
 * Cleans test entries in a gameplay
 *
 * Parameters:
 * --gameId : ID of the gameplay to add travel logs to
 */

const argv          = require('minimist')(process.argv.slice(2));
const travelLog     = require('../common/models/travelLogModel');
const ferropolyDb = require('../common/lib/ferropolyDb');
const settings = require('../editor/settings');

async function main(options = argv) {
  const gameId = options.gameId;
  await ferropolyDb.init(settings);
  await travelLog.Model.deleteMany({gameId: gameId, test: true});
  await ferropolyDb.close();
  console.log('done, cleared them all.')
}


if (require.main === module) {
  main().catch(err => {
    console.error(err);
    process.exitCode = 1;
  });
}

module.exports = {main};
