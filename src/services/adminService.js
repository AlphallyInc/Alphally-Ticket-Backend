import database from '../models';

const {
  CinemaAddress,
  Cinema
} = database;

const AdminService = {
  /**
   * Get user profile and details
   * @async
   * @param {object} key - inputs like names or tags
   * @returns {promise-Object} - A promise object with entity details
   * @memberof AdminService
   */
  async getCinemas(key) {
    try {
      const entities = await Cinema.findAll({
        include: [
          {
            model: CinemaAddress,
            as: 'addresses'
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

export default AdminService;
