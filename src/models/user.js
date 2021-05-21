module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    'User',
    {
      name: {
        type: DataTypes.STRING,
        allowNull: true
      },
      username: {
        type: DataTypes.STRING,
        allowNull: true
      },
      imageUrl: {
        type: DataTypes.STRING,
        allowNull: true
      },
      gender: {
        type: DataTypes.STRING,
        allowNull: true
      },
      dob: {
        type: DataTypes.STRING,
        allowNull: true
      },
      companyName: {
        type: DataTypes.STRING,
        allowNull: true
      },
      companyAddress: {
        type: DataTypes.STRING,
        allowNull: true
      },
      role: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'user'
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
      referrerId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: 'User',
          key: 'id'
        },
      },
      phoneNumber: {
        type: DataTypes.STRING,
        allowNull: false
      },
      referralCode: {
        type: DataTypes.STRING,
        allowNull: true
      },
      verificationId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'Verification',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
    },
    {}
  );
  User.associate = (models) => {
    User.belongsTo(models.Verification, {
      as: 'verification',
      foreignKey: 'verificationId'
    });
    User.hasMany(models.Follower, {
      as: 'follower',
      foreignKey: 'followerId'
    });
    User.hasMany(models.Post, {
      as: 'posts',
      foreignKey: 'userId'
    });
  };
  return User;
};
