const http = require('http');
const supertest = require('supertest');
const { isSameDay, parseISO } = require('date-fns');
const lambda = require('../api/vouchers');
const db = require('../models');
const { session, voucherInput } = require('./fixtures');
const handleSuccessPayment = require('../lib/handleSuccessPayment');

describe('handleSuccessPayment', () => {
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

  it('should set voucher PAID', async () => {
    // create test voucher
    const res = await request.post('/').send(voucherInput);
    expect(res.body).toHaveProperty('id');
    ({ bookingId, id: voucherId } = res.body);
    const data = session(voucherId);
    await handleSuccessPayment(data);
    const Voucher = await db.Voucher.findByPk(voucherId);
    const voucher = Voucher.get({ plain: true });
    expect(voucher.status).toBe('PAID');
    expect(voucher.id).toBe(data.id);
    expect(voucher.amountPaid).toBe(15000);
    expect(isSameDay(parseISO(voucher.dateSold), new Date())).toBe(true);
  });
});
