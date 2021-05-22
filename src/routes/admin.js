/* eslint-disable import/extensions */
import { Router } from 'express';
import { Bouncers, AdminMiddleware } from '../middlewares';
import { AdminController } from '../controller';

const router = Router();
const {
  adminBouncers,
} = Bouncers;
const {
  verifyPrivacy
} = AdminMiddleware;
const {
  addPrivacyAll,
  addPrivacy,
  deletePrivacy,
} = AdminController;

router.post('/privacy/all', adminBouncers, addPrivacyAll);
router.post('/privacy/single', adminBouncers, verifyPrivacy, addPrivacy);
router.delete('/privacy', adminBouncers, deletePrivacy);

export default router;
