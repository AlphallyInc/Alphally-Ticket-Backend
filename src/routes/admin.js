/* eslint-disable import/extensions */
import { Router } from 'express';
import { Bouncers, AdminMiddleware } from '../middlewares';
import { AdminController } from '../controller';

const router = Router();
const {
  adminBouncers,
} = Bouncers;
const {
  verifyPrivacy,
  verifyCinemaPayload
} = AdminMiddleware;
const {
  addPrivacyAll,
  addPrivacy,
  deletePrivacy,
  addCinema
} = AdminController;

router.post('/privacy/all', adminBouncers, addPrivacyAll);
router.post('/privacy/single', adminBouncers, verifyPrivacy, addPrivacy);
router.delete('/privacy', adminBouncers, deletePrivacy);
router.post('/cinema', adminBouncers, verifyCinemaPayload, addCinema);

export default router;
