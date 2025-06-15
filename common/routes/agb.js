/**
 * AGB Handling
 * Created by kc on 01.05.16.
 */

const express   = require('express');
const router    = express.Router();
const userModel = require('../models/userModel');
const logger    = require('../lib/logger').getLogger('agb');

const currentAgbVersion = 3; // Has to correlate with the ferropoly web page

/* GET if the user accepted the AGB or not */
router.get('/', async function (req, res) {
  try {
    const user = await userModel.getUserByMailAddress(req.session.passport.user);
    let info   = {};
    if (!user.info.agbAccepted) {
      info.agbAccepted    = false;
      info.actionRequired = true;
    } else if (user.info.agbAccepted > 0 && user.info.agbAccepted < currentAgbVersion) {
      info.agbUpdated         = true;
      info.agbAcceptedVersion = user.info.agbAccepted;
      info.actionRequired     = true;
    } else {
      info.actionRequired = false;
    }
    info.currentAgbVersion = currentAgbVersion;
    res.send({success: true, info: info});
  }
  catch (err) {
    logger.error('Error in agb', err);
    res.status(500);
    res.send('Fehler bei Abfrage: ' + err.message);
  }
});

// Accepting the AGB
router.post('/accept', async function (req, res) {
  try {
    const user            = await userModel.getUserByMailAddress(req.session.passport.user);
    user.info.agbAccepted = currentAgbVersion;
    userModel.updateUser(user, null, function (err) {
      if (err) {
        logger.error('Error in agb update', err);
        res.status(500);
        res.send('Fehler bei Abfrage: ' + err.message);
        return;
      }
      res.send({success: true});
    });
  }
  catch (err) {
    logger.error('Error in agb', err);
    res.status(500);
    res.send('Fehler bei Abfrage: ' + err.message);
  }


});

module.exports = router;
