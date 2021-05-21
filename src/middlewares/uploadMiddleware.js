import multer from 'multer';
import { ApiError } from '../utils';

const upload = multer({
  limits: {
    fileSize: 100000000
  },

  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(jpg|jpeg|png|svg|PNG|JFIF|jfif|SVG|JPEG|mp4|MP4)$/)) {
      throw new ApiError(400, 'File is not a valid');
    }

    cb(undefined, true);
  }
});

export default upload;
