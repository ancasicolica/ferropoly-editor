/**
 * Settings for the server 'stella'
 *
 * used only when
 * export DEPLOY_TYPE="stella"
 * is entered before starting
 *
 * Created by kc on 03.04.15.
 */
'use strict';

module.exports = function(settings) {

  settings.server = {
    port: 3002,
    host: '0.0.0.0',
    serverId: 'stella-editor'
  };

  settings.socketIoServer = {
    port: 3002,
    host: 'ferropoly.synology.me'
  };

  settings.locationDbSettings = {
    mongoDbUrl: process.env.FERROPOLY_CONNECTION_STRING
  };

  settings.cron = {

  };

  return settings;
};
