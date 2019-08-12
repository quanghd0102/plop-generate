const fs = require('fs');
const pluralize = require('pluralize');
const moment = require('moment');

const prompts = [
  {
    type: 'input',
    name: 'name',
    message: 'Model name: '
  },
  {
    type: 'recursive',
    name: 'props',
    message: 'do you want input model props?',
    prompts: [
      {
        type: 'input',
        name: 'propName',
        message: 'What is property Name?'
      },
      {
        type: 'list',
        name: 'type',
        message: 'Props Type: ',
        choices: [
          { name: 'Boolean', value: 'Boolean' },
          { name: 'Number', value: 'Number' },
          { name: 'Object', value: 'Object' },
          { name: 'Array', value: 'Array' },
          { name: 'String', value: 'String' },
          { name: 'Date', value: 'Date' }
        ]
      },
      {
        type: 'confirm',
        name: 'required',
        message: 'is Required?'
      }
    ]
  }
];

const SCHEMA = {
  boolean: 'boolean',
  number: 'integer',
  object: 'jsonb',
  array: 'jsonb',
  string: 'string',
  date: 'time'
};

exports.init = function(plop) {
  // controller generator
  plop.setHelper('upperCaseFirstChart', txt => upperCaseFirstChart(txt));
  plop.setHelper('upperCase', txt => txt.toUpperCase());
  plop.setPartial('myTitlePartial', '{{upperCase name}}');
  plop.setHelper('pluralize', txt => pluralizeStr(txt));
  plop.setPrompt('recursive', require('../promts/selectionExpand'));

  plop.setGenerator("generate add Quang's base model", {
    description: "Add new Quang's base (Hapi + Mongoose + MongoDB) model",
    prompts: prompts,
    actions: customAction
  });
};

function customAction(data) {
  const actions = [
    {
      type: 'addMany',
      skipIfExists: true,
      templateFiles: [__dirname + '/../templates/hapi-mongoose/main/model/*.js'],
      destination: 'app/main/{{name}}/',
      base: __dirname + '/../templates/hapi-mongoose/main/model'
    },
    {
      type: 'add',
      skipIfExists: true,
      path: 'app/db/models/{{upperCaseFirstChart name}}.js',
      templateFile: __dirname + '/../templates/hapi-mongoose/db/models/index.js'
    },
    {
      type: 'add',
      skipIfExists: true,
      path: 'app/db/models/index.js',
      templateFile: __dirname + '/../templates/hapi-mongoose/db/models/index.js'
    },
    {
      type: 'append',
      path: 'app/db/models/index.js',
      pattern: '// import models',
      template: "\nconst {{upperCaseFirstChart name}} = require('./{{upperCaseFirstChart name}}');"
    },
    {
      type: 'append',
      path: 'app/db/models/index.js',
      pattern: 'module.exports = {',
      template: '{{upperCaseFirstChart name}},'
    }
  ];

  data.props.forEach((element, index) => {
    //add validator
    actions.push({
      type: 'append',
      path: 'app/main/{{name}}/validator.js',
      pattern:
        index === 0
          ? 'exports.create' + upperCaseFirstChart(data.name) + ' = {'
          : generateValidator(data.props[index - 1]),
      template: generateValidator(element)
    });
    //add schema
    actions.push({
      type: 'append',
      path: 'app/db/models/{{upperCaseFirstChart name}}.js',
      pattern: index === 0 ? '//replace model structure' : generateModel(data.props[index - 1]),
      template: generateModel(element)
    });
  });

  return actions;
}

function generateModel(element) {
  return `  ${element.propName}: {
    type: ${element.type},
    required: ${element.required ? 'true' : 'false'}
  },`;
}

function generateValidator(element) {
  return (
    '  ' + element.propName + ':' + ' Joi.' + getTypeStr(element) + getRequiredStr(element) + ','
  );
}

function getTypeStr(element) {
  const childs = element.childs
    ? element.childs
        .map(data => {
          return '  ' + data.propName + ':' + ' Joi.' + data.type + '()' + getRequiredStr(data);
        })
        .join(',\n')
    : '';
  return `${element.type}${element.type === 'object' ? '({\n' + childs + '\n})' : '()'}`;
}

function getRequiredStr(element) {
  return element.required ? '.required()' : '';
}

function upperCaseFirstChart(txt) {
  return txt.substring(0, 1).toUpperCase() + txt.substring(1);
}

function pluralizeStr(txt) {
  const str = pluralize(txt);
  return str.substring(0, 1).toLocaleLowerCase() + str.substring(1);
}
