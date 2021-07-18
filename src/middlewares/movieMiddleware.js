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
  validateComment
} = GeneralValidation;
const {
  findByKey
} = GeneralService;
const {
  Post,
  Comment,
  Movie
} = database;

const MovieMiddleware = {
  /**
   * middleware validating movie payload
   * @async
   * @param {object} req - the api request
   * @param {object} res - api response returned by method
   * @param {object} next - returned values going into next function
   * @returns {object} - returns error or response object
   * @memberof MovieMiddleware
   */
  async verifyMoviePayload(req, res, next) {
    try {
      validateMovie(req.body);
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
   * @memberof MovieMiddleware
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
  },

  /**
   * middleware validating comment id payload
   * @async
   * @param {object} req - the api request
   * @param {object} res - api response returned by method
   * @param {object} next - returned values going into next function
   * @returns {object} - returns error or response object
   * @memberof MovieMiddleware
   */
  async verifyComment(req, res, next) {
    try {
      if (req.query.id) {
        validateId({ id: req.query.id });
        const comment = await findByKey(Comment, { id: req.query.id });
        if (!comment) return errorResponse(res, { code: 404, message: 'Comment is Not Found' });
      }
      next();
    } catch (error) {
      errorResponse(res, { code: 400, message: error });
    }
  },
};

export default MovieMiddleware;
