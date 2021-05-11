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
      const { userId, followerId } = req.query;
      if (userId) {
        validateId({ id: userId });
        const user = await findByKey(User, { id: userId });
        if (!user) return errorResponse(res, { code: 409, message: 'User does not exist' });
      }
      if (followerId) {
        validateId({ id: followerId });
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
