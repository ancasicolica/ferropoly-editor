/**
 * Created by kc on 04.01.15.
 */

var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Ferropoly', ngController:'indexCtrl', ngApp:'indexApp', ngFile:'/js/indexctrl.js' });
});

module.exports = router;
