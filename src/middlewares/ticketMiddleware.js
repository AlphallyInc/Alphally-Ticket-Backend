import { GeneralValidation } from '../validation';
import { Toolbox } from '../utils';
import { GeneralService } from '../services';
import database from '../models';

const {
  errorResponse,
} = Toolbox;
const {
  validateId,
  validateTickets
} = GeneralValidation;
const {
  findByKey
} = GeneralService;
const {
  Movie
} = database;

const TicketMiddleware = {
  /**
   * middleware for validating tickets
   * @async
   * @param {object} req - the api request
   * @param {object} res - api response returned by method
   * @param {object} next - returned values going into next function
   * @returns {object} - returns error or response object
   * @memberof TicketMiddleware
   */
  async verifyTicketPayload(req, res, next) {
    try {
      validateTickets(req.body);
      if (req.body.movieId) {
        const movie = await findByKey(Movie, { id: req.body.movieId });
        if (!movie) return errorResponse(res, { code: '404', message: 'Movie is not found' });
        if (!movie.isAvialable) return errorResponse(res, { code: '404', message: 'Movie Ticket Finished' });
        if (movie.numberOfTickets >= Number(req.body.quantity)) return errorResponse(res, { code: '404', message: 'Movie Tickets is not enough for purchase' });
      }
      next();
    } catch (error) {
      errorResponse(res, { code: 400, message: error });
    }
  },
};

export default TicketMiddleware;
