/**
 * This file contains regularely done jobs for the ferropoly-editor
 *
 * Created by kc on 06.04.15.
 */


const cron       = require('node-schedule');
const gpLib      = require('./gameplayLib');
const settings   = require('../settings');
const logger     = require('../../common/lib/logger').getLogger('cronjobs');
const _          = require('lodash');
const {DateTime} = require('luxon');

/**
 * Set game options, different for different days
 */
function generateGameOptions() {
  let gameOptions = {
    autopilot: {
      active   : _.get(settings, 'autopilot.enabled', false),
      picBucket: _.get(settings, 'autopilot.picBucket', true)
    },
    presets  : 'moderate',
  };

  switch ((DateTime.now().ordinal + _.get(settings, 'demoGameplay.seed', 0)) % 5) {
    case 0:
      gameOptions.gameId             = 'play-a-ostwind-game';
      gameOptions.map                = 'ostwind';
      gameOptions.random             = 80;
      gameOptions.teamNb             = 12;
      gameOptions.autopilot.interval = 15 * 60 * 1000;
      break;

    case 1:
      gameOptions.gameId             = 'play-a-zvv-game';
      gameOptions.map                = 'zvv';
      gameOptions.random             = 80;
      gameOptions.teamNb             = 8;
      gameOptions.autopilot.interval = 20 * 60 * 1000;
      break;

    case 2:
      gameOptions.gameId             = 'play-a-zvv110-game';
      gameOptions.map                = 'zvv110';
      gameOptions.random             = 240;
      gameOptions.teamNb             = 5;
      gameOptions.gameStart          = '10:15';
      gameOptions.gameEnd            = '19:30';
      gameOptions.interestInterval   = 15;
      gameOptions.autopilot.interval = 3.5 * 60 * 1000;
      break;

    case 3:
      gameOptions.gameId             = 'play-a-libero100-game';
      gameOptions.map                = 'libero100';
      gameOptions.random             = 80;
      gameOptions.teamNb             = 7;
      gameOptions.autopilot.interval = 15 * 60 * 1000;
      break;

    default:
      gameOptions.gameId             = 'play-a-demo-game';
      gameOptions.map                = 'sbb';
      gameOptions.random             = 120;
      gameOptions.teamNb             = 16;
      gameOptions.autopilot.interval = 10 * 60 * 1000;
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
        } else {
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
        } else {
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
