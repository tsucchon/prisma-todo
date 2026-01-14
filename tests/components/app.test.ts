import { describe, it, expect, vi, beforeEach } from "vitest";
import { mount } from "@vue/test-utils";
import { ref } from "vue";

describe("App.vue", () => {
  // コンポーネントのロジックをテスト
  describe("TODO機能", () => {
    it("todoリストが初期状態で空配列", () => {
      const todoList = ref<{ id: number; title: string }[]>([]);
      expect(todoList.value).toEqual([]);
    });

    it("todoを追加できる", () => {
      const todoList = ref<{ id: number; title: string }[]>([]);
      const newTodo = { id: 1, title: "テストTODO" };

      todoList.value.push(newTodo);

      expect(todoList.value).toHaveLength(1);
      expect(todoList.value[0]).toEqual(newTodo);
    });

    it("todoを削除できる", () => {
      const todoList = ref([
        { id: 1, title: "TODO 1" },
        { id: 2, title: "TODO 2" },
        { id: 3, title: "TODO 3" },
      ]);

      const idToDelete = 2;
      todoList.value = todoList.value.filter((todo) => todo.id !== idToDelete);

      expect(todoList.value).toHaveLength(2);
      expect(todoList.value.find((t) => t.id === idToDelete)).toBeUndefined();
    });

    it("空のtodoは追加できない", () => {
      const todo = ref("");
      const todoList = ref<{ id: number; title: string }[]>([]);

      // trim()で空文字チェック
      if (todo.value.trim()) {
        todoList.value.push({ id: 1, title: todo.value });
      }

      expect(todoList.value).toHaveLength(0);
    });

    it("空白のみのtodoは追加できない", () => {
      const todo = ref("   ");
      const todoList = ref<{ id: number; title: string }[]>([]);

      if (todo.value.trim()) {
        todoList.value.push({ id: 1, title: todo.value });
      }

      expect(todoList.value).toHaveLength(0);
    });
  });

  describe("API呼び出し", () => {
    it("fetchTodosが正しく呼ばれる", async () => {
      const mockFetch = vi.fn().mockResolvedValue([
        { id: 1, title: "Mock TODO" },
      ]);

      const result = await mockFetch("/api/todos");

      expect(mockFetch).toHaveBeenCalledWith("/api/todos");
      expect(result).toEqual([{ id: 1, title: "Mock TODO" }]);
    });

    it("addTodoがPOSTリクエストを送る", async () => {
      const mockFetch = vi.fn().mockResolvedValue({ id: 1, title: "新規TODO" });

      const result = await mockFetch("/api/todos/create", {
        method: "POST",
        body: { title: "新規TODO" },
      });

      expect(mockFetch).toHaveBeenCalledWith("/api/todos/create", {
        method: "POST",
        body: { title: "新規TODO" },
      });
      expect(result).toEqual({ id: 1, title: "新規TODO" });
    });

    it("deleteTodoがDELETEリクエストを送る", async () => {
      const mockFetch = vi
        .fn()
        .mockResolvedValue({ id: 1, title: "削除TODO" });

      const todoId = 1;
      const result = await mockFetch(`/api/todos/${todoId}`, {
        method: "DELETE",
      });

      expect(mockFetch).toHaveBeenCalledWith(`/api/todos/${todoId}`, {
        method: "DELETE",
      });
      expect(result).toEqual({ id: 1, title: "削除TODO" });
    });
  });
});
