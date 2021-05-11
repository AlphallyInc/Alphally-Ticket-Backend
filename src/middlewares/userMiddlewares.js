import { GeneralValidation } from '../validation';
import { Toolbox } from '../utils';
import { GeneralService } from '../services';
import database from '../models';

const {
  errorResponse,
} = Toolbox;
const {
  validateId
} = GeneralValidation;
const {
  findByKey
} = GeneralService;
const {
  User
} = database;

const UserMiddleware = {
  /**
   * middleware validating userId and followerId
   * @async
   * @param {object} req - the api request
   * @param {object} res - api response returned by method
   * @param {object} next - returned values going into next function
   * @returns {object} - returns error or response object
   * @memberof UserMiddleware
   */
  async verifyUserAndFollower(req, res, next) {
    try {
      const { followerId } = req.query;
      if (followerId) {
        validateId({ id: followerId });
        if (req.tokenData.id === Number(followerId)) return errorResponse(res, { code: 409, message: 'You cannot follow yourself' });
        const follower = await findByKey(User, { id: followerId });
        if (!follower) return errorResponse(res, { code: 409, message: 'Follower does not exist' });
      }
      next();
    } catch (error) {
      errorResponse(res, { code: 400, message: error });
    }
  },
};

export default UserMiddleware;
