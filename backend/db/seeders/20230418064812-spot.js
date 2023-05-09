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
      },
      {
        ownerId: 1,
        address: 'address4',
        city: 'New York',
        state: 'New York',
        country: 'United States',
        lat: 41,
        lng: 42,
        name: 'Cozy Private Room',
        description: 'This cozy and spacious Private Bedroom is located in Long Island City (Queens), an amazing, safe, and demanding neighborhood.',
        price: 115
      },
      {
        ownerId: 1,
        address: 'address5',
        city: 'Big Bear Lake',
        state: 'California',
        country: 'United States',
        lat: 51,
        lng: 52,
        name: 'Cresta Chalet',
        description: 'Welcome to Cresta Chalet! A modern, renovated A-Frame cabin in Big Bear.',
        price: 111
      },
      {
        ownerId: 1,
        address: 'address6',
        city: 'Apache Junction',
        state: 'Arizona',
        country: 'United States',
        lat: 61,
        lng: 62,
        name: 'Stunning Views Superstition Mountains Hiking',
        description: 'Our home is located at the base of the breathtaking Superstition Mountains and is 11 miles from Canyon Lake.',
        price: 174
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
