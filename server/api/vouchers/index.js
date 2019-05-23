const express = require('express');
const logger = require('pino')();
const bodyParser = require('body-parser');
const uuid = require('uuid/v4');
const generate = require('nanoid/generate');
const db = require('../../models');

const generateVoucherId = () => generate('123456789ABCDEFGHIJKLMNPQRSTUVWXYZ', 10);

const app = express();
app.use(bodyParser.json());
module.exports = app;

app.get('*', async (req, res) => {
  const { id } = req.query;
  if (!id) {
    res.statusCode = 400;
    res.end();
    return;
  }
  const voucher = await db.Voucher.findByPk(id.toUpperCase());
  const booking = await db.Booking.findOne({
    where: {
      VoucherId: id.toUpperCase(),
    },
  });
  if (!booking) {
    res.sendStatus(404);
    return;
  }
  const data = {
    voucher: voucher.get({ plain: true }),
    booking: booking.get({ plain: true }),
  };
  res.send(data);
});

app.post('*', async (req, res) => {
  const {
    buyerName,
    buyerSurname,
    buyerEmail,
    buyerPhone,
    participantName,
    participantSurname,
    boxType,
    paymentMethod,
  } = req.body;
  if (
    !buyerName
    || !buyerSurname
    || !buyerEmail
    || !buyerPhone
    || !participantName
    || !participantSurname
    || !boxType
    || !paymentMethod
  ) {
    res.sendStatus(400);
    return;
  }
  try {
    // generate voucher code
    const voucherId = generateVoucherId();
    // create voucher
    await db.Voucher.create({
      id: voucherId,
      paymentMethod,
      boxType,
      status: 'UNPAID',
      buyerName,
      buyerSurname,
      buyerEmail,
      buyerPhone,
    });
    // create booking
    const bookingId = uuid();
    await db.Booking.create({
      id: bookingId,
      VoucherId: voucherId,
      participantName,
      participantSurname,
    });
    res.send({ id: voucherId, bookingId });
  } catch (err) {
    logger.log(err);
    res.sendStatus(500);
  }
});
