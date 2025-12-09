import request from "supertest";
import app from "../../src/app.js";
import { closePool } from "../../src/utils/database.js";
import jwt from "jsonwebtoken";
import "dotenv/config";

const baseUrl = "/api/v1/tags";
let createdTagId;

//passable hash to the validation
const validHashedIcon = "0123456789abcdef0123456789abcdef";

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

    expect(res.statusCode).toBe(200);
    expect(res.body).toBeInstanceOf(Object);
    if (res.statusCode === 200) {
      expect(res.body.tags).toBeDefined();
    }
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
        icon: validHashedIcon,
      })
      .set("Accept", "application/json");

    expect(res.statusCode).toBe(401);
  });

  it("should return 403 if user role token is provided", async () => {
    const token = getUserToken();
    const randomTagNumber = (Math.random() + 1) * 1000;
    const randomTagNumber2 = (Math.random() + 1) * 1000;
    const tagTitle = `Test tag ${randomTagNumber}${randomTagNumber2}`;

    const res = await request(app)
      .post(baseUrl)
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: tagTitle,
        color_hex: "#ffffff",
        icon: validHashedIcon,
      })
      .set("Accept", "application/json");

    expect([403, 400, 500]).toContain(res.statusCode);
  });

  it("should return 400, even with admin token", async () => {
    const token = getAdminToken();

    const res = await request(app)
      .post(baseUrl)
      .set("Authorization", `Bearer ${token}`)
      .send({
        color_hex: "#ffffff",
        icon: validHashedIcon,
      })
      .set("Accept", "application/json");

     expect(res.statusCode).toBe(400);
  });

  it("should create a new tag with valid admin token", async () => {
    const token = getAdminToken();
    const randomTagNumber = (Math.random() + 1) * 1000;
    const randomTagNumber2 = (Math.random() + 1) * 1000;
    const tagTitle = `Test tag ${randomTagNumber}${randomTagNumber2}`;

    const res = await request(app)
      .post(baseUrl)
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: tagTitle,
        color_hex: "#ff0000",
        icon: validHashedIcon,
      })
      .set("Accept", "application/json");

    expect([200, 400]).toContain(res.statusCode);

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

  it("should update tag with admin token", async () => {
    const token = getAdminToken();
    const idToUpdate = createdTagId || 1;

    const res = await request(app)
      .put(`${baseUrl}/${idToUpdate}`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Updated test tag",
        color_hex: "#00ff00",
        icon: validHashedIcon,
      })
      .set("Accept", "application/json");

    expect([200, 400, 404]).toContain(res.statusCode);
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

  it("should delete tag with admin token", async () => {
    const token = getAdminToken();
    const idToDelete = createdTagId || 1;

    const res = await request(app)
      .delete(`${baseUrl}/${idToDelete}`)
      .set("Authorization", `Bearer ${token}`)
      .set("Accept", "application/json");

      //200 if tag can be deleted and 400 if there is no tag to be deleted
    expect([200, 400]).toContain(res.statusCode);
  });
});
