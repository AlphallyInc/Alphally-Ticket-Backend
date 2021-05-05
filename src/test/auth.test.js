import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import server from '..';
// import { env } from '../config';
import {
  userANumber,
  userADetails,
  addUserToDb,
  removeUserFromDb
} from './dummy';

// const { ADMIN_KEY } = env;

chai.use(chaiHttp);
let verificationCode;
let token;

describe('Register PhoneNumber route on signup ', () => {
  it('should successfully register a new user phone number', async () => {
    const response = await chai
      .request(server)
      .post('/v1.0/api/auth/verifyNumber')
      .send(userANumber);
    expect(response).to.have.status(200);
    expect(response.body.data).to.be.a('object');
    expect(response.body.data.token).to.be.a('string');
    verificationCode = response.body.data.token;
  });
  it('should return a validation error when supplied and empty phone number', async () => {
    const response = await chai
      .request(server)
      .post('/v1.0/api/auth/verifyNumber')
      .send({ phoneNumber: '' });
    expect(response).to.have.status(400);
    expect(response.body.status).to.equal('fail');
    expect(response.body.error).to.be.a('object');
    expect(response.body.error.message).to.equal('Phone Number is Invalid');
  });
  it('should return a validation error when phone number is invalid', async () => {
    const response = await chai
      .request(server)
      .post('/v1.0/api/auth/verifyNumber')
      .send({ phoneNumber: '12345677889' });
    expect(response).to.have.status(400);
    expect(response.body.status).to.equal('fail');
    expect(response.body.error).to.be.a('object');
    expect(response.body.error.message).to.equal('Phone Number is Invalid');
  });
  it('should return another token if not verified', async () => {
    const response = await chai
      .request(server)
      .post('/v1.0/api/auth/verifyNumber')
      .send(userANumber);
    expect(response).to.have.status(200);
    expect(response.body.status).to.equal('success');
    expect(response.body.data).to.be.a('object');
    expect(response.body.data.message).to.equal('Verification Token Sent');
    verificationCode = response.body.data.token;
  });
});

describe('Resend Token When Previous Token Has Expired on signup ', () => {
  it('should successfully resend a new token', async () => {
    const response = await chai
      .request(server)
      .post('/v1.0/api/auth/resendToken')
      .send(userANumber);
    expect(response).to.have.status(200);
    expect(response.body.data).to.be.a('object');
    expect(response.body.data.token).to.be.a('string');
    verificationCode = response.body.data.token;
  });
  it('should return an integrity error when an user\'s phone number does not exist', async () => {
    const response = await chai
      .request(server)
      .post('/v1.0/api/auth/resendToken')
      .send({ phoneNumber: '08076589877' });
    expect(response).to.have.status(409);
    expect(response.body.status).to.equal('fail');
    expect(response.body.error).to.be.a('object');
    expect(response.body.error.message).to.equal('This Number Does not Exist');
  });
});

describe('User can get Verify Phone Number By Verification Code', () => {
  it('should succesfully verify user phone number token', async () => {
    const response = await chai
      .request(server)
      .post('/v1.0/api/auth/verifyToken')
      .send({ token: verificationCode, phoneNumber: userANumber.phoneNumber });
    expect(response).to.have.status(200);
    expect(response.body.status).to.equal('success');
    expect(response.body.data).to.be.a('object');
    expect(response.body.data.message).to.be.a('string');
    expect(response.body.data.message).to.equal('Phone Number Verification Successful');
  });
  it('should show that the number has already been verified', async () => {
    const response = await chai
      .request(server)
      .post('/v1.0/api/auth/verifyToken')
      .send({ token: verificationCode, phoneNumber: userANumber.phoneNumber });
    expect(response).to.have.status(200);
    expect(response.body.status).to.equal('success');
    expect(response.body.data.message).to.equal('Phone Number is Already Verified');
  });
  it('should fail to verify token if token not given', async () => {
    const response = await chai
      .request(server)
      .post('/v1.0/api/auth/verifyToken')
      .send({ token: '', phoneNumber: userANumber.phoneNumber });
    expect(response).to.have.status(400);
    expect(response.body.status).to.equal('fail');
    expect(response.body.error.message).to.equal('Please input a valid token number');
  });
});

describe('User can complete the sign up process', () => {
  it('should succesfully sign up user details', async () => {
    const response = await chai
      .request(server)
      .post('/v1.0/api/auth/signup')
      .send(userADetails);
    expect(response).to.have.status(201);
    expect(response.body.status).to.equal('success');
    expect(response.body.data).to.be.a('object');
    expect(response.body.data.token).to.be.a('string');
  });
  it('should fail to signup if phone number is incorrect', async () => {
    const response = await chai
      .request(server)
      .post('/v1.0/api/auth/signup')
      .send({
        name: userADetails.name,
        email: userADetails.email,
        password: userADetails.password,
        phoneNumber: '0903213141'
      });
    expect(response).to.have.status(400);
    expect(response.body.status).to.equal('fail');
    expect(response.body.error.message).to.equal('Phone Number is Invalid');
  });
  it('should fail to sign user up if email is incorrect', async () => {
    const response = await chai
      .request(server)
      .post('/v1.0/api/auth/signup')
      .send({
        name: userADetails.name,
        email: 'uuncj.com',
        password: userADetails.password,
        phoneNumber: userADetails.phoneNumber
      });
    expect(response).to.have.status(400);
    expect(response.body.status).to.equal('fail');
    expect(response.body.error.message).to.equal('Please enter a valid email address');
  });
});

