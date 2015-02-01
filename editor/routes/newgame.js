/**
 * New Game
 * Created by kc on 29.01.15.
 */
'use strict';

var express = require('express');
var router = express.Router();
var multer = require('multer');
var Moniker = require('moniker');

/* GET home page. */
router.get('/', function(req, res) {
  res.render('newgame', { title: 'Neues Spiel' });
});

/* Post params of a new game */
router.post('/', function(req, res) {
  if (!req.body.authToken) {
    return res.send({status: 'error', message:'Permission denied (1)'});
  }
  if (req.body.authToken !== req.session.authToken) {
    return res.send({status: 'error', message:'Permission denied (2)'});
  }

  var names = Moniker.generator([Moniker.verb, Moniker.adjective, Moniker.noun]);
  return res.send({gameplay: names.choose()});
});


/**
 * The exports: an init function only
 * @type {{init: Function}}
 */
module.exports = {
  init: function (app) {
    app.use(multer()); // for parsing multipart/form-data
    app.use('/newgame', router);
  }
};

