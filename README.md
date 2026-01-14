# Nuxt 3 + Prisma 7 TODO App

Nuxt 3、Prisma 7、Element Plusを使用したシンプルなTODOアプリケーション。

## 技術スタック

- **Nuxt 3** - Vue 3フレームワーク
- **Prisma 7** - データベースORM（SQLite）
- **Element Plus** - UIコンポーネントライブラリ
- **Tailwind CSS** - CSSフレームワーク

## 特徴

このプロジェクトは **Prisma 7** の新しいアダプターパターンを採用しています。

- `@prisma/adapter-better-sqlite3` を使用したSQLite接続
- Prisma 7の「Rustフリー」アーキテクチャに対応
- `prisma.config.ts` による設定管理

## セットアップ

### 1. 依存関係のインストール

```bash
npm install
```

### 2. 環境変数の設定

`.env.example` をコピーして `.env` を作成：

```bash
cp .env.example .env
```

`.env` の内容：
```
DATABASE_URL="file:./prisma/dev.db"
```

### 3. Prismaのセットアップ

Prisma 7では、アダプターを使用してデータベースに接続します。

#### Prismaクライアントの生成

```bash
npx prisma generate
```

#### データベースのマイグレーション

```bash
npx prisma migrate dev
```

マイグレーションは既に `prisma/migrations/` に含まれています。

### 4. 開発サーバーの起動

```bash
npm run dev
```

http://localhost:3000 でアプリケーションが起動します。

## Prisma 7 の設定について

### アダプターパターン

Prisma 7では、データベースドライバーアダプターが必須です。

**server/utils/prisma.ts**:
```typescript
import { PrismaClient } from "@prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";

const adapter = new PrismaBetterSqlite3({
  url: process.env.DATABASE_URL || "file:./prisma/dev.db",
});

export const prisma = new PrismaClient({ adapter });
```

### スキーマファイル

**prisma/schema.prisma**:
```prisma
datasource db {
  provider = "sqlite"
  // Prisma 7では url を記載しない
}
```

### 設定ファイル

**prisma/prisma.config.ts**:
```typescript
export default {
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
}
```

## API エンドポイント

- `GET /api/todos` - TODO一覧取得
- `POST /api/todos/create` - TODO作成
- `DELETE /api/todos/:id` - TODO削除

## 本番ビルド

```bash
npm run build
npm run preview
```

## 参考リンク

- [Nuxt 3 Documentation](https://nuxt.com/docs)
- [Prisma 7 Upgrade Guide](https://www.prisma.io/docs/orm/more/upgrade-guides/upgrading-versions/upgrading-to-prisma-7)
- [Element Plus](https://element-plus.org/)
- [Tailwind CSS](https://tailwindcss.com/)
