module.exports = (sequelize, DataTypes) => {
  const CinemaAddress = sequelize.define('CinemaAddress', {
    address: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    city: {
      type: DataTypes.STRING,
      allowNull: true
    },
    seats: {
      type: DataTypes.STRING,
      allowNull: false
    },
    state: {
      type: DataTypes.STRING,
      allowNull: false
    },
    country: {
      type: DataTypes.STRING,
      allowNull: false
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
  CinemaAddress.associate = () => {
  };
  return CinemaAddress;
};
