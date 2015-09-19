/**
 * Library for gameplay creation
 *
 * Created by kc on 14.02.15.
 */
'use strict';
var gameplays = require('../../common/models/gameplayModel');
var properties = require('../../common/models/propertyModel');
var locations = require('../../common/models/locationModel');
var logs = require('../../common/models/logModel');
var travelLog = require('../../common/models/travelLogModel');
var teamAccountTransaction = require('../../common/models/accounting/teamAccountTransaction');
var propertyAccountTransaction = require('../../common/models/accounting/propertyTransaction');
var chancelleryTransaction = require('../../common/models/accounting/chancelleryTransaction');
var teams = require('../../common/models/teamModel');
var pricelistLib = require('./pricelist');
var _ = require('lodash');
var async = require('async');
var settings = require('../settings');
var schedulerEvents = require('../../common/lib/schedulerEvents');
var schedulerEventsModel = require('../../common/models/schedulerEventModel');
var logger = require('../../common/lib/logger').getLogger('gameplayLib');
var restify = require('restify');
var moment = require('moment');

require('datejs'); // Todo: replace with moment!

var demoGameId = 'play-a-demo-game';
var demoOrganisatorMail = 'demo@ferropoly.ch';

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
      var jsonClient = restify.createJsonClient({
        url: instance,
        version: '*'
      });

      // Fire and forget, don't care about the return
      jsonClient.post('/gamecache/refresh', cb);
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
  var gplen = Math.min(nb, props.length);
  console.log('CREATING RANDOM GAMEPLAY with ' + gplen + ' nb');
  var priceRange = 0;
  var generated = 0;

  try {
    // Handler for the loop
    var updatePropertyHandler = function(err)  {
      if (err) {
        console.log('Error in createRandomGameplay:' + err.message);
      }
      generated++;
      if (generated === gplen) {
        callback(null);
      }
    };

    for (var i = 0; i < gplen; i++) {
      var index = _.random(0, props.length - 1);
      var p = _.pullAt(props, [index]);
      p[0].pricelist.priceRange = priceRange % 6;
      priceRange++;
      properties.updateProperty(gameId, p[0], updatePropertyHandler);
    }
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
  var props = [];
  return locations.getAllLocationsForMap(gpOptions.map, function (err, gameLocations) {
    if (err) {
      return callback(err);
    }

    async.each(gameLocations,
      function (location, cb) {
        properties.createPropertyFromLocation(gameplay.internal.gameId, location, function (err, prop) {
          if (err) {
            console.log('Error while creating property:' + err.message);
          }
          props.push(prop);
          cb(err);
        });
      },
      function (err) {
        if (err) {
          return callback(err);
        }
        if (gpOptions.random) {
          createRandomGameplay(gameplay.internal.gameId, props, gpOptions.random, function (err) {
            return callback(err, gameplay);
          });
        }
        else {
          return callback(null, gameplay);
        }
      });
  });
}

/**
 * Creates a complete new gameplay, including copying the locations to the properties
 * @param gpOptions options for the gameplay.
 * @param gameplays
 * @param locations
 * @param properties
 * @param callback
 */
