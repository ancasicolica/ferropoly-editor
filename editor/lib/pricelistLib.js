/**
 * Library functions for creating a pricelist
 * Christian Kuster, CH-8342 Wernetshausen, christian@kusti.ch
 * Created: 31.12.2024
 **/

const _ = require('lodash');

let loggerFunction = null;

/**
 * This is the internal (but exposed for unit tests) calculation for the price list
 * @param gp       Gameplay
 * @param props    Properties
 * @param loggerFct Function where strings and objects can be logged to
 */
function createPriceList(gp, props, loggerFct) {

  if (_.isFunction(loggerFct)) {
    loggerFunction = loggerFct;
  } else {
    loggerFunction = console.log;
  }
  const gpName = _.get(gp, 'internal.gameId', 'none');
  loggerFunction(`${gpName}: Pricelist creation, extract ranges`);
  let priceRangeLists = extractRanges(props);
  loggerFunction(`${gpName}: Pricelist creation, create array`);
  let priceList = createPriceListArray(priceRangeLists);
  loggerFunction(`${gpName}: Pricelist creation, set property prices`);
  priceList = setPropertyPrices(gp, priceList);
  loggerFunction(`${gpName}: Pricelist creation, set house pricing`);
  priceList = setPropertyHousePricing(gp, priceList);
  loggerFunction(`${gpName}: Pricelist creation, set property groups`);
  priceList = setPropertyGroups(gp, priceList);
  loggerFunction(`${gpName}: Pricelist creation, set price tags`);
  priceList = setPriceTags(gp, priceList);
  if (!priceList) {
    return null;
  }
  return priceList
}

/**
 * Creates a list of properties of the pricelist, but not setting the complete data. This function is
 * used in the web UI.
 * @param gp       Gameplay
 * @param props    Properties
 * @param loggerFct Function where strings and objects can be logged to
 */
function createPropertyList(gp, props, loggerFct) {

  if (_.isFunction(loggerFct)) {
    loggerFunction = loggerFct;
  } else {
    loggerFunction = console.log;
  }
  const gpName = _.get(gp, 'internal.gameId', 'none');
  loggerFunction(`${gpName}: Pricelist creation, extract ranges`);
  let priceRangeLists = extractRanges(props);
  loggerFunction(`${gpName}: Pricelist creation, create array`);
  let priceList = createPriceListArray(priceRangeLists);
  loggerFunction(`${gpName}: Pricelist creation, set property groups`);
  priceList = setPropertyGroups(gp, priceList);
  if (!priceList) {
    return null;
  }
  return priceList
}


/**
 * Extract the properties for each price range into one array each
 * @param props  Properties
 * @returns {Array}
 */

/*eslint-disable no-loop-func*/
function extractRanges(props) {
  let ranges = [];
  for (let i = 0; i < 6; i++) {
    ranges[i] = _.sortBy(_.filter(props, function (p) {
      return p.pricelist.priceRange === i;
    }), function (n) {
      return (n.pricelist.positionInPriceRange);
    });
  }
  return ranges;
}

/*eslint-enable no-loop-func*/

/**
 * Creates the price list array: concatenates all ranges to one list and sets the absoulte position inside the list
 * @param ranges
 * @returns {Array}
 */
function createPriceListArray(ranges) {
  try {
    let arr = [];
    for (let i = 0; i < ranges.length; i++) {
      arr = arr.concat(ranges[i]);
    }
    // Set the absolute position in the list
    for (let t = 0; t < arr.length; t++) {
      arr[t].pricelist.position = t;
    }
    return arr;
  }
  catch (e) {
    console.error('Error in createPriceListArray', e);
    return null;
  }
}

/**
 * Sets the property prices according to the number of price levels, min and max
 * @param gameplay
 * @param pricelist
 * @returns {*}
 */
function setPropertyPrices(gameplay, pricelist) {
  try {
    const priceMin      = gameplay.gameParams.properties.lowestPrice;
    const priceMax      = gameplay.gameParams.properties.highestPrice;
    let i;
    let priceDifference = 0;
    let p               = 0;

    if (gameplay.gameParams.properties.numberOfPriceLevels === 1) {
      // Special case: every property has its own value
      priceDifference = (priceMax - priceMin) / (pricelist.length - 1);
      for (i = 0, p = priceMin; i < pricelist.length; i++, p += priceDifference) {
        pricelist[i].pricelist.price = Math.floor(p / 10) * 10;
      }
      // make sure that the maximum price is the max!
      pricelist[pricelist.length - 1].pricelist.price = priceMax;
      return pricelist;
    } else {
      // several properties together in one price group
      priceDifference                 = (priceMax - priceMin) / (gameplay.gameParams.properties.numberOfPriceLevels - 1);
      const nbOfPropertiesInSameGroup = Math.floor(pricelist.length / gameplay.gameParams.properties.numberOfPriceLevels);
      let nbOfPropertiesLeft          = pricelist.length % gameplay.gameParams.properties.numberOfPriceLevels;
      let t                           = 0;
      p                               = priceMin;
      do {
        let target = nbOfPropertiesInSameGroup;
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
            let price                        = Math.floor(p / 10) * 10;
            pricelist[i + t].pricelist.price = (price < priceMax) ? price : priceMax;
          }
        }

        p += priceDifference;
        t += i;
      }
      while (t < pricelist.length);

      // make sure that the maximum price is the max!
      pricelist[pricelist.length - 1].pricelist.price = priceMax;
      return pricelist;
    }
  }
  catch (e) {
    console.error('Error in setPropertyPrices', e);
    return null;
  }
}

