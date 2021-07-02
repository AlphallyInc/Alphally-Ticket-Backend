module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('Roles', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER
    },
    role: {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: 'user'
    },
    description: {
      type: Sequelize.STRING,
      allowNull: true
    }
  }),

  down: (queryInterface) => queryInterface.dropTable('Roles')
};
