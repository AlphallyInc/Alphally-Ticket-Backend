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
  followOrUnFollowUser
} = UserController;

router.post('/follow-or-unfollow', userBouncers, verifyUserAndFollower, followOrUnFollowUser); // ?userId=[]&followerId=[]

export default router;
