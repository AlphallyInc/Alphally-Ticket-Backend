module.exports = {
  up: (queryInterface, Sequelize) => Promise.all([
    queryInterface.addColumn(
      'Events',
      'postId',
      {
        type: Sequelize.INTEGER,
        allowNull: true
      }
    ),
    queryInterface.addColumn(
      'Events',
      'trendingCount',
      {
        type: Sequelize.INTEGER,
        allowNull: true
      }
    ),
    queryInterface.addColumn(
      'Events',
      'numberOfTickets',
      {
        type: Sequelize.DOUBLE,
        allowNull: true
      }
    ),
    queryInterface.addColumn(
      'Events',
      'isAvialable',
      {
        type: Sequelize.BOOLEAN,
        allowNull: true,
        defaultValues: true
      }
    ),
    queryInterface.addColumn(
      'Events',
      'trailer',
      {
        type: Sequelize.STRING,
        allowNull: true,
      }
    ),
  ]),
  down: (queryInterface) => Promise.all([
    queryInterface.removeColumn('Events', 'postId'),
    queryInterface.removeColumn('Events', 'trendingCount'),
    queryInterface.removeColumn('Events', 'numberOfTickets'),
    queryInterface.removeColumn('Events', 'isAvialable'),
    queryInterface.removeColumn('Events', 'trailer')
  ])
};
