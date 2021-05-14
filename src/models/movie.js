module.exports = (sequelize, DataTypes) => {
  const Movie = sequelize.define('Movie', {
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    storyLine: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    thumbnail: {
      type: DataTypes.STRING,
      allowNull: true
    },
    releaseDate: {
      type: DataTypes.STRING,
      allowNull: true
    },
    ticketCode: {
      type: DataTypes.STRING,
      allowNull: true
    },
    discount: {
      type: DataTypes.STRING,
      allowNull: true
    },
    ticketPrice: {
      type: DataTypes.STRING,
      allowNull: true
    },
    rating: {
      type: DataTypes.STRING,
      allowNull: true
    },
    shareLink: {
      type: DataTypes.STRING,
      allowNull: true
    },
    duration: {
      type: DataTypes.STRING,
      allowNull: true
    },
    showDate: {
      type: DataTypes.STRING,
      allowNull: true
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'User',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    },
    cinemaId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'Cinema',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    },
    privacyId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'Privacy',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    },
  }, {});
  Movie.associate = () => {
  };
  return Movie;
};
