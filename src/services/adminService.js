import database from '../models';

const {
  CinemaAddress,
  Cinema,
  Movie,
  Event,
  Ticket
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
  },

  /**
   * Get tickets for a movie of an event
   * @async
   * @param {object} key - id
   * @returns {promise-Object} - A promise object with entity details
   * @memberof AdminService
   */
  async getTicketByKey(key) {
    try {
      const entities = await Ticket.findAll({
        include: [
          {
            model: Movie,
            as: 'movie',
            attributes: ['title', 'numberOfTickets', 'isAvialable']
          },
          {
            model: Event,
            as: 'event',
            attributes: ['name', 'numberOfTickets', 'isAvialable']
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
   * Get tickets for a movie of an event
   * @async
   * @param {object} key - id
   * @returns {promise-Object} - A promise object with entity details
   * @memberof AdminService
   */
  async getMovieTicketByKey(key) {
    try {
      const entities = await Movie.findOne({
        include: [
          {
            model: Ticket,
            as: 'tickets',
            required: true,
            where: {
              paymentStatus: 'completed'
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
   * Get tickets for a movie of an event
   * @async
   * @param {object} key - id
   * @returns {promise-Object} - A promise object with entity details
   * @memberof AdminService
   */
  async getEventTicketByKey(key) {
    try {
      const entities = await Event.findOne({
        include: [
          {
            model: Ticket,
            as: 'tickets',
            required: true,
            where: {
              paymentStatus: 'completed'
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

export default AdminService;
