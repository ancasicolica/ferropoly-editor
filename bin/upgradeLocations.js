#!/usr/bin/env node
/**
 * This script updates the locations DB, needed when introducing new maps
 * Christian Kuster, CH-8342 Wernetshausen, christian@kusti.ch
 * Created: 24.04.22
 **/
const settings      = require('../editor/settings');
const ferropolyDb   = require('../common/lib/ferropolyDb');
const locationModel = require('../common/models/locationModel');
const argv        = require('minimist')(process.argv.slice(2));

async function main() {
  try {
    await ferropolyDb.init(settings);

    const locations = await locationModel.getAllLocationsAsModel();

    console.log(`Read ${locations.length} Locations`);

    let nb = 0;
    for await(let location of locations)
     {
       if (argv.v || argv.verbose) {
         console.log(location.name);
       }
      await locationModel.saveLocation(location);
      nb++;
    }

    console.log('done', nb);
    process.exit(code = 1);
  }
  catch(err) {
    console.error(err);
    process.exit(code = -1);
  }
}

main();
