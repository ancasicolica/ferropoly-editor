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
const {DateTime}    = require('luxon');
const settings      = require('../settings');

/**
 * Imports a location into the DB. Existing locations with new data get overwritten (return value -1), existing
 * ones without changes stay the same (return value 0) and new ones are added (return value 1)
 * @param location
 * @returns {Query}
 */
const importLocation = async function (location) {
  const foundLocation = await locationModel.getLocationByUuid(location.uuid);

  if (!foundLocation) {
    // New Location!
    let newLocation = new locationModel.Model({
      name:          location.name,
      uuid:          location.uuid,
      position:      location.position,
      accessibility: location.accessibility,
      maps:          location.maps
    });
    // Save the new location
    await newLocation.save()

    logger.info('saved:' + location.name);
    return {location: location, result: 1};
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
      _.assign(foundLocation.maps, location.maps);
    }

    if (saveNeeded) {
      logger.info(`Updating ${foundLocation.name}`);
      await locationModel.saveLocation(foundLocation);
      return {location: location, result: -1};

    } else {
      return {location: location, result: 0};
    }
  }

}

/**
 * Download JSON File with all locations
 */
router.get('/', async function (req, res) {
  try {
    const user   = await userModel.getUserByMailAddress(req.session.passport.user);
    let authUser = _.get(user, 'roles.admin', false);
    logger.info(`Dashboard access for ${req.session.passport.user} granted: ${authUser}`);
    if (!authUser) {
      return res.render('error/403', {
        message: 'Auf diese Seite hast Du keinen Zugriff', error: 'Nur für Admins'
      });
    }
    const data   = await locationModel.getAllLocations();
    let resData  = {
      type:      'LocationDatabase',
      version:   1,
      timestamp: new Date(),
      instance:  settings.server.serverId,
      locations: data
    };
    let fileName = 'locationDb-' + DateTime.now().toFormat('yyLLdd-HHmmss') + '.json'
    res.setHeader('Content-type', 'application/force-download');
    res.setHeader('Content-Disposition', 'attachement; filename="' + fileName + '"');
    return res.send(JSON.stringify(resData));
  }
  catch (err) {
    logger.error(err);
    return res.status(500).send({message: err.messsage});
  }
});

/**
 * Returns the summary about the maps and their locations
 */
router.get('/summary', async function (req, res) {
  try {
    const result = await locationModel.countLocations();
    res.send(result);
  }
  catch (err) {
    return res.status(500).send({message: _.get(err, 'message', 'Error in countLocations')});
  }
});


/**
 * Uploading an updated set of the locations
 * @param req
 * @param res
 * @returns {void|*}
 */
const uploadHandler = async function (req, res) {
  try {
    logger.info('UPLOADING LOCATIONS!', req.file);

    const user   = await userModel.getUserByMailAddress(req.session.passport.user);
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

      locations.forEach(async location => {
        const r          = await importLocation(location);
        let _location    = r.location;
        let importResult = r.result;
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
      });
      return res.send({
        newLocations:       newLocations.length,
        unalteredLocations: unalteredLocations.length,
        changedLocations:   changedLocations.length,
        errorLocations
      });
    });
  }
  catch
    (err) {
    return res.status(500).send({message: _.get(err, 'message', 'Error in updating locations')});
  }
}

/**
 * The exports: an init function only
 * @type {{init: Function}}
 */
module.exports = function (app) {
  app.use('/locations', router);
  app.post('/locations', upload.single('locations'), uploadHandler);
}
