/**
 * Validates Player data
 * Christian Kuster, CH-8342 Wernetshausen, christian@kusti.ch
 * Created: 16.05.21
 **/

import {get} from 'lodash';

function checkNames(name) {
  name  = name || '';
  let l = name.length;
  return ((l > 3) && (l < 60));
}

function checkPhone(phone) {
  phone = phone || '';
  let l = phone.length;
  return ((l > 10) && (l < 15));
}

function checkEmail(mail) {
  mail           = mail || '';
  let regexEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  return (mail.match(regexEmail) !== null);
}

function checkPlayer(player, emailMandatory = false) {
  let retVal = checkNames(get(player, 'data.name', ''));
  retVal &= checkNames(get(player, 'data.organization', ''));
  retVal &= checkNames(get(player, 'data.teamLeader.name', ''));
  retVal &= checkPhone(get(player, 'data.teamLeader.phone', ''));
  retVal &= (!emailMandatory || (emailMandatory && checkEmail(get(player, 'data.teamLeader.email', ''))));

  return retVal;
}

export {checkNames, checkPhone, checkEmail, checkPlayer};
