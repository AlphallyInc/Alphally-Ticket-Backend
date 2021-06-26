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
  verifyCinemaPayload,
  verifyCinema
} = AdminMiddleware;
const {
  addPrivacyAll,
  addPrivacy,
  deletePrivacy,
  addCinema,
  updateAllCinemaDetails,
  deleteCinema,
  getAllCinema
} = AdminController;

// Privacy routes
router.post('/privacy/all', adminBouncers, addPrivacyAll);
router.post('/privacy/single', adminBouncers, verifyPrivacy, addPrivacy);
router.delete('/privacy', adminBouncers, deletePrivacy);

// dont forget to add admin bouncers for cinema routes
router.post('/cinema', adminBouncers, verifyCinemaPayload, addCinema);
router.patch('/cinema', verifyCinema, updateAllCinemaDetails); // id=[]
router.delete('/cinema', verifyCinema, deleteCinema); // id=[]
router.get('/cinema', verifyCinema, getAllCinema); // id=[]

export default router;
