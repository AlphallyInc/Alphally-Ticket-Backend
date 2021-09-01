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
      type: joi.string().label('Please input a valid privacy type'),
      activityType: joi.string().valid('general', 'post', 'event', 'movie', 'following').label('Please input a valid privacy type'),
      description: joi.string().label('Please input a valid privacy description'),
      id: joi.number().positive().label('Please enter a positive number for id parameter'),
      email: joi.string().email().label('Please enter a valid email address'),
      title: joi.string().label('Please input a valid post title'),
      body: joi.string().label('Please input a valid post message'),
      privacyId: joi.number().positive().label('Please input a valid privacy id'),
      movieId: joi.number().positive().label('Please input a valid movie id'),
      eventId: joi.number().positive().label('Please input a valid event id'),
      name: joi.string().label('Please input a valid cinema name'),
      address: joi.string().label('Please input a valid cinema address'),
      capacity: joi.number().positive().label('Please input a valid cinema capacity'),
      seats: joi.number().positive().label('Please input a valid cinema seats number'),
      trailer: joi.string().uri().label('Please input a valid and trailer link'),
      state: joi.valid(states).label('Please input a valid state name'),
      storyLine: joi.string().label('Please input a valid movie story line'),
      releaseDate: joi.date().label('Please input a valid date when the movie will be released'),
      showDate: joi.date().label('Please input a valid date when the movie will be released'),
      discount: joi.number().precision(2).label('Please input a valid discount, it\'s percentage should be presented in at most 2 decimal pllaces'),
      ticketPrice: joi.number().positive().label('Please input a valid movie ticket price'),
      shareLink: joi.string().uri().label('Please input a valid and shareable link  '),
      duration: joi.string().label("Please duration should be for example '90 minutes' to be valid"),
      cinemaIds: joi.number().integer().positive().label('Please input a valid cinema'),
      genreIds: joi.number().integer().positive().label('Please input a valid genre'),
      mediaIds: joi.number().integer().positive().label('Please input a valid media'),
      numberOfTickets: joi.number().positive().label('Please input a valid number of tickets'),
      postId: joi.number().positive().label('Please input a valid post id'),
      comment: joi.string().label('Please input a valid comment for the post'),
      parentId: joi.number().positive().label('Please input a valid comment parent id'),
      showTime: joi.string().regex(/^([0-9]{2})\:([0-9]{2})$/).label('Please enter a valid show time'),
      addresses: joi.array().items(
        joi.object({
          address: joi.string().label('Please input a valid address'),
          city: joi.string().min(3).max(25).label('Please input a city name'),
          seats: joi.number().positive().required().label('Cinema Address Seat capacity is required'),
          state: joi.valid(states).label('Please state name must be capitalized'),
          country: joi.valid(countries).label('Please country must be capitalized'),
        })
      ).label('Please input a valid cinema address'),
      city: joi.string().min(3).max(25).label('Please input a city name'),
      country: joi.valid(countries).label('Please country must be capitalized'),
      post: joi.object({
        title: joi.string().label('Please input a valid post title'),
        body: joi.string().min(3).label('Please input a valid post description'),
        privacyId: joi.number().integer().positive().label('Please input a valid privacy value')
      }).label('Please add a post details for this movie'),
      startDate: joi.date().label('Please input a valid date when the movie will be released'),
      endDate: joi.date().label('Please input a valid date when the movie will be released'),
      startTime: joi.string().regex(/^([0-9]{2})\:([0-9]{2})$/).label('Please enter a valid show time'),
      endTime: joi.string().regex(/^([0-9]{2})\:([0-9]{2})$/).label('Please enter a valid show time'),
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
   * validate category payload
   * @param {object} payload - user object
   * @returns {object | boolean} - returns a boolean or an error object
   * @memberof GeneralValidation
   */
  validateCategory(payload) {
    const schema = {
      category: joi.array().items(
        joi.object({
          name: joi.string().required().label('Please name is required and must be valid (string)'),
          description: joi.string().min(3).max(200).label('Please input a valid description'),
        })
      ).label('Please category payload must be an array of category objects'),
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
      type: joi.string().required().label('Please input a valid privacy type'),
      description: joi.string().label('Please input a valid privacy description'),
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
      title: joi.string().required().label('Please input a valid post title'),
      isPublished: joi.bool().label('isPublished must be a boolean value'),
      body: joi.string().required().label('Please input a valid post message'),
      privacyId: joi.number().positive().label('Please input a valid privacy id'),
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
      name: joi.string().required().label('Please input a valid cinema name'),
      addresses: joi.array().items(
        joi.object({
          address: joi.string().label('Please input a valid address'),
          city: joi.string().min(3).max(25).label('Please input a city name'),
          seats: joi.number().positive().required().label('Cinema Address Seat capacity is required'),
          state: joi.valid(states).required().label('Please state name must be capitalized'),
          country: joi.valid(countries).required().label('Please country must be capitalized'),
        })
      ).required().label('Please input a valid cinema address'),
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
      title: joi.string().required().label('Please input a valid post title'),
      storyLine: joi.string().required().label('Please input a valid movie story line'),
      releaseDate: joi.date().required().label('Please input a valid date when the movie will be released'),
      showDate: joi.date().required().label('Please input a valid date when the movie will be released'),
      discount: joi.number().precision(2).label('Please input a valid discount, it\'s percentage should be presented in at most 2 decimal pllaces'),
      ticketPrice: joi.number().positive().required().label('Please input a valid movie ticket price'),
      shareLink: joi.string().uri().label('Please input a valid and shareable link  '),
      trailer: joi.string().uri().label('Please input a valid and trailer link  '),
      duration: joi.string().required().label("Please duration should be for example '90 minutes' to be valid"),
      numberOfTickets: joi.number().positive().required().label('Please input a valid number of tickets'),
      privacyId: joi.number().integer().positive().label('Please input a valid privacy value'),
      thumbnailId: joi.number().integer().positive().label('Please input a valid thumbnail value'),
      cinemaIds: joi.array().items(joi.number().positive().required()).label('Please input a valid cinema address'),
      mediaIds: joi.array().items(joi.number().positive().required()).label('Please input a valid media Ids'),
      genreIds: joi.array().items(joi.number().positive().required()).label('Please input a valid genres'),
      showTime: joi.string().regex(/^([0-9]{2})\:([0-9]{2})$/).label('Please enter a valid show time'),
      post: joi.object({
        title: joi.string().label('Please input a valid post title'),
        body: joi.string().min(3).label('Please input a valid post description'),
        privacyId: joi.number().integer().positive().label('Please input a valid privacy value')
      }).label('Please add a post details for this movie')
    };
    const { error } = joi.validate({ ...payload }, schema);
    if (error) throw error.details[0].context.label;
    return true;
  },

  /**
   * validate even payload
   * @param {object} payload - user object
   * @returns {object | boolean} - returns a boolean or an error object
   * @memberof GeneralValidation
   */
  validateEvent(payload) {
    const schema = {
      name: joi.string().required().label('Please input a valid post title'),
      description: joi.string().required().label('Please input a valid movie story line'),
      address: joi.string().required().label('Please input a valid movie story line'),
      startDate: joi.date().required().label('Please input a valid date when the movie will be released'),
      endDate: joi.date().required().label('Please input a valid date when the movie will be released'),
      startTime: joi.string().regex(/^([0-9]{2})\:([0-9]{2})$/).label('Please enter a valid show time'),
      endTime: joi.string().regex(/^([0-9]{2})\:([0-9]{2})$/).label('Please enter a valid show time'),
      discount: joi.number().precision(2).label('Please input a valid discount, it\'s percentage should be presented in at most 2 decimal pllaces'),
      ticketPrice: joi.number().positive().required().label('Please input a valid movie ticket price'),
      shareLink: joi.string().uri().label('Please input a valid and shareable link  '),
      trailer: joi.string().uri().label('Please input a valid and trailer link  '),
      duration: joi.string().required().label("Please duration should be for example '90 minutes' to be valid"),
      numberOfTickets: joi.number().positive().required().label('Please a valid number of tickets'),
      rating: joi.number().positive().label('Please input a valid event rating'),
      thumbnailId: joi.number().integer().positive().label('Please input a valid thumbnail'),
      privacyId: joi.number().integer().positive().label('Please input a valid privacy value'),
      categoryIds: joi.array().items(joi.number().positive().required()).label('Please input a valid cinema address'),
      mediaIds: joi.array().items(joi.number().positive().required()).label('Please input a valid media Ids'),
      post: joi.object({
        title: joi.string().label('Please input a valid post title'),
        body: joi.string().min(3).label('Please input a valid post description'),
        privacyId: joi.number().integer().positive().label('Please input a valid privacy value')
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
      postId: joi.number().positive().label('Please input a valid post id'),
      comment: joi.string().required().label('Please input a valid comment for the post'),
      parentId: joi.number().positive().label('Please input a valid comment parent id'),
    };
    const { error } = joi.validate({ ...payload }, schema);
    if (error) throw error.details[0].context.label;
    return true;
  },

  /**
   * validate tickets payload
   * @param {object} payload - user object
   * @returns {object | boolean} - returns a boolean or an error object
   * @memberof GeneralValidation
   */
  validateMovieTickets(payload) {
    const schema = {
      movieId: joi.number().positive().label('Please input a valid movie id'),
      quantity: joi.number().required().label('Please input a valid quantity of tickets')
    };
    const { error } = joi.validate({ ...payload }, schema);
    if (error) throw error.details[0].context.label;
    return true;
  },

  /**
   * validate tickets payload
   * @param {object} payload - user object
   * @returns {object | boolean} - returns a boolean or an error object
   * @memberof GeneralValidation
   */
  validateEventTickets(payload) {
    const schema = {
      eventId: joi.number().positive().label('Please input a valid event id'),
      quantity: joi.number().required().label('Please input a valid quantity of tickets')
    };
    const { error } = joi.validate({ ...payload }, schema);
    if (error) throw error.details[0].context.label;
    return true;
  },
};

export default GeneralValidation;
