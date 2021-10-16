/* eslint-disable max-len */
/* eslint-disable no-nested-ternary */
import qrCode from 'qrcode';
import { GeneralService, UserService, AdminService } from '../services';
import { Toolbox, Payment } from '../utils';
import database from '../models';

const {
  successResponse,
  errorResponse,
  generateTicketCode
} = Toolbox;
const {
  viaPaystack,
  validatePaystack
} = Payment;
const {
  addEntity,
  updateByKey,
  findByKey,
  findMultipleByKey
} = GeneralService;
const {
  getMedias,
} = UserService;
const {
  getTicketByKey,
  getMovieTicketByKey,
  getEventTicketByKey
} = AdminService;
const {
  Ticket,
  User,
  Movie,
  Event
} = database;

const TicketController = {
  /**
   * buy a movie ticket
   * @async
   * @param {object} req
   * @param {object} res
   * @returns {JSON} a JSON response with user details and Token
   * @memberof TicketController
   */
  async buyMovieTicket(req, res) {
    try {
      const { id, name, email } = req.tokenData;
      const { movie } = req;
      let ticket;

      if (req.ticketData) {
        ticket = await updateByKey(Ticket, { quantity: req.body.quantity }, { id: req.ticketData.id });
      } else {
        const ticketCode = await generateTicketCode(movie.title);
        // const price = Number(req.body.quantity) * movie.ticketPrice * movie.discount;
        const price = Number(req.body.quantity) * Number(movie.ticketPrice);
        ticket = await addEntity(Ticket, {
          ...req.body, userId: id, price, ticketCode
        });
      }
      const { ticketCode, price, quantity } = ticket;
      const metadata = {
        ticketCode,
        quantity,
        name,
      };

      // TODO: Uncomment code below before production
      const payload = {
        email,
        amount: Number(price) * 100,
        metadata,
      };

      // return console.log(payload);
      let paystack = await viaPaystack(payload);
      if (!paystack.status) errorResponse(res, { code: 400, message: paystack.message });
      paystack = paystack.data;
      await updateByKey(Ticket, { paystackReference: paystack.reference }, { id: ticket.id });
      return successResponse(res, { message: 'Tickets Created Successfully', ticket: { ...ticket.dataValues, paystack } });
    } catch (error) {
      errorResponse(res, { code: 500, message: error });
    }
  },

  /**
   * buy a event ticket
   * @async
   * @param {object} req
   * @param {object} res
   * @returns {JSON} a JSON response with user details and Token
   * @memberof TicketController
   */
  async buyEventTicket(req, res) {
    try {
      const { id, name, email } = req.tokenData;
      const { event } = req;
      let ticket;

      if (req.ticketData) {
        ticket = await updateByKey(Ticket, { quantity: req.body.quantity }, { id: req.ticketData.id });
      } else {
        const ticketCode = await generateTicketCode(event.name);
        // const price = Number(req.body.quantity) * movie.ticketPrice * movie.discount;
        const price = Number(req.body.quantity) * Number(event.ticketPrice);
        ticket = await addEntity(Ticket, {
          ...req.body, userId: id, price, ticketCode
        });
      }
      const { ticketCode, price, quantity } = ticket;
      const metadata = {
        ticketCode,
        quantity,
        name,
      };

      // TODO: Uncomment code below before production
      const payload = {
        email,
        amount: Number(price) * 100,
        metadata,
      };

      // return console.log(payload);
      let paystack = await viaPaystack(payload);
      if (!paystack.status) errorResponse(res, { code: 400, message: paystack.message });
      paystack = paystack.data;
      await updateByKey(Ticket, { paystackReference: paystack.reference }, { id: ticket.id });
      return successResponse(res, { message: 'Tickets Created Successfully', ticket: { ...ticket.dataValues, paystack } });
    } catch (error) {
      console.error(error);
      errorResponse(res, { code: 500, message: error });
    }
  },

  /**
   * verify a movie ticket
   * @async
   * @param {object} req
   * @param {object} res
   * @returns {JSON} a JSON response with user details and Token
   * @memberof TicketController
   */
  async verifyPayment(req, res) {
    try {
      let barCode;
      const { name } = req.tokenData;
      const { ticket } = req;
      const {
        paystackReference, ticketCode, quantity, movieId, eventId
      } = ticket;

      if (!paystackReference || paystackReference === null) return errorResponse(res, { code: '400', message: 'Payment has not be made yet' });
      const check = await validatePaystack(paystackReference);
      const { status } = check.data;
      if (status === 'abandoned') return errorResponse(res, { code: '400', message: 'Error with Payment, Please Try again!' });
      if (status === 'failed') {
        await updateByKey(Ticket, { paymentStatus: 'rejected' }, { id: ticket.id });
        return errorResponse(res, { code: '400', message: 'Payment Failed, Please Try again!' });
      }
      if (status === 'success') {
        await updateByKey(Ticket, { paymentStatus: 'completed' }, { id: ticket.id });
        const metadata = {
          ticketCode,
          quantity,
          name
        };

        if (movieId !== null) {
          const movie = await findByKey(Movie, { id: movieId });
          let { numberOfTickets, isAvailable } = movie;
          numberOfTickets = Number(numberOfTickets - quantity);
          isAvailable = numberOfTickets >= 1;
          await updateByKey(Movie, { numberOfTickets, isAvailable }, { id: movieId });
        } else if (eventId !== null) {
          const event = await findByKey(Event, { id: eventId });
          let { numberOfTickets, isAvailable } = event;
          numberOfTickets = Number(numberOfTickets - quantity);
          isAvailable = numberOfTickets >= 1;
          await updateByKey(Movie, { numberOfTickets, isAvailable }, { id: eventId });
        }
        barCode = await qrCode.toDataURL(JSON.stringify(metadata));
      }
      return successResponse(res, { message: 'Ticket Payment Successfully', barCode });
    } catch (error) {
      console.error(error);
      errorResponse(res, { code: 500, message: error });
    }
  },

  /**
   * verify a movie ticket
   * @async
   * @param {object} req
   * @param {object} res
   * @returns {JSON} a JSON response with user details and Token
   * @memberof TicketController
   */
  async verificationCheck(req, res) {
    try {
      const { ticketCode } = req.query;
      const ticket = await findByKey(Ticket, { ticketCode });
      if (!ticket) return errorResponse(res, { code: '404', message: 'Error with Ticket, Ticket is Invalid!' });
      const { userId } = ticket;
      const user = await findByKey(User, { id: userId });
      if (!user) return errorResponse(res, { code: '404', message: 'Error with Ticket, Customer not found!' });
      return successResponse(res, { message: 'Verification Successful, User can watch movie', user });
    } catch (error) {
      console.error(error);
      errorResponse(res, { code: 500, message: error });
    }
  },

  /**
   * get tickets
   * @async
   * @param {object} req
   * @param {object} res
   * @returns {JSON} a JSON response with user details and Token
   * @memberof TicketController
   */
  async getAllTickets(req, res) {
    try {
      let tickets;
      let numberOfTicketSold = 0;
      let numberOfTicketsRemaining = 0;

      if (req.query.movieId) {
        tickets = await getMovieTicketByKey({ id: req.query.movieId });
        if (!tickets) return errorResponse(res, { code: 404, message: 'No ticket found' });
        const ticketss = tickets.tickets.map((item) => item.quantity);
        numberOfTicketSold = ticketss.reduce((a, b) => Number(a + b), numberOfTicketSold);
        numberOfTicketsRemaining = Number(tickets.numberOfTickets - numberOfTicketSold);
        if (!tickets) return errorResponse(res, { code: '404', message: 'No Purchase made for this movie' });
      } else if (req.query.eventId) {
        tickets = await getEventTicketByKey({ id: req.query.eventId });
        if (!tickets) return errorResponse(res, { code: 404, message: 'No ticket found' });
        const ticketss = tickets.tickets.map((item) => item.quantity);
        numberOfTicketSold = ticketss.reduce((a, b) => Number(a + b), numberOfTicketSold);
        numberOfTicketsRemaining = Number(tickets.numberOfTickets - numberOfTicketSold);
        if (!tickets) return errorResponse(res, { code: '404', message: 'No Purchase made for this event' });
      } else {
        tickets = await getTicketByKey({});
        if (!tickets.length) return errorResponse(res, { code: '404', message: 'No Purchase made at all' });
        // numberOfTicketSold = tickets.reduce((a, b) => Number(a.quantity + b.quantity), numberOfTicketSold);
        // numberOfTicketsRemaining = Number(tickets.numberOfTickets - numberOfTicketSold);
      }

      const data = {
        tickets,
        numberOfTicketSold,
        numberOfTicketsRemaining,
        isAvailable: numberOfTicketsRemaining === 0,
      };

      return successResponse(res, { message: 'Tickets Gotten Successfully', data });
    } catch (error) {
      console.error(error);
      errorResponse(res, { code: 500, message: error });
    }
  },

  /**
   * get personal tickets
   * @async
   * @param {object} req
   * @param {object} res
   * @returns {JSON} a JSON response with user details and Token
   * @memberof TicketController
   */
  async getPersonalTickets(req, res) {
    try {
      let tickets;
      const { id } = req.tokenData;

      if (req.query.ticketId) tickets = await findMultipleByKey(Ticket, { id: req.query.ticketId, userId: id });
      else tickets = await findMultipleByKey(Ticket, { userId: id });

      if (tickets.length < 1) return errorResponse(res, { code: 404, message: 'Tickets does not exist' });

      return successResponse(res, { message: 'Tickets Gotten Successfully', tickets });
    } catch (error) {
      errorResponse(res, { code: 500, message: error });
    }
  },

  /**
   * buy add payment
   * @async
   * @param {object} req
   * @param {object} res
   * @returns {JSON} a JSON response with user details and Token
   * @memberof TicketController
   */
  async makeTicketPayment(req, res) {
    try {
      const { email, name } = req.tokenData;
      const { ticket } = req;
      const { ticketCode, price, quantity } = ticket;
      const metadata = {
        ticketCode,
        quantity,
        name,
      };

      // TODO: Uncomment code below before production
      const payload = {
        email,
        amount: Number(price) * 100,
        metadata,
      };

      // return console.log(payload);
      let paystack = await viaPaystack(payload);
      if (!paystack.status) errorResponse(res, { code: 400, message: paystack.message });
      paystack = paystack.data;
      await updateByKey(Ticket, { paystackReference: paystack.reference }, { id: ticket.id });
      // successResponse(res, { message: `success, redirect to ${url}`, url });
      // return res.redirect(url);
      // TODO: Uncomment code above before production

      // TODO: delete code below before production
      // const paystack = {
      //   status: 'success',
      //   url: 'https://test-paystack-success.com',
      // };
      // const { url } = paystack;
      // successResponse(res, { message: `success, redirect to ${url}`, url });
      return successResponse(res, { message: 'Tickets Purchased Successfully', paystack });
    } catch (error) {
      errorResponse(res, { code: 500, message: error });
    }
  }
};

export default TicketController;
