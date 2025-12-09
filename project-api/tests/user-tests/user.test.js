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
  const token = getAdminToken();
  it("should return 404 for non-existing user", async () => {
    const res = await request(app)
      .get(`${baseUrl}/999999`)
      .set("Authorization", `Bearer ${token}`)
      .set("Accept", "application/json");

    expect(res.statusCode).toBe(404);
  });

  it("should maybe find user by id 1 (or return 404)", async () => {
    const res = await request(app)
      .get(`${baseUrl}/1`)
      .set("Authorization", `Bearer ${token}`)
      .set("Accept", "application/json");

    expect([200, 404]).toContain(res.statusCode);

    if (res.statusCode === 200) {
      expect(res.body).toBeDefined();
    }
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
        phonenumber: "0123456789",
        address: "Testikatu 1, 00100 Helsinki",
        password: "salasana123456",
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
    const uniqueEmail = `user-admin-test+${Date.now()}@example.com`;

    const res = await request(app)
      .post(`${baseUrl}/admin`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        first_name: "Test",
        last_name: "User",
        email: uniqueEmail,
        phonenumber: "0123456789",
        address: "Testikatu 1, 00100 Helsinki",
        password: "salasana123456",
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
        first_name: "Test",
        last_name: "User",
        email: uniqueEmail,
        phonenumber: "0123456789",
        address: "Testikatu 1, 00100 Helsinki",
        password: "salasana123456",
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
    const uniqueEmail = `deleteuser${Date.now()}@example.com`;

    const createRes = await request(app)
      .post(baseUrl)
      .send({
        first_name: "Delete",
        last_name: "Me",
        email: uniqueEmail,
        phonenumber: "0123456789",
        address: "Poistokatu 1, 00100 Helsinki",
        password: "salasana123",
      })
      .set("Accept", "application/json");

    expect(createRes.statusCode).toBe(200);

    const newUserId = createRes.body.result.user_id;
    const userToken = jwt.sign(
      {
        id: newUserId,
        user_id: newUserId,
        role: "user",
        email: uniqueEmail,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    const deleteRes = await request(app)
      .delete(`${baseUrl}/${newUserId}`)
      .set("Authorization", `Bearer ${userToken}`)
      .set("Accept", "application/json");

    expect(deleteRes.statusCode).toBe(200);
  });
});
