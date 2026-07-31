/**
 * Types for the team transactions
 * Christian Kuster, CH-8342 Wernetshausen, christian@kusti.ch
 * Created: 26.12.2025
 **/

/**
 * Default setting, not defined. Fires a warning in the logs
 * @type {number}
 */
export const TEAM_TRANSACTION_UNDEFINED = -1

/**
 * A manual booking (which is very seldom)
 * @type {number}
 */
export const TEAM_TRANSACTION_MANUAL = 1;

/**
 * Winnings or losses by gambling
 * @type {number}
 */
export const TEAM_TRANSACTION_GAMBLING = 5;

/**
 * Winnings or losses by chancellery
 * @type {number}
 */
export const TEAM_TRANSACTION_CHANCELLERY = 8;


/**
 * When the amount of money is too low, pay an interest
 * @type {number}
 */
export const TEAM_TRANSACTION_PENALTY_RATE = 9;

/**
 * Buying a property
 * @type {number}
 */
export const TEAM_TRANSACTION_PURCHASE_PROPERTY = 10;

/**
 * Buying a house
 * @type {number}
 */
export const TEAM_TRANSACTION_PURCHASE_HOUSE = 15;

/**
 * Rent paid to or received from another team
 * @type {number}
 */
export const TEAM_TRANSACTION_RENT = 20;


/**
 * The fee at start of the game
 * @type {number}
 */
export const TEAM_TRANSACTION_START_FEE = 30;


/**
 * The hourly fee every team receives (the fix one)
 * @type {number}
 */
export const TEAM_TRANSACTION_HOURLY_FEE = 35;

/**
 * Hourly rent received from the bank (value of all properties)
 * @type {number}
 */
export const TEAM_TRANSACTION_INTEREST = 38;


