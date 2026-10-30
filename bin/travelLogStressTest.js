#!/usr/bin/env node
/**
 * Creates a stress test by filling the travel log for an existing game with test entries
 *
 * Parameters:
 * --gameId : ID of the gameplay to add travel logs to
 * --nb : number of travel logs per team
 */
const {randomUUID}  = require('node:crypto');
const {DateTime}    = require('luxon');
const argv          = require('minimist')(process.argv.slice(2));
const settings      = require('../editor/settings');
const ferropolyDb   = require('../common/lib/ferropolyDb');
const gameplayModel = require('../common/models/gameplayModel');
const teamModel     = require('../common/models/teamModel');
const travelLog     = require('../common/models/travelLogModel');

async function main(options = argv) {
  const gameId = options.gameId;
  const nb     = Number(options.nb);
  // Reject invalid input before accessing the database to avoid changing entries by mistake.
  if (typeof gameId !== 'string' || !gameId.trim() || !Number.isSafeInteger(nb) || nb <= 0 ||
    !/^\d+$/.test(String(options.nb))) {
    throw new Error('Usage: travelLogStressTest.js --gameId <gameId> --nb <positive integer>');
  }

  await ferropolyDb.init(settings);
  try {
    const gameplay = await gameplayModel.getGameplay(gameId, null);
    const gameStart = gameplay.scheduling?.gameStartTs;
    // Capture the current time once so every team covers the same period.
    const now = DateTime.now().toMillis();
    if (!(gameStart instanceof Date) || !Number.isFinite(gameStart.getTime()) || gameStart.getTime() > now) {
      throw new Error('Invalid game start: gameStartTs must be a valid date not in the future');
    }
    // Remove only previous test entries for this game; keep genuine travel entries.
    await travelLog.Model.deleteMany({gameId: gameId, test: true});
    const teams = await teamModel.getTeams(gameId);
    let count   = 0;
    // Give each team its own latitude band between 46° and 47.8°.
    // Keep the zigzag height small enough that the bands do not overlap.
    const latitudeSpacing = 1.8 / (teams.length + 1);
    const zigzagHeight    = Math.min(0.04, latitudeSpacing / 4);
    const startTimestamp  = gameStart.getTime();
    // Space entries evenly from game start until now; place a single entry at game start.
    const timeStep        = (now - startTimestamp) / Math.max(1, nb - 1);

    for (const [teamIndex, team] of teams.entries()) {
      const latitude = 46 + (teamIndex + 1) * latitudeSpacing;
      // Save at most 500 entries at a time rather than keeping them all in memory.
      for (let start = 0; start < nb; start += 500) {
        const entries = [];
        // Continue counting across batches so direction, zigzag and time remain continuous.
        for (let i = start; i < Math.min(start + 500, nb); i++) {
          entries.push({
            _id:       `${gameId}-test-${randomUUID()}`,
            gameId:    gameId,
            teamId:    team.uuid,
            user:      'stress-test',
            position:  {
              // Alternate south and north of the team's line, moving from west (5.95°) to east (10.5°).
              lat: latitude + (i % 2 === 0 ? -zigzagHeight : zigzagHeight),
              lng: 5.95 + i * 4.55 / Math.max(1, nb - 1)
            },
            timestamp: new Date(startTimestamp + i * timeStep),
            test:      true
          });
        }
        await travelLog.Model.insertMany(entries);
        count += entries.length;
      }
    }

    console.log(`Added ${count} test travel log entries for ${teams.length} teams in ${gameId}`);
  }
  finally {
    await ferropolyDb.close();
  }
}

if (require.main === module) {
  main().catch(err => {
    console.error(err);
    process.exitCode = 1;
  });
}

module.exports = {main};
