'use strict';

const Boom = require('@hapi/boom');
const bcrypt = require('bcrypt');
const _ = require('lodash');
const crypto = require('crypto');
const Models = require('../../db/models');
const jwt = require('../../services/jwt');
const PasswordUtils = require('../../services/password');
const MailUtils = require('../../emailService');
const { passportFaceBook } = require('./authSocial');

const mainWebUrl =
  process.env.WEB_URL || 'https://childcare-web-staging.enouvo.com/';

class AuthService {
  async login(body) {
    try {
      const { email, username } = body;
      let user = null;
      if (email) {
        user = await Models.User.findOne({
          email
        }).select('+password');
      }
      if (username) {
        user = await Models.User.findOne({
          username
        }).select('+password');
      }
      if (!user) {
        throw Boom.notFound('This account is not exist');
      }
      const isCorrectPassword = await PasswordUtils.compare(
        body.password,
        user.password
      );
      if (!isCorrectPassword) {
        throw Boom.unauthorized('Incorrect email or password');
      }
      user.scope = user.role;
      const data = _.pick(user, ['email', 'username', '_id', 'scope']);
      data.id = data._id;
      return await _.assign(
        {
          token: jwt.issue(data)
        },
        data
      );
    } catch (err) {
      throw err;
    }
  }

  async register(payload) {
    try {
      const { email, username } = payload;
      const checkUserByEmail = await Models.User.findOne({
        email
      });
      if (checkUserByEmail) {
        throw Boom.badRequest('Email is exist');
      }
      const checkUserByUsername = await Models.User.findOne({
        username
      });
      if (checkUserByUsername) {
        throw Boom.badRequest('Username is exist');
      }
      // Check use payload have password or random create a new one
      const hashPassword = await PasswordUtils.hash(payload.password);

      payload.password = hashPassword;

      let data = await Models.User.create(payload);
      data.scope = 'user';
      data = _.pick(data, ['email', 'username', '_id', 'scope']);
      data.id = data._id;
      delete data._id;
      return _.assign(
        {
          token: jwt.issue(data)
        },
        data
      );
    } catch (err) {
      throw err;
    }
  }

  async loginFacebook(request) {
    try {
      const profile = await passportFaceBook(request);
      console.log(profile);
      if (!profile.id) {
        return Boom.badRequest(
          'This access token is not registered by the application'
        );
      }
      const existUser = await Models.User.findOne({
        facebookId: profile.id
      });
      if (existUser) {
        existUser.scope = existUser.role;

        const data = _.pick(existUser, ['username', 'email', 'id', 'scope']);
        return await _.assign(
          {
            token: jwt.issue(data)
          },
          data
        );
      }

      const body = {
        avatar: profile.photos[0].value,
        username: profile.id,
        email: profile.emails[0] && profile.emails[0].value,
        facebookId: profile.id,
        password: 'Lub1App@',
        role: 'user'
      };
      return await this.register(body);
    } catch (err) {
      throw err;
    }
  }

  async forgotPassword(email) {
    const user = await Models.User.query().findOne({
      email
    });
    if (!user) {
      throw Boom.notFound('Email is not found');
    }
    // Generate random token.
    const resetPasswordToken = crypto.randomBytes(64).toString('hex');
    MailUtils.sendEmailResetPassword(
      user.email,
      `${mainWebUrl}reset-password?token=${resetPasswordToken}`
    );
    const resetPasswordExpire = new Date();
    resetPasswordExpire.setDate(resetPasswordExpire.getDate() + 1);
    await Models.User.query().patchAndFetchById(user.id, {
      resetPasswordToken,
      resetPasswordExpire: resetPasswordExpire.toISOString() // Token will expire in 24 hours
    });
    return {
      message: 'Your reset password request has been confirmed'
    };
  }

  async resetPassword(token, password) {
    const user = await Models.User.query()
      .where('resetPasswordToken', token)
      .where('resetPasswordExpire', '>', new Date().toISOString())
      .first();
    if (!user) {
      throw Boom.conflict('Your password token is incorrect ore expired');
    }
    const newHashPassword = await bcrypt.hash(password, 5);
    await Models.User.query().patchAndFetchById(user.id, {
      resetPasswordToken: null,
      resetPasswordExpire: null,
      password: newHashPassword
    });
    return {
      message: 'Your password has been reset'
    };
  }

  async changePassword(id, payload) {
    try {
      const user = await Models.User.query().findById(id);

      const isCorrectPassword = await PasswordUtils.compare(
        payload.currentPassword,
        user.password
      );
      if (!isCorrectPassword) {
        throw Boom.badRequest('Incorrect password');
      }

      const hashPassword = await PasswordUtils.hash(payload.password);
      await user.$query().update({ password: hashPassword });
      return { success: true, message: 'Password changed successfully' };
    } catch (err) {
      throw err;
    }
  }
}

module.exports = AuthService;
