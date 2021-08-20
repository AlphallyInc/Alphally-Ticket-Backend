import database from '../models';

const {
  User,
  Media,
  Movie,
  Cinema,
  Genre,
  MovieMedia,
  MovieGenre,
  MovieCinema,
} = database;

const MovieService = {
  /**
   * Get user posts
   * @async
   * @param {object} key - inputs like names or tags
   * @returns {promise-Object} - A promise object with entity details
   * @memberof MovieService
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
            attributes: ['id', 'name', 'address', 'seats', 'state'],
            through: {
              model: MovieCinema,
              attributes: ['id'],
            }
          },
          {
            model: Media,
            as: 'medias',
            attributes: ['id', 'url', 'type'],
            through: {
              model: MovieMedia,
              attributes: ['id'],
            }
          },
          {
            model: Genre,
            as: 'genres',
            attributes: ['id', 'name'],
            through: {
              model: MovieGenre,
              attributes: ['id'],
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

export default MovieService;
