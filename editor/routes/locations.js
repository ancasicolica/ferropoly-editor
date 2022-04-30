/**
 * Administrator route for locations: up- and download
 * Christian Kuster, CH-8342 Wernetshausen, christian@kusti.ch
 * Created: 30.04.22
 **/

const express = require('express');
const router = express.Router();
const locationModel = require('../../common/models/locationModel');

/* GET download locations JSON structure */
router.get('/', function(req, res) {

  locationModel.getAllLocations(function(err, data) {
    if (err) {
      return res.send('ERROR: ' + err);
    }
    let resData = {
      type: 'LocationDatabase',
      version: 1,
      timestamp: new Date(),
      locations: data
    };
    let fileName = 'locationDb-' + new Date().getTime().toString(16) + '.json'
    res.setHeader('Content-type', 'application/force-download');
    res.setHeader('Content-Disposition', 'attachement; filename="' + fileName + '"');
    return res.send(JSON.stringify(resData));
  });
});

/**
 * The exports: an init function only
 * @type {{init: Function}}
 */
module.exports = router
