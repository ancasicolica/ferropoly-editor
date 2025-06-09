/**
 * Library for gameplay creation
 *
 * Created by kc on 14.02.15.
 */

const gameplays                  = require('../../common/models/gameplayModel');
const properties                 = require('../../common/models/propertyModel');
const rules                      = require('../../common/models/rulesModel');
const propertyMap                = require('../../common/lib/propertyMap');
const locations                  = require('../../common/models/locationModel');
const travelLog                  = require('../../common/models/travelLogModel');
const teamAccountTransaction     = require('../../common/models/accounting/teamAccountTransaction');
const propertyAccountTransaction = require('../../common/models/accounting/propertyTransaction');
const chancelleryTransaction     = require('../../common/models/accounting/chancelleryTransaction');
const teams                      = require('../../common/models/teamModel');
const gameLog                    = require('../../common/models/gameLogModel');
const schedulerEvents            = require('../../common/lib/schedulerEvents');
const schedulerEventsModel       = require('../../common/models/schedulerEventModel');
const picBucketModel             = require('../../common/models/picBucketModel');
const userModel                  = require('../../common/models/userModel');
const logger                     = require('../../common/lib/logger').getLogger('gameplayLib');
const demoUsers                  = require('./demoUsers');
const pricelistLib               = require('./pricelist');
const pugToHtml                  = require('./pugToHtml');
const settings                   = require('../settings');
const rulesGenerator             = require('./rulesGenerator');
const needle                     = require('needle');
const moment                     = require('moment');
const _                          = require('lodash');
const async                      = require('async');
const fs                         = require('fs');
const path                       = require('path');

const demoGameId          = 'play-a-demo-game';
const demoOrganisatorMail = 'demo@ferropoly.ch';

/**
 * Updates the ferropoly main program cache
 */
function updateFerropolyMainCache(delay, callback) {
  if (!settings.mainInstances || settings.mainInstances.length === 0) {
    logger.info('No main instances to update');
    return callback();
  }

  logger.info('Attempting to update main module caches in a few seconds');
  _.delay(function () {
    async.each(settings.mainInstances, function (instance, cb) {
      // Fire and forget, don't care about the return
      needle.post(`${instance}/gamecache/refresh`,
        {},
        cb);
    }, function (err) {
      if (err) {
        logger.info('Error in updateFerropolyMainCache (which is not a killer)', err.message);
        // Do not return an error, proceed!!
        return callback();
      }
      logger.info('Ferropoly main instances updated');
      callback();
    });
  }, delay);
}

/**
 * Creates a random gameplay: assigns nb properties to a price range, very random
 * @param gameId ID of the game
 * @param props array with the properties
 * @param nb Number of items to assign
 * @param callback
 */
function createRandomGameplay(gameId, props, nb, callback) {
  let gplen = Math.min(nb, props.length);
  logger.info('CREATING RANDOM GAMEPLAY with ' + gplen + ' nb');
  let priceRange = 0;
  let generated  = 0;

  try {
    async.whilst(
      function (cb) {
        return cb(null, generated < gplen);
      },
      function (cb) {
        let index                 = _.random(0, props.length - 1);
        let p                     = _.pullAt(props, [index]);
        p[0].pricelist.priceRange = priceRange % 6;
        priceRange++;
        generated++;
        properties.updateProperty(gameId, p[0], cb);
      },
      function (err) {
        return callback(err);
      }
    );
  }
  catch (e) {
    console.error(e);
    callback(e);
  }
}

/**
 * When a new gameplay is created, we have to copy all relevant locations to the properties
 * Also create random values if requested
 *
 * @param gpOptions options for gameplay creation
 * @param gameplay  gameplay
 * @param callback
 * @returns {*}
 */
