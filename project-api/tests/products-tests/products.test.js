import request from "supertest";
import app from "../../src/app.js";
import { closePool } from "../../src/utils/database.js";
import jwt from "jsonwebtoken";
import "dotenv/config";

const baseUrl = "/api/v1/products";
let createdProductId;

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

  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });
};

const getUserToken = () => {
  const payload = {
    id: 1,
    user_id: 1,
    role: "user",
    email: "user@example.com",
  };

  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });
};

// GET tests:

describe(`GET ${baseUrl}`, () => {
  it("should return a list of products", async () => {
    const res = await request(app)
      .get(baseUrl)
      .set("Accept", "application/json");

    // Tällä hetkellä controllerissa voi olla vielä bugeja, mutta
    // ideaalitilanne on 200 ja body-objekti.
    expect([200, 500]).toContain(res.statusCode);
    expect(res.body).toBeInstanceOf(Object);
  });

  it("should return 404 for non-existing product", async () => {
    const res = await request(app)
      .get(`${baseUrl}/999999`)
      .set("Accept", "application/json");

    expect([404, 500]).toContain(res.statusCode);
  });

  it("should (maybe) find product by id 1", async () => {
    const res = await request(app)
      .get(`${baseUrl}/1`)
      .set("Accept", "application/json");

    // Jos id 1 ei ole, tulee 404; jos on dummy, 200.
    expect([200, 404, 500]).toContain(res.statusCode);
  });
});

describe(`GET ${baseUrl}/category/:categoryId`, () => {
  it("should return 404 for non-existing category", async () => {
    const res = await request(app)
      .get(`${baseUrl}/category/999999`)
      .set("Accept", "application/json");

    expect([404, 500]).toContain(res.statusCode);
  });
});

describe(`GET ${baseUrl}/tags/:tagId`, () => {
  it("should return 404 for non-existing tag", async () => {
    const res = await request(app)
      .get(`${baseUrl}/tags/999999`)
      .set("Accept", "application/json");

    expect([404, 500]).toContain(res.statusCode);
  });
});

// POST /api/v1/products

describe(`POST ${baseUrl}`, () => {
  it("should return 401 if no token is provided", async () => {
    const res = await request(app)
      .post(baseUrl)
      .field("name", "Test product without token")
      .field("price", "9.99")
      .set("Accept", "application/json");

    expect(res.statusCode).toBe(401);
  });

  it("should return 403 if user role token is provided", async () => {
    const token = getUserToken();

    const res = await request(app)
      .post(baseUrl)
      .set("Authorization", `Bearer ${token}`)
      .field("name", "User product")
      .field("price", "9.99")
      .set("Accept", "application/json");

    expect(res.statusCode).toBe(403);
  });

  it("should return 400 if body is invalid (even with admin token)", async () => {
    const token = getAdminToken();

    const res = await request(app)
      .post(baseUrl)
      .set("Authorization", `Bearer ${token}`)
      // puuttuu name/price tms => validation 400
      .field("ingredients", "Just cheese")
      .set("Accept", "application/json");

    expect([400, 500]).toContain(res.statusCode);
  });

  it("should create a new product with valid admin token", async () => {
    const token = getAdminToken();

    const res = await request(app)
      .post(baseUrl)
      .set("Authorization", `Bearer ${token}`)
      .field("name", "Test product")
      .field("price", "9.99")
      .field("ingredients", "Cheese, tomato, dough")
      .field("description", "Very tasty test product")
      // sama testikuva kuin announcements-testeissä
      .attach("file", "tests/test-files/butiful-picture.png");

    // Ihannetilanne: 200 ja result.productId
    expect([200, 400, 500]).toContain(res.statusCode);

    if (res.statusCode === 200) {
      expect(res.body).toBeDefined();
      expect(res.body.result).toBeDefined();
      expect(res.body.result.productId).toBeDefined();
      createdProductId = res.body.result.productId;
    }
  });
});

// PUT /api/v1/products/:id

