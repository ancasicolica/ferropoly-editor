/**
 * Model for the ferropoly postbox
 * Created by kc on 10.8.18
 */

const mongoose = require('mongoose');
const moment   = require('moment');
const _        = require('lodash');
const logger   = require('../lib/logger').getLogger('postboxModel');


/**
 * The mongoose schema for message in the Postbox
 */
const messageSchema = mongoose.Schema({

  _id      : String,
  gameId   : String, // Gameplay this property belongs to
  timestamp: {type: Date, default: Date.now},
  status   : {type: String, default: 'sent'}, // sent / received
  sender   : {
    teamId  : String, // Sender ID as string, 'reception' for the reception
    email   : String, // the Senders Email (is also the login)
    name    : String, // the Senders name
    position: {
      lat     : Number,
      lng     : Number,
      accuracy: Number
    }
  },
  receiver : {
    id: String  // teamId or 'reception'
  },
  message  : {
    photo: {
      image           : String, // Base 64 String of a photo taken by mobile
      make            : String, // Make info from Exif
      model           : String, // Model info from Exif
      dateTimeOriginal: String // Date when pic was taken (Exif Format, any format!)
    },
    text : String, // Text sent
  }

}, {autoIndex: true});


const Message = mongoose.model('Postbox', messageSchema);

/**
 * Create a new Message
 * @param sender
 * @param gameId
 * @param receiver
 * @param message
 * @param callback
 */
let createMessage = function (gameId, sender, receiver, message, callback) {
  let msg      = new Message();
  msg.gameId   = gameId;
  msg._id      = gameId + '-' + moment().valueOf();
  msg.sender   = {
    teamId  : sender.teamId || 'none',
    email   : sender.email,
    name    : sender.name,
    position: sender.position
  };
  msg.receiver = {
    id: receiver.id
  };
  msg.message  = {
    photo: message.photo,
    text : message.text
  };
  msg.save(function (err, savedMessage) {
    callback(err, savedMessage);
  })
};

/**
 * Deletes all entries for a gameplay
 * @param gameId
 * @param callback
 */
let deleteAllEntries = function (gameId, callback) {
  logger.info('Removing all entries in the log');
  Message.find({gameId: gameId}).remove().exec(callback);
};

/**
 * Returns the most recent messages
 * @param gameId
 * @param teamId
 * @param options
 * @param callback
 */
let getMessages = function (gameId, teamId, options, callback) {
  if (_.isFunction(options)) {
    callback = options;
    options  = {};
  }
  let limit = options.limit || 20;
  let skip  = options.skip || 0;
  let ts    = options.timestamp || 0;

  Message.find({gameId: gameId, $or: [{'receiver.id': teamId}, {'sender.teamId': teamId}]})
    .where('timestamp').gt(ts)
    .skip(skip)
    .sort({'timestamp': -1})
    .limit(limit)
    .lean()
    .exec(callback);
};


/**
 * Returns one specific message
 * @param gameId
 * @param messageId
 * @param options
 * @param callback
 */
let getMessage = function (gameId, messageId, callback) {
  Message.find({gameId: gameId, _id: messageId})
    .limit(1)
    .lean()
    .exec((err, messages) => {
      if (err) {
        return callback(err);
      }
      if (messages.length < 1) {
        return callback(null, {});
      }
      callback(null, messages[0])
    });
};
module.exports = {
  Model           : messageSchema,
  createMessage   : createMessage,
  deleteAllEntries: deleteAllEntries,
  getMessages     : getMessages,
  getMessage      : getMessage
};
