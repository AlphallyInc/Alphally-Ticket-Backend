import { GeneralValidation } from '../validation';
import { Toolbox } from '../utils';
import { GeneralService } from '../services';
import database from '../models';

const {
  errorResponse,
} = Toolbox;
const {
  validateEvent,
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
  Event
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
      validateCategory(req.body);
      next();
    } catch (error) {
      errorResponse(res, { code: 400, message: error });
    }
  },

  /**
   * middleware validating event payload
   * @async
   * @param {object} req - the api request
   * @param {object} res - api response returned by method
   * @param {object} next - returned values going into next function
   * @returns {object} - returns error or response object
   * @memberof EventMiddleware
   */
  async verifyEventPayload(req, res, next) {
    try {
      // return console.log(req.body);
      validateEvent(req.body);
      if (req.body.name) {
        const event = await findByKey(Event, { name: req.body.name });
        if (event) return errorResponse(res, { code: 409, message: 'Event already exist' });
      }
      next();
    } catch (error) {
      errorResponse(res, { code: 400, message: error });
    }
  },

  /**
   * middleware validating event payload
   * @async
   * @param {object} req - the api request
   * @param {object} res - api response returned by method
   * @param {object} next - returned values going into next function
   * @returns {object} - returns error or response object
   * @memberof EventMiddleware
   */
  async verifyEvent(req, res, next) {
    try {
      if (req.query.id || req.query.eventId) {
        const id = req.query.id || req.query.eventId;
        validateId({ id });
        const event = await findByKey(Event, { id });
        if (!event) return errorResponse(res, { code: 404, message: 'Event is Not Found' });
        req.event = event;
      }
      if (req.body) validateParameters(req.body);
      next();
    } catch (error) {
      errorResponse(res, { code: 400, message: error });
    }
  }
};

export default EventMiddleware;
