/* eslint-disable import/extensions */
import { Router } from 'express';
import { Bouncers, UserMiddleware } from '../middlewares';
import { UserController } from '../controller';

const router = Router();
const {
  userBouncers
} = Bouncers;
const {
  verifyUserAndFollower
} = UserMiddleware;
const {
  followOrUnFollowUser,
  getProfile,
  checkFollowing,
  checkFollower,
  listFollowers,
  getPrivacy,
  getProfileMedia
} = UserController;

router.post('/follow-or-unfollow', userBouncers, verifyUserAndFollower, followOrUnFollowUser); // ?userId=[]&followerId=[]
router.get('/profile', userBouncers, getProfile);
router.get('/medias', userBouncers, getProfileMedia);
router.get('/check-if-following', userBouncers, checkFollowing); // userId=[]
router.get('/check-if-follower', userBouncers, checkFollower); // userId=[]
router.get('/list-followers', userBouncers, listFollowers);
router.get('/privacy', userBouncers, getPrivacy);

export default router;
