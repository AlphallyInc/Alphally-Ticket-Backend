module.exports = (sequelize, DataTypes) => {
  const Media = sequelize.define('Media', {
    name: {
      type: DataTypes.STRING,
      allowNull: true
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    type: {
      type: DataTypes.STRING,
      allowNull: true
    },
    url: {
      type: DataTypes.STRING,
      allowNull: true
    },
    fileExtension: {
      type: DataTypes.STRING,
      allowNull: true
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
    }
  }, {});
  Media.associate = (models) => {
    Media.belongsToMany(models.Post, {
      through: 'PostMedia',
      as: 'post',
      foreignKey: 'postId'
    });
    Media.hasMany(models.PostMedia, {
      as: 'posts',
      foreignKey: 'mediaId'
    });
    Media.belongsToMany(models.Movie, {
      through: 'MovieMedia',
      as: 'movies',
      foreignKey: 'mediaId'
    });
    Media.hasMany(models.MovieMedia, {
      as: 'movie',
      foreignKey: 'mediaId'
    });
  };
  return Media;
};
