/* eslint-disable import/extensions */
import { Router } from 'express';
import { Bouncers, TicketMiddleware } from '../middlewares';
import { TicketController } from '../controller';

const router = Router();
const {
  userBouncers,
  adminBouncers
} = Bouncers;
const {
  validateMovieTicketPayload,
  validateEventTicketPayload,
  verifyTicket,
  verifyIds
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
router.get('/verify', userBouncers, verifyTicket, verifyPayment); // ?ticketid=[]
router.get('/verification', userBouncers, verificationCheck); // ?ticketCode=[]
router.post('/event', userBouncers, validateEventTicketPayload, buyEventTicket);
router.get('/', adminBouncers, verifyIds, getAllTickets); // movieId=[] || eventId=[]

export default router;
