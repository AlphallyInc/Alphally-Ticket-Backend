/* eslint-disable linebreak-style */
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import joi from '@hapi/joi';
import env from '../config/env';
import ApiError from './apiError';

const { SECRET } = env;

/**
 * Class for api tools methods
 *
 * @class Toolbox
 */
export default class Toolbox {
  /**
   * Synchronously sign the given payload into a JSON Web Token string.
   * @static
   * @param {string | number | Buffer | object} payload Payload to sign.
   * @param {string | number} expiresIn Expressed in seconds or a string describing a
   * time span. Eg: 60, "2 days", "10h", "7d". Default specified is 1day.
   * @memberof Toolbox
   * @returns {string} JWT token.
   */
  static createToken(payload, expiresIn = '1d') {
    return jwt.sign(payload, SECRET, { expiresIn });
  }

  /**
   * Synchronously sign the given payload into a JSON Web Token string that never expires.
   * @static
   * @param {string | number | Buffer | object} payload Payload to sign.
   * @memberof Toolbox
   * @returns {string} JWT token.
   */
  static createEternalToken(payload) {
    return jwt.sign(payload, SECRET);
  }

  /**
   *
   *  Synchronously verify the given JWT token using a secret
   * @static
   * @param {*} token - JWT token.
   * @returns {string | number | Buffer | object } - Decoded JWT payload if
   * token is valid or an error message if otherwise.
   * @memberof Toolbox
   */
  static verifyToken(token) {
    try {
      return jwt.verify(token, SECRET);
    } catch (err) {
      throw new ApiError(400, 'Invalid Token');
    }
  }

  /**
   * Hashes a password
   * @static
   * @param {string} password - Password to encrypt.
   * @memberof Toolbox
   * @returns {string} - Encrypted password.
   */
  static hashPassword(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10));
  }

  /**
   * Compares a password with a given hash
   * @static
   * @param {string} password - Plain text password.
   * @param {string} hash - Encrypted password.
   * @memberof Toolbox
   * @returns {boolean} - returns true if there is a match and false otherwise.
   */
  static comparePassword(password, hash) {
    return bcrypt.compareSync(password, hash);
  }

  /**
   * Generates a JSON response for success scenarios.
   * @static
   * @param {Response} res - Response object.
   * @param {object} data - The payload.
   * @param {number} code -  HTTP Status code.
   * @memberof Toolbox
   * @returns {JSON} - A JSON success response.
   */
  static successResponse(res, data, code = 200) {
    return res.status(code).json({
      status: 'success',
      data
    });
  }

  /**
   * Generates a JSON response for failure scenarios.
   * @static
   * @param {Response} res - Response object.
   * @param {object} options - The payload.
   * @param {number} options.code -  HTTP Status code, default is 500.
   * @param {string} options.message -  Error message.
   * @param {object|array  } options.errors -  A collection of  error message.
   * @memberof Toolbox
   * @returns {JSON} - A JSON failure response.
   */
  static errorResponse(res, { code = 500, message = 'Some error occurred while processing your Request', errors }) {
    return res.status(code).json({
      status: 'fail',
      error: {
        message,
        errors
      }
    });
  }

  /**
   * Validates a value using the given Joi schema
   * @param {object} value
   * @param {Joi.SchemaLike} schema
   * @returns {Promise} Validation result
   */
  static validate(value, schema) {
    return joi.validate(value, schema, { abortEarly: false, allowUnknown: true });
  }

  /**
   * Checks token from request header for user authentication
   * @param {object} req - The request from the endpoint
   * @memberof Toolbox
   * @returns {Token} Token
   */
  static checkToken(req) {
    const {
      headers: { authorization },
      cookies: { token: cookieToken }
    } = req;
    let bearerToken = null;
    if (authorization) {
      bearerToken = authorization.split(' ')[1]
        ? authorization.split(' ')[1] : authorization;
    }
    return cookieToken || bearerToken || req.headers['x-access-token'] || req.headers.token || req.body.token;
  }

  /**
   * generates OTP Token
   * @static
   * @returns {string} reference - A unique Seven (7) digit number
   * @memberof Toolbox
   */
  static generateOTP() {
    const randomNumber = Math.floor(Math.random() * 89 + 99);
    const anotherRandomNumber = Math.floor(Math.random() * 79 + 10);
    const reference = `${randomNumber}${anotherRandomNumber}`;
    return reference;
  }

  /**
   * generates a referral code for a user
   * @static
   * @param {string} name - name of the user
   * @returns {string} reference - A unique referral code
   * @memberof Toolbox
   */
  static generateReffalCode(name) {
    const randomNumber = Math.floor(Math.random() * 89 + 99);
    const anotherRandomNumber = Math.floor(Math.random() * 79 + 10);
    const reference = `ref_${name}${randomNumber}${anotherRandomNumber}`;
    return reference;
  }
}
