const databaseUrl =
  process.env.TEST_DATABASE_URL ||
  process.env.DATABASE_URL ||
  "file:./prisma/dev.db";

export default {
  datasource: {
    url: databaseUrl,
  },
};
