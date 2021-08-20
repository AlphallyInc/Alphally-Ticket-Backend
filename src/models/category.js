module.exports = (sequelize, DataTypes) => {
  const Category = sequelize.define('Category', {
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    decription: {
      type: DataTypes.TEXT,
      allowNull: true
    },
  }, {});
  Category.associate = (models) => {
    Category.belongsToMany(models.Event, {
      through: 'EventCategory',
      as: 'categories',
      foreignKey: 'categoryId'
    });
  };
  return Category;
};
