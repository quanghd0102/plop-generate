'use strict';

const Boom = require('@hapi/boom');

const hasRole = function ({
  systemRoles,
  tenantRoles,
  isCheckTenantSlugHeader = true
}) {
  const hasSchoolRole = async (request, h) => {
    const { auth } = request;
    const { tenantRole, hostRole, userType, tenantSlug } = auth.credentials;
    //Allow admin and superadmin of system access all resources
    if (isCheckTenantSlugHeader) {
      // Check header tenant slug exist or not. And throw error
      if (!request.headers.tenantslug) {
        throw Boom.badRequest('TenantSlug header is required');
      }
    }
    if (hostRole === 'admin' || hostRole === 'superadmin') {
      return h.continue;
    }
    if ((!tenantRoles || tenantRoles.length === 0) && hostRole === 'user') {
      return h.continue;
    }
    if (userType === 'tenant' && tenantRoles.indexOf(tenantRole) > -1) {
      if (tenantSlug !== request.headers.tenantslug) {
        throw Boom.badRequest('TenantSlug header not matching with session');
      }
      return h.continue;
    }
    throw Boom.forbidden('Permission denied');
  };
  return hasSchoolRole;
};

module.exports = hasRole;
