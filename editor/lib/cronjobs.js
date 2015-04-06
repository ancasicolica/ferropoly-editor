/**
 * This file contains regularely done jobs for the ferropoly-editor
 *
 * Created by kc on 06.04.15.
 */
'use strict';

var cron = require('node-schedule');
var gpLib = require('../../common/lib/gameplayLib');
var settings = require('../settings');
/**
 * Set up the demo gameplay depending on the configuration
 */
function setUpDemoGamemplayCreation() {
  if (settings.cron.createDemoGameplay) {
    console.log('CRON: setting up the demo gameplay job: ' + settings.cron.createDemoGameplay);
    cron.scheduleJob(settings.cron.createDemoGameplay, function () {
      console.log('CRON: starting demo gameplay creation: ' + new Date());
      gpLib.createDemoGameplay(function (err) {
        if (err) {
          console.log('CRON: error while creating demo gameplay: ' + err.message);
        }
        else {
          console.log('CRON: demo set created');
        }
      })
    })
  }

}

/**
 * The exports
 * @type {{init: Function}}
 */
module.exports = {
  init: function () {
    setUpDemoGamemplayCreation();
  }
};
