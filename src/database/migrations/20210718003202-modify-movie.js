module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.addColumn('Movies', 'postId', {
    type: Sequelize.INTEGER,
    allowNull: true,
  }),
  down: (queryInterface) => queryInterface.removeColumn('Movies', 'postId')
};
