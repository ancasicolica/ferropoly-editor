/**
 * Created by christian on 23.02.17.
 */

const settings = require('./../fixtures/settings')();
const login    = require('./../routes/login');
const async    = require('async');
const gameplay = require('./../routes/gameplay');


module.exports = function (callback) {
  let session = {};
  async.waterfall([
    function (cb) {
      login(settings, (err, s) => {
        session = s;
        cb(err);
      });
    },
    function (cb) {
      gameplay.getMyGames({settings, session}, (err, gps) => {
        cb(err);
      })
    }
  ], callback);

};