import {{upperCaseFirstChart name}}Controller from './controller';
import { queryParams, idParam, checkToken, update{{upperCaseFirstChart name}}, create{{upperCaseFirstChart name}} } from './validator';

const controller = new {{upperCaseFirstChart name}}Controller();

export const getMany = {
  description: 'Get {{upperCaseFirstChart name}} list',
  notes: 'Return {{upperCaseFirstChart name}} items',
  tags: ['api', 'v1'],
  handler: controller.getMany.bind(controller),
<<<<<<< HEAD:templates/hapi-mongoose/main/model/handler.js
  auth: false,
=======
  auth: {
    strategy: 'jwt',
    // scope: ['admin', 'user']
  },
>>>>>>> upstream/master:templates/hapi-mongoose/main/model/handler.ejs
  validate: {
    headers: checkToken,
    query: queryParams
  }
};

export const count = {
  description: 'Count {{upperCaseFirstChart name}} list',
  notes: 'Return a count result of {{upperCaseFirstChart name}} items',
  tags: ['api', 'v1'],
  handler: controller.count.bind(controller),
<<<<<<< HEAD:templates/hapi-mongoose/main/model/handler.js
  auth: false,
=======
  auth: {
    strategy: 'jwt',
    // scope: ['admin', 'user']
  },
>>>>>>> upstream/master:templates/hapi-mongoose/main/model/handler.ejs
  validate: {
    headers: checkToken
  }
};

export const getOne = {
  description: 'Get a {{upperCaseFirstChart name}}',
  notes: 'Return a {{upperCaseFirstChart name}} by id',
  tags: ['api', 'v1'],
  handler: controller.getOne.bind(controller),
<<<<<<< HEAD:templates/hapi-mongoose/main/model/handler.js
  auth: false,
=======
  auth: 'jwt',
  auth: {
    strategy: 'jwt',
    // scope: ['admin']
  },
>>>>>>> upstream/master:templates/hapi-mongoose/main/model/handler.ejs
  validate: {
    headers: checkToken,
    params: {
      id: idParam
    }
  }
};

export const createOne = {
  description: 'Create a new {{upperCaseFirstChart name}}',
  notes: 'Return created {{upperCaseFirstChart name}}',
  tags: ['api', 'v1'],
  handler: controller.createOne.bind(controller),
<<<<<<< HEAD:templates/hapi-mongoose/main/model/handler.js
  auth: false,
  validate: {
    headers: validator.checkToken,
    payload: validator.create{{upperCaseFirstChart name}}
=======
  auth: {
    strategy: 'jwt',
    // scope: ['admin']
  },
  validate: {
    headers: checkToken,
    payload: create{{upperCaseFirstChart name}}
>>>>>>> upstream/master:templates/hapi-mongoose/main/model/handler.ejs
  }
};

export const updateOne = {
  description: 'Update {{upperCaseFirstChart name}}',
  notes: 'Return updated {{upperCaseFirstChart name}} by id',
  tags: ['api', 'v1'],
  handler: controller.updateOne.bind(controller),
<<<<<<< HEAD:templates/hapi-mongoose/main/model/handler.js
  auth: false,
=======
  auth: {
    strategy: 'jwt',
    // scope: ['admin']
  },
>>>>>>> upstream/master:templates/hapi-mongoose/main/model/handler.ejs
  validate: {
    headers: checkToken,
    params: {
      id: idParam
    },
<<<<<<< HEAD:templates/hapi-mongoose/main/model/handler.js
    payload: validator.update{{upperCaseFirstChart name}}
=======
    payload: update{{upperCaseFirstChart name}}
>>>>>>> upstream/master:templates/hapi-mongoose/main/model/handler.ejs
  }
};

export const deleteOne = {
  description: 'Delete a {{upperCaseFirstChart name}}',
  notes: 'Return deleted {{upperCaseFirstChart name}} by id',
  tags: ['api', 'v1'],
  handler: controller.deleteOne.bind(controller),
  auth: false,
  validate: {
    headers: checkToken,
    params: {
      id: idParam
    }
  }
};
