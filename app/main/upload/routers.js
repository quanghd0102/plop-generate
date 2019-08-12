'use strict';

const handler = require('./handler');

const Routes = [
  {
    method: 'POST',
    path: '/api/v1/upload/requestS3',
    config: handler.uploadAvatar
  }
];

module.exports = Routes;
