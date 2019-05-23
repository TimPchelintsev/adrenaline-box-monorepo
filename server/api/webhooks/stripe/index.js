const express = require('express');
const bodyParser = require('body-parser');
const logger = require('pino')();
const stripe = require('stripe')(process.env.STRIPE_SECRET);
const handleSuccessPayment = require('../../../lib/handleSuccessPayment');

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

const app = express();
app.use(bodyParser.raw({ type: 'application/json' }));
module.exports = app;

app.post('*', async (req, res) => {
  // handle stripe webhooks
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (err) {
    logger.error('Webhook error', err);
    res.status(400).send(err.message);
    return;
  }

  // Handle the checkout.session.completed event
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    // Fulfill the purchase...
    handleSuccessPayment(session);
  }

  // Return a res to acknowledge receipt of the event
  res.json({ received: true });
});
