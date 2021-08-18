import { GeneralValidation } from '../validation';
import { Toolbox } from '../utils';
import { GeneralService } from '../services';
import database from '../models';

const {
  errorResponse,
} = Toolbox;
const {
  validateMovie,
  validateId,
  validateParameters,
  validateCategory
} = GeneralValidation;
const {
  findByKey
} = GeneralService;
const {
  Post,
  Comment,
  Movie
} = database;

const EventMiddleware = {
  /**
   * middleware validating movie payload
   * @async
   * @param {object} req - the api request
   * @param {object} res - api response returned by method
   * @param {object} next - returned values going into next function
   * @returns {object} - returns error or response object
   * @memberof EventMiddleware
   */
  async validateCategoriesPayload(req, res, next) {
    try {
      validateCategory({ category: req.body });
      next();
    } catch (error) {
      errorResponse(res, { code: 400, message: error });
    }
  },

  /**
   * middleware validating movie payload
   * @async
   * @param {object} req - the api request
   * @param {object} res - api response returned by method
   * @param {object} next - returned values going into next function
   * @returns {object} - returns error or response object
   * @memberof EventMiddleware
   */
  async verifyMoviePayload(req, res, next) {
    try {
      validateMovie(req.body);
      if (req.body.title) {
        const movie = await findByKey(Movie, { title: req.body.title });
        if (movie) return errorResponse(res, { code: 409, message: 'Movie already exist' });
      }
      next();
    } catch (error) {
      errorResponse(res, { code: 400, message: error });
    }
  },

  /**
   * middleware validating movie payload
   * @async
   * @param {object} req - the api request
   * @param {object} res - api response returned by method
   * @param {object} next - returned values going into next function
   * @returns {object} - returns error or response object
   * @memberof EventMiddleware
   */
  async verifyMovie(req, res, next) {
    try {
      if (req.query.id || req.query.movieId) {
        const id = req.query.id || req.query.movieId;
        validateId({ id });
        const movie = await findByKey(Movie, { id });
        if (!movie) return errorResponse(res, { code: 404, message: 'Movie is Not Found' });
        req.movie = movie;
      }
      if (req.body) validateParameters(req.body);
      next();
    } catch (error) {
      errorResponse(res, { code: 400, message: error });
    }
  }
};

export default EventMiddleware;
