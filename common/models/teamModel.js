/**
 * A Team is a group op players in ferropoly
 *
 * Created by kc on 22.03.15.
 */

const mongoose   = require('mongoose');
const logger     = require('../lib/logger').getLogger('teamModel');
const {v4: uuid} = require('uuid');
const userModel  = require('./userModel');

/**
 * The mongoose schema for a property
 */
const teamSchema = mongoose.Schema({
  _id   : {type: String},
  gameId: String, // Gameplay this team plays with
  uuid  : {type: String, index: {unique: true}},     // UUID of this team (index)
  data  : {
    name              : {type: String, default: ''}, // Name of the team
    organization      : {type: String, default: ''}, // Organization the team belongs to
    teamLeader        : {
      name    : {type: String, default: ''},
      email   : {type: String, default: ''},
      phone   : {type: String, default: ''},
      hasLogin: {type: Boolean, default: false} // Info whether the team leader has a login or not
    },
    remarks           : {type: String, default: ''},
    confirmed         : {type: Boolean, default: true},
    onlineRegistration: {type: Boolean},
    registrationDate  : {type: Date, default: Date.now},
    changedDate       : {type: Date, default: Date.now},
    confirmationDate  : {type: Date},
    members           : {type: Array, default: []} // Array with strings (email) of all team members
  }
}, {autoIndex: true});

/**
 * The Property model
 */
const Team = mongoose.model('Team', teamSchema);

/**
 * Create a new team
 * @param newTeam
 * @param gameId
 * @param callback
 */
async function createTeam(newTeam, gameId, callback) {
  let savedTeam, err;
  try {
    let team    = new Team();
    team.uuid   = uuid();
    team.gameId = gameId;
    team.data   = newTeam.data;
    team._id    = gameId + '-' + team.uuid;
    savedTeam   = await team.save();
    logger.info(`Created team ${team.uuid} for ${gameId}`);
  } catch (ex) {
    logger.error(ex);
    err = ex;
  } finally {
    callback(err, savedTeam);
  }
}

/**
 * Update a Team
 * @param team
 * @param callback
 */
async function updateTeam(team, callback) {
  let res, errInfo;
  try {
    logger.info(`Updating team ${team.uuid} for ${team.gameId}`);
    let doc = await Team
      .findOne({uuid: team.uuid})
      .exec();

    if (!doc) {
      // Team not available yet, create it
      if (!team.gameId) {
        return callback(new Error('no game id'));
      }
      return createTeam(team, team.gameId, function (err, newTeam) {
        if (err) {
          errInfo = new Error('can not create new team: ' + err.message);
        } else {
          res = newTeam;
        }
      });
    } else {
      if (!team.data.teamLeader.hasLogin) {
        logger.info(`Team leader ${team.data.teamLeader.name} has no login for team ${team.uuid} for ${team.gameId}`);
        // Check for Login
        await userModel.getUserByMailAddress(team.data.teamLeader.email, async (err, user) => {
          logger.info(`User found`, user);
          if (err) {
            // Not critical!!! ES-Lint requires this if, nothing to do.
          }
          if (user) {
            // When the team-leader has a login, set to true. This never becomes false as logins can not be deleted
            team.data.teamLeader.hasLogin = true;
          }
          doc.data = team.data;
          res      = await doc.save();
        });
      } else {
        // Team leader has a login, just save
        doc.data = team.data;
        res      = await doc.save()
      }
    }
  } catch (ex) {
    logger.error(ex);
    errInfo = ex;
  } finally {
    callback(errInfo, res);
  }
}

/**
 * Delete a team
 * @param teamId
 * @param callback
 */
async function deleteTeam(teamId, callback) {
  let err;
  try {
    await Team
      .deleteOne({uuid: teamId})
      .exec();
  } catch (ex) {
    logger.error(ex);
    err = ex;
  } finally {
    callback(err);
  }
}

/**
 * Delete all teams
 * @param gameId
 * @param callback
 */
async function deleteAllTeams(gameId, callback) {
  let err, res;
  try {
    logger.info('Removing all teams for ' + gameId);
    res = await Team.deleteMany({gameId: gameId}).exec();
  } catch (ex) {
    logger.error(ex);
    err = ex;
  } finally {
    callback(err, res);
  }
}

/**
 * Get all teams for a game
 * @param gameId
 * @param callback
 * @returns {*}
 */
async function getTeams(gameId, callback) {
  if (!gameId) {
    return callback(new Error('No gameId supplied'));
  }

  let err, docs;
  try {
    docs = await Team
      .find({gameId: gameId})
      .lean()
      .exec();
  } catch
    (ex) {
    logger.error(ex);
    err = ex;
  } finally {
    callback(err, docs);
  }
}

/**
 * Get a specific team
 * @param gameId
 * @param teamId
 * @param callback
 * @returns {*}
 */
async function getTeam(gameId, teamId, callback) {
  let doc, err;
  try {
    doc = await Team
      .findOne({
        'uuid'  : teamId,
        'gameId': gameId
      })
      .exec();
  } catch
    (ex) {
    logger.error(ex);
    err = ex;
  } finally {
    callback(err, doc);
  }
}

/**
 * Count the teams of a given game
 * @param gameId
 * @param callback
 * @returns {*}
 */
async function countTeams(gameId, callback) {
  if (!gameId) {
    return callback(new Error('No gameId supplied'));
  }

  let err, info;
  try {
    info = await Team
      .countDocuments({gameId: gameId})
      .exec();
  } catch
    (ex) {
    logger.error(ex);
    err = ex;
  } finally {
    callback(err, info);
  }
}

/**
 * Returns the teams as object, each team accessible using team[teamId]
 * @param gameId
 * @param callback
 */
function getTeamsAsObject(gameId, callback) {
  getTeams(gameId, (err, data) => {
    if (err) {
      return callback(err);
    }
    // Add all teams to the result
    let teams = {};
    for (let i = 0; i < data.length; i++) {
      teams[data[i].uuid] = data[i];
    }
    callback(null, teams);
  });
}

/**
 * Returns all teams where I am assigned as team leader or member
 * @param email
 * @param callback
 */
async function getMyTeams(email, callback) {
  let docs, err;
  try {
    docs = await Team
      .find({
        $or: [
          {'data.teamLeader.email': email},
          {'data.members': email}
        ]
      })
      .exec();

    if (docs.length === 0) {
      docs = null;
    }
  } catch (ex) {
    logger.error(ex);
    err = ex;
  } finally {
    callback(err, docs);
  }
}

/**
 * Returns my team for a gameplay where I am assigned as team leader
 * @param gameId
 * @param email
 * @param callback
 */
async function getMyTeam(gameId, email, callback) {
  let doc, err;
  try {
    doc = await Team
      .findOne({
        'data.teamLeader.email': email,
        'gameId'               : gameId
      })
      .exec();
  } catch (ex) {
    logger.error(ex);
    err = ex;
  } finally {
    callback(err, doc);
  }
}

module.exports = {
  Model           : Team,
  createTeam      : createTeam,
  updateTeam      : updateTeam,
  deleteTeam      : deleteTeam,
  deleteAllTeams  : deleteAllTeams,
  getTeams        : getTeams,
  getTeamsAsObject: getTeamsAsObject,
  countTeams      : countTeams,
  getMyTeams      : getMyTeams,
  getMyTeam       : getMyTeam,
  getTeam         : getTeam
};
