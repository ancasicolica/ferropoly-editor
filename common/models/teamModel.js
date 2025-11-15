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
  _id:    {type: String},
  gameId: String, // Gameplay this team plays with
  uuid:   {type: String, index: {unique: true}},     // UUID of this team (index)
  data:   {
    name:               {type: String, default: ''}, // Name of the team
    organization:       {type: String, default: ''}, // Organization the team belongs to
    teamLeader:         {
      name:     {type: String, default: ''},
      email:    {type: String, default: ''},
      phone:    {type: String, default: ''},
      hasLogin: {type: Boolean, default: false} // Info whether the team leader has a login or not
    },
    remarks:            {type: String, default: ''},
    confirmed:          {type: Boolean, default: true},
    onlineRegistration: {type: Boolean},
    registrationDate:   {type: Date, default: Date.now},
    changedDate:        {type: Date, default: Date.now},
    confirmationDate:   {type: Date},
    members:            {type: Array, default: []} // Array with objects (login, personalData) of all team members
  }
}, {autoIndex: true});

/**
 * The Property model
 */
const Team = mongoose.model('Team', teamSchema);

/**
 * Creates a new team
 * @param newTeam
 * @param gameId
 * @return {Promise<*>}
 */
async function createTeam(newTeam, gameId) {
  let team    = new Team();
  team.uuid   = uuid();
  team.gameId = gameId;
  team.data   = newTeam.data;
  team._id    = gameId + '-' + team.uuid;
  logger.info(`${gameId}: Created team ${team.uuid}`);
  return await team.save();
}

/**
 * Updates a team
 * @param team
 * @return {Promise<*|undefined|void>}
 */
async function updateTeam(team) {

  logger.info(`${team.gameId}: Updating team ${team.uuid}`, team);
  let doc = await Team
    .findOne({uuid: team.uuid})
    .exec();

  if (!doc) {
    // Team not available yet, create it
    if (!team.gameId) {
      throw new Error('no game id');
    }
    return await createTeam(team, team.gameId);
  } else {
    if (!team.data.teamLeader.hasLogin) {
      logger.info(`${team.gameId}: Team leader ${team.data.teamLeader.name} has no login for team ${team.uuid}`);
      // Check for Login
      let user = await userModel.getUserByMailAddress(team.data.teamLeader.email);
      logger.info(`${team.gameId}: User found`, user);
      if (user) {
        // When the team-leader has a login, set to true. This never becomes false as logins can not be deleted
        team.data.teamLeader.hasLogin = true;
      }
      doc.data = team.data;
      return await doc.save();
    } else {
      // Team leader has a login, just save
      doc.data = team.data;
      return await doc.save()
    }
  }
}

/**
 * Deletes one team
 * @param teamId
 * @return {Promise<>}
 */
async function deleteTeam(teamId) {
  return await Team
    .deleteOne({uuid: teamId})
    .exec();
}

/**
 * Deletes all teams
 * @param gameId
 * @return {Promise<>}
 */
async function deleteAllTeams(gameId) {
  return await Team.deleteMany({gameId: gameId}).exec();
}

/**
 * Get all teams for a game
 * @param gameId
 * @param callback
 * @returns {*}
 */
async function getTeams(gameId, callback) {
  if (callback) {
    logger.error('>>>>>>>>>>>>>>>>>>>>>> Callback in getTeams is not supported anymore!!!!!!!!!!!!!!!!!!!!!!!!!');
    return callback('NOT SUPPORTED ANYMORE!');
  }

  if (!gameId) {
    throw new Error('No gameId supplied');
  }

  return await Team
    .find({gameId: gameId})
    .lean()
    .exec();
}

/**
 * Get a specific team
 * @param gameId
 * @param teamId
 * @param callback
 * @returns {*}
 */
async function getTeam(gameId, teamId, callback) {
  if (callback) {
    logger.error('>>>>>>>>>>>>>>>>>>>>>> Callback in getTeam is not supported anymore!!!!!!!!!!!!!!!!!!!!!!!!!');
    return callback('NOT SUPPORTED ANYMORE!');
  }

  return await Team
    .findOne({
      'uuid':   teamId,
      'gameId': gameId
    })
    .exec();
}

