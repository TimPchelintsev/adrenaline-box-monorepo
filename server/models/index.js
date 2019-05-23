const Sequelize = require('sequelize');
const pg = require('pg');
const Voucher = require('./Voucher.js');
const Booking = require('./Booking.js');
const Location = require('./Location.js');

// Fix Jest deep equal traversing obj
// Cannot find module 'pg-native'
delete pg.native;

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  protocol: 'postgres',
  dialectModule: pg,
  dialectOptions: {
    ssl: process.env.NO_SSL === undefined,
  },
  logging: false,
});

const db = {
  Sequelize,
  sequelize,
  Voucher: Voucher(sequelize, Sequelize),
  Booking: Booking(sequelize, Sequelize),
  Location: Location(sequelize, Sequelize),
};

db.Voucher.hasOne(db.Booking);
db.Location.hasMany(db.Booking);

module.exports = db;
