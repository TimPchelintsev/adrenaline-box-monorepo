const express = require('express');
const db = require('../../models');

const app = express();
module.exports = app;

app.get('*', async (req, res) => {
  const locations = await db.Location.findAll();
  const data = locations.map(location => location.get({ plain: true }));
  res.send(data);
});