function copyLocationsToProperties(gpOptions, gameplay, callback) {
  let props = [];
  return locations.getAllLocationsForMap(gpOptions.map, function (err, gameLocations) {
    if (err) {
      return callback(err);
    }
    logger.info(`${gameplay.internal.gameId} : Read ${gameLocations.length} locations for this map`);

    const importProperties   = gpOptions.properties || [];
    let nbPropertiesImported = 0;

    async.each(gameLocations,
      function (location, cb) {

        // Handle import data, new since 2025
        let importData = _.find(importProperties, p => {
          return (p.location.uuid === location.uuid)
        });
        if (importData) {
          nbPropertiesImported++;
        }

        properties.createPropertyFromLocationEx(gameplay.internal.gameId, location, {pricelist: importData?.pricelist}, function (err, prop) {
          if (err) {
            logger.info(`${gameplay.internal.gameId} : Error while creating property: ${err.message}`);
          }

          props.push(prop);
          cb(err);
        });
      },
      function (err) {
        if (err) {
          return callback(err);
        }
        logger.info(`${gameplay.internal.gameId}: created properties, imported ${nbPropertiesImported}`);
        if (gpOptions.random && nbPropertiesImported === 0) {
          createRandomGameplay(gameplay.internal.gameId, props, gpOptions.random, function (err) {
            logger.info(`${gameplay.internal.gameId}: random properties added`);
            return callback(err, gameplay);
          });
        } else {
          return callback(null, gameplay);
        }
      });
  });
}

/**
 * Creates the preset set for gameParams
 * @param presets
 * @returns {*}
 */
function getGameParamsPresetSet(presets) {
  logger.info(`Using '${presets}' for new gameplay as preset`);
  switch (presets) {
    case 'easy':
      return {
        presets:                   'easy',
        interestInterval:          60,
        interest:                  4000,
        interestCyclesAtEndOfGame: 2,
        startCapital:              4000,
        debtInterest:              20,
        housePrices:               0.5,
        properties:                {
          lowestPrice:                1000,
          highestPrice:               2000,
          numberOfPriceLevels:        6,
          numberOfPropertiesPerGroup: 2
        },
        rentFactors:               {
          noHouse:              0.25,
          oneHouse:             2,
          twoHouses:            2.75,
          threeHouses:          3,
          fourHouses:           3.5,
          hotel:                4,
          allPropertiesOfGroup: 2
        }
      };

    case 'moderate':
      return {
        presets:                   'moderate',
        interestInterval:          60,
        interest:                  4000,
        interestCyclesAtEndOfGame: 2,
        startCapital:              4000,
        debtInterest:              20,
        housePrices:               0.5,
        properties:                {
          lowestPrice:                1000,
          highestPrice:               4000,
          numberOfPriceLevels:        7,
          numberOfPropertiesPerGroup: 2
        },
        rentFactors:               {
          noHouse:              0.2,
          oneHouse:             0.8,
          twoHouses:            2.5,
          threeHouses:          3.5,
          fourHouses:           4,
          hotel:                5,
          allPropertiesOfGroup: 2
        }
      };

    default:
      return {
        presets:                   'classic',
        interestInterval:          60,
        interest:                  4000,
        interestCyclesAtEndOfGame: 2,
        startCapital:              4000,
        debtInterest:              20,
        housePrices:               0.5,
        properties:                {
          lowestPrice:                1000,
          highestPrice:               8000,
          numberOfPriceLevels:        8,
          numberOfPropertiesPerGroup: 2
        },
        rentFactors:               {
          noHouse:              0.125,
          oneHouse:             0.5,
          twoHouses:            2,
          threeHouses:          3,
          fourHouses:           4,
          hotel:                5,
          allPropertiesOfGroup: 2
        }
      };
  }
}

/**
 * Creates a complete new gameplay, including copying the locations to the properties
 * @param gpOptions options for the gameplay.
 * @param callback
 */