/**
 * Sets the prices for a house and the rents with the different hous levels
 * @param gameplay
 * @param pricelist
 * @returns {*}
 */
function setPropertyHousePricing(gameplay, pricelist) {
  try {
    const rentFactor = gameplay.gameParams.rentFactors;

    for (let i = 0; i < pricelist.length; i++) {
      let p                                = pricelist[i].pricelist.price;
      pricelist[i].pricelist.pricePerHouse = Math.floor(p * gameplay.gameParams.housePrices / 10) * 10;
      pricelist[i].pricelist.rents         = {
        noHouse:     Math.floor(p * rentFactor.noHouse / 10) * 10,
        oneHouse:    Math.floor(p * rentFactor.oneHouse / 10) * 10,
        twoHouses:   Math.floor(p * rentFactor.twoHouses / 10) * 10,
        threeHouses: Math.floor(p * rentFactor.threeHouses / 10) * 10,
        fourHouses:  Math.floor(p * rentFactor.fourHouses / 10) * 10,
        hotel:       Math.floor(p * rentFactor.hotel / 10) * 10
      };
    }
    return pricelist;
  }
  catch (e) {
    console.error('Error in setPropertyHousePricing', e);
    return null;
  }

}

/**
 * Sets the property groups: several properties belonging to each other
 * @param gameplay
 * @param pricelist
 */
let setPropertyGroups = function (gameplay, pricelist) {
  try {
    let nbOfPropertiesInGroup = gameplay.gameParams.properties.numberOfPropertiesPerGroup;
    let n                     = 1;

    for (let i = 0; i < pricelist.length; i += nbOfPropertiesInGroup) {
      for (let t = 0; t < nbOfPropertiesInGroup; t++) {
        _.set(pricelist[i + t], 'pricelist.propertyGroup', n);
      }
      n++;
    }
    return pricelist;
  }
  catch (e) {
    console.error('Error in setPropertyGroups', e);
    return null;
  }
};

/**
 * Represents predefined pricing tiers based on the number of items.
 *
 * Each index in the array corresponds to the number of items for which pricing is defined.
 * For example, `priceTags[3]` contains pricing tiers applicable when there are 3 items.
 * The value at each index is an array of price thresholds, progressively increasing.
 *
 * The tiers are structured as follows:
 * - Index 0: No pricing tiers (empty array).
 * - Index 1: Indicates all items have different prices (empty array).
 * - Remaining indices: Arrays containing progressive price thresholds.
 *
 * @type {Array<Array<number>>}
 */
const priceTags = [
  /* 0 = does not exist  */ [],
  /* 1 = all have different price */ [],
  /* 2 */ [1, 10],
  /* 3 */ [1, 5, 10],
  /* 4 */ [1, 3, 6, 10],
  /* 5 */ [1, 3, 5, 7, 10],
  /* 6 */ [1, 3, 5, 7, 9, 10],
  /* 7 */ [1, 2, 3, 5, 7, 9, 10],
  /* 8 */ [1, 2, 3, 4, 6, 7, 9, 10],
  /* 9 */ [1, 2, 3, 4, 6, 7, 8, 9, 10],
  /* 10 */ [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
]


/**
 * Calculates the price tag for a given property based on the price levels defined in the gameplay parameters.
 *
 * @param gameplay
 * @param {object} property - The property for which the price tag is calculated.
 * @return {number} - The price tag of the property.
 */
function getPriceTag(gameplay, property) {
  const lowestPrice         = gameplay.gameParams.properties.lowestPrice;
  const highestPrice        = gameplay.gameParams.properties.highestPrice;
  const priceDelta          = highestPrice - lowestPrice;
  const numberOfPriceLevels = gameplay.gameParams.properties.numberOfPriceLevels
  let step                  = priceDelta / numberOfPriceLevels;
  let priceTag              = -1;

  if (numberOfPriceLevels > 1 && numberOfPriceLevels < 11) {
    // When there are between 2 and 10 Price levels, use mapping
    for (let i = 0; i < numberOfPriceLevels; i++) {
      let priceLevel = lowestPrice + i * step;
      if (property.pricelist.price >= priceLevel) {
        priceTag = priceTags[numberOfPriceLevels][i];
      }
    }
    return priceTag;
  } else {
    // The less common situation: more than 10 different price levels. This is only approximate calculation
    step = priceDelta / 10;
    for (let i = 0; i < 10; i++) {
      let priceLevel = lowestPrice + i * step;
      if (property.pricelist.price >= priceLevel) {
        priceTag = priceTags[10][i];
      }
    }
    return priceTag;
  }
}

/**
 * Updates the price tags for all items in the pricelist based on gameplay data.
 *
 * @param {Object} gameplay - The gameplay data used to determine the price tags.
 * @param {Array} pricelist - The list of items with pricing information to be updated.
 * @return {Array} The updated pricelist with modified price tags.
 */
function setPriceTags(gameplay, pricelist) {

  for (const property of pricelist) {
    property.pricelist.priceTag = getPriceTag(gameplay, property);
  }

  return pricelist;
}

module.exports = {
  createPriceList:         createPriceList,
  createPropertyList:      createPropertyList,
  extractRanges:           extractRanges,
  createPriceListArray:    createPriceListArray,
  setPropertyPrices:       setPropertyPrices,
  setPropertyHousePricing: setPropertyHousePricing,
  setPropertyGroups:       setPropertyGroups
}
