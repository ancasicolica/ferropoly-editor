/**
 * Generates a CSV file. This is the COMMON LIB VERSION, replacing the one from the main module
 * Created by kc on 17.07.15.
 */

const _          = require('lodash');
const {DateTime} = require('luxon');

module.exports = {
  /**
   * Creates a csv out from a FLAT data structure, no nested properties
   * @param columns
   * @param data
   * @returns {string}
   */
  create: function (columns, data) {
    let i      = 0;
    let retVal = '';
    let keys   = _.keys(columns);
    let values = _.values(columns);

    let header = '';
    for (i = 0; i < values.length; i++) {
      header += values[i] + ';';
    }
    retVal += header + '\n';

    for (i = 0; i < data.length; i++) {
      let row = '';
      _.forEach(keys, function (key) {
        if (data[i] && data[i][key]) {
          row += data[i][key] + ';'
        } else {
          row += ';';
        }
      });
      retVal += row + '\n';
    }

    retVal += '\n\nStand:' + DateTime.now().setZone('Europe/Zurich').toFormat('d.M.yyyy HH:mm:ss');
    return retVal;
  }
};
