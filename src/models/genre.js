module.exports = (sequelize, DataTypes) => {
  const Genre = sequelize.define('Genre', {
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
  }, {});
  Genre.associate = (models) => {
    Genre.belongsToMany(models.Movie, {
      through: 'MovieGenre',
      as: 'movie',
      foreignKey: 'genreId'
    });
  };
  return Genre;
};
