export interface TodoParams {
  id: number;
  title: string;
  done: boolean;
  createdAt: string;
  updatedAt: string;
}

export class Todo {
  id: number;
  title: string;
  done: boolean;
  createdAt: string;
  updatedAt: string;

  constructor({ id, title, done, createdAt, updatedAt }: TodoParams) {
    this.id = id;
    this.title = title;
    this.done = done;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }
}
