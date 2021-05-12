import { GeneralService, UserService } from '../services';
import { Toolbox } from '../utils';
import database from '../models';

const {
  successResponse,
  errorResponse,
} = Toolbox;
const {
  addEntity,
  findByKey,
  deleteByKey,
  rowCountByKey
} = GeneralService;
// const {
//   getUserProfile
// } = UserService;
const {
  User,
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
  },

  /**
   * get user profile and followers report
   * @async
   * @param {object} req
   * @param {object} res
   * @returns {JSON} a JSON response with user details and Token
   * @memberof UserController
   */
  async getProfile(req, res) {
    try {
      const { id } = req.tokenData;
      let user = await findByKey(User, { id });
      const followersData = await rowCountByKey(Follower, { followerId: id });
      const followingData = await rowCountByKey(Follower, { userId: id });
      user = { ...user.dataValues, followers: followersData.count, following: followingData.count };
      return successResponse(res, { message: 'Profile Successfully', user });
    } catch (error) {
      errorResponse(res, { code: 500, message: error });
    }
  }
};

export default UserController;
