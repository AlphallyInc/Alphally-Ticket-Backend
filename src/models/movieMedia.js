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
  MovieMedia.associate = () => {
  };
  return MovieMedia;
};
