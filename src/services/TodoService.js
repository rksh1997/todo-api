import Todo from '../models/Todo';

export async function createTodo(data) {
  const todo = await Todo.create(data);
  return todo;
}
