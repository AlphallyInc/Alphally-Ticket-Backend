module.exports = (sequelize, DataTypes) => {
  const Role = sequelize.define(
    'Role',
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      role: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'user'
      },
      description: {
        type: DataTypes.STRING,
        allowNull: true
      }
    },
    {}
  );
  Role.associate = (models) => {
    Role.belongsToMany(models.User, {
      through: 'RoleUser',
      as: 'user',
      foreignKey: 'roleId'
    });
  };
  return Role;
};
