import { GeneralService } from '../services';
import { Toolbox } from '../utils';
import database from '../models';

const {
  successResponse,
  errorResponse,
} = Toolbox;
const {
  addEntity,
  findByKey,
  deleteByKey,
  rowCountByKey,
  allEntities
} = GeneralService;
// const {
//   getUserProfile
// } = UserService;
const {
  User,
  Follower,
  Movie,
  Media,
} = database;

const MovieController = {
  /**
   * follow and follow user
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
};

export default MovieController;
