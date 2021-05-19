import { GeneralValidation } from '../validation';
import { Toolbox } from '../utils';
import { GeneralService } from '../services';
import database from '../models';

const {
  errorResponse,
} = Toolbox;
const {
  validatePrivacy
} = GeneralValidation;
const {
  findByKey
} = GeneralService;
const {
  Privacy
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
};

export default AdminMiddleware;
