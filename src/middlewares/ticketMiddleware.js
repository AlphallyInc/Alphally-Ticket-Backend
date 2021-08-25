import { GeneralValidation } from '../validation';
import { Toolbox } from '../utils';
import { GeneralService } from '../services';
import database from '../models';

const {
  errorResponse,
  successResponse
} = Toolbox;
const {
  validateId,
  validateMovieTickets,
  validateEventTickets,
  validateParameters
} = GeneralValidation;
const {
  findByKey
} = GeneralService;
const {
  Movie,
  Event,
  Ticket
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
  async validateMovieTicketPayload(req, res, next) {
    try {
      validateMovieTickets(req.body);
      if (req.body.movieId) {
        const movie = await findByKey(Movie, { id: req.body.movieId });
        if (!movie) return errorResponse(res, { code: '404', message: 'Movie is not found' });
        if (!movie.isAvialable) return errorResponse(res, { code: '404', message: 'Movie Ticket Finished' });
        if (movie.numberOfTickets < Number(req.body.quantity)) return errorResponse(res, { code: '404', message: 'Movie Tickets is not enough for purchase' });
        req.movie = movie;
      }
      next();
    } catch (error) {
      errorResponse(res, { code: 400, message: error });
    }
  },

  /**
   * middleware for validating tickets
   * @async
   * @param {object} req - the api request
   * @param {object} res - api response returned by method
   * @param {object} next - returned values going into next function
   * @returns {object} - returns error or response object
   * @memberof TicketMiddleware
   */
  async validateEventTicketPayload(req, res, next) {
    try {
      validateEventTickets(req.body);
      if (req.body.eventId) {
        const event = await findByKey(Event, { id: req.body.eventId });
        if (!event) return errorResponse(res, { code: '404', message: 'Event is not found' });
        if (!event.isAvialable) return errorResponse(res, { code: '404', message: 'Event Ticket Exhausted' });
        if (event.numberOfTickets < Number(req.body.quantity)) return errorResponse(res, { code: '404', message: 'Event Ticket is not enough for purchase' });
        req.event = event;
      }
      next();
    } catch (error) {
      errorResponse(res, { code: 400, message: error });
    }
  },

  /**
   * middleware for validating query payloads
   * @async
   * @param {object} req - the api request
   * @param {object} res - api response returned by method
   * @param {object} next - returned values going into next function
   * @returns {object} - returns error or response object
   * @memberof TicketMiddleware
   */
  async verifyIds(req, res, next) {
    try {
      validateParameters(req.query);
      if (req.query.eventId) {
        const event = await findByKey(Event, { id: req.body.eventId });
        if (!event) return errorResponse(res, { code: '404', message: 'Event is not found' });
      }
      if (req.query.movieId) {
        const movie = await findByKey(Movie, { id: req.body.movieId });
        if (!movie) return errorResponse(res, { code: '404', message: 'Movie is not found' });
      }
      next();
    } catch (error) {
      errorResponse(res, { code: 400, message: error });
    }
  },

  /**
   * middleware for validating tickets
   * @async
   * @param {object} req - the api request
   * @param {object} res - api response returned by method
   * @param {object} next - returned values going into next function
   * @returns {object} - returns error or response object
   * @memberof TicketMiddleware
   */
  async verifyTicket(req, res, next) {
    try {
      const { ticketId } = req.query;
      validateId({ id: ticketId });
      if (ticketId) {
        const ticket = await findByKey(Ticket, { id: ticketId });
        if (!ticket) return errorResponse(res, { code: '404', message: 'Ticket is invalid' });
        if (ticket.paymentStatus === 'completed') return successResponse(res, { message: 'Ticket is confirmed', ticket });
        req.ticket = ticket;
      }
      next();
    } catch (error) {
      errorResponse(res, { code: 400, message: error });
    }
  },
};

export default TicketMiddleware;
