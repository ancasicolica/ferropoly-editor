/**
 * Created by kc on 22.01.15.
 */
var express = require('express');
var router = express.Router();


/* GET Sign-up page */
router.get('/', function (req, res) {
  res.render('useradmin', {title: 'Benutzerdaten verwalten', hideLogout: false});
});


module.exports = {
  init: function (app) {
    app.use('/useradmin', router);
  }
};
