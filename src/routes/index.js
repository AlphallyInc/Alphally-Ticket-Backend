import { Router } from 'express';
import authRoutes from './auth';
import userRoutes from './user';
import postRoutes from './post';
import adminRoutes from './admin';
import movieRoutes from './movie';

const router = Router();
router.use('/auth', authRoutes);
router.use('/user', userRoutes);
router.use('/post', postRoutes);
router.use('/admin', adminRoutes);
router.use('/movie', movieRoutes);

export default router;
