import { GeneralService } from '../services';
import { Toolbox } from '../utils';
import database from '../models';

const {
  successResponse,
  errorResponse,
} = Toolbox;
const {
  addEntity,
  findByKey,
  deleteByKey
} = GeneralService;
// const {
//   getUserProfile
// } = UserService;
const {
  Privacy
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
};

export default AdminController;
