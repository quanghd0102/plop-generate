'use strict';

const mongoose = require('../connection');
const Schema = mongoose.Schema;

const schema = new Schema(
  {
    //replace model structure
    title: {
      type: String,
      required: true
    },
    isActive: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);

const Category = mongoose.model('Category', schema);

module.exports = Category;
