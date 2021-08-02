/* eslint-disable import/extensions */
import { Router } from 'express';
import { Bouncers, TicketMiddleware } from '../middlewares';
import { TicketController } from '../controller';

const router = Router();
const {
  userBouncers
} = Bouncers;
const {
  verifyTicketPayload
} = TicketMiddleware;
const {
  buyMovieTicket
} = TicketController;

router.post('/', userBouncers, verifyTicketPayload, buyMovieTicket);

export default router;
