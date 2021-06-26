import { GeneralValidation } from '../validation';
import { Toolbox } from '../utils';
import { GeneralService, AdminService } from '../services';
import database from '../models';

const {
  errorResponse,
} = Toolbox;
const {
  validatePrivacy,
  validateCinema,
  validateParameters,
  validateId
} = GeneralValidation;
const {
  getCinemas
} = AdminService;
const {
  findByKey
} = GeneralService;
const {
  Privacy,
  Cinema
} = database;

const AdminMiddleware = {
  /**
   * middleware validating privacy payload
   * @async
   * @param {object} req - the api request
   * @param {object} res - api response returned by method
   * @param {object} next - returned values going into next function
   * @returns {object} - returns error or response object
   * @memberof AdminMiddleware
   */
  async verifyPrivacy(req, res, next) {
    try {
      validatePrivacy(req.body);
      const privacy = await findByKey(Privacy, { type: req.body.type });
      if (privacy) return errorResponse(res, { code: 409, message: 'Privacy Type already exist' });
      next();
    } catch (error) {
      errorResponse(res, { code: 400, message: error });
    }
  },

  /**
   * middleware validating cinema payload
   * @async
   * @param {object} req - the api request
   * @param {object} res - api response returned by method
   * @param {object} next - returned values going into next function
   * @returns {object} - returns error or response object
   * @memberof AdminMiddleware
   */
  async verifyCinemaPayload(req, res, next) {
    try {
      validateCinema(req.body);
      const { name } = req.body;
      req.body.name = name.toLowerCase();
      const cinema = await findByKey(Cinema, { name: req.body.name });
      if (cinema) return errorResponse(res, { code: 400, message: 'Cinema already exist' });
      next();
    } catch (error) {
      console.error(error);
      errorResponse(res, { code: 400, message: error });
    }
  },

  /**
   * middleware validating cinema payload
   * @async
   * @param {object} req - the api request
   * @param {object} res - api response returned by method
   * @param {object} next - returned values going into next function
   * @returns {object} - returns error or response object
   * @memberof AdminMiddleware
   */
  async verifyCinema(req, res, next) {
    try {
      if (req.body) validateParameters(req.body);
      if (req.query.id) {
        const { id } = req.query;
        validateId({ id });
        const cinema = await getCinemas({ id });
        if (!cinema.length) return errorResponse(res, { code: 400, message: 'Cinema does not exist' });
        req.cinema = cinema;
      }
      next();
    } catch (error) {
      errorResponse(res, { code: 400, message: error });
    }
  },
};

export default AdminMiddleware;
