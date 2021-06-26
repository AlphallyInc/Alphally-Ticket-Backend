/* eslint-disable no-useless-escape */
import joi from '@hapi/joi';
import validationData from './validationData';

const { states } = validationData;

const GeneralValidation = {

  /**
   * validate required email
   * @param {object} payload - user object
   * @returns {object | boolean} - returns a boolean or an error object
   * @memberof GeneralValidation
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
   * validate required id
   * @param {object} payload - user object
   * @returns {object | boolean} - returns a boolean or an error object
   * @memberof GeneralValidation
   */
  validateId(payload) {
    const schema = {
      id: joi.number().positive().required()
        .label('Please enter a positive number for id parameter'),
    };
    const { error } = joi.validate({ ...payload }, schema);
    if (error) throw error.details[0].context.label;
    return true;
  },

  /**
   * validate privacy payload
   * @param {object} payload - user object
   * @returns {object | boolean} - returns a boolean or an error object
   * @memberof GeneralValidation
   */
  validatePrivacy(payload) {
    const schema = {
      type: joi.string().required().label('Please a valid privacy type'),
      description: joi.string().label('Please a valid privacy description'),
    };
    const { error } = joi.validate({ ...payload }, schema);
    if (error) throw error.details[0].context.label;
    return true;
  },

  /**
   * validate post payload
   * @param {object} payload - user object
   * @returns {object | boolean} - returns a boolean or an error object
   * @memberof GeneralValidation
   */
  validatePost(payload) {
    const schema = {
      title: joi.string().required().label('Please a valid post title'),
      body: joi.string().required().label('Please a valid post message'),
      privacyId: joi.number().positive().label('Please a valid privacy id'),
    };
    const { error } = joi.validate({ ...payload }, schema);
    if (error) throw error.details[0].context.label;
    return true;
  },

  /**
   * validate cinema payload
   * @param {object} payload - user object
   * @returns {object | boolean} - returns a boolean or an error object
   * @memberof GeneralValidation
   */
  validateCinema(payload) {
    const schema = {
      name: joi.string().required().label('Please a valid cinema name'),
      address: joi.string().required().label('Please a valid cinema address'),
      capacity: joi.number().positive().required().label('Please a valid cinema capacity'),
      seats: joi.number().positive().required().label('Please a valid cinema seats number'),
      state: joi.valid(states).required().label('Please input a valid state name'),
    };
    const { error } = joi.validate({ ...payload }, schema);
    if (error) throw error.details[0].context.label;
    return true;
  },

  /**
   * validate movie payload
   * @param {object} payload - user object
   * @returns {object | boolean} - returns a boolean or an error object
   * @memberof GeneralValidation
   */
  validateMovie(payload) {
    const schema = {
      title: joi.string().required().label('Please a valid post title'),
      storyLine: joi.string().required().label('Please a valid movie story line'),
      releaseDate: joi.date().required().label('Please a valid date when the movie will be released'),
      showDate: joi.date().required().label('Please a valid date when the movie will be released'),
      discount: joi.number().precision(2).label('Please a valid discount, it\'s percentage should be presented in at most 2 decimal pllaces'),
      ticketPrice: joi.number().positive().required().label('Please a valid movie ticket price'),
      shareLink: joi.string().uri().label('Please a valid and shareable link  '),
      duration: joi.string().alphanum().required().label("Please duration should be for example '90 minutes' to be valid"),
      privacyId: joi.number().integer().positive().label('Please a valid privacy value'),
      cinemaId: joi.number().integer().positive().label('Please a valid cinema'),
    };
    const { error } = joi.validate({ ...payload }, schema);
    if (error) throw error.details[0].context.label;
    return true;
  },

  /**
   * validate comment payload
   * @param {object} payload - user object
   * @returns {object | boolean} - returns a boolean or an error object
   * @memberof GeneralValidation
   */
  validateComment(payload) {
    const schema = {
      postId: joi.number().positive().label('Please a valid post id'),
      comment: joi.string().required().label('Please a valid comment for the post'),
      parentId: joi.number().positive().label('Please a valid comment parent id'),
    };
    const { error } = joi.validate({ ...payload }, schema);
    if (error) throw error.details[0].context.label;
    return true;
  },
};

export default GeneralValidation;
