module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('CinemaAddresses', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      address: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      city: {
        type: Sequelize.STRING,
        allowNull: true
      },
      seats: {
        type: Sequelize.STRING,
        allowNull: false
      },
      state: {
        type: Sequelize.STRING,
        allowNull: false
      },
      country: {
        type: Sequelize.STRING,
        allowNull: false
      },
      cinemaId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Cinemas',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: async (queryInterface) => {
    await queryInterface.dropTable('CinemaAddresses');
  }
};
