module.exports = (sequelize, DataTypes) => {
  const CommentLike = sequelize.define('CommentLike', {
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
    commentId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Comment',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    },
  }, {});
  CommentLike.associate = (models) => {
    CommentLike.belongsTo(models.User, {
      as: 'user',
      foreignKey: 'userId'
    });
    CommentLike.belongsTo(models.Comment, {
      as: 'comment',
      foreignKey: 'commentId'
    });
  };
  return CommentLike;
};
