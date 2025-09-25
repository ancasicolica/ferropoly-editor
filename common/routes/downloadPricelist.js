/**
 * Supplies a route for downloading pricelist as Excel sheet
 *
 * This route is provided as router and as handler function as it could be needed differently in
 * the programs.
 *
 * Created by kc on 14.12.15.
 */



const express   = require('express');
const router    = express.Router();
const pricelist = require('../lib/pricelist');
const xlsx      = require('node-xlsx');

/**
 * Handler for priceslist download
 * @param req
 * @param res
 */
async function handler(req, res) {
  try {
    const report = await pricelist.getArray(req.params.gameId);
    const buffer = xlsx.build([{name: report.sheetName, data: report.data}]);

    res.set({
      'Content-Type':        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Description': 'File Transfer',
      'Content-Disposition': 'attachment; filename=' + report.fileName,
      'Content-Length':      buffer.length
    });
    res.send(buffer);
  }
  catch (err) {
    return res.send({status: 'error', message: err.message});
  }

}

router.get('/:gameId', handler);

module.exports = {
  router:  router,
  handler: handler
};
