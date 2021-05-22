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
  verifyPost,
  verifyPostID
} = PostMiddleware;
const {
  addPost,
  deletePost,
  getPost
} = PostController;

router.post('/', userBouncers, upload.array('media'), verifyPost, addPost);
router.delete('/', userBouncers, verifyPostID, deletePost); // ?id=[]
router.get('/', userBouncers, verifyPostID, getPost); // ?id=[]&isPublished=[]

export default router;
