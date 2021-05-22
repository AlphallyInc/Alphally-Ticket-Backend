import database from '../models';

const {
  Follower,
  User
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
  }
};

export default UserService;
