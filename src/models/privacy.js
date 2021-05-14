module.exports = (sequelize, DataTypes) => {
  const Privacy = sequelize.define('Privacy', {
    type: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
  }, {});
  Privacy.associate = (models) => {
    // Privacy.hasOne(models.User, {
    //   as: 'user',
    //   foreignKey: 'PrivacyId'
    // });
  };
  return Privacy;
};
