/**
 * User Account Info
 * Created by kc on 29.12.15.
 */

const express  = require('express');
const router   = express.Router();
const settings = require('../settings');

let ngFile = 'accountctrl';
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
