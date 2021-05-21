module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Movies', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      title: {
        type: Sequelize.STRING,
        allowNull: false
      },
      storyLine: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      thumbnail: {
        type: Sequelize.STRING,
        allowNull: true
      },
      releaseDate: {
        type: Sequelize.STRING,
        allowNull: true
      },
      ticketCode: {
        type: Sequelize.STRING,
        allowNull: true
      },
      discount: {
        type: Sequelize.STRING,
        allowNull: true
      },
      ticketPrice: {
        type: Sequelize.STRING,
        allowNull: true
      },
      rating: {
        type: Sequelize.STRING,
        allowNull: true
      },
      duration: {
        type: Sequelize.STRING,
        allowNull: true
      },
      showDate: {
        type: Sequelize.STRING,
        allowNull: true
      },
      shareLink: {
        type: Sequelize.STRING,
        allowNull: true
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
      cinemaId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'Cinemas',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      privacyId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'Privacies',
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
    await queryInterface.dropTable('Movies');
  }
};
