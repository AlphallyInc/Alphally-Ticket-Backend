import sendgrid from '@sendgrid/mail';
import { env } from '../config';
import Toolbox from './toolbox';

const {
  ADMIN_EMAIL, SENDGRID_API_KEY
} = env;
const {
  createPasswordResetLink
} = Toolbox;

sendgrid.setApiKey(SENDGRID_API_KEY);

const Mailer = {
  /**
   * send email verification to user after signup
   * @param {object} body - { id, email, firstName ...etc}
   * @param {object} OTPToken
   * @returns {Promise<boolean>} - Returns true if mail is sent, false if not
   * @memberof Mailer
   */
  async sendVerificationEmail(body, OTPToken) {
    const { email, name } = body;
    const mail = {
      to: email,
      from: ADMIN_EMAIL,
      templateId: 'd-be8226b3fdd9449ba8ab9c25e1b21781',
      dynamic_template_data: {
        name,
        verificationCode: OTPToken,
      }
    };
    try {
      await sendgrid.send(mail);
      return true;
    } catch (error) {
      return false;
    }
  },

  /**
   * send email for password reset
   * @param {object} req
   * @param {object} user
   * @returns {Promise<boolean>} - Returns true if mail is sent, false if not
   * @memberof Mailer
   */
  async sendPasswordResetEmail(req, user) {
    const {
      id, email, firstName, verified, roleId
    } = user;
    const passwordResetLink = createPasswordResetLink(req, {
      id, email, verified, roleId
    });
    const mail = {
      to: email,
      from: ADMIN_EMAIL,
      templateId: 'd-4d40ffcdc0dc44c0a7980d6d0609e1e3',
      dynamic_template_data: {
        name: firstName,
        reset_link: passwordResetLink
      }
    };
    try {
      await sendgrid.send(mail);
      return true;
    } catch (error) {
      return false;
    }
  },

  /**
   * send email for suppliers order
   * @param {object} supplier
   * @param {array} email
   * @returns {Promise<boolean>} - Returns true if mail is sent, false if not
   * @memberof Mailer
   */
  async sendSupplierOrder(supplier) {
    const mail = supplier.map((item) => ({
      to: item.email,
      from: ADMIN_EMAIL,
      templateId: 'd-d7160c341f6e4ea89dc9737e8a82eb76',
      dynamic_template_data: {
        name: item.companyName,
        product: `${item.productName.join(', ')}`
      }
    }));

    try {
      await sendgrid.send(mail);
      return true;
    } catch (error) {
      return false;
    }
  },

  /**
   * send email to notify suppliers of deleted category
   * @param {object} payload
   * @returns {Promise<boolean>} - Returns true if mail is sent, false if not
   * @memberof Mailer
   */
  async notifySupplier(payload) {
    const mail = payload.map(({
      productName, supplier, userName, category
    }) => ({
      to: supplier[0],
      from: ADMIN_EMAIL,
      templateId: 'd-da8115ae8cc747ccb85ae0d169712083',
      dynamic_template_data: {
        name: userName,
        category: category[0],
        product: `${productName.join(', ')}`
      }
    }));

    try {
      await sendgrid.send(mail);
      return true;
    } catch (error) {
      return false;
    }
  }
};

export default Mailer;
