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
    ('username','user','name','$2b$10$yjRrtd2cr3xO5sw/Nky/6.s7vLtiUfK7CfKqwY5GRJOPZCcZKLZQq'),
    ('username2','user2','name2','$2b$10$J/HwEpPa09Sm.syOCca73uQviX37jFp9ynShQNBb6rbmXbeLQQHNS');

  INSERT INTO tasks
    (task_slug, description)
  VALUES
    ('water', 'give plants some aqua'),
    ('fertilize', 'give plants some nutrients');

  INSERT INTO users_plants
    (username, plant_id, planted_date)
  VALUES
    ('username', 10, '2023-03-29'),
    ('username2', 4, NULL),
    ('username', 6, NULL),
    ('username', 1, NULL),
    ('username2', 10, NULL),
    ('username', 10, '2022-03-29');

  INSERT INTO users_plants_tasks
    (users_plant_id, task_slug, task_start_date)
  VALUES
    (2, 'water', '2023-05-02'),
    (2, 'water', '2023-05-03'),
    (2, 'fertilize', '2023-05-03'),
    (3, 'water', '2023-04-01')
  `); //The hash is for the password 'password'
  // The password for any username is passsword + addedNumber
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

  describe("/users-plants/:users_plant_id/tasks", () => {
    describe("POST", () => {
      it("201: responds with newly created task", () => {
        return request(app)
          .post("/api/users-plants/1/tasks")
          .send({
            password: "password",
            task_slug: "water",
            task_start_date: "2023-04-01",
          })
          .expect(201)
          .then(({ body }) => {
            const { task } = body;

            expect(task).toMatchObject({
              users_task_id: expect.any(Number),
              users_plant_id: 1,
              task_slug: "water",
              task_start_date: expect.any(String),
            });
          });
      });

      it("403: responds with forbidden when given incorrect password", () => {
        return request(app)
          .post("/api/users-plants/1/tasks")
          .send({
            password: "password1",
            task_slug: "water",
            task_start_date: "2023-04-1",
          })
          .expect(403);
      });

      it('400: responds "empty password field" if given no password', () => {
        return request(app)
          .post("/api/users-plants/1/tasks")
          .send({
            task_slug: "water",
            task_start_date: "2023-04-1",
          })
          .expect(400)
          .then(({ body }) => {
            const { msg } = body;

            expect(msg).toBe("empty password field");
          });
      });

      it('404: responds with "plant not found" when given non-existent users_plant_id', () => {
        return request(app)
          .post("/api/users-plants/4903295/tasks")
          .send({
            password: "password",
            task_slug: "water",
            task_start_date: "2023-04-1",
          })
          .expect(404)
          .then(({ body }) => {
            const { msg } = body;

            expect(msg).toBe("plant not found");
          });
      });

      it("400: responds when plant id is not numeric", () => {
        return request(app)
          .post("/api/users-plants/invalid_id/tasks")
          .send({
            password: "password",
            task_slug: "water",
            task_start_date: "2023-04-01",
          })
          .expect(400)
          .then(({ body }) => {
            const { msg } = body;

            expect(msg).toBe("Invalid plant id");
          });
      });

      it("404: responds when no task with task_slug", () => {
        return request(app)
          .post("/api/users-plants/1/tasks")
          .send({
            password: "password",
            task_slug: "not_a_task",
            task_start_date: "2023-04-05",
          })
          .expect(404)
          .then(({ body }) => {
            const { msg } = body;

            expect(msg).toBe("task not found");
          });
      });

      it("400: responds when date is not valid format", () => {
        return request(app)
          .post("/api/users-plants/1/tasks")
          .send({
            password: "password",
            task_slug: "water",
            task_start_date: "not-a-valid-date",
          })
          .expect(400)
          .then(({ body }) => {
            const { msg } = body;

            expect(msg).toBe("Invalid date");
          });
      });
    });
  });

  describe("/users-plants/:users_plant_id", () => {
    describe("GET", () => {
      it("200: responds with tasks for users_plant", () => {
        return request(app)
          .get("/api/users-plants/2")
          .send({
            password: "password2",
          })
          .expect(200)
          .then(({ body }) => {
            const { plant } = body;

            expect(plant).toMatchObject({
              username: "username2",
              users_plant_id: 2,
              plant_id: 4,
              tasks: [
                {
                  users_task_id: 1,
                  users_plant_id: 2,
                  task_slug: "water",
                  task_start_date: expect.any(String),
                },
                {
                  users_task_id: 2,
                  users_plant_id: 2,
                  task_slug: "water",
                  task_start_date: expect.any(String),
                },
                {
                  users_task_id: 3,
                  users_plant_id: 2,
                  task_slug: "fertilize",
                  task_start_date: expect.any(String),
                },
              ],
            });
          });
      });

      it("200: responds with a plant even with no tasks", () => {
        return request(app)
          .get("/api/users-plants/1")
          .send({
            password: "password",
          })
          .expect(200)
          .then(({ body }) => {
            const { plant } = body;

            expect(plant).toMatchObject({
              users_plant_id: 1,
              username: "username",
              plant_id: 10,
              planted_date: expect.any(String),
              tasks: [],
            });
          });
      });

      it("403: responds with forbidden if given invalid password", () => {
        return request(app)
          .get("/api/users-plants/2")
          .send({
            password: "password",
          })
          .expect(403);
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

    it('400: returns "Invalid plant id" when plant_id not a valid plant id', () => {
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
    describe("GET", () => {
      it("200: returns list of all plants for a single user ", () => {
        return request(app)
          .get("/api/users/username/plants")
          .send({ password: "password" })
          .expect(200)
          .then(({ body }) => {
            const { plants } = body;
            expect(plants).toMatchObject([
              {
                username: "username",
                plant_id: 10,
                users_plant_id: 1,
                planted_date: expect.any(String),
              },
              { username: "username", plant_id: 6, users_plant_id: 3 },
              { username: "username", plant_id: 1, users_plant_id: 4 },
              {
                username: "username",
                plant_id: 10,
                users_plant_id: 6,
                planted_date: expect.any(String),
              },
            ]);
          });
      });

      it("403: returns forbidden when incorrect password is provided for user", () => {
        return request(app)
          .get("/api/users/username/plants")
          .send({ password: "passwordd" })
          .expect(403);
      });
    });
  });

  describe("/add-subscription", () => {
    it("403: does not authorise creating a subscription for a user with incorrect credentials", () => {
      return request(app)
        .post("/add-subscription")
        .send({
          user: {
            username: "username",
            password: "password1",
          },
        })
        .expect(403);
    });
  });
});
