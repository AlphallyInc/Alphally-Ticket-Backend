module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.addColumn('Movies', 'numberOfTickets', {
    type: Sequelize.INTEGER,
    allowNull: true,
  }),
  down: (queryInterface) => queryInterface.removeColumn('Movies', 'numberOfTickets')
};
module.exports = {
  up: (queryInterface, Sequelize) => Promise.all([
    queryInterface.addColumn(
      'Movies',
      'numberOfTickets',
      {
        type: Sequelize.DOUBLE,
        allowNull: true
      }
    ),
    queryInterface.addColumn(
      'Movies',
      'isAvialable',
      {
        type: Sequelize.BOOLEAN,
        allowNull: true,
        defaultValues: true
      }
    ),
  ]),
  down: (queryInterface) => Promise.all([
    queryInterface.removeColumn('Movies', 'numberOfTickets'),
    queryInterface.removeColumn('Movies', 'isAvialable')
  ])
};
