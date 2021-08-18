module.exports = (sequelize, DataTypes) => {
  const EventCategory = sequelize.define('EventCategory', {
    eventId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Event',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    },
    categoryId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Category',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    },
  }, {});
  EventCategory.associate = () => {
  };
  return EventCategory;
};
