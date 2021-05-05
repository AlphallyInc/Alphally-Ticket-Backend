import {
  GeneralService
} from '../services';
import database from '../models';
import { Toolbox } from '../utils';

const {
  addEntity,
  deleteByKey
} = GeneralService;
const {
  User,
  Verification
} = database;
const {
  createToken,
  hashPassword,
  generateOTP
} = Toolbox;

export const userANumber = {
  phoneNumber: '08033667383'
};
export const userBNumber = {
  phoneNumber: '09037654431'
};
export const userADetails = {
  name: 'ginny',
  email: 'jingh@gmail.com',
  password: 'biyyyydhdeee',
  phoneNumber: userANumber.phoneNumber
};
export const userBDetails = {
  name: 'Joe',
  email: 'jfosh@gmail.com',
  password: 'biyunabave',
  phoneNumber: userBNumber.phoneNumber
};

export const addUserToDb = async (body) => {
  const token = generateOTP();
  const verification = await addEntity(Verification, { token, phoneNumber: body.phoneNumber, verified: true });
  const user = await addEntity(User, { ...body, password: hashPassword(body.password), verificationId: verification.id });
  user.token = createToken({
    email: user.email,
    id: user.id,
    name: user.name,
    phoneNumber: user.phoneNumber
  });
  return user;
};

export const removeUserFromDb = async (id) => {
  await deleteByKey(User, id);
};
