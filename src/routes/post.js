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
  verifyPostID,
  verifyComment
} = PostMiddleware;
const {
  addPost,
  deletePost,
  getPost,
  addPostComment,
  deleteComment,
  likeOrUnlikePost,
  getLikeList,
  getSeenPost
} = PostController;

router.post('/', userBouncers, upload.array('media'), verifyPost, addPost);
router.delete('/', userBouncers, verifyPostID, deletePost); // ?id=[]
router.get('/', userBouncers, verifyPostID, getPost); // ?id=[]&isPublished=[]
router.post('/comment', userBouncers, verifyPostID, addPostComment); // postId=[]
router.delete('/comment', userBouncers, verifyComment, deleteComment); // postId=[]
router.post('/like', userBouncers, likeOrUnlikePost); // ?postId=[]
router.get('/like', userBouncers, getLikeList); // ?postId=[]
router.get('/seen', userBouncers, getSeenPost); // ?postId=[]

export default router;
