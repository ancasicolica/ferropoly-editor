/**
 * Places challenge times on the game day
 * Christian Kuster, CH-8342 Wernetshausen, christian@kusti.ch
 * Created: 20.11.2026
 **/

/**
 * Places the time from a date value on the game day, discarding seconds and milliseconds.
 * @param {Date|string|null} gameDate Game day.
 * @param {Date|string|null} value Date providing the time.
 * @returns {Date|null} Time on the game day, or null for missing or invalid values.
 */
const onGameDate = (gameDate, value) => {
  if (!gameDate || !value) {
    return null;
  }
  const day  = new Date(gameDate);
  const time = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(day.getTime()) || Number.isNaN(time.getTime())) {
    return null;
  }
  day.setHours(time.getHours(), time.getMinutes(), 0, 0);
  return day;
};

/**
 * Converts a 24-hour time string into a date on the game day.
 * @param {Date|string} gameDate Game day.
 * @param {string} value Time in H:MM or HH:MM format.
 * @returns {Date|null} Time on the game day, or null for an invalid day or time.
 */
const gameTime = (gameDate, value) => {
  if (typeof value !== 'string' || !/^\d{1,2}:\d{2}$/.test(value)) {
    return null;
  }
  const [hours, minutes] = value.split(':').map(Number);
  if (hours > 23 || minutes > 59) {
    return null;
  }
  const date = new Date(gameDate);
  if (Number.isNaN(date.getTime())) {
    return null;
  }
  date.setHours(hours, minutes, 0, 0);
  return date;
};

/**
 * Proposes noon on other game days, or the next half-hour on the current game day.
 * @param {Date|string|null} gameDate Game day.
 * @param {Date} now Current local time.
 * @returns {Date|null} Proposed start on the game day, or null if today has no half-hour left.
 */
const defaultChallengeStart = (gameDate, now = new Date()) => {
  if (!gameDate) {
    return null;
  }
  const day = new Date(gameDate);
  if (Number.isNaN(day.getTime()) || Number.isNaN(now.getTime())) {
    return null;
  }
  if (day.toDateString() !== now.toDateString()) {
    day.setHours(12, 0, 0, 0);
    return day;
  }
  const minutes = now.getMinutes() + (now.getSeconds() || now.getMilliseconds() ? 1 : 0);
  day.setHours(now.getHours(), Math.ceil(minutes / 30) * 30, 0, 0);
  return day.toDateString() === now.toDateString() ? day : null;
};

/**
 * Proposes a challenge time offset from a selected time, clamped to the game's time window.
 * @param {Date|string} gameDate Game day.
 * @param {Date|string} value Selected time.
 * @param {number} offsetMinutes Minutes to add to the selected time.
 * @param {string} gameStart Start of the game in H:MM or HH:MM format.
 * @param {string} gameEnd End of the game in H:MM or HH:MM format.
 * @returns {Date|null} Proposed time, or null if the selected time or window is invalid.
 */
const defaultChallengeTime = (gameDate, value, offsetMinutes, gameStart, gameEnd) => {
  const selected = onGameDate(gameDate, value);
  const start    = gameTime(gameDate, gameStart);
  const end      = gameTime(gameDate, gameEnd);
  if (!selected || !start || !end || selected < start || selected > end || start >= end) {
    return null;
  }
  const proposed = new Date(selected.getTime() + offsetMinutes * 60 * 1000);
  return offsetMinutes > 0 ? new Date(Math.min(proposed, end)) : new Date(Math.max(proposed, start));
};

const challengeDurations = [15, 30, 60, 90, 120, 180];

/**
 * Calculates the end of a challenge for an offered duration without shortening fixed durations.
 * @param {Date|string} gameDate Game day.
 * @param {Date|string|null} value Challenge start.
 * @param {number|'gameEnd'|null} duration Selected minutes or the game-end option.
 * @param {string} gameStart Start of the game.
 * @param {string} gameEnd End of the game.
 * @returns {Date|null} Calculated end or null if it is outside the game window.
 */
const challengeEndForDuration = (gameDate, value, duration, gameStart, gameEnd) => {
  const start = onGameDate(gameDate, value);
  const first = gameTime(gameDate, gameStart);
  const last = gameTime(gameDate, gameEnd);
  if (!start || !first || !last || first >= last || start < first || start >= last ||
      (duration !== 'gameEnd' && !challengeDurations.includes(duration))) {
    return null;
  }
  const end = duration === 'gameEnd' ? last : new Date(start.getTime() + duration * 60 * 1000);
  return end <= last && end.getTime() - start.getTime() >= 15 * 60 * 1000 ? end : null;
};

/**
 * Recognizes the offered duration of an existing challenge without changing its stored end.
 * @param {Date|string} gameDate Game day.
 * @param {Date|string|null} start Challenge start.
 * @param {Date|string|null} end Challenge end.
 * @param {string} gameEnd End of the game.
 * @returns {number|'gameEnd'|null} Matching selection or null for a different duration.
 */
const challengeDuration = (gameDate, start, end, gameEnd) => {
  const first = onGameDate(gameDate, start);
  const last = onGameDate(gameDate, end);
  const gameLast = gameTime(gameDate, gameEnd);
  if (!first || !last || !gameLast || last <= first || last > gameLast) {
    return null;
  }
  if (last.getTime() === gameLast.getTime()) {
    return 'gameEnd';
  }
  const minutes = (last.getTime() - first.getTime()) / (60 * 1000);
  return challengeDurations.includes(minutes) ? minutes : null;
};

/**
 * Checks whether a valid challenge start is earlier than the current time.
 * @param {Date|string|null} start Challenge start time.
 * @param {number} now Current timestamp in milliseconds.
 * @returns {boolean} Whether the start is in the past.
 */
const isChallengeStartInPast = (start, now = Date.now()) => {
  if (!start) {
    return false;
  }
  const timestamp = new Date(start).getTime();
  return Number.isFinite(timestamp) && timestamp < now;
};

export {onGameDate, defaultChallengeTime, defaultChallengeStart, challengeDurations, challengeEndForDuration, challengeDuration, isChallengeStartInPast};
