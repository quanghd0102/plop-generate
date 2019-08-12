@@ -1,18 +0,0 @@
"use strict";
let mongoose = require('mongoose');
let Schema = mongoose.Schema;
let constant = require('../../helpers/lib/constant');
let mongoosePaginate = require('mongoose-paginate');

let {{upperCaseFirstChart name}}Schema = new Schema({
  //replace model structure
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
});

{{upperCaseFirstChart name}}Schema.plugin(mongoosePaginate);

module.exports = mongoose.model('{{upperCaseFirstChart name}}', {{upperCaseFirstChart name}}Schema);