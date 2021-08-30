import database from '../models';

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
  }
};

export default UserService;