/**
 * Retrieves the number of unconfirmed teams for a specified game.
 *
 * @param {string} gameId - The identifier of the game for which to count unconfirmed teams.
 * @return {Promise<number>} A promise that resolves to the count of unconfirmed teams in the specified game.
 */
async function getNewTeamsNb(gameId) {
  const nb = await Team.countDocuments({'gameId': gameId, 'data.confirmed': false});
  logger.silly(`${gameId}: ${nb} unconfirmed teams`);
  return nb;
}

/**
 * Count the teams of a given game
 * @param gameId
 * @param callback
 * @returns {*}
 */
async function countTeams(gameId, callback) {
  if (callback) {
    logger.error('>>>>>>>>>>>>>>>>>>>>>> Callback in countTeams is not supported anymore!!!!!!!!!!!!!!!!!!!!!!!!!');
    return callback('NOT SUPPORTED ANYMORE!');
  }

  if (!gameId) {
    throw new Error('No gameId supplied');
  }

  return await Team
    .countDocuments({gameId: gameId})
    .exec();
}

/**
 * Returns the teams as object, each team accessible using team[teamId]
 * @param gameId
 * @param callback
 */
async function getTeamsAsObject(gameId, callback) {
  if (callback) {
    logger.error('>>>>>>>>>>>>>>>>>>>>>> Callback in getTeamsAsObject is not supported anymore!!!!!!!!!!!!!!!!!!!!!!!!!');
    return callback('NOT SUPPORTED ANYMORE!');
  }
  logger.warn(`${gameId}: getTeamsAsObject is deprecated, use getTeamsAsMap instead`);
  const data = await getTeams(gameId);

  // Add all teams to the result
  let teams = {};
  for (let i = 0; i < data.length; i++) {
    teams[data[i].uuid] = data[i];
  }
  return teams;
}

/**
 * Returns the teams as a Map
 * @param gameId
 */
async function getTeamsAsMap(gameId) {
  const data = await getTeams(gameId);

  // Add all teams to the result
  let teams = new Map()
  for (const team of data) {
    teams.set(team.uuid, team);
  }

  return teams;
}

/**
 * Returns all teams where I am assigned as team leader or member
 * @param email
 * @param callback
 */
async function getMyTeams(email, callback) {
  if (callback) {
    logger.error('>>>>>>>>>>>>>>>>>>>>>> Callback in getMyTeams is not supported anymore!!!!!!!!!!!!!!!!!!!!!!!!!');
    return callback('NOT SUPPORTED ANYMORE!');
  }

  let docs = await Team
    .find({
      $or: [
        {'data.teamLeader.email': email},
        {'data.members.login': email}
      ]
    })
    .exec();

  if (docs.length === 0) {
    docs = null;
  }
  return docs;
}

/**
 * Returns my team for a gameplay where I am assigned as team leader
 * @param gameId
 * @param email
 * @param callback
 */
async function getMyTeam(gameId, email, callback) {
  if (callback) {
    logger.error('>>>>>>>>>>>>>>>>>>>>>> Callback in getMyTeam is not supported anymore!!!!!!!!!!!!!!!!!!!!!!!!!');
    return callback('NOT SUPPORTED ANYMORE!');
  }

  return await Team
    .findOne({
      'data.teamLeader.email': email,
      'gameId':                gameId
    })
    .exec();
}

module.exports = {
  Model:            Team,
  createTeam:       createTeam,
  updateTeam:       updateTeam,
  deleteTeam:       deleteTeam,
  deleteAllTeams:   deleteAllTeams,
  getTeams:         getTeams,
  getTeamsAsObject: getTeamsAsObject,
  getTeamsAsMap:    getTeamsAsMap,
  countTeams:       countTeams,
  getMyTeams:       getMyTeams,
  getMyTeam:        getMyTeam,
  getTeam:          getTeam,
  getNewTeamsNb:    getNewTeamsNb
};
