module.exports = (sequelize, DataTypes) => {
  const SeenPost = sequelize.define('SeenPost', {
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
  SeenPost.associate = (models) => {
    SeenPost.belongsTo(models.User, {
      as: 'user',
      foreignKey: 'userId'
    });
    SeenPost.belongsTo(models.Post, {
      as: 'post',
      foreignKey: 'postId'
    });
  };
  return SeenPost;
};
