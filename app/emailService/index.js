'use strict';

const Email = require('email-templates');
const nodemailer = require('nodemailer');
const mailgunTransport = require('nodemailer-mailgun-transport');

const mailgunOptions = {
  auth: {
    api_key:
      process.env.EMAIL_API_KEY || 'key-eeac6a89becd0c257ede043e421760ea',
    domain: process.env.EMAIL_DOMAIN || 'dev-email.enouvo.com'
  }
};
const emailFrom = process.env.EMAIL_FROM || 'enouvospace@gmail.com';
const transport = mailgunTransport(mailgunOptions);
const emailClient = nodemailer.createTransport(transport);
const email = new Email({
  message: {
    from: emailFrom
  },
  send: true,
  transport: emailClient
});

async function sendEmailResetPassword(receiverEmail, resetPasswordUrl) {
  try {
    const mailOptions = {
      from: '"ChildCare" <info@enouvo.com>', // sender address
      to: receiverEmail, // list of receivers
      subject: 'Reset password request', // Subject line
      html: `<p>Click this link to reset your password <a href=${resetPasswordUrl} target="_blank">Click here</a></p>` // html body
    };

    const result = await emailClient.sendMail(mailOptions);
  } catch (err) {
    throw err;
  }
}

async function sendInvitationEmail(receiverEmail, inviteUrl) {
  try {
    const mailOptions = {
      from: '"ChildCare" <info@enouvo.com>', // sender address
      to: receiverEmail, // list of receivers
      subject: 'Invite member to ChildCare', // Subject line
      html: `<p>Click this link to join us <a href=${inviteUrl} target="_blank">Click here</a></p>` // html body
    };

    const result = await emailClient.sendMail(mailOptions);
    return result;
  } catch (err) {
    throw err;
  }
}

async function sendCustomEmail(receiverEmail, subject, content) {
  try {
    const mailOptions = {
      from: '"ChildCare" <info@enouvo.com>', // sender address
      to: receiverEmail, // list of receivers
      subject, // Subject line
      html: content
    };
    const result = await emailClient.sendMail(mailOptions);
    return result;
  } catch (err) {
    throw err;
  }
}

async function sendInfoNewAccount(receiverEmail, info) {
  try {
    const mailOptions = {
      from: '"ChildCare" <info@enouvo.com>', // sender address
      to: receiverEmail, // list of receivers
      subject: 'Your account has been successfully created', // Subject line
      html: `<p>Your new account is all set to go! You can access it using the following credentials:</p><p>Full Name: ${
        info.fullName
      }<br />Email: ${info.email}<br />Password: ${info.password}</p>`
    };
    const result = await emailClient.sendMail(mailOptions);
    return result;
  } catch (err) {
    throw err;
  }
}

module.exports.sendEmailResetPassword = sendEmailResetPassword;
module.exports.sendInvitationEmail = sendInvitationEmail;
module.exports.sendCustomEmail = sendCustomEmail;
module.exports.sendInfoNewAccount = sendInfoNewAccount;
