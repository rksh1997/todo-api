import chai, { should } from 'chai';
import chaiHttp from 'chai-http';
import { CREATED, CONFLICT, BAD_REQUEST } from 'http-status';

import connectDB from '../src/db';
import app from '../src/app';
import User from '../src/models/User';

chai.use(chaiHttp);
chai.use(should);

describe('Users', () => {
  before(async () => {
    await connectDB();
    await User.deleteMany({});
  });

  it('Should register new user with email and password', async () => {
    const response = await chai
      .request(app)
      .post('/api/v1/users/register/basic')
      .send({
        email: 'fake@gmail.com',
        password: 'fake1234',
      });

    response.should.have.status(CREATED);
  });

  it('Should not register user with already used email', async () => {
    const response = await chai
      .request(app)
      .post('/api/v1/users/register/basic')
      .send({
        email: 'fake@gmail.com',
        password: 'fake1234',
      });

    response.should.have.status(CONFLICT);
  });

  it('Should not register user with invalid email or password', async () => {
    const response = await chai
      .request(app)
      .post('/api/v1/users/register/basic')
      .send({
        email: 'fake.com',
        password: 'f',
      });

    response.should.have.status(BAD_REQUEST);
    response.body.response.email.should.be.a('array');
    response.body.response.password.should.be.a('array');
  });
});
