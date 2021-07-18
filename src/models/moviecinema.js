module.exports = (sequelize, DataTypes) => {
  const MovieMedia = sequelize.define('MovieCinema', {
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
    cinemaId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Cinema',
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
