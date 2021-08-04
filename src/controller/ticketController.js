import qrCode from 'qrcode';
import { GeneralService, UserService } from '../services';
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
  findByKey
} = GeneralService;
const {
  getMedias
} = UserService;
const {
  Ticket,
  User
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
      const { id } = req.tokenData;
      const { movie } = req;
      const ticketCode = await generateTicketCode(movie.title);
      // const price = Number(req.body.quantity) * movie.ticketPrice * movie.discount;
      const price = Number(req.body.quantity) * Number(movie.ticketPrice);
      const ticket = await addEntity(Ticket, {
        ...req.body, userId: id, price, ticketCode
      });
      return successResponse(res, { message: 'Tickets Purchased Successfully', ticket });
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
      const { paystackReference, ticketCode, quantity } = ticket;
      if (!paystackReference || paystackReference === null) return errorResponse(res, { code: '400', message: 'Payment has not be made yet' });
      const check = await validatePaystack(paystackReference);
      const { status } = check.data;
      if (status === 'abandoned') return errorResponse(res, { code: '400', message: 'Error with Payment, Please Try again!' });
      if (status === 'failed') return errorResponse(res, { code: '400', message: 'Payment Failed, Please Try again!' });
      if (status === 'success') {
        const metadata = {
          ticketCode,
          quantity,
          name
        };
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
   * buy add payment
   * @async
   * @param {object} req
   * @param {object} res
   * @returns {JSON} a JSON response with user details and Token
   * @memberof TicketController
   */
  async makeTicketPayment(req, res) {
    try {
      const { id, email, name } = req.tokenData;
      const { ticket } = req;
      const { ticketCode, price, quantity } = ticket;
      const metadata = {
        ticketCode,
        quantity,
        name
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
