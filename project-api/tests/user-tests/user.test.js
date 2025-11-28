import request from "supertest";
import app from "../../src/app.js";
import { closePool } from "../../src/utils/database.js";
import jwt from "jsonwebtoken";
import "dotenv/config";

const baseUrl = "/api/v1/users";

let createdUserId;
let createdAdminId;

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

const getUserToken = (userId = 1) => {
  const payload = {
    id: userId,
    user_id: userId,
    role: "user",
    email: "user@example.com",
  };

  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });
};

//GET /api/v1/users  (token pakollinen)

describe(`GET ${baseUrl}`, () => {
  it("should return 401 if no token is provided", async () => {
    const res = await request(app)
      .get(baseUrl)
      .set("Accept", "application/json");

    expect(res.statusCode).toBe(401);
  });

  it("should return 200 or 403 with user token (depending on future role checks)", async () => {
    const token = getUserToken();

    const res = await request(app)
      .get(baseUrl)
      .set("Authorization", `Bearer ${token}`)
      .set("Accept", "application/json");

    expect(res.statusCode).toBe(200);
    if (res.statusCode === 200) {
      expect(res.body).toBeInstanceOf(Object);
      expect(res.body.users).toBeDefined();
    }
  });

  it("should return 200 with admin token (or 403 if you later change logic)", async () => {
    const token = getAdminToken();

    const res = await request(app)
      .get(baseUrl)
      .set("Authorization", `Bearer ${token}`)
      .set("Accept", "application/json");

    expect(res.statusCode).toBe(200);
    if (res.statusCode === 200) {
      expect(res.body).toBeInstanceOf(Object);
      expect(res.body.users).toBeDefined();
    }
  });
});

//GET /api/v1/users/:id


describe(`GET ${baseUrl}/:id`, () => {
  it("should return 404 for non-existing user", async () => {
    const res = await request(app)
      .get(`${baseUrl}/999999`)
      .set("Accept", "application/json");

    expect(res.statusCode).toBe(404);
  });

  it("should maybe find user by id 1 (or return 404)", async () => {
    const res = await request(app)
      .get(`${baseUrl}/1`)
      .set("Accept", "application/json");

    expect(res.statusCode).toBe(200);
  });
});



describe(`POST ${baseUrl}`, () => {
  it("should return 400 if body is invalid", async () => {
    const res = await request(app)
      .post(baseUrl)
      .send({})
      .set("Accept", "application/json");

    expect(res.statusCode).toBe(400);
  });

  it("should create a new regular user with valid body", async () => {
    const uniqueEmail = `testuser+${Date.now()}@example.com`;

    const res = await request(app)
      .post(baseUrl)
      .send({
        first_name: "Test",
        last_name: "User",
        email: uniqueEmail,
        address: "Test street 1, Helsinki",
        password: "supersecret",
      })
      .set("Accept", "application/json");

    expect(res.statusCode).toBe(200);

    if (res.statusCode === 200) {
      expect(res.body).toBeDefined();
      expect(res.body.result).toBeDefined();
      expect(res.body.result.user_id).toBeDefined();
      createdUserId = res.body.result.user_id;
    }
  });
});

//POST /api/v1/users/admin  (uuden adminin luonti, vaatii tokenin ja roolin)


describe(`POST ${baseUrl}/admin`, () => {
  it("should return 401 if no token is provided", async () => {
    const res = await request(app)
      .post(`${baseUrl}/admin`)
      .send({
        first_name: "Admin",
        last_name: "User",
        email: "no-token-admin@example.com",
        address: "Admin street 1, Helsinki",
        password: "adminsecret",
      })
      .set("Accept", "application/json");

    expect(res.statusCode).toBe(401);
  });

  it("should return 403 if user role token is provided", async () => {
    const token = getUserToken();

    const res = await request(app)
      .post(`${baseUrl}/admin`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        first_name: "Admin",
        last_name: "User",
        email: "user-trying-admin@example.com",
        address: "Admin street 1, Helsinki",
        password: "adminsecret",
      })
      .set("Accept", "application/json");

    expect(res.statusCode).toBe(403);
  });

  it("should create a new admin with valid admin token and body", async () => {
    const token = getAdminToken();
    const uniqueEmail = `newadmin+${Date.now()}@example.com`;

    const res = await request(app)
      .post(`${baseUrl}/admin`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        first_name: "New",
        last_name: "Admin",
        email: uniqueEmail,
        address: "Admin street 2, Helsinki",
        password: "anothersecret",
      })
      .set("Accept", "application/json");

    expect(res.statusCode).toBe(200);

    if (res.statusCode === 200) {
      expect(res.body).toBeDefined();
      expect(res.body.result).toBeDefined();
      expect(res.body.result.user_id).toBeDefined();
      createdAdminId = res.body.result.user_id;
    }
  });
});

//PUT /api/v1/users/:id
/*
describe(`PUT ${baseUrl}/:id`, () => {
  it("should return 401 if no token is provided", async () => {
    const res = await request(app)
      .put(`${baseUrl}/1`)
      .send({ first_name: "NoToken" })
      .set("Accept", "application/json");

    expect(res.statusCode).toBe(401);
  });

  it("should return 403 if user tries to update someone else", async () => {
    const token = getUserToken(1);

    const res = await request(app)
      .put(`${baseUrl}/2`)
      .set("Authorization", `Bearer ${token}`)
      .send({ first_name: "ShouldNotWork" })
      .set("Accept", "application/json");

    expect(res.statusCode).toBe(403);
  });

  it("should allow user to update own info", async () => {
    const userId = createdUserId || 1;
    const token = getUserToken(userId);

    const res = await request(app)
      .put(`${baseUrl}/${userId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        first_name: "Updated",
        last_name: "User",
        email: `updated+${Date.now()}@example.com`,
        address: "Updated street 1, Helsinki",
        password: "updatedsecret",
      })
      .set("Accept", "application/json");

    expect(res.statusCode).toBe(200);
  });

  it("should allow admin to update any user", async () => {
    const token = getAdminToken();
    const targetId = createdUserId || 1;

    const res = await request(app)
      .put(`${baseUrl}/${targetId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        first_name: "AdminUpdated",
        last_name: "Target",
        email: `admin-updated+${Date.now()}@example.com`,
        address: "Admin updated street, Helsinki",
        password: "adminupdated",
      })
      .set("Accept", "application/json");

    expect(res.statusCode).toBe(200);
  });
});
*/

//DELETE /api/v1/users/:id

describe(`DELETE ${baseUrl}/:id`, () => {
  it("should return 401 if no token is provided", async () => {
    const res = await request(app)
      .delete(`${baseUrl}/1`)
      .set("Accept", "application/json");

    expect(res.statusCode).toBe(401);
  });

  it("should return 403 if user tries to delete someone else", async () => {
    const token = getUserToken(1);

    const res = await request(app)
      .delete(`${baseUrl}/2`)
      .set("Authorization", `Bearer ${token}`)
      .set("Accept", "application/json");

    expect(res.statusCode).toBe(403);
  });

  it("should allow user to delete own account", async () => {
    const userId = createdUserId || 1;
    const token = getUserToken(userId);

    const res = await request(app)
      .delete(`${baseUrl}/${userId}`)
      .set("Authorization", `Bearer ${token}`)
      .set("Accept", "application/json");

    expect(res.statusCode).toBe(200);
  });

});
