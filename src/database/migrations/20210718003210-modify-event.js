module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.addColumn('Events', 'postId', {
    type: Sequelize.INTEGER,
    allowNull: true,
  }),
  down: (queryInterface) => queryInterface.removeColumn('Events', 'postId')
};
