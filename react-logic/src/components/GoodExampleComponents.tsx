import { useState, useEffect, FormEvent } from "react";
import { Todo } from "../models/todo";
import {
  fetchTodos,
  bulkDone,
  createTodo,
  deleteTodo,
} from "../domain/todo/repository";

export default function GoodExample() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [selected, setSelected] = useState<Todo[]>([]);
  const [search, setSearch] = useState("");
  const [form, setForm] = useState({
    title: "",
  });

  useEffect(() => {
    const init = async () => {
      const todos = await fetchTodos(search);
      setTodos(todos);
    };

    init();
  }, []);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await createTodo(form.title);
    const todos = await fetchTodos(search);
    setTodos(todos);
  };

  const handleBulkDone = async () => {
    await bulkDone(selected.map((todo) => todo.id));
    await fetchTodos(search);
    setSelected([]);
    alert("更新が完了しました");
  };

  const handleDelete = async (id: number) => {
    await deleteTodo(id);
    const todos = await fetchTodos(search);
    setTodos(todos);
    alert("削除が完了しました");
  };

  const filteredTodos = todos.filter((todo) =>
    todo.title.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div>
      <h1>Todo List</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={form.title}
          onChange={(e) => setForm({ title: e.target.value })}
        />
        <button type="submit">Add</button>
      </form>
      <div className="list">
        <div className="list-header">
          <div className="filter">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="control">
            <button onClick={handleBulkDone}>Done All</button>
          </div>
        </div>
        <div className="list-content">
          <ul>
            {filteredTodos.map((todo) => (
              <li key={todo.id}>
                <div>
                  <div>
                    <input
                      type="checkbox"
                      onClick={(e) => {
                        setSelected((prev) => {
                          if (e.currentTarget.checked) {
                            return [...prev, todo];
                          } else {
                            return prev.filter((t) => t.id !== todo.id);
                          }
                        });
                      }}
                    />
                  </div>
                  <div>{todo.title}</div>
                  <div>
                    <button onClick={() => handleDelete(todo.id)}>
                      Delete
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
