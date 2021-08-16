module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.addColumn('Movies', 'showTime', {
    type: Sequelize.TIME,
    allowNull: true,
  }),
  down: (queryInterface) => queryInterface.removeColumn('Movies', 'showTime')
};
