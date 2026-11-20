/**
 * The Model for Challenges
 * Christian Kuster, CH-8342 Wernetshausen, christian@kusti.ch
 * Created: 19.11.2026
 **/

const mongoose = require('mongoose');
const {Schema} = mongoose;

const challengeSchema = new Schema({
    gameId:      {
      type:     String,
      required: true
    },
    title:       {
      type:      String,
      trim:      true,
      required:  true,
      maxlength: [100, 'Der Titel darf maximal 100 Zeichen lang sein.']
    },
    description: {
      type:   String,
      trim:   true,
      select: false // IMPORTANT: Excluded from standard queries (.find()) by default!
    },
    schedule:    {
      start: {
        type:     Date,
        required: true
      },
      end:   {
        type:     Date,
        required: true
      },
    },
    proof:       {
      picture: {
        type:    Boolean,
        default: true
      },
      call:    {
        type:    Boolean,
        default: false
      },
      text:    {
        type:    Boolean,
        default: false
      },
    },
    reward:      {
      min: {
        type:    Number,
        default: 1000
      },
      max: {
        type:    Number,
        default: 10000
      },
    }
  },
  {
    timestamps: true // Automatically creates createdAt and updatedAt
  });

challengeSchema.index({gameId: 1, 'schedule.start': 1, 'schedule.end': 1})

const Challenge = mongoose.model('Challenge', challengeSchema);

async function createChallenge(gameId, options) {
  const challenge = new Challenge();
  Object.assign(challenge, options);
  challenge.gameId = gameId;
  return await challenge.save();
}

async function getChallenges(gameId) {
  return await Challenge.find({gameId: gameId})
    .lean()
    .exec();
}

async function getChallenge(gameId, challengeId) {
  return await Challenge.find({gameId: gameId, _id: challengeId})
    .lean()
    .exec();
}

async function deleteAllChallenges(gameId) {
  return await Challenge.teleteMany({gameId: gameId}).exec();
}

async function updateChallenge(gameId, challenge) {
  let doc = await Challenge
    .findOne({_id: challenge._id, gameId})
    .exec();

  if (!doc) {
    // Challenge not existing yet
    if (!gameId) {
      throw new Error('no game id');
    }
    return await createChallenge(gameId, challenge);
  }

  // Challenge existing
  Object.assign(doc, challenge);
  challenge.gameId = gameId;
  return doc.save();
}

module.exports = {
  Challenge,
  challengeSchema,
  createChallenge,
  getChallenges,
  getChallenge,
  deleteAllChallenges,
  updateChallenge
}
