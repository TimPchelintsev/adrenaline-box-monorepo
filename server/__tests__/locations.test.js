const http = require('http');
const supertest = require('supertest');
const lambda = require('../api/locations');
const db = require('../models');
const Location = require('../models/Location')(db.sequelize, db.Sequelize);
const fixtures = require('./fixtures');

describe('/api/locations', () => {
  let app;
  let request;
  beforeAll(async () => {
    app = http.createServer(lambda);
    request = supertest(app);
    await Location.create(fixtures.location);
  });

  afterAll(async () => {
    await Location.destroy({
      where: {
        id: fixtures.location.id,
      },
    });
    await db.sequelize.close();
  });

  it('should return the list of locations', async () => {
    const testData = fixtures.location;
    const res = await request.get('/');
    const { body } = res;
    expect(Array.isArray(body)).toBe(true);
    expect(body[0]).toHaveProperty('id', testData.id);
    expect(body[0]).toHaveProperty('name', testData.name);
    expect(body[0]).toHaveProperty('address', testData.address);
    expect(body[0]).toHaveProperty('city', testData.city);
    expect(body[0]).toHaveProperty('phone', testData.phone);
    expect(body[0]).toHaveProperty('latitude', testData.latitude);
    expect(body[0]).toHaveProperty('longitude', testData.longitude);
    expect(body[0]).toHaveProperty('openDays', testData.openDays);
    expect(body[0]).toHaveProperty('ownerName', testData.ownerName);
    expect(body[0]).toHaveProperty('ownerEmail', testData.ownerEmail);
  });
});
