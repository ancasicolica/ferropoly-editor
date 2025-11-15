/**
 * Library for gameplay creation
 *
 * Created by kc on 14.02.15.
 */

const gameplays                  = require('../../common/models/gameplayModel');
const properties                 = require('../../common/models/propertyModel');
const rules                      = require('../../common/models/rulesModel');
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
const Moniker                    = require('moniker');
const pugToHtml                  = require('./pugToHtml');
const settings                   = require('../settings');
const moment                     = require('moment');
const _                          = require('lodash');
const fs                         = require('fs');
const path                       = require('path');
const axios                      = require('axios');
const rulesModel                 = require('../../common/models/rulesModel');
const rulesCompiler              = require('./rulesCompiler');
const demoGameId                 = 'play-a-demo-game';
const demoOrganisatorMail        = 'demo@ferropoly.ch';

/**
 * Updates the ferropoly main program cache
 */
async function updateFerropolyMainCache(delay, callback) {
  if (callback) {
    logger.error('>>>>>>>>>>>>>>>>>>>>>> Callback in updateFerropolyMainCache is not supported anymore!!!!!!!!!!!!!!!!!!!!!!!!!');
    return callback('NOT SUPPORTED ANYMORE!');
  }
  if (!settings.mainInstances || settings.mainInstances.length === 0) {
    logger.info('No main instances to update');
    return;
  }
  try {
    const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

    logger.info('Attempting to update main module caches, delay: ' + delay);
    for (const instance of settings.mainInstances) {
      await sleep(delay);
      await axios.post(`${instance}/gamecache/refresh`);
    }
  }
  catch (err) {
    logger.info('Error in updateFerropolyMainCache (which is not a killer)', err.message);
  }
}

/**
 * Creates a random gameplay: assigns nb properties to a price range, very random
 * @param gameId ID of the game
 * @param props array with the properties
 * @param nb Number of items to assign
 */
async function createRandomGameplay(gameId, props, nb) {
  let gplen = Math.min(nb, props.length);
  logger.info('CREATING RANDOM GAMEPLAY with ' + gplen + ' nb');
  let priceRange = 0;
  let generated  = 0;

  while (generated < gplen) {
    let index = _.random(0, props.length - 1);
    let p     = _.pullAt(props, [index]);
    if (p[0].pricelist.priceRange === -1) {
      p[0].pricelist.priceRange = priceRange % 6;
      priceRange++;
      generated++;
      await properties.updateProperty(gameId, p[0])
    }
  }
}

/**
 * When a new gameplay is created, we have to copy all relevant locations to the properties
 * Also create random values if requested
 *
 * This function was optimized by AI, and I have to admit it did an excellent job, reducing
 * the execution times for factors!
 *
 * @param gpOptions options for gameplay creation
 * @param gameplay  gameplay
 * @returns {*}
 */
