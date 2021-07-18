module.exports = {
  up: (queryInterface, Sequelize) => Promise.all([
    queryInterface.addColumn(
      'Movies',
      'postId',
      {
        type: Sequelize.INTEGER,
        allowNull: true
      }
    ),
    queryInterface.addColumn(
      'Movies',
      'trendingCount',
      {
        type: Sequelize.INTEGER,
        allowNull: true
      }
    ),
  ]),
  down: (queryInterface) => Promise.all([
    queryInterface.removeColumn('Movies', 'postId'),
    queryInterface.removeColumn('Movies', 'trendingCount')
  ])
};
