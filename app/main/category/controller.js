'use strict';

const BaseControllerCRUD = require('../../base/BaseControllerCRUD');
const CategoryService = require('./service');

class CategoryController extends BaseControllerCRUD {
  constructor() {
    super(new CategoryService());
  }
}

module.exports = CategoryController;
