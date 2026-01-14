// グローバルで使い回す Prisma クライアントをインポート
import { prisma } from "~/server/utils/prisma";

// defineEventHandler は Nuxt3 の API エンドポイントを定義する関数
// この関数が呼ばれると、非同期でTodoの一覧を返す
export default defineEventHandler(async () => {
  // Prismaを使ってtodoテーブルのすべてのレコードを取得
  // createdAt（作成日時）の降順（新しい順）で並び替え
  return await prisma.todo.findMany({
    orderBy: {
      createdAt: "desc", // 日付が新しい順に表示
    },
  });
});