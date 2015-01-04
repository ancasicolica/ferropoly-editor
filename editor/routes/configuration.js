/**
 * Created by kc on 04.01.15.
 */
var express = require('express');
var router = express.Router();
var settings;

/* GET download locations JSON structure */
router.get('/', function(req, res) {
  var text = 'var ferropolyServer =' + JSON.stringify(settings.socketIoServer) +';\n';
  res.setHeader('Content-Type', 'text/javascript');
  res.send(text);

});

/**
 * The exports: an init function only
 * @type {{init: Function}}
 */
module.exports = {
  init: function(app, _settings) {
    app.use('/configuration.js', router);
    settings = _settings;
  }
};
