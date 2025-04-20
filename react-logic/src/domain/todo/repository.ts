import HTTPClient from "../../lib/httpclient";
import { Todo, TodoParams } from "./entity";

const baseURL = "https://localhost:8000";

export const createTodoRepository = () => {
  return new TodoRepository(new HTTPClient(baseURL));
};

interface Client {
  get: <O>(path: string) => Promise<{ body: O }>;
  post: <I, O>(path: string, data: I) => Promise<{ body: O }>;
  patch: <I, O>(path: string, data: I) => Promise<{ body: O }>;
  delete: <O>(path: string) => Promise<{ body: O }>;
}

export class TodoRepository {
  client: Client;
  constructor(client: Client) {
    this.client = client;
  }

  async fetch(search: string): Promise<Todo[]> {
    const response = await this.client.get<TodoParams[]>(
      `/todos?search=${search}`,
    );
    return response.body.map((todo: TodoParams) => {
      return new Todo(todo);
    });
  }

  async create(title: string): Promise<void> {
    await this.client.post<{ title: string }, void>(`/todos`, { title });
  }

  async bulkDone(ids: number[]): Promise<number[]> {
    const response = await this.client.patch<
      { ids: number[] },
      { ids: number[] }
    >(`/todos/bulk`, { ids });
    return response.body.ids;
  }

  async delete(id: number): Promise<void> {
    await this.client.delete<void>(`/todos/${id}`);
  }
}
