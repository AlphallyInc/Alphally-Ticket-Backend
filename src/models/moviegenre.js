module.exports = (sequelize, DataTypes) => {
  const MovieGenre = sequelize.define('MovieGenre', {
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
    genreId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Genre',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    },
  }, {});
  MovieGenre.associate = () => {
  };
  return MovieGenre;
};