function createNewGameplay(gpOptions, callback) {
  // Verify options
  if (!gpOptions.email || !gpOptions.map || !gpOptions.gamename || !gpOptions.gamedate) {
    return callback(new Error('Options are not complete'));
  }

  logger.info('New game for ' + gpOptions.email + ' using map ' + gpOptions.map);
  userModel.getUserByMailAddress(gpOptions.email, function (err, user) {
    if (err) {
      return callback(err);
    }
    // as default we use the email address as user id
    user = user || {id: gpOptions.email};

    gameplays.createGameplay({
      gameId:           gpOptions.gameId || '',
      map:              gpOptions.map,
      name:             gpOptions.gamename,
      ownerEmail:       gpOptions.email,
      organisatorName:  gpOptions.organisatorName,
      ownerId:          user.id,
      gameStart:        gpOptions.gameStart || '05:00',
      gameEnd:          gpOptions.gameEnd || '18:00',
      gameDate:         gpOptions.gamedate,
      instance:         settings.server.serverId,
      mobile:           gpOptions.mobile || {level: gameplays.MOBILE_BASIC},
      gameParams:       gpOptions.gameParams || getGameParamsPresetSet(gpOptions.presets),
      interestInterval: gpOptions.interestInterval,
      isDemo:           gpOptions.isDemo,
      mainInstances:    settings.mainInstances,
      autopilot:        gpOptions.autopilot

    }, function (err, gameplay) {
      if (err) {
        // Error while creating the gameplay, abort
        return callback(err);
      }

      // Create also the rules
      let template = fs.readFileSync(path.join(__dirname, 'rulesTemplate.pug'), 'utf8');
      rules.createRules(gpOptions.gameId, pugToHtml(template))
        .finally(() => {
          logger.info(`New gameplay with id "${gameplay._id}" created. Is demo: ${gpOptions.isDemo}`);
          return copyLocationsToProperties(gpOptions, gameplay, callback);
        });
    });
  });

}

/**
 * Delete a COMPLETE gameplay: properties and gameplay
 * @param gpOptions
 * @param callback
 * @returns {*}
 */
function deleteGameplay(gpOptions, callback) {
  if (!gpOptions.gameId || !gpOptions.ownerEmail) {
    return callback(new Error('Options are not complete'));
  }

  properties.removeAllPropertiesFromGameplay(gpOptions.gameId, async function (err) {
    if (err) {
      return callback(err);
    }
    try {
      const gp = await gameplays.getGameplay(gpOptions.gameId, gpOptions.ownerEmail)
      await teams.deleteAllTeams(gpOptions.gameId);
      await propertyAccountTransaction.dumpAccounts(gpOptions.gameId);
      await teamAccountTransaction.dumpAccounts(gpOptions.gameId)
      await chancelleryTransaction.dumpChancelleryData(gpOptions.gameId);
      await schedulerEventsModel.dumpEvents(gpOptions.gameId);
      await picBucketModel.deletePicBucket(gpOptions.gameId);
      await gameplays.removeGameplay(gp);
      await travelLog.deleteAllEntries(gpOptions.gameId);
      await gameLog.deleteAllEntries(gpOptions.gameId);
      await rules.deleteRules(gpOptions.gameId);
    }
    catch (err) {
      logger.error('Error while deleting gameplays', err);
      return callback(err);
    }
    logger.info('cleaning task finished');
    if (gpOptions.doNotNotifyMain) {
      return callback();
    }
    // update main instances as we removed the game!
    updateFerropolyMainCache(100, callback);
  }).catch(err => {
    callback(err);
  })
}

/**
 * Creates one single demo team entry for the createDemoTeams function
 * @param gameId
 * @param entry array with the data
 * @returns {{gameId: string, data: {name: *, organization: *, teamLeader: {name: *, email: *, phone: *}, remarks: *}}}
 */
function createDemoTeamEntry(gameId, entry) {

  return {
    gameId: gameId,
    data:   {
      name:         entry[0],
      organization: entry[1],
      teamLeader:   {name: entry[2], email: entry[3], phone: entry[4]},
      remarks:      '',
      members:      entry[5] || []
    }
  };
}

/**
 * Creates the teams for the demo
 * @param gp
 * @param teamNb
 * @param callback
 */
