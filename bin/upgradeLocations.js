#!/usr/bin/env node
/**
 * This script updates the locations DB, needed when introducing new maps
 * Christian Kuster, CH-8342 Wernetshausen, christian@kusti.ch
 * Created: 24.04.22
 **/
const settings      = require('../editor/settings');
const ferropolyDb   = require('../common/lib/ferropolyDb');
const locationModel = require('../common/models/locationModel');
const async         = require('async');

ferropolyDb.init(settings, function (err) {
  if (err) {
    console.log('DB initialisation error: ' + err);
    process.exit(code = 0);
    return;
  }
  locationModel.getAllLocationsAsModel((err, locations) => {
    if (err) {
      console.error(err);
      process.exit(code = 0);
      return;
    }
    console.log(`Read ${locations.length} Locations`);

    let nb = 0;
    async.each(locations,
      function (location, cb) {
        console.log(location.name);
        locationModel.saveLocation(location, cb);
        nb++;
      },
      function (err) {
        if (err) {
          console.error(err);
          process.exit(code = 0);
          return;
        }
        console.log('done', nb);
        process.exit(code = 1);
      })
  });
});
