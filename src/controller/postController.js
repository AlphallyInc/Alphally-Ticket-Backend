/* eslint-disable max-len */
import { GeneralService, PostService } from '../services';
import { Toolbox, Helpers } from '../utils';
import database from '../models';

const {
  successResponse,
  errorResponse,
  mergeImageVideoUrls
} = Toolbox;
const {
  uploadAllImages,
  uploadAllVideos
} = Helpers;
const {
  addEntity,
  deleteByKey,
  findByKey
} = GeneralService;
const {
  getPostByKey,
  getLikeUserByKey,
  getSeenPostByKey,
  getCommentsByKey,
  getPostCommentsByKey
} = PostService;
const {
  Post,
  Like,
  Media,
  Comment,
  PostSeen,
  PostMedia,
  CommentLike
} = database;

const PostController = {
  /**
   * all group privacy accounts
   * @async
   * @param {object} req
   * @param {object} res
   * @returns {JSON} a JSON response with user details and Token
   * @memberof PostController
   */
  async addPost(req, res) {
    try {
      let mediaPayload = [];
      let media;
      let post;
      let mediaPostPayload;
      let mediaPost;
      const { id } = req.tokenData;
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
        post = await addEntity(Post, { ...req.body, userId: id });
        mediaPostPayload = media.map((item) => ({ mediaId: item.id, postId: post.id }));
        mediaPost = await PostMedia.bulkCreate(mediaPostPayload);
      } else {
        post = await addEntity(Post, { ...req.body, userId: id });
        if (req.body.mediaId) {
          if (req.body.thumbnailId) mediaPayload.push({ mediaId: req.body.thumbnailId, postId: post.id });
          mediaPostPayload = req.body.mediaId.map((item) => ({ mediaId: item, postId: post.id }));
          mediaPostPayload = mediaPayload.concat(mediaPostPayload);
          mediaPost = await PostMedia.bulkCreate(mediaPostPayload);
        }
      }
      return successResponse(res, {
        message: 'Post Added Successfully', post, media, mediaPost
      });
    } catch (error) {
      errorResponse(res, { code: 500, message: error });
    }
  },

  /**
   * all media
   * @async
   * @param {object} req
   * @param {object} res
   * @returns {JSON} a JSON response with user details and Token
   * @memberof PostController
   */
  async addMedia(req, res) {
    try {
      let mediaPayload;
      let media;
      const { id } = req.tokenData;
      if (req.files.length) {
        let imageMediaPayload = [];
        let videoMediaPayload = [];
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
        // console.log(media);
      }
      return successResponse(res, { message: 'Media Added Successfully', media });
    } catch (error) {
      errorResponse(res, { code: 500, message: error });
    }
  },

  /**
   * get posts
   * @async
   * @param {object} req
   * @param {object} res
   * @returns {JSON} a JSON response with user details and Token
   * @memberof PostController
   */
  async getPost(req, res) {
    try {
      let postData;
      const { id, isPublished } = req.query;
      if (id) {
        postData = await getPostByKey({ id: req.query.id });
        const seeenpost = await findByKey(PostSeen, { postId: req.query.id, userId: req.tokenData.id });
        if (!seeenpost) { await addEntity(PostSeen, { postId: req.query.id, userId: req.tokenData.id }); }
      } else if (isPublished) postData = await getPostByKey({ isPublished });
      else postData = await getPostByKey({});
      // eslint-disable-next-line max-len
      postData = await postData.map((item) => ({
        ...item.dataValues,
        likes: item.dataValues.likes.length,
        seen: item.dataValues.seen.length,
        comments: item.dataValues.comments.length
      }));
      return successResponse(res, { message: 'Post Gotten Successfully', postData });
    } catch (error) {
      errorResponse(res, { code: 500, message: error });
    }
  },

  /**
   * get posts
   * @async
   * @param {object} req
   * @param {object} res
   * @returns {JSON} a JSON response with user details and Token
   * @memberof PostController
   */
  async getLikeList(req, res) {
    try {
      const { postId } = req.query;
      let likeData = await getLikeUserByKey({ postId });
      if (likeData.length > 0) likeData = likeData.map((item) => ({ name: item.user.name }));
      return successResponse(res, { likeData });
    } catch (error) {
      errorResponse(res, { code: 500, message: error });
    }
  },

  /**
   * get posts
   * @async
   * @param {object} req
   * @param {object} res
   * @returns {JSON} a JSON response with user details and Token
   * @memberof PostController
   */
  async getSeenPost(req, res) {
    try {
      const { postId } = req.query;
      let seenData = await getSeenPostByKey({ postId });
      if (seenData.length > 0) seenData = seenData.map((item) => ({ name: item.user.name }));
      return successResponse(res, { seenData });
    } catch (error) {
      errorResponse(res, { code: 500, message: error });
    }
  },

  /**
   * get comments
   * @async
   * @param {object} req
   * @param {object} res
   * @returns {JSON} a JSON response with user details and Token
   * @memberof PostController
   */
  async getComments(req, res) {
    try {
      let commentData;
      if (req.query.postId) {
        const datas = await getPostCommentsByKey({ id: req.query.postId });
        commentData = datas[0].comments;
      }
      if (req.query.commentId) {
        const datas = await getCommentsByKey({ id: req.query.commentId });
        commentData = datas;
      }
      if (commentData.length > 0) {
        commentData = commentData.map((item) => ({
          ...item.dataValues,
          replyComments: item.dataValues.replyComments.length,
          likes: item.dataValues.likes.length,
        }));
      }
      return successResponse(res, { commentData });
    } catch (error) {
      errorResponse(res, { code: 500, message: error });
    }
  },

  /**
   * delete a single privacy account
   * @async
   * @param {object} req
   * @param {object} res
   * @returns {JSON} a JSON response with user details and Token
   * @memberof PostController
   */
  async deletePost(req, res) {
    try {
      await deleteByKey(Post, { id: req.query.id });
      return successResponse(res, { message: 'Post Deleted Successfully' });
    } catch (error) {
      errorResponse(res, { code: 500, message: error });
    }
  },

  /**
   * delete a single post comment
   * @async
   * @param {object} req
   * @param {object} res
   * @returns {JSON} a JSON response with user details and Token
   * @memberof PostController
   */
  async deleteComment(req, res) {
    try {
      await deleteByKey(Comment, { id: req.query.id });
      return successResponse(res, { message: 'Comment Deleted Successfully' });
    } catch (error) {
      errorResponse(res, { code: 500, message: error });
    }
  },

  /**
   * comment on a single post
   * @async
   * @param {object} req
   * @param {object} res
   * @returns {JSON} a JSON response with user details and Token
   * @memberof PostController
   */
  async addPostComment(req, res) {
    try {
      const { id } = req.tokenData;
      const { postId } = req.query;
      const comment = await addEntity(Comment, { ...req.body, postId, userId: id });
      return successResponse(res, { message: 'Comment Added Successfully', comment });
    } catch (error) {
      errorResponse(res, { code: 500, message: error });
    }
  },

  /**
   * like or unlike post
   * @async
   * @param {object} req
   * @param {object} res
   * @returns {JSON} a JSON response with user details and Token
   * @memberof PostController
   */
  async likeOrUnlikePost(req, res) {
    try {
      let like;
      // let like;
      const { postId } = req.query;
      const { id } = req.tokenData;
      like = await findByKey(Like, { userId: id, postId });
      if (like) {
        like = await deleteByKey(Like, { userId: id, postId });
        like = false;
      } else {
        like = await addEntity(Like, { userId: id, postId });
        like = true;
      }
      return successResponse(res, {
        message: like ? 'You Like A Post' : 'You Unliked A Post',
        like
      });
    } catch (error) {
      errorResponse(res, { code: 500, message: error });
    }
  },

  /**
   * like or unlike post comment
   * @async
   * @param {object} req
   * @param {object} res
   * @returns {JSON} a JSON response with user details and Token
   * @memberof PostController
   */
  async likeOrUnlikeComment(req, res) {
    try {
      let like;
      // let like;
      const { commentId } = req.query;
      const { id } = req.tokenData;
      like = await findByKey(CommentLike, { userId: id, commentId });
      if (like) {
        like = await deleteByKey(CommentLike, { userId: id, commentId });
        like = false;
      } else {
        like = await addEntity(CommentLike, { userId: id, commentId });
        like = true;
      }
      return successResponse(res, {
        message: like ? 'You Like A Comment' : 'You Unliked A Comment',
        like
      });
    } catch (error) {
      errorResponse(res, { code: 500, message: error });
    }
  },
};

export default PostController;
