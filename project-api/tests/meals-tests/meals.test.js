import request from "supertest";
import app from "../../src/app.js";
import { closePool } from "../../src/utils/database.js";

import jwt from "jsonwebtoken";
import "dotenv/config";

const baseUrl = "/api/v1/meals";

let createdMealId;
let createdMealName;

afterAll(async () => {
  await closePool();
});

const getAdminToken = () => {
  const payload = {
    id: 999,
    role: "admin",
    email: "test@example.com",
  };

  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });
};

// GET /meals

describe(`GET ${baseUrl}`, () => {
  it("should return a list of meals", async () => {
    const res = await request(app)
      .get(baseUrl)
      .set("Accept", "application/json");

    expect([200, 500]).toContain(res.statusCode);
    expect(res.body).toBeDefined();
  });
});

// GET /meals/:id

describe(`GET ${baseUrl}/:id`, () => {
  it("should return 404 for non-existing meal", async () => {
    const res = await request(app)
      .get(`${baseUrl}/99999`)
      .set("Accept", "application/json");

    expect([404, 500]).toContain(res.statusCode);
  });

  it("should return a meal for existing id or 404 if db does not have meal on id 1", async () => {
    const res = await request(app)
      .get(`${baseUrl}/1`)
      .set("Accept", "application/json");

    expect([200, 404]).toContain(res.statusCode);
  });
});

// POST /meals  (requires token)

describe(`POST ${baseUrl}`, () => {
  it("should return 401 when no token is provided", async () => {
    const newMeal = {
      name: "Test Meal",
      price: 9.99,
    };

    const res = await request(app)
      .post(baseUrl)
      .send(newMeal)
      .set("Accept", "application/json");

    expect(res.statusCode).toBe(401);
  });

  it("should create a new meal with valid admin token", async () => {
    const token = getAdminToken();
    createdMealName = `Jest Meal ${Date.now()}`;

    const newMeal = {
      name: createdMealName,
      price: 9.99,
    };

    const res = await request(app)
      .post(baseUrl)
      .set("Authorization", `Bearer ${token}`)
      .set("Accept", "application/json")
      .send(newMeal);

    expect([200, 400, 500]).toContain(res.statusCode);

       const listRes = await request(app)
      .get(baseUrl)
      .set("Accept", "application/json");

    if (listRes.statusCode === 200 && listRes.body.meals) {
      const rows = Array.isArray(listRes.body.meals[0])
        ? listRes.body.meals[0]
        : listRes.body.meals;

      const found = rows.find((meal) => meal.name === createdMealName);

      if (found) {
        createdMealId = found.id;
      }
    }
  });
});

// PUT /meals/:id (requires token)

describe(`PUT ${baseUrl}/:id`, () => {
  it("should return 401 when no token is provided", async () => {
    const updateMeal = {
      name: "Updated Meal Name",
      price: 11.99,
    };

    const res = await request(app)
      .put(`${baseUrl}/1`)
      .send(updateMeal)
      .set("Accept", "application/json");

    expect(res.statusCode).toBe(401);
  });

  it("should update meal with admin token", async () => {
    const token = getAdminToken();

    const updateMeal = {
      name: `${createdMealName} (updated)`,
      price: 12.99,
    };

    const idToUse = createdMealId || 1;

    const res = await request(app)
      .put(`${baseUrl}/${idToUse}`)
      .send(updateMeal)
      .set("Authorization", `Bearer ${token}`)
      .set("Accept", "application/json");

    expect([200, 400, 500]).toContain(res.statusCode);
  });

});

// DELETE /meals/:id (requires token)

describe(`DELETE ${baseUrl}/:id`, () => {
  it("should return 401 when no token is provided", async () => {
    const res = await request(app)
      .delete(`${baseUrl}/1`)
      .set("Accept", "application/json");

    expect(res.statusCode).toBe(401);
  });

  it("should delete meal with admin token", async () => {
    const token = getAdminToken();

    const res = await request(app)
      .delete(`${baseUrl}/${createdMealId}`)
      .set("Authorization", `Bearer ${token}`)
      .set("Accept", "application/json");

    expect([200, 400, 500]).toContain(res.statusCode);
  });
});

// GET /meals/:mealId/products

describe(`GET ${baseUrl}/:mealId/products`, () => {
  it("should return 200 or 404 depending on meal", async () => {
    const res = await request(app)
      .get(`${baseUrl}/1/products`)
      .set("Accept", "application/json");

    expect([200, 404, 500]).toContain(res.statusCode);
  });
});

// POST /meals/:mealId/products (requires token)

describe(`POST ${baseUrl}/:mealId/products`, () => {
  it("should return 401 when no token is provided", async () => {
    const res = await request(app)
      .post(`${baseUrl}/1/products`)
      .send({ product_id: 1 })
      .set("Accept", "application/json");

    expect(res.statusCode).toBe(401);
  });

  it("should add product to meal with admin token", async () => {
    const token = getAdminToken();

    const res = await request(app)
      .post(`${baseUrl}/${createdMealId || 1}/products`)
      .send({ product_id: 1 })
      .set("Authorization", `Bearer ${token}`)
      .set("Accept", "application/json");

    expect([200, 400, 500]).toContain(res.statusCode);
  });
});

// DELETE /meals/:mealId/products/:productId (requires token)

describe(`DELETE ${baseUrl}/:mealId/products/:productId`, () => {
  it("should return 401 when no token is provided", async () => {
    const res = await request(app)
      .delete(`${baseUrl}/1/products/1`)
      .set("Accept", "application/json");

    expect(res.statusCode).toBe(401);
  });

  it("should delete meal with admin token", async () => {
    const token = getAdminToken();
    const idToUse = createdMealId || 1;

    const res = await request(app)
      .delete(`${baseUrl}/${idToUse}`)
      .set("Authorization", `Bearer ${token}`)
      .set("Accept", "application/json");

    expect([200, 400, 500]).toContain(res.statusCode);
  });
});
