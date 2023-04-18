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
    options.tableName = 'Spots';
    await queryInterface.bulkInsert(options, [
      {
        ownerId: 1,
        address: 'Big Rock Beach',
        city: 'Malibu',
        state: 'California',
        country: 'United States',
        lat: 34.0259,
        lng: 118.7798,
        name: 'Stunning 2BR',
        description: 'Indulge in coastal reverie at the Big Rock Seaside Beach House.',
        price: 812
      },
      {
        ownerId: 1,
        address: 'Oceanside Blvd',
        city: 'Oceanside',
        state: 'California',
        country: 'United States',
        lat: 33.1959,
        lng: 117.3795,
        name: 'Shorebird 5br',
        description: 'The views and sound of the waves crashing in your backyard are just amazing.',
        price: 1050
      },
      {
        ownerId: 1,
        address: 'Catherine Way',
        city: 'Avalon',
        state: 'California',
        country: 'United States',
        lat: 33.3428,
        lng: 118.3282,
        name: 'The Big Blue',
        description: 'With 180 degree ocean views and the waves gently splashing against the beach, it is a soothing adventure.',
        price: 525
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
    options.tableName = 'Spots';
    const Op = Sequelize.Op;
    await queryInterface.bulkDelete(options);
  }
};
