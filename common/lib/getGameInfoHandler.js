const gameplayModel = require('../models/gameplayModel');

module.exports = async function getGameInfoHandler(req, res) {
  try {
    const gameplay = await gameplayModel.getGameplay(
      req.params.gameId,
      req.session.passport.user
    );
    return res.send(gameplay);
  } catch (err) {
    return res.status(500).send({ message: 'DB read error: ' + err.message });
  }
};