/**
 * Signup Page
 *
 * Created by kc on 17.01.15.
 */


var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  res.render('signup', { title: 'Anmelden', hideLogout: true });
});

var settings;

/**
 * The exports: an init function only
 * @type {{init: Function}}
 */
module.exports = {
  init: function (app, _settings) {
    app.use('/signup', router);
    settings = _settings;

  }
};

