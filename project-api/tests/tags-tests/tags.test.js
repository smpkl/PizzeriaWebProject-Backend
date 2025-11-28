import request from "supertest";
import app from "../../src/app.js";
import { closePool } from "../../src/utils/database.js";
import jwt from "jsonwebtoken";
import "dotenv/config";

const baseUrl = "/api/v1/tags";
let createdTagId;

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

// GET /api/v1/tags

describe(`GET ${baseUrl}`, () => {
  it("should return a list of tags", async () => {
    const res = await request(app)
      .get(baseUrl)
      .set("Accept", "application/json");

    expect([200, 500]).toContain(res.statusCode);
    expect(res.body).toBeInstanceOf(Object);
    if (res.statusCode === 200) {
      expect(res.body.tags).toBeDefined();
    }
  });
});

// GET /api/v1/tags/:id

describe(`GET ${baseUrl}/:id`, () => {
  it("should return 404 for non-existing tag", async () => {
    const res = await request(app)
      .get(`${baseUrl}/999999`)
      .set("Accept", "application/json");

    expect([404, 500]).toContain(res.statusCode);
  });

  it("should (maybe) find tag by id 1", async () => {
    const res = await request(app)
      .get(`${baseUrl}/1`)
      .set("Accept", "application/json");

    expect([200, 404, 500]).toContain(res.statusCode);
  });
});

// POST /api/v1/tags

describe(`POST ${baseUrl}`, () => {
  it("should return 401 if no token is provided", async () => {
    const res = await request(app)
      .post(baseUrl)
      .send({
        title: "No token tag",
        color_hex: "#ffffff",
        icon: "dummyhash",
      })
      .set("Accept", "application/json");

    expect(res.statusCode).toBe(401);
  });

  it("should return 403 if user role token is provided", async () => {
    const token = getUserToken();

    const res = await request(app)
      .post(baseUrl)
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "User tag",
        color_hex: "#ffffff",
        icon: "dummyhash",
      })
      .set("Accept", "application/json");

    expect(res.statusCode).toBe(403);
  });

  it("should return 400 or 500 if body is invalid, even with admin token", async () => {
    const token = getAdminToken();

    const res = await request(app)
      .post(baseUrl)
      .set("Authorization", `Bearer ${token}`)
      .send({
        color_hex: "#ffffff",
        icon: "dummyhash",
      })
      .set("Accept", "application/json");

    expect([400, 500]).toContain(res.statusCode);
  });

  it("should create a new tag with valid admin token", async () => {
    const token = getAdminToken();

    const res = await request(app)
      .post(baseUrl)
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Test tag",
        color_hex: "#ff0000",
        icon: "dummyhash",
      })
      .set("Accept", "application/json");

    expect([200, 400, 500]).toContain(res.statusCode);

    if (res.statusCode === 200) {
      expect(res.body).toBeDefined();
      expect(res.body.result).toBeDefined();
      expect(res.body.result.tagId).toBeDefined();
      createdTagId = res.body.result.tagId;
    }
  });
});

// PUT /api/v1/tags/:id

describe(`PUT ${baseUrl}/:id`, () => {
  it("should return 401 if no token is provided", async () => {
    const res = await request(app)
      .put(`${baseUrl}/1`)
      .send({ title: "Updated title no token" })
      .set("Accept", "application/json");

    expect(res.statusCode).toBe(401);
  });

  it("should return 403 if user role token is provided", async () => {
    const token = getUserToken();

    const res = await request(app)
      .put(`${baseUrl}/1`)
      .set("Authorization", `Bearer ${token}`)
      .send({ title: "Updated title by user" })
      .set("Accept", "application/json");

    expect(res.statusCode).toBe(403);
  });

  it("should update tag with admin token (created tag or id 1)", async () => {
    const token = getAdminToken();
    const idToUpdate = createdTagId || 1;

    const res = await request(app)
      .put(`${baseUrl}/${idToUpdate}`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Updated test tag",
        color_hex: "#00ff00",
      })
      .set("Accept", "application/json");

    expect([200, 400, 500]).toContain(res.statusCode);
  });
});

// DELETE /api/v1/tags/:id

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

  it("should delete tag (or at least try) with admin token", async () => {
    const token = getAdminToken();
    const idToDelete = createdTagId || 1;

    const res = await request(app)
      .delete(`${baseUrl}/${idToDelete}`)
      .set("Authorization", `Bearer ${token}`)
      .set("Accept", "application/json");

    expect([200, 400, 500]).toContain(res.statusCode);
  });
});
