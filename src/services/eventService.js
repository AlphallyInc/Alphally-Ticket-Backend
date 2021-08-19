import database from '../models';

const {
  Event,
  EventCategory,
  Category
} = database;

const EventService = {
  /**
   * add categories
   * @param {Array} categories
   * @returns {Number} reference - A unique value for ref
   * @memberof EventService
   */
  async recursiveCategories(categories) {
    try {
      if (categories.length < 1) return;

      const categoryData = categories[0];
      await Category.findOrCreate({ where: categoryData });
      // return console.log(data);
      return EventService.recursiveCategories(categories.slice(1));
    } catch (error) {
      throw new Error(error);
    }
  },

  /**
   * Get user posts
   * @async
   * @param {object} key - inputs like names or tags
   * @returns {promise-Object} - A promise object with entity details
   * @memberof EventService
   */
  async getMovieByKey(key) {
    try {
      const entities = await Movie.findAll({
        include: [
          {
            model: User,
            as: 'publisher',
            attributes: ['id', 'name', 'username', 'imageUrl'],
          },
          {
            model: Cinema,
            as: 'cinemas',
            attributes: ['id'],
            through: {
              model: MovieCinema
            }
          },
          {
            model: Media,
            as: 'medias',
            attributes: ['id'],
            through: {
              model: MovieMedia
            }
          },
          {
            model: Genre,
            as: 'genres',
            attributes: ['id'],
            through: {
              model: MovieGenre
            }
          }
        ],
        where: key,
        order: [
          ['id', 'DESC']
        ],
        returning: true
      });
      return entities;
    } catch (error) {
      throw new Error(error);
    }
  }
};

export default EventService;
