import { Router } from 'express';
import authRoutes from './auth';
import userRoutes from './user';
import postRoutes from './post';
import adminRoutes from './admin';
import movieRoutes from './movie';
import eventRoutes from './event';
import ticketRoutes from './tickets';

const router = Router();
router.use('/auth', authRoutes);
router.use('/user', userRoutes);
router.use('/post', postRoutes);
router.use('/admin', adminRoutes);
router.use('/movie', movieRoutes);
router.use('/event', eventRoutes);
router.use('/ticket', ticketRoutes);

export default router;
