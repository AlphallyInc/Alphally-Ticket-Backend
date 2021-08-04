/* eslint-disable import/extensions */
import { Router } from 'express';
import { Bouncers, TicketMiddleware } from '../middlewares';
import { TicketController } from '../controller';

const router = Router();
const {
  userBouncers
} = Bouncers;
const {
  verifyTicketPayload,
  verifyTicket
} = TicketMiddleware;
const {
  buyMovieTicket,
  makeTicketPayment,
  verifyPayment,
  verificationCheck
} = TicketController;

router.post('/movie', userBouncers, verifyTicketPayload, buyMovieTicket);
router.patch('/movie', userBouncers, verifyTicket, makeTicketPayment); // ?ticketid=[]
router.get('/movie/verify', userBouncers, verifyTicket, verifyPayment); // ?ticketid=[]
router.get('/movie/verification', userBouncers, verificationCheck); // ?ticketCode=[]

export default router;
