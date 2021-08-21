/* eslint-disable max-len */
import { GeneralService, MovieService } from '../services';
import { Toolbox, Helpers } from '../utils';
import database from '../models';

const {
  successResponse,
  errorResponse,
  mergeImageVideoUrls
} = Toolbox;
const {
  addEntity,
  updateByKey,
  findByKey,
  deleteByKey,
  allEntities,
  findMultipleByKey
} = GeneralService;
const {
  uploadAllImages,
  uploadAllVideos
} = Helpers;
const {
  getMovieByKey
} = MovieService;
const {
  PostMedia,
  MovieMedia,
  Movie,
  Post,
  Media,
  MovieCinema,
  MovieGenre,
  Genre
} = database;

const MovieController = {
  /**
   * add a movie and a post
   * @async
   * @param {object} req
   * @param {object} res
   * @returns {JSON} a JSON response with user details and Token
   * @memberof MovieController
   */
  async addMovie(req, res) {
    try {
      // return console.log(req.body);
      let mediaPayload;
      let thumbnailMedia;
      let media;
      const { id } = req.tokenData;
      const postBody = req.body.post;
      const { cinemaIds, genreIds } = req.body;
      delete req.body.post;
      delete req.body.cinemaIds;
      delete req.body.genreIds;
      if (req.files && req.files.length) {
        let imageMediaPayload;
        let videoMediaPayload;
        const fullMediaPayload = req.files.map((item) => ({
          type: item.mimetype.split('/')[0],
          fileExtension: item.mimetype.split('/')[1],
          userId: id,
          fileName: item.originalname
        }));
        const imagePayload = req.files.filter((item) => item.mimetype.split('/')[0].toLowerCase() === 'image');
        const videoPayload = req.files.filter((item) => item.mimetype.split('/')[0].toLowerCase() === 'video');
        if (imagePayload.length > 0) {
          const imageUrls = await uploadAllImages(imagePayload);
          imageMediaPayload = mergeImageVideoUrls(fullMediaPayload, imageUrls);
        }
        if (videoPayload.length > 0) {
          const videoUrls = await uploadAllVideos(videoPayload);
          videoMediaPayload = mergeImageVideoUrls(fullMediaPayload, videoUrls);
        }
        mediaPayload = imageMediaPayload.concat(videoMediaPayload);
        media = await Media.bulkCreate(mediaPayload);
      } else if (req.body.mediaIds) {
        if (req.body.thumbnailId) {
          thumbnailMedia = req.body.mediaIds.unshift(req.body.thumbnailId);
        }
        media = req.body.mediaIds;
      }
      if (!req.body.numberOfTickets) req.body.isAvialable = false;
      else if (req.body.numberOfTickets <= 0) req.body.isAvialable = false;
      else req.body.isAvialable = true;
      const mediaTrailer = await findByKey(Media, { url: req.body.trailer });
      // return console.log(mediaTrailer);
      const movie = await addEntity(Movie, { ...req.body, userId: id });
      const movieCinemaPayload = cinemaIds.map((item) => ({ movieId: movie.id, cinemaId: Number(item) }));
      await MovieCinema.bulkCreate(movieCinemaPayload);
      const movieGenrePayload = genreIds.map((item) => ({ movieId: movie.id, genreId: Number(item) }));
      await MovieGenre.bulkCreate(movieGenrePayload);
      const mediaMoviePayload = media.map((item) => ({ mediaId: Number(item), movieId: movie.id }));
      if (mediaTrailer) mediaMoviePayload.unshift({ mediaId: mediaTrailer.id, movieId: movie.id });
      const mediaMovie = await MovieMedia.bulkCreate(mediaMoviePayload);
      if (movie && mediaMovie) {
        if (postBody) {
          const post = await addEntity(Post, { ...postBody, userId: id, movieId: movie.id });
          const mediaPostPayload = media.map((item) => ({ mediaId: Number(item), postId: post.id }));
          if (mediaTrailer) mediaPostPayload.unshift({ mediaId: mediaTrailer.id, postId: post.id });
          await PostMedia.bulkCreate(mediaPostPayload);
          await updateByKey(Movie, { postId: post.id }, { id: movie.id });
        }
      }
      return successResponse(res, {
        message: 'Post Added Successfully', movie, media, mediaMovie
      });
    } catch (error) {
      console.error(error);
      errorResponse(res, { code: 500, message: error });
    }
  },

  /**
   * add genres
   * @async
   * @param {object} req
   * @param {object} res
   * @returns {JSON} a JSON response with user details and Token
   * @memberof MovieController
   */
  async addGenre(req, res) {
    try {
      const genres = await Genre.bulkCreate(req.body.genres);
      return successResponse(res, { message: 'Genres Added Successfully', genres });
    } catch (error) {
      errorResponse(res, { code: 500, message: error });
    }
  },

  /**
   * update genres
   * @async
   * @param {object} req
   * @param {object} res
   * @returns {JSON} a JSON response with user details and Token
   * @memberof MovieController
   */
  async updateGenre(req, res) {
    try {
      const { id } = req.query;
      let genre = await findByKey(Genre, { id });
      if (!genre) return errorResponse(res, { code: 404, message: 'Genre does not exist' });
      genre = await updateByKey(Genre, { name: req.body.name }, { id });
      return successResponse(res, { message: 'Genres Updated Successfully', genre });
    } catch (error) {
      errorResponse(res, { code: 500, message: error });
    }
  },

  /**
   * delete genres
   * @async
   * @param {object} req
   * @param {object} res
   * @returns {JSON} a JSON response with user details and Token
   * @memberof MovieController
   */
  async deleteGenre(req, res) {
    try {
      const { id } = req.query;
      const genre = await findByKey(Genre, { id });
      if (!genre) return errorResponse(res, { code: 404, message: 'Genre does not exist' });
      await deleteByKey(Genre, { id });
      return successResponse(res, { message: 'Genres Deleted Successfully' });
    } catch (error) {
      console.error(error);
      errorResponse(res, { code: 500, message: error });
    }
  },

  /**
   * get all genres
   * @async
   * @param {object} req
   * @param {object} res
   * @returns {JSON} a JSON response with user details and Token
   * @memberof MovieController
   */
  async getGenres(req, res) {
    try {
      const genres = await allEntities(Genre);
      return successResponse(res, { message: 'Genres Gotten Successfully', genres });
    } catch (error) {
      errorResponse(res, { code: 500, message: error });
    }
  },

  /**
   * delete a movie and a post
   * @async
   * @param {object} req
   * @param {object} res
   * @returns {JSON} a JSON response with user details and Token
   * @memberof MovieController
   */
  async deleteMovie(req, res) {
    try {
      const { movie } = req;
      const { postId, id } = movie;
      let medias = await findMultipleByKey(MovieMedia, { movieId: movie.id });
      if (medias.length > 0) {
        medias = medias.map(({ mediaId }) => mediaId);
        await deleteByKey(Media, { id: medias });
        await deleteByKey(MovieMedia, { mediaId: medias });
      }
      if (postId !== null) await deleteByKey(Post, { id: postId });
      await deleteByKey(Movie, { id });
      return successResponse(res, { message: 'Movie Updated Successfully' });
    } catch (error) {
      errorResponse(res, { code: 500, message: error });
    }
  },

  /**
   * update a movie and a post
   * @async
   * @param {object} req
   * @param {object} res
   * @returns {JSON} a JSON response with user details and Token
   * @memberof MovieController
   */
  async updateMovie(req, res) {
    try {
      const { movie } = req;
      const moviee = await updateByKey(Movie, { ...req.body }, { id: movie.id });
      return successResponse(res, { message: 'Movie updated Successfully', moviee });
    } catch (error) {
      errorResponse(res, { code: 500, message: error });
    }
  },

  /**
   * get a movie and a post
   * @async
   * @param {object} req
   * @param {object} res
   * @returns {JSON} a JSON response with user details and Token
   * @memberof MovieController
   */
  async getMovie(req, res) {
    try {
      let movieData;
      const { id, privacyId } = req.query;
      if (id) movieData = await getMovieByKey({ id });
      else if (privacyId) movieData = await getMovieByKey({ privacyId });
      else movieData = await getMovieByKey({});
      return successResponse(res, { message: 'Post Gotten Successfully', movieData });
    } catch (error) {
      errorResponse(res, { code: 500, message: error });
    }
  },
};

export default MovieController;
