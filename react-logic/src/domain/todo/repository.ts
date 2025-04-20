import HTTPClient from "../../lib/httpclient";
import { Todo, TodoParams } from "./entity";

let _client: HTTPClient;
const baseURL = "https://localhost:8000";

const client = () => {
  if (!_client) {
    _client = new HTTPClient(baseURL);
  }

  return _client;
};

export const fetchTodos = async (search: string): Promise<Todo[]> => {
  const response = await client().get<TodoParams[]>(`/todos?search=${search}`);
  return response.body.data.map((todo: any) => {
    return new Todo(todo);
  });
};

export const createTodo = async (title: string): Promise<void> => {
  await client().post<void>(`/todos`, { title });
};

export const bulkDone = async (ids: number[]): Promise<number[]> => {
  const response = await client().patch<number[]>(`/todos/bulk`, { ids });
  return response.body.data;
};

export const deleteTodo = async (id: number): Promise<void> => {
  await client().delete<void>(`/todos/${id}`);
};
