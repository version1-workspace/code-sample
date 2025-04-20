import { Todo } from "../../domain/todo/entity";

type Props = {
  todos: Todo[];
  isSelected: (id: string) => boolean;
  onSelect: (id: string) => void;
  onDelete: (id: number) => void;
};

export default function List({ todos, isSelected, onSelect, onDelete }: Props) {
  return (
    <ul>
      {todos.map((todo) => (
        <li key={todo.id}>
          <div>
            <div>
              <input
                type="checkbox"
                checked={isSelected(todo.id.toString())}
                onClick={() => {
                  onSelect(todo.id.toString());
                }}
              />
            </div>
            <div>{todo.title}</div>
            <div>
              <button onClick={() => onDelete(todo.id)}>Delete</button>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}
