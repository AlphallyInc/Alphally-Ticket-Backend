import database from '../models';
import GeneralService from './generalService';

const {
  addEntity
} = GeneralService;
const {
  Follower,
  User,
  Media,
  MovieMedia,
  Movie,
  Post,
  PostMedia,
  Event,
  Ticket,
  Comment,
  Like,
  Activity
} = database;

const UserService = {
  /**
   * Get user profile and details
   * @async
   * @param {object} key - inputs like names or tags
   * @returns {promise-Object} - A promise object with entity details
   * @memberof UserService
   */
  async getUserProfile(key) {
    try {
      const entities = await User.findOne({
        include: [
          {
            model: Follower,
            as: 'follower',
            where: {
              followerId: key.id
            }
          }
        ],
        where: key,
      });
      return entities;
    } catch (error) {
      throw new Error(error);
    }
  },

  /**
   * Get user post activity
   * @async
   * @param {object} key - inputs like names or tags
   * @returns {promise-Object} - A promise object with entity details
   * @memberof UserService
   */
  async getPostActivity(key) {
    try {
      const entities = await Activity.findAll({
        include: [
          {
            model: Post,
            as: 'post',
            attributes: ['id', 'title', 'thumbnail'],
          }
        ],
        where: key,
      });
      return entities;
    } catch (error) {
      throw new Error(error);
    }
  },

  /**
   * Get user event activity
   * @async
   * @param {object} key - inputs like names or tags
   * @returns {promise-Object} - A promise object with entity details
   * @memberof UserService
   */
  async getEventActivity(key) {
    try {
      const entities = await Activity.findAll({
        include: [
          {
            model: Event,
            as: 'event',
            attributes: ['id', 'name', 'thumbnail'],
          }
        ],
        where: key,
      });
      return entities;
    } catch (error) {
      throw new Error(error);
    }
  },

  /**
   * Get user movie activity
   * @async
   * @param {object} key - inputs like names or tags
   * @returns {promise-Object} - A promise object with entity details
   * @memberof UserService
   */
  async getMovieActivity(key) {
    try {
      const entities = await Activity.findAll({
        include: [
          {
            model: Movie,
            as: 'movie',
            attributes: ['id', 'title', 'thumbnail'],
          }
        ],
        where: key,
      });
      return entities;
    } catch (error) {
      throw new Error(error);
    }
  },

  /**
   * Get user event activity
   * @async
   * @param {object} key - inputs like names or tags
   * @returns {promise-Object} - A promise object with entity details
   * @memberof UserService
   */
  async getCommentActivity(key) {
    try {
      const entities = await Activity.findAll({
        include: [
          {
            model: Event,
            as: 'event',
            attributes: ['id', 'name', 'thumbnail'],
          }
        ],
        where: key,
      });
      return entities;
    } catch (error) {
      throw new Error(error);
    }
  },

  /**
   * Get user activity
   * @async
   * @param {object} key - inputs like names or tags
   * @returns {promise-Object} - A promise object with entity details
   * @memberof UserService
   */
  async getActivitiesByKey(key) {
    try {
      const entities = await Activity.findAll({
        include: [
          {
            model: User,
            as: 'activityUser',
            attributes: ['id', 'name', 'imageUrl', 'username'],
          }
        ],
        where: key,
      });
      return entities;
    } catch (error) {
      throw new Error(error);
    }
  },

  /**
   * Get user profile and details
   * @async
   * @param {object} key - inputs like names or tags
   * @returns {promise-Object} - A promise object with entity details
   * @memberof UserService
   */
  async getMedias(key) {
    try {
      const entities = await Media.findAll({
        include: [
          // {
          //   model: Movie,
          //   as: 'movies',
          //   through: {
          //     model: MovieMedia
          //   }
          // },
          {
            model: Post,
            as: 'post',
            through: {
              model: PostMedia
            }
          }
        ],
        where: key,
      });
      return entities;
    } catch (error) {
      throw new Error(error);
    }
  },

  /**
   * Get user follow data
   * @async
   * @param {object} key - inputs like names or tags
   * @returns {promise-Object} - A promise object with entity details
   * @memberof UserService
   */
  async getFollowData(key) {
    try {
      const result = [];
      const followers = await Follower.findAll({
        include: [
          {
            model: User,
            as: 'follower',
            attributes: ['id', 'name', 'imageUrl', 'username'],
          }
        ],
        where: key,
      });
      const following = await Follower.findAll({
        include: [
          {
            model: User,
            as: 'user',
            attributes: ['id', 'name', 'imageUrl', 'username'],
          }
        ],
        where: key,
      });

      if (followers.length > 0) {
        followers.forEach((item) => {
          result.push(item.dataValues.follower);
        });
      }
      const entities = await UserService.mergeFollowers(following, result, key.id);
      return entities;
    } catch (error) {
      throw new Error(error);
    }
  },

  /**
   * merge following data and follower data
   * @async
   * @param {array} following - following data
   * @param {array} followersResult - follower data
   * @returns {promise-Object} - A promise object with entity details
   * @memberof UserService
   */
  async mergeFollowers(following, followersResult) {
    try {
      if (following.length < 1) return followersResult;
      const followUser = following.dataValues.user[0];
      const index = await followersResult.findIndex((item) => item.id === followUser.id);
      if (index > -1) followersResult.push(followUser);
      return UserService.mergeFollowers(following.slice(1), followersResult);
    } catch (error) {
      throw new Error(error);
    }
  },

  /**
   * add activities
   * @async
   * @param {array} followData - users to add activity
   * @param {array} activity - activity message
   * @param {array} typeId - type of activity id
   * @param {array} type - type of activity
   * @param {array} userId - user of the activity
   * @returns {promise-Object} - A promise object with entity details
   * @memberof UserService
   */
  async addAllActivities(followData, activity, typeId, type, userId) {
    try {
      if (followData.length < 1) return;

      const activityUserId = followData[0].id;
      switch (type) {
        case 'event':
          await addEntity(Activity, {
            type, activity, userId, eventId: typeId, activityUserId
          });
          break;
        case 'movie':
          await addEntity(Activity, {
            type, activity, userId, movieId: typeId, activityUserId
          });
          break;
        case 'post':
          await addEntity(Activity, {
            type, activity, userId, postId: typeId, activityUserId
          });
          break;
        case 'like':
          await addEntity(Activity, {
            type, activity, userId, likeId: typeId, activityUserId
          });
          break;

        default:
          break;
      }

      return UserService.addAllActivities(followData.slice(1), activity, typeId, type, userId);
    } catch (error) {
      throw new Error(error);
    }
  }
};

export default UserService;
