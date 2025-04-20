import { describe, it, expect, vi, beforeEach } from "vitest";
import { TodoRepository } from "./repository";
import { Todo } from "./entity";

const mockClient = {
  get: vi.fn(),
  post: vi.fn(),
  patch: vi.fn(),
  delete: vi.fn(),
};

describe("Todo Repository", () => {
  const mockTodo: Todo = new Todo({
    id: 1,
    title: "Test Todo",
    done: false,
    createdAt: "2023-01-01",
    updatedAt: "2023-01-01",
  });

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("#fetchTodos", () => {
    it("todoのリストが返される", async () => {
      mockClient.get.mockResolvedValue({
        body: [mockTodo],
      });
      const repo = new TodoRepository(mockClient);

      const todos = await repo.fetch("");

      expect(todos).toEqual([mockTodo]);
    });
  });

  describe("#createTodo", () => {
    it("エラーなく実行される", async () => {
      const repo = new TodoRepository(mockClient);

      await repo.create("Test Todo");
      expect(true).toBe(true);
    });
  });

  describe("#bulkDone", () => {
    it("完了した Todo の id が返される", async () => {
      const ids = [1, 2, 3];
      const repo = new TodoRepository(mockClient);
      mockClient.patch.mockResolvedValue({
        body: {
          ids,
        },
      });

      const result = await repo.bulkDone(ids);

      expect(result).toEqual(ids);
    });
  });

  describe("#deleteTodo", () => {
    it("エラーなく実行される", async () => {
      const repo = new TodoRepository(mockClient);

      await repo.delete(1);

      expect(true).toBe(true);
    });
  });
});
