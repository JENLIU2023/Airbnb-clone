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
    options.tableName = 'Bookings';
    await queryInterface.bulkInsert(options, [
      {
        spotId: 1,
        userId: 2,
        startDate: new Date(2023, 0, 1),
        endDate: new Date(2023, 0, 3)
      },
      {
        spotId: 2,
        userId: 2,
        startDate: new Date(2023, 1, 1),
        endDate: new Date(2023, 1, 3)
      },
      {
        spotId: 3,
        userId: 3,
        startDate: new Date(2023, 2, 1),
        endDate: new Date(2023, 2, 3)
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
    options.tableName = 'Bookings';
    await queryInterface.bulkDelete(options)
  }
};
