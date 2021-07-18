import { GeneralService } from '../services';
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
  rowCountByKey,
  allEntities
} = GeneralService;
const {
  uploadAllImages,
  uploadAllVideos
} = Helpers;
// const {
//   getUserProfile
// } = UserService;
const {
  PostMedia,
  MovieMedia,
  Movie,
  Post,
  Media,
  MovieCinema
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
      let mediaPayload;
      let media;
      const { id } = req.tokenData;
      const postBody = req.body.post;
      const { cinemaIds } = req.body;
      delete req.body.post;
      if (req.files.length) {
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
      }
      const movie = await addEntity(Movie, { ...req.body, userId: id });
      const movieCinemaPayload = cinemaIds.map((item) => ({ movieId: movie.id, cinemaId: item }));
      await MovieCinema.bulkCreate(movieCinemaPayload);
      const mediaMoviePayload = media.map((item) => ({ mediaId: item.id, movieId: movie.id }));
      const mediaMovie = await MovieMedia.bulkCreate(mediaMoviePayload);
      if (movie && mediaMovie) {
        const post = await addEntity(Post, { ...postBody, userId: id, movieId: movie.id });
        const mediaPostPayload = media.map((item) => ({ mediaId: item.id, postId: post.id }));
        await PostMedia.bulkCreate(mediaPostPayload);
        await updateByKey(Movie, { postId: post.id }, { id: movie.id });
      }
      return successResponse(res, {
        message: 'Post Added Successfully', movie, media, mediaMovie
      });
    } catch (error) {
      errorResponse(res, { code: 500, message: error });
    }
  },

  /**
   * delet a movie and a post
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
      if (postId !== null) await deleteByKey(Post, { id: postId });
      await deleteByKey(Movie, { id });
      return successResponse(res, { message: 'Movie Added Successfully' });
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
      const moviee = await updateByKey({ ...req.body }, { id: movie.id });
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
  async getgovie(req, res) {
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
