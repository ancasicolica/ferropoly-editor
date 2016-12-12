/**
 * This file contains regularely done jobs for the ferropoly-editor
 *
 * Created by kc on 06.04.15.
 */


const cron     = require('node-schedule');
const gpLib    = require('./gameplayLib');
const settings = require('../settings');
const logger   = require('../../common/lib/logger').getLogger('cronjobs');

/**
 * Set game options, different for different days
 */
function generateGameOptions() {
  let today = new Date();
  let gameOptions = {};

  switch (today.getUTCDate() % 4) {
    case 0:
      gameOptions.map = 'ostwind';
      gameOptions.random = 60;
      break;

    case 1:
      gameOptions.map = 'zvv';
      gameOptions.random = 60;
      break;

    default:
      gameOptions.map = 'sbb';
      gameOptions.random = 120;
      gameOptions.teamNb = 12;
      break;
  }

  return gameOptions;
}


/**
 * Set up the demo gameplay depending on the configuration
 */
function setUpDemoGamemplayCreation() {
  if (settings.cron.createDemoGameplay) {
    logger.info('CRON: setting up the demo gameplay job', settings.cron.createDemoGameplay);
    cron.scheduleJob(settings.cron.createDemoGameplay, function () {
      logger.info('CRON: starting demo gameplay creation: ', new Date());
      let gameOpts = generateGameOptions();
      gpLib.createDemoGameplay(gameOpts, function (err) {
        if (err) {
          logger.error('CRON: error while creating demo gameplay', err);
        }
        else {
          logger.info('CRON: demo set created');
        }
      });
    });
  }
}

function setupDeletingOldGameplays() {
  if (settings.cron.deleteOldGameplays) {
    logger.info('CRON: setting up the delete-old-games job', settings.cron.deleteOldGameplays);
    cron.scheduleJob(settings.cron.deleteOldGameplays, function () {
      gpLib.deleteOldGameplays(function (err) {
        if (err) {
          logger.error('CRON: error while deleting old gameplays', err);
        }
        else {
          logger.info('CRON: old gameplays deleted');
        }
      });
    });
  }
}

/**
 * The exports
 * @type {{init: Function}}
 */
module.exports = {
  init: function () {
    setUpDemoGamemplayCreation();
    setupDeletingOldGameplays();
  }
};
