module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    'User',
    {
      firstName: {
        type: DataTypes.STRING,
        allowNull: true
      },
      lastName: {
        type: DataTypes.STRING,
        allowNull: true
      },
      username: {
        type: DataTypes.STRING,
        allowNull: true
      },
      password: {
        type: DataTypes.STRING,
        allowNull: true
      },
      email: {
        type: DataTypes.STRING,
        allowNull: true,
        isEmail: true,
      },
      phoneNumber: {
        type: DataTypes.STRING,
        allowNull: false
      },
      dob: {
        type: DataTypes.STRING,
        allowNull: false
      },
      imageUrl: {
        type: DataTypes.STRING,
        allowNull: true
      },
    },
    {}
  );
  User.associate = (models) => {
    User.belongsTo(models.Verification, {
      as: 'verification',
      foreignKey: 'verificationId'
    });
  };
  return User;
};
