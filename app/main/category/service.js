'use strict';

const Models = require('../../db/models');
const BaseServiceCRUD = require('../../base/BaseServiceCRUD');

class CategoryService extends BaseServiceCRUD {
  constructor() {
    super(Models.Category, 'Category');
  }
}

module.exports = CategoryService;
