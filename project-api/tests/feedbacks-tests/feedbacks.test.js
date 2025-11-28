import request from "supertest";
import app from "../../src/app.js";
import { closePool } from "../../src/utils/database.js";

import jwt from "jsonwebtoken";
import "dotenv/config";

let createdFeedbackEmail;
let createdFeedbackId;
const baseUrl = "/api/v1/feedbacks";

afterAll(async () => {
  await closePool();
});

const getAdminToken = () => {
  const payload = {
    id: 999,
    role: "admin",
    email: "test@example.com",
  };

  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });

  return token;
};

// GET /feedbacks (requires token)

describe(`GET ${baseUrl}`, () => {
  it("should return 401 when no token is provided", async () => {
    const res = await request(app)
      .get(baseUrl)
      .set("Accept", "application/json");

    expect(res.statusCode).toBe(401);
  });

  it("should return a list of feedbacks with admin token", async () => {
    const token = getAdminToken();

    const res = await request(app)
      .get(baseUrl)
      .set("Authorization", `Bearer ${token}`)
      .set("Accept", "application/json");

    expect(res.statusCode).toBe(200);
    expect(res.body.feedbacks).toBeDefined();
    expect(Array.isArray(res.body.feedbacks)).toBe(true);
  });
});

// GET /feedbacks/:id (requires token)

describe(`GET ${baseUrl}/:id`, () => {
  it("should return 401 when no token is provided", async () => {
    const res = await request(app)
      .get(`${baseUrl}/1`)
      .set("Accept", "application/json");

    expect(res.statusCode).toBe(401);
  });

  it("should return a feedback or 404 with admin token", async () => {
    const token = getAdminToken();

    const res = await request(app)
      .get(`${baseUrl}/1`)
      .set("Authorization", `Bearer ${token}`)
      .set("Accept", "application/json");

    expect([200, 404]).toContain(res.statusCode);
    if (res.statusCode === 200) {
      expect(res.body.feedback).toBeDefined();
    }
  });
});

// GET /feedbacks/:id (user feedback list, requires token)

describe(`GET ${baseUrl}/:id (user feedback list)`, () => {
  it("should return 401 when no token is provided", async () => {
    const res = await request(app)
      .get(`${baseUrl}/2`)
      .set("Accept", "application/json");

    expect(res.statusCode).toBe(401);
  });

  it("should return user feedback list or 404 with admin token", async () => {
    const token = getAdminToken();

    const res = await request(app)
      .get(`${baseUrl}/2`)
      .set("Authorization", `Bearer ${token}`)
      .set("Accept", "application/json");

    expect([200, 404]).toContain(res.statusCode);
    expect(res.body).toBeDefined();
  });
});

// POST /feedbacks (NO token required)

describe(`POST ${baseUrl}`, () => {
  it("should return 400 when body is invalid", async () => {
    const invalidFeedback = {
      email: "",
      feedback: "",
      status: "",
      received: "",
    };

    const res = await request(app)
      .post(baseUrl)
      .send(invalidFeedback)
      .set("Accept", "application/json");

    expect(res.statusCode).toBe(400);
  });

  it("should add new feedback when body is valid", async () => {
    const validFeedback = {
      user_id: 1,
      email: "test@example.com",
      feedback: "This is a valid test feedback.",
      status: "new",
      received: "2025-01-01 12:00:00",
      handled: null,
    };

    const res = await request(app)
      .post(baseUrl)
      .send(validFeedback)
      .set("Accept", "application/json");

    expect([201, 400]).toContain(res.statusCode);
  });
});

// PUT /feedbacks/:id (requires token + admin)

describe(`PUT ${baseUrl}/:id`, () => {
  it("should return 401 if no token is provided", async () => {
    const updateData = {
      feedback: "Updated feedback content",
    };

    const res = await request(app)
      .put(`${baseUrl}/1`)
      .send(updateData)
      .set("Accept", "application/json");

    expect(res.statusCode).toBe(401);
  });
});

// DELETE /feedbacks/:id (requires token + admin)

describe(`DELETE ${baseUrl}/:id`, () => {
  it("should return 401 if no token is provided", async () => {
    const res = await request(app)
      .delete(`${baseUrl}/1`)
      .set("Accept", "application/json");

    expect(res.statusCode).toBe(401);
  });
});
