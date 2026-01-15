// グローバルで使い回す Prisma クライアントをインポート
import { Prisma } from "@prisma/client";
import { prisma } from "~/server/utils/prisma";

// Nuxt3 の API エンドポイントを定義
export default defineEventHandler(async (event) => {
  // URL パラメータ（例: /api/todos/3 の「3」）を取得し、数値に変換
  const id = Number(getRouterParam(event, "id"));

  // 数字でないIDが渡された場合、400エラーを返す（バリデーション）
  if (isNaN(id)) {
    throw createError({ statusCode: 400, statusMessage: "Invalid ID" });
  }

  // リクエストボディからタイトルを取得
  const body = await readBody<{ title?: unknown }>(event);
  const title = typeof body?.title === "string" ? body.title.trim() : "";
  if (!title) {
    throw createError({ statusCode: 400, statusMessage: "Invalid title" });
  }

  // Prisma を使って、指定されたIDのTodoを更新
  try {
    return await prisma.todo.update({
      where: { id }, // idが一致するレコードを更新
      data: { title }, // タイトルを更新
    });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2025"
    ) {
      throw createError({ statusCode: 404, statusMessage: "Todo not found" });
    }
    throw error;
  }
});
