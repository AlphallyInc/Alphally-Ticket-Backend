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

export default MovieService;
