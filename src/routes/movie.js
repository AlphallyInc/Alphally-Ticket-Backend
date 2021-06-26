/* eslint-disable import/extensions */
import { Router } from 'express';
import { Bouncers, MovieMiddleware } from '../middlewares';
import { AdminController } from '../controller';

const router = Router();
const {
  userBouncers,
  adminBouncers
} = Bouncers;
const {
  verifyMoviePayload
} = MovieMiddleware;
// const {
//   addPrivacyAll,
//   addPrivacy,
//   deletePrivacy,
// } = AdminController;

router.post('/', userBouncers, verifyMoviePayload);

export default router;
