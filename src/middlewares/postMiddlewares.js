import { GeneralValidation } from '../validation';
import { Toolbox } from '../utils';
import { GeneralService } from '../services';
import database from '../models';

const {
  errorResponse,
} = Toolbox;
const {
  validatePost,
  validateId,
  validateComment
} = GeneralValidation;
const {
  findByKey
} = GeneralService;
const {
  Post,
  Comment
} = database;

const PostMiddleware = {
  /**
   * middleware validating post payload
   * @async
   * @param {object} req - the api request
   * @param {object} res - api response returned by method
   * @param {object} next - returned values going into next function
   * @returns {object} - returns error or response object
   * @memberof PostMiddleware
   */
  async verifyPost(req, res, next) {
    try {
      validatePost(req.body);
      next();
    } catch (error) {
      errorResponse(res, { code: 400, message: error });
    }
  },

  /**
   * middleware validating post payload
   * @async
   * @param {object} req - the api request
   * @param {object} res - api response returned by method
   * @param {object} next - returned values going into next function
   * @returns {object} - returns error or response object
   * @memberof PostMiddleware
   */
  async verifyPostID(req, res, next) {
    try {
      if (req.query.id) {
        validateId({ id: req.query.id });
        const post = await findByKey(Post, { id: req.query.id });
        if (!post) return errorResponse(res, { code: 404, message: 'Post is Not Found' });
      }
      if (req.body.postId) {
        validateId({ id: req.query.postId });
        validateComment({ ...req.body });
        const post = await findByKey(Post, { id: req.query.postId });
        if (!post) return errorResponse(res, { code: 404, message: 'Post is Not Found' });
      }
      next();
    } catch (error) {
      errorResponse(res, { code: 400, message: error });
    }
  },

  /**
   * middleware validating comment id payload
   * @async
   * @param {object} req - the api request
   * @param {object} res - api response returned by method
   * @param {object} next - returned values going into next function
   * @returns {object} - returns error or response object
   * @memberof PostMiddleware
   */
  async verifyComment(req, res, next) {
    try {
      if (req.query.id) {
        validateId({ id: req.query.id });
        const comment = await findByKey(Comment, { id: req.query.id });
        if (!comment) return errorResponse(res, { code: 404, message: 'Comment is Not Found' });
      }
      next();
    } catch (error) {
      errorResponse(res, { code: 400, message: error });
    }
  },
};

export default PostMiddleware;
