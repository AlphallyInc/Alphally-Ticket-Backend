module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.addColumn('Movies', 'trailer', {
    type: Sequelize.STRING,
    allowNull: true,
  }),
  down: (queryInterface) => queryInterface.removeColumn('Movies', 'trailer')
};
