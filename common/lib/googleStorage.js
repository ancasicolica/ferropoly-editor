/**
 * Access to the storage of Google Clouds
 *
 * Created by kc on 18.4.2020.
 */

const logger            = require('../lib/logger').getLogger('googleStorage');
const googleStorageData = require('../models/googleStorageData');
const path              = require('path');
const {Storage}         = require('@google-cloud/storage');
const _                 = require('lodash');
const {v4: uuid}        = require('uuid');
const crypto            = require('crypto');
const async             = require('async');
const fs                = require('fs');
const jimp              = require('jimp')

module.exports = function (settings) {

  const storage      = new Storage({keyFilename: settings.googleStorage.keyFile});
  const tempFilePath = path.join(__dirname, '..', '..', 'temp');

  /**
   * Core function for uploading an image. Taken from Googles Demo account
   * @param pathToFile
   * @param destinationFilename
   * @returns {Promise<void>}
   */
  async function uploadFile(pathToFile, destinationFilename) {
    // Uploads a local file to the bucket
    await storage.bucket(settings.googleStorage.bucketName).upload(pathToFile, {
      // Support for HTTP requests made with `Accept-Encoding: gzip`
      gzip       : true,
      // By setting the option `destination`, you can change the name of the
      // object you are uploading to a bucket.
      metadata   : {
        // Enable long-lived HTTP caching headers
        // Use only if the contents of the file will never change
        // (If the contents will change, use cacheControl: 'no-cache')
        cacheControl: 'public, max-age=31536000',
      },
      destination: destinationFilename
    });

    console.log(`uploaded to ${settings.googleStorage.bucketName}.`);
  }

  /**
   * Creates the file name in the bucket
   * @param gameId
   * @param fileName
   * @returns {string}
   */
  function createDestinationFileName(gameId, fileName) {
    return `${settings.instance}/${gameId}/${fileName}`;
  }

  /**
   * Uploads a single picture
   * @param gameId
   * @param info
   * @param callback
   */
  function uploadPic(gameId, info, callback) {
    let storageFileName = createDestinationFileName(gameId, path.basename(info.fileName));
    googleStorageData.addImage(gameId, {
      teamId  : info.teamId,
      title   : info.title,
      fileName: storageFileName
    }, err => {
      if (err) {
        return callback(err);
      }
      uploadFile(info.fileName, storageFileName).then((e) => {
        logger.info(`Google Upload for ${storageFileName} success`, e);
        return callback(e);
      }, e => {
        logger.info(`Google Upload for ${storageFileName} failed`);
        return callback(e);
      }).catch(err => {
        logger.error(err);
        return callback(err);
      });
    });
  }

  function createImageFiles(image, callback) {
    const hash = crypto.createHash('sha256');
    hash.update(image);
    const baseFileName = hash.digest('hex');
    const fileNameHres = baseFileName + '.jpg';
    const fileNameLres = baseFileName + '_tn.jpg';
    let retVal         = {
      imagePathHighRes: path.join(tempFilePath, fileNameHres),
      imagePathLowRes : path.join(tempFilePath, fileNameLres)
    };

    async.waterfall([
        function (cb) {
          fs.writeFile(retVal.imagePathHighRes, image, cb);
        },
        function (cb) {
          jimp.read(image, cb);
        },
        function (img, cb) {
          img.resize(160, jimp.AUTO).quality(60).write(retVal.imagePathLowRes, cb);
        }
      ],
      err => {
        callback(err, retVal);
      })
  }

  return {
    /**
     * Adds a picture taken for purchasing a location
     * @param gameId
     * @image Buffer with the image data
     * @param info contains:
     *  teamId:   Mandatory, id of the team
     *  title:    Optional, description of the pic
     * @param callback
     */
    addLocationPurchasePic: function (gameId, image, info, callback) {
      let imageInfo = {};
      let retVal    = {};
      async.waterfall([
        function (cb) {
          createImageFiles(image, cb);
        },
        function (_imageInfo, cb) {
          imageInfo = _imageInfo;
          uploadPic(gameId, {fileName: imageInfo.imagePathHighRes, teamId: info.teamId, title: info.title}, cb)
        },
        function (cb) {
          uploadPic(gameId, {fileName: imageInfo.imagePathLowRes, teamId: info.teamId, title: info.title}, cb)
        }
      ], function (err, result) {
        if (err) {
          logger.error(err);
          return callback(err);
        }
        retVal.lowRes = result;
        logger.info(retVal);
        callback(null, retVal);
      });


    },

    deleteAllPics: function (gameId, callback) {

    }
  }
}
