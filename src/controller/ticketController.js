import { GeneralService, UserService } from '../services';
import { Toolbox } from '../utils';
import database from '../models';

const {
  successResponse,
  errorResponse,
  generateTicketCode
} = Toolbox;
const {
  addEntity,
  findByKey,
  deleteByKey,
  rowCountByKey,
  allEntities
} = GeneralService;
const {
  getMedias
} = UserService;
const {
  Ticket
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
      errorResponse(res, { code: 500, message: error });
    }
  }
};

export default TicketController;
