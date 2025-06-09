/**
 * This file loads maps.json and offers then all the maps to the application:
 * - internal as object
 * - "external" (web browser) as route
 *
 * Created by kc on 16.12.15.
 */

const maps          = require('./maps.json');
const locationModel = require('../models/locationModel');
const _             = require('lodash');

module.exports = {
  /**
   * Returns the maps as object
   */
  get: function () {
    return maps;
  },

  /**
   * Handler for a route, returns a complete JS-File
   *
   * /maps                   => just the maps with descriptions, this is the fastest options
   * /maps?count=true        => adds the number of locations for each map and over all
   * /maps?locations=true    => adds all locations and the number over all
   * &json=true              => output as json
   * @param req
   * @param res
   */
  routeHandler: async function (req, res) {
    try {
      if (req.query.count) {
        const info = await locationModel.countLocations()
        return res.send(info);
      } else if (req.query.locations) {
        let retVal = _.clone(maps, true);

        maps.forEach(async m => {
          const locs      = await locationModel.getAllLocationsForMap(m.map);
          const locSorted = _.sortBy(locs, 'name');

          locSorted.forEach(function (loc) {
            delete loc._id;
            delete loc.position;
            delete loc.maps;
            delete loc.uuid;
            delete loc.__v;
          });

          m.locations = locs;
        })
        return res.send(retVal);
      }
    }
    catch (err) {
      return res.status(500).send(err.message);
    }
  }

};
