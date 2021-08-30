module.exports = (sequelize, DataTypes) => {
  const Activity = sequelize.define('Activity', {
    activity: {
      type: DataTypes.STRING,
      allowNull: false
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'general'
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
    likeId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'Like',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    },
    commentId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'Comment',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    },
    followingId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'Follower',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    },
  }, {});
  Activity.associate = (models) => {
    Activity.belongsTo(models.Event, {
      as: 'categories',
      foreignKey: 'categoryId'
    });
  };
  return Activity;
};
