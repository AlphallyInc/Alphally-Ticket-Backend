module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Tickets', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      paymentStatus: {
        type: Sequelize.ENUM('pending', 'completed', 'rejected'),
        allowNull: false,
        defaultValue: 'pending'
      },
      paystackReference: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      price: {
        type: Sequelize.DOUBLE,
        allowNull: true
      },
      ticketCode: {
        type: Sequelize.STRING,
        allowNull: false
      },
      quantity: {
        type: Sequelize.DOUBLE,
        allowNull: false
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      movieId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'Movies',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      eventId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'Events',
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
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Tickets');
  }
};
