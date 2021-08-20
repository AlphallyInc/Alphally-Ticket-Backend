import database from '../models';

const {
  Event,
  EventCategory,
  Category,
  User,
  EventMedia,
  Media
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
   * Get events
   * @async
   * @param {object} key - inputs like names or tags
   * @returns {promise-Object} - A promise object with entity details
   * @memberof EventService
   */
  async getEventByKey(key) {
    try {
      const entities = await Event.findAll({
        include: [
          {
            model: User,
            as: 'publisher',
            attributes: ['id', 'name', 'username', 'imageUrl'],
          },
          {
            model: Media,
            as: 'medias',
            attributes: ['id', 'url', 'type'],
            through: {
              model: EventMedia,
              attributes: ['id']
            }
          },
          {
            model: Category,
            as: 'categories',
            attributes: ['id', 'name', 'decription'],
            through: {
              model: EventCategory,
              attributes: ['id']
            }
          },
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
