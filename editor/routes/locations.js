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
const fs            = require('fs');
const os            = require('os');
const logger        = require('../../common/lib/logger').getLogger('routes:locations');
const upload        = require('multer')({dest: os.tmpdir()});
const async         = require('async');


/**
 * Imports a location into the DB. Existing locations with new data get overwritten (return value -1), existing
 * ones without changes stay the same (return value 0) and new ones are added (return value 1)
 * @param location
 * @param callback
 * @returns {Query}
 */
const importLocation = function (location, callback) {
  return locationModel.getLocationByUuid(location.uuid, function (err, foundLocation) {
    if (err) {
      return callback(err, location, 0);
    }
    if (!foundLocation) {
      // New Location!
      let newLocation = new locationModel.Model({
        name         : location.name,
        uuid         : location.uuid,
        position     : location.position,
        accessibility: location.accessibility,
        maps         : location.maps
      });
      // Save the new location
      return newLocation.save(function (err, location) {
        if (err) {
          return callback(err, location, 0);
        }
        console.log('saved:' + location.name);
        return callback(null, location, 1);
      });
    } else {
      // Update an existing item of the Location model (if data changed)
      let saveNeeded = false;
      if (foundLocation.name !== location.name) {
        foundLocation.name = location.name;
        saveNeeded         = true;
      }
      if ((foundLocation.position.lat !== location.position.lat) || (foundLocation.position.lng !== location.position.lng)) {
        foundLocation.position = location.position;
        saveNeeded             = true;
      }
      if (foundLocation.accessibility !== location.accessibility) {
        foundLocation.accessibility = location.accessibility;
        saveNeeded                  = true;
      }
      // For this comparison we need to change it to a plain object
      let foundLocationObj = foundLocation.toObject();
      if (!_.isEqual(foundLocationObj.maps, location.maps)) {
        saveNeeded = true;
      }

      if (saveNeeded) {
        logger.info(`Updating ${foundLocation.name}`);
        return locationModel.saveLocation(foundLocation, function (err, location) {
          if (err) {
            return console.error(err);
          }
          return callback(null, location, -1);
        });
      } else {
        return callback(null, location, 0);
      }
    }
  });
}

/**
 * Download JSON File with all locations
 */
router.get('/', function (req, res) {
  userModel.getUserByMailAddress(req.session.passport.user, (err, user) => {
    if (err) {
      return res.render('error/500', {
        message: 'Interner Fehler', error: 'Benutzer konnte nicht gelesen werden'
      });
    }
    let authUser = _.get(user, 'roles.admin', false);
    logger.info(`Dashboard access for ${req.session.passport.user} granted: ${authUser}`);
    if (!authUser) {
      return res.render('error/403', {
        message: 'Auf diese Seite hast Du keinen Zugriff', error: 'Nur für Admins'
      });
    }
    locationModel.getAllLocations(function (err, data) {
      if (err) {
        return res.send('ERROR: ' + err);
      }
      let resData  = {
        type: 'LocationDatabase', version: 1, timestamp: new Date(), locations: data
      };
      let fileName = 'locationDb-' + new Date().getTime().toString(16) + '.json'
      res.setHeader('Content-type', 'application/force-download');
      res.setHeader('Content-Disposition', 'attachement; filename="' + fileName + '"');
      return res.send(JSON.stringify(resData));
    });
  });
});

/**
 * Returns the summary about the maps and their locations
 */
router.get('/summary', function (req, res) {
  locationModel.countLocations((err, result) => {
    if (err) {
      return res.status(500).send({message: _.get(err, 'message', 'Error in countLocations')});
    }
    res.send(result);
  })
});


/**
 * Uploading an updated set of the locations
 * @param req
 * @param res
 * @returns {void|*}
 */
const uploadHandler = function (req, res) {
  logger.info('UPLOADING LOCATIONS!', req.file);

  userModel.getUserByMailAddress(req.session.passport.user, (err, user) => {
    if (err) {
      return res.render('error/500', {
        message: 'Interner Fehler', error: 'Benutzer konnte nicht gelesen werden'
      });
    }
    let authUser = _.get(user, 'roles.admin', false);
    logger.info(`Dashboard access for ${req.session.passport.user} granted: ${authUser}`);
    if (!authUser) {
      return res.render('error/403', {
        message: 'Auf diese Seite hast Du keinen Zugriff', error: 'Nur für Admins'
      });
    }
    // console.warn(req);
    res.setHeader('Content-type', 'text/plain; charset=utf-8');
    if (!req.file || !req.file.path) {
      return res.send({message: 'Either the file or the file path does not look correct'});
    }

    return fs.readFile(req.file.path, 'utf8', function (err, data) {
      if (err) {
        logger.error(err);
        return res.status(500).send({message: `Had troubles while reading the file: ${err.message}`});
      }

      const locationDb = JSON.parse(data);

      // Validation
      if (!locationDb.type || !locationDb.version || !locationDb.timestamp || !locationDb.locations) {
        return res.status(400).send({message: 'This seems not to be a valid LocationDb Export file.'});
      }

      if (locationDb.version !== 1) {
        return res.status(400).send({message: 'This location file version is not supported.'});
      }
      if (locationDb.type !== 'LocationDatabase') {
        return res.status(400).send({message: 'This is not a LocationDb Export file.'});
      }

      let locations          = locationDb.locations;
      let changedLocations   = [];
      let newLocations       = [];
      let unalteredLocations = [];
      let errorLocations     = [];

      async.each(locations,
        (location, cb) => {
          importLocation(location, (err, _location, importResult) => {
            if (err) {
              errorLocations.push(_location.name);
            } else {
              switch (importResult) {
                case -1:
                  changedLocations.push(_location.name);
                  break;

                case 0:
                  unalteredLocations.push(_location.name);
                  break;

                case 1:
                  newLocations.push(_location.name);
                  break;
              }
            }
            cb();
          });
        },
        err => {
          if (err) {
            return res.status(500).send({message: _.get(err, 'message', 'Error in updating locations')});
          }
          return res.send({
            newLocations      : newLocations.length,
            unalteredLocations: unalteredLocations.length,
            changedLocations  : changedLocations.length,
            errorLocations
          });
        });
    });
  });
};


/**
 * The exports: an init function only
 * @type {{init: Function}}
 */
module.exports = function (app) {
  app.use('/locations', router);
  app.post('/locations', upload.single('locations'), uploadHandler);
}
