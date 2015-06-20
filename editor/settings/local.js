/**
 * Created by kc on 07.12.14.
 */

module.exports = function (settings) {

  settings.server = {
    port: 3002,
    host: 'localhost',
    serverId: 'localhost-editor'
  };

  settings.socketIoServer = {
    port: 3002,
    host: 'localhost'
  };

  settings.locationDbSettings = {
    mongoDbUrl: 'mongodb://localhost/ferropoly'
  };

  settings.cron = {};

  settings.mailer = {
    senderAddress: process.env.MAILER_SENDER,
    host: process.env.MAILER_HOST,
    port: 465,
    secure: true,
    auth: {
      pass: process.env.MAILER_PASS,
      user: process.env.MAILER_USER
    }
  };

  return settings;
};
