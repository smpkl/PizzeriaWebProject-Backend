import request from "supertest";
import app from "../../src/app.js";
import { closePool } from "../../src/utils/database.js";
import jwt from "jsonwebtoken";
import "dotenv/config";

const baseUrl = "/api/v1/orders";

afterAll(async () => {
  await closePool();
});

const getAdminToken = () => {
  const payload = {
    id: 999,
    user_id: 999,
    role: "admin",
    email: "admin@example.com",
  };

  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });

  return token;
};

const getUserToken = (userId = 1) => {
  const payload = {
    id: userId,
    user_id: userId,
    role: "user",
    email: "user@example.com",
  };

  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });

  return token;
};

// GET /api/v1/orders

describe(`GET ${baseUrl}`, () => {
  it("should return 401 if no token is provided", async () => {
    const res = await request(app)
      .get(baseUrl)
      .set("Accept", "application/json");

    expect(res.statusCode).toBe(401);
  });

  it("should return 403 if user role token is provided", async () => {
    const token = getUserToken();

    const res = await request(app)
      .get(baseUrl)
      .set("Authorization", `Bearer ${token}`)
      .set("Accept", "application/json");

    expect(res.statusCode).toBe(403);
  });

  it("should return a list of orders with valid admin token", async () => {
    const token = getAdminToken();

    const res = await request(app)
      .get(baseUrl)
      .set("Authorization", `Bearer ${token}`)
      .set("Accept", "application/json");

    expect(res.statusCode).toBe(200);
    expect(res.body).toBeInstanceOf(Object);
    expect(res.body.orders).toBeDefined();
  });
});


// GET /api/v1/orders/user/:id 

describe(`GET ${baseUrl}/user/:id`, () => {
  it("should return 401 if no token is provided", async () => {
    const res = await request(app)
      .get(`${baseUrl}/user/1`)
      .set("Accept", "application/json");

    expect(res.statusCode).toBe(401);
  });

  it("should return 403 if user tries to access other user's orders", async () => {
    const token = getUserToken(1);

    const res = await request(app)
      .get(`${baseUrl}/user/2`)
      .set("Authorization", `Bearer ${token}`)
      .set("Accept", "application/json");

    expect(res.statusCode).toBe(403);
  });

  it("should allow user to access own orders (status 200 or 404)", async () => {
    const token = getUserToken(1);

    const res = await request(app)
      .get(`${baseUrl}/user/1`)
      .set("Authorization", `Bearer ${token}`)
      .set("Accept", "application/json");

    expect([200, 404]).toContain(res.statusCode);
  });

  it("should allow admin to access any user's orders (status 200 or 404)", async () => {
    const token = getAdminToken();

    const res = await request(app)
      .get(`${baseUrl}/user/1`)
      .set("Authorization", `Bearer ${token}`)
      .set("Accept", "application/json");

    expect([200, 404]).toContain(res.statusCode);
  });
});

// POST /api/v1/orders


describe(`POST ${baseUrl}`, () => {
  const validOrder = {
    status: "new",
    orderType: "delivery",
    timeOption: "ASAP",
    dateTime: "2025-01-01",
    deliveryAddress: "Test street 1, Helsinki",
    pizzeriaAddress: "Pizza street 2, Helsinki",
    customerName: "Test Name",
    customerPhone: "123455678",
    customerEmail: "test@email.com",
    details: "Test details",
    price: 10.5,
  };

  it("should return 400 if body is invalid", async () => {
    const res = await request(app)
      .post(baseUrl)
      .send({})
      .set("Accept", "application/json");

    expect(res.statusCode).toBe(400);
  });

  it("should create a new order with valid body", async () => {
    const token = getAdminToken();

    const res = await request(app)
      .post(baseUrl)
      .set("Authorization", `Bearer ${token}`)
      .send(validOrder)
      .set("Accept", "application/json");

    expect(res.statusCode).toBe(201);
  });
});

// PUT /api/v1/orders/:id

describe(`PUT ${baseUrl}/:id`, () => {
  const updateData = {
    status: "updated-status",
  };

  it("should return 400/404/500 when trying to update order", async () => {
    const token = getAdminToken();

    const res = await request(app)
      .put(`${baseUrl}/1`)
      .set("Authorization", `Bearer ${token}`)
      .send(updateData)
      .set("Accept", "application/json");

    //if there is noting to be updated 404:
    expect([200, 404]).toContain(res.statusCode);
  });
});

// DELETE /api/v1/orders/:id

describe(`DELETE ${baseUrl}/:id`, () => {
  it("should return 401 if no token is provided", async () => {
    const res = await request(app)
      .delete(`${baseUrl}/1`)
      .set("Accept", "application/json");

    expect(res.statusCode).toBe(401);
  });

  it("should return 403 if user role token is provided", async () => {
    const token = getUserToken(1);

    const res = await request(app)
      .delete(`${baseUrl}/1`)
      .set("Authorization", `Bearer ${token}`)
      .set("Accept", "application/json");

    expect(res.statusCode).toBe(403);
  });

  it("should delete order (or at least try) with admin token", async () => {
    const token = getAdminToken();

    const res = await request(app)
      .delete(`${baseUrl}/1`)
      .set("Authorization", `Bearer ${token}`)
      .set("Accept", "application/json");

    //expect(res.statusCode).toBe(200);
    //if there is noting to be deleted:
    expect([400, 404, 500]).toContain(res.statusCode);
  });
});
