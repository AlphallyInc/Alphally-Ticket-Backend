/* eslint-disable no-useless-escape */
import joi from '@hapi/joi';

const AuthValidation = {
  /**
   * validate user parameters during signup
   * @function
   * @param {object} payload - user object
   * @returns {object | boolean} - returns a boolean or an error object
   * @memberof AuthValidation
   */
  validatePhoneNumber(payload) {
    const schema = {
      phoneNumber: joi.string().min(11).required().label('Please input a valid phone number'),
    };
    const { error } = joi.validate({ ...payload }, schema);
    if (error) throw error.details[0].context.label;
    return true;
  },

  /**
   * validate user token parameters during signup
   * @function
   * @param {object} payload - user object
   * @returns {object | boolean} - returns a boolean or an error object
   * @memberof AuthValidation
   */
  validateToken(payload) {
    const schema = {
      token: joi.string().min(7).required()
        .label('Please input a valid token number'),
    };
    const { error } = joi.validate({ ...payload }, schema);
    if (error) throw error.details[0].context.label;
    return true;
  },

  /**
   * validate email
   * @function
   * @param {object} payload - user object
   * @returns {object | boolean} - returns a boolean or an error object
   * @memberof AuthValidation
   */
  validateEmail(payload) {
    const schema = {
      email: joi.string().email().required()
        .label('Please enter a valid email address'),
    };
    const { error } = joi.validate({ ...payload }, schema);
    if (error) throw error.details[0].context.label;
    return true;
  },

  /**
   * validate name
   * @function
   * @param {object} payload - user object
   * @returns {object | boolean} - returns a boolean or an error object
   * @memberof AuthValidation
   */
  validateName(payload) {
    const schema = {
      name: joi.string().required().label('Please add a valid name')
    };
    const { error } = joi.validate({ ...payload }, schema);
    if (error) throw error.details[0].context.label;
    return true;
  },

  /**
   * validate nick name
   * @function
   * @param {object} payload - user object
   * @returns {object | boolean} - returns a boolean or an error object
   * @memberof AuthValidation
   */
   validateNickName(payload) {
    const schema = {
      nickname: joi.string().required().label('Please add a valid nick name')
    };
    const { error } = joi.validate({ ...payload }, schema);
    if (error) throw error.details[0].context.label;
    return true;
  },

  /**
   * validate password
   * @function
   * @param {object} payload - user object
   * @returns {object | boolean} - returns a boolean or an error object
   * @memberof AuthValidation
   */
  validatePassword(payload) {
    const schema = {
      password: joi.string().min(7).required().label('Please add a valid name')
        .label('Password is required. \n It should be more than 8 characters'),
    };
    const { error } = joi.validate({ ...payload }, schema);
    if (error) throw error.details[0].context.label;
    return true;
  },

  /**
   * validate referral code
   * @function
   * @param {object} payload - user object
   * @returns {object | boolean} - returns a boolean or an error object
   * @memberof AuthValidation
   */
  validateRefferalCode(payload) {
    const schema = {
      refferalCode: joi.string().min(8).label('Please add a valid name'),
    };
    const { error } = joi.validate({ ...payload }, schema);
    if (error) throw error.details[0].context.label;
    return true;
  }
};

export default AuthValidation;