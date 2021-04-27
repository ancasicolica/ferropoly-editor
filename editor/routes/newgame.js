/**
 * New Game
 * Created by kc on 29.01.15.
 */
const express  = require('express');
const router   = express.Router();
const path     = require('path');

/* GET page for new gameplay */
router.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, '..', 'public', 'html', 'newgame.html'));
});

/**
 * The exports: an init function only
 * @type {{init: Function}}
 */
module.exports = {
  init: function (app) {
    app.use('/newgame', router);
  }
};

