'use strict';

const Joi = require('@hapi/joi');
const CONST = require('../constants');

function strSlug() {
  return Joi.string()
    .min(3)
    .regex(/^[A-Z]+(?:-[A-Z0-9]+)*$/);
}

function strAddressSlug() {
  return Joi.string()
    .regex(/^[a-z1-9]+(?:-[a-z0-9]+)*$/)
    .min(1);
}

function strAddressCode() {
  return Joi.string().min(1);
}

function strAddressType() {
  return Joi.string()
    .min(3)
    .regex(/^[A-Z_]*$/);
}

function strHexColor() {
  return Joi.string().regex(/^#[A-Fa-f0-9]{6}/);
}

function strIconName() {
  return Joi.string().regex(/^[a-z1-9]+(?:-[a-z0-9]+)*$/);
}

function strEmail() {
  return Joi.string().email();
}

function strPhoneNumber() {
  return Joi.string().regex(/^\+{0,1}[0-9]{10,15}$/);
}

function strUsername() {
  return Joi.string()
    .min(3)
    .max(100)
    .alphanum();
}

function strPassword() {
  return Joi.string()
    .min(6)
    .max(35);
}

function strGender() {
  return Joi.string().valid(CONST.GENDER);
}

function strLanguage() {
  return Joi.string().valid(CONST.LANGUAGE);
}

function objectIcon() {
  return Joi.object({
    size: Joi.number()
      .integer()
      .min(8)
      .required(),
    name: strIconName(),
    backgroundColor: strHexColor().required()
  });
}

function objectLocalization() {
  return Joi.object({
    en: Joi.string().required(),
    vi: Joi.string().required()
  });
}

function strCaseStatusSlug() {
  return Joi.string().valid(CONST.CASE_STATUS);
}

function strUpdateCaseStatusSlug() {
  return Joi.string().valid(CONST.UPDATE_CASE_STATUS);
}

function strBloodType() {
  return Joi.string().valid(CONST.BLOOD_TYPE);
}

function ratingValue() {
  return Joi.number()
    .integer()
    .min(1)
    .max(5);
}

function idNumber() {
  return Joi.number()
    .integer()
    .min(0);
}

function idUuid() {
  return Joi.string().guid({
    version: ['uuidv4']
  });
}

const queryParams = {
  limit: Joi.number()
    .min(1)
    .max(100)
    .default(10),
  offset: Joi.number().default(0),
  orderBy: Joi.string(),
  filter: Joi.object().default({}),
  fields: Joi.array()
};

const searchParams = {
  limit: Joi.number()
    .min(1)
    .max(100)
    .default(10),
  offset: Joi.number().default(0),
  orderBy: Joi.string(),
  filter: Joi.object(),
  fields: Joi.array(),
  q: Joi.string()
};

const idParam = Joi.string()
  .guid({
    version: ['uuidv4']
  })
  .required()
  .description('id is required');

const headerParam = Joi.object({
  Authorization: Joi.string(),
  tenantslug: Joi.string()
}).options({ allowUnknown: true });

module.exports = {
  strSlug,
  strAddressSlug,
  strAddressCode,
  strAddressType,
  strHexColor,
  strIconName,
  strPhoneNumber,
  strUsername,
  strPassword,
  strGender,
  strLanguage,
  strEmail,
  strCaseStatusSlug,
  objectIcon,
  objectLocalization,
  ratingValue,
  idNumber,
  strUpdateCaseStatusSlug,
  strBloodType,
  queryParams,
  searchParams,
  idParam,
  idUuid,
  headerParam
};
