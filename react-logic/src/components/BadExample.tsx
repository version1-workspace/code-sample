import { useState, useEffect, FormEvent } from "react";
import { Todo } from "../domain/todo/entity";

export default function BadExample() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [selected, setSelected] = useState<Todo[]>([]);
  const [search, setSearch] = useState("");
  const [form, setForm] = useState({
    title: "",
  });

  useEffect(() => {
    fetch(`https://localhost:8000/todos?search=${search}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => setTodos(data));
  }, []);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    fetch("https://localhost:8000/todos", {
      method: "POST",
      body: JSON.stringify({ name: search }),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((body) => {
        setTodos([...todos, body.data]);
      });
  };

  const handleDelete = (id: number) => {
    fetch(`https://localhost:8000/todos/${id}`, {
      method: "DELETE",
    }).then(() => {
      fetch("https://localhost:8000/todos", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((res) => res.json())
        .then((body) => setTodos(body.data));
    });
    alert("削除が完了しました");
  };

  const handleBulkDone = () => {
    fetch(`https://localhost:8000/todos/bulk`, {
      method: "PATCH",
      body: JSON.stringify({ ids: selected.map((todo) => todo.id) }),
      headers: {
        "Content-Type": "application/json",
      },
    }).then(() => {
      alert("更新が完了しました");
      setTodos(
        todos.map((todo) => {
          if (selected.find((s) => s.id === todo.id)) {
            return { ...todo, done: true };
          }
          return todo;
        }),
      );

      setSelected([]);
    });
  };

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
            {todos
              .filter((todo) =>
                todo.title.toLowerCase().includes(search.toLowerCase()),
              )
              .map((todo) => (
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
