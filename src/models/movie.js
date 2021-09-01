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
    trailer: {
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
    numberOfTickets: {
      type: DataTypes.DOUBLE,
      allowNull: true
    },
    isAvialable: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValues: true
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
    postId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    trendingCount: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    showTime: {
      type: DataTypes.TIME,
      allowNull: true,
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
  Movie.associate = (models) => {
    Movie.belongsTo(models.User, {
      as: 'publisher',
      foreignKey: 'userId'
    });
    Movie.belongsToMany(models.Media, {
      through: 'MovieMedia',
      as: 'medias',
      foreignKey: 'movieId'
    });
    Movie.belongsToMany(models.Genre, {
      through: 'MovieGenre',
      as: 'genres',
      foreignKey: 'movieId'
    });
    Movie.hasMany(models.MovieMedia, {
      as: 'media',
      foreignKey: 'movieId'
    });
    Movie.hasMany(models.Ticket, {
      as: 'tickets',
      foreignKey: 'movieId'
    });
    Movie.belongsToMany(models.Cinema, {
      through: 'MovieCinema',
      as: 'cinemas',
      foreignKey: 'movieId'
    });
  };
  return Movie;
};
