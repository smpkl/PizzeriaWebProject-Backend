import request from 'supertest';
import app from '../../src/app.js';
import { closePool } from '../../src/utils/database.js';
const baseUrl = '/api/v1/announcements'
afterAll(async () => {
  await closePool();
});

//Get tests:

describe(`GET ${baseUrl}`, () => {
  it('should return a list of announcements', async () => {
    const res = await request(app)
      .get(baseUrl)
      .set('Accept', 'application/json');
    expect(res.statusCode).toEqual(200);
    expect(res.body).toBeInstanceOf(Object);
  });

  it('should NOT FOUND an announcement by id', async () => {
    const res = await request(app)
      .get(`${baseUrl}/69`)
      .set('Accept', 'application/json');
    expect(res.statusCode).toEqual(404);
  });

  it('should find dummy announcement by id', async () => {
    const res = await request(app)
      .get(`${baseUrl}/1`)
      .set('Accept', 'application/json');
    expect(res.statusCode).toEqual(200);
  });
});

// POST tests:

describe(`POST ${baseUrl}`, () => {
  it('should return 401 if no token is provided', async () => {
    const newAnnouncement = {
      title: 'Test announcement',
      text: 'This is a test announcement created by Jest without token.',
    };

    const res = await request(app)
      .post(baseUrl)
      .send(newAnnouncement)
      .set('Accept', 'application/json');

    expect(res.statusCode).toEqual(401);
  });
});

// PUT tests:

describe(`PUT ${baseUrl}/:id`, () => {
  it('should return 401 if no token is provided', async () => {
    const updatedAnnouncement = {
      title: 'Updated title without auth',
      text: 'Trying to update announcement without token should fail.',
    };

    const res = await request(app)
      .put(`${baseUrl}/1`)
      .send(updatedAnnouncement)
      .set('Accept', 'application/json');

    expect(res.statusCode).toEqual(401);
  });
});

// DELETE tests:

describe(`DELETE ${baseUrl}/:id`, () => {
  it('should return 401 if no token is provided', async () => {
    const res = await request(app)
      .delete(`${baseUrl}/1`)
      .set('Accept', 'application/json');

    expect(res.statusCode).toEqual(401);
  });
});

// General "method not allowed / not found" test (optional)

describe(`Unsupported methods on ${baseUrl}`, () => {
  it('should return 404 for PATCH on base route', async () => {
    const res = await request(app)
      .patch(baseUrl)
      .set('Accept', 'application/json');

    expect(res.statusCode).toBe(404);
  });
});
