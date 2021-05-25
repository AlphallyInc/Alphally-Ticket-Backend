import database from '../models';

const {
  Post,
  User,
  Like,
  Media,
  Comment,
  PostSeen,
  PostMedia
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
            as: 'author',
            attributes: ['id', 'name', 'username', 'imageUrl'],
          },
          {
            model: Like,
            as: 'likes',
            attributes: ['id']
          },
          {
            model: PostSeen,
            as: 'seen',
            attributes: ['id']
          },
          {
            model: Comment,
            as: 'comments',
            attributes: ['id', 'comment'],
            where: {}
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
  async getCommentsByKey(key) {
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
                model: Comment,
                as: 'replyComments',
                attributes: ['id', 'comment'],
                include: [
                  {
                    model: User,
                    as: 'commenter',
                    attributes: ['id', 'name', 'username', 'imageUrl'],
                  }
                ]
              },
            ]
          },

        ],
        where: { id: key.postId },
        order: [
          ['id', 'DESC']
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
  }
};

export default PostService;
