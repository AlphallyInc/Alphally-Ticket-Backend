import { GeneralValidation } from '../validation';
import { Toolbox } from '../utils';
import { GeneralService } from '../services';
import database from '../models';

const {
  errorResponse,
} = Toolbox;
const {
  validateId
} = GeneralValidation;
const {
  findByKey
} = GeneralService;
const {
  User,
  Movie,
  Comment,
  Post
} = database;

const UserMiddleware = {
  /**
   * middleware validating userId and followerId
   * @async
   * @param {object} req - the api request
   * @param {object} res - api response returned by method
   * @param {object} next - returned values going into next function
   * @returns {object} - returns error or response object
   * @memberof UserMiddleware
   */
  async verifyUserAndFollower(req, res, next) {
    try {
      const { followerId } = req.query;
      if (followerId) {
        validateId({ id: followerId });
        if (req.tokenData.id === Number(followerId)) return errorResponse(res, { code: 409, message: 'You cannot follow yourself' });
        const follower = await findByKey(User, { id: followerId });
        if (!follower) return errorResponse(res, { code: 409, message: 'Follower does not exist' });
        req.follower = follower;
      }
      next();
    } catch (error) {
      errorResponse(res, { code: 400, message: error });
    }
  },

  /**
   * middleware validating user activity
   * @async
   * @param {object} req - the api request
   * @param {object} res - api response returned by method
   * @param {object} next - returned values going into next function
   * @returns {object} - returns error or response object
   * @memberof UserMiddleware
   */
  async verifyUserActivity(req, res, next) {
    try {
      const {
        followerId, postId, commentId, movieId, eventId, likeId
      } = req.query;
      if (followerId) {
        validateId({ id: followerId });
        const follower = await findByKey(User, { id: followerId });
        if (!follower) return errorResponse(res, { code: 409, message: 'Follower does not exist' });
      }
      if (postId) {
        validateId({ id: postId });
        const post = await findByKey(Post, { id: postId });
        if (!post) return errorResponse(res, { code: 409, message: 'Post does not exist' });
      }
      if (commentId) {
        validateId({ id: commentId });
        const comment = await findByKey(Comment, { id: commentId });
        if (!comment) return errorResponse(res, { code: 409, message: 'Comment does not exist' });
      }
      if (movieId) {
        validateId({ id: movieId });
        const movie = await findByKey(Movie, { id: movieId });
        if (!movie) return errorResponse(res, { code: 409, message: 'Movie does not exist' });
      }
      if (eventId) {
        validateId({ id: eventId });
        const event = await findByKey(User, { id: eventId });
        if (!event) return errorResponse(res, { code: 409, message: 'Event does not exist' });
      }
      if (likeId) {
        validateId({ id: likeId });
        const like = await findByKey(User, { id: likeId });
        if (!like) return errorResponse(res, { code: 409, message: 'Like does not exist' });
      }
      next();
    } catch (error) {
      errorResponse(res, { code: 400, message: error });
    }
  },
};

export default UserMiddleware;
