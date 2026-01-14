// グローバルで使い回す Prisma クライアントをインポート
import { prisma } from "~/server/utils/prisma";

// Nuxt3 の API エンドポイントを定義
export default defineEventHandler(async (event) => {
  // URL パラメータ（例: /api/todos/3 の「3」）を取得し、数値に変換
  const id = Number(getRouterParam(event, "id"));

  // 数字でないIDが渡された場合、400エラーを返す（バリデーション）
  if (isNaN(id)) {
    throw createError({ statusCode: 400, statusMessage: "Invalid ID" });
  }

  // Prisma を使って、指定されたIDのTodoを削除
  return await prisma.todo.delete({
    where: { id }, // idが一致するレコードを削除
  });
});