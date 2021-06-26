module.exports = (sequelize, DataTypes) => {
  const Cinema = sequelize.define('Cinema', {
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    address: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    capacity: {
      type: DataTypes.STRING,
      allowNull: true
    },
    seats: {
      type: DataTypes.STRING,
      allowNull: true
    },
    state: {
      type: DataTypes.STRING,
      allowNull: true
    },
  }, {});
  Cinema.associate = (models) => {
    Cinema.hasMany(models.CinemaAddress, {
      as: 'addresses',
      foreignKey: 'cinemaId',
    });
  };
  return Cinema;
};
