module.exports = (sequelize, DataTypes) => {
  const Post = sequelize.define('Post', {
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    body: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    thumbnail: {
      type: DataTypes.STRING,
      allowNull: true
    },
    postLink: {
      type: DataTypes.STRING,
      allowNull: true
    },
    shareLink: {
      type: DataTypes.STRING,
      allowNull: true
    },
    isPublished: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
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
    privacyId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'Privacy',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    },
  }, {});
  Post.associate = (models) => {
    Post.belongsTo(models.User, {
      as: 'author',
      foreignKey: 'userId'
    });
    Post.belongsToMany(models.Media, {
      through: 'PostMedia',
      as: 'media',
      foreignKey: 'mediaId'
    });
    Post.hasMany(models.PostMedia, {
      as: 'medias',
      foreignKey: 'postId'
    });
    Post.hasMany(models.Comment, {
      as: 'comments',
      foreignKey: 'postId'
    });
    Post.hasMany(models.Like, {
      as: 'likes',
      foreignKey: 'postId'
    });
  };
  return Post;
};
