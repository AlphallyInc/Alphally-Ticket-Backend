import { GeneralService } from '../services';
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
  findByKey,
  deleteByKey
} = GeneralService;
const {
  Post,
  Media,
  MediaPost
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
      const { id } = req.tokenData;
      if (req.files.length) {
        let mediaPayload = req.files.map((item) => ({
          type: item.mimetype.split('/')[0],
          fileExtension: item.mimetype.split('/')[1],
          userId: id,
          fileName: item.originalName
        }));

        const imagePayload = req.files.filter((item) => item.mimetype.split('/')[0].toLowerCase() === 'image');
        const videoPayload = req.files.filter((item) => item.mimetype.split('/')[0].toLowerCase() === 'video');

        if (imagePayload.length > 0) {
          const imageUrls = await uploadAllImages(imagePayload);
          mediaPayload = mergeImageVideoUrls(mediaPayload, imageUrls);
        }
        console.log(`I am a media ${mediaPayload}`);
        if (videoPayload.length > 0) {
          const videoUrls = await uploadAllVideos(videoPayload);
          mediaPayload = mergeImageVideoUrls(mediaPayload, videoUrls);
        }

        return console.log(`I am a media ${mediaPayload}`);
      }
      // console.log(imagePayload, videoPayload);
      // const privacy = await Privacy.bulkCreate(req.body);
      // return successResponse(res, { message: 'Privacy Added Successfully', privacy });
    } catch (error) {
      console.error(error);
      errorResponse(res, { code: 500, message: error });
    }
  },
};

export default PostController;
