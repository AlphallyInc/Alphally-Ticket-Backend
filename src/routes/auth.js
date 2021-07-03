/* eslint-disable import/extensions */
import { Router } from 'express';
import { AuthMiddleware } from '../middlewares';
import { AuthController } from '../controller';
import upload from '../middlewares/uploadMiddleware';

const router = Router();
const {
  verifyEmail,
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
  logoutUser,
  addRoles
} = AuthController;

// router.post('/verifyNumber', verifyUser, registerPhoneNumber);
router.post('/verifyToken', validateTokenValue, verifyToken);
router.post('/resendToken', verifyEmail, resendToken);
router.post('/signup', verifySignup, signup);
router.post('/login', verifyLogin, login);
router.patch('/updateProfile', authenticate, upload.single('file'), verifyProfile, updateProfile);
router.post('/forgetPassword', verifyEmail, forgetPassword);
router.post('/verifyPasswordToken', validateTokenValue, verifyForgetPasswordLink);
router.post('/setPassword', authenticate, verifyPasswordReset, setPassword);
router.post('/logout', logoutUser);

// super admin privilede
router.post('/role', addRoles);

export default router;
