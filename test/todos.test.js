import mongoose from 'mongoose';
import chai, { should } from 'chai';
import chaiHttp from 'chai-http';
import { CREATED } from 'http-status';

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
});
