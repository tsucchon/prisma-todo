// グローバルで使い回される Prisma クライアントをインポート
import { prisma } from "~/server/utils/prisma";

// Nuxt3 の API エンドポイントを定義（POSTリクエストなどを受け付ける）
export default defineEventHandler(async (event) => {
  // クライアントから送られてきたリクエストのボディを読み取る
  // この中に { title: "xxx" } のようなデータが含まれている前提
  const body = await readBody(event);

  // Prisma を使って Todo テーブルに新しいレコードを作成する
  return await prisma.todo.create({
    data: {
      // クライアントから受け取ったタイトルをDBに保存
      title: body.title,
    },
  });
});