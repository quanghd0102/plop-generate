'use strict';
const S3 = require('aws-sdk/clients/s3');

class S3Adapter {
  constructor() {
    this.accessKeyId = process.env.AWS_ACCESS_KEY_ID || 'AKIAJZ2LG5UTJBCYSQGQ';
    this.bucketPrefix = process.env.AWS_BUCKET_PREFIX || '';
    this.secretAccessKey =
      process.env.AWS_SECRET_ACCESS_KEY ||
      'joG29/g4yuL5UKdoKYFup/ocGdJqug4LW7MPR6xq';
    this.bucket = process.env.S3_BUCKET || 'csm-dev-files';

    this.s3 = new S3({
      accessKeyId: this.accessKeyId,
      secretAccessKey: this.secretAccessKey
    });
    this.baseUrl = process.env.PUBLIC_LINK_S3;
  }

  async uploadFile(request) {
    request.Bucket = this.bucket;
    request.Key = this.bucketPrefix + request.Key;
    const res = await this.s3.upload(request).promise();
    return res;
  }

  async deleleFile(key) {
    return await this.s3
      .deleteObject({
        Bucket: this.bucket,
        Key: key
      })
      .promise();
  }

  getFileLocation(key) {
    if (this.baseUrl) {
      return `${this.baseUrl}/${key}`;
    } else if (this.bucket) {
      return `https://${this.bucket}.s3.amazonaws.com/${key}`;
    }
  }

  convertLinkToKey(link) {
    return link.replace(
      `https://${this.bucket}.s3.amazonaws.com/${this.bucketPrefix}`,
      ''
    );
  }

  getSignedUrl(key, type) {
    const s3Params = {
      Bucket: this.bucket,
      Key: this.bucketPrefix + key,
      ACL: 'public-read',
      ContentType: type
    };

    // Ask S3 for a temporary URL that the client can use.
    const uploadUrl = this.s3.getSignedUrl('putObject', s3Params);
    return {
      uploadUrl,
      fileKey: this.bucketPrefix + key,
      url: this.getFileLocation(key)
    };
  }
}

module.exports = new S3Adapter();
