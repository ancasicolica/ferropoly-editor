#!/usr/bin/env node
const templateGames = require('../editor/lib/templateGames');
const ferropolyDb = require('../common/lib/ferropolyDb');
const settings = require('../editor/settings');

async function main() {
  try {
    await ferropolyDb.init(settings);
    await templateGames.saveGame('play-a-demo-game')


    console.log('Saved, reading all games');
    const games = await templateGames.getGames();
    console.log(games);
    console.log('OK');

    await ferropolyDb.close();

    process.exit(code = 0);
  }
  catch(err) {
    console.error(err);
    process.exit(code = -1);
  }
}

main();



