import { useState } from "react";
import { Todo } from "../domain/todo/entity";

export interface ITodoRepository {
  fetch: (search: string) => Promise<Todo[]>;
  create: (title: string) => Promise<void>;
  delete: (id: number) => Promise<void>;
  bulkDone: (ids: number[]) => Promise<number[]>;
}

export function useTodos(repo: ITodoRepository) {
  const [search, setSearch] = useState("");
  const [todos, setTodos] = useState<Todo[]>([]);

  const fetch = async () => {
    const todos = await repo.fetch(search);
    setTodos(todos);
  };

  const add = async (title: string) => {
    await repo.create(title);
    await fetch();
  };

  const doBulkDone = async (selected: string[]) => {
    const ids = selected.map((it) => Number(it));
    await repo.bulkDone(ids);
    await fetch();
  };

  const remove = async (id: number) => {
    await repo.delete(id);
    await fetch();
  };

  return {
    search,
    todos: todos.filter((todo) =>
      todo.title.toLowerCase().includes(search.toLowerCase()),
    ),
    handleChangeSearch: (value: string) => {
      setSearch(value);
    },
    fetch,
    add,
    bulkDone: doBulkDone,
    remove,
  };
}
