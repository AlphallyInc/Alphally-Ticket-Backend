module.exports = (sequelize, DataTypes) => {
  const Verification = sequelize.define('Verification', {
    token: {
      type: DataTypes.STRING,
      allowNull: true
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false
    },
    verified: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
  }, {});
  Verification.associate = (models) => {
    Verification.hasOne(models.User, {
      as: 'user',
      foreignKey: 'verificationId'
    });
  };
  return Verification;
};
