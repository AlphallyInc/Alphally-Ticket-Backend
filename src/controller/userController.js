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
  deleteByKey,
  rowCountByKey,
  allEntities
} = GeneralService;
// const {
//   getUserProfile
// } = UserService;
const {
  User,
  Follower,
  Privacy
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
  },

  /**
   * check if you are following user
   * @async
   * @param {object} req
   * @param {object} res
   * @returns {JSON} a JSON response with user details and Token
   * @memberof UserController
   */
  async checkFollowing(req, res) {
    try {
      const { id } = req.tokenData;
      const user = await findByKey(Follower, { userId: id, followerId: req.query.userId });
      const following = !!user;
      return successResponse(res, { following });
    } catch (error) {
      errorResponse(res, { code: 500, message: error });
    }
  },

  /**
   * check if user is following
   * @async
   * @param {object} req
   * @param {object} res
   * @returns {JSON} a JSON response with user details and Token
   * @memberof UserController
   */
  async checkFollower(req, res) {
    try {
      const { id } = req.tokenData;
      const user = await findByKey(Follower, { userId: req.query.userId, followerId: id });
      const follower = !!user;
      return successResponse(res, { follower });
    } catch (error) {
      errorResponse(res, { code: 500, message: error });
    }
  },

  /**
   * list followers
   * @async
   * @param {object} req
   * @param {object} res
   * @returns {JSON} a JSON response with user details and Token
   * @memberof UserController
   */
  async listFollowers(req, res) {
    try {
      const { id } = req.tokenData;
      const followers = await rowCountByKey(Follower, { followerId: id });
      followers.followData = followers.rows;
      delete followers.rows;
      return successResponse(res, { message: 'Followers Gotten Successfully', followers });
    } catch (error) {
      errorResponse(res, { code: 500, message: error });
    }
  },

  /**
   * delete a single privacy account
   * @async
   * @param {object} req
   * @param {object} res
   * @returns {JSON} a JSON response with user details and Token
   * @memberof AdminController
   */
  async getPrivacy(req, res) {
    try {
      const privacy = await allEntities(Privacy);
      if (!privacy.length) return successResponse(res, { message: 'No Privacy Added Yet', privacy });
      return successResponse(res, { message: 'Privacy Gotten Successfully', privacy });
    } catch (error) {
      errorResponse(res, { code: 500, message: error });
    }
  }
};

export default UserController;
