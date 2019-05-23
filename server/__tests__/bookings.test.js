const http = require('http');
const supertest = require('supertest');
const { addDays, toDate } = require('date-fns');
const vouchersLambda = require('../api/vouchers');
const bookingsLambda = require('../api/bookings');
const db = require('../models');
const { voucherInput, location } = require('./fixtures');

describe('/api/vouchers', () => {
  let requestVouchers;
  let requestBookings;
  let voucherId;
  let bookingId;
  beforeAll(async () => {
    const vouchersApp = http.createServer(vouchersLambda);
    requestVouchers = supertest(vouchersApp);
    const bookingsApp = http.createServer(bookingsLambda);
    requestBookings = supertest(bookingsApp);
    // create voucher and booking
    const res = await requestVouchers.post('/').send(voucherInput);
    ({ bookingId, id: voucherId } = res.body);
    await db.Location.create(location);
  });

  afterAll(async () => {
    await db.Voucher.destroy({
      where: {
        id: voucherId,
      },
    });
    await db.Booking.destroy({
      where: {
        id: bookingId,
      },
    });
    await db.Location.destroy({
      where: {
        id: location.id,
      },
    });
    await db.sequelize.close();
  });

  it('should return 400 if one field is missing', async () => {
    try {
      await requestBookings.put(`/api/bookings/?id=${bookingId}`).send({
        participantEmail: 'test@example.com',
        participantPhone: '1234567890',
      });
    } catch (err) {
      expect(err.status).toBe(400);
    }
  });

  it('should not allow booking for unpaid voucher', async () => {
    try {
      await requestBookings.put(`/api/bookings/?id=${bookingId}`).send({
        LocationId: location.id,
        dateBooked: new Date(),
        participantEmail: 'test@example.com',
        participantPhone: '1234567890',
      });
    } catch (err) {
      expect(err.status).toBe(400);
    }
  });

  it('should not allow booking < 4 days from today', async () => {
    try {
      await requestBookings.put(`/api/bookings/?id=${bookingId}`).send({
        LocationId: location.id,
        dateBooked: new Date(),
        participantEmail: 'test@example.com',
        participantPhone: '1234567890',
      });
    } catch (err) {
      expect(err.status).toBe(400);
    }
  });

  it('should place booking if paid and > 4 days from today', async () => {
    // set voucher paid
    const voucher = await db.Voucher.findByPk(voucherId);
    await voucher.update({ status: 'PAID' });
    const date = toDate(addDays(new Date(), 5));
    const res = await requestBookings.put(`/api/bookings/?id=${bookingId}`).send({
      LocationId: location.id,
      dateBooked: date,
      participantEmail: 'test@example.com',
      participantPhone: '1234567890',
    });
    expect(res.status).toBe(200);
    const updatedBooking = await db.Booking.findByPk(bookingId);
    expect(updatedBooking.booked).toBe(true);
  });
});
