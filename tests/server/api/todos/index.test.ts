// @vitest-environment node
import { describe, it, expect, beforeEach } from "vitest";
import { setup, $fetch, fetch as testFetch } from "@nuxt/test-utils/e2e";
import { prisma } from "~/server/utils/prisma";

await setup({ rootDir: process.cwd() });

describe("TODO API", () => {
  beforeEach(async () => {
    // 各テスト前にデータベースをクリア
    await prisma.todo.deleteMany();
  });

  describe("GET /api/todos", () => {
    it("空の配列を返す", async () => {
      const todos = await prisma.todo.findMany();
      expect(todos).toEqual([]);
    });

    it("TODOリストを作成日時の降順で取得", async () => {
      const createdAt1 = new Date("2024-01-01T00:00:00.000Z");
      const createdAt2 = new Date("2024-01-02T00:00:00.000Z");
      const createdAt3 = new Date("2024-01-03T00:00:00.000Z");

      // 3つのTODOを作成
      await prisma.todo.create({
        data: { title: "最初のTODO", createdAt: createdAt1 },
      });
      await prisma.todo.create({
        data: { title: "2番目のTODO", createdAt: createdAt2 },
      });
      await prisma.todo.create({
        data: { title: "3番目のTODO", createdAt: createdAt3 },
      });

      const todos = await prisma.todo.findMany({
        orderBy: { createdAt: "desc" },
      });

      expect(todos).toHaveLength(3);
      expect(todos[0].title).toBe("3番目のTODO");
      expect(todos[2].title).toBe("最初のTODO");
    });
  });

  describe("POST /api/todos/create", () => {
    it("新しいTODOを作成", async () => {
      const newTodo = await prisma.todo.create({
        data: { title: "新しいタスク" },
      });

      expect(newTodo).toHaveProperty("id");
      expect(newTodo.title).toBe("新しいタスク");
      expect(newTodo).toHaveProperty("createdAt");
    });

    it("作成したTODOがデータベースに保存される", async () => {
      await prisma.todo.create({
        data: { title: "保存テスト" },
      });

      const todos = await prisma.todo.findMany();
      expect(todos).toHaveLength(1);
      expect(todos[0].title).toBe("保存テスト");
    });
  });

  describe("DELETE /api/todos/:id", () => {
    it("指定したIDのTODOを削除", async () => {
      const todo = await prisma.todo.create({
        data: { title: "削除予定のTODO" },
      });

      const deleted = await prisma.todo.delete({
        where: { id: todo.id },
      });

      expect(deleted.id).toBe(todo.id);
      expect(deleted.title).toBe("削除予定のTODO");

      const todos = await prisma.todo.findMany();
      expect(todos).toHaveLength(0);
    });

    it("存在しないIDを削除しようとするとエラー", async () => {
      await expect(
        prisma.todo.delete({ where: { id: 99999 } })
      ).rejects.toThrow();
    });
  });

  describe("PUT /api/todos/:id", () => {
    it("指定したIDのTODOを更新", async () => {
      const todo = await prisma.todo.create({
        data: { title: "更新前のTODO" },
      });

      const updated = await prisma.todo.update({
        where: { id: todo.id },
        data: { title: "更新後のTODO" },
      });

      expect(updated.id).toBe(todo.id);
      expect(updated.title).toBe("更新後のTODO");
      expect(updated.createdAt).toEqual(todo.createdAt);

      const todos = await prisma.todo.findMany();
      expect(todos).toHaveLength(1);
      expect(todos[0].title).toBe("更新後のTODO");
    });

    it("存在しないIDを更新しようとするとエラー", async () => {
      await expect(
        prisma.todo.update({
          where: { id: 99999 },
          data: { title: "存在しないTODO" },
        })
      ).rejects.toThrow();
    });
  });

  describe("PUT /api/todos/:id (API)", () => {
    it("API経由で指定したIDのTODOを更新", async () => {
      const todo = await prisma.todo.create({
        data: { title: "更新前のTODO" },
      });

      const updated = await $fetch(`/api/todos/${todo.id}`, {
        method: "PUT",
        body: { title: "更新後のTODO" },
      });

      expect(updated.id).toBe(todo.id);
      expect(updated.title).toBe("更新後のTODO");

      const stored = await prisma.todo.findUnique({
        where: { id: todo.id },
      });
      expect(stored?.title).toBe("更新後のTODO");
    });

    it("空のタイトルは400エラー", async () => {
      const todo = await prisma.todo.create({
        data: { title: "更新前のTODO" },
      });

      const response = await testFetch(`/api/todos/${todo.id}`, {
        method: "PUT",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ title: "   " }),
      });

      expect(response.status).toBe(400);
    });

    it("存在しないIDは404エラー", async () => {
      const response = await testFetch("/api/todos/99999", {
        method: "PUT",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ title: "更新後のTODO" }),
      });

      expect(response.status).toBe(404);
    });
  });
});
