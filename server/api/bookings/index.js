const express = require('express');
const bodyParser = require('body-parser');
const logger = require('pino')();
const {
  getDay, addDays, isAfter, parseISO,
} = require('date-fns');
const request = require('superagent');
const db = require('../../models');

const isValidBookingDay = (openDays, date) => {
  const day = getDay(parseISO(date));
  const arr = [
    openDays.sun,
    openDays.mon,
    openDays.tue,
    openDays.wed,
    openDays.thu,
    openDays.fri,
    openDays.sat,
  ];
  return arr[day] && isAfter(parseISO(date), addDays(new Date(), 4));
};

const app = express();
app.use(bodyParser.json());
module.exports = app;

app.put('*', async (req, res) => {
  const { id } = req.query;
  if (!id) {
    res.sendStatus(400);
    return;
  }
  try {
    const booking = await db.Booking.findByPk(id);
    const voucher = await db.Voucher.findByPk(booking.VoucherId);
    if (voucher.status === 'UNPAID') {
      logger.error('Unpaid booking:', voucher.id);
      res.status(400).send({ error: 'unpaid booking' });
      return;
    }
    const {
      LocationId, participantEmail, participantPhone, dateBooked,
    } = req.body;
    if (!LocationId || !participantEmail || !participantPhone || !dateBooked) {
      logger.error('Missing parameter');
      res.status(400).send({ error: 'missing parameter' });
      return;
    }
    const location = await db.Location.findByPk(LocationId);
    const { openDays } = location.get({ plain: true });
    if (!isValidBookingDay(openDays, dateBooked)) {
      logger.error('Invalid booking day');
      res.status(400).send({ error: 'Invalid booking day' });
      return;
    }
    await booking.update({
      LocationId,
      participantEmail,
      participantPhone,
      dateBooked,
      booked: true,
    });
    res.sendStatus(200);
    // don't send data to zapier when testing
    if (process.env.NODE_ENV !== 'test') {
      const zapierData = {
        booking: booking.get({ plain: true }),
        voucher: voucher.get({ plain: true }),
        location: location.get({ plain: true }),
      };
      await request
        .post('https://hooks.zapier.com/hooks/catch/4832154/vbib29/')
        .send(zapierData)
        .set({
          'Content-type': 'application/json',
          Accept: 'application/json',
        });
    }
  } catch (err) {
    logger.error(err);
    res.sendStatus(500);
  }
});
