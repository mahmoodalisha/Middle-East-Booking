const request = require("supertest");
const app = require("../../app");


describe("POST /api/auth/register", () => {

  test("should register a new user", async () => {

    const response = await request(app)
      .post("/api/auth/register")
      .send({
        username: "testuser123",
        email: "testuser123@gmail.com",
        password: "password123",
      });

    expect(response.status).toBe(200);
    expect(response.text).toBe("User has been created.");
  });


  test("should not register with duplicate username", async () => {

    await request(app)
      .post("/api/auth/register")
      .send({
        username: "duplicateuser",
        email: "duplicate1@gmail.com",
        password: "password123",
      });

    const response = await request(app)
      .post("/api/auth/register")
      .send({
        username: "duplicateuser",
        email: "duplicate2@gmail.com",
        password: "password123",
      });

    expect(response.status).toBe(409);
    expect(response.body.message).toBe(
      "username already exists."
    );
  });


  test("should not register with duplicate email", async () => {

    await request(app)
      .post("/api/auth/register")
      .send({
        username: "duplicateemail1",
        email: "duplicate@gmail.com",
        password: "password123",
      });

    const response = await request(app)
      .post("/api/auth/register")
      .send({
        username: "duplicateemail2",
        email: "duplicate@gmail.com",
        password: "password123",
      });

    expect(response.status).toBe(409);
    expect(response.body.message).toBe(
      "email already exists."
    );
  });


  test("should not register without username", async () => {

    const response = await request(app)
      .post("/api/auth/register")
      .send({
        email: "nousername@gmail.com",
        password: "password123",
      });

    expect(response.status).toBe(400);

    expect(response.body.message).toBe(
      "Username, email and password are required."
    );
  });


  test("should not register without email", async () => {

    const response = await request(app)
      .post("/api/auth/register")
      .send({
        username: "noemail",
        password: "password123",
      });

    expect(response.status).toBe(400);

    expect(response.body.message).toBe(
      "Username, email and password are required."
    );
  });


  test("should not register without password", async () => {

    const response = await request(app)
      .post("/api/auth/register")
      .send({
        username: "nopassword",
        email: "nopassword@gmail.com",
      });

    expect(response.status).toBe(400);

    expect(response.body.message).toBe(
      "Username, email and password are required."
    );
  });

});


describe("POST /api/auth/login", () => {

  test("should login an existing user", async () => {

    await request(app)
      .post("/api/auth/register")
      .send({
        username: "loginuser123",
        email: "loginuser123@gmail.com",
        password: "password123",
      });

    const response = await request(app)
      .post("/api/auth/login")
      .send({
        email: "loginuser123@gmail.com",
        password: "password123",
      });

    expect(response.status).toBe(200);
    expect(response.body.token).toBeDefined();
    expect(response.body.username).toBe("loginuser123");
  });


  test("should not login with nonexistent email", async () => {

    const response = await request(app)
      .post("/api/auth/login")
      .send({
        email: "doesnotexist@gmail.com",
        password: "password123",
      });

    expect(response.status).toBe(404);

    expect(response.body.message).toBe(
      "User not found!"
    );
  });


  test("should not login with wrong password", async () => {

    await request(app)
      .post("/api/auth/register")
      .send({
        username: "wrongpassword",
        email: "wrongpassword@gmail.com",
        password: "correctpassword",
      });

    const response = await request(app)
      .post("/api/auth/login")
      .send({
        email: "wrongpassword@gmail.com",
        password: "wrongpassword",
      });

    expect(response.status).toBe(400);

    expect(response.body.message).toBe(
      "Wrong email or password!"
    );
  });


  test("should not login without email", async () => {

    const response = await request(app)
      .post("/api/auth/login")
      .send({
        password: "password123",
      });

    expect(response.status).toBe(400);

    expect(response.body.message).toBe(
      "Email and password are required."
    );
  });


  test("should not login without password", async () => {

    const response = await request(app)
      .post("/api/auth/login")
      .send({
        email: "someuser@gmail.com",
      });

    expect(response.status).toBe(400);

    expect(response.body.message).toBe(
      "Email and password are required."
    );
  });

});