function createNewGameplay(gpOptions, callback) {
  // Verify options
  if (!gpOptions.email || !gpOptions.map || !gpOptions.gamename || !gpOptions.gamedate) {
    return callback(new Error('Options are not complete'));
  }

  console.log('New game for ' + gpOptions.email);
  gameplays.createGameplay({
    map: gpOptions.map,
    name: gpOptions.gamename,
    ownerEmail: gpOptions.email,
    gameStart: gpOptions.gameStart || '05:00',
    gameEnd: gpOptions.gameEnd || '18:00',
    gameDate: gpOptions.gamedate,
    interestInterval: gpOptions.interestInterval,
    gameId: gpOptions.gameId
  }, function (err, gameplay) {
    if (err) {
      // Error while creating the gameplay, abort
      return callback(err);
    }
    logs.add('New Gameplay created: ' + gpOptions.gameId, function (err) {
      if (err) {
        logger.error('Log error', err);
      }
      // returns the gp as second param in callback
      return copyLocationsToProperties(gpOptions, gameplay, callback);
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

  return properties.removeAllPropertiesFromGameplay(gpOptions.gameId, function (err) {
    if (err) {
      return callback(err);
    }
    return gameplays.getGameplay(gpOptions.gameId, gpOptions.ownerEmail, function (err, gp) {
      if (err || !gp) {
        return callback(err);
      }
      async.series([
        function (callback) {
          gameplays.removeGameplay(gp, callback);
        },
        function (callback) {
          teams.deleteAllTeams(gpOptions.gameId, callback);
        },
        function (callback) {
          propertyAccountTransaction.dumpAccounts(gpOptions.gameId, callback);
        },
        function (callback) {
          teamAccountTransaction.dumpAccounts(gpOptions.gameId, callback);
        },
        function (callback) {
          chancelleryTransaction.dumpChancelleryData(gpOptions.gameId, callback);
        },
        function (callback) {
          schedulerEventsModel.dumpEvents(gpOptions.gameId, callback);
        },
        function (callback) {
          travelLog.deleteAllEntries(gpOptions.gameId, callback);
        },
        function (callback) {
          logs.add('Deleted gameplay: ' + gpOptions.gameId, callback);
        }
      ], function (err, results) {
        if (err) {
          logger.error('Error while deleting gameplays', err);
        }
        logger.info('Parallel task finished');
        if (gpOptions.doNotNotifyMain) {
          return callback();
        }
        // update main instances as we removed the game!
        updateFerropolyMainCache(100, callback);
      });
    });
  });
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
    data: {
      name: entry[0],
      organization: entry[1],
      teamLeader: {name: entry[2], email: entry[3], phone: entry[4]},
      remarks: entry[5]
    }
  };
}
/**
 * Creates the teams for the demo
 * @param gp
 * @param callback
 */
function createDemoTeams(gp, teamNb, callback) {
  var demoTeamData = [];
  var i;
  teamNb = teamNb || 8;
  if (teamNb > 20) {
    teamNb = 20;
  }

  var referenceData = [
    createDemoTeamEntry(gp.internal.gameId, ['Ferropoly Riders', 'Pfadi Züri Oberland', 'Heinz Muster', 'team1@ferropoly.ch', '079 000 00 01']),
    createDemoTeamEntry(gp.internal.gameId, ['Bahnfreaks', 'Cevi Bern', 'Nora Heinzmann', 'team2@ferropoly.ch', '079 000 00 02']),
    createDemoTeamEntry(gp.internal.gameId, ['Bahnschwellen', 'Sek Hinwil', 'Marius Heller', 'team3@ferropoly.ch', '079 000 00 03']),
    createDemoTeamEntry(gp.internal.gameId, ['Schmalspurfans', 'Gewerbeschule Chur', 'Annina Cavegn', 'team4@ferropoly.ch', '079 000 00 04', 'Siegerteam letztes Jahr']),
    createDemoTeamEntry(gp.internal.gameId, ['Pufferbillies', 'Oberstufe Basel', 'Sylvia Meyer', 'team5@ferropoly.ch', '079 000 00 05']),
    createDemoTeamEntry(gp.internal.gameId, ['Mecaronis', 'Mechatronik Team', 'Marcel Grob', 'team6@ferropoly.ch', '079 000 00 06']),
    createDemoTeamEntry(gp.internal.gameId, ['Ticketeria', 'Team Kriens', 'Olivia Huber', 'team7@ferropoly.ch', '079 000 00 07']),
    createDemoTeamEntry(gp.internal.gameId, ['Sackbahnhof', 'Jungwacht St. Gallen', 'Olaf Meier', 'team8@ferropoly.ch', '079 000 00 08']),
    createDemoTeamEntry(gp.internal.gameId, ['Paratore', 'Lehrerseminar Zürich', 'Claudia Mächler', 'team9@ferropoly.ch', '079 000 00 09']),
    createDemoTeamEntry(gp.internal.gameId, ['Sacco per Rifiuti', 'Volleyballclub Luzern', 'Stefan Holzer', 'team10@ferropoly.ch', '079 000 00 10']),
    createDemoTeamEntry(gp.internal.gameId, ['Quartiersau', 'Rover Wetzikon', 'Lea Wolfensberger', 'team11@ferropoly.ch', '079 000 00 11']),
    createDemoTeamEntry(gp.internal.gameId, ['Adventure Club', 'Sängerbund Burgdorf', 'Berni Hirzel', 'team12@ferropoly.ch', '079 000 00 12']),
    createDemoTeamEntry(gp.internal.gameId, ['Los Tigurinos', 'Oberstufe Herisau', 'Nicole Signer', 'team13@ferropoly.ch', '079 000 00 13']),
    createDemoTeamEntry(gp.internal.gameId, ['Exivos', 'Fachhochschule Bern', 'Miriam Toto', 'team14@ferropoly.ch', '079 000 00 14']),
    createDemoTeamEntry(gp.internal.gameId, ['Matchwinner', 'Kantonsschule Aarau', 'Meinrad Wenger', 'team15@ferropoly.ch', '079 000 00 15']),
    createDemoTeamEntry(gp.internal.gameId, ['Broncos', 'Pfadicorps Glockenhof', 'Hansueli Rüdisühli', 'team16@ferropoly.ch', '079 000 00 16']),
    createDemoTeamEntry(gp.internal.gameId, ['Tornados', 'Turnverein Aadorf', 'Christine Müller', 'team17@ferropoly.ch', '079 000 00 17']),
    createDemoTeamEntry(gp.internal.gameId, ['rien-ne-va-plus', 'Verkehrsverein Interlaken', 'Beatrice Rieder', 'team18@ferropoly.ch', '079 000 00 18']),
    createDemoTeamEntry(gp.internal.gameId, ['Routeburn Hoppser', 'Swiss Kiwis', 'Jim Toms', 'team19@ferropoly.ch', '079 000 00 19']),
    createDemoTeamEntry(gp.internal.gameId, ['Die Letzten', '', 'Mike Hintermüller', 'team20@ferropoly.ch', '079 000 00 20'])
  ];
  for (i = 0; i < teamNb; i++) {
    demoTeamData.push(referenceData[i]);
  }
  async.each(demoTeamData,
    function (t, cb) {
      teams.createTeam(t, gp.internal.gameId, cb);
    },
    function (err) {
      callback(err);
    }
  );
}

/**
 * Creates a demo gameplay
 * @param p1 is parameter 1: either settings or callback
 * @param p2 if settings are used, callback
 */
function createDemoGameplay(p1, p2) {
  var callback = p2;
  var settings = {};

  if (_.isFunction(p1)) {
    callback = p1;
  }
  else {
    settings = p1;
  }

  if (settings.tomorrow) {
    settings.gameDate = moment().add(1, 'days').toDate();
  }

  var gameId = settings.gameId || demoGameId;

  var options = {
    map: 'sbb',
    email: settings.email || demoOrganisatorMail,
    ownerEmail: settings.email || demoOrganisatorMail, // for delete options, todo: should be harmonized with email
    organisatorName: 'Max Muster',
    gamedate: settings.gameDate || new Date(),
    gameStart: settings.gameStart || '06:00',
    gameEnd: settings.gameEnd || '21:00',
    gamename: settings.gamename || 'Demo Spiel',
    gameId: gameId,
    random: settings.random || 80,
    teamNb: settings.teamNb || 8,
    doNotNotifyMain: settings.doNotNotifyMain,
    interestInterval: settings.interestInterval
  };

  // The openshift server is located on the East Coast of the USA, thats why the cron job
  // will be executed in the late evening (local time). Therefore the date has to be ajusted
  if (settings.demoGameplay && settings.demoGameplay.addDays) {
    options.gamedate.addDays(settings.demoGameplay.addDays);
    console.log('Date shifted for ' + settings.demoGameplay.addDays + ' days, date is ' + options.gamedate);
  }
  var startTs = new Date();
  gameplays.checkIfGameIdExists(options.gameId, function (err, isExisting) {
    if (err) {
      return callback(err);
    }
    if (isExisting) {
      return deleteGameplay(options, function (err) {
        if (err) {
          return callback(err);
        }
        else {
          // recursive!
          return createDemoGameplay(p1, p2);
        }
      });
    }
    else {
      // Create new gameplay now
      createNewGameplay(options, function (err, gp) {
        if (err) {
          console.log('Failed to create the demo gameplay: ' + err.message);
          return callback(err);
        }
        createDemoTeams(gp, options.teamNb, function (err) {
          if (err) {
            console.log('Failed to create the demo teams: ' + err.message);
            return callback(err);
          }
          pricelistLib.create(gameId, demoOrganisatorMail, function (err) {
            if (err) {
              console.log('Failed to create the demo price list: ' + err.message);
              return callback(err);
            }
            gp.internal.finalized = true;
            gp.internal.doNotNotifyMain = true;
            finalizeGameplay(gp, demoOrganisatorMail, function (err) {
              if (err) {
                console.log('Failed to save demo gameplay: ' + err.message);
                return callback(err);
              }
              var endTs = new Date();
              var duration = (endTs.getTime() - startTs.getTime()) / 1000;
              console.log('Created the demo again and I needed ' + duration + ' seconds for it!');
              logs.add('Demo Gameplay created', callback);
            });
          });
        });
      });
    }
  });
}

/**
 * Finalizes a gameplay
 * @param gameplay
 * @param email
 * @param callback
 */
function finalizeGameplay(gameplay, email, callback) {
  gameplays.finalize(gameplay.internal.gameId, email, function (err, gpSaved) {
    if (err) {
      logger.error('Failed to save demo gameplay: ' + err.message);
      return callback(err);
    }
    properties.finalizeProperties(gameplay.internal.gameId, function (err) {
      if (err) {
        logger.error('Failed to finalize the properties: ' + err.message);
        return callback(err);
      }
      schedulerEvents.createEvents(gpSaved, function (err) {
        if (err) {
          logger.error('Error while creating events', err);
        }
        logger.info('Gameplay finalized', gameplay.internal.gameId);
        if (gameplay.internal.doNotNotifyMain) {
          return callback();
        }
        updateFerropolyMainCache(4000, callback);
      });
    });
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
  finalizeGameplay: finalizeGameplay
};
