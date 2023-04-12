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
  try {
    let team        = new Team();
    team.uuid       = uuid();
    team.gameId     = gameId;
    team.data       = newTeam.data;
    team._id        = gameId + '-' + team.uuid;
    const savedTeam = await team.save();
    logger.info(`Created team ${team.uuid} for ${gameId}`);
    callback(null, savedTeam);
  } catch
    (ex) {
    logger.error(ex);
    callback(ex);
  }
}

/**
 * Update a Team
 * @param team
 * @param callback
 */
async function updateTeam(team, callback) {
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
          return callback(new Error('can not create new team: ' + err.message));
        }
        return callback(null, newTeam);
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
            // When the teamleader has a login, set to true. This never becomes false as logins can not be deleted
            team.data.teamLeader.hasLogin = true;
          }
          doc.data = team.data;
          let res  = await doc.save();
          callback(err, res);
        });
      } else {
        // Team leader has a login, just save
        doc.data = team.data;
        let team = await docs[0].save()
        callback(null, team);
      }
    }
  } catch
    (ex) {
    logger.error(ex);
    callback(ex);
  }
}

/**
 * Delete a team
 * @param teamId
 * @param callback
 */
async function deleteTeam(teamId, callback) {
  try {
    await Team
      .deleteOne({uuid: teamId})
      .exec();
    callback(null);
  } catch
    (ex) {
    logger.error(ex);
    callback(ex);
  }
}

/**
 * Delete all teams
 * @param gameId
 * @param callback
 */
async function deleteAllTeams(gameId, callback) {
  try {
    logger.info('Removing all teams for ' + gameId);
    let res = await Team.deleteMany({gameId: gameId}).exec();
    callback(null, res);
  } catch
    (ex) {
    logger.error(ex);
    callback(ex);
  }
}

/**
 * Get all teams for a game
 * @param gameId
 * @param callback
 * @returns {*}
 */
async function getTeams(gameId, callback) {
  try {
    if (!gameId) {
      return callback(new Error('No gameId supplied'));
    }
    let docs = await Team
      .find({gameId: gameId})
      .lean()
      .exec();
    return callback(null, docs);
  } catch
    (ex) {
    logger.error(ex);
    callback(ex);
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
  try {
    let doc = await Team
      .findOne({
        'uuid'  : teamId,
        'gameId': gameId
      })
      .exec();
    callback(null, doc);
  } catch
    (ex) {
    logger.error(ex);
    callback(ex);
  }
}

/**
 * Count the teams of a given game
 * @param gameId
 * @param callback
 * @returns {*}
 */
async function countTeams(gameId, callback) {
  try {
    if (!gameId) {
      return callback(new Error('No gameId supplied'));
    }
    let info = await Team
      .countDocuments({gameId: gameId})
      .exec();
    callback(null, info);
  } catch
    (ex) {
    logger.error(ex);
    callback(ex);
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
  try {
    let docs = await Team
      .find({
        $or: [
          {'data.teamLeader.email': email},
          {'data.members': email}
        ]
      })
      .exec();

    if (docs.length === 0) {
      return callback(null, null);
    }
    callback(null, docs);
  } catch
    (ex) {
    logger.error(ex);
    callback(ex);
  }
}

/**
 * Returns my team for a gameplay where I am assigned as team leader
 * @param gameId
 * @param email
 * @param callback
 */
async function getMyTeam(gameId, email, callback) {
  try {
    let doc = await Team
      .findOne({
        'data.teamLeader.email': email,
        'gameId'               : gameId
      })
      .exec();
    callback(null, doc);
  } catch
    (ex) {
    logger.error(ex);
    callback(ex);
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
