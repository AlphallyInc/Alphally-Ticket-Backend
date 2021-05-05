/* eslint-disable import/extensions */
import { Router } from 'express';
import { AuthMiddleware } from '../middlewares';
import { AuthController } from '../controller';

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

router.post('/verifyNumber', verifyUser, registerPhoneNumber);
router.post('/verifyToken', validateTokenValue, verifyToken);
router.post('/resendToken', verifyNumber, resendToken);
router.post('/signup', verifySignup, signup);
router.post('/login', verifyLogin, login);
router.patch('/updateProfile', authenticate, verifyProfile, updateProfile);
router.post('/forgetPassword', verifyNumber, forgetPassword);
router.post('/verifyPasswordToken', validateTokenValue, verifyForgetPasswordLink);
router.post('/setPassword', authenticate, verifyPasswordReset, setPassword);
router.post('/logout', logoutUser);

export default router;