async function createDemoTeams(gp, teamNb, callback) {
  let i;
  teamNb = teamNb || 8;
  if (teamNb > 20) {
    teamNb = 20;
  }

  let referenceData = [
    createDemoTeamEntry(gp.internal.gameId, ['Ferropoly Riders', 'Pfadi Züri Oberland', demoUsers.getTeamLeaderName(0),
                                             demoUsers.getTeamLeaderEmail(0), '079 000 00 01',
                                             [demoUsers.getTeamLeaderEmail(20), demoUsers.getTeamLeaderEmail(21)]]),
    createDemoTeamEntry(gp.internal.gameId, ['Bahnfreaks', 'Cevi Bern', demoUsers.getTeamLeaderName(1),
                                             demoUsers.getTeamLeaderEmail(1), '079 000 00 02',
                                             [demoUsers.getTeamLeaderEmail(22), demoUsers.getTeamLeaderEmail(23),
                                              demoUsers.getTeamLeaderEmail(24)]]),
    createDemoTeamEntry(gp.internal.gameId, ['Bahnschwellen', 'Sek Hinwil', demoUsers.getTeamLeaderName(2),
                                             demoUsers.getTeamLeaderEmail(2), '079 000 00 03',
                                             [demoUsers.getTeamLeaderEmail(20)]]),
    createDemoTeamEntry(gp.internal.gameId, ['Schmalspurfans', 'Gewerbeschule Chur', demoUsers.getTeamLeaderName(3),
                                             demoUsers.getTeamLeaderEmail(3), '079 000 00 04',
                                             'Siegerteam letztes Jahr']),
    createDemoTeamEntry(gp.internal.gameId, ['Pufferbillies', 'Oberstufe Basel', demoUsers.getTeamLeaderName(4),
                                             demoUsers.getTeamLeaderEmail(4), '079 000 00 05']),
    createDemoTeamEntry(gp.internal.gameId, ['Mecaronis', 'Mechatronik Team', demoUsers.getTeamLeaderName(5),
                                             demoUsers.getTeamLeaderEmail(5), '079 000 00 06']),
    createDemoTeamEntry(gp.internal.gameId, ['Ticketeria', 'Team Kriens', demoUsers.getTeamLeaderName(6),
                                             demoUsers.getTeamLeaderEmail(6), '079 000 00 07']),
    createDemoTeamEntry(gp.internal.gameId, ['Sackbahnhof', 'Jungwacht St. Gallen', demoUsers.getTeamLeaderName(7),
                                             demoUsers.getTeamLeaderEmail(7), '079 000 00 08']),
    createDemoTeamEntry(gp.internal.gameId, ['Paratore', 'Lehrerseminar Zürich', demoUsers.getTeamLeaderName(8),
                                             demoUsers.getTeamLeaderEmail(8), '079 000 00 09']),
    createDemoTeamEntry(gp.internal.gameId, ['Sacco per Rifiuti', 'Volleyballclub Luzern',
                                             demoUsers.getTeamLeaderName(9), demoUsers.getTeamLeaderEmail(9),
                                             '079 000 00 10']),
    createDemoTeamEntry(gp.internal.gameId, ['Quartiersau', 'Rover Wetzikon', demoUsers.getTeamLeaderName(10),
                                             demoUsers.getTeamLeaderEmail(10), '079 000 00 11']),
    createDemoTeamEntry(gp.internal.gameId, ['Adventure Club', 'Sängerbund Burgdorf', demoUsers.getTeamLeaderName(11),
                                             demoUsers.getTeamLeaderEmail(11), '079 000 00 12']),
    createDemoTeamEntry(gp.internal.gameId, ['Los Tigurinos', 'Oberstufe Herisau', demoUsers.getTeamLeaderName(12),
                                             demoUsers.getTeamLeaderEmail(12), '079 000 00 13']),
    createDemoTeamEntry(gp.internal.gameId, ['Exivos', 'Fachhochschule Bern', demoUsers.getTeamLeaderName(13),
                                             demoUsers.getTeamLeaderEmail(13), '079 000 00 14']),
    createDemoTeamEntry(gp.internal.gameId, ['Matchwinner', 'Kantonsschule Aarau', demoUsers.getTeamLeaderName(14),
                                             demoUsers.getTeamLeaderEmail(14), '079 000 00 15']),
    createDemoTeamEntry(gp.internal.gameId, ['Broncos', 'Pfadicorps Glockenhof', demoUsers.getTeamLeaderName(15),
                                             demoUsers.getTeamLeaderEmail(15), '079 000 00 16']),
    createDemoTeamEntry(gp.internal.gameId, ['Tornados', 'Turnverein Aadorf', demoUsers.getTeamLeaderName(16),
                                             demoUsers.getTeamLeaderEmail(16), '079 000 00 17']),
    createDemoTeamEntry(gp.internal.gameId, ['Know-Nothing Bozo the Non-Wonder Dog & Wonko the sane',
                                             'Verkehrsverein Interlaken', demoUsers.getTeamLeaderName(17),
                                             demoUsers.getTeamLeaderEmail(17), '079 000 00 18']),
    createDemoTeamEntry(gp.internal.gameId, ['Routeburn Hoppser', 'Swiss Kiwis', 'Jim Toms',
                                             demoUsers.getTeamLeaderName(18), demoUsers.getTeamLeaderEmail(18),
                                             '079 000 00 19']),
    createDemoTeamEntry(gp.internal.gameId, ['Die Letzten', '', demoUsers.getTeamLeaderName(19),
                                             demoUsers.getTeamLeaderEmail(19), '079 000 00 20'])
  ];
  for (i = 0; i < teamNb; i++) {
    await teams.createTeam(referenceData[i], gp.internal.gameId);
  }

  callback();
}

