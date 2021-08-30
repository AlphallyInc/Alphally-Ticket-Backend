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
  rowCountByKey,
  allEntities
} = GeneralService;
const {
  getMedias,
  getPostActivity,
  getEventActivity,
  getMovieActivity,
  getCommentActivity,
  getLikeActivity,
  getFolllowerActivity,
  getActivitiesByKey
} = UserService;
const {
  User,
  Follower,
  Privacy,
  Activity
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
      } else {
        followData = await addEntity(Follower, { userId: id, followerId });
        await addEntity(Activity, {
          userId: id, activity: `${req.follower.name} Followed You`, activityUserId: followerId, followingId: followerId, type: 'follower'
        });
      }
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
      let id;
      if (req.query.id) id = req.query.id;
      else id = req.tokenData.id;
      if (!id || id === undefined) return errorResponse(res, { code: 401, message: 'Please add an id or authenticate to view profile' });
      let user = await findByKey(User, { id });
      const followersData = await rowCountByKey(Follower, { followerId: id });
      const followingData = await rowCountByKey(Follower, { userId: id });
      const media = await getMedias({ userId: id });
      user = {
        ...user.dataValues, followers: followersData.count, following: followingData.count, media
      };
      return successResponse(res, { message: 'Profile Successfully', user });
    } catch (error) {
      console.error(error);
      errorResponse(res, { code: 500, message: error });
    }
  },

  /**
   * get user activity
   * @async
   * @param {object} req
   * @param {object} res
   * @returns {JSON} a JSON response with user details and Token
   * @memberof UserController
   */
  async getActivities(req, res) {
    try {
      const { id } = req.tokenData;
      const {
        postId, eventId, movieId, commentId, likeId, followerId
      } = req.query;
      let activities;

      if (postId) activities = await getPostActivity({ postId });
      else if (eventId) activities = await getEventActivity({ eventId });
      else if (movieId) activities = await getMovieActivity({ movieId });
      else if (commentId) activities = await getCommentActivity({ commentId });
      else if (likeId) activities = await getLikeActivity({ likeId });
      else if (followerId) activities = await getFolllowerActivity({ commentId });
      else activities = await getActivitiesByKey({});

      return successResponse(res, { message: 'Activity Gotten Successfully', activities });
    } catch (error) {
      console.error(error);
      errorResponse(res, { code: 500, message: error });
    }
  },

  /**
   * get user profile medias
   * @async
   * @param {object} req
   * @param {object} res
   * @returns {JSON} a JSON response with user details and Token
   * @memberof UserController
   */
  async getProfileMedia(req, res) {
    try {
      const { id } = req.tokenData;
      const media = await getMedias({ userId: id });
      return successResponse(res, { message: 'Profile Successfully', media });
    } catch (error) {
      console.error(error);
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
