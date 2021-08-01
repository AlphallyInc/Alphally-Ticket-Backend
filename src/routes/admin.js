/* eslint-disable import/extensions */
import { Router } from 'express';
import { Bouncers, AdminMiddleware } from '../middlewares';
import { AdminController } from '../controller';

const router = Router();
const {
  adminBouncers,
  userBouncers
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
  updateCinemaName,
  deleteCinema,
  getAllCinema,
  updateSingleDetails,
  addSingleAddressToCinema
} = AdminController;

// Privacy routes
router.post('/privacy/all', adminBouncers, addPrivacyAll);
router.post('/privacy/single', adminBouncers, verifyPrivacy, addPrivacy);
router.delete('/privacy', adminBouncers, deletePrivacy);

// dont forget to add admin bouncers for cinema routes
router.post('/cinema', adminBouncers, verifyCinemaPayload, addCinema);
router.patch('/cinema', adminBouncers, verifyCinema, updateAllCinemaDetails); // id=[]
router.patch('/cinema/name', adminBouncers, verifyCinema, updateCinemaName); // id=[]
router.delete('/cinema', adminBouncers, verifyCinema, deleteCinema); // id=[]
router.get('/cinema', userBouncers, verifyCinema, getAllCinema); // id=[]
router.patch('/cinema/single', adminBouncers, verifyCinema, updateSingleDetails); // id=[]&cinenmaAdressId
router.post('/cinema/single', adminBouncers, verifyCinema, addSingleAddressToCinema); // id=[]

export default router;
