import sequelize from 'sequelize';
import { GeneralService } from '.';
import database from '../models';

const {
  findByKey
} = GeneralService;
const {
  Post,
  User,
  Like,
  Media,
  Comment,
  PostSeen,
  PostMedia,
  CommentLike,
  Movie
} = database;

const PostService = {
  /**
   * Get user posts
   * @async
   * @param {object} key - inputs like names or tags
   * @returns {promise-Object} - A promise object with entity details
   * @memberof PostService
   */
  async getPostByKey(key) {
    try {
      const entities = await Post.findAll({
        include: [
          {
            model: User,
            as: 'publisher',
            attributes: ['id', 'name', 'username', 'imageUrl'],
          },
          {
            model: Like,
            as: 'likes',
            attributes: [[sequelize.fn('count', sequelize.col('likes.id')), 'count']]
          },
          {
            model: PostSeen,
            as: 'seen',
            attributes: [[sequelize.fn('count', sequelize.col('seen.id')), 'count']]
          },
          {
            model: Comment,
            as: 'comments',
            attributes: ['id', 'comment', 'createdAt'],
            include: [
              {
                model: User,
                as: 'commenter',
                attributes: ['id', 'name', 'username', 'imageUrl'],
              },
              {
                model: CommentLike,
                as: 'likes',
                // group: ['SaleItem.itemId'],
                attributes: ['commentId', [sequelize.fn('count', sequelize.col('commentId')), 'count']],
              },
              {
                model: Comment,
                as: 'replyComments',
                attributes: ['id', 'comment']
              },
            ]
          },
          {
            model: PostMedia,
            as: 'medias',
            attributes: ['postId'],
            include: [
              {
                model: Media,
                as: 'media'
              }
            ]
          }
        ],
        where: key,
        order: [
          ['id', 'DESC']
        ],
        group: [
          'Post.id',
          'publisher.id',
          'likes.id',
          'seen.id',
          'comments.id',
          'medias.id',
          'medias->media.id',
          'comments->commenter.id',
          'comments->likes.id',
          'comments->replyComments.id'
        ],
      });
      return entities;
    } catch (error) {
      console.error(error);
      throw new Error(error);
    }
  },

  /**
   * Get comments posts
   * @async
   * @param {object} key - inputs like names or tags
   * @returns {promise-Object} - A promise object with entity details
   * @memberof PostService
   */
  async getCommentsByKey(key) {
    try {
      const entities = await Comment.findAll({
        include: [
          {
            model: User,
            as: 'commenter',
            attributes: ['id', 'name', 'username', 'imageUrl'],
          },
          {
            model: CommentLike,
            as: 'likes',
            attributes: ['id'],
          },
          {
            model: Comment,
            as: 'replyComments',
            attributes: ['id', 'comment']
          },

        ],
        where: key,
        order: [
          ['id', 'ASC']
        ],
        attributes: ['id', 'comment'],
        returning: true
      });
      return entities;
    } catch (error) {
      throw new Error(error);
    }
  },

  /**
   * Get comments posts
   * @async
   * @param {object} key - inputs like names or tags
   * @returns {promise-Object} - A promise object with entity details
   * @memberof PostService
   */
  async getPostCommentsByKey(key) {
    try {
      const entities = await Post.findAll({
        include: [
          {
            model: Comment,
            as: 'comments',
            attributes: ['id', 'comment'],
            where: { parentId: null },
            include: [
              {
                model: User,
                as: 'commenter',
                attributes: ['id', 'name', 'username', 'imageUrl'],
              },
              {
                model: CommentLike,
                as: 'likes',
                attributes: ['id'],
              },
              {
                model: Comment,
                as: 'replyComments',
                attributes: ['id'],
              },
            ]
          },

        ],
        where: key,
        order: [
          ['id', 'ASC']
        ],
        attributes: [],
        returning: true
      });
      return entities;
    } catch (error) {
      throw new Error(error);
    }
  },

  /**
   * Get user likes by post
   * @async
   * @param {object} key - inputs like names or tags
   * @returns {promise-Object} - A promise object with entity details
   * @memberof PostService
   */
  async getLikeUserByKey(key) {
    try {
      const entities = await Like.findAll({
        include: [
          {
            model: User,
            as: 'user',
            attributes: ['id', 'name'],
          },
        ],
        where: key,
        attributes: ['id'],
        returning: true
      });
      return entities;
    } catch (error) {
      throw new Error(error);
    }
  },

  /**
   * Get user likes by post
   * @async
   * @param {object} key - inputs like names or tags
   * @returns {promise-Object} - A promise object with entity details
   * @memberof PostService
   */
  async getSeenPostByKey(key) {
    try {
      const entities = await PostSeen.findAll({
        include: [
          {
            model: User,
            as: 'user',
            attributes: ['id', 'name'],
          },
        ],
        where: key,
        attributes: ['id'],
        returning: true
      });
      return entities;
    } catch (error) {
      throw new Error(error);
    }
  },

  /**
   * recursion function to check for user Like post
   * @async
   * @param {array} postData - post datas
   * @param {array} result - post datas returned with like check
   * @returns {promise-array} - A promise array of post datas
   * @memberof PostService
   */
  async checkPostLike(postData, result = []) {
    try {
      if (postData.length < 1) return result;
      let liked = false;
      const post = postData[0];
      const likePost = await findByKey(Like, { userId: post.userId, postId: post.id });
      if (likePost) liked = true;
      result.push({ ...post, liked });

      return PostService.checkPostLike(postData.slice(1), result);
    } catch (error) {
      throw new Error(error);
    }
  }
};

export default PostService;
