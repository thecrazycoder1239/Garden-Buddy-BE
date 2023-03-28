const request = require('supertest')
const { seed } = require('../db/seed')
const db = require('../db')
const app = require('../app')
const bcrypt = require('bcrypt')


beforeEach(() => {
  return seed();
})

afterAll(() => {
  db.end();
})


describe('app', () => {
  describe('/users', () => {
    describe('POST', () => {
      it('201: responds with user without password', () => {
        return request(app)
          .post('/api/users')
          .send({
            username: 'valid_username',
            password: 'password1',
            first_name: 'Foo',
            last_name: 'Bar'
          })
          .expect(201)
          .then(({ body }) => {
            const { user } = body;

            expect(user).toMatchObject({
              username: 'valid_username',
              first_name: 'Foo',
              last_name: 'Bar'
            });
            expect(user).not.toHaveProperty('password');
          })
      })
      it('201: adds hashed password to the database', () => {
        return request(app)
        .post('/api/users')
        .send({
          username: 'valid_username',
            password: 'password1',
            first_name: 'Foo',
            last_name: 'Bar'
        })
        .expect(201)
        .then(() => {
          return db.query(`
          SELECT hash FROM USERS
          WHERE username = 'valid_username'
          `)
        })
        .then(({rows}) => {
          const {hash} = rows[0];
          return bcrypt.compare('password1', hash)
        }).then((result) => {
          expect(result).toBe(true)
        })
      })
      it('409: returns error - "username already exists" when duplicate username', () => {
        return request(app)
        .post('/api/users')
        .send({
          username: 'valid_username',
            password: 'password1',
            first_name: 'Foo',
            last_name: 'Bar'
        })
        .then(() => {
          return request(app)
          .post('/api/users')
          .send({
            username: 'valid_username',
              password: 'password1',
              first_name: 'Foo',
              last_name: 'Bar'
            })
            .expect(409)
        })
        .then(({body}) => {
          const {msg} = body
          expect(msg).toBe("Username already exists!")
        })
      })
      it('400: returns an error message when field is too long',() => {
        return Promise.all(
          [{field: "username", maxLength: 30}, {field: "first_name" , maxLength: 30}, {field: "last_name" , maxLength: 50}]
          .map((userRestraints) => {
            const body = {
              username: 'valid_username',
                password: 'password1',
                first_name: 'Foo',
                last_name: 'Bar'
              };
              const {field, maxLength} = userRestraints
              body[field] = "a".repeat(51)
            return request(app)
            .post('/api/users')
            .send(
              body
            )
            .expect(400)
            .then(({body}) => {
              const {msg} = body;
              expect(msg).toBe(`${field} too long, maximum ${maxLength} characters`)
            })
          })
        )
      })
      it('400: returns missing field when not all fields are completed', () => {
        return request(app)
        .post('/api/users')
        .send({
          username: 'valid_username',
            password: 'password1',
            first_name: 'Foo'
        })
        .expect(400)
        .then(({body}) => {
          const {msg} = body;
          expect(msg).toBe("Missing required field")
        })
      })
    })
   })
});