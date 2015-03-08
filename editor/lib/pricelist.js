/**
 * The library for the pricelist for the EDITOR
 *
 * Created by kc on 08.03.15.
 */
'use strict';

var gameplays = require('../../common/models/gameplayModel');
var properties = require('../../common/models/propertyModel');
var _ = require('lodash');

var createPriceList = function (gameId, ownerEmail, callback) {

  // Collect the information
  gameplay.getGameplay(gameId, ownerEmail, function (err, gp) {
    if (err) {
      return callback(err);
    }

    properties.getPropertiesForGameplay(gameId, null, function (err, properties) {
      if (err) {
        return callback(err);
      }
      createPriceListInternal(gp, properties, function (err) {
        return callback(err);
      })
    })
  });
};

/**
 * This is the internal (but exposed for unit tests) calculation for the price list
 * @param gp       Gameplay
 * @param props    Properties
 * @param callback
 */
var createPriceListInternal = function (gp, props, callback) {

  var priceRangeLists = extractRanges(gp);
  callback();
};

/**
 * Extract the properties for each price range into one array each
 * @param props  Properties
 * @returns {Array}
 */
var extractRanges = function (props) {
  var ranges = [];
  for (var i = 0; i < 6; i++) {
    ranges[i] = _.sortBy(_.filter(props, function (p) {
      return p.pricelist.priceRange === i;
    }), function (n) {
      return (n.pricelist.positionInPriceRange);
    });
  }
  return ranges;
};

/**
 * Creates the price list array: concatenates all ranges to one list and sets the absoulte position inside the list
 * @param ranges
 * @returns {Array}
 */
var createPriceListArray = function (ranges) {
  try {
    var arr = [];
    for (var i = 0; i < ranges.length; i++) {
      arr = arr.concat(ranges[i]);
    }
    // Set the absolute position in the list
    for (var t = 0; t < arr.length; t++) {
      arr[t].pricelist.position = t;
    }
    return arr;
  }
  catch (e) {
    console.log(e);
    return [];
  }
};


module.exports = {
  create: createPriceList,
  internal: {
    extractRanges: extractRanges,
    createPriceListArray: createPriceListArray
  }
};
