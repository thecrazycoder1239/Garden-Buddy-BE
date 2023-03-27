const request = require('supertest')
const { seed } = require('../db/seed')
const db = require('../db')
const app = require('../app')

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
    })
   })
});