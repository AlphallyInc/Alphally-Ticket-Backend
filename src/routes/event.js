/* eslint-disable import/extensions */
import { Router } from 'express';
import { Bouncers, EventMiddleware } from '../middlewares';
import { EventController } from '../controller';

const router = Router();
const {
  userBouncers,
  adminBouncers
} = Bouncers;
const {
  validateCategoriesPayload,
  verifyMovie
} = EventMiddleware;
const {
  addMovie,
  deleteMovie,
  updateMovie,
  getMovie,
  addCategory,
  updateCategory,
  deleteCateory,
  getCategory
} = EventController;

// router.post('/', userBouncers, verifyMoviePayload, addMovie);
router.patch('/', userBouncers, verifyMovie, updateMovie);
router.delete('/', userBouncers, verifyMovie, deleteMovie);
router.get('/', userBouncers, verifyMovie, getMovie);
router.post('/category', adminBouncers, validateCategoriesPayload, addCategory);
router.patch('/category', adminBouncers, updateCategory);
router.delete('/category', adminBouncers, deleteCateory);
router.get('/categories', userBouncers, getCategory);

export default router;
