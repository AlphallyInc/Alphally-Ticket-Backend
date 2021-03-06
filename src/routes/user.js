/* eslint-disable import/extensions */
import { Router } from 'express';
import { Bouncers, UserMiddleware } from '../middlewares';
import { UserController } from '../controller';

const router = Router();
const {
  userBouncers
} = Bouncers;
const {
  verifyUserAndFollower,
  verifyUserActivity
} = UserMiddleware;
const {
  followOrUnFollowUser,
  getProfile,
  checkFollowing,
  checkFollower,
  listFollowers,
  getPrivacy,
  getProfileMedia,
  getActivities
} = UserController;

router.post('/follow-or-unfollow', userBouncers, verifyUserAndFollower, followOrUnFollowUser); // ?userId=[]&followerId=[]
router.get('/profile', userBouncers, getProfile); // id=[]
router.get('/medias', userBouncers, getProfileMedia);
router.get('/check-if-following', userBouncers, checkFollowing); // userId=[]
router.get('/check-if-follower', userBouncers, checkFollower); // userId=[]
router.get('/list-followers', userBouncers, listFollowers);
router.get('/privacy', userBouncers, getPrivacy);
router.get('/activity', userBouncers, verifyUserActivity, getActivities); // eventId=[] | postId=[] | movieId=[] | followerId=[] | commentId=[] | likeId=[]

export default router;
