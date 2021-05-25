module.exports = (sequelize, DataTypes) => {
  const Comment = sequelize.define('Comment', {
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
    parentId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'Comment',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    },
    comment: {
      type: DataTypes.TEXT,
      allowNull: false
    },
  }, {});
  Comment.associate = (models) => {
    Comment.belongsTo(models.User, {
      as: 'commenter',
      foreignKey: 'userId'
    });
    Comment.belongsTo(models.Post, {
      as: 'post',
      foreignKey: 'postId'
    });
    Comment.hasMany(models.Comment, {
      as: 'replyComments',
      foreignKey: 'parentId'
    });
    Comment.hasMany(models.CommentLike, {
      as: 'likes',
      foreignKey: 'commentId'
    });
    Comment.belongsTo(models.Comment, {
      as: 'replyComment',
      foreignKey: 'parentId'
    });
  };
  return Comment;
};
