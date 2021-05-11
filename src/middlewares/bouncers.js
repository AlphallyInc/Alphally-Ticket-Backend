import AuthMiddleware from './authMiddleware';
import Permissions from '../utils/permissions';

const {
  authenticate, verifyRoles
} = AuthMiddleware;
const {
  superAdmin,
  admin,
  user,
  business
} = Permissions;

const Bouncers = {
  superAdminBouncers: [authenticate, verifyRoles(superAdmin)],
  adminBouncers: [authenticate, verifyRoles(admin)],
  businessBouncers: [authenticate, verifyRoles(business)],
  userBouncers: [authenticate, verifyRoles(user)]
};

export default Bouncers;
