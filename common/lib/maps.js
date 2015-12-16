/**
 * This file loads maps.json and offers then all the maps to the application:
 * - internal as object
 * - "external" (web browser) as route
 *
 * Created by kc on 16.12.15.
 */

'use strict';

var maps = require('./maps.json');

module.exports = {
  /**
   * Returns the maps as object
   */
  get: function () {
    return maps;
  },

  /**
   * Handler for a route, returns a complete JS-File
   * @param req
   * @param res
   */
  routeHandler: function (req, res) {
    res.send('var ferropolyMaps = ' + JSON.stringify(maps) + ';');
  }

};
