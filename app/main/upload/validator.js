'use strict';
const Joi = require('@hapi/joi');
const {} = require('../../utils/validatorUtils');

const fileTypes = {
  name: Joi.string().required(),
  type: Joi.string().required()
};

module.exports = {
  fileTypes
};
