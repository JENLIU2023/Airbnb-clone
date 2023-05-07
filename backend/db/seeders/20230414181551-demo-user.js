'use strict';

const bcrypt = require("bcryptjs");

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
   options.tableName = 'Users';
   await queryInterface.bulkInsert(options, [
    {
      firstName: 'Alice',
      lastName: 'Adams',
      username: 'FakeUser1',
      hashedPassword: bcrypt.hashSync('password1'),
      email: 'alice@user.io'
    },
    {
      firstName: 'Bella',
      lastName: 'Brown',
      username: 'FakeUser2',
      hashedPassword: bcrypt.hashSync('password2'),
      email: 'bella@user.io',
    },
    {
      firstName: 'Cora',
      lastName: 'Clark',
      username: 'FakeUser3',
      hashedPassword: bcrypt.hashSync('password3'),
      email: 'cora@user.io'
    {
      firstName: 'Demo',
      lastName: 'Lition',
      username: 'Demo-lition',
      hashedPassword: bcrypt.hashSync('password'),
      email: 'demo@user.io'
    },
    {
      firstName: 'Test',
      lastName: 'User',
      username: 'Test-user',
      hashedPassword: bcrypt.hashSync('password'),
      email: 'test@user.io'
    },
   ])
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    options.tableName = 'Users';
    const Op = Sequelize.Op;
    await queryInterface.bulkDelete(options)
  }
};
