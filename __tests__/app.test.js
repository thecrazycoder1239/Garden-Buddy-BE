const request = require("supertest");
const { seed } = require("../db/seed");
const db = require("../db");
const app = require("../app");
const bcrypt = require("bcrypt");

beforeEach(() => {
  return seed(`
  INSERT INTO users 
    (username, first_name, last_name, hash)
  VALUES
    ('username','user','name','$2b$10$yjRrtd2cr3xO5sw/Nky/6.s7vLtiUfK7CfKqwY5GRJOPZCcZKLZQq')
  `); //The hash is for the password 'password'
});

afterAll(() => {
  db.end();
});

describe("app", () => {
  describe("/users", () => {
    describe("POST", () => {
      it("201: responds with user without password", () => {
        return request(app)
          .post("/api/users")
          .send({
            username: "valid_username",
            password: "password1",
            first_name: "Foo",
            last_name: "Bar",
          })
          .expect(201)
          .then(({ body }) => {
            const { user } = body;

            expect(user).toMatchObject({
              username: "valid_username",
              first_name: "Foo",
              last_name: "Bar",
            });
            expect(user).not.toHaveProperty("password");
          });
      });
      it("201: adds hashed password to the database", () => {
        return request(app)
          .post("/api/users")
          .send({
            username: "valid_username",
            password: "password1",
            first_name: "Foo",
            last_name: "Bar",
          })
          .expect(201)
          .then(() => {
            return db.query(`
          SELECT hash FROM USERS
          WHERE username = 'valid_username'
          `);
          })
          .then(({ rows }) => {
            const { hash } = rows[0];
            return bcrypt.compare("password1", hash);
          })
          .then((result) => {
            expect(result).toBe(true);
          });
      });
      it('409: returns error - "username already exists" when duplicate username', () => {
        return request(app)
          .post("/api/users")
          .send({
            username: "valid_username",
            password: "password1",
            first_name: "Foo",
            last_name: "Bar",
          })
          .then(() => {
            return request(app)
              .post("/api/users")
              .send({
                username: "valid_username",
                password: "password1",
                first_name: "Foo",
                last_name: "Bar",
              })
              .expect(409);
          })
          .then(({ body }) => {
            const { msg } = body;
            expect(msg).toBe("Username already exists!");
          });
      });
      it("400: returns an error message when field is too long", () => {
        return Promise.all(
          [
            { field: "username", maxLength: 30 },
            { field: "first_name", maxLength: 30 },
            { field: "last_name", maxLength: 50 },
          ].map((userRestraints) => {
            const body = {
              username: "valid_username",
              password: "password1",
              first_name: "Foo",
              last_name: "Bar",
            };
            const { field, maxLength } = userRestraints;
            body[field] = "a".repeat(51);
            return request(app)
              .post("/api/users")
              .send(body)
              .expect(400)
              .then(({ body }) => {
                const { msg } = body;
                expect(msg).toBe(
                  `${field} too long, maximum ${maxLength} characters`
                );
              });
          })
        );
      });
      it("400: returns missing field when not all fields are completed", () => {
        return request(app)
          .post("/api/users")
          .send({
            username: "valid_username",
            password: "password1",
            first_name: "Foo",
          })
          .expect(400)
          .then(({ body }) => {
            const { msg } = body;
            expect(msg).toBe("Missing required field");
          });
      });
    });
  });

  describe("/users/:username", () => {
    describe("GET", () => {
      it("200: returns user without password", () => {
        return request(app)
          .get("/api/users/username")
          .expect(200)
          .then(({ body }) => {
            const { user } = body;

            expect(user).toMatchObject({
              username: "username",
              first_name: "user",
              last_name: "name",
            });
            expect(user).not.toHaveProperty("password");
          });
      });

      it('404: returns "user not found" when no user with username', () => {
        return request(app)
          .get("/api/users/usernam")
          .expect(404)
          .then(({ body }) => {
            const { msg } = body;

            expect(msg).toBe("user not found");
          });
      });
    });

    describe("DELETE", () => {
      it("204: deletes a user from database when given correct password in body", () => {
        return request(app)
          .delete("/api/users/username")
          .send({
            password: "password",
          })
          .expect(204)
          .then(() => {
            return db.query(`
            SELECT * FROM users
            WHERE username = 'username'
            `);
          })
          .then(({ rows }) => {
            expect(rows).toHaveLength(0);
          });
      });

      it("403: returns forbidden when incorrect password is provided for user", () => {
        return request(app)
          .delete("/api/users/username")
          .expect(403)
          .send({
            password: "password1",
          })
          .then(() => {
            return db.query(`
            SELECT * FROM users
            WHERE username = 'username'
            `);
          })
          .then(({ rows }) => {
            expect(rows).toHaveLength(1);
          });
      });

      it('404: returns "user not found" when user does not exist', () => {
        return request(app)
          .delete("/api/users/invalid_username")
          .send({
            password: "pass",
          })
          .expect(404)
          .then(({ body }) => {
            const { msg } = body;

            expect(msg).toBe("user not found");
          });
      });

      it('400: returns "empty password field" when password is not sent with request ', () => {
        return request(app)
          .delete("/api/users/username")
          .expect(400)
          .then(({ body }) => {
            const { msg } = body;

            expect(msg).toBe("empty password field");
          });
      });
    });
  });

  describe("/users/:username/plants", () => {
    describe("POST", () => {
      it("201: Returns added plant", () => {
        return request(app)
          .post("/api/users/username/plants")
          .send({
            password: "password",
            plant_id: 7,
            planted_date: "2023-04-01",
          })
          .expect(201)
          .then(({ body }) => {
            const { plant } = body;
            expect(plant).toMatchObject({
              plant_id: 7,
              users_plant_id: expect.any(Number),
              username: "username",
              planted_date: expect.any(String),
              tasks: expect.any(Array),
            });
          });
      });

      it("403: returns forbidden when incorrect password is provided for user", () => {
        return request(app)
          .post("/api/users/username/plants")
          .send({
            password: "password1",
            plant_id: 7,
            planted_date: "2023-04-01",
          })
          .expect(403);
      });

      it("400: returns missing field when not all fields are completed", () => {
        return request(app)
          .post("/api/users/username/plants")
          .send({
            password: "password",
            planted_date: "2023-04-01",
          })
          .expect(400)
          .then(({ body }) => {
            const { msg } = body;
            expect(msg).toBe("Missing required field");
          });
      });

      it('400: returns "invalid date" when date not a valid date', () => {
        return request(app)
          .post("/api/users/username/plants")
          .send({
            password: "password",
            plant_id: 7,
            planted_date: "2023-13-42",
          })
          .expect(400)
          .then(({ body }) => {
            const { msg } = body;
            expect(msg).toBe("Invalid date");
          });
      });

      it('400: returns "invalid date" when date not a valid date', () => {
        return request(app)
          .post("/api/users/username/plants")
          .send({
            password: "password",
            plant_id: 7,
            planted_date: "2023-thirteen-42",
          })
          .expect(400)
          .then(({ body }) => {
            const { msg } = body;
            expect(msg).toBe("Invalid date");
          });
      });

      it('400: returns "Invalid plant id" when date not a valid plant id', () => {
        return request(app)
          .post("/api/users/username/plants")
          .send({
            password: "password",
            plant_id: "seven",
            planted_date: "2023-12-25",
          })
          .expect(400)
          .then(({ body }) => {
            const { msg } = body;
            expect(msg).toBe("Invalid plant id");
          });
      });
    });
  });
});
