/* eslint-disable camelcase */
/* eslint-disable no-empty-pattern */
import { verifyPhoneNumber } from 'nigerian-phone-number-validator';
import { GeneralService } from '../services';
import { Toolbox, SMSLIER, FileUpload } from '../utils';
import { AuthValidation } from '../validation';
import database from '../models';
// import env from '../config/env';

const {
  successResponse,
  errorResponse,
  createToken,
  hashPassword,
  generateOTP,
  comparePassword,
  // generateReffalCode
} = Toolbox;
const {
  validateRefferalCode
} = AuthValidation;
const {
  // sendVerificationToken
} = SMSLIER;
const {
  uploadImages
} = FileUpload;
const {
  addEntity,
  updateByKey,
  findByKey
} = GeneralService;
const {
  User,
  Verification
} = database;
// const {
//   CLIENT_URL
// } = env;

const AuthController = {
  /**
   * user phone number registration
   * @async
   * @param {object} req
   * @param {object} res
   * @returns {JSON} a JSON response with user details and Token
   * @memberof AuthController
   */
  async registerPhoneNumber(req, res) {
    try {
      const { phoneNumber } = req.body;
      const OTPToken = generateOTP();
      const verification = await findByKey(Verification, { phoneNumber });
      if (verification) {
        if (verification.verified) return errorResponse(res, { code: 409, message: 'Phone Number is already verified' });
        await updateByKey(Verification, { token: OTPToken }, { phoneNumber });
      } else await addEntity(Verification, { phoneNumber, token: OTPToken });

      // TODO - UNCOMMENT FOR PRODUCTION
      // Send the Token to User Via SMS
      // await sendVerificationToken(OTPToken, phoneNumber);

      return successResponse(res, { message: 'Verification Token Sent', token: OTPToken });
    } catch (error) {
      errorResponse(res, { code: 500, message: error });
    }
  },

  /**
   * user can get another token
   * @async
   * @param {object} req
   * @param {object} res
   * @returns {JSON} a JSON response with user details and Token
   * @memberof AuthController
   */
  async resendToken(req, res) {
    try {
      const { verification } = req;
      const OTPToken = generateOTP();
      await updateByKey(Verification, { token: OTPToken }, { id: verification.id });

      // TODO - UNCOMMENT FOR PRODUCTION USE
      // Send the Token to User Via SMS
      // const { phoneNumber } = verification;
      // await sendVerificationToken(OTPToken, phoneNumber);

      return successResponse(res, { message: 'Verification Token Sent', token: OTPToken });
    } catch (error) {
      errorResponse(res, { code: 500, message: error });
    }
  },

  /**
   * user token verification
   * @async
   * @param {object} req
   * @param {object} res
   * @returns {JSON} a JSON response with user details and Token
   * @memberof AuthController
   */
  async verifyToken(req, res) {
    try {
      const { token, phoneNumber } = req.body;
      if (!verifyPhoneNumber(phoneNumber)) return errorResponse(res, { code: 400, message: 'Phone Number is Invalid' });
      const verification = await findByKey(Verification, { phoneNumber });
      if (!verification) return errorResponse(res, { code: 409, message: 'This Token does not exist.' });
      if (verification.verified) return successResponse(res, { message: 'Phone Number is Already Verified' });
      if (verification.token !== token) return errorResponse(res, { code: 409, message: 'Token is invalid' });
      await updateByKey(Verification, { verified: true }, { phoneNumber });
      return successResponse(res, { message: 'Phone Number Verification Successful' });
    } catch (error) {
      errorResponse(res, { code: 500, message: error });
    }
  },

  /**
   * user signup
   * @async
   * @param {object} req
   * @param {object} res
   * @returns {JSON} a JSON response with user details and Token
   * @memberof AuthController
   */
  async signup(req, res) {
    try {
      let refferalUser = null;
      if (req.body.refferalCode) {
        const { refferalCode } = req.body;
        validateRefferalCode({ refferalCode });
        refferalUser = await findByKey(User, { refferalCode: req.body.refferalCode });
        if (!refferalUser) return errorResponse(res, { code: 409, message: 'Referal does not exist' });
      }
      const { verification } = req;
      const {
        name, email, phoneNumber, password
      } = req.body;
      const body = {
        name,
        email,
        phoneNumber,
        password: hashPassword(password),
        referrerId: refferalUser !== null ? refferalUser.id : refferalUser,
        verificationId: verification.id
      };
      const user = await addEntity(User, body);
      const token = createToken({
        email: user.email,
        id: user.id,
        phoneNumber: user.phoneNumber,
        name: user.name
      });
      res.cookie('token', token, { maxAge: 70000000, httpOnly: true });
      return successResponse(res, { token }, 201);
    } catch (error) {
      errorResponse(res, { code: 500, message: error });
    }
  },

  /**
   * user login
   * @async
   * @param {object} req
   * @param {object} res
   * @returns {JSON} a JSON response with user details and Token
   * @memberof AuthController
   */
  async login(req, res) {
    try {
      const { user } = req;
      const { password } = req.body;
      if (!comparePassword(password, user.password)) return errorResponse(res, { code: 401, message: 'incorrect password or email' });
      const token = createToken({
        email: user.email,
        id: user.id,
        phoneNumber: user.phoneNumber,
        name: user.name
      });
      res.cookie('token', user.token, { maxAge: 70000000, httpOnly: true });
      return successResponse(res, { message: 'Login Successful', token });
    } catch (error) {
      errorResponse(res, { code: 500, message: error });
    }
  },

  /**
   * update user profile
   * @param {object} req
   * @param {object} res
   * @returns {JSON } A JSON response with the user's profile details.
   * @memberof AuthController
   */
  async updateProfile(req, res) {
    try {
      let body;
      let imageUrl;
      let usernames;
      const { id } = req.tokenData;
      if (req.body.oldPassword) {
        const currentUserDetails = await findByKey(User, { id });
        const { oldPassword, newPassword } = req.body;
        if (!comparePassword(oldPassword, currentUserDetails.password)) return errorResponse(res, { code: 401, message: 'Old password is incorrect' });
        body = { ...req.body, password: hashPassword(newPassword) };
        delete body.oldPassword;
        delete body.newPassword;
      } else {
        if (req.body.username) {
          usernames = await findByKey(User, { username: req.body.username });
          if (usernames && usernames.id !== id) return errorResponse(res, { code: 409, message: 'This Username is use by another user' });
        }
        if (req.file) imageUrl = await uploadImages(req.file, '', 'profile_pic', 'profile_pictures');
        body = { ...req.body, imageUrl };
      }
      const user = await updateByKey(User, body, { id });
      successResponse(res, { message: 'Profile update was successful', user });
    } catch (error) {
      errorResponse(res, {});
    }
  },

  /**
   * user forget password number
   * @param {object} req
   * @param {object} res
   * @returns {JSON} - a JSON response
   * @memberof AuthController
   */
  async forgetPassword(req, res) {
    try {
      const { phoneNumber } = req.body;
      const { verification } = req;
      const OTPToken = generateOTP();
      if (!verification.verified) return errorResponse(res, { code: 409, message: 'Phone Number is not yet verified' });
      await updateByKey(Verification, { token: OTPToken }, { phoneNumber });

      // TODO - UNCOMMENT FOR PRODUCTION USE
      // Send the Token to User Via SMS
      // await sendVerificationToken(OTPToken, phoneNumber);

      return successResponse(res, { message: 'Verification Reset Link Sent to your number', token: OTPToken });
    } catch (error) {
      errorResponse(res, {});
    }
  },

  /**
   * verify forget password link
   * @param {object} req
   * @param {object} res
   * @returns {JSON} - a JSON response
   * @memberof AuthController
   */
  async verifyForgetPasswordLink(req, res) {
    try {
      const { token } = req.body;
      const verification = await findByKey(Verification, { token });
      if (verification) {
        const user = await findByKey(User, { phoneNumber: verification.phoneNumber });
        user.token = createToken({
          email: user.email,
          name: user.name,
          id: user.id,
          phoneNumber: user.phoneNumber
        });
        res.cookie('token', user.token, { maxAge: 70000000, httpOnly: true });
        const url = `${req.protocol}s://${req.get('host')}/v1.0/api/auth/set-password`;
        return successResponse(res, { message: `success, redirect to api route ${url} with password objects`, token: user.token });

        // TODO - UNCOMMENT FOR PRODUCTION USE
        // return res.redirect(`${CLIENT_URL}/set-password?token=${token}`);
      }
    } catch (error) {
      const status = error.status || 500;
      errorResponse(res, { code: status, message: `could not verify, ${error.message}` });
    }
  },

  /**
   * one time password set
   * @param {object} req
   * @param {object} res
   * @returns {JSON} - a JSON response
   * @memberof AuthController
   */
  async setPassword(req, res) {
    try {
      const { newPassword } = req.body;
      const { id } = req.tokenData;
      let user = await findByKey(User, { id });
      if (!user) return errorResponse(res, { code: 404, message: 'Sorry, user in token does not exist' });
      const hashedPassword = hashPassword(newPassword);
      user = await updateByKey(User, { password: hashedPassword }, { id });
      successResponse(res, { message: 'Password has been set successfully' });
    } catch (error) {
      errorResponse(res, {});
    }
  },

  /**
   * logs user out
   * @param {object} req
   * @param {object} res
   * @returns {JSON} - a JSON response
   * @memberof AuthController
   */
  async logoutUser(req, res) {
    try {
      const token = '';
      res.cookie('token', token, { maxAge: 0, httpOnly: true });
      return successResponse(res, { message: 'Logout Successful', token });
    } catch (error) {
      errorResponse(res, {});
    }
  },
};

export default AuthController;
