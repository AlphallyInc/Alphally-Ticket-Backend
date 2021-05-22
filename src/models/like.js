module.exports = (sequelize, DataTypes) => {
  const Like = sequelize.define('Like', {
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
    postId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Post',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    },
  }, {});
  Like.associate = (models) => {
    Like.belongsTo(models.User, {
      as: 'user',
      foreignKey: 'userId'
    });
    Like.belongsTo(models.Post, {
      as: 'post',
      foreignKey: 'postId'
    });
  };
  return Like;
};