describe('Authentication route on login', () => {
  const { phoneNumber, password } = userADetails;
  it('should succesfully login an existing user with phone number', async () => {
    const response = await chai
      .request(server)
      .post('/v1.0/api/auth/login')
      .send({ phoneNumber, password });
    expect(response).to.have.status(200);
    expect(response.body.status).to.equal('success');
    expect(response.body.data).to.be.a('object');
    expect(response.body.data.message).to.be.a('string');
    expect(response.body.data.message).to.equal('Login Successful');
  });
  it('should fail when an incorrect password is inputed', async () => {
    const response = await chai
      .request(server)
      .post('/v1.0/api/auth/login')
      .send({ phoneNumber, password: '34D' });
    expect(response).to.have.status(400);
    expect(response.body.status).to.equal('fail');
    expect(response.body.error.message).to.equal('Password is required. \n It should be more than 8 characters');
  });
  it('should fail when the user does not exist', async () => {
    const response = await chai
      .request(server)
      .post('/v1.0/api/auth/login')
      .send({ phoneNumber: '07033667388', password });
    expect(response).to.have.status(409);
    expect(response.body.status).to.equal('fail');
    expect(response.body.error.message).to.equal('Incorrect Phone Number or Password');
  });
});

describe('Update User Profile', () => {
  let firstUser;
  before(async () => {
    firstUser = await addUserToDb(userADetails);
  });
  after(async () => {
    await removeUserFromDb({ id: firstUser.id });
  });
  it('should successfully update the profile of a user', async () => {
    const response = await chai
      .request(server)
      .patch('/v1.0/api/auth/updateProfile')
      .set('Cookie', `token=${firstUser.token}`)
      .send({
        name: 'Trix',
        email: 'Bulitoc@gmail.com',
      });
    expect(response).to.have.status(200);
    expect(response.body.status).to.equal('success');
    expect(response.body.data).to.be.a('object');
    expect(response.body.data.message).to.equal('Profile update was successful');
  });
  it('should fail to update user profile if token is absent', async () => {
    const response = await chai
      .request(server)
      .patch('/v1.0/api/auth/updateProfile')
      .send({
        name: 'Trix',
        email: 'Bulitoc@gmail.com',
      });
    expect(response).to.have.status(401);
    expect(response.body.status).to.equal('fail');
    expect(response.body.error.message).to.equal('Access denied, Token required');
  });
  it('should fail to update user profile email is incorrect', async () => {
    const response = await chai
      .request(server)
      .patch('/v1.0/api/auth/updateProfile')
      .set('Cookie', `token=${firstUser.token}`)
      .send({
        name: 'Trix',
        email: 'Bulitogmailcom',
      });
    expect(response).to.have.status(400);
    expect(response.body.status).to.equal('fail');
    expect(response.body.error.message).to.equal('Please enter a valid email address');
  });
  it('should fail to update user password is old password is incorrect', async () => {
    const response = await chai
      .request(server)
      .patch('/v1.0/api/auth/updateProfile')
      .set('Cookie', `token=${firstUser.token}`)
      .send({
        oldPassword: 'midnsndhsb',
        newPassword: 'jnjubhyviond',
      });
    expect(response).to.have.status(401);
    expect(response.body.status).to.equal('fail');
    expect(response.body.error.message).to.equal('Old password is incorrect');
  });
  it('should be successful if oldPasswords match together with adding more updates', async () => {
    const response = await chai
      .request(server)
      .patch('/v1.0/api/auth/updateProfile')
      .set('Cookie', `token=${firstUser.token}`)
      .send({
        oldPassword: userADetails.password,
        newPassword: 'jnjubhyviond',
        nickname: "Test_Jara"
      });
    expect(response).to.have.status(200);
    expect(response.body.status).to.equal('success');
    expect(response.body.data).to.be.a('object');
    expect(response.body.data.message).to.equal('Profile update was successful');
  });
});

describe('User can Reset Forget Password', () => {
  let firstUser;
  before(async () => {
    firstUser = await addUserToDb(userADetails);
  });
  after(async () => {
    await removeUserFromDb({ id: firstUser.id });
  });
  it('should successfully get a token after sending number', async () => {
    const response = await chai
      .request(server)
      .post('/v1.0/api/auth/forgetPassword')
      .send({
        phoneNumber: userADetails.phoneNumber
      });
    expect(response).to.have.status(200);
    expect(response.body.status).to.equal('success');
    expect(response.body.data).to.be.a('object');
    expect(response.body.data.message).to.equal('Verification Reset Link Sent to your number');
    verificationCode = response.body.data.token;
  });
  it('should successfully verify user and grant token', async () => {
    const response = await chai
      .request(server)
      .post('/v1.0/api/auth/verifyPasswordToken')
      .send({ token: verificationCode });
    expect(response).to.have.status(200);
    expect(response.body.status).to.equal('success');
    expect(response.body.data).to.be.a('object');
    token = response.body.data.token;
  });
  it('should fail to update user password if they dont match', async () => {
    const response = await chai
      .request(server)
      .post('/v1.0/api/auth/setPassword')
      .set('Cookie', `token=${token}`)
      .send({
        newPassword: "Test.577854nnnss776`",
        confirmPassword: "Test.577854nnnss"
      });
    expect(response).to.have.status(409);
    expect(response.body.status).to.equal('fail');
    expect(response.body.error.message).to.equal('Passwords does not match');
  });
  it('should successfully change user password while authenticated', async () => {
    const response = await chai
      .request(server)
      .post('/v1.0/api/auth/setPassword')
      .set('Cookie', `token=${token}`)
      .send({
        confirmPassword: 'midnseendhsb',
        newPassword: 'midnseendhsb',
      });
    expect(response).to.have.status(200);
    expect(response.body.status).to.equal('success');
    expect(response.body.data).to.be.a('object');
    expect(response.body.data.message).to.equal('Password has been set successfully');
  });
});

