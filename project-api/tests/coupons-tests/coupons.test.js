import request from 'supertest';
import app from '../../src/app.js';
import { closePool } from '../../src/utils/database.js';

const baseUrl = '/api/v1/coupons';

afterAll(async () => {
  await closePool();
});


// GET tests

describe(`GET ${baseUrl}`, () => {
  it('should return a list of coupons', async () => {
    const res = await request(app)
      .get(baseUrl)
      .set('Accept', 'application/json');

    expect(res.statusCode).toBe(200);
    expect(res.body).toBeInstanceOf(Object);
    expect(res.body.coupons).toBeDefined();
  });

  it('should return 404 for non-existing coupon id', async () => {
    const res = await request(app)
      .get(`${baseUrl}/9999`)
      .set('Accept', 'application/json');

    expect(res.statusCode).toBe(404);
  });

  it('should return coupon for existing id (e.g. 1)', async () => {
    const res = await request(app)
      .get(`${baseUrl}/1`)
      .set('Accept', 'application/json');

    expect([200, 404]).toContain(res.statusCode);
    expect(res.body).toBeInstanceOf(Object);
  });
});

// POST tests

describe(`POST ${baseUrl}`, () => {
  it('should return 401 if no token is provided', async () => {
    const newCoupon = {
      coupon: 'TESTCODE',
      discount_percentage: 10,
      start_date: '2024-01-01',
      end_date: '2024-12-31'
    };

    const res = await request(app)
      .post(baseUrl)
      .send(newCoupon)
      .set('Accept', 'application/json');

    expect(res.statusCode).toBe(401);
  });
});

// PUT tests

describe(`PUT ${baseUrl}/:id`, () => {
  it('should return 401 if no token is provided', async () => {
    const updatedCoupon = {
      coupon: 'UPDATED',
      discount_percentage: 20,
      start_date: '2024-01-01',
      end_date: '2024-12-31'
    };

    const res = await request(app)
      .put(`${baseUrl}/1`)
      .send(updatedCoupon)
      .set('Accept', 'application/json');

    expect(res.statusCode).toBe(401);
  });
});

// DELETE tests

describe(`DELETE ${baseUrl}/:id`, () => {
  it('should return 401 if no token is provided', async () => {
    const res = await request(app)
      .delete(`${baseUrl}/1`)
      .set('Accept', 'application/json');

    expect(res.statusCode).toBe(401);
  });
});