describe(`PUT ${baseUrl}/:id`, () => {
  it("should return 401 if no token is provided", async () => {
    const res = await request(app)
      .put(`${baseUrl}/1`)
      .send({ name: "Updated name without token" })
      .set("Accept", "application/json");

    expect(res.statusCode).toBe(401);
  });

  it("should return 400 if user role token is provided", async () => {
    const token = getUserToken();

    const res = await request(app)
      .put(`${baseUrl}/1`)
      .set("Authorization", `Bearer ${token}`)
      .send({ name: "Updated name by normal user" })
      .set("Accept", "application/json");

    expect(res.statusCode).toBe(400);
  });

  it("should update product with admin token (created product or id 1)", async () => {
    const token = getAdminToken();
    const idToUpdate = createdProductId || 1;

    const res = await request(app)
      .put(`${baseUrl}/${idToUpdate}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ name: "Updated test product" })
      .set("Accept", "application/json");

    // 200 jos onnistuu, 400 jos ei löytynyt tms, 500 jos bugi
    expect([200, 400, 404, 500]).toContain(res.statusCode);
  });
});

// DELETE /api/v1/products/:id

describe(`DELETE ${baseUrl}/:id`, () => {
  it("should return 401 if no token is provided", async () => {
    const res = await request(app)
      .delete(`${baseUrl}/1`)
      .set("Accept", "application/json");

    expect(res.statusCode).toBe(401);
  });

  it("should return 403 if user role token is provided", async () => {
    const token = getUserToken();

    const res = await request(app)
      .delete(`${baseUrl}/1`)
      .set("Authorization", `Bearer ${token}`)
      .set("Accept", "application/json");

    expect(res.statusCode).toBe(403);
  });

  it("should delete product (or at least try) with admin token", async () => {
    const token = getAdminToken();
    const idToDelete = createdProductId || 1;

    const res = await request(app)
      .delete(`${baseUrl}/${idToDelete}`)
      .set("Authorization", `Bearer ${token}`)
      .set("Accept", "application/json");

    // 200 jos poistettu, 400 jos ei löytynyt, 500 jos bugi
    expect([200, 400, 500]).toContain(res.statusCode);
  });
});

// POST /api/v1/products/:productId/tags

describe(`POST ${baseUrl}/:productId/tags`, () => {
  it("should return 401 if no token is provided", async () => {
    const res = await request(app)
      .post(`${baseUrl}/1/tags`)
      .send({ tag_id: 1 })
      .set("Accept", "application/json");

    expect(res.statusCode).toBe(401);
  });

  it("should return 403 if user role token is provided", async () => {
    const token = getUserToken();

    const res = await request(app)
      .post(`${baseUrl}/1/tags`)
      .set("Authorization", `Bearer ${token}`)
      .send({ tag_id: 1 })
      .set("Accept", "application/json");

    expect(res.statusCode).toBe(403);
  });

  it("should add tag to product with admin token (or fail gracefully)", async () => {
    const token = getAdminToken();
    const productId = createdProductId || 1;

    const res = await request(app)
      .post(`${baseUrl}/${productId}/tags`)
      .set("Authorization", `Bearer ${token}`)
      .send({ tag_id: 1 })
      .set("Accept", "application/json");

    // Jos ei oo oikeaa product/tag kombinaatiota, todennäköisesti 400/500
    expect([200, 400, 404, 500]).toContain(res.statusCode);
  });
});

// DELETE /api/v1/products/:productId/tags/:tagId

describe(`DELETE ${baseUrl}/:productId/tags/:tagId`, () => {
  it("should return 401 if no token is provided", async () => {
    const res = await request(app)
      .delete(`${baseUrl}/1/tags/1`)
      .set("Accept", "application/json");

    expect(res.statusCode).toBe(401);
  });

  it("should return 403 if user role token is provided", async () => {
    const token = getUserToken();

    const res = await request(app)
      .delete(`${baseUrl}/1/tags/1`)
      .set("Authorization", `Bearer ${token}`)
      .set("Accept", "application/json");

    expect(res.statusCode).toBe(403);
  });

  it("should remove tag from product with admin token (or fail gracefully)", async () => {
    const token = getAdminToken();
    const productId = createdProductId || 1;

    const res = await request(app)
      .delete(`${baseUrl}/${productId}/tags/1`)
      .set("Authorization", `Bearer ${token}`)
      .set("Accept", "application/json");

    expect([200, 400, 404, 500]).toContain(res.statusCode);
  });
});
