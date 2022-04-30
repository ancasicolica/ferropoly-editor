#!/usr/bin/env node
/**
 * Compares two location files. Sources are hardcoded, for development debugging only.
 * Christian Kuster, CH-8342 Wernetshausen, christian@kusti.ch
 * Created: 30.04.22
 **/

const _  =require('lodash');
const file1 = require('../tmp/locationDb-220430-192714.json');
const file2 = require('../tmp/locationDb-1807b82828d.json');

file1.locations.forEach(location1 => {
  let location2 = _.find(file2.locations, {'uuid': location1.uuid});
  if (!location2) {
    console.log(`${location1.name} not found in 2nd file`);
    return;
  }
  if (!_.isEqual(location1, location2)) {
    console.log(`${location1.name} differs`, location1, location2);
  }
})
