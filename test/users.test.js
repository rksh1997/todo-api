import mongoose from 'mongoose';
import chai, { should, expect } from 'chai';
import chaiHttp from 'chai-http';
import {
  OK,
  UNAUTHORIZED,
  CREATED,
  CONFLICT,
  BAD_REQUEST,
  ACCEPTED,
} from 'http-status';

import connectDB from '../src/db';
import app from '../src/app';
import User from '../src/models/User';

chai.use(chaiHttp);
chai.use(should);

describe('Users', () => {
  before(async () => {
    await mongoose.disconnect();
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
    response.body.errors.email.should.be.a('array');
    response.body.errors.password.should.be.a('array');
  });

  it('Should not login unverified user with email and password', async () => {
    const response = await chai
      .request(app)
      .post('/api/v1/users/login/basic')
      .send({
        email: 'fake@gmail.com',
        password: 'fake1234',
      });

    response.should.have.status(UNAUTHORIZED);
  });

  it('Should not verify user email with wrong token', async () => {
    const response = await chai
      .request(app)
      .post('/api/v1/users/verify')
      .send({
        token: 'wrong-token',
      });

    response.should.have.status(UNAUTHORIZED);
  });

  it('Should verify user email', async () => {
    const { verificationToken } = await User.findOne({
      email: 'fake@gmail.com',
    });
    const response = await chai
      .request(app)
      .post('/api/v1/users/verify')
      .send({
        token: verificationToken,
      });

    response.should.have.status(ACCEPTED);
  });

  it('Should login verified user with email and password', async () => {
    const response = await chai
      .request(app)
      .post('/api/v1/users/login/basic')
      .send({
        email: 'fake@gmail.com',
        password: 'fake1234',
      });

    response.should.have.status(OK);
    response.body.response.user.email.should.equal('fake@gmail.com');
    expect(response.body.response.user.password).to.not.be.a('string');
    response.body.response.token.should.be.a('string');
  });

  it('Should not login with wrong email password', async () => {
    const response = await chai
      .request(app)
      .post('/api/v1/users/login/basic')
      .send({
        email: 'fake@gmail.com',
        password: 'fke1234',
      });

    response.should.have.status(UNAUTHORIZED);
    response.body.errors.form.should.be.a('array');
  });
});
