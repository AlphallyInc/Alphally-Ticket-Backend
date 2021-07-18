/* eslint-disable no-useless-escape */
import joi from '@hapi/joi';
import validationData from './validationData';

const { states, countries } = validationData;

const GeneralValidation = {
  /**
   * validate general parameters
   * @param {object} payload - user object
   * @returns {object | boolean} - returns a boolean or an error object
   * @memberof GeneralValidation
   */
  validateParameters(payload) {
    const schema = {
      type: joi.string().label('Please a valid privacy type'),
      description: joi.string().label('Please a valid privacy description'),
      id: joi.number().positive().label('Please enter a positive number for id parameter'),
      email: joi.string().email().label('Please enter a valid email address'),
      title: joi.string().label('Please a valid post title'),
      body: joi.string().label('Please a valid post message'),
      privacyId: joi.number().positive().label('Please a valid privacy id'),
      name: joi.string().label('Please a valid cinema name'),
      address: joi.string().label('Please a valid cinema address'),
      capacity: joi.number().positive().label('Please a valid cinema capacity'),
      seats: joi.number().positive().label('Please a valid cinema seats number'),
      state: joi.valid(states).label('Please input a valid state name'),
      storyLine: joi.string().label('Please a valid movie story line'),
      releaseDate: joi.date().label('Please a valid date when the movie will be released'),
      showDate: joi.date().label('Please a valid date when the movie will be released'),
      discount: joi.number().precision(2).label('Please a valid discount, it\'s percentage should be presented in at most 2 decimal pllaces'),
      ticketPrice: joi.number().positive().label('Please a valid movie ticket price'),
      shareLink: joi.string().uri().label('Please a valid and shareable link  '),
      duration: joi.string().alphanum().label("Please duration should be for example '90 minutes' to be valid"),
      cinemaId: joi.number().integer().positive().label('Please a valid cinema'),
      postId: joi.number().positive().label('Please a valid post id'),
      comment: joi.string().label('Please a valid comment for the post'),
      parentId: joi.number().positive().label('Please a valid comment parent id'),
      addresses: joi.array().items(
        joi.object({
          address: joi.string().label('Please a valid address'),
          city: joi.string().min(3).max(25).label('Please input a city name'),
          seats: joi.number().positive().label('Please a valid cinema seats number'),
          state: joi.valid(states).label('Please state name must be capitalized'),
          country: joi.valid(countries).label('Please country must be capitalized'),
        })
      ).label('Please a valid cinema address'),
      city: joi.string().min(3).max(25).label('Please input a city name'),
      country: joi.valid(countries).label('Please country must be capitalized'),
      cinemaIds: joi.array().items(joi.number().positive()).label('Please a valid cinema address'),
      post: joi.object({
        title: joi.string().label('Please a valid post title'),
        body: joi.string().min(3).label('Please input a valid post description'),
        privacyId: joi.number().integer().positive().label('Please a valid privacy value')
      }).label('Please add a post details for this movie')
    };
    const { error } = joi.validate({ ...payload }, schema);
    if (error) throw error.details[0].context.label;
    return true;
  },

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
      isPublished: joi.bool().label('isPublished must be a boolean value'),
      body: joi.string().required().label('Please a valid post message'),
      privacyId: joi.number().positive().label('Please a valid privacy id'),
      thumbnailId: joi.number().positive().required().label('Please add a valid thumbnail id'),
      mediaId: joi.array().items(
        joi.number().positive().required().label('Please add valid media id')
      ).label('Media must be an array of picture id'),
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
      addresses: joi.array().items(
        joi.object({
          address: joi.string().label('Please a valid address'),
          city: joi.string().min(3).max(25).label('Please input a city name'),
          seats: joi.number().positive().required().label('Please a valid cinema seats number'),
          state: joi.valid(states).required().label('Please state name must be capitalized'),
          country: joi.valid(countries).required().label('Please country must be capitalized'),
        })
      ).required().label('Please a valid cinema address'),
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
      cinemaIds: joi.array().items(joi.number().positive().required()).label('Please a valid cinema address'),
      post: joi.object({
        title: joi.string().label('Please a valid post title'),
        body: joi.string().min(3).label('Please input a valid post description'),
        privacyId: joi.number().integer().positive().label('Please a valid privacy value')
      }).label('Please add a post details for this movie')
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
