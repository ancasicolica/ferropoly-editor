/**
 * Library for gameplay creation
 *
 * Created by kc on 14.02.15.
 */
'use strict';
var gameplays = require('../../common/models/gameplayModel');
var properties = require('../../common/models/propertyModel');
var locations = require('../../common/models/locationModel');
var teams = require('../../common/models/teamModel');

var _ = require('lodash');

var demoGameId = 'play-a-demo-game';
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
    for (var i = 0; i < gplen; i++) {
      var index = _.random(0, props.length - 1);
      var p = _.pullAt(props, [index]);
      p[0].pricelist.priceRange = priceRange % 6;
      priceRange++;
      properties.updateProperty(gameId, p[0], function (err) {
        if (err) {
          console.log('Error in createRandomGameplay:' + err.message);
        }
        generated++;
        if (generated === gplen) {
          callback(null);
        }
      })
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
    var n = 0;
    for (var i = 0; i < gameLocations.length; i++) {
      (function (location) {
        properties.createPropertyFromLocation(gameplay.internal.gameId, location, function (err, prop) {
          if (err) {
            console.log('Error while creating property:' + err.message);
          }
          n++;
          props.push(prop);
          if (n === gameLocations.length) {
            if (gpOptions.random) {
              createRandomGameplay(gameplay.internal.gameId, props, gpOptions.random, function (err) {
                return callback(err, gameplay);
              });
            }
            else {
              return callback(null, gameplay);
            }
          }
        })
      })(gameLocations[i]);
    }
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
    gameStart: '05:00',
    gameEnd: '18:00',
    gameDate: gpOptions.gamedate,
    gameId: gpOptions.gameId
  }, function (err, gameplay) {
    if (err) {
      // Error while creating the gameplay, abort
      return callback(err);
    }
    return copyLocationsToProperties(gpOptions, gameplay, function (err, gp) {
      callback(err, gp);
    });
  });
}

/**
 * Delete a COMPLETE gameplay: properties and gameplay (and logs, if there are some one day)
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
      return gameplays.removeGameplay(gp, function (err) {
        return callback(err);
      })
    })
  })
}

/**
 * Creates one single demo team entry for the createDemoTeams function
 * @param name
 * @param organization
 * @param teamleaderName
 * @param teamleaderMail
 * @param teamleaderPhone
 * @param remarks
 * @returns {{gameId: string, data: {name: *, organization: *, teamLeader: {name: *, email: *, phone: *}, remarks: *}}}
 */
function createDemoTeamEntry(name, organization, teamleaderName, teamleaderMail, teamleaderPhone, remarks) {

  return {
    gameId: demoGameId,
    data: {
      name: name,
      organization: organization,
      teamLeader: {name: teamleaderName, email: teamleaderMail, phone: teamleaderPhone},
      remarks: remarks
    }
  }
}
/**
 * Creates the teams for the demo
 * @param gp
 * @param callback
 */
function createDemoTeams(gp, callback) {
  var teamsCreated = 0;
  var demoTeamData = [
      createDemoTeamEntry('Ferropoly Riders', 'Pfadi Züri Oberland', 'Heinz Muster', 'team1@ferropoly.ch', '079 00 00 00'),
      createDemoTeamEntry('Bahnfreaks', 'Cevi Bern', 'Max Heinzmann', 'team2@ferropoly.ch', '079 00 00 01'),
      createDemoTeamEntry('Bahnschwellen', 'Sek Hinwil', 'Mike Heller', 'team3@ferropoly.ch', '079 00 00 02'),
      createDemoTeamEntry('Schmalspurfans', 'Gewerbeschule Chur', 'Gian Derungs', 'team4@ferropoly.ch', '079 00 00 03', 'Siegerteam letztes Jahr'),
      createDemoTeamEntry('Pufferbillies', 'Oberstufe Kriens', 'Andreas Stauber', 'team5@ferropoly.ch', '079 00 00 04'),
      createDemoTeamEntry('Mecaronis', 'Mechatronik Team', 'Franco Kölliker', 'team6@ferropoly.ch', '079 00 00 05')
  ];
  var nb = demoTeamData.length;
  for (var i = 0; i < nb; i++) {
    teams.createTeam(demoTeamData[i], gp.internal.gameId, function (err) {
      if (err) {
        console.error(err);
      }
      console.log(teamsCreated + ' ' + nb);
      teamsCreated++;
      if (teamsCreated === nb) {
        return callback();
      }
    })
  }
}

/**
 * Creates a demo gameplay
 * @param callback
 */
function createDemoGameplay(callback) {
  var options = {
    map: 'sbb',
    email: 'demo@ferropoly.ch',
    ownerEmail: 'demo@ferropoly.ch', // for delete options, should be harmonized with email
    organisatorName: 'Max Muster',
    gamedate: new Date(),
    gameStart: '06:00',
    gameEnd: '22:00',
    gamename: 'Demo Spiel',
    gameId: demoGameId,
    random: 80
  };
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
          return createDemoGameplay(callback);
        }
      })
    }
    else {
      // Create new gameplay now
      createNewGameplay(options, function (err, gp) {
        if (err) {
          return callback(err);
        }
        createDemoTeams(gp, function(err) {
          callback(err);
        })

      })
    }
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
   * Delete a COMPLETE gameplay: properties and gameplay (and logs, if there are some one day)
   * @param gpOptions
   * @param callback
   * @returns {*}
   */
  deleteGameplay: deleteGameplay,
  /**
   * Create a demo gameplay (and delete if, it already existing)
   */
  createDemoGameplay:createDemoGameplay
};
