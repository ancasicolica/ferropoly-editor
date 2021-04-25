/**
 * User Account Info
 * Created by kc on 29.12.15.
 */
const express = require('express');
const router  = express.Router();
const path    = require('path');
/**
 * Send Account Homepage
 */
router.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, '..', 'public', 'html', 'account.html'));
});

module.exports = router;
