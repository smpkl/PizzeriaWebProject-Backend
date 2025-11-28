import request from 'supertest';
import app from '../../src/app.js';
import { closePool } from '../../src/utils/database.js';

const baseUrl = '/api/v1/categories';

afterAll(async () => {
  await closePool();
});

// GET tests:

describe(`GET ${baseUrl}`, () => {
  it('should return a list of categories', async () => {
    const res = await request(app)
      .get(baseUrl)
      .set('Accept', 'application/json');

    expect(res.statusCode).toBe(200);
    expect(res.body).toBeInstanceOf(Object);
    expect(res.body.categories).toBeDefined();
  });

  it('should return 404 for non-existing category id', async () => {
    const res = await request(app)
      .get(`${baseUrl}/9999`)
      .set('Accept', 'application/json');

    expect(res.statusCode).toBe(404);
  });

  it('should return a category for existing id (e.g. 1)', async () => {
    const res = await request(app)
      .get(`${baseUrl}/1`)
      .set('Accept', 'application/json');

    expect(res.statusCode).toBe(200);
    expect(res.body).toBeInstanceOf(Object);
    expect(res.body.category).toBeDefined();
  });
});

// POST tests:

describe(`POST ${baseUrl}`, () => {
  it('should return 401 if no token is provided', async () => {
    const newCategory = {
      name: 'Test category from jest',
    };

    const res = await request(app)
      .post(baseUrl)
      .send(newCategory)
      .set('Accept', 'application/json');

    expect(res.statusCode).toBe(401);
  });
});

// PUT tests:

describe(`PUT ${baseUrl}/:id`, () => {
  it('should return 401 if no token is provided', async () => {
    const updatedCategory = {
      name: 'Updated name without auth',
    };

    const res = await request(app)
      .put(`${baseUrl}/1`)
      .send(updatedCategory)
      .set('Accept', 'application/json');

    expect(res.statusCode).toBe(401);
  });
});

// DELETE tests:

describe(`DELETE ${baseUrl}/:id`, () => {
  it('should return 401 if no token is provided', async () => {
    const res = await request(app)
      .delete(`${baseUrl}/1`)
      .set('Accept', 'application/json');

    expect(res.statusCode).toBe(401);
  });
});
