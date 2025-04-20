/**
 * @vitest-environment jsdom
 */
import { vi, describe, it, expect } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { TodoRepository } from "../domain/todo/repository";
import { useTodos } from "./useTodos";

const mockClient = {
  get: vi.fn(),
  post: vi.fn(),
  patch: vi.fn(),
  delete: vi.fn(),
};

mockClient.get.mockResolvedValue({
  body: [
    {
      id: 1,
      title: "Test Todo",
      done: false,
      createdAt: "2023-01-01",
      updatedAt: "2023-01-01",
    },
  ],
});

describe("useTodos", () => {
  describe("fetch", () => {
    it("fetch 結果が todos に保存される", async () => {
      const repo = new TodoRepository(mockClient);
      const { result } = renderHook(() => useTodos(repo));

      await act(async () => {
        await result.current.fetch();
      });

      expect(result.current.todos).toEqual([
        {
          id: 1,
          title: "Test Todo",
          done: false,
          createdAt: "2023-01-01",
          updatedAt: "2023-01-01",
        },
      ]);
    });
  });

  describe("add", () => {
    it("期待されたメソッドがコールされる", async () => {
      const repo = new TodoRepository(mockClient);
      const { result } = renderHook(() => useTodos(repo));

      await act(async () => {
        await result.current.add("New Todo");
      });

      expect(mockClient.post).toHaveBeenCalledWith("/todos", {
        title: "New Todo",
      });
      expect(mockClient.get).toHaveBeenCalledWith("/todos?search=");
    });
  });

  describe("bulkDone", () => {
    it("期待されたメソッドがコールされる", async () => {
      const repo = new TodoRepository(mockClient);
      const selected = ["1", "2", "3"];
      mockClient.patch.mockResolvedValue({
        body: {
          ids: selected.map(Number),
        },
      });

      const { result } = renderHook(() => useTodos(repo));

      await act(async () => {
        await result.current.bulkDone(selected);
      });

      expect(mockClient.patch).toHaveBeenCalledWith("/todos/bulk", {
        ids: selected.map(Number),
      });
      expect(mockClient.get).toHaveBeenCalledWith("/todos?search=");
    });
  });

  describe("remove", () => {
    it("期待されたメソッドがコールされる", async () => {
      const repo = new TodoRepository(mockClient);
      const { result } = renderHook(() => useTodos(repo));

      await act(async () => {
        await result.current.remove(1);
      });

      expect(mockClient.delete).toHaveBeenCalledWith("/todos/1");
      expect(mockClient.get).toHaveBeenCalledWith("/todos?search=");
    });
  });

  describe("handleChangeSearch", () => {
    it("search が更新される", () => {
      const repo = new TodoRepository(mockClient);
      const { result } = renderHook(() => useTodos(repo));

      act(() => {
        result.current.handleChangeSearch("New Search");
      });

      expect(result.current.search).toBe("New Search");
    });
  });
});
