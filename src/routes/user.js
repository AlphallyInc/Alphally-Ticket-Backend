/* eslint-disable import/extensions */
import { Router } from 'express';
import { Bouncers } from '../middlewares';
// import { AuthController } from '../controller';

const router = Router();
const {
  userBouncers
} = Bouncers;

router.post('/follow-user', userBouncers); // ?userId=[]&followerId=[]

export default router;
