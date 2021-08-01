module.exports = (sequelize, DataTypes) => {
  const PostMedia = sequelize.define('PostMedia', {
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
    mediaId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Media',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    },
  }, {});
  PostMedia.associate = (models) => {
    PostMedia.belongsTo(models.Post, {
      as: 'posts',
      foreignKey: 'postId'
    });
    PostMedia.belongsTo(models.Media, {
      as: 'media',
      foreignKey: 'mediaId'
    });
  };
  return PostMedia;
};
