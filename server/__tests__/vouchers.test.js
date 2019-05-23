const http = require('http');
const supertest = require('supertest');
const lambda = require('../api/vouchers');
const db = require('../models');
const { voucherInput } = require('./fixtures');

describe('/api/vouchers', () => {
  let app;
  let request;
  let voucherId;
  let bookingId;
  beforeAll(async () => {
    app = http.createServer(lambda);
    request = supertest(app);
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
    await db.sequelize.close();
  });

  it('should return 400 if one field is missing', async () => {
    try {
      await request.post('/').send({
        buyerName: 'Mattia',
        buyerSurname: 'Asti',
      });
    } catch (err) {
      expect(err.status).toBe(400);
    }
  });

  it('should return 200 with id and status', async () => {
    const res = await request.post('/').send(voucherInput);
    expect(res.body).toHaveProperty('id');
    voucherId = res.body.id;
  });

  it('should return the voucher and booking', async () => {
    const res = await request.get(`/?id=${voucherId}`);
    expect(res.body).toHaveProperty('voucher');
    expect(res.body).toHaveProperty('booking');
    const { voucher, booking } = res.body;
    expect(voucher).toHaveProperty('id', voucherId);
    expect(voucher).toHaveProperty('buyerName', voucherInput.buyerName);
    expect(voucher).toHaveProperty('buyerSurname', voucherInput.buyerSurname);
    expect(voucher).toHaveProperty('buyerPhone', voucherInput.buyerPhone);
    expect(voucher).toHaveProperty('buyerEmail', voucherInput.buyerEmail);
    expect(voucher).toHaveProperty('boxType', voucherInput.boxType);
    expect(voucher).toHaveProperty('status', 'UNPAID');
    expect(booking).toHaveProperty('id');
    bookingId = booking.id;
    expect(booking).toHaveProperty('VoucherId', voucherId);
    expect(booking).toHaveProperty(
      'participantName',
      voucherInput.participantName,
    );
    expect(booking).toHaveProperty(
      'participantSurname',
      voucherInput.participantSurname,
    );
  });
});
