/**
 * The library for the pricelist for the EDITOR
 *
 * Created by kc on 08.03.15.
 */
'use strict';

var gameplays = require('../../common/models/gameplayModel');
var properties = require('../../common/models/propertyModel');
var _ = require('lodash');

/**
 * Create and save the complete price list
 * @param gameId
 * @param ownerEmail
 * @param callback
 */
var createPriceList = function (gameId, ownerEmail, callback) {

  // Collect the information
  gameplays.getGameplay(gameId, ownerEmail, function (err, gp) {
    if (err) {
      return callback(err);
    }
    properties.getPropertiesForGameplay(gameId, null, function (err, props) {
      if (err) {
        return callback(err);
      }
      createPriceListInternal(gp, props, function (err, pricelist) {
        if (err) {
          return callback(err);
        }
        properties.updateProperties(pricelist, function (err) {
          if (err) {
            return callback(err);
          }
          gameplays.saveNewPriceListRevision(gp, function (err) {
            return callback(err);
          });
        });
      });
    });
  });
};

/**
 * This is the internal (but exposed for unit tests) calculation for the price list
 * @param gp       Gameplay
 * @param props    Properties
 * @param callback
 */
var createPriceListInternal = function (gp, props, callback) {

  var priceRangeLists = extractRanges(props);
  var priceList = createPriceListArray(priceRangeLists);
  priceList = setPropertyPrices(gp, priceList);
  priceList = setPropertyHousePricing(gp, priceList);
  priceList = setPropertyGroups(gp, priceList);
  if (!priceList) {
    return callback(new Error('error while creating pricelist'));
  }
  callback(null, priceList);
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
    return null;
  }
};

/**
 * Sets the property prices according to the number of price levels, min and max
 * @param gameplay
 * @param pricelist
 * @returns {*}
 */
var setPropertyPrices = function (gameplay, pricelist) {
  try {
    var priceMin = gameplay.gameParams.properties.lowestPrice;
    var priceMax = gameplay.gameParams.properties.highestPrice;
    var i;
    var priceDifference = 0;
    var p = 0;

    if (gameplay.gameParams.properties.numberOfPriceLevels === 1) {
      // Special case: every property has its own value
      priceDifference = (priceMax - priceMin) / (pricelist.length - 1);
      for (i = 0, p = priceMin; i < pricelist.length; i++, p += priceDifference) {
        pricelist[i].pricelist.price = Math.floor(p / 10) * 10;
      }
      // make sure that the maximum price is the max!
      pricelist[pricelist.length - 1].pricelist.price = priceMax;
      return pricelist;
    }
    else {
      // several properties together in one price group
      priceDifference = (priceMax - priceMin) / (gameplay.gameParams.properties.numberOfPriceLevels - 1);
      var nbOfPropertiesInSameGroup = Math.floor(pricelist.length / gameplay.gameParams.properties.numberOfPriceLevels);
      var nbOfPropertiesLeft = pricelist.length % gameplay.gameParams.properties.numberOfPriceLevels;
      var t = 0;
      var n = 0;
      p = priceMin;
      do {
        var target = nbOfPropertiesInSameGroup;
        if (nbOfPropertiesLeft) {
          nbOfPropertiesLeft--;
          target++;
        }
        for (i = 0; i < target; i++) {
          if (!pricelist[i + t]) {
            console.log(i + ' / ' + t);
          }
          if ((i + t) < pricelist.length) {
            // The last group of prices can be larger (not handled with the nbOfProbertiesInSameGroup, e.g. 150 places
            // with a numberOfPriceLevels = 8 leads to 148 handled places, leaving two with a wrong price).
            // ==> if the price is higher han priceMax, set it to priceMax
            var price = Math.floor(p / 10) * 10;
            pricelist[i + t].pricelist.price = (price < priceMax) ? price : priceMax;
          }
        }

        p += priceDifference;
        t += i;
        n++;
      } while (t < pricelist.length);

      // make sure that the maximum price is the max!
      pricelist[pricelist.length - 1].pricelist.price = priceMax;
      return pricelist;
    }
  }
  catch (e) {
    console.log('Error in set pricing: ' + e.message);
    console.error(e);
    return null;
  }
};

/**
 * Sets the prices for a house and the rents with the different hous levels
 * @param gameplay
 * @param pricelist
 * @returns {*}
 */
var setPropertyHousePricing = function (gameplay, pricelist) {
  try {
    var rentFactor = gameplay.gameParams.rentFactors;

    for (var i = 0; i < pricelist.length; i++) {
      var p = pricelist[i].pricelist.price;
      pricelist[i].pricelist.pricePerHouse = Math.floor(p * gameplay.gameParams.housePrices / 10) * 10;
      pricelist[i].pricelist.rents = {
        noHouse: Math.floor(p * rentFactor.noHouse / 10) * 10,
        oneHouse: Math.floor(p * rentFactor.oneHouse / 10) * 10,
        twoHouses: Math.floor(p * rentFactor.twoHouses / 10) * 10,
        threeHouses: Math.floor(p * rentFactor.threeHouses / 10) * 10,
        fourHouses: Math.floor(p * rentFactor.fourHouses / 10) * 10,
        hotel: Math.floor(p * rentFactor.hotel / 10) * 10
      };
    }
    return pricelist;
  }
  catch (e) {
    console.log('error in setPropertyHousePricing');
    console.error(e);
    return null;
  }

};

/**
 * Sets the property groups: several properties belonging to each other
 * @param gameplay
 * @param pricelist
 */
var setPropertyGroups = function (gameplay, pricelist) {
  try {
    var nbOfPropertiesInGroup = gameplay.gameParams.properties.numberOfPropertiesPerGroup;
    var n = 1;

    for (var i = 0; i < pricelist.length; i += nbOfPropertiesInGroup) {
      for (var t = 0; t < nbOfPropertiesInGroup; t++) {
        pricelist[i + t].pricelist.propertyGroup = n;
      }
      n++;
    }
    return pricelist;
  }
  catch (e) {
    console.log('error in setPropertyGroups');
    console.error(e);
    return null;
  }
};

module.exports = {
  create: createPriceList,
  internal: {
    extractRanges: extractRanges,
    createPriceListArray: createPriceListArray,
    setPropertyPrices: setPropertyPrices,
    setPropertyHousePricing: setPropertyHousePricing,
    setPropertyGroups: setPropertyGroups
  }
};
