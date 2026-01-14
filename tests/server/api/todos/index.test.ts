import { describe, it, expect, beforeEach } from "vitest";
import { prisma } from "~/server/utils/prisma";

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
      // 3つのTODOを作成
      await prisma.todo.create({ data: { title: "最初のTODO" } });
      await prisma.todo.create({ data: { title: "2番目のTODO" } });
      await prisma.todo.create({ data: { title: "3番目のTODO" } });

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
});
