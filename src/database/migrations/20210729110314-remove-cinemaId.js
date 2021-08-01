module.exports = {
  up: (queryInterface) => queryInterface.removeColumn('Movies', 'cinemaId')
};
