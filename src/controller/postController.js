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
  deleteByKey
} = GeneralService;
const {
  getPostByKey
} = PostService;
const {
  Post,
  Media,
  PostMedia
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
      let mediaPayload;
      let media;
      const { id } = req.tokenData;
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
      const post = await addEntity(Post, { ...req.body, userId: id });
      const mediaPostPayload = media.map((item) => ({ mediaId: item.id, postId: post.id }));
      const mediaPost = await PostMedia.bulkCreate(mediaPostPayload);
      return successResponse(res, {
        message: 'Post Added Successfully', post, media, mediaPost
      });
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
      if (id) [postData] = await getPostByKey({ id: req.query.id });
      else if (isPublished) postData = await getPostByKey({ isPublished });
      else postData = await getPostByKey({});
      return successResponse(res, { message: 'Post Gotten Successfully', postData });
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
};

export default PostController;
