import { GeneralService } from '../services';
import { Toolbox } from '../utils';
import database from '../models';

const {
  successResponse,
  errorResponse,
} = Toolbox;
const {
  addEntity,
  findByKey,
  deleteByKey
} = GeneralService;
const {
  Follower
} = database;

const UserController = {
  /**
   * follow and follow user
   * @async
   * @param {object} req
   * @param {object} res
   * @returns {JSON} a JSON response with user details and Token
   * @memberof UserController
   */
  async followOrUnFollowUser(req, res) {
    try {
      let followData;
      const { followerId } = req.query;
      const { id } = req.tokenData;
      const followerData = await findByKey(Follower, { userId: id, followerId });
      if (followerData) {
        followData = await deleteByKey(Follower, { userId: id, followerId });
        followData = false;
      } else followData = await addEntity(Follower, { userId: id, followerId });
      return successResponse(res, {
        message: followerData ? 'User Unfollowed Successfully' : 'Followed Successfully',
        followData
      });
    } catch (error) {
      errorResponse(res, { code: 500, message: error });
    }
  }
};

export default UserController;
