module.exports = (sequelize, DataTypes) => {
  const Ticket = sequelize.define('Ticket', {
    paymentStatus: {
      type: DataTypes.ENUM('pending', 'completed', 'rejected'),
      allowNull: false,
      defaultValue: 'pending'
    },
    paystackReference: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    price: {
      type: DataTypes.DOUBLE,
      allowNull: true
    },
    ticketCode: {
      type: DataTypes.STRING,
      allowNull: false
    },
    quantity: {
      type: DataTypes.DOUBLE,
      allowNull: false
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'User',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    },
    movieId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'Movie',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    },
    eventId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'Event',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    },
  }, {});
  Ticket.associate = (models) => {
    Ticket.belongsTo(models.User, {
      as: 'buyer',
      foreignKey: 'userId'
    });
    Ticket.belongsTo(models.Movie, {
      as: 'movie',
      foreignKey: 'movieId'
    });
    Ticket.belongsTo(models.Event, {
      as: 'event',
      foreignKey: 'eventId'
    });
  };
  return Ticket;
};
