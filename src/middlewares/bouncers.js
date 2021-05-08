import AuthMiddleware from './authMiddleware';
import Permissions from '../utils/permissions';

const {
  authenticate, verifyRoles, verifyUser
} = AuthMiddleware;
const {
  CompanySuperAdmin,
  FacilitySuperAdmin,
  CompanyAdmin,
  FacilityAdmin,
  FacilityStaff,
  FacilityStoreKeeper,
  // FacilityStoreKeeperManager,
  FacilityRoles,
  all
} = Permissions;

const Bouncers = {
  superAdminBouncers: [authenticate, verifyUser, verifyRoles(CompanySuperAdmin)],
  adminBouncers: [authenticate, verifyUser, verifyRoles(CompanyAdmin)],
  facilityAdminBouncers: [authenticate, verifyUser, verifyRoles(FacilityAdmin)],
  facilitySuperAdminBouncers: [authenticate, verifyUser, verifyRoles(FacilitySuperAdmin)],
  userBouncers: [authenticate, verifyUser, verifyRoles(FacilityStaff)],
  facilityStoreKeeperBouncers: [authenticate, verifyUser, verifyRoles(FacilityStoreKeeper)],
  // facilityStoreKeeperAdminBouncers: [authenticate, verifyUser, verifyRoles(FacilityStoreKeeperManager)],
  facilityRoleBouncers: [authenticate, verifyUser, verifyRoles(FacilityRoles)],
  publicUserBouncers: [authenticate, verifyRoles(all)],
};

export default Bouncers;
