// import moment from 'moment';
import { verifyPhoneNumber } from 'nigerian-phone-number-validator';
import { AuthValidation } from '../validation';
import { Toolbox } from '../utils';
import { GeneralService } from '../services';
import database from '../models';

const {
  errorResponse,
  checkToken,
  verifyToken
} = Toolbox;
const {
  validateEmail,
  validateName,
  validatePassword,
  validateToken,
  validateNickName
} = AuthValidation;
const {
  findByKey
} = GeneralService;
const {
  User,
  Verification
} = database;

const AuthMiddleware = {
  /**
   * middleware for user phone number
   * @async
   * @param {object} req - the api request
   * @param {object} res - api response returned by method
   * @param {object} next - returned values going into next function
   * @returns {object} - returns error or response object
   * @memberof AuthMiddleware
   */
  async verifyUser(req, res, next) {
    try {
      const { phoneNumber } = req.body;
      if (!verifyPhoneNumber(phoneNumber)) return errorResponse(res, { code: 400, message: 'Phone Number is Invalid' });
      const user = await findByKey(User, { phoneNumber });
      if (user) return errorResponse(res, { code: 409, message: 'This Number belongs to another user.' });
      next();
    } catch (error) {
      errorResponse(res, { code: 400, message: error });
    }
  },

  /**
   * middleware for user verification
   * @async
   * @param {object} req - the api request
   * @param {object} res - api response returned by method
   * @param {object} next - returned values going into next function
   * @returns {object} - returns error or response object
   * @memberof AuthMiddleware
   */
  async verifyNumber(req, res, next) {
    try {
      if (req.body.phoneNumber) {
        const { phoneNumber } = req.body;
        if (!verifyPhoneNumber(phoneNumber)) return errorResponse(res, { code: 400, message: 'Phone Number is Invalid' });
        const verification = await findByKey(Verification, { phoneNumber });
        if (!verification) return errorResponse(res, { code: 409, message: 'This Number Does not Exist' });
        req.verification = verification;
      }
      next();
    } catch (error) {
      errorResponse(res, { code: 400, message: error });
    }
  },

  /**
   * middleware token validation
   * @async
   * @param {object} req - the api request
   * @param {object} res - api response returned by method
   * @param {object} next - returned values going into next function
   * @returns {object} - returns error or response object
   * @memberof AuthMiddleware
   */
  async validateTokenValue(req, res, next) {
    try {
      validateToken({ token: req.body.token });
      next();
    } catch (error) {
      errorResponse(res, { code: 400, message: error });
    }
  },

  /**
   * middleware for user signup
   * @async
   * @param {object} req - the api request
   * @param {object} res - api response returned by method
   * @param {object} next - returned values going into next function
   * @returns {object} - returns error or response object
   * @memberof AuthMiddleware
   */
  async verifySignup(req, res, next) {
    try {
      const {
        name, email, password, phoneNumber
      } = req.body;
      validateName({ name });
      validateEmail({ email });
      validatePassword({ password });
      if (!verifyPhoneNumber(phoneNumber)) return errorResponse(res, { code: 400, message: 'Phone Number is Invalid' });
      const verification = await findByKey(Verification, { phoneNumber });
      if (!verification) return errorResponse(res, { code: 409, message: 'User is not verified!' });
      if (!verification.verified) return errorResponse(res, { code: 409, message: 'User is Not Yet verified!' });
      req.verification = verification;
      next();
    } catch (error) {
      errorResponse(res, { code: 400, message: error });
    }
  },

  /**
   * middleware for user login
   * @async
   * @param {object} req - the api request
   * @param {object} res - api response returned by method
   * @param {object} next - returned values going into next function
   * @returns {object} - returns error or response object
   * @memberof AuthMiddleware
   */
  async verifyLogin(req, res, next) {
    try {
      const { password, phoneNumber } = req.body;
      validatePassword({ password });
      if (!verifyPhoneNumber(phoneNumber)) return errorResponse(res, { code: 400, message: 'Phone Number is Invalid' });
      const user = await findByKey(User, { phoneNumber });
      if (!user) return errorResponse(res, { code: 409, message: 'Incorrect Phone Number or Password' });
      req.user = user;
      next();
    } catch (error) {
      errorResponse(res, { code: 400, message: error });
    }
  },

  /**
   * user authentication
   * @param {object} req
   * @param {object} res
   * @param {object} next
   * @returns {object} - returns error or response object
   * @memberof AuthMiddleware
   */
  async authenticate(req, res, next) {
    try {
      const token = checkToken(req);
      if (!token) return errorResponse(res, { code: 401, message: 'Access denied, Token required' });
      req.tokenData = verifyToken(token);
      next();
    } catch (error) {
      if (error.message === 'Invalid Token') {
        return errorResponse(res, { code: 400, message: 'The token provided was invalid' });
      }
    }
  },

  /**
   * middleware for user update profile
   * @async
   * @param {object} req - the api request
   * @param {object} res - api response returned by method
   * @param {object} next - returned values going into next function
   * @returns {object} - returns error or response object
   * @memberof AuthMiddleware
   */
  async verifyProfile(req, res, next) {
    try {
      const {
        name, email, oldPassword, nickname, newPassword
      } = req.body;
      if (name) validateName({ name });
      if (email) validateEmail({ email });
      if (oldPassword) validatePassword({ password: oldPassword });
      if (newPassword) validatePassword({ password: newPassword });
      if (nickname) validateNickName({ nickname });
      next();
    } catch (error) {
      errorResponse(res, { code: 400, message: error });
    }
  },

  /**
   * verify password resets
   * @param {object} req
   * @param {object} res
   * @param {object} next
   * @returns {object} - returns error or response object
   * @memberof AuthMiddleware
   */
  async verifyPasswordReset(req, res, next) {
    try {
      const { newPassword, confirmPassword } = req.body;
      validatePassword({ password: newPassword });
      validatePassword({ password: confirmPassword });
      if (newPassword !== confirmPassword) return errorResponse(res, { code: 409, message: 'Passwords does not match' });
      next();
    } catch (error) {
      errorResponse(res, {});
    }
  },
};

export default AuthMiddleware;
