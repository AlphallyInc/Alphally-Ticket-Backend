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
  addMovie,
  deleteMovie,
  updateMovie,
  getMovie,
  addGenre,
  updateGenre,
  deleteGenre,
  getGenres
} = MovieController;

router.post('/', userBouncers, verifyMoviePayload, addMovie);
router.patch('/', userBouncers, verifyMovie, updateMovie);
router.delete('/', userBouncers, verifyMovie, deleteMovie);
router.get('/', userBouncers, verifyMovie, getMovie);
router.post('/', adminBouncers, addGenre);
router.patch('/', adminBouncers, updateGenre);
router.patch('/', adminBouncers, deleteGenre);
router.patch('/', userBouncers, getGenres);

export default router;
