const fs = require('fs');
const pluralize = require('pluralize');
const moment = require('moment');

const generateRedux = require('./plopfile/generateRedux');
const generateHapiMongoose = require('./plopfile/generate-hapi-mongoose');

function upperCaseFirstChart(txt) {
  return txt.substring(0, 1).toUpperCase() + txt.substring(1);
}

function pluralizeStr(txt) {
  const str = pluralize(txt);
  return str.substring(0, 1).toLocaleLowerCase() + str.substring(1);
}

function pluralizeStr(txt) {
  const str = pluralize(txt);
  return str.substring(0, 1).toLocaleLowerCase() + str.substring(1);
}

function makeSnakeCase(text) {
  var result = text.replace(/([A-Z])/g, "_$1");  
  var finalResult = result.toLowerCase();  
  return finalResult;
}

module.exports = function(plop, config = {}) {
  // controller generator
  plop.setHelper('snakeCase', txt => makeSnakeCase(txt));
  plop.setHelper('upperCaseFirstChart', txt => upperCaseFirstChart(txt));
  plop.setHelper('upperCase', txt => txt.toUpperCase());
  plop.setPartial('myTitlePartial', '{{upperCase name}}');
  plop.setHelper('pluralize', txt => pluralize(txt));
  plop.setPrompt('recursive', require('inquirer-recursive'));

  generateHapiMongoose.init(plop, config);
  plop.setGenerator('generate redux', generateRedux);
};
