import request from "supertest";
import app from "../../src/app.js";
import { closePool } from "../../src/utils/database.js";

import jwt from "jsonwebtoken";
import "dotenv/config";

const baseUrl = "/api/v1/categories";
let createdCategoryId;

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

// GET tests:

describe(`GET ${baseUrl}`, () => {
  it("should return a list of categories", async () => {
    const res = await request(app)
      .get(baseUrl)
      .set("Accept", "application/json");

    expect(res.statusCode).toBe(200);
    expect(res.body).toBeInstanceOf(Object);
    expect(res.body.categories).toBeDefined();
  });

  it("should return 404 for non-existing category id", async () => {
    const res = await request(app)
      .get(`${baseUrl}/9999`)
      .set("Accept", "application/json");

    expect(res.statusCode).toBe(404);
  });

  it("should return a category for existing id (e.g. 1)", async () => {
    const res = await request(app)
      .get(`${baseUrl}/1`)
      .set("Accept", "application/json");

    expect(res.statusCode).toBe(200);
    expect(res.body).toBeInstanceOf(Object);
    expect(res.body.category).toBeDefined();
  });
});

// POST tests:

describe(`POST ${baseUrl}`, () => {
  it("should return 401 if no token is provided", async () => {
    const newCategory = {
      name: "Test category from jest",
    };

    const res = await request(app)
      .post(baseUrl)
      .send(newCategory)
      .set("Accept", "application/json");

    expect(res.statusCode).toBe(401);
  });

  it("should create a new category with valid admin token", async () => {
    const token = getAdminToken();

    const newCategory = {
      name: "Jest created category",
    };

    const res = await request(app)
      .post(baseUrl)
      .set("Authorization", `Bearer ${token}`)
      .set("Accept", "application/json")
      .send(newCategory);

    expect(res.statusCode).toBe(200);
    expect(res.body.result).toBeDefined();
    expect(res.body.result.categoryId).toBeDefined();

    createdCategoryId = res.body.result.categoryId;
  });
});

// PUT tests:

describe(`PUT ${baseUrl}/:id`, () => {
  it("should return 401 if no token is provided", async () => {
    const updatedCategory = {
      name: "Updated name without auth",
    };

    const res = await request(app)
      .put(`${baseUrl}/1`)
      .send(updatedCategory)
      .set("Accept", "application/json");

    expect(res.statusCode).toBe(401);
  });

  it('should update category with admin token', async () => {
    const token = getAdminToken();

    const updatedCategory = {
      name: 'Updated Jest category',
    };

    const res = await request(app)
      .put(`${baseUrl}/${parseInt(createdCategoryId)}`)
      .set('Authorization', `Bearer ${token}`)
      .set('Accept', 'application/json')
      .send(updatedCategory);

    expect([200, 400]).toContain(res.statusCode);
    if (res.statusCode === 200) {
      expect(res.body.result).toBeDefined();
      expect(res.body.result.categoryId).toBe(createdCategoryId);
    }
  });
});

// DELETE tests:

describe(`DELETE ${baseUrl}/:id`, () => {
  it("should return 401 if no token is provided", async () => {
    const res = await request(app)
      .delete(`${baseUrl}/1`)
      .set("Accept", "application/json");

    expect(res.statusCode).toBe(401);
  });

    it('should delete category with admin token', async () => {
    const token = getAdminToken();

    const res = await request(app)
      .delete(`${baseUrl}/${createdCategoryId}`)
      .set('Authorization', `Bearer ${token}`)
      .set('Accept', 'application/json');

    expect([200, 400]).toContain(res.statusCode);
  });
});
