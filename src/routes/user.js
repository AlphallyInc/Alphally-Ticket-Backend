/* eslint-disable import/extensions */
import { Router } from 'express';
import { Bouncers } from '../middlewares';
import { AuthController } from '../controller';
import upload from '../middlewares/uploadMiddleware';

const router = Router();
const {
  verifyNumber,
  verifyUser,
  verifySignup,
  verifyLogin,
  validateTokenValue,
  authenticate,
  verifyProfile,
  verifyPasswordReset
} = AuthMiddleware;
const {
  registerPhoneNumber,
  verifyToken,
  resendToken,
  signup,
  login,
  updateProfile,
  forgetPassword,
  verifyForgetPasswordLink,
  setPassword,
  logoutUser
} = AuthController;

router.post('/follow-user', Auth, followUser); // ?user_uuid=[]

export default router;
