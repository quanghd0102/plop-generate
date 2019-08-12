'use strict';

const controller = require('./controller');
const validator = require('./validator');

exports.uploadAvatar = {
  description: 'Api to request s3 signed url to upload avatar',
  notes: 'Api to request s3 signed url to upload avatar',
  tags: ['api', 'v1'],
  auth: false,
  handler: controller.uploadAvatar,
  validate: {
    payload: validator.fileTypes
  }
};
