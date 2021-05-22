import FileUpload from './fileUpload';

const {
  uploadVideo,
  uploadImages
} = FileUpload;

require('../config/cloudinaryConfig');

const Helpers = {
  /**
   * upload images by recursion
   * @param {array} imagePayload - array of images to be uploaded
   * @param {array} urls - array of images to be uploaded
   * @returns {array} urls - array of images urls uploaded
   * @memberof Toolbox
   */
  async uploadAllImages(imagePayload, urls = []) {
    if (!imagePayload.length) return urls;
    let image = imagePayload[0];
    image = await uploadImages(image, '', image.originalname, 'post_pictures');
    urls.push(image);
    return Helpers.uploadAllImages(imagePayload.slice(1), urls);
  },

  /**
   * upload video by recursion
   * @param {array} videoPayload - array of images to be uploaded
   * @param {array} urls - array of images to be uploaded
   * @returns {array} urls - array of images urls uploaded
   * @memberof Toolbox
   */
  async uploadAllVideos(videoPayload, urls = []) {
    if (videoPayload.length <= 0) return urls;
    let video = videoPayload[0];
    video = await uploadVideo(video, '', video.originalname, 'post_videos');
    urls.push(video);
    return Helpers.uploadAllImages(videoPayload.slice(1), urls);
  }

};
export default Helpers;
