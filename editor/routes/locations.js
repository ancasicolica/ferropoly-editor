/**
 * Administrator route for locations: up- and download
 * Christian Kuster, CH-8342 Wernetshausen, christian@kusti.ch
 * Created: 30.04.22
 **/

const express       = require('express');
const router        = express.Router();
const locationModel = require('../../common/models/locationModel');
const userModel     = require('../../common/models/userModel');
const _             = require('lodash');
const logger        = require('../../common/lib/logger').getLogger('routes:locations');

/**
 * Download JSON File with all locations
 */
router.get('/', function (req, res) {
  userModel.getUserByMailAddress(req.session.passport.user, (err, user) => {
    if (err) {
      return res.render('error/500', {
        message: 'Interner Fehler',
        error  : 'Benutzer konnte nicht gelesen werden'
      });
    }
    let authUser = _.get(user, 'roles.admin', false);
    logger.info(`Dashboard access for ${req.session.passport.user} granted: ${authUser}`);
    if (!authUser) {
      return res.render('error/403', {
        message: 'Auf diese Seite hast Du keinen Zugriff',
        error  : 'Nur für Admins'
      });
    }
    locationModel.getAllLocations(function (err, data) {
      if (err) {
        return res.send('ERROR: ' + err);
      }
      let resData  = {
        type     : 'LocationDatabase',
        version  : 1,
        timestamp: new Date(),
        locations: data
      };
      let fileName = 'locationDb-' + new Date().getTime().toString(16) + '.json'
      res.setHeader('Content-type', 'application/force-download');
      res.setHeader('Content-Disposition', 'attachement; filename="' + fileName + '"');
      return res.send(JSON.stringify(resData));
    });
  });
});

router.get('/summary', function (req, res) {

  locationModel.countLocations((err, result) => {
    if (err) {
      return res.status(500).send({message: _.get(err, 'message', 'Error in countLocations')});
    }
    res.send(result);
  })
});

/**
 * The exports: an init function only
 * @type {{init: Function}}
 */
module.exports = router
