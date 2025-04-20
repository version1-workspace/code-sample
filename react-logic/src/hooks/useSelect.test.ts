/**
 * @vitest-environment jsdom
 */
import { vi, describe, it, expect } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { TodoRepository } from "../domain/todo/repository";
import { useSelect } from "./useSelect";

describe("useTodos", () => {
  describe("isSelected", () => {
    it("selected の内容によって true/false が返ること", async () => {
      const { result } = renderHook(() => useSelect());

      act(() => {
        const res = result.current.isSelected("1");
        expect(res).toBe(false);
      });

      act(() => {
        result.current.toggle("1");
      });

      expect(result.current.isSelected("1")).toBe(true);
    });
  });

  describe("toggle", () => {
    it("selected の内容がトグルされること", async () => {
      const { result } = renderHook(() => useSelect());

      act(() => {
        expect(result.current.isSelected("1")).toBe(false);
      });

      act(() => {
        result.current.toggle("1");
      });

      expect(result.current.isSelected("1")).toBe(true);

      act(() => {
        result.current.toggle("1");
      });

      expect(result.current.isSelected("1")).toBe(false);
    });
  });

  describe("clear", () => {
    it("selected の内容がクリアされること", async () => {
      const { result } = renderHook(() => useSelect());

      ["1", "2", "3"].forEach((item) => {
        act(() => {
          result.current.toggle(item);
        });
      });

      expect(result.current.selected).toEqual(["1", "2", "3"]);

      act(() => {
        result.current.clear();
      });

      expect(result.current.selected).toEqual([]);
    });
  });
});