/**
 * Creates a demo gameplay
 * @param p1 is parameter 1: either settings or callback
 * @param p2 if settings are used, callback
 */
async function createDemoGameplay(p1, p2) {
  let callback = p2;
  let settings = {};

  if (_.isFunction(p1)) {
    callback = p1;
  } else {
    settings = p1;
  }

  if (settings.tomorrow) {
    settings.gameDate = moment().add(1, 'days').toDate();
  }

  let gameId = settings.gameId || demoGameId;

  let options = {
    map:        settings.map || 'sbb',
    email:      settings.email || demoOrganisatorMail,
    ownerEmail: settings.email || demoOrganisatorMail, // for delete options, todo: should be harmonized with
                                                       // email
    organisatorName:  'Max Muster',
    gamedate:         settings.gameDate || new Date(),
    gameStart:        settings.gameStart || '06:00',
    gameEnd:          settings.gameEnd || '21:00',
    gamename:         settings.gamename || 'Demo Spiel',
    gameId:           gameId,
    random:           settings.random || 120,
    teamNb:           settings.teamNb || 8,
    doNotNotifyMain:  settings.doNotNotifyMain,
    interestInterval: settings.interestInterval,
    mobile:           settings.mobile || {level: 5},
    presets:          settings.presets,
    isDemo:           true,
    autopilot:        {
      active:    _.get(settings, 'autopilot.active', false),
      picBucket: _.get(settings, 'autopilot.picBucket', false),
      interval:  _.get(settings, 'autopilot.interval', (30 * 60 * 1000))
    }
  };

  // The openshift server is located on the East Coast of the USA, thats why the cron job
  // will be executed in the late evening (local time). Therefore the date has to be ajusted
  if (settings.demoGameplay && settings.demoGameplay.addDays) {
    options.gamedate.addDays(settings.demoGameplay.addDays);
    logger.info('Date shifted for ' + settings.demoGameplay.addDays + ' days, date is ' + options.gamedate);
  }
  try {
    let startTs      = new Date();
    const isExisting = await gameplays.checkIfGameIdExists(options.gameId);
    if (isExisting) {
      return deleteGameplay(options, function (err) {
        if (err) {
          return callback(err);
        } else {
          // recursive!
          return createDemoGameplay(p1, p2);
        }
      });
    } else {
      // Create new gameplay now
      createNewGameplay(options, function (err, gp) {
        if (err) {
          logger.info('Failed to create the demo gameplay: ' + err.message);
          return callback(err);
        }
        createDemoTeams(gp, options.teamNb, function (err) {
          if (err) {
            logger.info('Failed to create the demo teams: ' + err.message);
            return callback(err);
          }
          pricelistLib.create(gameId, demoOrganisatorMail, function (err) {
            if (err) {
              logger.info('Failed to create the demo price list: ' + err.message);
              return callback(err);
            }
            gp.internal.finalized       = true;
            gp.internal.doNotNotifyMain = true;
            finalizeGameplay(gp, demoOrganisatorMail, function (err) {
              if (err) {
                logger.info('Failed to save demo gameplay: ' + err.message);
                return callback(err);
              }
              let endTs    = new Date();
              let duration = (endTs.getTime() - startTs.getTime()) / 1000;
              logger.info('Created the demo again and I needed ' + duration + ' seconds for it!');
              callback();
            });
          });
        });
      });
    }
  }
  catch (err) {
    callback(err);
  }
}

