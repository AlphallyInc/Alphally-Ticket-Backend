/* eslint-disable import/extensions */
import { Router } from 'express';
import { Bouncers, PostMiddleware } from '../middlewares';
import { PostController } from '../controller';
import upload from '../middlewares/uploadMiddleware';

const router = Router();
const {
  userBouncers
} = Bouncers;
const {
  verifyPost
} = PostMiddleware;
const {
  addPost
} = PostController;

router.post('/', userBouncers, upload.array('media'), verifyPost, addPost);

export default router;
