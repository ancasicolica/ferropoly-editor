/**
 * Edit a gameplay
 * Created by kc on 31.01.15.
 */
'use strict';

var express = require('express');
var router = express.Router();
var gameplays;
var settings;
var users;

/* GET edit page */
router.get('/', function (req, res) {
  res.render('edit', {title: 'Spiele verwalten', hideLogout: false});
});


module.exports = {
  init: function (app, _settings, _gameplays, _users) {
    app.use('/edit', router);
    settings = _settings;
    gameplays = _gameplays;
    users = _users;
  }
};
