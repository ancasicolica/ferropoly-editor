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
    revision:    {
      type:    Number,
      default: 0
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

challengeSchema.path('schedule.end').validate(function (end) {
  return !this.schedule?.start || !end || end.getTime() - this.schedule.start.getTime() >= 15 * 60 * 1000;
}, 'Eine Challenge muss mindestens 15 Minuten aktiv sein.');

challengeSchema.pre('save', function () {
  this.revision = (this.revision ?? 0) + 1;
});

challengeSchema.index({gameId: 1, 'schedule.start': 1, 'schedule.end': 1})

const Challenge = mongoose.model('Challenge', challengeSchema);

/**
 * Creates a new challenge
 * @param gameId
 * @param options
 */
async function createChallenge(gameId, options) {
  const {revision, ...data} = options;
  const challenge = new Challenge({...data, _id: undefined});
  challenge.gameId = gameId;
  return await challenge.save();
}

/**
 * Returns all challenges for a gameplay
 * @param gameId
 */
async function getChallenges(gameId) {
  return await Challenge.find({gameId: gameId})
    .select('+description')
    .lean()
    .exec();
}

/**
 * Gets a single challenge
 * @param gameId
 * @param challengeId
 */
async function getChallenge(gameId, challengeId) {
  return await Challenge.find({gameId: gameId, _id: challengeId})
    .select('+description')
    .lean()
    .exec();
}

async function deleteChallenge(gameId, challengeId, now = new Date()) {
  return await Challenge.findOneAndDelete({
    _id: challengeId, gameId, 'schedule.start': {$gt: now}
  }).exec();
}

/**
 * Deletes all challenges for a gameplay
 * @param gameId
 */
async function deleteAllChallenges(gameId) {
  return await Challenge.deleteMany({gameId: gameId}).exec();
}

/**
 * Updates (creates) a challenge
 * @param gameId
 * @param challenge
 */
async function updateChallenge(gameId, challenge) {
  let doc = challenge._id ? await Challenge
    .findOne({_id: challenge._id, gameId})
    .select('+description')
    .exec() : null;

  if (!doc) {
    if (!gameId) {
      throw new Error('no game id');
    }
    if (challenge._id) {
      throw new Error('Challenge not found');
    }
    return await createChallenge(gameId, challenge);
  }

  // Challenge existing
  const {revision, ...updates} = challenge;
  Object.assign(doc, updates);
  doc.gameId = gameId;
  return doc.save();
}

module.exports = {
  Challenge,
  challengeSchema,
  createChallenge,
  getChallenges,
  getChallenge,
  deleteChallenge,
  deleteAllChallenges,
  updateChallenge
}
