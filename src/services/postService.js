import database from '../models';

const {
  Post,
  User,
  Like,
  Media,
  Comment,
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
            model: Comment,
            as: 'comments',
            attributes: ['id', 'comment'],
            where: { parentId: null },
            include: [
              {
                model: User,
                as: 'commenter',
                attributes: ['id', 'name', 'username', 'imageUrl']
              },
              {
                model: Comment,
                as: 'replyComments',
                attributes: ['id', 'comment'],
                include: [
                  {
                    model: User,
                    as: 'commenter',
                    attributes: ['id', 'name', 'username', 'imageUrl']
                  }
                ]
              },
            ],
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
  }
};

export default PostService;
