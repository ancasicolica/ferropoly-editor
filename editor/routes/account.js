/**
 * User Account Info
 * Created by kc on 29.12.15.
 */

var express = require('express');
var router  = express.Router();

var ngFile = '/js/accountCtrl.js';

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
