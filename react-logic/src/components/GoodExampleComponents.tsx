import { useState, useEffect, FormEvent } from "react";
import TodoList from "../components/todo/list";
import { useTodos } from "../hooks/useTodos";
import { useSelected } from "../hooks/useSelected";

export default function GoodExample() {
  const [form, setForm] = useState({
    title: "",
  });
  const {
    selected,
    isSelected,
    toggle: toggleSelect,
    clear: clearSelect,
  } = useSelected();
  const { todos, search, fetch, add, remove, bulkDone, handleChangeSearch } =
    useTodos();

  useEffect(() => {
    fetch();
  }, []);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await add(form.title);
  };

  const handleDelete = async (id: number) => {
    await remove(id);
    alert("削除が完了しました");
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
              onChange={(e) => handleChangeSearch(e.target.value)}
            />
          </div>
          <div className="control">
            <button
              onClick={() => {
                bulkDone(selected);
                clearSelect();
              }}
            >
              Done All
            </button>
          </div>
        </div>
        <div className="list-content">
          <TodoList
            todos={todos}
            isSelected={isSelected}
            onSelect={toggleSelect}
            onDelete={handleDelete}
          />
        </div>
      </div>
    </div>
  );
}
