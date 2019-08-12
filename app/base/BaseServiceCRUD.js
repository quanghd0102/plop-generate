'use strict';
const Boom = require('boom');

class BaseServiceCRUD {
  constructor(model, modelName) {
    this.model = model;
    this.modelName = modelName;
  }

  async getMany(query) {
    return this.model.queryBuilder(query);
  }

  async getMe(query, userid) {
    query.filter.user = userid;
    return this.model.queryBuilder(query);
  }

  async count() {
    return await this.model
      .query()
      .count('id as count')
      .first();
  }

  async getOne(id) {
    const result = await this.model.findById(id);
    if (!result) {
      throw Boom.notFound(`${this.modelName} not found`);
    }
    return result;
  }

  async createOne(payload) {
    return this.model.create(payload);
  }

  async updateOne(id, payload) {
    const result = await this.model.findByIdAndUpdate(id, payload, {
      new: true
    });
    if (!result) {
      throw Boom.notFound(`${this.modelName} not found`);
    }
    return result;
  }

  async deleteOne(id) {
    await this.model.findByIdAndRemove(id);
    return { success: true };
  }
}

module.exports = BaseServiceCRUD;
