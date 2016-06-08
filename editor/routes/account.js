/**
 * User Account Info
 * Created by kc on 29.12.15.
 */

var express  = require('express');
var router   = express.Router();
var settings = require('../settings');

var ngFile = 'accountctrl';
ngFile     = settings.minifiedjs ? '/js/min/' + ngFile + '.min.js' : '/js/src/' + ngFile + '.js';

router.get('/', function (req, res) {
  res.render('account', {
    title       : 'Mein Account',
    hideLogout  : false,
    ngFile      : ngFile,
    ngApp       : 'accountApp',
    ngController: 'accountCtrl'
  });
});


module.exports = router;
