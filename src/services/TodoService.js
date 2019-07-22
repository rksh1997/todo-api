import Todo from '../models/Todo';

export const findById = _id => Todo.findOne({ _id });

export async function getUserTodos(user) {
  const todos = await Todo.find({ user });
  return todos;
}

export async function createTodo(data) {
  const todo = await Todo.create(data);
  return todo;
}

export async function updateById(id, update, options = {}) {
  const todo = await Todo.findByIdAndUpdate(id, update, {
    new: true,
    ...options,
  });
  return todo;
}
