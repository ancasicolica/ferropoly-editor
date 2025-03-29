/**
 * Class for a participating team (a player)
 * Christian Kuster, CH-8342 Wernetshausen, christian@kusti.ch
 * Created: 22.03.2025
 **/
import {DateTime} from 'luxon';
import {get, isString} from 'lodash';

function makeSureItsJsDate(date) {
  if (date instanceof DateTime) {
    return date.toJSDate();
  }
  if (isString(date)) {
    return DateTime.fromISO(date).toJSDate();
  }
  if (date instanceof Date) {
    return date;
  }
  console.warn('Unknown date format', date, typeof date);
  return null;
}

class Team {
  constructor(_team) {
    let team    = _team || {};
    this.uuid   = get(team, 'uuid', null);
    this.gameId = get(team, 'gameId', 'invalid');
    this.data   = {
      name:               get(team, 'data.name', ''),
      organization:       get(team, 'data.organization', ''),
      teamLeader:         {
        name:  get(team, 'data.teamLeader.name', ''),
        email: get(team, 'data.teamLeader.email', ''),
        phone: get(team, 'data.teamLeader.phone', ''),
      },
      remarks:            get(team, 'data.remarks', ''),
      confirmed:          get(team, 'data.confirmed', true),
      onlineRegistration: get(team, 'data.onlineRegistration', false),
      registrationDate:   makeSureItsJsDate(get(team, 'data.registrationDate', DateTime.now())),
      changedDate:        makeSureItsJsDate(get(team, 'data.changedDate', DateTime.now())),
      confirmationDate:   makeSureItsJsDate(get(team, 'data.confirmationDate', DateTime.now())),
      members:            get(team, 'data.members', []),
    }
    this.createAcronym();
  }


  createAcronym() {

    this.label = this.data.name
      .split(/[\s-]+/) // Split the string into words
      .map(word => word.charAt(0).toUpperCase()) // Take the first letter of each word and convert it to uppercase
      .join('') // Join them back into a string
      .slice(0, 3); // Limit the acronym to 3 characters

  }
}

export default Team
