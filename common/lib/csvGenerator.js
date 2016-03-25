/**
 * Generates a CSV file. This is the COMMON LIB VERSION, replacing the one from the main module
 * Created by kc on 17.07.15.
 */

var _ = require('lodash');
var moment = require('moment-timezone');

module.exports = {
  /**
   * Creates a csv out from a FLAT data structure, no nested properties
   * @param columns
   * @param data
   * @returns {string}
   */
  create: function (columns, data) {
    var i = 0;
    var retVal = '';
    var keys = _.keys(columns);
    var values = _.values(columns);

    var header = '';
    for (i = 0; i < values.length; i++) {
      header += values[i] + ';';
    }
    retVal += header + '\n';

    for (i = 0; i < data.length; i++) {
      var row = '';
      _.forEach(keys, function (key) {
        if (data[i] && data[i][key]) {
          row += data[i][key] + ';'
        }
        else {
          row += ';';
        }
      });
      retVal += row + '\n';
    }

    retVal += '\n\nStand:' + moment.tz(moment(), 'Europe/Zurich').format('D.M.YYYY HH:mm:ss');
    return retVal;
  }
};