/**
 * Finalizes a gameplay
 * @param gameplay
 * @param email
 * @param callback
 */
async function finalizeGameplay(gameplay, email, callback) {
  try {
    const gpSaved = await gameplays.finalize(gameplay.internal.gameId, email);

    let rules = rulesGenerator(gpSaved);
    await gameplays.updateRules(gpSaved.internal.gameId, gpSaved.internal.owner, {text: rules});

    properties.finalizeProperties(gameplay.internal.gameId, function (err) {
      if (err) {
        logger.error('Failed to finalize the properties: ' + err.message);
        return callback(err);
      }
      schedulerEvents.createEvents(gpSaved, function (err) {
        if (err) {
          logger.error('Error while creating events', err);
        }
        logger.info('Scheduler Events created');
        propertyMap.create({gameId: gameplay.internal.gameId, squaresOnShortSide: 4}, err => {
          logger.info('Property map created');
          if (err) {
            logger.error(err);
          }
          if (gameplay.internal.doNotNotifyMain) {
            return callback();
          }
          updateFerropolyMainCache(4000, callback);
        });
      });
    });

  }
  catch (err) {
    logger.error('Error in finalizeGameplay', err);
    callback(err);
  }
}

/**
 * Deletes all expired gameplays
 * @param callback
 */
function deleteOldGameplays(callback) {
  gameplays.getAllGameplays().then(gps => {
    async.each(gps,
      function (gp, cb) {
        let timeout;
        if (!gp.scheduling.deleteTs) {
          // This is legacy handling: games created before introducing the deleteTs flag will be deleted 1 month after
          // the game took place. This code can be removed in the next ferropoly release
          timeout = moment(gp.scheduling.gameDate).add(1, 'M');
        } else {
          // This is the code which should run for current (V2) ferropolys
          timeout = moment(gp.scheduling.deleteTs);
        }
        logger.info(`Deletion timeout for "${gp._id}":`, timeout.toDate());
        if (!timeout) {
          // Still no timeout, cancel this one, but still handle others
          logger.error(new Error('No deletion timeout found for ' + gp._id));
          return cb();
        }

        if (moment().isAfter(timeout)) {
          deleteGameplay({gameId: gp._id, ownerEmail: gp.internal.owner, doNotNotifyMain: true}, cb);
        }
      },
      callback
    );
  }).catch(err => {
    return callback(err);
  });
}


module.exports = {
  /**
   * Creates a complete new gameplay, including copying the locations to the properties
   * @param gpOptions options for the gameplay.
   * @param gameplays
   * @param locations
   * @param properties
   * @param callback
   */
  createNewGameplay: createNewGameplay,

  /**
   * Delete a COMPLETE gameplay: properties and gameplay
   * @param gpOptions
   * @param callback
   * @returns {*}
   */
  deleteGameplay: deleteGameplay,

  /**
   * Create a demo gameplay (and delete if, it already existing)
   */
  createDemoGameplay: createDemoGameplay,

  /**
   * Finalize the gameplay
   */
  finalizeGameplay: finalizeGameplay,

  /**
   * Deletes all expired gameplays
   */
  deleteOldGameplays: deleteOldGameplays
};
