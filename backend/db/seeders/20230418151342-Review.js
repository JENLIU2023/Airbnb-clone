'use strict';

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
    options.tableName = 'Reviews';
    await queryInterface.bulkInsert(options, [
      {
        spotId: 1,
        userId: 4,
        review: 'Nice place!',
        stars: 5
      },
      {
        spotId: 2,
        userId: 4,
        review: 'Great oceanview but too expensive.',
        stars: 4
      },
      {
        spotId: 3,
        userId: 5,
        review: 'Will come back again.',
        stars: 5
      }
    ])
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    options.tableName = 'Reviews';
    await queryInterface.bulkDelete(options)
  }
};
