/* eslint-disable max-len */
import { GeneralService, AdminService } from '../services';
import { Toolbox } from '../utils';
import database from '../models';

const {
  successResponse,
  errorResponse,
  getCinemaPayload
} = Toolbox;
const {
  addEntity,
  findByKey,
  deleteByKey,
  updateByKey,
} = GeneralService;
const {
  getCinemas
} = AdminService;
const {
  Privacy,
  Cinema,
  CinemaAddress
} = database;

const AdminController = {
  /**
   * all group privacy accounts
   * @async
   * @param {object} req
   * @param {object} res
   * @returns {JSON} a JSON response with user details and Token
   * @memberof AdminController
   */
  async addPrivacyAll(req, res) {
    try {
      const privacy = await Privacy.bulkCreate(req.body);
      return successResponse(res, { message: 'Privacy Added Successfully', privacy });
    } catch (error) {
      errorResponse(res, { code: 500, message: error });
    }
  },

  /**
   * add a single privacy account
   * @async
   * @param {object} req
   * @param {object} res
   * @returns {JSON} a JSON response with user details and Token
   * @memberof AdminController
   */
  async addPrivacy(req, res) {
    try {
      const privacy = await addEntity(Privacy, { ...req.body });
      return successResponse(res, { message: 'Privacy Added Successfully', privacy });
    } catch (error) {
      errorResponse(res, { code: 500, message: error });
    }
  },

  /**
   * add a single cinema
   * @async
   * @param {object} req
   * @param {object} res
   * @returns {JSON} a JSON response with user details and Token
   * @memberof AdminController
   */
  async addCinema(req, res) {
    try {
      const { name, addresses } = req.body;
      let capacity = addresses.map((item) => item.seats);
      capacity = capacity.reduce((accumulator, current) => accumulator + current);
      const cinema = await Cinema.create({ name, capacity, addresses }, {
        include: [
          {
            model: CinemaAddress,
            as: 'addresses'
          }
        ]
      });
      return successResponse(res, { message: 'Cinema Added Successfully', cinema });
    } catch (error) {
      errorResponse(res, { code: 500, message: error });
    }
  },

  /**
   * delete a single privacy account
   * @async
   * @param {object} req
   * @param {object} res
   * @returns {JSON} a JSON response with user details and Token
   * @memberof AdminController
   */
  async deletePrivacy(req, res) {
    try {
      const privacy = await findByKey(Privacy, { id: req.query.id });
      if (!privacy) return errorResponse(res, { code: 404, message: 'Privacy Type does not exist' });
      await deleteByKey(Privacy, { id: req.query.id });
      return successResponse(res, { message: 'Privacy Deleted Successfully' });
    } catch (error) {
      errorResponse(res, { code: 500, message: error });
    }
  },

  /**
   * delete cinema
   * @async
   * @param {object} req
   * @param {object} res
   * @returns {JSON} a JSON response with user details and Token
   * @memberof AdminController
   */
  async deleteCinema(req, res) {
    try {
      await deleteByKey(Cinema, { id: req.query.id });
      return successResponse(res, { message: 'Cinema Deleted Successfully' });
    } catch (error) {
      errorResponse(res, { code: 500, message: error });
    }
  },

  /**
   * update cinema name
   * @async
   * @param {object} req
   * @param {object} res
   * @returns {JSON} a JSON response with user details and Token
   * @memberof AdminController
   */
  async updateCinemaName(req, res) {
    try {
      const { name } = req.body;
      const { id } = req.query;
      const updateCinema = await updateByKey(Cinema, { name }, { id });
      return successResponse(res, { message: 'Cinema Name Updated Successfully', updateCinema });
    } catch (error) {
      errorResponse(res, { code: 500, message: error });
    }
  },

  /**
   * update cinema name
   * @async
   * @param {object} req
   * @param {object} res
   * @returns {JSON} a JSON response with user details and Token
   * @memberof AdminController
   */
  async updateSingleDetails(req, res) {
    try {
      const { cinemaAddressId } = req.query;
      const updateCinema = await updateByKey(CinemaAddress, { ...req.body }, { id: cinemaAddressId });
      return successResponse(res, { message: 'Cinema Updated Successfully', updateCinema });
    } catch (error) {
      errorResponse(res, { code: 500, message: error });
    }
  },

  /**
   * update cinema name
   * @async
   * @param {object} req
   * @param {object} res
   * @returns {JSON} a JSON response with user details and Token
   * @memberof AdminController
   */
  async addSingleAddressToCinema(req, res) {
    try {
      const { id } = req.query;
      const cinema = await addEntity(CinemaAddress, { ...req.body, cinemaId: id });
      return successResponse(res, { message: 'Cinema Updated Successfully', cinema });
    } catch (error) {
      errorResponse(res, { code: 500, message: error });
    }
  },

  /**
   * update cinema
   * @async
   * @param {object} req
   * @param {object} res
   * @returns {JSON} a JSON response with user details and Token
   * @memberof AdminController
   */
  async updateAllCinemaDetails(req, res) {
    const { cinema } = req;
    const { id } = req.query;
    try {
      const { name, addresses } = req.body;
      let updateCinema;
      if (name) updateCinema = await updateByKey(Cinema, { name }, { id });
      if (addresses) {
        const formalAddress = cinema[0].addresses;
        const payload = getCinemaPayload(addresses, formalAddress);
        const { currentPayload, newPayload } = payload;
        if (currentPayload.length) await CinemaAddress.bulkCreate(currentPayload, { updateOnDuplicate: ['state', 'city', 'seats', 'country', 'address'] });
        if (newPayload.length) {
          const addressPayload = newPayload.map((item) => ({ ...item, cinemaId: id }));
          await CinemaAddress.bulkCreate(addressPayload);
        }
      }
      updateCinema = await getCinemas({ id });
      return successResponse(res, { message: 'Cinema Updated Successfully', updateCinema });
    } catch (error) {
      errorResponse(res, { code: 500, message: error });
    }
  },

  /**
   * update cinema
   * @async
   * @param {object} req
   * @param {object} res
   * @returns {JSON} a JSON response with user details and Token
   * @memberof AdminController
   */
  async getAllCinema(req, res) {
    try {
      let cinemas;
      if (req.query.id) cinemas = await getCinemas({ id: req.query.id });
      else cinemas = await getCinemas({});
      return successResponse(res, { message: 'Cinema gotten successfully', cinemas });
    } catch (error) {
      errorResponse(res, { code: 500, message: error });
    }
  },
};

export default AdminController;
