const request = require('superagent');
const logger = require('pino')();
const db = require('../models');

async function handleSuccessPayment(session) {
  const { id, client_reference_id: voucherId, display_items: items } = session; // eslint-disable-line
  const total = items.reduce((acc, item) => acc + item.amount, 0);
  let voucher;
  try {
    voucher = await db.Voucher.findByPk(voucherId);
    await voucher.update({
      transactionId: id,
      status: 'PAID',
      amountPaid: total,
      dateSold: new Date(),
    });
  } catch (err) {
    logger.error('handleSuccessPayment error DB update', err);
  }

  // don't send data to zapier when testing
  if (process.env.NODE_ENV !== 'test') {
    try {
      const Booking = await db.Booking.findOne({
        where: {
          VoucherId: voucherId,
        },
      });
      const {
        boxType,
        buyerEmail,
        buyerName,
        buyerSurname,
        buyerPhone,
      } = voucher.get({ plain: true });
      const { participantName, participantSurname } = Booking.get({
        plain: true,
      });
      await request
        .post('https://hooks.zapier.com/hooks/catch/4832154/jfflev/')
        .send({
          buyerEmail,
          buyerName,
          buyerSurname,
          buyerPhone,
          dateSold: new Date(),
          voucherId,
          boxType,
          participantName,
          participantSurname,
        })
        .set({
          'Content-type': 'application/json',
          Accept: 'application/json',
        });
    } catch (err) {
      logger.error('handleSuccessPayment error Zapier webhook', err);
    }
  }
}

module.exports = handleSuccessPayment;
