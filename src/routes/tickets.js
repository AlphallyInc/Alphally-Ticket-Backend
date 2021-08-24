/* eslint-disable import/extensions */
import { Router } from 'express';
import { Bouncers, TicketMiddleware } from '../middlewares';
import { TicketController } from '../controller';

const router = Router();
const {
  userBouncers
} = Bouncers;
const {
  validateMovieTicketPayload,
  validateEventTicketPayload,
  verifyTicket
} = TicketMiddleware;
const {
  buyMovieTicket,
  buyEventTicket,
  makeTicketPayment,
  verifyPayment,
  verificationCheck,
  getAllTickets
} = TicketController;

router.post('/movie', userBouncers, validateMovieTicketPayload, buyMovieTicket);
router.patch('/buy', userBouncers, verifyTicket, makeTicketPayment); // ?ticketid=[]
router.get('/movie/verify', userBouncers, verifyTicket, verifyPayment); // ?ticketid=[]
router.get('/movie/verification', userBouncers, verificationCheck); // ?ticketCode=[]
router.post('/event', userBouncers, validateEventTicketPayload, buyEventTicket);
router.get('/event/verify', userBouncers, verifyTicket, verifyPayment); // ?ticketid=[]
router.get('/event/verification', userBouncers, verificationCheck); // ?ticketCode=[]
router.get('/event', userBouncers, verifyIds, getAllTickets); // movieId=[] || eventId=[]

export default router;
