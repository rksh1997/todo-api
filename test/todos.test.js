import mongoose from 'mongoose';
import chai, { should } from 'chai';
import chaiHttp from 'chai-http';
import { OK, CREATED } from 'http-status';

import connectDB from '../src/db';
import app from '../src/app';
import User from '../src/models/User';
import Todo from '../src/models/Todo';

chai.use(chaiHttp);
chai.use(should);

let token;
let user;
describe('Todos', () => {
  before(async () => {
    await mongoose.disconnect();
    await connectDB();
    await Todo.deleteMany({});
    await User.deleteMany({});
    user = new User({ email: 'todo@todoapp.com', password: 'todoapp' });
    token = `Bearer ${await user.generateLoginToken()}`;
  });

  it('Should create a todo', async () => {
    const response = await chai
      .request(app)
      .post('/api/v1/todos')
      .set('Authorization', token)
      .send({
        title: 'Todo title',
        description: 'Todo description',
      });

    response.should.have.status(CREATED);
    response.body.response.todo.title.should.equal('Todo title');
    response.body.response.todo.user.should.equal(user.id);
  });

  it('Should list user todos', async () => {
    const response = await chai
      .request(app)
      .get('/api/v1/todos')
      .set('Authorization', token);

    response.should.have.status(OK);
    response.body.response.todos.should.be.a('array');
    response.body.response.todos.length.should.equal(1);
    response.body.response.todos[0].user.should.equal(user.id);
  });
});
