/**
 * Gets info about the user logged in
 * Created by kc on 29.12.15.
 */

const express   = require('express');
const router    = express.Router();
const userModel = require('../models/userModel');
const logger    = require('../lib/logger').getLogger('userinfo');
const gravatar  = require('../lib/gravatar');

/* GET info about the user */
router.get('/', async function (req, res) {
  try {
    const foundUser = await userModel.getUserByMailAddress(req.session.passport.user);

    const user = foundUser.toObject();
    // Remove some information not needed at client side
    delete user.login;
    delete user._id;
    delete user.__v;

    // Generate gravatar URL 'on the fly'
    user.info.generatedAvatar = gravatar.getUrl(user.personalData.email);

    res.send({success: true, info: user});
  }
  catch(err) {
    logger.error('Error in userinfo', err);
    res.status(500);
    res.send('Fehler bei Abfrage: ' + err.message);
  }
});


module.exports = router;
