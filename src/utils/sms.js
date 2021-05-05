import env from '../config/env';

const {
  TWILIO_ACCOUNT_SID,
  TWILIO_AUTH_TOKEN,
  TWILIO_NUMBER
} = env;
const accountSid = TWILIO_ACCOUNT_SID;
const authToken = TWILIO_AUTH_TOKEN;
const client = require('twilio')(accountSid, authToken);

const SMSLIER = {
  /**
   * send sms verification token to user after signup
   * @param {object} token - OTP token
   * @param {object} phoneNumber -number to send the code to
   * @returns {Promise<boolean>} - Returns true if mail is sent, false if not
   * @memberof Mailer
   */
  async sendVerificationToken(token, phoneNumber) {
    try {
      const to = `+234${phoneNumber.substring(1)}`;
      const sms = await client.messages.create(
        {
          body: `Tracey Verification token: ${token}`,
          from: TWILIO_NUMBER,
          to
        }
      );

      if (sms) return true;
    } catch (error) {
      return false;
    }
  },
};

export default SMSLIER;
