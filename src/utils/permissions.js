export default {
  super_admin: ['super_admin'],
  admin: ['super_admin', 'admin'],
  business: ['super_admin', 'admin', 'business'],
  user: ['super_admin', 'admin', 'business', 'user'],
};