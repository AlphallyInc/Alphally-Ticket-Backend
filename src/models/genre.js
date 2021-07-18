module.exports = (sequelize, DataTypes) => {
  const Genre = sequelize.define('Genre', {
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
  }, {});
  Genre.associate = () => {
  };
  return Genre;
};
