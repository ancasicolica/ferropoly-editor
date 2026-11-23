/**
 * The types allowed for scheduler events
 *
 * Christian Kuster, CH-8342 Wernetshausen, christian@kusti.ch
 * Created: 22.11.2026
 **/

module.exports = {
  // Event a few minutes before the start
  PRESTART:            'prestart',
  // Start of the game
  START:               'start',
  // Interest round
  INTEREST:            'interest',
  // End of the game
  END:                 'end',
  // Summary is available
  SUMMARY:             'summary',
  // Start of a challenge
  CHALLENGE_START:     'challengeStart',
  // A challenge goes to the second half
  CHALLENGE_HALF_TIME: 'challengeHalfTime',
  // End of a challenge
  CHALLENGE_END:       'challengeEnd'
};

