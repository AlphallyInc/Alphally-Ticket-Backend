/* eslint-disable camelcase */
import cloudinary from 'cloudinary';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import Datauri from 'datauri/parser';

require('../config/cloudinaryConfig');

const FileUpload = {
  /**
   * upload an image
   * @param {object} file - uploaded file
   * @param {object} public_id - public_id of image
   * @param {object} fileName - name of image
   * @param {object} folder - folder where the image will be stored
   * @returns {Promise<string>} - Returns url of the uploaded image
   * @memberof FileUpload
   */
  async uploadImages(file, public_id = '', fileName, folder) {
    try {
      const duri = new Datauri();
      const dataUri = duri.format(path.basename(file.originalname || fileName), file.buffer);
      const { content } = dataUri;
      const result = await cloudinary.v2.uploader.upload(content,
        {
          timeout: 60000,
          width: 150,
          height: 150,
          crop: 'scale',
          public_id: public_id !== '' ? `${folder}/${public_id}` : `${folder}/${uuidv4()}`,
        });
      return { url: result.secure_url, fileName };
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
    }
  },

  /**
   * upload an video
  * @param {object} file - uploaded file
   * @param {object} public_id - public_id of image
   * @param {object} fileName - name of image
   * @param {object} folder - folder where the image will be stored
   * @returns {Promise<string>} - Returns url of the uploaded image
   * @memberof FileUpload
  */
  async uploadVideo(file, public_id = '', fileName, folder) {
    const duri = new Datauri();
    const dataUri = duri.format(path.extname(file.originalname).toString(), file.buffer);
    const { content } = dataUri;
    const result = await cloudinary.v2.uploader.upload(content, {
      public_id: public_id !== '' ? `${folder}/${public_id}` : `${folder}/${uuidv4()}`,
      resource_type: 'video'
    });
    return { url: result.secure_url, fileName };
  },

  /**
   * upload an image
   * @param {object} file_name - uploaded file
   * @param {object} buffer - uploaded file
   * @param {object} public_id - public_id of image
   * @returns {Promise<string>} - Returns url of the uploaded image
   * @memberof FileUpload
   */
  async uploadAFile(file_name, buffer, public_id = '') {
    const duri = new Datauri();
    const dataUri = duri.format(path.extname(file_name).toString(), buffer);
    const { content } = dataUri;
    const result = await cloudinary.v2.uploader.upload(content, {
      public_id:

          public_id !== '' ? `join_task/${public_id}`
            : `join_task/${uuidv4()}`,
      resource_type: 'auto'
    });
    return result.secure_url;
  }
};
export default FileUpload;