async function copyLocationsToProperties(gpOptions, gameplay) {
  const {map, properties: importedProps = [], random} = gpOptions;
  const gameId                                        = gameplay.internal.gameId;

  // Load locations
  const gameLocations = await locations.getAllLocationsForMap(map);
  logger.info(`${gameId}: Read ${gameLocations.length} locations for this map`);

  // Create Map (key value pair table) for fast lookup of imported properties
  const pricelistByUuid = new Map(
    importedProps
      .filter(p => p?.location?.uuid)
      .map(p => [p.location.uuid, p.pricelist])
  );

  // Count number of imported properties
  const importedCount = gameLocations.reduce(
    (count, loc) => count + (pricelistByUuid.has(loc.uuid) ? 1 : 0),
    0
  );

  // Generate Properties in parallel
  const createdProps = await Promise.all(
    gameLocations.map(location =>
      properties.createPropertyFromLocationEx(
        gameId,
        location,
        {pricelist: pricelistByUuid.get(location.uuid)}
      )
    )
  );

  logger.info(`${gameId}: created properties, imported ${importedCount}`);

  // Add random gameplay data (if not imported)
  if (random && importedCount === 0) {
    await createRandomGameplay(gameId, createdProps, random);
    logger.info(`${gameId}: random properties added`);
  }

  return gameplay;
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
 */
async function createNewGameplay(gpOptions) {
  // Verify options
  if (!gpOptions.email || !gpOptions.map || !gpOptions.gamename || !gpOptions.gamedate) {
    throw new Error('Options are not complete');
  }

  logger.info('New game for ' + gpOptions.email + ' using map ' + gpOptions.map);

  const dbUser = await userModel.getUserByMailAddress(gpOptions.email);

  // as default we use the email address as user id
  const user = dbUser || {id: gpOptions.email};

  let gameId = gpOptions.gameId;
  if (!gameId || gameId.length === 0) {
    gameId = Moniker.generator([Moniker.adjective, Moniker.adjective, Moniker.noun]).choose();
  }
  const gameplay = await gameplays.createGameplay({
    gameId:           gameId,
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

  });

  // Create also the rules
  let template = fs.readFileSync(path.join(__dirname, 'rulesTemplate.pug'), 'utf8');
  await rules.createRules(gameId, pugToHtml(template));
  logger.info(`New gameplay with id "${gameplay._id}" created. Is demo: ${gpOptions.isDemo}`);
  return await copyLocationsToProperties(gpOptions, gameplay);
}

/**
 * Delete a COMPLETE gameplay: properties and gameplay
 * @param gpOptions
 * @param callback
 * @returns {*}
 */
async function deleteGameplay(gpOptions, callback) {
  if (callback) {
    logger.error('>>>>>>>>>>>>>>>>>>>>>> Callback in deleteGameplay is not supported anymore!!!!!!!!!!!!!!!!!!!!!!!!!');
    return callback('NOT SUPPORTED ANYMORE!');
  }

  if (!gpOptions.gameId || !gpOptions.ownerEmail) {
    throw new Error('Options are not complete');
  }

  try {
    const gp = await gameplays.getGameplay(gpOptions.gameId, gpOptions.ownerEmail);
    await properties.removeAllPropertiesFromGameplay(gpOptions.gameId);
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
    logger.info('cleaning task finished');
    if (!gpOptions.doNotNotifyMain) {
      // update main instances as we removed the game!
      await updateFerropolyMainCache(100);
    }
  }
  catch (err) {
    logger.error('Error while deleting gameplays', err);
    return callback(err);
  }
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
 */
async function createDemoTeams(gp, teamNb) {
  let i;
  teamNb = teamNb || 8;
  if (teamNb > 20) {
    teamNb = 20;
  }

  let referenceData = [
    createDemoTeamEntry(gp.internal.gameId, ['Ferropoly Riders', 'Pfadi Züri Oberland', demoUsers.getTeamLeaderName(0),
                                             demoUsers.getTeamLeaderEmail(0), '079 000 00 01',
                                             [{login:        demoUsers.getTeamLeaderEmail(20),
                                               personalData: demoUsers.getPersonalData(20)
                                             },
                                              {login:         demoUsers.getTeamLeaderEmail(21),
                                                personalData: demoUsers.getPersonalData(21)
                                              }]]),
    createDemoTeamEntry(gp.internal.gameId, ['Bahnfreaks', 'Cevi Bern', demoUsers.getTeamLeaderName(1),
                                             demoUsers.getTeamLeaderEmail(1), '079 000 00 02',
                                             [{login:        demoUsers.getTeamLeaderEmail(22),
                                               personalData: demoUsers.getPersonalData(22)
                                             },
                                              {login:         demoUsers.getTeamLeaderEmail(24),
                                                personalData: demoUsers.getPersonalData(24)
                                              }]]),
    createDemoTeamEntry(gp.internal.gameId, ['Bahnschwellen', 'Sek Hinwil', demoUsers.getTeamLeaderName(2),
                                             demoUsers.getTeamLeaderEmail(2), '079 000 00 03',
                                             [{login:        demoUsers.getTeamLeaderEmail(20),
                                               personalData: demoUsers.getPersonalData(20)
                                             }]]),
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

  if (callback) {
    logger.error('>>>>>>>>>>>>>>>>>>>>>> Callback in createDemoGameplay is not supported anymore!!!!!!!!!!!!!!!!!!!!!!!!!');
    return callback('NOT SUPPORTED ANYMORE!');
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

  let startTs      = new Date();
  const isExisting = await gameplays.checkIfGameIdExists(options.gameId);
  if (isExisting) {
    await deleteGameplay(options);
  }
  // Create new gameplay now
  const gp = await createNewGameplay(options)
  await createDemoTeams(gp, options.teamNb);

  await pricelistLib.create(gameId, demoOrganisatorMail);
  gp.internal.finalized       = true;
  gp.internal.doNotNotifyMain = true;
  await finalizeGameplay(gp, demoOrganisatorMail);
  let endTs    = new Date();
  let duration = (endTs.getTime() - startTs.getTime()) / 1000;
  logger.info('Created the demo again and I needed ' + duration + ' seconds for it!');

}

/**
 * Finalizes a gameplay
 * @param gameplay
 * @param email
 * @param callback
 */
async function finalizeGameplay(gameplay, email, callback) {
  if (callback) {
    logger.error('>>>>>>>>>>>>>>>>>>>>>> Callback in finalizeGameplay is not supported anymore!!!!!!!!!!!!!!!!!!!!!!!!!');
    return callback('NOT SUPPORTED ANYMORE!');
  }

  const gameId  = gameplay.internal.gameId;
  const gpSaved = await gameplays.finalize(gameId, email);

  // Creating rules
  logger.info(`${gameId} : creating first rules`);
  const rules = await rulesModel.getRules(gameId);
  const text  = rulesCompiler({gp: gpSaved, raw: rules.raw});
  await rulesModel.releaseRules(gameId, text, 'Automatisch bei Finalisierung erzeugt');
  await gameplays.updateRules(gameId, gpSaved.internal.owner, {text: text});

  await properties.finalizeProperties(gameplay.internal.gameId)

  await schedulerEvents.createEvents(gpSaved);
  logger.info('Scheduler Events created');

  if (!gameplay.internal.doNotNotifyMain) {
    await updateFerropolyMainCache(4000);
  }
}

/**
 * Deletes all expired gameplays
 * @param callback
 */
async function deleteOldGameplays(callback) {
  if (callback) {
    logger.error('>>>>>>>>>>>>>>>>>>>>>> Callback in deleteOldGameplays is not supported anymore!!!!!!!!!!!!!!!!!!!!!!!!!');
    return callback('NOT SUPPORTED ANYMORE!');
  }

  const gps = await gameplays.getAllGameplays();

  for (const gp of gps) {
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
    } else {
      if (moment().isAfter(timeout)) {
        await deleteGameplay({gameId: gp._id, ownerEmail: gp.internal.owner, doNotNotifyMain: true});
      }
    }
  }
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
