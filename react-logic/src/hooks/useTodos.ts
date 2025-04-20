import { useState } from "react";
import {
  fetchTodos,
  bulkDone,
  createTodo,
  deleteTodo,
} from "../domain/todo/repository";
import { Todo } from "../domain/todo/entity";

export function useTodos() {
  const [search, setSearch] = useState("");
  const [todos, setTodos] = useState<Todo[]>([]);

  const fetch = async () => {
    const todos = await fetchTodos(search);
    setTodos(todos);
  };

  const add = async (title: string) => {
    await createTodo(title);
    await fetch();
  };

  const doBulkDone = async (selected: string[]) => {
    const ids = selected.map((it) => Number(it));
    await bulkDone(ids);
    await fetch();
  };

  const remove = async (id: number) => {
    await deleteTodo(id);
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
