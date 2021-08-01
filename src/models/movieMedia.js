module.exports = (sequelize, DataTypes) => {
  const MovieMedia = sequelize.define('MovieMedia', {
    movieId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Movie',
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
  MovieMedia.associate = (models) => {
    MovieMedia.belongsTo(models.Movie, {
      as: 'movie',
      foreignKey: 'postId'
    });
    MovieMedia.belongsTo(models.Media, {
      as: 'media',
      foreignKey: 'mediaId'
    });
  };
  return MovieMedia;
};
