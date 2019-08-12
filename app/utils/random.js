'use strict';

const crypto = require('crypto');

function randomPassword(length) {
  console.log(length);
  let result = '';
  const characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    console.log('aa');
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

function randomToken() {
  return crypto.randomBytes(64).toString('hex');
}

module.exports = {
  randomPassword,
  randomToken
};
