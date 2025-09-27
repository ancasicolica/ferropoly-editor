/**
 * Info route
 * Created by kc on 22.07.15.
 */


const express              = require('express');
const router               = express.Router();
const cors                 = require('cors');
const pkg                  = require('../../package.json');
const {DateTime, Duration} = require('luxon');
const _                    = require('lodash');

const initializationMoment = DateTime.now();
const versions             = process.versions;

const corsOptions = {
  origin:               'https://ferropoly.ch',
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}

module.exports = function (settings, customData) {


  let handler = function (req, res) {

    // default handler
    let additionalHandler = function (callback) {
      callback();
    }
    if (_.isFunction(customData)) {
      additionalHandler = customData;
    }

    additionalHandler((err, data) => {
      if (err) {
        return res.status(500).send(`internal error: ${err.message}`);
      }
      let memUsage     = process.memoryUsage();
      memUsage.totalMb = Math.ceil((memUsage.rss + memUsage.heapTotal + memUsage.heapUsed) / 1024 / 1024);

      let uptime = Duration.fromObject({seconds: process.uptime()});
      res.send({
        copyright:   'Ferropoly ©2015 Christian Kuster, CH-8342 Wernetshausen, Sources provided under GPL licence, see www.ferropoly.ch for details.',
        app:         {
          name:    pkg.name,
          title:   pkg.title,
          version: pkg.version
        },
        settings:    {
          serverId:      settings.server.serverId,
          debugInstance: settings.debug,
          preview:       settings.preview
        },
        memory:      memUsage,
        nodeVersion: versions,
        uptime:      {
          asSeconds: uptime.as('seconds'),
          asMinutes: uptime.as('minutes'),
          asHours:   uptime.as('hours'),
          asDays:    uptime.as('days'),
          forHumans: uptime.toHuman(),
          startTime: initializationMoment
        },
        aux:         data
      });
    })
  }

  router.get('/detailed/:apiKey', function (req, res) {
    if (req.params.apiKey !== _.get(settings, 'apiKey', 'none')) {
      return res.status(401).send('1 + 2 * 2 * 2 * 2 * 5 * 5');
    }
    handler(req, res);
  });
  router.get('/', cors(corsOptions), handler);


  /**
   * Used for login screens
   */
  router.get('/login', cors(corsOptions), (req, res) => {
    res.send({
      app:      {
        name:    pkg.name,
        title:   pkg.title,
        version: pkg.version
      },
      settings: {
        serverId:      settings.server.serverId,
        debugInstance: settings.debug,
        preview:       settings.preview
      },
    });
  });

  return router;
}
