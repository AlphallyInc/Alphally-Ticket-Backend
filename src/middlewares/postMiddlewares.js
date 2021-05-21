import { GeneralValidation } from '../validation';
import { Toolbox } from '../utils';
import { GeneralService } from '../services';
import database from '../models';

const {
  errorResponse,
} = Toolbox;
const {
  validatePost
} = GeneralValidation;
const {
  findByKey
} = GeneralService;
const {
  Privacy
} = database;

const PostMiddleware = {
  /**
   * middleware validating post payload
   * @async
   * @param {object} req - the api request
   * @param {object} res - api response returned by method
   * @param {object} next - returned values going into next function
   * @returns {object} - returns error or response object
   * @memberof PostMiddleware
   */
  async verifyPost(req, res, next) {
    try {
      validatePost(req.body);
      next();
    } catch (error) {
      errorResponse(res, { code: 400, message: error });
    }
  },
};

export default PostMiddleware;
