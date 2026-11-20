/**
 * Places challenge times on the game day
 * Christian Kuster, CH-8342 Wernetshausen, christian@kusti.ch
 * Created: 20.11.2026
 **/

const onGameDate = (gameDate, value) => {
  if (!gameDate || !value) return null;
  const day = new Date(gameDate);
  const time = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(day.getTime()) || Number.isNaN(time.getTime())) return null;
  day.setHours(time.getHours(), time.getMinutes(), 0, 0);
  return day;
};

const gameTime = (gameDate, value) => {
  if (typeof value !== 'string' || !/^\d{1,2}:\d{2}$/.test(value)) return null;
  const [hours, minutes] = value.split(':').map(Number);
  if (hours > 23 || minutes > 59) return null;
  const date = new Date(gameDate);
  if (Number.isNaN(date.getTime())) return null;
  date.setHours(hours, minutes, 0, 0);
  return date;
};

const defaultChallengeTime = (gameDate, value, offsetMinutes, gameStart, gameEnd) => {
  const selected = onGameDate(gameDate, value);
  const start = gameTime(gameDate, gameStart);
  const end = gameTime(gameDate, gameEnd);
  if (!selected || !start || !end || selected < start || selected > end || start >= end) return null;
  const proposed = new Date(selected.getTime() + offsetMinutes * 60 * 1000);
  return offsetMinutes > 0 ? new Date(Math.min(proposed, end)) : new Date(Math.max(proposed, start));
};

export {onGameDate, defaultChallengeTime};