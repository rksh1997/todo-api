import Todo from '../models/Todo';

export async function getUserTodos(user) {
  const todos = await Todo.find({ user });
  return todos;
}

export async function createTodo(data) {
  const todo = await Todo.create(data);
  return todo;
}
