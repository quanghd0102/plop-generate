'use strict';

const Joi = require('@hapi/joi');
const {
  idNumber,
  queryParams,
  objectGeoLocation,
  checkToken,
  searchParams
} = require('../../utils/validatorUtils');

exports.queryParams = queryParams;

exports.searchParams = searchParams;

exports.checkToken = checkToken;

exports.idParam = Joi.string()
  .required()
  .description('id is required');

exports.createCategory = {
  title: Joi.string().required()
};

exports.updateCategory = {
  title: Joi.string(),
  isActive: Joi.boolean()
};

exports.activate = Joi.boolean().required();
