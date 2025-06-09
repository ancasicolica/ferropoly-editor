#!/usr/bin/env node
/**
 * This script updates the locations DB, needed when introducing new maps
 * Christian Kuster, CH-8342 Wernetshausen, christian@kusti.ch
 * Created: 24.04.22
 **/
const settings      = require('../editor/settings');
const ferropolyDb   = require('../common/lib/ferropolyDb');
const locationModel = require('../common/models/locationModel');

ferropolyDb.init(settings, async function (err) {
  if (err) {
    console.log('DB initialisation error: ' + err);
    process.exit(code = 0);
    return;
  }
  const locations = await locationModel.getAllLocationsAsModel();

  console.log(`Read ${locations.length} Locations`);

  let nb = 0;
  locations.forEach(async location => {
    await locationModel.saveLocation(location);
    nb++;
  });

  console.log('done', nb);
  process.exit(code = 1);

});
