/* eslint-disable import/extensions */
import { Router } from 'express';
import { Bouncers, MovieMiddleware } from '../middlewares';
import { MovieController } from '../controller';

const router = Router();
const {
  userBouncers,
  adminBouncers
} = Bouncers;
const {
  verifyMoviePayload,
  verifyMovie
} = MovieMiddleware;
const {
  addMovie
} = MovieController;

router.post('/', userBouncers, verifyMoviePayload, addMovie);
router.patch('/', userBouncers, verifyMovie, addMovie);

export default router;
