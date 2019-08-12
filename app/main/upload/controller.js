'use strict';

const Boom = require('boom');
const S3Service = require('../../services/S3');
const randomFileName = require('../../utils/randomFileName');
const contentTypes = [
  'application/pdf',
  'image/jpeg',
  'image/png',
  'video/mp4',
  'audio/aac'
];
function requestUploadWrapper(folder) {
  return async (request) => {
    // Create new S3 instance to handle our request for a new upload URL.
    const key = `${folder}/${randomFileName(request.payload.name, false)}`;
    const uploadUrl = S3Service.getSignedUrl(key, request.payload.type);
    return uploadUrl;
  };
}

exports.uploadAvatar = requestUploadWrapper('service');
