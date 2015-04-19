/**
 * The tracker page
 * Created by kc on 19.04.15.
 */
'use strict';

var express = require('express');
var router = express.Router();

/* GET  tracker page. */
router.get('/', function (req, res) {
  res.render('issuetracker', {title: 'Ferropoly Wünsche & Bugs'});
});

module.exports = router;
