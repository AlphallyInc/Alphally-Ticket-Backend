module.exports = (sequelize, DataTypes) => {
  const PostSeen = sequelize.define('PostSeen', {
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
  PostSeen.associate = (models) => {
    PostSeen.belongsTo(models.User, {
      as: 'user',
      foreignKey: 'userId'
    });
    PostSeen.belongsTo(models.Post, {
      as: 'post',
      foreignKey: 'postId'
    });
  };
  return PostSeen;
};
