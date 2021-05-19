/* eslint-disable import/extensions */
import { Router } from 'express';
import { Bouncers, UserMiddleware } from '../middlewares';
import { UserController } from '../controller';

const router = Router();
const {
  userBouncers
} = Bouncers;
// const {
//   verifyUserAndFollower
// } = UserMiddleware;
// const {
//   followOrUnFollowUser,
//   getProfile,
//   checkFollowing,
//   checkFollower,
//   listFollowers
// } = UserController;

router.post('/', userBouncers); // ?userId=[]&followerId=[]


export default router;
