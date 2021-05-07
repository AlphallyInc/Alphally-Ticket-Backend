module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.addColumn('Verifications', 'verified', {
    type: Sequelize.BOOLEAN,
    allowNull: false,
    defaultValue: false
  }),
  down: (queryInterface) => queryInterface.removeColumn('Verifications', 'verified')
};
